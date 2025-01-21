
const { Exercise } = require('../models/exercises')

// get all exercises
const getExercises = async (req, res) => {
  try {
    const exercises = await Exercise.findAll()
    res.json(exercises)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// create exercise
const createExercise = async (req, res) => {
    try {
        const { exercise_name, exercise_description, muscle_group } = req.body
        const exercise = await Exercise.create({ exercise_name, exercise_description, muscle_group })
        res.status(201).json(exercise)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

// update exercise
const updateExercise = async (req, res) => {
  try {
    const { exercise_id, exercise_name, exercise_description, muscle_group } = req.body
    const exercise = await Exercise.findByPk(exercise_id)
    if (!exercise) return res.status(404).send({ message: 'Exercise not found' })
    await exercise.update({ exercise_name, exercise_description, muscle_group })
    return res.status(200).send({ message: 'updated' })
  } catch (error) {
    return res.status(500).send({ message: error.message })
  }
}

// delete exercise
const deleteExercise = async (req, res) => {
    try {
        const exercise_id = req.params?.id
        const exercise = await Exercise.findByPk(exercise_id)
        if (!exercise) return res.status(404).send({ message: 'Exercise not found' })
        await exercise.destroy()
        return res.status(200).send({ message: 'deleted' })
    } catch (error) {
        return res.status(500).send({ message: error.message })
    }
}



module.exports = {
    getExercises,
    createExercise,
    updateExercise,
    deleteExercise
}
