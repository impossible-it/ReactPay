const mongoose = require('mongoose');

const UserDataSchema = new mongoose.Schema({
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
  timestamps: true
});
module.exports = mongoose.model('UserData', UserDataSchema);
