const express = require('express')
const router = express.Router()


const { getAllEquipmentInShooting, addEquipmentToShooting, deleteEquipmentFromShooting, changeFlag } = require('../controllers/shooting_equipment')


router.get('/search/:id', getAllEquipmentInShooting)
router.post('/', addEquipmentToShooting)
router.put('/flag/:id', changeFlag)
router.delete('/:id', deleteEquipmentFromShooting)


module.exports = router