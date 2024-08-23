const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const History = require('../models/History');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

// Функция для проверки токена и получения userId
const verifyToken = (req) => {
    const token = req.header('x-auth-token');
    if (!token) {
        return null;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded.user.id;
    } catch (err) {
        console.error('Token is not valid:', err.message);
        return null;
    }
};

// @route    POST api/history
// @desc     Save a new order to history
// @access   Private
router.post('/', async (req, res) => {
    const { trade, cardNumber, amount, rate } = req.body;
    const userId = verifyToken(req);

    if (!userId) {
        return res.status(401).json({ msg: 'Authorization denied, invalid token' });
    }

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

// @route    GET api/history
// @desc     Get history by user ID (for authenticated users)
// @access   Private
router.get('/', async (req, res) => {
    const userId = verifyToken(req);

    if (!userId) {
        return res.status(401).json({ msg: 'Authorization denied, invalid token' });
    }

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
