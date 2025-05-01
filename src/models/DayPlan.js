const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    date: {
        type: Date,
        required: true
    },
    meal: {
        breakfast: [{ foodId: Number, servingSize: Number }],
        lunch: [{ foodId: Number, servingSize: Number }],
        dinner: [{ foodId: Number, servingSize: Number }],
        snack: [{ foodId: Number, servingSize: Number }]
    }
})

module.exports = mongoose.model('DayPlan', schema);