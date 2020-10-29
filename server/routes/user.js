const express = require('express')
const app = express();

const User = require('../models/User');
const { encodigData }  = require('../middlewares/encript')
const Escitala = require('../clases/Escitala');

app.get('/user', (req, res) => {    
    const encrypt = new Escitala( process.env.CLAVE );

    User.find((err, users) => {
        if(err){
            return res.status(400).json({
                status: false,
                message: err
            })
        }

        const userMap = users.map( user => {            
            user.name = encrypt.decodingMessage( user.name );
            user.email = encrypt.decodingMessage( user.email );
            user.password = encrypt.decodingMessage( user.password );
            user.address = encrypt.decodingMessage( user.address );
            user.phone = encrypt.decodingMessage( user.phone );
            user.date = encrypt.decodingMessage( user.date );
            user.sexo = encrypt.decodingMessage( user.sexo );

            return user;

        })       

        res.json({
            status: true,
            users: userMap
        })

    })

    
});

app.post('/user', encodigData,  (req, res) => {
    const body = req.user;        

    const user  = new User({
        name: body.name,
        email: body.email,
        password: body.password,
        address: body.address,
        phone: body.phone,
        date: body.date,
        sexo: body.sexo
    })
    
    user.save( (err, userDb) => {
        if(err){
            return res.status(400).json({
                status: false,
                message: err
            })
        }

        res.json({
            status: true,
            message: 'Usuario registrado'
        })

    })

})


module.exports = app;