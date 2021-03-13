const mongoose = require('mongoose');
const unique = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let categorySchema = new Schema({
    name:{
        type: String,
        required: true,
        unique: true
    },
    niceName:{
        type: String,
        required: true,
        unique: true
    },
    img:{
        type: String,
        required: false
    }
},{
    timestamps: true,
    versionKey: false
})

categorySchema.plugin(unique, { message: "{PATH} debe ser unico" });
module.exports = mongoose.model('Category', categorySchema)