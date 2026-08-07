// const { DataTypes } = require("sequelize");
// // 🛑 IMPORTANT: Assuming your sequelize instance is correctly imported here
// const sequelize = require("../config/db");

// const OtpTemp = sequelize.define(
//   "OtpTemp",
//   {
//     // Primary key/Identifier field (Email-a use seiyalaam, endraalum id thevaiyendral id-a use seiyalaam)
//     email: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       primaryKey: true, // Email-a primary key-a veikkalaam for upsert/lookup
//       unique: true,
//     },
//     // OTP value
//     otp: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },

//     // Profile Data (Store as JSON string to save all form fields)
//     profileData: {
//       type: DataTypes.TEXT, // Large string data types use seiyungal
//       allowNull: false,
//     },

//     // 🛑 NEW: Manual Date/Time Fields (If you need to track when the OTP was created)

//     // OTP Creation Time (e.g., "10:30 AM")

//     created_time: {
//       type: DataTypes.STRING,
//       allowNull: true,
//     },

//     // OTP Creation Day (e.g., "05")
//     created_day: {
//       type: DataTypes.STRING,
//       allowNull: true,
//     },

//     // OTP Creation Month (e.g., "11")
//     created_month: {
//       type: DataTypes.STRING,
//       allowNull: true,
//     },

//     // OTP Creation Year (e.g., "2025")
//     created_year: {
//       type: DataTypes.STRING,
//       allowNull: true,
//     },

//     // Timestamp for expiry check (MUKKIYAM: Date.now() store seiya)
//     timestamp: {
//       type: DataTypes.BIGINT,
//       allowNull: false, // Idhu dhaan expiry check-kku thevai
//     },
//   },
//   {
//     // Optional Sequelize settings
//     tableName: "OtpTemps", // Database Table Name
//     timestamps: false, // Don't use createdAt/updatedAt
//   }
// );

// // ✅ Direct Model Export
// module.exports = OtpTemp;

// models/otptemp.js
const { DataTypes } = require("sequelize");
// 🛑 IMPORTANT: Assuming your sequelize instance is correctly imported here
const sequelize = require("../config/db");

const OtpTemp = sequelize.define(
  "OtpTemp",
  {
    // Primary key/Identifier field
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      unique: true,
    },
    // OTP value
    otp: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    // Profile Data (Store as JSON string to save all form fields)
    profileData: {
      type: DataTypes.TEXT, // Large string data types use seiyungal
      allowNull: false,
    },

    // 🛑 NEW: Manual Date/Time Fields
    created_time: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    created_day: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    created_month: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    created_year: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    // Timestamp for expiry check
    timestamp: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
  },
  {
    // Optional Sequelize settings
    tableName: "OtpTemps", // Database Table Name
    timestamps: false, // Don't use createdAt/updatedAt

    // 🛑 FIX: Character Set Add Seigiren (Tamil Support)
    charset: "utf8mb4",
    collate: "utf8mb4_unicode_ci",
  }
);

// ✅ Direct Model Export
module.exports = OtpTemp;
