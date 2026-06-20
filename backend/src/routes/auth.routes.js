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
        if (existingEmail && existingEmail.isActive) return res.status(409).json({ message: 'Email already registered' });

        const existingPhone = await User.findOne({ where: { phone } });
        if (existingPhone && existingPhone.isActive) return res.status(409).json({ message: 'Phone number already registered' });

        const passwordHash = await bcrypt.hash(password, 12);

        // Generate 6-digit OTP
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        let user;
        if (existingEmail) {
            // Update existing unverified user
            user = existingEmail;
            user.fullName = fullName;
            user.phone = phone;
            user.passwordHash = passwordHash;
            user.otpCode = otpCode;
            user.otpExpires = otpExpires;
            await user.save();
        } else {
            // Create new unverified user
            user = await User.create({
                fullName, phone, email, passwordHash,
                otpCode, otpExpires,
                isActive: false
            });
        }

        // Send OTP via Email
        await sendEmail({
            to: email,
            subject: 'Verify Your Email - Daily Lottery',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; background: #0a0a1a; color: #fff; border-radius: 10px;">
                    <h2 style="color: #f5c518;">Welcome to Daily Lottery!</h2>
                    <p>Your verification code is:</p>
                    <h1 style="background: rgba(245,197,24,0.1); padding: 10px; border: 1px dashed #f5c518; text-align: center; letter-spacing: 5px;">${otpCode}</h1>
                    <p>This code will expire in 10 minutes.</p>
                    <p style="color: #888; font-size: 12px;">If you didn't request this, please ignore this email.</p>
                </div>
            `
        });

        res.status(201).json({
            message: 'OTP sent to your email. Please verify to complete registration.',
            email: user.email
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error', error: err.name, details: err.message });
    }
});

// POST /api/auth/verify-otp
router.post('/verify-otp', authLimiter, async (req, res) => {
    try {
        const { email, otpCode } = req.body;
        const user = await User.findOne({ where: { email, otpCode } });

        if (!user || user.otpExpires < new Date()) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        user.isActive = true;
        user.otpCode = null;
        user.otpExpires = null;
        await user.save();

        const token = generateToken(user);

        res.json({
            message: 'Verification successful',
            token,
            user: { id: user.id, fullName: user.fullName, email: user.email, phone: user.phone, walletBalance: user.walletBalance, role: user.role },
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// POST /api/auth/resend-otp
router.post('/resend-otp', authLimiter, async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ where: { email, isActive: false } });
        if (!user) return res.status(404).json({ message: 'User not found or already verified' });

        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        user.otpCode = otpCode;
        user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
        await user.save();

        await sendEmail({
            to: email,
            subject: 'New Verification Code - Daily Lottery',
            html: `<p>Your new verification code is: <strong>${otpCode}</strong></p>`
        });

        res.json({ message: 'New OTP sent to your email' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
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

        if (!user.isActive) {
            return res.status(403).json({
                message: 'Account not verified. Please check your email.',
                requiresVerification: true,
                email: user.email
            });
        }

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
