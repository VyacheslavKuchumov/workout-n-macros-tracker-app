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
    await Exercise.create({
      exercise_name: "Жим лёжа",
    });
    await Exercise.create({
      exercise_name: "Становая тяга",
    });
    await Exercise.create({
      exercise_name: "Приседания",
    });
    await Exercise.create({
      exercise_name: "Жим над головой",
    });
    await Exercise.create({
      exercise_name: "Бицепс штангой",
    });
    await Exercise.create({
      exercise_name: "Подтягивания",
    });
    await Exercise.create({
      exercise_name: "Пресс (скручивания)",
    });
    await Exercise.create({
      exercise_name: "Пресс подъём ног",
    });
    await Exercise.create({
      exercise_name: "Брусья",
    });
    await Exercise.create({
      exercise_name: "Отжимания",
    });
    await Exercise.create({
      exercise_name: "Икры",
    });

  } catch (error) {
    console.error("Error syncing the database:", error);
  }
}

module.exports = { initializeDatabase };
