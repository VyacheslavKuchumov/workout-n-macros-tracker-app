// models/index.js
const { sequelize } = require("../connection");

const { Auth } = require("./auths");
const { User } = require("./users");
const { UserInfo } = require("./user_info");
const { Workout } = require("./workouts");
const { Exercise } = require("./exercises");
const { ExercisesInWorkout } = require("./exercises_in_workout");

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
