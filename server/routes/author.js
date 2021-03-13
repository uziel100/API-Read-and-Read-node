const express = require("express");
const { checkToken, isAdmin } = require("../middlewares/autentication");
const app = express();

const Author = require("../models/Author");

app.get('/author', (req, res) => {
    Author.find({}, "name about _id")
	.sort({ _id: -1 })
	.exec((err, authors) => {
        if(err) {
            return res.status(500).json({
                status:false,
                message: 'Ha ocurrido un error'
            })
        }
        res.json({
            status: true,
            data: authors
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

app.put('/author/:id', (req, res) => {
    const { id } = req.params;
    const { name, about } = req.body;
    

    Author.findByIdAndUpdate(
        id, 
        { name, about },
        { new: true, runValidators: true },
        (err) => {
        if(err) {
            return res.status(500).json({
                status:false,
                message: 'No exise el elemento que quiere actualizar'
            })
        }
        res.json({
            status: true,
            message: 'Datos actualizados :)'
        })
    })
})

app.delete('/author/:id', (req, res) => {
    const { id } = req.params;    
    

    Author.findByIdAndRemove(id,         
        (err) => {
        if(err) {
            return res.status(500).json({
                status:false,
                message: 'Ha ocurrido un error al eliminar el autor'
            })
        }
        res.json({
            status: true,
            message: 'Eliminado correctamente :)'
        })
    })
})


module.exports = app;