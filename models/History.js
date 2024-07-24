// models/History.js
const mongoose = require('mongoose');

const HistorySchema = new mongoose.Schema({
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
  status: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('History', HistorySchema);
