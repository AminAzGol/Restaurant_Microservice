require('dotenv').config()
const express = require('express')
const app = express()


app.use(express.json());

/* Routes */
app.use('/helloworld',(req,res,next) => res.send({msg:"Hello World!"}));
// app.use('/restaurant', require('./routes/restaurant'));
// app.use('/menu', require('./routes/menu'));


/* Error response */
app.use(async (err, req, res, next) => {
    if (err.code && typeof err.code === "number") {
        console.error(err.message)
        res.status(err.code).json({err: err.message})
    } else {
        console.error(err)
        console.log(err.stack)

        if(typeof e === "object")
            err = JSON.stringify(err)
        Notifier.reportBug("internal error: " + err)
        res.status(500).json({msg: "internal error!"})
    }
});

const port = process.env.LISTEN_PORT
app.listen(port, () => console.log(`Listening on port ${port}!`))

export default app;
