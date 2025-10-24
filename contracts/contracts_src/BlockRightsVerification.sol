// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title BlockRightsVerification
 * @dev Contract untuk verifikasi keaslian karya seni menggunakan hash
 * @author BlockRights Team
 */
contract BlockRightsVerification is Ownable, ReentrancyGuard {
    
    // Struktur untuk menyimpan informasi verifikasi
    struct VerificationRecord {
        string hash;
        address verifier;
        bool isVerified;
        uint256 verifiedAt;
        string metadata;
    }
    
    // Mapping untuk menyimpan record verifikasi
    mapping(string => VerificationRecord) public verifications;
    
    // Mapping untuk melacak hash yang sudah diverifikasi
    mapping(string => bool) public verifiedHashes;
    
    // Event untuk logging
    event HashVerified(
        string indexed hash,
        address indexed verifier,
        bool verified,
        string metadata
    );
    
    event HashRegistered(
        string indexed hash,
        address indexed registrant,
        string metadata
    );
    
    /**
     * @dev Registrasi hash untuk verifikasi
     */
    function registerHash(
        string memory hash,
        string memory metadata
    ) public {
        require(bytes(hash).length > 0, "Hash tidak boleh kosong");
        require(!verifiedHashes[hash], "Hash sudah terdaftar");
        
        verifications[hash] = VerificationRecord({
            hash: hash,
            verifier: msg.sender,
            isVerified: false,
            verifiedAt: 0,
            metadata: metadata
        });
        
        emit HashRegistered(hash, msg.sender, metadata);
    }
    
    /**
     * @dev Verifikasi hash (hanya owner)
     */
    function verifyHash(
        string memory hash,
        bool verified
    ) public onlyOwner {
        require(bytes(hash).length > 0, "Hash tidak boleh kosong");
        require(verifications[hash].verifier != address(0), "Hash belum terdaftar");
        
        verifications[hash].isVerified = verified;
        verifications[hash].verifiedAt = block.timestamp;
        verifiedHashes[hash] = verified;
        
        emit HashVerified(hash, verifications[hash].verifier, verified, verifications[hash].metadata);
    }
    
    /**
     * @dev Cek status verifikasi hash
     */
    function isHashVerified(string memory hash) public view returns (bool) {
        return verifiedHashes[hash] && verifications[hash].isVerified;
    }
    
    /**
     * @dev Mendapatkan informasi verifikasi
     */
    function getVerificationInfo(string memory hash) public view returns (VerificationRecord memory) {
        return verifications[hash];
    }
    
    /**
     * @dev Batch verifikasi (hanya owner)
     */
    function batchVerifyHashes(
        string[] memory hashes,
        bool[] memory verified
    ) public onlyOwner {
        require(hashes.length == verified.length, "Array length tidak sama");
        
        for (uint256 i = 0; i < hashes.length; i++) {
            if (bytes(hashes[i]).length > 0 && verifications[hashes[i]].verifier != address(0)) {
                verifications[hashes[i]].isVerified = verified[i];
                verifications[hashes[i]].verifiedAt = block.timestamp;
                verifiedHashes[hashes[i]] = verified[i];
                
                emit HashVerified(
                    hashes[i],
                    verifications[hashes[i]].verifier,
                    verified[i],
                    verifications[hashes[i]].metadata
                );
            }
        }
    }
}
