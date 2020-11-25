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
router.put('/menu/:menu_id' ,async (req, res, next) => {
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
        let queryGet = db.generateQueryGet("menu_item","*",{id : menu_id})
        let getResult = db.execQuery(queryGet)
        if (condition) {
            const query = db.generateQueryUpdateOne('menu_item', body ,{id : menu_id})
            const result = db.execQuery(query)
            res.status(200).json({msg: "new menu_item added"})
        } else {
            res.status(404).json({msg : "item not found"})
        }
    } catch (e) {
        next(e);
    }
})

router.delete('/menu/:menu_id' ,async (req, res, next) => {
    try {
        //TODO: shoud get restaurant id then use it in WHERE clause of delete statement
        
        const menu_id = req.params.menu_id
        let queryGet = db.generateQueryGet("menu_item","*",{id : menu_id})
        let getResult = db.execQuery(queryGet)
        if (getResult) {
            const query = db.generateQueryDeleteOne('menu_item', {id : menu_id})
            const result = db.execQuery(query)    
            res.status(200).json({msg: "menu_item deleted"})
        }else {
            res.status(404).json({msg : "item not found"})
        }
        
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