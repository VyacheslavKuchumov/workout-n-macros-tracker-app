const express = require('express')
const router = express.Router()
const { authJwt } = require('../middlewares/auths')

const { getExercises, createExercise, updateExercise, deleteExercise } = require('../controllers/exercises')

router.get('/', [authJwt.verifyToken], getExercises)
router.post('/', [authJwt.verifyToken], createExercise)
router.put('/', [authJwt.verifyToken], updateExercise)
router.delete('/:id', [authJwt.verifyToken], deleteExercise)



module.exports = router