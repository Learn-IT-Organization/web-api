"use strict";
const Sequelize = require("sequelize");
const config = require("./config.json")[process.env.NODE_ENV || "development"];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect,
    port: config.port,
  }
);

const db = {};

db.sequelize = sequelize;

db.sync = async () => {
  await sequelize.sync();
  console.log("Database synchronized");
};

module.exports = db;
