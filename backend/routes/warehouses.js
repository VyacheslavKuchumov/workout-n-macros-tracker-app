const express = require('express')
const router = express.Router()


const { getAllWarehouses, addOneWarehouse, deleteWarehouseById, editWarehouseById} = require('../controllers/warehouses')

router.get('/', getAllWarehouses)
router.post('/', addOneWarehouse)
router.delete('/:id', deleteWarehouseById)
router.put('/:id', editWarehouseById)

module.exports = router