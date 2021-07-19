const express = require("express");
const { checkToken, isAdmin,  } = require("../middlewares/autentication");
const BookRequest = require('../models/BookRequest');
const app = express();

app.post('/book-request', checkToken ,async (req, res ) => {
    const { title, authors, publisher } = req.body;
    const { _id: user } = req.user;
    
    try {

        const request = new BookRequest({  
            user,
            title,
            authors,
            publisher
        });

        await request.save();
        res.json({
            status: true,  
            message: 'Operación exitosa'          
        })

    } catch (error) {
        res.status(500).json({
            status: false,            
            msg: 'Ha ocurrido un error'
        })
    }
})

app.get('/book-request', async (req, res ) => {    
    try {
        const data = await BookRequest.find();        

        res.json({
            status: true,  
            data
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: false,            
            msg: 'Ha ocurrido un error'
        })
    }
})

module.exports = app;