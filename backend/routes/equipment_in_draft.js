const express = require("express");
const router = express.Router();

const {

  addEquipmentToDraft,
  removeEquipmentFromDraft,
  getEquipmentInDraft,
  addSetToDraft,
  removeSetFromDraft,
  getAvailableEquipmentInSet,
} = require("../controllers/equipment_in_draft");


router.get("/:id", getEquipmentInDraft);
router.post("/add", addEquipmentToDraft);
router.put("/del", removeEquipmentFromDraft);
router.post("/add_set", addSetToDraft);
router.put("/del_set", removeSetFromDraft);
router.post("/equipment_in_set", getAvailableEquipmentInSet);


module.exports = router;
