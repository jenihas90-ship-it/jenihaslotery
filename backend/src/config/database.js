const { Sequelize } = require('sequelize');
const path = require('path');

const isVercel = process.env.VERCEL === '1';
const storagePath = isVercel
  ? '/tmp/lottery.sqlite'
  : path.join(__dirname, '../../lottery.sqlite');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: storagePath,
  logging: false,
});

module.exports = sequelize;
