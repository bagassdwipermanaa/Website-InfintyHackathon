const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("BlockRightsNFT", function () {
  let nftContract;
  let owner;
  let artist;
  let buyer;

  beforeEach(async function () {
    [owner, artist, buyer] = await ethers.getSigners();
    
    const BlockRightsNFT = await ethers.getContractFactory("BlockRightsNFT");
    nftContract = await BlockRightsNFT.deploy();
    await nftContract.deployed();
  });

  describe("Deployment", function () {
    it("Should set the correct name and symbol", async function () {
      expect(await nftContract.name()).to.equal("BlockRights NFT");
      expect(await nftContract.symbol()).to.equal("BRNFT");
    });

    it("Should set the correct owner", async function () {
      expect(await nftContract.owner()).to.equal(owner.address);
    });
  });

  describe("Minting", function () {
    it("Should mint NFT successfully", async function () {
      const metadata = {
        title: "Test Artwork",
        description: "Test Description",
        artist: "Test Artist",
        fileHash: "abc123def456",
        fileType: "image/jpeg",
        fileSize: 1024000,
        createdAt: Math.floor(Date.now() / 1000),
        isVerified: false,
        isForSale: false,
        price: 0
      };

      const tx = await nftContract.mintArtwork(artist.address, metadata, 500);
      await tx.wait();

      expect(await nftContract.ownerOf(1)).to.equal(artist.address);
      expect(await nftContract.totalSupply()).to.equal(1);
    });

    it("Should reject minting with empty title", async function () {
      const metadata = {
        title: "",
        description: "Test Description",
        artist: "Test Artist",
        fileHash: "abc123def456",
        fileType: "image/jpeg",
        fileSize: 1024000,
        createdAt: Math.floor(Date.now() / 1000),
        isVerified: false,
        isForSale: false,
        price: 0
      };

      await expect(
        nftContract.mintArtwork(artist.address, metadata, 500)
      ).to.be.revertedWith("Title tidak boleh kosong");
    });
  });

  describe("Verification", function () {
    beforeEach(async function () {
      const metadata = {
        title: "Test Artwork",
        description: "Test Description",
        artist: "Test Artist",
        fileHash: "abc123def456",
        fileType: "image/jpeg",
        fileSize: 1024000,
        createdAt: Math.floor(Date.now() / 1000),
        isVerified: false,
        isForSale: false,
        price: 0
      };

      await nftContract.mintArtwork(artist.address, metadata, 500);
    });

    it("Should verify artwork successfully", async function () {
      await nftContract.verifyArtwork(1, true);
      const artwork = await nftContract.getArtworkMetadata(1);
      expect(artwork.isVerified).to.be.true;
    });

    it("Should reject verification by non-owner", async function () {
      await expect(
        nftContract.connect(artist).verifyArtwork(1, true)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });
});

describe("BlockRightsMarketplace", function () {
  let nftContract;
  let marketplaceContract;
  let owner;
  let artist;
  let buyer;

  beforeEach(async function () {
    [owner, artist, buyer] = await ethers.getSigners();
    
    const BlockRightsNFT = await ethers.getContractFactory("BlockRightsNFT");
    nftContract = await BlockRightsNFT.deploy();
    await nftContract.deployed();

    const BlockRightsMarketplace = await ethers.getContractFactory("BlockRightsMarketplace");
    marketplaceContract = await BlockRightsMarketplace.deploy(nftContract.address);
    await marketplaceContract.deployed();
  });

  describe("Deployment", function () {
    it("Should set the correct NFT contract address", async function () {
      expect(await marketplaceContract.nftContract()).to.equal(nftContract.address);
    });
  });

  describe("Listing", function () {
    beforeEach(async function () {
      const metadata = {
        title: "Test Artwork",
        description: "Test Description",
        artist: "Test Artist",
        fileHash: "abc123def456",
        fileType: "image/jpeg",
        fileSize: 1024000,
        createdAt: Math.floor(Date.now() / 1000),
        isVerified: true,
        isForSale: false,
        price: 0
      };

      await nftContract.mintArtwork(artist.address, metadata, 500);
      await nftContract.connect(artist).approve(marketplaceContract.address, 1);
    });

    it("Should create listing successfully", async function () {
      await marketplaceContract.connect(artist).createListing(1, ethers.utils.parseEther("1"), 86400);
      
      const listing = await marketplaceContract.getListing(1);
      expect(listing.tokenId).to.equal(1);
      expect(listing.seller).to.equal(artist.address);
      expect(listing.price).to.equal(ethers.utils.parseEther("1"));
      expect(listing.isActive).to.be.true;
    });
  });
});

describe("BlockRightsVerification", function () {
  let verificationContract;
  let owner;
  let user;

  beforeEach(async function () {
    [owner, user] = await ethers.getSigners();
    
    const BlockRightsVerification = await ethers.getContractFactory("BlockRightsVerification");
    verificationContract = await BlockRightsVerification.deploy();
    await verificationContract.deployed();
  });

  describe("Deployment", function () {
    it("Should set the correct owner", async function () {
      expect(await verificationContract.owner()).to.equal(owner.address);
    });
  });

  describe("Verification", function () {
    it("Should create verification record successfully", async function () {
      const verificationFee = await verificationContract.getVerificationFee();
      
      await verificationContract.connect(user).createVerification(
        "abc123def456",
        "Test Artwork",
        "Test Description",
        "image/jpeg",
        1024000,
        "https://example.com/metadata.json",
        { value: verificationFee }
      );

      expect(await verificationContract.isHashRegistered("abc123def456")).to.be.true;
      expect(await verificationContract.getTotalVerifications()).to.equal(1);
    });

    it("Should reject verification with insufficient payment", async function () {
      await expect(
        verificationContract.connect(user).createVerification(
          "abc123def456",
          "Test Artwork",
          "Test Description",
          "image/jpeg",
          1024000,
          "https://example.com/metadata.json",
          { value: ethers.utils.parseEther("0.001") }
        )
      ).to.be.revertedWith("Pembayaran tidak cukup");
    });
  });
});
