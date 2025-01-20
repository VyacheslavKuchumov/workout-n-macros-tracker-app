const { sequelize } = require("../connection");
const { DataTypes, DATEONLY } = require("sequelize");

const project = sequelize.define(
  "projects",
  {
    project_id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    neaktor_id: {
      type: DataTypes.TEXT,
      allowNull: true,
      unique: true,
    },
    project_name: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    archived: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    project_type_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    shooting_start_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    shooting_end_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    chief_engineer_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
  },
  {
    tableName: "projects",
    timestamps: false,
  },
);

module.exports = { project };
