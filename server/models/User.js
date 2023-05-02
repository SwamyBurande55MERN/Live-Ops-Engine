const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({

    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    role: {
        type: String,
        default: 'player'
    },
    country: {
        type: String,
        default: 'IN'
    },
    coins:{
        type: Number,
        default: 1000
    },
    gems:{
        type: Number,
        default: 50
    },
    level: {
        type: Number,
        default: 0
    },
    purchaser:{
        type: Boolean,
        default: false
    }
}, {timestamps: true});

const User = mongoose.model('users', userSchema);
module.exports = User;
    