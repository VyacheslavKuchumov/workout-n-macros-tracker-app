const { sequelize } = require("../connection");
const { DataTypes } = require("sequelize");


const Exercise = sequelize.define(
  "exercise",
  {
    exercise_id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    exercise_name: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    exercise_description: {
        type: DataTypes.TEXT,
    },
    muscle_group: {
        type: DataTypes.TEXT,
    },
  },
  {
    tableName: "Exercises",
    timestamps: false,
  },
);



module.exports = { Exercise };
