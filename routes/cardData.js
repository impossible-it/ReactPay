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
router.delete('/name/:cardName', async (req, res) => {
  try {
    const { cardName } = req.params;
    console.log('Delete request received for cardName:', cardName);

    // Проверка, что запись существует
    const cardData = await CardData.findOne({ cardName });

    if (!cardData) {
      console.log('No card data found for:', cardName);
      return res.status(404).json({ msg: 'Card data not found' });
    }

    // Удаление найденной записи
    await CardData.deleteOne({ _id: cardData._id });
    console.log('Card data removed:', cardData);
    res.json({ msg: 'Card data removed', removedData: cardData });
  } catch (err) {
    console.error('Error in DELETE /api/cardData/name/:cardName:', err);
    res.status(500).send('Server error');
  }
});
module.exports = router;
