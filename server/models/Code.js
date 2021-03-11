const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let codeSchema = new Schema({
    code:{
        type: String,
        required: true,        
    }    
},{
    timestamps: true,
    versionKey: false
})

module.exports = mongoose.model('Code', codeSchema );