const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100, // Increased for testing
    message: { message: 'Too many requests. Please try again later.' },
});

const generalLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 500, // Increased for testing
    message: { message: 'Too many requests.' },
});

module.exports = { authLimiter, generalLimiter };
