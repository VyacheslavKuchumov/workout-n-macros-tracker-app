const { sequelize } = require("../connection");
const { DataTypes } = require("sequelize");


const ExercisesInWorkout = sequelize.define(
  "exercise_in_workout",
  {
    exercise_in_workout_id : {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    workout_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    exercise_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    weight: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    reps: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    set: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },

  },
  {
    tableName: "ExercisesInWorkout",
    timestamps: false,
  },
);



module.exports = { ExercisesInWorkout };
