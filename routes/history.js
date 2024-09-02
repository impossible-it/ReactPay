// routes/history.js

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const History = require('../models/History');
const authMiddleware = require('../middleware/authMiddleware');
const generateTemporaryId = require('../src/utils/generateTempId');

// Сохранение заказа в истории
router.post('/', authMiddleware, async (req, res) => {
    const { trade, cardNumber, amount, rate } = req.body;
    const userId = req.user ? req.user.id : generateTemporaryId();

    if (!trade || !cardNumber || !amount || !rate) {
        return res.status(400).json({ msg: 'Please include all fields' });
    }

    try {
        const historyItem = new History({
            trade,
            cardNumber,
            amount,
            rate,
            userId: new mongoose.Types.ObjectId(userId),
        });

        await historyItem.save();
        res.json(historyItem);
    } catch (err) {
        console.error('Error saving order to history:', err.message);
        res.status(500).send('Server error');
    }
});

// Получение истории по userId
router.get('/', authMiddleware, async (req, res) => {
    const userId = req.user.id;

    try {
        const historyItems = await History.find({ userId: new mongoose.Types.ObjectId(userId) });

        if (!historyItems || historyItems.length === 0) {
            return res.status(404).json({ msg: 'History not found' });
        }

        res.json(historyItems);
    } catch (err) {
        console.error('Error:', err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
