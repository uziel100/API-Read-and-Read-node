const express = require("express");
const app = express();

const Feedback = require("../models/Feedback.js");

app.get('/feedback', (req, res) => {
    Feedback.find((err, comments) => {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Ha ocurrido un error'
            })
        }
        res.json({
            status: true,
            comments
        })
    })
})

app.post('/feedback', (req, res) => {
    const { name, email, phone, comment } = req.body;

    let newFeedback = new Feedback({ name, email, phone, comment })

    newFeedback.save((err, feedback) => {
        if (err) {
            return res.status(500).json({
                status: false,
                message: "Error en la conexion con el servidor",
            })
        }

        res.json({
            status: true,
            message: "Envío exitoso",
            feedback,
        })
    })
})


module.exports = app;