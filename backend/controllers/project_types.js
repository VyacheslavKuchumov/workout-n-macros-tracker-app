const { project_type } = require("../models/project_types");


const getAllDataHelper = () => {
  return project_type.findAll({})
}

// Function to get all project types
const getAllProjectTypes = async (req, res) => {
  try {
    const data = await getAllDataHelper();
    if (!data) {
      return res.status(404).send({ message: "No project types found" });
    }
    return res.status(200).send(data);
  } catch (error) {
    console.error("Error fetching project types:", error);
    return res.status(500).send({ message: error.message });
  }
};

// Function to get a project type by ID
const getProjectTypeById = async (req, res) => {
  try {
    const data = await project_type.findOne({
      where: { project_type_id: req.params.id },
    });
    if (!data)
      return res.status(404).send({ message: "Project type not found" });
    return res.json(data);
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

// Function to create a new project type
const createProjectType = async (req, res) => {
    try {
        const { project_type_name } = req.body;
        const newProjectType = await project_type.create({ project_type_name });
        const data = await getAllDataHelper();
        if (!data) {
            return res.status(404).send({ message: 'No project types found' });
        }
        return res.status(201).send(data);
    } catch (error) {
        console.error('Error creating project type:', error);
        return res.status(500).send({ message: error.message });
    }
};

// Function to update a project type by ID
const editProjectTypeById = async (req, res) => {
    try {
        const id = req.params.id;
        const { project_type_name } = req.body;

        const projectTypeToUpdate = await project_type.findByPk(id);
        if (!projectTypeToUpdate) return res.status(404).send({ message: 'Project type not found' });

        await projectTypeToUpdate.update({ project_type_name });
        const data = await getAllDataHelper();
        if (!data) {
            return res.status(404).send({ message: 'No project types found' });
        }
        return res.status(200).send(data);
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

// Function to delete a project type by ID
const deleteProjectTypeById = async (req, res) => {
    try {
        const id = req.params.id;
        const projectTypeToDelete = await project_type.findByPk(id);

        if (!projectTypeToDelete) return res.status(404).send({ message: 'Project type not found' });

        await projectTypeToDelete.destroy();
        const data = await getAllDataHelper();
        if (!data) {
            return res.status(404).send({ message: 'No project types found' });
        }
        return res.status(200).send(data);
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

// Exporting the functions
module.exports = {
  getAllProjectTypes,
  getProjectTypeById,
  createProjectType,
  editProjectTypeById,
  deleteProjectTypeById,
};
