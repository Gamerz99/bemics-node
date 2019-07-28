const jwt = require('jsonwebtoken')
module.exports.ensureToken = function (req, res, next) {
    if (!req.headers.authorization) {
        return res.status(401).send({ 'message': 'Unauthorized request' })
    }
    let token = req.headers.authorization.split(' ')[1]
    if (token === null) {
        return res.status(401).send({ 'message': 'Unauthorized request' })
    }
    let payload = jwt.verify(token, 'bemicskey')
    if (!payload) {
        return res.status(401).send({ 'message': 'Unauthorized request' })
    }
    req.userId = payload.subject
    next();
}