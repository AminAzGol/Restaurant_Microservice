var express = require('express')
var router = express.Router()
const Joi = require('@hapi/joi')
const { ErrorWCode } = require('../utils/errors')
const axios = require('axios')
// create menu_item
router.post('/adduser' ,async (req, resp, next) => {
    try {
        const body = req.body
        // try {
        //     Joi.assert(body,Joi.object({
        //         name: Joi.string()
        //     }))
        // } catch (e) {
        //     throw new ErrorWCode(400, e)
        // }
        axios
            .post('http://168.119.166.193:8000/auth/users', {
                username: body.username,
                password:body.password,
                email:body.email,
                role:body.role
            })
            .then(res => {
                console.log(`statusCode: ${res.status}`)
                console.log(res)
                resp.status(res.status).json({msg: res.data})

            })
            .catch(error => {
                console.error(error)
                let response = error.response
                resp.status(response.status).json({msg: response.data})
            })
    } catch (e) {
        next(e);
    }
})


// get all menu_item
router.get('/allusers',async (req , resp , next) =>{
    try {
        axios.get('http://168.119.166.193:8000/auth/users')
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