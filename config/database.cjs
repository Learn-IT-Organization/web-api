"use strict";
const Sequelize = require("sequelize");
const config = require("./config.json")[process.env.NODE_ENV || "development"];

const admin = require("firebase-admin");
const serviceAccount = require("./learnit-eb4b1-firebase-adminsdk-zoel7-9291c6204d.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

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
