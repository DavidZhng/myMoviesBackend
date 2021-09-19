const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../keys')
const mongoose = require('mongoose')
let User = require('../models/user.model');

module.exports = (req, res, next) => {
    const {authorization} = req.headers
    if (!authorization) {
        return res.status(401).json({error: "must be logged in"})
    }
    const token = authorization.split(' ')[1];
    console.log(token)
    jwt.verify(token, JWT_SECRET, (err, payload) => {
        console.log(token == JWT_SECRET)
        if (err) {
            return res.status(401).json({error: "must be logged in"})
        }
        const {_id} = payload
        User.findById(_id).then(userData => {
            req.user = userData
        })
        next()
    })
}