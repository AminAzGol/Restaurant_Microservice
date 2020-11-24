var express = require('express')
var router = express.Router()
const Joi = require('@hapi/joi')
const { ErrorWCode } = require('../utils/errors')
const { DB } = require('../db')
const db = new DB()
// create menu_item
router.post('/menu' ,async (req, res, next) => {
    try {
        const body = req.body
        try {
            Joi.assert(body,Joi.object({
                name: Joi.string()
            }))
        } catch (e) {
            throw new ErrorWCode(400, e)
        }
        const query = db.generateQueryInsertOne('menu_item', body)
        const result = db.execQuery(query)
        res.status(200).json({msg: "new menu_item added"})
    } catch (e) {
        next(e);
    }
})

// update menu
router.post('/menu/:menu_id' ,async (req, res, next) => {
    try {
        const body = req.body
        const menu_id = req.params.menu_id
        try {
            Joi.assert(body,Joi.object({
                name: Joi.string()
            }))
        } catch (e) {
            throw new ErrorWCode(400, e)
        }
        const query = db.generateQueryInsertOne('menu_item', body)
        const result = db.execQuery(query)
        res.status(200).json({msg: "new menu_item added"})
    } catch (e) {
        next(e);
    }
})


// get all menu_item
router.get('/menu',async (req , resp , next) =>{
    try {
        //TODO: should get restaurant id from req .. that set using login

        let query = db.generateQueryGet('menu_item',['name','amount','description'])
        let result = db.execQuery(query)
        res.status(200).json({msg : "menu fetched from database successfully :D", data : result})
    } catch (error) {
        next(error)
    }
})



module.exports = router