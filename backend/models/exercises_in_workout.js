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

    },
    reps: {
        type: DataTypes.INTEGER,

    },
    set: {
        type: DataTypes.INTEGER,

    },

  },
  {
    tableName: "ExercisesInWorkout",
    timestamps: false,
  },
);



module.exports = { ExercisesInWorkout };
