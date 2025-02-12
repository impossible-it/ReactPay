const mongoose = require('mongoose');

const CardDataEngSchema = new mongoose.Schema({
  cardNumber: {
    type: String,
    required: true
  },
  cardName: {
    type: String,
    required: true
  },
  cardBank: {
    type: String,
    required: true
  }
}, {
  timestamps: true // Добавляет поля createdAt и updatedAt
});

module.exports = mongoose.model('CardDataEng', CardDataEngSchema);
