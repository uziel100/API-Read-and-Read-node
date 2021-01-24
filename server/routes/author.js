const express = require("express");
const { checkToken, isAdmin } = require("../middlewares/autentication");
const app = express();

const Author = require("../models/Author");

app.get('/author', (req, res) => {
    Author.find( (err, authors) => {
        if(err) {
            return res.status(500).json({
                status:false,
                message: 'Ha ocurrido un error'
            })
        }
        res.json({
            status: true,
            authors
        })
    })
})

app.post('/author', (req, res) => {
    const { name, about } = req.body;
    
    let newAuthor = new Author({ name, about })

    newAuthor.save( (err, author) => {
        if(err) {
            return res.status(500).json({
                status:false,
                message: 'Ha ocurrido un error o al autor ya ha sido registrado'
            })
        }
        res.json({
            status: true,
            author
        })
    })
})


module.exports = app;