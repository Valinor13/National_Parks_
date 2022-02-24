const mongoose = require('mongoose');
const { Schema } = mongoose;

// Class object that communicates with mongodb database
const DataScheme  = new mongoose.Schema({
    title: {
        type: String
    },
    index: {
        type: Number
    },
    data: {
        type: String
    }
})

module.exports = mongoose.model("Data", DataScheme);
