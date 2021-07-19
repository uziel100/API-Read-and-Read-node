const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let userBookSchema = Schema(
    {
        user: {
            ref: "User",
            type: Schema.Types.ObjectId,
            required: [true, "El usuario es obligatorio"],
        },
        book: {
            ref: "Book",
            type: Schema.Types.ObjectId,
            required: [true, "El identificador del libros es obligatorio"],
        },
        currentPage: {
            type: Number,
            default: 1
        },
        favorite:{
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

module.exports = mongoose.model('UserBook', userBookSchema );
