const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users'
  },
  amount: {
    type: Number,
    required: true
  },
  card: {
    type: String,
    required: true
  },
  trade: {
    type: String,
    required: true
  },
  rate: {
    type: Number,
    required: true
  },
  commission: {
    type: Number,
    required: true
  },
  usdt_amount: {
    type: Number,
    required: true
  },
  support_bot: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Payment', PaymentSchema);
