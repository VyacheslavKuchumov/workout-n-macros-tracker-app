const express = require("express");
const router = express.Router();

const {
  getAllProjects,
  editProjectById,
  deleteProjectById,
  createProject,
  getProjectById,

} = require("../controllers/projects");

// Define routes for project operations
router.get("/", getAllProjects);
router.get("/search/:id", getProjectById);
router.post("/", createProject);
router.delete("/:id", deleteProjectById);
router.put("/:id", editProjectById);


module.exports = router;
