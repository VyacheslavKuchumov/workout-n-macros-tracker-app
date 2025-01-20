const express = require('express');
const router = express.Router();

const {
    getAllSetTypes,
    getSetTypeById,
    createSetType,
    editSetTypeById,
    deleteSetTypeById
} = require('../controllers/set_types');

router.get('/', getAllSetTypes);
router.get('/:id', getSetTypeById);
router.post('/', createSetType);
router.put('/:id', editSetTypeById);
router.delete('/:id', deleteSetTypeById);

module.exports = router;
