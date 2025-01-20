const { equipment } = require("./equipment");
const { equipment_set } = require("./equipment_sets");
const { warehouse } = require("./warehouses");

const { auth } = require("./auths");
const { user } = require("./users");
const { project } = require("./projects");
const { project_type } = require("./project_types");

const { set_type } = require("./set_types");
const { draft } = require("./drafts");

// User and Auth
user.belongsTo(auth, {
  targetKey: "auth_uid",
  foreignKey: "user_uid",
  as: "auth",
});

// Equipment and EquipmentType
equipment.belongsTo(equipment_set, {
  as: "equipment_set",
  foreignKey: "equipment_set_id",
});

equipment_set.belongsTo(set_type,{
  as: "type",
  foreignKey: "set_type_id",
})

// Equipment and Warehouse
equipment.belongsTo(warehouse, {
  as: "storage",
  foreignKey: "storage_id",
});

// Equipment and Project (Many-to-Many)
equipment.belongsToMany(project, {
  through: "equipment_in_project",
  timestamps: false,
});
project.belongsToMany(equipment, {
  through: "equipment_in_project",
  timestamps: false,
});

equipment.belongsToMany(draft, {
  
    through: "equipment_in_draft",
    timestamps: false,
  });
draft.belongsToMany(equipment, {
    through: "equipment_in_draft",
    timestamps: false,
  }
)

// Shooting and User (Chief Engineer)
project.belongsTo(user, {
  as: "chiefEngineer",
  foreignKey: "chief_engineer_id",
});

project.belongsTo(project_type, {
  as: "type",
  foreignKey: "project_type_id",
});

// Uncomment and rename if needed for EquipmentType association with SetOfEquipment
// set_of_equipment.belongsTo(equipment_type, {
//   as: 'type',
//   foreignKey: 'set_of_equipment_type'
// });
