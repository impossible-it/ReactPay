const mongoose = require('mongoose');

const HistorySchema = new mongoose.Schema({
    trade: {
        type: Number,
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
        type: String,
        required: true
    },
    userId: {  // Добавляем поле userId
        type: mongoose.Schema.Types.ObjectId, // предполагается, что это ссылка на пользователя
        ref: 'User',
        required: false
    }
});

module.exports = mongoose.model('History', HistorySchema);
