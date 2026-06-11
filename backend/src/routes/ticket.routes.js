const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { Ticket, User, Transaction } = require('../models');
const authMiddleware = require('../middleware/auth.middleware');
const { generateTicketNumber, getTodayDate } = require('../services/drawService');

// POST /api/tickets/buy
router.post('/buy', authMiddleware, [
  body('quantity').isInt({ min: 1, max: 50 }).withMessage('Quantity must be between 1 and 50'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { quantity = 1 } = req.body;
    const user = await User.findByPk(req.user.id);
    const totalCost = quantity * 20;
    const drawDate = getTodayDate();

    if (user.walletBalance < totalCost) {
      return res.status(400).json({ message: `Insufficient balance. Need ${totalCost} ETB, have ${user.walletBalance} ETB.` });
    }

    const tickets = [];
    for (let i = 0; i < quantity; i++) {
      let ticketNumber;
      let exists = true;
      while (exists) {
        ticketNumber = generateTicketNumber();
        const found = await Ticket.findOne({ where: { ticketNumber } });
        exists = !!found;
      }
      const ticket = await Ticket.create({
        ticketNumber,
        userId: user.id,
        drawDate,
        price: 20,
        status: 'awaiting_approval'
      });
      tickets.push(ticket);
    }

    // We don't deduct from wallet yet because the user will pay via bank after approval
    // But we record the request
    await Transaction.create({
      userId: user.id,
      type: 'purchase',
      amount: totalCost,
      status: 'pending',
      description: `Requested ${quantity} ticket(s) for draw on ${drawDate}. Awaiting admin approval.`,
    });

    res.status(201).json({
      message: `${quantity} ticket(s) requested successfully. Please wait for admin approval and bank details.`,
      tickets,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/tickets/my-tickets
router.get('/my-tickets', authMiddleware, async (req, res) => {
  try {
    const tickets = await Ticket.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
    });
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
