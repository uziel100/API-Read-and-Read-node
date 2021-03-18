const express = require("express");
const app = express();

const Comment = require("../models/Comment");
const Encrytion = require("../clases/Encryption");
const information = new Encrytion();

app.get('/comment', (req, res) => {
    Comment.find({})
	.sort({ _id: -1 })
	.exec((err, comments) => {
        if(err) {
            return res.status(500).json({
                status:false,
                message: 'Ha ocurrido un error'
            })
        }
        res.json({
            status: true,
            data: comments
        })
    })
})

app.get('/comment/book/:id', (req, res) => {
    const { id } = req.params;
    
    Comment.find({ book: id })
    .populate("user", "email photo")
	.sort({ _id: -1 })
	.exec((err, comments) => {
        if(err) {
            return res.status(500).json({
                status:false,
                message: 'Ha ocurrido un error'
            })
        }


        res.json({
            status: true,
            data: comments
        })
    })
})

app.get('/comment/user/:id', (req, res) => {
    const { id } = req.params;
    
    Comment.find({ user: id })
    .populate("book", "imgUrl title")
	.sort({ _id: -1 })
	.exec((err, comments) => {
        if(err) {
            return res.status(500).json({
                status:false,
                message: 'Ha ocurrido un error'
            })
        }


        res.json({
            status: true,
            data: comments
        })
    })
})





module.exports = app;