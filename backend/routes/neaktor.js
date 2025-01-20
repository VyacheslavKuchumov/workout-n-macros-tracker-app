const express = require("express");
const router = express.Router();

const {
  neaktorCreateProject,
  neaktorEditProject,
  neaktorDeleteProject,
  neaktorArchiveProject,

} = require("../controllers/neaktor");

// Define routes for project operations

router.post("/project/create", neaktorCreateProject);
router.post("/project/edit", neaktorEditProject);
router.post("/project/delete", neaktorDeleteProject);
router.post("/project/archive", neaktorArchiveProject);


module.exports = router;
