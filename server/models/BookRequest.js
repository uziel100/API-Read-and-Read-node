const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let bookRequestSchema = Schema(
    {
        user: {
            ref: "User",
            type: Schema.Types.ObjectId,
            required: [true, "El usuario es obligatorio"],
        },
        title: {
            type: String,
            required: true,
        },
        authors:{
            type: String,            
            default: false
        },
        publisher:{
            type: String,            
            default: false
        }
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

module.exports = mongoose.model('BookRequest', bookRequestSchema );
