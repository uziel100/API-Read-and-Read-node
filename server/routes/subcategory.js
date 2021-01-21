const express = require('express');
const app = express();

const Subcategory = require('../models/Subcategory');
const { checkToken, isAdmin } = require('../middlewares/autentication')

app.get('/subcategory', (err, res) => {
    Subcategory.find()
     .populate("category", "_id name niceName")
     .exec((err, subcategories) => {
        if(err){
            return res.status(500).json({
                status: false,
                message: "Ha ocurrido un error" 
            })
        }

        res.json({
            status: true,
            subcategories
        })
    })
})


app.post('/subcategory', [ checkToken, isAdmin ], (req, res) => {
    const { name, niceName, category } = req.body;

    const newSubcategory = new Subcategory({ name, niceName, category });

    newSubcategory.save( (err, subcategory) => {
        if(err){
            return res.status(500).json({
                status: false,
                message: "Ha ocurrido un error al crear la subcategoria" 
            })
        }

        return res.status(201).json({
            status: true,
            subcategory
        })
    })

})



module.exports = app;