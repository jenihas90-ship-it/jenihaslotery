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

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
// app.use(generalLimiter); // Temporarily disabled for debugging

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

// Health check
app.get('/health', (req, res) => res.json({ status: 'OK', time: new Date() }));

// Database Init Helper
const initDB = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync({ alter: true });

        // Seed Admin
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@lottery.com';
        const adminExists = await User.findOne({ where: { email: adminEmail } });
        if (!adminExists) {
            const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Admin1234!', 12);
            await User.create({
                fullName: 'System Admin',
                phone: '0000000000',
                email: adminEmail,
                passwordHash,
                role: 'admin',
                isActive: true,
                walletBalance: 0,
            });
            console.log('Admin seeded');
        }
    } catch (err) {
        console.error('DB Init Error:', err);
    }
};

// Start Logic
if (process.env.VERCEL === '1') {
    // On Vercel, we hope the DB is ready or it will lazy-init
    initDB();
} else {
    // Locally, we wait for DB before listening
    const PORT = process.env.PORT || 5000;
    initDB().then(() => {
        initCronJobs();
        app.listen(PORT, () => console.log(`Server on ${PORT}`));
    });
}

module.exports = app;
