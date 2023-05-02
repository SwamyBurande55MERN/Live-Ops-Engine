const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({

    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image:{
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    }
}, {timestamps: true});

const Product = mongoose.model('products', productSchema);
module.exports = Product;