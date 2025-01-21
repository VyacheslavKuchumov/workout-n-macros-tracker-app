const { sequelize } = require("../connection");
const { DataTypes } = require("sequelize");


const Workout = sequelize.define(
  "workout",
  {
    workout_id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
    },
    workout_name: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    user_uid: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    workout_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
  },
  {
    tableName: "Workouts",
    timestamps: false,
  },
);



module.exports = { Workout };
