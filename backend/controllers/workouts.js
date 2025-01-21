const { Workout } = require('../models/workouts')

// get all workouts
const getWorkouts = async (req, res) => {
    try {
        const workouts = await Workout.findAll()
        res.status(200).json(workouts)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}


// create workout
const createWorkout = async (req, res) => {
    try {
        const { workout_name, workout_date, user_uid } = req.body
        const workout = await Workout.create({ workout_name, workout_description, workout_date, user_uid })
        res.status(201).json(workout)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

// update workout
const updateWorkout = async (req, res) => {
    try {
        const { workout_id, workout_name, workout_date, user_uid } = req.body
        const workout = await Workout.findByPk(workout_id)
        if (!workout) return res.status(404).send({ message: 'Workout not found' })
        await workout.update({ workout_name, workout_description, workout_date, user_uid })
        return res.status(200).send({ message: 'updated' })
    } catch (error) {
        return res.status(500).send({ message: error.message })
    }
}

// delete workout
const deleteWorkout = async (req, res) => {
    try {
        const workout_id = req.params?.id
        const workout = await Workout.findByPk(workout_id)
        if (!workout) return res.status(404).send({ message: 'Workout not found' })
        await workout.destroy()
        return res.status(200).send({ message: 'deleted' })
    } catch (error) {
        return res.status(500).send({ message: error.message })
    }
}



module.exports = {
    getWorkouts,
    createWorkout,
    updateWorkout,
    deleteWorkout
}
