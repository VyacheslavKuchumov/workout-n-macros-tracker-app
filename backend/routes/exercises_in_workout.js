const express = require('express')
const router = express.Router()
const { authJwt } = require('../middlewares/auths')

const { getExercisesInWorkout, createExerciseInWorkout, updateExerciseInWorkout, deleteExerciseInWorkout } = require('../controllers/exercises_in_workout')

router.get('/:id', [authJwt.verifyToken], getExercisesInWorkout)
router.post('/', [authJwt.verifyToken], createExerciseInWorkout)
router.put('/', [authJwt.verifyToken], updateExerciseInWorkout)
router.delete('/:id', [authJwt.verifyToken], deleteExerciseInWorkout)


module.exports = router