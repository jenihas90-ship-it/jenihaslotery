const express = require('express');
const router = express.Router();
const { User, Ticket, Draw, Transaction, Winner } = require('../models');
const authMiddleware = require('../middleware/auth.middleware');
const adminMiddleware = require('../middleware/admin.middleware');
const { runDraw } = require('../services/drawService');

router.use(authMiddleware, adminMiddleware);

// GET /api/admin/stats
router.get('/stats', async (req, res) => {
    try {
        const userCount = await User.count({ where: { role: 'user' } });
        const ticketCount = await Ticket.count();
        const totalRevenue = await Ticket.sum('price') || 0;
        const totalPrizes = await Winner.sum('prizeAmount') || 0;

        res.json({
            userCount,
            ticketCount,
            totalRevenue,
            totalPrizes,
            netProfit: totalRevenue - totalPrizes,
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /api/admin/users
router.get('/users', async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['passwordHash', 'resetToken', 'resetTokenExpiry'] },
            order: [['createdAt', 'DESC']],
        });
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// PATCH /api/admin/users/:id/status
router.patch('/users/:id/status', async (req, res) => {
    try {
        const { isActive } = req.body;
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.isActive = isActive;
        await user.save();
        res.json({ message: `User account ${isActive ? 'activated' : 'suspended'}` });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /api/admin/reports/sales
router.get('/reports/sales', async (req, res) => {
    try {
        const sales = await Draw.findAll({
            attributes: ['drawDate', 'totalTickets', 'totalRevenue', 'totalPrize'],
            order: [['drawDate', 'DESC']],
            limit: 30,
        });
        res.json(sales);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// POST /api/admin/draw/run-now
router.post('/draw/run-now', async (req, res) => {
    try {
        const { date } = req.body; // Optional date override
        const result = await runDraw(date);
        if (!result) return res.status(400).json({ message: 'Draw already completed or no tickets found for this date.' });
        res.json({ message: 'Draw completed successfully', result });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
