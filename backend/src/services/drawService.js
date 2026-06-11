const { v4: uuidv4 } = require('uuid');
const { Op } = require('sequelize');
const { Draw, Ticket, Winner, User, Transaction } = require('../models');
const { notifyWinner } = require('../utils/notifications');

const PRIZES = { 1: 500, 2: 400, 3: 300 };

const getTodayDate = () => new Date().toISOString().split('T')[0];

const generateTicketNumber = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let num = '';
    for (let i = 0; i < 8; i++) num += chars[Math.floor(Math.random() * chars.length)];
    return num;
};

const runDraw = async (drawDate = null) => {
    const date = drawDate || getTodayDate();
    console.log(`[DRAW] Starting draw for ${date}...`);

    let draw = await Draw.findOne({ where: { drawDate: date } });
    if (!draw) {
        draw = await Draw.create({ drawDate: date, status: 'scheduled' });
    }
    if (draw.status === 'completed') {
        console.log(`[DRAW] Draw for ${date} already completed.`);
        return null;
    }

    const tickets = await Ticket.findAll({
        where: { drawDate: date, status: 'pending' },
        include: [{ model: User, attributes: ['id', 'fullName', 'email', 'phone', 'isActive'] }],
    });

    if (tickets.length < 1) {
        console.log(`[DRAW] No tickets for ${date}. Cancelling draw.`);
        draw.status = 'cancelled';
        await draw.save();
        return null;
    }

    // Fisher-Yates shuffle
    const shuffled = [...tickets];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    const winnerCount = Math.min(3, shuffled.length);
    const usedUsers = new Set();
    const winners = [];

    for (const ticket of shuffled) {
        if (winners.length >= winnerCount) break;
        // Optional: avoid same user winning multiple positions
        if (usedUsers.has(ticket.userId)) continue;
        winners.push(ticket);
        usedUsers.add(ticket.userId);
    }

    // Record winners
    for (let i = 0; i < winners.length; i++) {
        const position = i + 1;
        const prize = PRIZES[position];
        const ticket = winners[i];
        const user = ticket.User;

        await Winner.create({
            drawId: draw.id,
            ticketId: ticket.id,
            userId: ticket.userId,
            position,
            prizeAmount: prize,
        });

        // Credit prize to wallet
        await User.update(
            { walletBalance: user.walletBalance + prize },
            { where: { id: ticket.userId } }
        );

        await Transaction.create({
            userId: ticket.userId,
            type: 'prize',
            amount: prize,
            status: 'completed',
            description: `${position === 1 ? '1st' : position === 2 ? '2nd' : '3rd'} place prize for draw ${date}`,
        });

        await Ticket.update({ status: 'won' }, { where: { id: ticket.id } });

        // Notify winner
        try {
            await notifyWinner(user, ticket, position, prize);
        } catch (e) {
            console.error('[DRAW] Notification failed:', e.message);
        }
    }

    // Mark remaining tickets as lost
    const winnerIds = winners.map(w => w.id);
    await Ticket.update(
        { status: 'lost' },
        { where: { drawDate: date, status: 'pending', id: { [Op.notIn]: winnerIds } } }
    );

    // Update draw record
    draw.status = 'completed';
    draw.totalTickets = tickets.length;
    draw.totalRevenue = tickets.length * 20;
    draw.totalPrize = Object.values(PRIZES).slice(0, winnerCount).reduce((a, b) => a + b, 0);
    await draw.save();

    console.log(`[DRAW] Completed! ${winners.length} winners selected.`);
    return { draw, winners };
};

const getOrCreateTodayDraw = async () => {
    const date = getTodayDate();
    let draw = await Draw.findOne({ where: { drawDate: date } });
    if (!draw) draw = await Draw.create({ drawDate: date, status: 'scheduled' });
    return draw;
};

module.exports = { runDraw, getOrCreateTodayDraw, generateTicketNumber, getTodayDate };
