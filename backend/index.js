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
app.use(generalLimiter);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/draws', drawRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/health', (req, res) => res.json({ status: 'OK', time: new Date() }));

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        // Connect to Database
        await sequelize.authenticate();
        console.log('Connected to SQLite database.');

        // Sync Models (automatically creates tables)
        await sequelize.sync({ alter: true });
        console.log('Database synced.');

        // Seed Admin User if not exists
        const adminExists = await User.findOne({ where: { email: process.env.ADMIN_EMAIL || 'admin@lottery.com' } });
        if (!adminExists) {
            const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Admin1234!', 12);
            await User.create({
                fullName: 'System Admin',
                phone: '0000000000',
                email: process.env.ADMIN_EMAIL || 'admin@lottery.com',
                passwordHash,
                role: 'admin',
                isActive: true,
                walletBalance: 0,
            });
            console.log('Default admin user created.');
        }

        // Start Cron Jobs (Note: This won't run on Vercel; use Vercel Cron instead)
        if (process.env.NODE_ENV !== 'production' || process.env.VERCEL !== '1') {
            initCronJobs();
        }

        // Start Server
        if (process.env.VERCEL !== '1') {
            app.listen(PORT, () => {
                console.log(`Server running on port ${PORT}`);
            });
        }
    } catch (err) {
        console.error('Unable to start server:', err);
        if (process.env.VERCEL !== '1') process.exit(1);
    }
};

startServer();

module.exports = app;
