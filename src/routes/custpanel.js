var express = require('express')
var router = express.Router()
const Joi = require('@hapi/joi')
const { ErrorWCode } = require('../utils/errors')
const axios = require('axios')


// get all menu_item
router.get('/orderlist',async (req , resp , next) =>{
    try {
        axios.get('http://168.119.166.193:8002/customer/order')
                .then(function (response) {
                    console.log(response);
                    resp.status(response.status).json({data : response.data})
                })
                .catch(function (error) {
                    console.error(error)
                    let response = error.response
                    resp.status(response.status).json({msg: response.data})
                })
    } catch (error) {
        next(error)
    }
})

module.exports = router