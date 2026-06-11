const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');
const { User, Transaction } = require('../models');
const authMiddleware = require('../middleware/auth.middleware');

// POST /api/payment/initiate
// Simulates Telebirr payment initiation
router.post('/initiate', authMiddleware, [
  body('amount').isFloat({ min: 20 }).withMessage('Minimum deposit is 20 ETB'),
  body('method').isIn(['telebirr', 'cbe', 'dashen', 'awash']).withMessage('Invalid payment method'),
  body('phone').trim().notEmpty().withMessage('Phone number required'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { amount, method, phone } = req.body;
    // Generate a mock transaction reference
    const reference = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

    // In production: call Telebirr/bank API here and return redirect URL
    res.json({
      message: 'Payment initiated. Confirm to complete.',
      reference,
      amount,
      method,
      phone,
      // Mock OTP for demo purposes
      mockOtp: '123456',
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/payment/confirm
// Confirms the mock payment and credits wallet
router.post('/confirm', authMiddleware, [
  body('reference').notEmpty(),
  body('amount').isFloat({ min: 20 }),
  body('otp').notEmpty().withMessage('OTP is required'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { reference, amount, otp } = req.body;

    // Mock OTP validation (in production: verify with Telebirr API)
    if (otp !== '123456') {
      return res.status(400).json({ message: 'Invalid OTP. Please try again.' });
    }

    const user = await User.findByPk(req.user.id);
    user.walletBalance += parseFloat(amount);
    await user.save();

    await Transaction.create({
      userId: user.id,
      type: 'deposit',
      amount: parseFloat(amount),
      status: 'completed',
      reference,
      description: `Wallet top-up via payment`,
    });

    res.json({
      message: `Successfully deposited ${amount} ETB to your wallet`,
      newBalance: user.walletBalance,
      reference,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/payment/transactions
router.get('/transactions', authMiddleware, async (req, res) => {
  try {
    const transactions = await Transaction.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
      limit: 50,
    });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
