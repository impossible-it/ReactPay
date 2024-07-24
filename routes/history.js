// routes/history.js
const express = require('express');
const router = express.Router();
const History = require('../models/History'); // Импорт модели History

// @route    POST api/history
// @desc     Save a new order to history
// @access   Public
router.post('/', async (req, res) => {
  const { trade, cardNumber, amount, status, userId } = req.body;

  try {
    let historyItem = new History({
      trade,
      cardNumber,
      amount,
      status,
      userId
    });

    await historyItem.save();
    res.json(historyItem);
  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).send('Server error');
  }
});

// @route    GET api/history/:userId
// @desc     Get history by user ID
// @access   Public
router.get('/:userId', async (req, res) => {
  try {
    const historyItems = await History.find({ userId: req.params.userId });

    if (!historyItems) {
      return res.status(404).json({ msg: 'History not found' });
    }

    res.json(historyItems);
  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
