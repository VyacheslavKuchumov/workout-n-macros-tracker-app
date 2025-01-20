const jwt = require('jsonwebtoken')
require('dotenv').config()
const secret = process.env.SECRET

const verifyToken = (req, res, next) => {
    let token = req.headers["x-access-token"]
    if (!token) return res.status(401).send({ message: 'No token provided' })
    jwt.verify(token, secret, function (err, decoded) {
        if (err) return res.status(403).send({ message: 'Unauthorized' })
        req.userUid = decoded.uid
        next()
    })
}

const authJwt = {
    verifyToken
}
module.exports = authJwt