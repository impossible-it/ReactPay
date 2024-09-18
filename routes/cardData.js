const express = require('express');
const router = express.Router();
const CardData = require('../models/CardData');
const mongoose = require('mongoose');

// @route   POST /api/cardData
// @desc    Create card data
// @access  Public
router.post('/', async (req, res) => {
  const { cardNumber, cardName, cardBank } = req.body;

  if (!cardNumber || !cardName || !cardBank) {
    return res.status(400).json({ msg: 'Please include all required fields' });
  }

  try {
    // Используем CardData.create для создания и сохранения записи
    const cardData = await CardData.create({
      cardNumber,
      cardName,
      cardBank
    });

    res.json(cardData);
  } catch (err) {
    console.error('Error in POST /api/cardData:', err);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/cardData
// @desc    Get all card data
// @access  Public
router.get('/', async (req, res) => {
  try {
    const cardDataList = await CardData.find();
    res.json(cardDataList);
  } catch (err) {
    console.error('Error in GET /api/cardData:', err);
    res.status(500).send('Server error');
  }
});

// @route   DELETE /api/cardData/:id
// @desc    Delete card data by ID
// @access  Public
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Проверка на валидный ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: 'Invalid ID format' });
    }

    const cardData = await CardData.findById(id);

    if (!cardData) {
      return res.status(404).json({ msg: 'Card data not found' });
    }

    await cardData.remove();
    res.json({ msg: 'Card data removed' });
  } catch (err) {
    console.error('Error in DELETE /api/cardData/:id:', err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
