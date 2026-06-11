const express = require('express');
const router = express.Router();
const { Draw, Winner, Ticket, User } = require('../models');
const { getTodayDate } = require('../services/drawService');

// GET /api/draws/today
router.get('/today', async (req, res) => {
    try {
        const date = getTodayDate();
        const draw = await Draw.findOne({ where: { drawDate: date } });
        const ticketCount = await Ticket.count({ where: { drawDate: date } });
        res.json({ draw, ticketCount });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /api/draws/history
router.get('/history', async (req, res) => {
    try {
        const draws = await Draw.findAll({
            where: { status: 'completed' },
            order: [['drawDate', 'DESC']],
            limit: 30,
        });
        res.json(draws);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /api/draws/winners/:date
router.get('/winners/:date', async (req, res) => {
    try {
        const winners = await Winner.findAll({
            include: [
                { model: Draw, where: { drawDate: req.params.date } },
                { model: User, attributes: ['fullName', 'phone'] },
                { model: Ticket, attributes: ['ticketNumber'] },
            ],
            order: [['position', 'ASC']],
        });
        res.json(winners);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /api/draws/all-winners
router.get('/all-winners', async (req, res) => {
    try {
        const winners = await Winner.findAll({
            include: [
                { model: Draw, attributes: ['drawDate'] },
                { model: User, attributes: ['fullName'] },
                { model: Ticket, attributes: ['ticketNumber'] },
            ],
            order: [['createdAt', 'DESC']],
            limit: 50,
        });
        res.json(winners);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
