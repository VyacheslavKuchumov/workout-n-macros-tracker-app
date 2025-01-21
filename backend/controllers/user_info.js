const { User_info } = require('../models/user_info')

const createUserInfo = async (req, res) => {
    
    try {
        const { user_uid, sex, weight, height, date_of_birth} = req.body
        const user_info = await User_info.create({
            user_uid: user_uid,
            sex: sex,
            weight: weight,
            height: height,
            date_of_birth: date_of_birth
        })
        return res.status(201).send({ message: 'created', user_info: user_info })
    } catch (error) {
        return res.status(500).send({ message: error.message })
    }
}

// get user info by uuid
const getUserInfo = async (req, res) => {
    try {
        const user_uid = req.params?.uid
        
        const user_info = await User_info.findOne({ where: { user_uid: user_uid } })

        if (!user_info) return res.status(500).send({ message: 'User not found' })
        return res.json(user_info)
    } catch (error) {
        return res.status(500).send({ message: error.message })
    }
}

const updateUserInfo = async (req, res) => {
    const { user_uid, name, weight, height, date_of_birth, sex } = req.body
    try {
        const found_user_info = await User_info.findOne({ where: { user_uid: user_uid } })
        await found_user_info.update({ 
            name: name, 
            age: age, 
            weight: weight, 
            height: height, 
            date_of_birth: date_of_birth, 
            sex: sex
        })
        return res.status(200).send({ message: 'updated' })
    } catch (error) {
        return res.status(500).send({ message: error.message })
    }
}


module.exports = {
    getUserInfo,
    updateUserInfo,
    createUserInfo
}
