const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    food_id: String,
    food_name: String,
    food_type: String,
    calories: Number,
    fat: Number,
    carbs: Number,
    protein: Number
})

module.exports = mongoose.model('FoodDetails', schema);