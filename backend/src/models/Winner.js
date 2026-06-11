const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Winner = sequelize.define('Winner', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    drawId: { type: DataTypes.UUID, allowNull: false },
    ticketId: { type: DataTypes.UUID, allowNull: false },
    userId: { type: DataTypes.UUID, allowNull: false },
    position: { type: DataTypes.INTEGER, allowNull: false }, // 1, 2, 3
    prizeAmount: { type: DataTypes.FLOAT, allowNull: false },
}, { tableName: 'winners', timestamps: true });

module.exports = Winner;
