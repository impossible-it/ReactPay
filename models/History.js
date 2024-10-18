// models/History.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HistorySchema = new Schema({
    trade: {
        type: String,
        required: true
    },
    cardNumber: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    rate: {
        type: Number,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: false,
        ref: 'User'
    },
    date: {
        type: Date,
        default: Date.now,
        required: false
    }
});

module.exports = mongoose.model('History', HistorySchema);
