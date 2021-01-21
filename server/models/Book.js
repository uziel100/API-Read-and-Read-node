const mongoose = require('mongoose');
const unique = require('mongoose-unique-validator');


let Schema = mongoose.Schema;

let bookSchema = new Schema({
    ISBN: {
        type: String,
        required: [true, "El ISBN es obligatorio"],
        unique: true
    },
    title: {
        type: String,
        required: [true, "El titulo es obligatorio"],
        unique: true
    },
    summary: {
        type: String,
        required: [true, "El resumen es obligatorio"]
    },
    imgUrl: {
        type: String,
        required: false
    },
    lang: {
        type: String,
        required: [true, "El idioma es obligatorio"]
    },
    numPages: {
        type: Number,
        required: [true, "El numero de paginas es obligatorio"]
    },
    sizeFile: {
        type: String,
        required: [true, "El tamaño del archivo es obligatorio"]
    },
    price: {
        type: Number,
        required: [true, "El precio es obligatorio"]
    },
    author: [
        {
            ref: "Author",
            type: Schema.Types.ObjectId
        }
    ],
    publisher: {
        type: String,
        required: true
    },
    category: {
        ref: 'Category',
        type: Schema.Types.ObjectId
    },
    subCategory: {
        ref: 'Subcategory',
        type: Schema.Types.ObjectId
    },    
    status: {
        type: Boolean,
        default: true
    },
    score: {
        _1Start: {
            type: Number,
            default: 0        
        },
        _2Start: {
            type: Number,
            default: 0            
        },
        _3Start: {
            type: Number,  
            default: 0          
        },
        _4Start: {
            type: Number,
            default: 0            
        },
        _5Start: {
            type: Number, 
            default: 0           
        },
        required: false
    },
    tags: {
        type: Array,
        required: [true, "Los tags son obligatorios"]
    }
},
{
  timestamps: true,
  versionKey: false  
})

module.exports = mongoose.model("Book", bookSchema )