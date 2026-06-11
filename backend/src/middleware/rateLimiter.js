const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20,
    message: { message: 'Too many requests. Please try again later.' },
});

const generalLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 100,
    message: { message: 'Too many requests.' },
});

module.exports = { authLimiter, generalLimiter };
