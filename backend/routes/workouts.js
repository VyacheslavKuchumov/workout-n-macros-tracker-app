const express = require('express')
const router = express.Router()
const { authJwt } = require('../middlewares/auths')

const { getWorkouts, createWorkout, updateWorkout, deleteWorkout } = require('../controllers/workouts')

router.get('/', [authJwt.verifyToken], getWorkouts)
router.post('/', [authJwt.verifyToken], createWorkout)
router.put('/', [authJwt.verifyToken], updateWorkout)
router.delete('/:id', [authJwt.verifyToken], deleteWorkout)


module.exports = router