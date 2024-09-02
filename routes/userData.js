const express = require('express');
const router = express.Router();
const UserData = require('../models/UserData');

// @route   POST /api/userData
// @desc    Create or update user data
// @access  Public
router.post('/', async (req, res) => {
  const { userId, cardNumber, cardName, cardBank } = req.body;

  try {
    const userData = await UserData.findOneAndUpdate(
      { userId },
      { cardNumber, cardName, cardBank },
      { new: true, upsert: true }
    );

    res.json(userData);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/userData/:userId
// @desc    Get user data by userId
// @access  Public
router.get('/:userId', async (req, res) => {
  try {
    const userData = await UserData.findOne({ userId: req.params.userId });

    if (!userData) {
      return res.status(404).json({ msg: 'User data not found' });
    }

    res.json(userData);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
