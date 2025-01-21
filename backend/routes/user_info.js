const express = require('express')
const router = express.Router()
const { authJwt } = require('../middlewares/auths')

const { createUserInfo, getUserInfo, updateUserInfo } = require('../controllers/user_info')

router.get('/:uid', [authJwt.verifyToken], getUserInfo)
router.put('/', [authJwt.verifyToken], updateUserInfo)
router.post('/', [authJwt.verifyToken], createUserInfo)



module.exports = router