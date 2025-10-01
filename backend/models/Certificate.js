const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Certificate = sequelize.define(
  "Certificate",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    artworkId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "artworks",
        key: "id",
      },
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    certificateNumber: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    type: {
      type: DataTypes.ENUM("pdf", "nft", "qr"),
      allowNull: false,
      defaultValue: "pdf",
    },
    filePath: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    qrCodeData: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    nftTokenId: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    nftContractAddress: {
      type: DataTypes.STRING(42),
      allowNull: true,
      validate: {
        is: /^0x[a-fA-F0-9]{40}$/,
      },
    },
    blockchainTxHash: {
      type: DataTypes.STRING(66),
      allowNull: true,
      validate: {
        is: /^0x[a-fA-F0-9]{64}$/,
      },
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    metadata: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {},
    },
    downloadCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    lastDownloadedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "certificates",
  }
);

module.exports = Certificate;
