const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let saleOrderSchema = new Schema({
    user:{
        ref: 'User',
        type: Schema.Types.ObjectId,
        required: [true, "El usuario es obligatorio"]      
    },
    product:{
        ref: 'Book',
        type: Schema.Types.ObjectId,
        required: [true, "El identificador del libros es obligatorio"]      
    },
    paymentId:{
        type: String,
        required: [true, "El id del pago es obligatorio"]      
    },
    totalPayment: {
        type: Number,
        required: [true, "El precio total es obligatorio"]      
    },
    priceProduct:{
        type: Number,
        required: [true, "El precio total es obligatorio"]      
    },
    postalCode:{
        type: String,
        required: [true, "El código postal es obligatorio"]      
    },
    country:{
        type: String,
        required: [true, "El país es obligatorio"]      
    },
    state:{
        type: String,
        required: [true, "El estado es obligatorio"]      
    }

},{
    timestamps: true,
    versionKey: false
})

module.exports = mongoose.model('SaleOrder', saleOrderSchema );