const { DataTypes } = require("sequelize");
const sequalize = require("../config/db");

const Admin = sequalize.define(
  "Admin",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      // **DELETE THIS LINE: unique: true,**
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    register_date: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    register_month: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    register_year: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    tableName: "admins",
    // 💡 Intha `indexes` block ah ADD pannunga
    indexes: [
      {
        unique: true,
        fields: ["email"], // 'email' field-ku Unique key
        name: "admin_email_unique", // Oru koot index name
      },
    ],
  }
);

module.exports = Admin;
