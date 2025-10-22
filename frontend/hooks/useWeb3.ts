"use client";

import React, { useState, useEffect, createContext, useContext } from 'react';

// Web3 Types
interface Web3ContextType {
  isConnected: boolean;
  account: string | null;
  chainId: number | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  switchToBSC: () => Promise<void>;
  contractAddresses: {
    nft: string;
    marketplace: string;
    verification: string;
  };
}

// Contract ABI (Application Binary Interface)
const NFT_ABI = [
  "function mintArtwork(address to, tuple(string title, string description, string artist, string fileHash, string fileType, uint256 fileSize, uint256 createdAt, bool isVerified, bool isForSale, uint256 price) metadata, uint256 royalty) external returns (uint256)",
  "function verifyArtwork(uint256 tokenId, bool verified) external",
  "function listForSale(uint256 tokenId, uint256 price) external",
  "function buyArtwork(uint256 tokenId) external payable",
  "function ownerOf(uint256 tokenId) external view returns (address)",
  "function getArtworkMetadata(uint256 tokenId) external view returns (tuple(string title, string description, string artist, string fileHash, string fileType, uint256 fileSize, uint256 createdAt, bool isVerified, bool isForSale, uint256 price))",
  "function totalSupply() external view returns (uint256)",
  "event ArtworkMinted(uint256 indexed tokenId, address indexed artist, string title, string fileHash)",
  "event ArtworkVerified(uint256 indexed tokenId, bool verified)",
  "event ArtworkSold(uint256 indexed tokenId, address indexed buyer, address indexed seller, uint256 price)"
];

const MARKETPLACE_ABI = [
  "function createListing(uint256 tokenId, uint256 price, uint256 duration) external",
  "function buyItem(uint256 listingId) external payable",
  "function getListing(uint256 listingId) external view returns (tuple(uint256 tokenId, address seller, uint256 price, bool isActive, uint256 createdAt, uint256 expiresAt))",
  "function getActiveListings(uint256 offset, uint256 limit) external view returns (tuple(uint256 tokenId, address seller, uint256 price, bool isActive, uint256 createdAt, uint256 expiresAt)[])",
  "function cancelListing(uint256 listingId) external",
  "event ListingCreated(uint256 indexed listingId, uint256 indexed tokenId, address indexed seller, uint256 price, uint256 expiresAt)",
  "event ItemSold(uint256 indexed listingId, uint256 indexed tokenId, address indexed buyer, address seller, uint256 price)"
];

const VERIFICATION_ABI = [
  "function createVerification(string memory fileHash, string memory title, string memory description, string memory fileType, uint256 fileSize, string memory metadataURI) external payable",
  "function verifyRecord(uint256 verificationId, bool verified) external",
  "function getVerificationByHash(string memory fileHash) external view returns (tuple(string fileHash, address owner, string title, string description, string fileType, uint256 fileSize, uint256 createdAt, bool isVerified, string metadataURI))",
  "function isHashVerified(string memory fileHash) external view returns (bool)",
  "function getHashOwner(string memory fileHash) external view returns (address)",
  "function getVerificationFee() external view returns (uint256)",
  "event VerificationCreated(uint256 indexed verificationId, string indexed fileHash, address indexed owner, string title)",
  "event VerificationUpdated(uint256 indexed verificationId, bool verified)"
];

// Contract addresses (akan diisi setelah deployment)
const CONTRACT_ADDRESSES = {
  nft: process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS || "",
  marketplace: process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT_ADDRESS || "",
  verification: process.env.NEXT_PUBLIC_VERIFICATION_CONTRACT_ADDRESS || ""
};

// BSC Network configuration
const BSC_CONFIG = {
  chainId: 56, // BSC Mainnet
  chainName: 'Binance Smart Chain',
  rpcUrls: ['https://bsc-dataseed.binance.org/'],
  blockExplorerUrls: ['https://bscscan.com/'],
  nativeCurrency: {
    name: 'BNB',
    symbol: 'BNB',
    decimals: 18,
  },
};

const BSC_TESTNET_CONFIG = {
  chainId: 97, // BSC Testnet
  chainName: 'BSC Testnet',
  rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
  blockExplorerUrls: ['https://testnet.bscscan.com/'],
  nativeCurrency: {
    name: 'tBNB',
    symbol: 'tBNB',
    decimals: 18,
  },
};

// Web3 Context
const Web3Context = createContext<Web3ContextType | null>(null);

