const { auth } = require('../../models/auths')

checkDuplicateEmail = async (req, res, next) => {

    const authed = await auth.findOne({ where: { email: req.body.email.toLowerCase() } })
    if (authed) return res.status(405).send({ message: 'Email is already use!' })
    next()
}

const verifySignUp = {
    checkDuplicateEmail
}

module.exports = verifySignUp