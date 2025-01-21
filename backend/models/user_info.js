const { sequelize } = require("../connection");
const { DataTypes } = require("sequelize");


const UserInfo = sequelize.define(
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
    tableName: "UserInfo",
    timestamps: false,
  },
);



module.exports = { UserInfo};
