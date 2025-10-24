// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "./BlockRightsNFT.sol";

/**
 * @title BlockRightsMarketplace
 * @dev Marketplace contract untuk trading NFT dengan sistem royalty
 * @author BlockRights Team
 */
contract BlockRightsMarketplace is ReentrancyGuard, Ownable, ERC721Holder {
    
    // Struktur untuk listing NFT
    struct Listing {
        address seller;
        address nftContract;
        uint256 tokenId;
        uint256 price;
        bool isActive;
        uint256 createdAt;
    }
    
    // Mapping untuk menyimpan listing
    mapping(uint256 => Listing) public listings;
    uint256 public listingCounter;
    
    // Fee marketplace (dalam basis points, 250 = 2.5%)
    uint256 public marketplaceFee = 250;
    
    // Event untuk logging
    event NFTListed(
        uint256 indexed listingId,
        address indexed seller,
        address indexed nftContract,
        uint256 tokenId,
        uint256 price
    );
    
    event NFTSold(
        uint256 indexed listingId,
        address indexed buyer,
        address indexed seller,
        uint256 price,
        uint256 royaltyAmount
    );
    
    event ListingCancelled(uint256 indexed listingId);
    
    /**
     * @dev List NFT untuk dijual
     */
    function listNFT(
        address nftContract,
        uint256 tokenId,
        uint256 price
    ) public nonReentrant returns (uint256) {
        require(price > 0, "Harga harus lebih dari 0");
        require(
            IERC721(nftContract).ownerOf(tokenId) == msg.sender,
            "Anda bukan pemilik NFT ini"
        );
        require(
            IERC721(nftContract).isApprovedForAll(msg.sender, address(this)) ||
            IERC721(nftContract).getApproved(tokenId) == address(this),
            "Marketplace belum diizinkan untuk NFT ini"
        );
        
        uint256 listingId = listingCounter;
        listingCounter++;
        
        listings[listingId] = Listing({
            seller: msg.sender,
            nftContract: nftContract,
            tokenId: tokenId,
            price: price,
            isActive: true,
            createdAt: block.timestamp
        });
        
        emit NFTListed(listingId, msg.sender, nftContract, tokenId, price);
        
        return listingId;
    }
    
    /**
     * @dev Beli NFT dari marketplace
     */
    function buyNFT(uint256 listingId) public payable nonReentrant {
        Listing storage listing = listings[listingId];
        require(listing.isActive, "Listing tidak aktif");
        require(msg.value >= listing.price, "Pembayaran tidak cukup");
        require(msg.sender != listing.seller, "Tidak bisa membeli NFT sendiri");
        
        // Transfer NFT dari seller ke buyer
        IERC721(listing.nftContract).safeTransferFrom(
            listing.seller,
            msg.sender,
            listing.tokenId
        );
        
        // Hitung fee dan royalty
        uint256 marketplaceFeeAmount = (listing.price * marketplaceFee) / 10000;
        uint256 royaltyAmount = 0;
        
        // Hitung royalty jika NFT adalah BlockRightsNFT
        if (listing.nftContract == address(this)) {
            BlockRightsNFT nftContract = BlockRightsNFT(listing.nftContract);
            uint256 royaltyPercentage = nftContract.getRoyaltyPercentage(listing.tokenId);
            if (royaltyPercentage > 0) {
                royaltyAmount = (listing.price * royaltyPercentage) / 10000;
            }
        }
        
        uint256 sellerAmount = listing.price - marketplaceFeeAmount - royaltyAmount;
        
        // Transfer pembayaran
        payable(listing.seller).transfer(sellerAmount);
        
        // Transfer royalty ke creator jika ada
        if (royaltyAmount > 0) {
            BlockRightsNFT nftContract = BlockRightsNFT(listing.nftContract);
            address creator = nftContract.getArtworkInfo(listing.tokenId).creator;
            payable(creator).transfer(royaltyAmount);
        }
        
        // Deaktifkan listing
        listing.isActive = false;
        
        emit NFTSold(
            listingId,
            msg.sender,
            listing.seller,
            listing.price,
            royaltyAmount
        );
    }
    
    /**
     * @dev Batalkan listing
     */
    function cancelListing(uint256 listingId) public {
        Listing storage listing = listings[listingId];
        require(listing.isActive, "Listing tidak aktif");
        require(
            msg.sender == listing.seller || msg.sender == owner(),
            "Tidak memiliki izin untuk membatalkan"
        );
        
        listing.isActive = false;
        emit ListingCancelled(listingId);
    }
    
    /**
     * @dev Update harga listing
     */
    function updateListingPrice(uint256 listingId, uint256 newPrice) public {
        Listing storage listing = listings[listingId];
        require(listing.isActive, "Listing tidak aktif");
        require(msg.sender == listing.seller, "Hanya seller yang bisa update harga");
        require(newPrice > 0, "Harga harus lebih dari 0");
        
        listing.price = newPrice;
    }
    
    /**
     * @dev Set marketplace fee (hanya owner)
     */
    function setMarketplaceFee(uint256 newFee) public onlyOwner {
        require(newFee <= 1000, "Fee tidak boleh lebih dari 10%");
        marketplaceFee = newFee;
    }
    
    /**
     * @dev Withdraw fee marketplace (hanya owner)
     */
    function withdrawFees() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "Tidak ada fee untuk diwithdraw");
        payable(owner()).transfer(balance);
    }
    
    /**
     * @dev Mendapatkan informasi listing
     */
    function getListing(uint256 listingId) public view returns (Listing memory) {
        return listings[listingId];
    }
    
    /**
     * @dev Mendapatkan semua listing aktif
     */
    function getActiveListings() public view returns (uint256[] memory) {
        uint256[] memory activeListings = new uint256[](listingCounter);
        uint256 count = 0;
        
        for (uint256 i = 0; i < listingCounter; i++) {
            if (listings[i].isActive) {
                activeListings[count] = i;
                count++;
            }
        }
        
        return activeListings;
    }
}
