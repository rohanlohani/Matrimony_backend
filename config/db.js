const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB,
  process.env.USER,
  process.env.PASSWORD || "",
  {
    host: process.env.HOST,
    dialect: "mysql",
    logging: false,
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connected to MySQL database.");
  } catch (err) {
    console.error("Database connection failed: ", err);
  }
};
console.log("DB export:", sequelize instanceof Sequelize);

module.exports = { connectDB, sequelize };
