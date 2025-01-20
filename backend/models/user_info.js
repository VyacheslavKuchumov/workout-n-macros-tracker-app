const { sequelize } = require("../connection");
const { DataTypes } = require("sequelize");


const User_info = sequelize.define(
  "user_info",
  {
    user_info_id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    user_uid: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true
    },

    height: {
      type: DataTypes.INTEGER,
    },
    weight: {
      type: DataTypes.FLOAT,
    },
    age: {
      type: DataTypes.INTEGER,
    },
    sex: {
      type: DataTypes.TEXT,
    },
    date_of_birth: {
      type: DataTypes.DATE,
    },
  },
  {
    tableName: "User_info",
    timestamps: false,
  },
);



module.exports = { User_info};
