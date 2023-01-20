const mongoose = require('mongoose');

const HabitsSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    dates: [{
        date: String,
        complete: String
    }],
    favorites: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const Habits = mongoose.model('Habits', HabitsSchema);