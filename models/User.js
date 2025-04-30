const mongoose = require ('mongoose');

const schema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    goalWeight:{
        type: Number,
    },
    currentWeight:{
        type: Number,
    },
    height:{
        type: Number,
    },
    gender:{
        type: String,
    },

})

module.exports = mongoose.model('User', schema);