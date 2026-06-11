const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Draw = sequelize.define('Draw', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    drawDate: { type: DataTypes.DATEONLY, allowNull: false, unique: true },
    status: { type: DataTypes.ENUM('scheduled', 'completed', 'cancelled'), defaultValue: 'scheduled' },
    totalTickets: { type: DataTypes.INTEGER, defaultValue: 0 },
    totalRevenue: { type: DataTypes.FLOAT, defaultValue: 0 },
    totalPrize: { type: DataTypes.FLOAT, defaultValue: 1200 },
}, { tableName: 'draws', timestamps: true });

module.exports = Draw;
