const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Artwork = sequelize.define(
  "Artwork",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        len: [1, 255],
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    fileName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    filePath: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    fileSize: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    fileType: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    fileHash: {
      type: DataTypes.STRING(64),
      allowNull: false,
      unique: true,
      validate: {
        len: [64, 64],
      },
    },
    category: {
      type: DataTypes.STRING(50),
      allowNull: true,
      validate: {
        isIn: [
          [
            "art",
            "music",
            "video",
            "writing",
            "photography",
            "design",
            "code",
            "other",
          ],
        ],
      },
    },
    tags: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    license: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "all-rights-reserved",
      validate: {
        isIn: [
          [
            "all-rights-reserved",
            "creative-commons",
            "public-domain",
            "commercial-use",
          ],
        ],
      },
    },
    status: {
      type: DataTypes.ENUM("pending", "verified", "disputed", "rejected"),
      defaultValue: "pending",
    },
    metadata: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {},
    },
    watermarkData: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    certificateUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    nftTokenId: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    blockchainTxHash: {
      type: DataTypes.STRING(66),
      allowNull: true,
      validate: {
        is: /^0x[a-fA-F0-9]{64}$/,
      },
    },
    blockchainBlockNumber: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    isPublic: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    viewCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    downloadCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    verificationCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    disputeReason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    disputeResolvedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    disputeResolvedBy: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "users",
        key: "id",
      },
    },
  },
  {
    tableName: "artworks",
  }
);

module.exports = Artwork;
