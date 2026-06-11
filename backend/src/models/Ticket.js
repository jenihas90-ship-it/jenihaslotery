const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Ticket = sequelize.define('Ticket', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    ticketNumber: { type: DataTypes.STRING, allowNull: false, unique: true },
    userId: { type: DataTypes.UUID, allowNull: false },
    drawDate: { type: DataTypes.DATEONLY, allowNull: false },
    status: { type: DataTypes.ENUM('pending', 'won', 'lost'), defaultValue: 'pending' },
    price: { type: DataTypes.FLOAT, defaultValue: 20 },
}, { tableName: 'tickets', timestamps: true });

module.exports = Ticket;
