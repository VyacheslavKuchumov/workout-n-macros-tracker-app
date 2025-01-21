const { sequelize } = require("../connection");
const { DataTypes } = require("sequelize");


const User_info = sequelize.define(
  "user_info",
  {
    
    user_uid: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      primaryKey: true,
    },

    height: {
      type: DataTypes.INTEGER,
    },
    weight: {
      type: DataTypes.FLOAT,
    },
    sex: {
      type: DataTypes.TEXT,
    },
    date_of_birth: {
      type: DataTypes.DATEONLY,
    },
  },
  {
    tableName: "User_info",
    timestamps: false,
  },
);



module.exports = { User_info};
