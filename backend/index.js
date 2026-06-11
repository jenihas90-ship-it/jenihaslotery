require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const sequelize = require('./src/config/database');
const { User } = require('./src/models');
const { generalLimiter } = require('./src/middleware/rateLimiter');
const initCronJobs = require('./src/jobs/midnightDraw');

// Routes
const authRoutes = require('./src/routes/auth.routes');
const ticketRoutes = require('./src/routes/ticket.routes');
const paymentRoutes = require('./src/routes/payment.routes');
const drawRoutes = require('./src/routes/draw.routes');
const adminRoutes = require('./src/routes/admin.routes');
const adminTicketRoutes = require('./src/routes/admin.tickets.routes.js');

const dbInit = require('./src/middleware/dbInit');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(dbInit); // Ensure DB is ready for every request

// Request logging for Vercel Dashboard
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Ping route (Top level)
app.get('/api/ping', (req, res) => res.send('pong'));

// Debug Route
app.get('/api/debug', async (req, res) => {
    try {
        await sequelize.authenticate();
        res.json({
            status: 'Backend is ALIVE',
            database: 'Connected',
            env: {
                VERCEL: process.env.VERCEL,
                NODE_ENV: process.env.NODE_ENV,
                HAS_JWT_SECRET: !!process.env.JWT_SECRET
            },
            time: new Date()
        });
    } catch (err) {
        res.status(500).json({ error: err.message, stack: err.stack });
    }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/draws', drawRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin/tickets', adminTicketRoutes);

// Health check
app.get('/health', (req, res) => res.json({ status: 'OK', time: new Date() }));

// Start Logic for local dev
if (process.env.VERCEL !== '1') {
    const PORT = process.env.PORT || 5000;
    initCronJobs();
    app.listen(PORT, () => console.log(`Server on ${PORT}`));
}

module.exports = app;
