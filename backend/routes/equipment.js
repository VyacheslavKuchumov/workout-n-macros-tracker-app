const express = require("express");
const router = express.Router();

const {
  getAllEquipment,
  editEquipmentById,
  deleteEquipmentById,
  createEquipment,
  getEquipmentById,
  getEquipmentBySetId,
} = require("../controllers/equipment");

router.get("/", getAllEquipment);
router.get("/set/:id", getEquipmentBySetId);
router.get("/search/:id", getEquipmentById);
router.post("/", createEquipment);
router.delete("/:id", deleteEquipmentById);
router.put("/:id", editEquipmentById);

module.exports = router;
