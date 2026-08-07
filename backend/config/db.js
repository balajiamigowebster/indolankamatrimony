//production connect code

// const { Sequelize } = require("sequelize");
// require("dotenv").config();

// const sequelize = new Sequelize(process.env.DATABASE_URL, {
//   dialect: "mysql",
//   logging: false,
//   // connection timeout-a 30 seconds (30000ms) ku increase
//   dialectOptions: {
//     connectTimeout: 30000, // Default-a irukkuratha seconds increased
//   },
// });

// sequelize
//   .authenticate()
//   .then(() => console.log("✅ Connected to MySQL!"))
//   .catch((err) => console.log("❌ Connection failed:", err.message));

// module.exports = sequelize;

// Heidisql connect code

const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    //port: process.env.DB_PORT,
    logging: false,
  }
);

module.exports = sequelize;
