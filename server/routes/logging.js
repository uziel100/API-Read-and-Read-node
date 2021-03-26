const express = require("express");
const { checkToken, isAdmin } = require("../middlewares/autentication");
const app = express();

const Logger = require("../models/Logging");

app.get('/logging', [ checkToken, isAdmin ] ,(req, res) => {
   Logger.find({})
	.sort({ _id: -1 })
	.exec((err, logs) => {
        if(err) {
            return res.status(500).json({
                status:false,
                message: 'Ha ocurrido un error al recuperar los logs'
            })
        }
        res.json({
            status: true,
            data: logs
        })
    })
})




module.exports = app;