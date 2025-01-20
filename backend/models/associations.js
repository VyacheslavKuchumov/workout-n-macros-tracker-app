const { Auth } = require("./auths");
const { User } = require("./users");



// User and Auth
User.belongsTo(Auth, {
  targetKey: "auth_uid",
  foreignKey: "user_uid",
  as: "auth",
});


