const { sequelize } = require("../connection");
const { DataTypes } = require("sequelize");


const User = sequelize.define(
  "user",
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    user_uid: {
      type: DataTypes.UUID,
    },
    name: {
      type: DataTypes.TEXT,
      unique: true,
    },
    role: {
      type: DataTypes.TEXT,
    },
  },
  {
    tableName: "Users",
    timestamps: true,
  },
);



module.exports = { User,};
