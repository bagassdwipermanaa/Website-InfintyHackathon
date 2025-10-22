// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title BlockRightsNFT
 * @dev Smart contract untuk NFT marketplace BlockRights
 * @author BlockRights Team
 */
contract BlockRightsNFT is ERC721, ERC721URIStorage, Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;
    using Strings for uint256;

    // Counter untuk token ID
    Counters.Counter private _tokenIdCounter;
    
    // Struktur data untuk metadata artwork
    struct ArtworkMetadata {
        string title;
        string description;
        string artist;
        string fileHash; // SHA-256 hash dari file
        string fileType;
        uint256 fileSize;
        uint256 createdAt;
        bool isVerified;
        bool isForSale;
        uint256 price;
    }

    // Mapping untuk menyimpan metadata
    mapping(uint256 => ArtworkMetadata) public artworks;
    
    // Mapping untuk tracking ownership history
    mapping(uint256 => address[]) public ownershipHistory;
    
    // Mapping untuk royalty (dalam basis points, 100 = 1%)
    mapping(uint256 => uint256) public royalties;
    
    // Platform fee (dalam basis points)
    uint256 public platformFee = 250; // 2.5%
    
    // Events
    event ArtworkMinted(
        uint256 indexed tokenId,
        address indexed artist,
        string title,
        string fileHash
    );
    
    event ArtworkVerified(uint256 indexed tokenId, bool verified);
    
    event ArtworkListedForSale(
        uint256 indexed tokenId,
        uint256 price,
        address indexed seller
    );
    
    event ArtworkSold(
        uint256 indexed tokenId,
        address indexed buyer,
        address indexed seller,
        uint256 price
    );
    
    event OwnershipTransferred(
        uint256 indexed tokenId,
        address indexed from,
        address indexed to
    );

    constructor() ERC721("BlockRights NFT", "BRNFT") {}

    /**
     * @dev Mint NFT baru untuk artwork
     * @param to Alamat penerima NFT
     * @param metadata Metadata artwork
     * @param royalty Royalty untuk artist (dalam basis points)
     */
    function mintArtwork(
        address to,
        ArtworkMetadata memory metadata,
        uint256 royalty
    ) public onlyOwner returns (uint256) {
        require(bytes(metadata.title).length > 0, "Title tidak boleh kosong");
        require(bytes(metadata.fileHash).length > 0, "File hash tidak boleh kosong");
        require(royalty <= 1000, "Royalty tidak boleh lebih dari 10%");

        _tokenIdCounter.increment();
        uint256 tokenId = _tokenIdCounter.current();

        _safeMint(to, tokenId);
        
        // Simpan metadata
        artworks[tokenId] = metadata;
        royalties[tokenId] = royalty;
        
        // Tambahkan ke ownership history
        ownershipHistory[tokenId].push(to);

        emit ArtworkMinted(tokenId, to, metadata.title, metadata.fileHash);
        
        return tokenId;
    }

    /**
     * @dev Set URI untuk token
     */
    function setTokenURI(uint256 tokenId, string memory tokenURI) public onlyOwner {
        _setTokenURI(tokenId, tokenURI);
    }

    /**
     * @dev Verifikasi artwork oleh admin
     */
    function verifyArtwork(uint256 tokenId, bool verified) public onlyOwner {
        require(_exists(tokenId), "Token tidak ada");
        artworks[tokenId].isVerified = verified;
        
        emit ArtworkVerified(tokenId, verified);
    }

    /**
     * @dev List artwork untuk dijual
     */
    function listForSale(uint256 tokenId, uint256 price) public {
        require(_exists(tokenId), "Token tidak ada");
        require(ownerOf(tokenId) == msg.sender, "Bukan pemilik token");
        require(price > 0, "Harga harus lebih dari 0");
        require(artworks[tokenId].isVerified, "Artwork belum diverifikasi");

        artworks[tokenId].isForSale = true;
        artworks[tokenId].price = price;

        emit ArtworkListedForSale(tokenId, price, msg.sender);
    }

    /**
     * @dev Beli artwork
     */
    function buyArtwork(uint256 tokenId) public payable nonReentrant {
        require(_exists(tokenId), "Token tidak ada");
        require(artworks[tokenId].isForSale, "Artwork tidak dijual");
        require(msg.value >= artworks[tokenId].price, "Pembayaran tidak cukup");
        require(ownerOf(tokenId) != msg.sender, "Tidak bisa membeli sendiri");

        address seller = ownerOf(tokenId);
        uint256 price = artworks[tokenId].price;
        uint256 royaltyAmount = (price * royalties[tokenId]) / 10000;
        uint256 platformFeeAmount = (price * platformFee) / 10000;
        uint256 sellerAmount = price - royaltyAmount - platformFeeAmount;

        // Transfer NFT
        _transfer(seller, msg.sender, tokenId);
        
        // Update metadata
        artworks[tokenId].isForSale = false;
        artworks[tokenId].price = 0;
        
        // Tambahkan ke ownership history
        ownershipHistory[tokenId].push(msg.sender);

        // Transfer pembayaran
        if (royaltyAmount > 0) {
            payable(owner()).transfer(royaltyAmount); // Royalty ke platform untuk artist
        }
        if (platformFeeAmount > 0) {
            payable(owner()).transfer(platformFeeAmount); // Platform fee
        }
        payable(seller).transfer(sellerAmount);

        emit ArtworkSold(tokenId, msg.sender, seller, price);
    }

    /**
     * @dev Cancel listing
     */
    function cancelListing(uint256 tokenId) public {
        require(_exists(tokenId), "Token tidak ada");
        require(ownerOf(tokenId) == msg.sender, "Bukan pemilik token");
        require(artworks[tokenId].isForSale, "Artwork tidak dijual");

        artworks[tokenId].isForSale = false;
        artworks[tokenId].price = 0;
    }

    /**
     * @dev Transfer dengan tracking history
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
        
        if (from != address(0) && to != address(0)) {
            ownershipHistory[tokenId].push(to);
            emit OwnershipTransferred(tokenId, from, to);
        }
    }

    /**
     * @dev Get artwork metadata
     */
    function getArtworkMetadata(uint256 tokenId) public view returns (ArtworkMetadata memory) {
        require(_exists(tokenId), "Token tidak ada");
        return artworks[tokenId];
    }

    /**
     * @dev Get ownership history
     */
    function getOwnershipHistory(uint256 tokenId) public view returns (address[] memory) {
        require(_exists(tokenId), "Token tidak ada");
        return ownershipHistory[tokenId];
    }

    /**
     * @dev Get total supply
     */
    function totalSupply() public view returns (uint256) {
        return _tokenIdCounter.current();
    }

    /**
     * @dev Update platform fee
     */
    function setPlatformFee(uint256 newFee) public onlyOwner {
        require(newFee <= 1000, "Fee tidak boleh lebih dari 10%");
        platformFee = newFee;
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
     * @dev Override untuk mendukung interface
     */
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
