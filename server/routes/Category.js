const express = require('express');
const Category = require('../models/Category');
const { checkToken, isAdmin } = require('../middlewares/autentication')

const app = express();

app.get('/category', (req, res) => {
    Category.find( (err, categories) => {
        if(err){
            return res.status(500).json({
                status: false,
                message: "Ha ocurrido un error" 
            })
        }

        return res.json({
            status: true,
            categories
        })
    })
})

app.get('/category/:id', (req, res) => {
    const idCategory = req.params.id;

    Category.findById( idCategory, (err, category) => {
        if(err){
            return res.status(404).json({
                status: false,
                message: "La categoria no existe" 
            })
        }

        return res.json({
            status: true,
            category
        })
    })
})

app.post('/category', [ checkToken, isAdmin ], (req, res) => {
    const { name, niceName } = req.body;

    const newCategory = new Category({ name, niceName });

    newCategory.save( (err, category) => {
        if(err){
            return res.status(500).json({
                status: false,
                message: "Ha ocurrido un error al crear la categoria" 
            })
        }

        return res.status(201).json({
            status: true,
            category
        })
    })

})

app.put('/category', [ checkToken, isAdmin ], (req, res) => {
    const { name, niceName } = req.body;

    const newCategory = new Category({ name, niceName });

    newCategory.save( (err, category) => {
        if(err){
            return res.status(500).json({
                status: false,
                message: "Ha ocurrido un error al crear la categoria" 
            })
        }

        return res.status(201).json({
            status: true,
            category
        })
    })

})

module.exports = app;