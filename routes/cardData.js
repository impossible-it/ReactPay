const express = require('express');
const router = express.Router();
const UserData = require('../models/UserData');

// @route   POST /api/userData
// @desc    Create user data
// @access  Public
router.post('/', async (req, res) => {
  const { cardNumber, cardName, cardBank } = req.body;

  if (!cardNumber || !cardName || !cardBank) {
    return res.status(400).json({ msg: 'Please include all required fields' });
  }

  try {
    // Используем UserData.create для создания и сохранения записи
    const userData = await UserData.create({
      cardNumber,
      cardName,
      cardBank
    });

    res.json(userData);
  } catch (err) {
    console.error('Error in POST /api/userData:', err); // Логируем полный объект ошибки
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
    console.error('Error in GET /api/userData:', err); // Логируем полный объект ошибки
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
    console.error('Error in DELETE /api/userData/:id:', err); // Логируем полный объект ошибки
    res.status(500).send('Server error');
  }
});

module.exports = router;
