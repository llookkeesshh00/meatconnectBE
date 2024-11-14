
const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  amount: Number,
  currency: String,
  transactionId: String,
  status: String,
  date: { type: Date, default: Date.now },
  payer: {
    name: String,
    email: String,
    payerId: String
  }
});

module.exports = mongoose.model('Payments', paymentSchema);