const mongoose = require('mongoose');

const FormDataSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  clientNumber: {
    type: Number,
    required: false // Make clientNumber optional
  }
});

module.exports = mongoose.model('FormData', FormDataSchema);
