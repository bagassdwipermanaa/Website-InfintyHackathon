// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./BlockRightsNFT.sol";

/**
 * @title BlockRightsMarketplace
 * @dev Smart contract untuk marketplace NFT BlockRights
 * @author BlockRights Team
 */
contract BlockRightsMarketplace is Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;

    // Reference ke NFT contract
    BlockRightsNFT public nftContract;
    
    // Counter untuk listing ID
    Counters.Counter private _listingIdCounter;
    
    // Struktur data untuk listing
    struct Listing {
        uint256 tokenId;
        address seller;
        uint256 price;
        bool isActive;
        uint256 createdAt;
        uint256 expiresAt;
    }
    
    // Mapping untuk menyimpan listings
    mapping(uint256 => Listing) public listings;
    
    // Mapping untuk tracking listing per token
    mapping(uint256 => uint256) public tokenToListing;
    
    // Platform fee (dalam basis points)
    uint256 public platformFee = 250; // 2.5%
    
    // Minimum listing duration (dalam detik)
    uint256 public minListingDuration = 86400; // 1 hari
    
    // Maximum listing duration (dalam detik)
    uint256 public maxListingDuration = 31536000; // 1 tahun
    
    // Events
    event ListingCreated(
        uint256 indexed listingId,
        uint256 indexed tokenId,
        address indexed seller,
        uint256 price,
        uint256 expiresAt
    );
    
    event ListingUpdated(
        uint256 indexed listingId,
        uint256 newPrice,
        uint256 newExpiresAt
    );
    
    event ListingCancelled(uint256 indexed listingId);
    
    event ItemSold(
        uint256 indexed listingId,
        uint256 indexed tokenId,
        address indexed buyer,
        address seller,
        uint256 price
    );
    
    event PlatformFeeUpdated(uint256 newFee);

    constructor(address _nftContract) {
        nftContract = BlockRightsNFT(_nftContract);
    }

    /**
     * @dev Buat listing baru untuk NFT
     * @param tokenId ID token NFT
     * @param price Harga dalam wei
     * @param duration Durasi listing dalam detik
     */
    function createListing(
        uint256 tokenId,
        uint256 price,
        uint256 duration
    ) public {
        require(nftContract.ownerOf(tokenId) == msg.sender, "Bukan pemilik NFT");
        require(price > 0, "Harga harus lebih dari 0");
        require(duration >= minListingDuration, "Durasi terlalu pendek");
        require(duration <= maxListingDuration, "Durasi terlalu panjang");
        require(tokenToListing[tokenId] == 0, "NFT sudah terdaftar");
        
        // Verifikasi bahwa NFT sudah diverifikasi
        BlockRightsNFT.ArtworkMetadata memory metadata = nftContract.getArtworkMetadata(tokenId);
        require(metadata.isVerified, "NFT belum diverifikasi");

        _listingIdCounter.increment();
        uint256 listingId = _listingIdCounter.current();
        
        uint256 expiresAt = block.timestamp + duration;
        
        listings[listingId] = Listing({
            tokenId: tokenId,
            seller: msg.sender,
            price: price,
            isActive: true,
            createdAt: block.timestamp,
            expiresAt: expiresAt
        });
        
        tokenToListing[tokenId] = listingId;
        
        emit ListingCreated(listingId, tokenId, msg.sender, price, expiresAt);
    }

    /**
     * @dev Update listing yang sudah ada
     * @param listingId ID listing
     * @param newPrice Harga baru
     * @param newDuration Durasi baru (opsional, 0 = tidak berubah)
     */
    function updateListing(
        uint256 listingId,
        uint256 newPrice,
        uint256 newDuration
    ) public {
        Listing storage listing = listings[listingId];
        require(listing.isActive, "Listing tidak aktif");
        require(listing.seller == msg.sender, "Bukan pemilik listing");
        require(block.timestamp < listing.expiresAt, "Listing sudah expired");
        require(newPrice > 0, "Harga harus lebih dari 0");
        
        listing.price = newPrice;
        
        if (newDuration > 0) {
            require(newDuration >= minListingDuration, "Durasi terlalu pendek");
            require(newDuration <= maxListingDuration, "Durasi terlalu panjang");
            listing.expiresAt = block.timestamp + newDuration;
        }
        
        emit ListingUpdated(listingId, newPrice, listing.expiresAt);
    }

    /**
     * @dev Cancel listing
     * @param listingId ID listing
     */
    function cancelListing(uint256 listingId) public {
        Listing storage listing = listings[listingId];
        require(listing.isActive, "Listing tidak aktif");
        require(listing.seller == msg.sender, "Bukan pemilik listing");
        
        listing.isActive = false;
        tokenToListing[listing.tokenId] = 0;
        
        emit ListingCancelled(listingId);
    }

    /**
     * @dev Beli NFT dari marketplace
     * @param listingId ID listing
     */
    function buyItem(uint256 listingId) public payable nonReentrant {
        Listing storage listing = listings[listingId];
        require(listing.isActive, "Listing tidak aktif");
        require(block.timestamp < listing.expiresAt, "Listing sudah expired");
        require(msg.value >= listing.price, "Pembayaran tidak cukup");
        require(msg.sender != listing.seller, "Tidak bisa membeli sendiri");
        
        // Verifikasi ownership masih valid
        require(nftContract.ownerOf(listing.tokenId) == listing.seller, "Seller bukan pemilik NFT");

        // Hitung fee
        uint256 platformFeeAmount = (listing.price * platformFee) / 10000;
        uint256 sellerAmount = listing.price - platformFeeAmount;

        // Update listing
        listing.isActive = false;
        tokenToListing[listing.tokenId] = 0;

        // Transfer NFT
        nftContract.transferFrom(listing.seller, msg.sender, listing.tokenId);

        // Transfer pembayaran
        if (platformFeeAmount > 0) {
            payable(owner()).transfer(platformFeeAmount);
        }
        payable(listing.seller).transfer(sellerAmount);

        // Kembalikan kelebihan pembayaran
        if (msg.value > listing.price) {
            payable(msg.sender).transfer(msg.value - listing.price);
        }

        emit ItemSold(listingId, listing.tokenId, msg.sender, listing.seller, listing.price);
    }

    /**
     * @dev Get listing details
     * @param listingId ID listing
     */
    function getListing(uint256 listingId) public view returns (Listing memory) {
        return listings[listingId];
    }

    /**
     * @dev Get listing ID untuk token
     * @param tokenId ID token NFT
     */
    function getListingByToken(uint256 tokenId) public view returns (uint256) {
        return tokenToListing[tokenId];
    }

    /**
     * @dev Get semua listing aktif
     * @param offset Offset untuk pagination
     * @param limit Limit untuk pagination
     */
    function getActiveListings(uint256 offset, uint256 limit) public view returns (Listing[] memory) {
        uint256 totalListings = _listingIdCounter.current();
        uint256 activeCount = 0;
        
        // Hitung jumlah listing aktif
        for (uint256 i = 1; i <= totalListings; i++) {
            if (listings[i].isActive && block.timestamp < listings[i].expiresAt) {
                activeCount++;
            }
        }
        
        // Hitung ukuran array yang dibutuhkan
        uint256 resultSize = activeCount > offset ? activeCount - offset : 0;
        if (resultSize > limit) {
            resultSize = limit;
        }
        
        Listing[] memory result = new Listing[](resultSize);
        uint256 currentIndex = 0;
        uint256 addedCount = 0;
        
        // Isi array dengan listing aktif
        for (uint256 i = 1; i <= totalListings && addedCount < resultSize; i++) {
            if (listings[i].isActive && block.timestamp < listings[i].expiresAt) {
                if (currentIndex >= offset) {
                    result[addedCount] = listings[i];
                    addedCount++;
                }
                currentIndex++;
            }
        }
        
        return result;
    }

    /**
     * @dev Update platform fee
     * @param newFee Fee baru dalam basis points
     */
    function setPlatformFee(uint256 newFee) public onlyOwner {
        require(newFee <= 1000, "Fee tidak boleh lebih dari 10%");
        platformFee = newFee;
        emit PlatformFeeUpdated(newFee);
    }

    /**
     * @dev Update listing duration limits
     * @param minDuration Durasi minimum dalam detik
     * @param maxDuration Durasi maksimum dalam detik
     */
    function setListingDurationLimits(uint256 minDuration, uint256 maxDuration) public onlyOwner {
        require(minDuration > 0, "Durasi minimum harus lebih dari 0");
        require(maxDuration > minDuration, "Durasi maksimum harus lebih dari minimum");
        minListingDuration = minDuration;
        maxListingDuration = maxDuration;
    }

    /**
     * @dev Withdraw platform funds
     */
    function withdrawFunds() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "Tidak ada dana untuk ditarik");
        payable(owner()).transfer(balance);
    }

    /**
     * @dev Get total listings count
     */
    function getTotalListings() public view returns (uint256) {
        return _listingIdCounter.current();
    }

    /**
     * @dev Check apakah listing masih aktif
     * @param listingId ID listing
     */
    function isListingActive(uint256 listingId) public view returns (bool) {
        Listing memory listing = listings[listingId];
        return listing.isActive && block.timestamp < listing.expiresAt;
    }
}
