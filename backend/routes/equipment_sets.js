const express = require("express");
const router = express.Router();

const {
  getAllEquipmentSets,
  createEquipmentSet,
  deleteEquipmentSetById,
  editEquipmentSetById,
  getEquipmentSetById,
} = require("../controllers/equipment_sets");

router.get("/", getAllEquipmentSets);
router.get("/search/:id", getEquipmentSetById);
router.post("/", createEquipmentSet);
router.delete("/:id", deleteEquipmentSetById);
router.put("/:id", editEquipmentSetById);

module.exports = router;