// Web3 Provider Component
export function Web3Provider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);

  // Check if MetaMask is installed
  const isMetaMaskInstalled = () => {
    return typeof window !== 'undefined' && window.ethereum;
  };

  // Connect to MetaMask
  const connectWallet = async () => {
    if (!isMetaMaskInstalled()) {
      alert('MetaMask tidak terinstall! Silakan install MetaMask terlebih dahulu.');
      return;
    }

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length > 0) {
        setAccount(accounts[0]);
        setIsConnected(true);
        
        // Get current chain ID
        const currentChainId = await window.ethereum.request({
          method: 'eth_chainId',
        });
        setChainId(parseInt(currentChainId, 16));

        // Auto switch to BSC if not already connected
        if (parseInt(currentChainId, 16) !== BSC_CONFIG.chainId) {
          await switchToBSC();
        }
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      alert('Gagal menghubungkan wallet. Silakan coba lagi.');
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    setAccount(null);
    setIsConnected(false);
    setChainId(null);
  };

  // Switch to BSC network
  const switchToBSC = async () => {
    if (!isMetaMaskInstalled()) return;

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${BSC_CONFIG.chainId.toString(16)}` }],
      });
    } catch (switchError: any) {
      // If network doesn't exist, add it
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [BSC_CONFIG],
          });
        } catch (addError) {
          console.error('Error adding BSC network:', addError);
        }
      }
    }
  };

  // Listen for account changes
  useEffect(() => {
    if (isMetaMaskInstalled()) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else {
          setAccount(accounts[0]);
        }
      });

      window.ethereum.on('chainChanged', (chainId: string) => {
        setChainId(parseInt(chainId, 16));
        // Reload page to ensure proper network handling
        window.location.reload();
      });
    }
  }, []);

  // Check if already connected on page load
  useEffect(() => {
    const checkConnection = async () => {
      if (isMetaMaskInstalled()) {
        try {
          const accounts = await window.ethereum.request({
            method: 'eth_accounts',
          });

          if (accounts.length > 0) {
            setAccount(accounts[0]);
            setIsConnected(true);
            
            const currentChainId = await window.ethereum.request({
              method: 'eth_chainId',
            });
            setChainId(parseInt(currentChainId, 16));
          }
        } catch (error) {
          console.error('Error checking connection:', error);
        }
      }
    };

    checkConnection();
  }, []);

  const value: Web3ContextType = {
    isConnected,
    account,
    chainId,
    connectWallet,
    disconnectWallet,
    switchToBSC,
    contractAddresses: CONTRACT_ADDRESSES,
  };

  return React.createElement(
    Web3Context.Provider,
    { value },
    children
  );
}

// Hook to use Web3 context
export function useWeb3() {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
}

// Utility functions for contract interactions
export const contractUtils = {
  // Convert ETH to Wei
  toWei: (amount: string | number): string => {
    return window.ethereum ? 
      window.ethereum.utils.toWei(amount.toString(), 'ether') : 
      (Number(amount) * 1e18).toString();
  },

  // Convert Wei to ETH
  fromWei: (amount: string): string => {
    return window.ethereum ? 
      window.ethereum.utils.fromWei(amount, 'ether') : 
      (Number(amount) / 1e18).toString();
  },

  // Format address (show first 6 and last 4 characters)
  formatAddress: (address: string): string => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  },

  // Check if address is valid
  isValidAddress: (address: string): boolean => {
    return window.ethereum ? 
      window.ethereum.utils.isAddress(address) : 
      /^0x[a-fA-F0-9]{40}$/.test(address);
  },

  // Get contract instance
  getContract: (address: string, abi: any[]) => {
    if (!window.ethereum) return null;
    return new window.ethereum.Contract(abi, address);
  },

  // Get NFT contract
  getNFTContract: () => {
    return contractUtils.getContract(CONTRACT_ADDRESSES.nft, NFT_ABI);
  },

  // Get Marketplace contract
  getMarketplaceContract: () => {
    return contractUtils.getContract(CONTRACT_ADDRESSES.marketplace, MARKETPLACE_ABI);
  },

  // Get Verification contract
  getVerificationContract: () => {
    return contractUtils.getContract(CONTRACT_ADDRESSES.verification, VERIFICATION_ABI);
  }
};

// Declare global window.ethereum type
declare global {
  interface Window {
    ethereum: any;
  }
}

export default Web3Provider;
