const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');
const { User } = require('../models');

let isSynced = false;

const dbInitMiddleware = async (req, res, next) => {
    // We only need to sync once per lambda execution
    if (!isSynced) {
        try {
            console.log('Syncing database...');
            await sequelize.authenticate();
            await sequelize.sync({ alter: true });

            // Re-seed admin if needed (essential for first run in /tmp)
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
                console.log('Admin seeded in middleware');
            }

            isSynced = true;
            console.log('Database synced successfully');
        } catch (err) {
            console.error('Database Sync Error in Middleware:', err);
            return res.status(500).json({
                message: 'Internal Server Error (Database Initialization)',
                error: process.env.NODE_ENV === 'production' ? null : err.message
            });
        }
    }
    next();
};

module.exports = dbInitMiddleware;
