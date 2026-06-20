const { Sequelize } = require('sequelize');
const path = require('path');

const isVercel = process.env.VERCEL === '1';
const databaseUrl = process.env.DATABASE_URL;

let sequelize;

if (databaseUrl) {
  // Use PostgreSQL if DATABASE_URL is provided
  console.log('Using persistent PostgreSQL database...');
  sequelize = new Sequelize(databaseUrl, {
    dialect: 'postgres',
    dialectOptions: isVercel ? {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    } : {},
    logging: false,
  });
} else {
  // Fallback to SQLite (local development)
  console.log('Using SQLite database...');
  const storagePath = isVercel
    ? '/tmp/lottery.sqlite'
    : path.join(__dirname, '../../lottery.sqlite');

  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: storagePath,
    logging: false,
  });
}

module.exports = sequelize;
