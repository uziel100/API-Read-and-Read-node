const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let wishlistSchema = new Schema({
    userId: {
        ref: 'User',
        type: Schema.Types.ObjectId,
        required: [true, "El usuario es obligatorio"]
    },
    bookId: {
        ref: 'Book',
        type: Schema.Types.ObjectId,
        required: [true, "La libro es obligatorio"]
    },
},
{
    timestamps: true,
    versionKey: false
})


module.exports = mongoose.model('Wishlist', wishlistSchema )