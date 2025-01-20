const express = require("express");
const router = express.Router();

const {
  importDatabase,
  exportDatabase,
} = require("../controllers/excel_controller");

router.get("/", exportDatabase);
router.post("/", importDatabase);

module.exports = router;
