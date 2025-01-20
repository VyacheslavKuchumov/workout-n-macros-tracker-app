const express = require('express')
const router = express.Router()
const { verifySignUp } = require('../middlewares/auths')

const controller = require('../controllers/auths')

router.post('/signup', [verifySignUp.checkDuplicateEmail], controller.signup)
router.post('/signin', controller.signin)
router.post('/changeAccess', controller.changeAccess)

module.exports = router