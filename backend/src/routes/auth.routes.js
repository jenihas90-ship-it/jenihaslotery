const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { body, validationResult } = require('express-validator');
const { User } = require('../models');
const { authLimiter } = require('../middleware/rateLimiter');
const { sendEmail } = require('../utils/notifications');

const generateToken = (user) =>
    jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'fallback_secret_for_testing_123', {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });

// POST /api/auth/register
router.post('/register', authLimiter, [
    body('fullName').trim().notEmpty().withMessage('Full name is required'),
    body('phone').trim().notEmpty().withMessage('Phone number is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
        const { fullName, phone, email, password } = req.body;
        const existingEmail = await User.findOne({ where: { email } });
        if (existingEmail) return res.status(409).json({ message: 'Email already registered' });

        const existingPhone = await User.findOne({ where: { phone } });
        if (existingPhone) return res.status(409).json({ message: 'Phone number already registered' });

        const passwordHash = await bcrypt.hash(password, 12);
        const user = await User.create({ fullName, phone, email, passwordHash });
        const token = generateToken(user);

        res.status(201).json({
            message: 'Registration successful',
            token,
            user: { id: user.id, fullName: user.fullName, email: user.email, phone: user.phone, walletBalance: user.walletBalance, role: user.role },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error', error: err.name, details: err.message });
    }
});

// POST /api/auth/login
router.post('/login', authLimiter, [
    body('email').isEmail(),
    body('password').notEmpty(),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(401).json({ message: 'Invalid credentials' });
        if (!user.isActive) return res.status(403).json({ message: 'Account suspended. Contact support.' });

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

        const token = generateToken(user);
        res.json({
            message: 'Login successful',
            token,
            user: { id: user.id, fullName: user.fullName, email: user.email, phone: user.phone, walletBalance: user.walletBalance, role: user.role },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error', error: err.name, details: err.message });
    }
});

// POST /api/auth/forgot-password
router.post('/forgot-password', authLimiter, [
    body('email').isEmail(),
], async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user) return res.json({ message: 'If that email exists, a reset link was sent.' });

        const token = crypto.randomBytes(32).toString('hex');
        user.resetToken = token;
        user.resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000);
        await user.save();

        await sendEmail({
            to: email,
            subject: 'Password Reset Request',
            html: `<p>Your password reset token: <strong>${token}</strong></p><p>Expires in 1 hour.</p>`,
        });

        res.json({ message: 'If that email exists, a reset link was sent.' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.name, details: err.message });
    }
});

// POST /api/auth/reset-password
router.post('/reset-password', authLimiter, [
    body('token').notEmpty(),
    body('password').isLength({ min: 6 }),
], async (req, res) => {
    try {
        const { token, password } = req.body;
        const user = await User.findOne({
            where: { resetToken: token },
        });
        if (!user || user.resetTokenExpiry < new Date()) {
            return res.status(400).json({ message: 'Invalid or expired reset token' });
        }
        user.passwordHash = await bcrypt.hash(password, 12);
        user.resetToken = null;
        user.resetTokenExpiry = null;
        await user.save();
        res.json({ message: 'Password reset successful' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.name, details: err.message });
    }
});

// GET /api/auth/me
router.get('/me', require('../middleware/auth.middleware'), async (req, res) => {
    const user = req.user;
    res.json({
        id: user.id, fullName: user.fullName, email: user.email,
        phone: user.phone, walletBalance: user.walletBalance, role: user.role,
        createdAt: user.createdAt,
    });
});

module.exports = router;
