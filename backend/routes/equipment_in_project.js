const express = require("express");
const router = express.Router();

const {

  addEquipmentToProject,
  removeEquipmentFromProject,
  getEquipmentInProject,
  addSetToProject,
  removeSetFromProject,
  getAvailableEquipmentInSet,
  getConflictingEquipment,
  addDraftToProject,
  resetEquipmentInProject
} = require("../controllers/equipment_in_project");


router.get("/:id", getEquipmentInProject);
router.post("/add", addEquipmentToProject);
router.put("/del", removeEquipmentFromProject);
router.post("/add_set", addSetToProject);
router.put("/del_set", removeSetFromProject);
router.post("/equipment_in_set", getAvailableEquipmentInSet);
router.post("/conflicting", getConflictingEquipment);
router.delete("/reset/:id", resetEquipmentInProject);
router.post("/add_draft", addDraftToProject);

module.exports = router;
