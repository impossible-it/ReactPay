const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');  // Добавляем mongoose для использования ObjectId
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
        console.error('Token is not valid');
        return null;
    }
};

// @route    POST api/history
// @desc     Save a new order to history
// @access   Public
router.post('/', async (req, res) => {
    const { trade, cardNumber, amount, rate } = req.body;

    // Проверяем токен и получаем userId
    const userId = verifyToken(req) || new mongoose.Types.ObjectId('000000000000000000000101'); // Используем new для создания ObjectId

    if (!trade || !cardNumber || !amount || !rate) {
        return res.status(400).json({ msg: 'Please include all fields' });
    }

    try {
        let historyItem = new History({
            trade,
            cardNumber,
            amount,
            rate,
            userId: userId,
        });

        await historyItem.save();
        res.json(historyItem);
    } catch (err) {
        console.error('Error saving order to history:', err.message);
        throw new Error(`Failed to save order to history: ${err.message}`);
    }
});

// @route    GET api/history
// @desc     Get history by user ID (for authenticated users)
// @access   Private
router.get('/', async (req, res) => {
    // Проверяем токен и получаем userId
    const userId = verifyToken(req);

    if (!userId) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        const historyItems = await History.find({ userId });

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
