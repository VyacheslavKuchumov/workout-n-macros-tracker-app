const e = require("cors");
const { sequelize } = require("../connection");

const { auth } = require("../models/auths");
const { equipment } = require("../models/equipment");
const { equipment_set } = require("../models/equipment_sets");
const { project_type } = require("../models/project_types");
const { project } = require("../models/projects");
const { set_type } = require("../models/set_types");
const { user } = require("../models/users");
const { warehouse } = require("../models/warehouses");
const { draft } = require("../models/drafts");

const exportDatabase = async (req, res) => {
  try {
    const tableDataArray = [];
  
    await auth.findAll().then((auths) => {
      tableDataArray.push({ table_name: "auth", table_data: auths });
    });

    await user.findAll().then((users) => {
      tableDataArray.push({ table_name: "user", table_data: users });
    });

    await warehouse.findAll().then((warehouses) => {
      tableDataArray.push({ table_name: "warehouse", table_data: warehouses });
    });

    await set_type.findAll().then((setTypes) => {
      tableDataArray.push({ table_name: "set_type", table_data: setTypes });
    });

    await equipment_set.findAll().then((equipmentSets) => {
      tableDataArray.push({ table_name: "equipment_set", table_data: equipmentSets });
    });

    await equipment.findAll().then((equipmentItems) => {
      tableDataArray.push({ table_name: "equipment", table_data: equipmentItems });
    });

    await project_type.findAll().then((projectTypes) => {
      tableDataArray.push({ table_name: "project_type", table_data: projectTypes });
    });

    await project.findAll().then((projects) => {
      tableDataArray.push({ table_name: "project", table_data: projects });
    });

    // equipment in project
    await sequelize.query( // Query to get all equipment in projects
      `SELECT * FROM equipment_in_project;`,
      { type: sequelize.QueryTypes.SELECT }
    ).then((equipmentInProjects) => {
      tableDataArray.push({ table_name: "equipment_in_project", table_data: equipmentInProjects });
    });

    await draft.findAll().then((drafts) => {
      tableDataArray.push({ table_name: "drafts", table_data: drafts });
    });

    // equipment in draft
    await sequelize.query( // Query to get all equipment in drafts
      `SELECT * FROM equipment_in_draft;`,
      { type: sequelize.QueryTypes.SELECT }
    ).then((equipmentInDrafts) => {
      tableDataArray.push({ table_name: "equipment_in_draft", table_data: equipmentInDrafts });
    });

    
    // Send the JSON data as a response
    res.json(tableDataArray);
  } catch (error) {
    console.error("Error exporting database:", error);
    res
      .status(500)
      .json({ error: "An error occurred while exporting the database." });
  }
};

const importDatabase = async (req, res) => {
  try {
    const data = req.body; // Assuming the data is sent as a JSON array

    if (!Array.isArray(data)) {
      return res
        .status(400)
        .json({ error: "Invalid input format. Expected an array." });
    }

    for (const item of data) {
      const { table_name, table_data } = item;

      try {
        await createModelByName(table_name, table_data);
      } catch (error) {
        console.error(`Error importing data for model ${table_name}:`, error);
        return res.status(500).json({
          error: "An error occurred while importing the database.",
        }); // Exit early to prevent further processing if a critical error occurs
      }
    }

    res.json({ message: "Data imported successfully." });
  } catch (error) {
    console.error("Error in importDatabase:", error);
    res.status(500).json({ error: "An unexpected error occurred." });
  }
};

// Helper function to get a model by its name
const createModelByName = async (modelName, tableData) => {
  for (const row of tableData) {
    try {
      switch (modelName.toLowerCase()) {
        case "auth":
          await auth.create(row);
          break;
        case "user":
          await user.create(row);
          break;
        case "warehouse":
          await warehouse.create(row);
          break;
        case "set_type":
          await set_type.create(row);
          break;
        case "equipment_set":
          const foundSetType = await set_type.findOne({
            where: { set_type_name: row.set_type_name },
          });
          if (!foundSetType) {
            throw new Error("Set type not found for equipment set.");
          }
          await equipment_set.create({
            equipment_set_name: row.equipment_set_name,
            description: row.description,
            set_type_id: foundSetType.set_type_id,
          });
          break;
        case "equipment":
          const foundWarehouse = await warehouse.findOne({
            where: { warehouse_name: row.warehouse_name },
          });
          if (!foundWarehouse) {
            throw new Error("Warehouse not found for equipment.");
          }

          const foundEquipmentSet = await equipment_set.findOne({
            where: { equipment_set_name: row.equipment_set_name },
          });
          if (!foundEquipmentSet) {
            throw new Error("Equipment set not found for equipment.");
          }

          await equipment.create({
            equipment_name: row.equipment_name,
            serial_number: row.serial_number,
            equipment_set_id: foundEquipmentSet.equipment_set_id, // Associate with the equipment set ID
            storage_id: foundWarehouse.warehouse_id, // Associate with the warehouse ID
            needs_maintenance: row.needs_maintenance,
            date_of_purchase: row.date_of_purchase,
            cost_of_purchase: row.cost_of_purchase,
          });
          break;

        case "project_type":
          break;
        case "project":
          break;

        default:
          throw new Error(`Unknown model type: ${modelName}`);
      }
    } catch (error) {
      console.error(`Error processing row for model ${modelName}:`, error);
      // You can choose to skip this row or rethrow the error
      // For now, let's just log it and continue with the next row
    }
  }
};

module.exports = {
  exportDatabase,
  importDatabase,
};
