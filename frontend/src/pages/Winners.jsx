import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { motion } from 'framer-motion';
import { Trophy, Calendar, Hash, Loader2, AlertCircle } from 'lucide-react';
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
                    api.get('/draws/history'),
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

    const MEDAL = { 1: '🥇', 2: '🥈', 3: '🥉' };
    const MEDAL_COLOR = { 1: 'var(--primary)', 2: '#C0C0C0', 3: '#cd7f32' };

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', flexDirection: 'column', gap: '16px' }}>
            <Loader2 size={48} className="animate-spin" color="var(--primary)" />
            <p style={{ color: 'var(--text-dim)' }}>Loading winners…</p>
        </div>
    );

    return (
        <div className="animate-fade" style={{ padding: '40px 5%' }}>
            {/* Header */}
            <header style={{ textAlign: 'center', marginBottom: '60px', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '-40px', left: '50%', transform: 'translateX(-50%)', width: '500px', height: '200px', background: 'radial-gradient(circle, rgba(245,197,24,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
                <span className="badge badge-primary" style={{ marginBottom: '16px' }}>🏆 All-Time Records</span>
                <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)' }}>Hall of <span className="text-gradient">Fortune</span></h1>
                <p style={{ color: 'var(--text-dim)', maxWidth: '550px', margin: '12px auto 0', lineHeight: 1.7 }}>
                    Celebrating our daily winners. Every midnight, three lucky participants are selected automatically and paid instantly.
                </p>
            </header>

            {/* Responsive layout: side-by-side on desktop, stacked on mobile */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 1fr) 280px',
                gap: '30px',
            }}
                className="winners-layout"
            >
                {/* Main Winners List */}
                <section>
                    <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.1rem' }}>
                        <Trophy color="var(--primary)" size={20} /> Recent Winners
                    </h3>

                    {winners.length === 0 ? (
                        <div className="premium-card" style={{ textAlign: 'center', padding: '60px 20px' }}>
                            <AlertCircle size={48} style={{ margin: '0 auto 16px', color: 'var(--text-dim)' }} />
                            <h3 style={{ marginBottom: '8px' }}>No Winners Yet</h3>
                            <p style={{ color: 'var(--text-dim)' }}>The first draw hasn't happened yet. Check back at midnight!</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {winners.map((winner, idx) => (
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    key={winner.id}
                                    className="premium-card"
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: '1.25rem 1.5rem',
                                        gap: '16px',
                                        flexWrap: 'wrap',
                                        borderLeft: `4px solid ${MEDAL_COLOR[winner.position] || 'var(--glass-border)'}`,
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                        <div style={{
                                            width: '52px', height: '52px', borderRadius: '50%', flexShrink: 0,
                                            background: winner.position === 1 ? 'rgba(245,197,24,0.12)' : 'rgba(255,255,255,0.05)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem',
                                        }}>
                                            {MEDAL[winner.position] || '🎖'}
                                        </div>
                                        <div>
                                            <h4 style={{ fontSize: '1rem', marginBottom: '4px' }}>{winner.User?.fullName || 'Anonymous'}</h4>
                                            <p style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>{winner.Draw?.drawDate || '—'}</p>
                                        </div>
                                    </div>

                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-dim)', fontSize: '0.8rem', marginBottom: '4px', justifyContent: 'flex-end' }}>
                                            <Hash size={13} />
                                            <span style={{ fontFamily: 'monospace' }}>{winner.Ticket?.ticketNumber || '—'}</span>
                                        </div>
                                        <div style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--secondary)' }}>
                                            +{winner.prizeAmount} ETB
                                        </div>
                                        <span className="badge badge-success" style={{ fontSize: '0.65rem', marginTop: '4px' }}>
                                            {winner.position === 1 ? '1st Place' : winner.position === 2 ? '2nd Place' : '3rd Place'}
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </section>

                {/* Sidebar Draw History */}
                <aside>
                    <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.1rem' }}>
                        <Calendar size={20} color="var(--primary)" /> Past Draws
                    </h3>

                    {history.length === 0 ? (
                        <div className="premium-card" style={{ textAlign: 'center', padding: '30px', fontSize: '0.85rem', color: 'var(--text-dim)' }}>
                            No draw history yet.
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                            {history.map(draw => (
                                <motion.div
                                    key={draw.id}
                                    whileHover={{ scale: 1.02 }}
                                    className="premium-card"
                                    style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)' }}
                                >
                                    <p style={{ fontWeight: '700', fontSize: '0.9rem', marginBottom: '8px' }}>{draw.drawDate}</p>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                                        <span>{draw.totalTickets} Tickets</span>
                                        <span style={{ color: 'var(--primary)', fontWeight: '600' }}>{draw.totalPrize} ETB</span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </aside>
            </div>

            <style>{`
                @media (max-width: 768px) {
                    .winners-layout {
                        grid-template-columns: 1fr !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default Winners;
