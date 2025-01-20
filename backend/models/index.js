// models/index.js
const { sequelize } = require("../connection");
const { equipment } = require("./equipment");
const { project } = require("./projects");
const { auth } = require("./auths");
const { user } = require("./users");
const { warehouse } = require("./warehouses");
const { equipment_set } = require("./equipment_sets");
const { set_type } = require("./set_types");
const { project_type } = require("./project_types");
const { draft } = require("./drafts");

require("./associations"); // Import the associations after models are loaded

// Optionally sync the database (ensure tables are created)
async function initializeDatabase() {
  try {
    await sequelize.sync({ force: true }); // Sync all models with the database
    console.log("Database synchronized");
  } catch (error) {
    console.error("Error syncing the database:", error);
  }
}

module.exports = { initializeDatabase };
