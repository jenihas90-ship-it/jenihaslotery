const User = require('./User');
const Ticket = require('./Ticket');
const Draw = require('./Draw');
const Winner = require('./Winner');
const Transaction = require('./Transaction');

// Associations
User.hasMany(Ticket, { foreignKey: 'userId' });
Ticket.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Transaction, { foreignKey: 'userId' });
Transaction.belongsTo(User, { foreignKey: 'userId' });

Draw.hasMany(Winner, { foreignKey: 'drawId' });
Winner.belongsTo(Draw, { foreignKey: 'drawId' });

Ticket.hasMany(Winner, { foreignKey: 'ticketId' });
Winner.belongsTo(Ticket, { foreignKey: 'ticketId' });

User.hasMany(Winner, { foreignKey: 'userId' });
Winner.belongsTo(User, { foreignKey: 'userId' });

module.exports = { User, Ticket, Draw, Winner, Transaction };
