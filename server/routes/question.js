const express = require('express');
const { NetworkAccessProfileInstance } = require('twilio/lib/rest/supersim/v1/networkAccessProfile');
const Question = require('../models/Question');
const app = express();

app.get('/question', (req, res) => {
    Question.find((err, data) => {
        if(err){
            return res.status(500).json({
                status: false,
                message: 'Ha ocurrido un error en el servidor'
            })
        }

        res.json({
            status: true,
            data
        })
    })
})

app.post('/question', (req, res) => {
    const { name } = req.body;

    const newQuestion = new Question({ name });

    newQuestion.save( (err, question) => {
        if(err){
            return res.status(500).json({
                status: false,
                message: 'Ha ocurrido un error en el servidor'
            })
        }

        res.json({
            status: true,
            message: 'Pregunta registrada :)',
            question
        })
    })

})


module.exports = app;