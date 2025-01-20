const { Auth } = require("./auths");
const { User } = require("./users");
const { User_info } = require("./user_info");


// User and Auth
User.belongsTo(Auth, {
  targetKey: "auth_uid",
  foreignKey: "user_uid",
  as: "auth",
});

// User has one User_info
User.hasOne(User_info, {
  sourceKey: "user_uid", // The key in the User model
  foreignKey: "user_uid", // The foreign key in the User_info model
  onDelete: 'CASCADE', // Ensures cascading delete
});

// User_info belongs to User
User_info.belongsTo(User, {
  targetKey: "user_uid", // The key in the User model being referenced
  foreignKey: "user_uid", // The foreign key in the User_info model
  onDelete: 'CASCADE',
});

