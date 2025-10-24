// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title BlockRightsNFT
 * @dev NFT contract untuk karya seni dengan sistem royalty dan verifikasi
 * @author BlockRights Team
 */
contract BlockRightsNFT is ERC721, ERC721URIStorage, Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;
    
    Counters.Counter private _tokenIdCounter;
    
    // Struktur untuk menyimpan informasi karya seni
    struct ArtworkInfo {
        address creator;
        string title;
        string description;
        string category;
        uint256 royaltyPercentage;
        bool isVerified;
        uint256 createdAt;
        string hash; // Hash untuk verifikasi keaslian
    }
    
    // Mapping untuk menyimpan informasi karya seni
    mapping(uint256 => ArtworkInfo) public artworks;
    
    // Mapping untuk melacak hash yang sudah digunakan
    mapping(string => bool) public usedHashes;
    
    // Event untuk logging
    event ArtworkMinted(
        uint256 indexed tokenId,
        address indexed creator,
        string title,
        string hash
    );
    
    event ArtworkVerified(uint256 indexed tokenId, bool verified);
    
    constructor() ERC721("BlockRights NFT", "BRNFT") {}
    
    /**
     * @dev Mint NFT baru untuk karya seni
     * @param to Alamat penerima NFT
     * @param title Judul karya
     * @param description Deskripsi karya
     * @param category Kategori karya
     * @param royaltyPercentage Persentase royalty (0-100)
     * @param hash Hash untuk verifikasi keaslian
     * @param uri URI metadata NFT
     */
    function mintArtwork(
        address to,
        string memory title,
        string memory description,
        string memory category,
        uint256 royaltyPercentage,
        string memory hash,
        string memory uri
    ) public onlyOwner nonReentrant returns (uint256) {
        require(bytes(hash).length > 0, "Hash tidak boleh kosong");
        require(!usedHashes[hash], "Hash sudah digunakan");
        require(royaltyPercentage <= 100, "Royalty tidak boleh lebih dari 100%");
        
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        
        // Simpan informasi karya seni
        artworks[tokenId] = ArtworkInfo({
            creator: to,
            title: title,
            description: description,
            category: category,
            royaltyPercentage: royaltyPercentage,
            isVerified: false,
            createdAt: block.timestamp,
            hash: hash
        });
        
        usedHashes[hash] = true;
        
        emit ArtworkMinted(tokenId, to, title, hash);
        
        return tokenId;
    }
    
    /**
     * @dev Verifikasi karya seni (hanya owner)
     */
    function verifyArtwork(uint256 tokenId, bool verified) public onlyOwner {
        require(_exists(tokenId), "Token tidak ada");
        artworks[tokenId].isVerified = verified;
        emit ArtworkVerified(tokenId, verified);
    }
    
    /**
     * @dev Mendapatkan informasi karya seni
     */
    function getArtworkInfo(uint256 tokenId) public view returns (ArtworkInfo memory) {
        require(_exists(tokenId), "Token tidak ada");
        return artworks[tokenId];
    }
    
    /**
     * @dev Mendapatkan royalty percentage
     */
    function getRoyaltyPercentage(uint256 tokenId) public view returns (uint256) {
        require(_exists(tokenId), "Token tidak ada");
        return artworks[tokenId].royaltyPercentage;
    }
    
    /**
     * @dev Override untuk menambahkan informasi tambahan
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }
    
    // Override functions
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }
    
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
    
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
