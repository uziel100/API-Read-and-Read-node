const mongoose = require('mongoose');
const unique = require('mongoose-unique-validator')


let Schema = mongoose.Schema;

let userSchema = new Schema({
    name: {
        type: String,
        required: [false, "El nombre es obligatorio"]
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
        required: [false, "La dirección es obligatorio"]
    },
    phone: {
        type: String,        
        required: [false, "El telefono es obligatorio"]
    },
    birthDate: {
        type: String,
        required: [false, "La fecha de nacimiento es obligatorio"]
    },
    gender: {
        type: String,
        required: [false, "El sexo es obligatorio"]
    }        
})


userSchema.plugin( unique, { message: '{PATH} debe ser unico' } );
module.exports = mongoose.model('User', userSchema );