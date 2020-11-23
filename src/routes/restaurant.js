var express = require('express')
var router = express.Router()

router.post('/create' ,async (req, res, next) => {
    try {
        // const id = await followReq(req.user.userId, req.body.target_user);
        // const retval = {
        //     msg: "follow request sent",
        //     followReqId: id
        // }
        // res.json(retval)
    } catch (e) {
        next(e);
    }
})