const express = require('express');
const router = express.Router();
const { Ticket, User, Transaction } = require('../models');
const authMiddleware = require('../middleware/auth.middleware');
const adminMiddleware = require('../middleware/admin.middleware');
const { sendEmail } = require('../utils/notifications');

// GET /api/admin/tickets/pending
router.get('/pending', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const tickets = await Ticket.findAll({
            where: { status: 'awaiting_approval' },
            include: [{ model: User, attributes: ['fullName', 'email', 'phone'] }],
            order: [['createdAt', 'DESC']]
        });
        res.json(tickets);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// POST /api/admin/tickets/:id/approve
router.post('/:id/approve', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const ticket = await Ticket.findByPk(req.params.id, { include: [User] });
        if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

        ticket.status = 'approved';
        await ticket.save();

        // Send Bank Details to User
        const bankDetails = `
            <h3>Ticket Approved!</h3>
            <p>Hello ${ticket.User.fullName}, your ticket request <strong>#${ticket.ticketNumber}</strong> has been approved.</p>
            <p>Please complete your payment of <strong>${ticket.price} ETB</strong> to the following bank account:</p>
            <ul style="list-style: none; padding: 0;">
                <li><strong>Bank:</strong> ${process.env.ADMIN_BANK_NAME || 'Commercial Bank of Ethiopia (CBE)'}</li>
                <li><strong>Account Number:</strong> ${process.env.ADMIN_BANK_ACCOUNT || '1000123456789'}</li>
                <li><strong>Account Holder:</strong> ${process.env.ADMIN_ACCOUNT_HOLDER || 'Lottery System Admin'}</li>
            </ul>
            <p>Please use your Ticket Number <strong>${ticket.ticketNumber}</strong> as the payment reference.</p>
        `;

        await sendEmail({
            to: ticket.User.email,
            subject: 'Ticket Approved - Payment Required',
            html: bankDetails
        });

        res.json({ message: 'Ticket approved and bank details sent.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// POST /api/admin/tickets/:id/reject
router.post('/:id/reject', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const ticket = await Ticket.findByPk(req.params.id);
        if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

        ticket.status = 'rejected';
        await ticket.save();

        res.json({ message: 'Ticket rejected.' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
