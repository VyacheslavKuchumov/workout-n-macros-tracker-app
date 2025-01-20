const { sequelize } = require("../connection");
const { DataTypes } = require("sequelize");

const equipment = sequelize.define(
  "equipment",
  {
    equipment_id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    equipment_set_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    equipment_name: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    serial_number: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    storage_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    current_storage: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    needs_maintenance: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    date_of_purchase: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    cost_of_purchase: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
  },
  {
    tableName: "equipment",
    timestamps: false,
  },
);

async function get_equipment_table() {
  await equipment.sync();
  console.log("Синхрон equipment 👍");
}

module.exports = { equipment, get_equipment_table };
