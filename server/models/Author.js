const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let authorSchema = new Schema({
    name: {
        type: String,
        required: [true, "El nombre es obligatorio"]
    },
    about: {
        type: String,
        required: [true, "La descripción del autor es obligatorio"]
    },
},
{
    timestamps: true,
    versionKey: false
})


module.exports = mongoose.model('Author', authorSchema)