const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let loggingSchema = new Schema({
    type:{
        type: String,
        required: [true, "El tipo es obligatorio"]
    },
    description: {
        type: String,
        required: false
    },
    ip: {
        type: String,
        required: false
    },
    user: {
        type: String,
        required: false
    },
},
{
    timestamps: true,
    versionKey: false
})


module.exports = mongoose.model('Logging', loggingSchema)