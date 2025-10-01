const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Verification = sequelize.define(
  "Verification",
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
    verifierIp: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    verifierUserAgent: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    verificationType: {
      type: DataTypes.ENUM("file", "hash", "qr"),
      allowNull: false,
    },
    verificationData: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    isSuccessful: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    result: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    errorMessage: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    processingTime: {
      type: DataTypes.INTEGER, // in milliseconds
      allowNull: true,
    },
  },
  {
    tableName: "verifications",
  }
);

module.exports = Verification;
