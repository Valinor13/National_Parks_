const mongoose = require('mongoose');
const { Schema } = mongoose;

// Class object that communicates with mongodb database
const UserScheme  = new mongoose.Schema({
    username: {
        type: String,
    },
    email: {
        type: String,
        lowercase: true,
    },
    password: String,
    date: {
        type: Date,
        default: Date.now()
    }
 })

 module.exports = mongoose.model("User", UserScheme);