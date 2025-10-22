// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title BlockRightsVerification
 * @dev Smart contract untuk verifikasi hash dan kepemilikan karya seni
 * @author BlockRights Team
 */
contract BlockRightsVerification is Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;

    // Counter untuk verification ID
    Counters.Counter private _verificationIdCounter;
    
    // Struktur data untuk verification record
    struct VerificationRecord {
        string fileHash;
        address owner;
        string title;
        string description;
        string fileType;
        uint256 fileSize;
        uint256 createdAt;
        bool isVerified;
        string metadataURI;
    }
    
    // Mapping untuk menyimpan verification records
    mapping(uint256 => VerificationRecord) public verificationRecords;
    
    // Mapping untuk tracking hash ke verification ID
    mapping(string => uint256) public hashToVerification;
    
    // Mapping untuk tracking ownership history
    mapping(string => address[]) public ownershipHistory;
    
    // Platform fee untuk verifikasi (dalam wei)
    uint256 public verificationFee = 0.01 ether;
    
    // Events
    event VerificationCreated(
        uint256 indexed verificationId,
        string indexed fileHash,
        address indexed owner,
        string title
    );
    
    event VerificationUpdated(
        uint256 indexed verificationId,
        bool verified
    );
    
    event OwnershipTransferred(
        string indexed fileHash,
        address indexed from,
        address indexed to
    );
    
    event VerificationFeeUpdated(uint256 newFee);

    constructor() {}

    /**
     * @dev Buat verification record baru
     * @param fileHash SHA-256 hash dari file
     * @param title Judul karya
     * @param description Deskripsi karya
     * @param fileType Tipe file
     * @param fileSize Ukuran file dalam bytes
     * @param metadataURI URI metadata JSON
     */
    function createVerification(
        string memory fileHash,
        string memory title,
        string memory description,
        string memory fileType,
        uint256 fileSize,
        string memory metadataURI
    ) public payable {
        require(bytes(fileHash).length > 0, "File hash tidak boleh kosong");
        require(bytes(title).length > 0, "Title tidak boleh kosong");
        require(hashToVerification[fileHash] == 0, "Hash sudah terdaftar");
        require(msg.value >= verificationFee, "Pembayaran tidak cukup");

        _verificationIdCounter.increment();
        uint256 verificationId = _verificationIdCounter.current();

        verificationRecords[verificationId] = VerificationRecord({
            fileHash: fileHash,
            owner: msg.sender,
            title: title,
            description: description,
            fileType: fileType,
            fileSize: fileSize,
            createdAt: block.timestamp,
            isVerified: false,
            metadataURI: metadataURI
        });

        hashToVerification[fileHash] = verificationId;
        ownershipHistory[fileHash].push(msg.sender);

        // Kembalikan kelebihan pembayaran
        if (msg.value > verificationFee) {
            payable(msg.sender).transfer(msg.value - verificationFee);
        }

        emit VerificationCreated(verificationId, fileHash, msg.sender, title);
    }

    /**
     * @dev Verifikasi record oleh admin
     * @param verificationId ID verification
     * @param verified Status verifikasi
     */
    function verifyRecord(uint256 verificationId, bool verified) public onlyOwner {
        require(verificationId > 0 && verificationId <= _verificationIdCounter.current(), "Verification ID tidak valid");
        
        verificationRecords[verificationId].isVerified = verified;
        
        emit VerificationUpdated(verificationId, verified);
    }

    /**
     * @dev Transfer ownership verification record
     * @param fileHash Hash file yang akan ditransfer
     * @param newOwner Pemilik baru
     */
    function transferOwnership(string memory fileHash, address newOwner) public {
        uint256 verificationId = hashToVerification[fileHash];
        require(verificationId > 0, "Verification record tidak ditemukan");
        require(verificationRecords[verificationId].owner == msg.sender, "Bukan pemilik record");
        require(newOwner != address(0), "Alamat tidak valid");
        require(newOwner != msg.sender, "Tidak bisa transfer ke diri sendiri");

        address oldOwner = verificationRecords[verificationId].owner;
        verificationRecords[verificationId].owner = newOwner;
        ownershipHistory[fileHash].push(newOwner);

        emit OwnershipTransferred(fileHash, oldOwner, newOwner);
    }

    /**
     * @dev Get verification record by hash
     * @param fileHash Hash file
     */
    function getVerificationByHash(string memory fileHash) public view returns (VerificationRecord memory) {
        uint256 verificationId = hashToVerification[fileHash];
        require(verificationId > 0, "Verification record tidak ditemukan");
        return verificationRecords[verificationId];
    }

    /**
     * @dev Get verification record by ID
     * @param verificationId ID verification
     */
    function getVerificationById(uint256 verificationId) public view returns (VerificationRecord memory) {
        require(verificationId > 0 && verificationId <= _verificationIdCounter.current(), "Verification ID tidak valid");
        return verificationRecords[verificationId];
    }

    /**
     * @dev Get ownership history
     * @param fileHash Hash file
     */
    function getOwnershipHistory(string memory fileHash) public view returns (address[] memory) {
        return ownershipHistory[fileHash];
    }

    /**
     * @dev Check apakah hash sudah terdaftar
     * @param fileHash Hash file
     */
    function isHashRegistered(string memory fileHash) public view returns (bool) {
        return hashToVerification[fileHash] > 0;
    }

    /**
     * @dev Check apakah hash sudah diverifikasi
     * @param fileHash Hash file
     */
    function isHashVerified(string memory fileHash) public view returns (bool) {
        uint256 verificationId = hashToVerification[fileHash];
        if (verificationId == 0) return false;
        return verificationRecords[verificationId].isVerified;
    }

    /**
     * @dev Get pemilik hash
     * @param fileHash Hash file
     */
    function getHashOwner(string memory fileHash) public view returns (address) {
        uint256 verificationId = hashToVerification[fileHash];
        require(verificationId > 0, "Verification record tidak ditemukan");
        return verificationRecords[verificationId].owner;
    }

    /**
     * @dev Update verification fee
     * @param newFee Fee baru dalam wei
     */
    function setVerificationFee(uint256 newFee) public onlyOwner {
        verificationFee = newFee;
        emit VerificationFeeUpdated(newFee);
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
     * @dev Get total verifications count
     */
    function getTotalVerifications() public view returns (uint256) {
        return _verificationIdCounter.current();
    }

    /**
     * @dev Get verification fee
     */
    function getVerificationFee() public view returns (uint256) {
        return verificationFee;
    }
}
