const { Workout } = require('../models/workouts')

function russianToIsoDate(russianDate) {
    // Check if the input is a valid Russian date string
    if (!russianDate || typeof russianDate !== "string") {
        throw new Error("Invalid input. Please provide a valid Russian date string.");
    }

    // Split the Russian date string into parts
    const [day, month, year] = russianDate.split(".");

    // Validate the extracted values
    if (!day || !month || !year || isNaN(Date.parse(`${year}-${month}-${day}`))) {
        throw new Error("Invalid Russian date format.");
    }

    // Return the date in ISO format
    return `${year}-${month}-${day}`;
}
// get all workouts
const getWorkouts = async (req, res) => {
    try {
        const user_uid = req.params?.id
        const workouts = await Workout.findAll({where: {user_uid} , order: [['workout_date', 'DESC']],})
        res.status(200).json(workouts)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}


// create workout
const createWorkout = async (req, res) => {
    try {
        const { workout_name, workout_date, user_uid } = req.body
        const workout = await Workout.create({ workout_name, user_uid,  workout_date: russianToIsoDate(workout_date)})
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
        await workout.update({ workout_name, workout_date: russianToIsoDate(workout_date), user_uid })
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
