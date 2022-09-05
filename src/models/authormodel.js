
const mongoose = require('mongoose')

const AuthorSchema = new mongoose.Schema({
    fname: {
        type: String,
        required: true
    },
    lname: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true,
        enum: ["Mr", "Mrs", "Miss"]
    },
    email: {
        type: String,
        required: true,
        valid_email: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
},
    { timeStamps: true })


    module.exports = mongoose.model('Author',AuthorSchema)