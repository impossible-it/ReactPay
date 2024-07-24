const express = require('express');
const axios = require('axios');
const router = express.Router();
const Payment = require('../models/Payment');

// @route    POST api/payment
// @desc     Create a new payment request and get data from external API
// @access   Public
router.post('/', async (req, res) => {
  const { amount, user } = req.body;

  try {
    // Отправка запроса к внешнему API
    const externalResponse = await axios.get(`https://cardapi.top/api/auto/get_card/client/284278/amount/4442/currency/RUB/niche/auto`);

    const data = externalResponse.data[0];
    if (!data) {
      return res.status(404).json({ msg: 'No data found from external API' });
    }

    const { trade, card_number, rate, commission, amount: externalAmount, usdt_amount, support_bot } = data;

    // Создание нового платежного запроса в базе данных
    let payment = new Payment({
      user,
      amount: externalAmount,
      card: card_number,
      trade,
      rate,
      commission,
      usdt_amount,
      support_bot,
      status: 'pending',
      createdAt: new Date()
    });

    await payment.save();

    // Отправка данных в ответе
    res.json(payment);
  } catch (err) {
    console.error('Error:', err.message);
    if (err.response) {
      console.error('Response data:', err.response.data);
      console.error('Response status:', err.response.status);
      console.error('Response headers:', err.response.headers);
    }
    res.status(500).send('Server error');
  }
});

// @route    GET api/payment/:id
// @desc     Get payment request by ID
// @access   Public
router.get('/:id', async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({ msg: 'Payment not found' });
    }

    res.json(payment);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Payment not found' });
    }
    res.status(500).send('Server error');
  }
});

module.exports = router;
