const mongoose = require("mongoose");

let Schema = mongoose.Schema;

let feedbackSchema = new Schema({
    name: {
        type: String,
        required: [true, "El nombre es obligatorio"],
    },
    email: {
        type: String,
        required: [true, "El email es obligatorio"],
    },
    phone: {
        type: String,
        required: [true, "El telefono es obligatorio"],
    },
    comment: {
        type: String,
        required: [true, "El comentario es obligatorio"],
    },
}, {
    timestamps: true,
    versionKey: false
});


module.exports = mongoose.model("Feedback", feedbackSchema);