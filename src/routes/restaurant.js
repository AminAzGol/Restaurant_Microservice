var express = require('express')
var router = express.Router()
const Joi = require('@hapi/joi')
const { ErrorWCode } = require('../utils/errors')
const { DB } = require('../db')
const db = new DB()
router.post('/create' ,async (req, res, next) => {
    try {
        const body = req.body
        try {
            Joi.assert(body,Joi.object({
                name: Joi.string()
            }))
        } catch (e) {
            throw new ErrorWCode(400, e)
        }
        const query = db.generateQueryInsertOne('restaurant', body)
        const result = db.execQuery(query)
        res.status(200).json({msg: "restaurant created"})
    } catch (e) {
        next(e);
    }
})

module.exports = router