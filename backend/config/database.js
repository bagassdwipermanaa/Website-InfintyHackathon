const { Sequelize } = require("sequelize");
require("dotenv").config();

// Always use MySQL for this project
const sequelize = new Sequelize(
  process.env.DB_NAME || "hackaton",
  process.env.DB_USER || "hackaton", 
  process.env.DB_PASSWORD || "hackpp122_",
  {
    host: process.env.DB_HOST || "pintu2.minecuta.com",
    dialect: "mysql",
    logging: process.env.NODE_ENV === "development" ? console.log : false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
      acquireTimeout: 60000,
    },
    define: {
      timestamps: true,
      underscored: true,
      freezeTableName: true,
    },
    dialectOptions: {
      connectTimeout: 60000,
    },
  }
);

module.exports = sequelize;
