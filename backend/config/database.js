const { Sequelize } = require("sequelize");
require("dotenv").config();

// Use SQLite for development by default
const useSQLite =
  process.env.NODE_ENV === "development" &&
  (!process.env.DB_HOST || process.env.DB_HOST === "localhost");

let sequelize;

if (useSQLite) {
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "./database.sqlite",
    logging: false,
    define: {
      timestamps: true,
      underscored: true,
      freezeTableName: true,
    },
  });
} else {
  sequelize = new Sequelize(
    process.env.DB_NAME || "blockrights_db",
    process.env.DB_USER || "root",
    process.env.DB_PASSWORD || "",
    {
      host: process.env.DB_HOST || "localhost",
      dialect: "mysql",
      logging: process.env.NODE_ENV === "development" ? console.log : false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
      define: {
        timestamps: true,
        underscored: true,
        freezeTableName: true,
      },
    }
  );
}

module.exports = sequelize;
