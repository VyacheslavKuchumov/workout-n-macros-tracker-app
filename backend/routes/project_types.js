const express = require('express');
const router = express.Router();

const {
    getAllProjectTypes,
    getProjectTypeById,
    createProjectType,
    editProjectTypeById,
    deleteProjectTypeById
} = require('../controllers/project_types');

router.get('/', getAllProjectTypes);
router.get('/:id', getProjectTypeById);
router.post('/', createProjectType);
router.put('/:id', editProjectTypeById);
router.delete('/:id', deleteProjectTypeById);

module.exports = router;
