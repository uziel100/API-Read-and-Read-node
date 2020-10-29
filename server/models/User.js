const mongoose = require('mongoose');
const unique = require('mongoose-unique-validator')


let Schema = mongoose.Schema;

let userSchema = new Schema({
    name: {
        type: String,
        required: [true, "El nombre es obligatorio"]
    },
    email:{
        type: String,
        unique: true,
        required: [true, "El email es obligatorio"]
    },
    password: {
        type: String,
        required: [true, "La contraseña es obligatorio"]
    },
    address: {
        type: String,
        required: [true, "La dirección es obligatorio"]
    },
    phone: {
        type: String,
        required: [true, "El telefono es obligatorio"]
    },
    date: {
        type: String,
        required: [true, "La fecha de nacimiento es obligatorio"]
    },
    sexo: {
        type: String,
        required: [true, "El sexo es obligatorio"]
    }        
})


userSchema.plugin( unique, { message: '{PATH} debe ser unico' } );
module.exports = mongoose.model('User', userSchema );