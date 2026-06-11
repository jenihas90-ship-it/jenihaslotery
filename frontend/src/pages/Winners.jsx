import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { motion } from 'framer-motion';
import { Trophy, Calendar, User, Hash, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';

const Winners = () => {
    const [winners, setWinners] = useState([]);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWinners = async () => {
            try {
                const [allRes, histRes] = await Promise.all([
                    api.get('/draws/all-winners'),
                    api.get('/draws/history')
                ]);
                setWinners(allRes.data);
                setHistory(histRes.data);
            } catch (err) {
                toast.error('Failed to load winners archive');
            } finally {
                setLoading(false);
            }
        };
        fetchWinners();
    }, []);

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
            <Loader2 size={48} className="animate-spin" color="var(--primary)" />
        </div>
    );

    return (
        <div className="animate-fade" style={{ padding: '40px 5%' }}>
            <header style={{ textAlign: 'center', marginBottom: '60px' }}>
                <h1 style={{ fontSize: '3rem' }}>Hall of <span className="text-gradient">Fortune</span></h1>
                <p style={{ color: 'var(--text-dim)', maxWidth: '600px', margin: '15px auto 0' }}>
                    Celebrating our daily winners. Every midnight, three lucky participants are selected automatically.
                </p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '30px' }}>
                {/* Main Winners List */}
                <section>
                    <h3 style={{ marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Trophy color="var(--primary)" /> Recent Winners
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {winners.length === 0 ? (
                            <p style={{ color: 'var(--text-dim)' }}>No winners recorded yet.</p>
                        ) : (
                            winners.map((winner, idx) => (
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    key={winner.id}
                                    className="premium-card"
                                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.5rem 2rem' }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                        <div style={{
                                            width: '50px', height: '50px', borderRadius: '50%',
                                            background: winner.position === 1 ? 'rgba(245, 197, 24, 0.1)' : 'rgba(255,255,255,0.05)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: '1.5rem'
                                        }}>
                                            {winner.position === 1 ? '🥇' : winner.position === 2 ? '🥈' : '🥉'}
                                        </div>
                                        <div>
                                            <h4 style={{ fontSize: '1.1rem' }}>{winner.User.fullName}</h4>
                                            <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>{winner.Draw.drawDate}</p>
                                        </div>
                                    </div>

                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-dim)', fontSize: '0.85rem', marginBottom: '5px' }}>
                                            <Hash size={14} /> {winner.Ticket.ticketNumber}
                                        </div>
                                        <div style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--secondary)' }}>
                                            +{winner.prizeAmount} ETB
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                </section>

                {/* Sidebar Draw History */}
                <aside>
                    <h3 style={{ marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Calendar size={20} color="var(--primary)" /> Past Draws
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                        {history.map(draw => (
                            <div key={draw.id} className="premium-card" style={{ padding: '1rem', background: 'var(--bg-accent)' }}>
                                <p style={{ fontWeight: '600', fontSize: '0.9rem' }}>{draw.drawDate}</p>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                                    <span>{draw.totalTickets} Tickets</span>
                                    <span style={{ color: 'var(--primary)' }}>{draw.totalPrize} ETB Pool</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default Winners;
