const express = require("express");
const router = express.Router();

const {
  getAllDrafts,
  editDraftById,
  deleteDraftById,
  createDraft,
  getDraftById,
} = require("../controllers/drafts");

// Define routes for draft operations
router.get("/", getAllDrafts);
router.get("/search/:id", getDraftById);
router.post("/", createDraft);
router.delete("/:id", deleteDraftById);
router.put("/:id", editDraftById);

module.exports = router;
