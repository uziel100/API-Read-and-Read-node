const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let commentSchema = new Schema({
    book:{
        ref: 'Book',
        type: Schema.Types.ObjectId
    },
    user:{
        ref: 'User',
        type: Schema.Types.ObjectId
    },
    content:{
        type: String,
        required: [true, "La comentario es obligatorio"],
    },
    score:{
        type: Number,
        required: [true, "El puntaje es obligatorio"],
    },
},{
    timestamps: true,
    versionKey: false
})


module.exports = mongoose.model('Comment', commentSchema)