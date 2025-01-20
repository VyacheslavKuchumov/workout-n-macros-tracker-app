const { sequelize } = require("../connection");
const { DataTypes } = require("sequelize");
const { auth } = require("./auths");

const user = sequelize.define(
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
    tableName: "users",
    timestamps: true,
  },
);

async function get_users_table() {
  await user.sync();
  console.log("Синхрон users 👍");
}

module.exports = { user, get_users_table };
