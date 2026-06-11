const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Transaction = sequelize.define('Transaction', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    userId: { type: DataTypes.UUID, allowNull: false },
    type: { type: DataTypes.ENUM('deposit', 'purchase', 'prize'), allowNull: false },
    amount: { type: DataTypes.FLOAT, allowNull: false },
    status: { type: DataTypes.ENUM('pending', 'completed', 'failed'), defaultValue: 'completed' },
    reference: { type: DataTypes.STRING, allowNull: true },
    description: { type: DataTypes.STRING, allowNull: true },
}, { tableName: 'transactions', timestamps: true });

module.exports = Transaction;
