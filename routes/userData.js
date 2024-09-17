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

// @route   GET /api/userData
// @desc    Get all user data
// @access  Public
router.get('/', async (req, res) => {
  try {
    const userDataList = await UserData.find();
    res.json(userDataList);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE /api/userData/:id
// @desc    Delete user data by ID
// @access  Public
router.delete('/:id', async (req, res) => {
  try {
    const userData = await UserData.findById(req.params.id);

    if (!userData) {
      return res.status(404).json({ msg: 'User data not found' });
    }

    await userData.remove();
    res.json({ msg: 'User data removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
