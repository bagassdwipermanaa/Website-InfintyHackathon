const sequelize = require("../config/database");

// Import all models
const User = require("./User");
const Artwork = require("./Artwork");
const Certificate = require("./Certificate");
const Verification = require("./Verification");
const Dispute = require("./Dispute");

// Define associations
User.hasMany(Artwork, { foreignKey: "userId", as: "artworks" });
Artwork.belongsTo(User, { foreignKey: "userId", as: "creator" });

User.hasMany(Certificate, { foreignKey: "userId", as: "certificates" });
Certificate.belongsTo(User, { foreignKey: "userId", as: "user" });

Artwork.hasMany(Certificate, { foreignKey: "artworkId", as: "certificates" });
Certificate.belongsTo(Artwork, { foreignKey: "artworkId", as: "artwork" });

Artwork.hasMany(Verification, { foreignKey: "artworkId", as: "verifications" });
Verification.belongsTo(Artwork, { foreignKey: "artworkId", as: "artwork" });

Artwork.hasMany(Dispute, { foreignKey: "artworkId", as: "disputes" });
Dispute.belongsTo(Artwork, { foreignKey: "artworkId", as: "artwork" });

User.hasMany(Dispute, { foreignKey: "claimantId", as: "disputes" });
Dispute.belongsTo(User, { foreignKey: "claimantId", as: "claimant" });

User.hasMany(Dispute, { foreignKey: "resolvedBy", as: "resolvedDisputes" });
Dispute.belongsTo(User, { foreignKey: "resolvedBy", as: "resolver" });

User.hasMany(Dispute, { foreignKey: "assignedTo", as: "assignedDisputes" });
Dispute.belongsTo(User, { foreignKey: "assignedTo", as: "assignee" });

// Sync database
const syncDatabase = async () => {
  try {
    await sequelize.sync({ force: true });
    console.log("Database synchronized successfully");
  } catch (error) {
    console.error("Error synchronizing database:", error);
  }
};

module.exports = {
  sequelize,
  User,
  Artwork,
  Certificate,
  Verification,
  Dispute,
  syncDatabase,
};
