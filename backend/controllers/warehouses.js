const { warehouse } = require('../models/warehouses');


const getAllDataHelper = () => {
    return warehouse.findAll({})
}

// Function to get all warehouses
const getAllWarehouses = async (req, res) => {
    try {
        const data = await getAllDataHelper();
        if (!data) return res.status(404).send({ message: 'Warehouses not found' });
        return res.json(data);
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

// Function to get a warehouse by ID
const getWarehouseById = async (req, res) => {
    try {
        const data = await warehouse.findOne({ where: { warehouse_id: req.params.id } });
        if (!data) return res.status(404).send({ message: 'Warehouse not found' });
        return res.json(data);
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

// Function to add one warehouse
const addOneWarehouse = async (req, res) => {
    try {
        const { warehouse_name, warehouse_adress } = req.body;
        const newWarehouse = await warehouse.create({
            warehouse_name,
            warehouse_adress
        });
        const data = await getAllDataHelper();
        return res.status(201).json(data);
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

// Function to edit a warehouse by ID
const editWarehouseById = async (req, res) => {
    try {
        const id = req.params.id;
        const { warehouse_name, warehouse_adress } = req.body;
        const warehouseToUpdate = await warehouse.findByPk(id);

        if (!warehouseToUpdate) return res.status(404).send({ message: 'Warehouse not found' });

        await warehouseToUpdate.update({
            warehouse_name,
            warehouse_adress
        });
        const data = await getAllDataHelper();
        return res.json(data);
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

// Function to delete a warehouse by ID
const deleteWarehouseById = async (req, res) => {
    try {
        const id = req.params.id;
        const warehouseToDelete = await warehouse.findByPk(id);

        if (!warehouseToDelete) return res.status(404).send({ message: 'Warehouse not found' });

        await warehouseToDelete.destroy();
        const data = await getAllDataHelper();
        return res.status(200).send(data);
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

// Exporting the functions
module.exports = {
    getAllWarehouses,
    addOneWarehouse,
    editWarehouseById,
    deleteWarehouseById,
    getWarehouseById
};
