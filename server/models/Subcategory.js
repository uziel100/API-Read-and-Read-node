const mongoose = require('mongoose');
const unique = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let subcategorySchema = new Schema({
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
    category: {
        ref: "Category",
        type: Schema.Types.ObjectId
    }
},{
    timestamps: true,
    versionKey: false
})

subcategorySchema.plugin(unique, { message: "{PATH} debe ser unico" });
module.exports = mongoose.model('Subcategory', subcategorySchema)