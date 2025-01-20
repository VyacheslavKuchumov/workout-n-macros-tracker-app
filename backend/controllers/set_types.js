const { set_type } = require('../models/set_types');

const getAllDataHelper = () => {
    return set_type.findAll({})
}

// Function to get all set types
const getAllSetTypes = async (req, res) => {
    try {
        const data = await getAllDataHelper();
        if (!data) {
            return res.status(404).send({ message: 'No set types found' });
        }
        return res.status(200).send(data);
    } catch (error) {
        console.error('Error fetching set types:', error);
        return res.status(500).send({ message: error.message });
    }
};

// Function to get a set type by ID
const getSetTypeById = async (req, res) => {
    try {
        const data = await set_type.findOne({ where: { set_type_id: req.params.id } });
        if (!data) return res.status(404).send({ message: 'Set type not found' });
        return res.json(data);
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

// Function to create a new set type
const createSetType = async (req, res) => {
    try {
        const { set_type_name } = req.body;
        const newSetType = await set_type.create({ set_type_name });
        const data = await getAllDataHelper();
        if (!data) {
            return res.status(404).send({ message: 'No set types found' });
        }
        return res.status(201).send(data);
    } catch (error) {
        console.error('Error creating set type:', error);
        return res.status(500).send({ message: error.message });
    }
};

// Function to update a set type by ID
const editSetTypeById = async (req, res) => {
    try {
        const id = req.params.id;
        const { set_type_name } = req.body;

        const setTypeToUpdate = await set_type.findByPk(id);
        if (!setTypeToUpdate) return res.status(404).send({ message: 'Set type not found' });

        await setTypeToUpdate.update({ set_type_name });
        const data = await getAllDataHelper();
        if (!data) {
            return res.status(404).send({ message: 'No set types found' });
        }
        return res.status(200).send(data);
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

// Function to delete a set type by ID
const deleteSetTypeById = async (req, res) => {
    try {
        const id = req.params.id;
        const setTypeToDelete = await set_type.findByPk(id);

        if (!setTypeToDelete) return res.status(404).send({ message: 'Set type not found' });

        await setTypeToDelete.destroy();
        const data = await getAllDataHelper();
        if (!data) {
            return res.status(404).send({ message: 'No set types found' });
        }
        return res.status(200).send(data);
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

// Exporting the functions
module.exports = {
    getAllSetTypes,
    getSetTypeById,
    createSetType,
    editSetTypeById,
    deleteSetTypeById
};
