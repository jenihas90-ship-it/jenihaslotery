import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { Wallet, Ticket, History, Plus, AlertCircle, Loader2, User, Mail, Phone, Calendar, TrendingUp, RefreshCw, ShieldAlert } from 'lucide-react';
import PaymentModal from '../components/PaymentModal';

const TAB_OVERVIEW = 'overview';
const TAB_TICKETS = 'tickets';
const TAB_PROFILE = 'profile';

const StatusBadge = ({ status }) => {
    const map = {
        won: { cls: 'badge-success', label: '🏆 Won' },
        lost: { cls: 'badge-danger', label: '❌ Lost' },
        pending: { cls: 'badge-warning', label: '⏳ Pending' },
        active: { cls: 'badge-primary', label: '🟢 Active' },
    };
    const s = map[status] || { cls: 'badge-info', label: status };
    return <span className={`badge ${s.cls}`}>{s.label}</span>;
};

const Dashboard = () => {
    const { user, setUser } = useAuth();
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [buying, setBuying] = useState(false);
    const [isPaymentOpen, setIsPaymentOpen] = useState(false);
    const [ticketQty, setTicketQty] = useState(1);
    const [activeTab, setActiveTab] = useState(TAB_OVERVIEW);
    const [refreshing, setRefreshing] = useState(false);

    const fetchData = async (silent = false) => {
        if (!silent) setLoading(true);
        else setRefreshing(true);
        try {
            const [ticketRes, userRes] = await Promise.all([
                api.get('/tickets/my-tickets'),
                api.get('/auth/me'),
            ]);
            setTickets(ticketRes.data);
            setUser(userRes.data);
        } catch (err) {
            toast.error('Failed to load dashboard data');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handleBuyTicket = async () => {
        if (user.walletBalance < (ticketQty * 20)) {
            toast.error('Insufficient balance. Please top up.');
            setIsPaymentOpen(true);
            return;
        }
        setBuying(true);
        try {
            const res = await api.post('/tickets/buy', { quantity: ticketQty });
            toast.success(res.data.message || 'Tickets purchased!');
            fetchData(true);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Purchase failed');
        } finally {
            setBuying(false);
        }
    };

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', flexDirection: 'column', gap: '16px' }}>
            <Loader2 size={48} className="animate-spin" color="var(--primary)" />
            <p style={{ color: 'var(--text-dim)' }}>Loading your dashboard…</p>
        </div>
    );

    const wonTickets = tickets.filter(t => t.status === 'won');
    const totalSpent = tickets.length * 20;
    const totalWon = wonTickets.reduce((sum, t) => sum + (t.prizeAmount || 0), 0);

    return (
        <div className="animate-fade" style={{ padding: '40px 5%' }}>
            {/* Header */}
            <header style={{ marginBottom: '32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                        <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)' }}>
                            My <span className="text-gradient">Dashboard</span>
                        </h1>
                        <p style={{ color: 'var(--text-dim)', marginTop: '4px' }}>Welcome back, {user.fullName?.split(' ')[0]} 👋</p>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        {user.role === 'admin' && (
                            <Link to="/admin" style={{ color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 'bold', border: '1px solid var(--accent)', padding: '4px 10px', borderRadius: '8px' }}>
                                <ShieldAlert size={16} /> Admin Panel
                            </Link>
                        )}
                        <button
                            onClick={() => fetchData(true)}
                            style={{ color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}
                        >
                            <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} /> Refresh
                        </button>
                    </div>
                </div>
            </header>

            {/* Tabs */}
            <div className="tab-bar">
                {[
                    { id: TAB_OVERVIEW, label: 'Overview', icon: <TrendingUp size={16} /> },
                    { id: TAB_TICKETS, label: `My Tickets (${tickets.length})`, icon: <Ticket size={16} /> },
                    { id: TAB_PROFILE, label: 'Profile', icon: <User size={16} /> },
                ].map(t => (
                    <button key={t.id} className={`tab-btn ${activeTab === t.id ? 'active' : ''}`} onClick={() => setActiveTab(t.id)}>
                        {t.icon} {t.label}
                    </button>
                ))}
            </div>

            {/* ── OVERVIEW TAB ── */}
            {activeTab === TAB_OVERVIEW && (
                <div className="animate-fade">
                    {/* Stats row */}
                    <div className="stats-grid" style={{ marginBottom: '1.5rem' }}>
                        {[
                            { label: 'Wallet Balance', value: `${user.walletBalance} ETB`, color: 'var(--primary)', icon: <Wallet size={20} /> },
                            { label: 'Tickets Bought', value: tickets.length, color: 'var(--secondary)', icon: <Ticket size={20} /> },
                            { label: 'Total Spent', value: `${totalSpent} ETB`, color: 'var(--text-dim)', icon: <TrendingUp size={20} /> },
                            { label: 'Total Won', value: `${totalWon} ETB`, color: totalWon > 0 ? 'var(--secondary)' : 'var(--text-dim)', icon: '🏆' },
                        ].map(({ label, value, color, icon }) => (
                            <div key={label} className="premium-card" style={{ padding: '1.25rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                    <span style={{ color: 'var(--text-dim)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
                                    <span style={{ color }}>{icon}</span>
                                </div>
                                <div style={{ fontSize: '1.5rem', fontWeight: '800', color }}>{value}</div>
                            </div>
                        ))}
                    </div>

                    <div className="dashboard-grid">
                        {/* Wallet card */}
                        <div className="premium-card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <div>
                                    <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Wallet Balance</p>
                                    <h2 style={{ fontSize: '2.5rem', color: 'var(--primary)', lineHeight: 1.1 }}>
                                        {user.walletBalance} <span style={{ fontSize: '1rem', color: 'var(--text-dim)' }}>ETB</span>
                                    </h2>
                                </div>
                                <div className="btn-primary" style={{ padding: '12px', borderRadius: '12px' }}>
                                    <Wallet size={24} />
                                </div>
                            </div>
                            <button onClick={() => setIsPaymentOpen(true)} className="btn-primary" style={{ width: '100%', gap: '10px' }}>
                                <Plus size={20} /> Add Funds
                            </button>
                        </div>

                        {/* Buy tickets card */}
                        <div className="premium-card">
                            <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Ticket color="var(--primary)" size={20} /> Buy Tickets
                            </h3>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginBottom: '16px' }}>Ticket Price: <strong style={{ color: 'var(--primary)' }}>20 ETB</strong> each</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                                <button
                                    onClick={() => setTicketQty(q => Math.max(1, q - 1))}
                                    style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'var(--glass)', border: '1px solid var(--glass-border)', color: 'white', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                >−</button>
                                <input
                                    type="number"
                                    value={ticketQty}
                                    onChange={(e) => setTicketQty(Math.max(1, parseInt(e.target.value) || 1))}
                                    style={{ background: 'var(--bg-accent)', border: '1px solid var(--glass-border)', color: 'white', padding: '8px', borderRadius: '8px', width: '70px', textAlign: 'center', fontWeight: '700' }}
                                />
                                <button
                                    onClick={() => setTicketQty(q => q + 1)}
                                    style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'var(--glass)', border: '1px solid var(--glass-border)', color: 'white', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                >+</button>
                                <span style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>= <strong style={{ color: 'white' }}>{ticketQty * 20} ETB</strong></span>
                            </div>
                            <button
                                onClick={handleBuyTicket}
                                className="btn-primary"
                                style={{ width: '100%', background: 'linear-gradient(135deg, var(--secondary), #059669)' }}
                                disabled={buying}
                            >
                                {buying ? <Loader2 className="animate-spin" /> : 'Confirm Purchase'}
                            </button>
                        </div>
                    </div>

                    {/* Recent tickets preview */}
                    {tickets.length > 0 && (
                        <div style={{ marginTop: '2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <History size={20} color="var(--primary)" /> Recent Tickets
                                </h3>
                                <button onClick={() => setActiveTab(TAB_TICKETS)} style={{ color: 'var(--primary)', fontSize: '0.85rem', fontWeight: '600' }}>View All →</button>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: '1rem' }}>
                                {tickets.slice(0, 4).map(ticket => (
                                    <TicketCard key={ticket.id} ticket={ticket} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* ── TICKETS TAB ── */}
            {activeTab === TAB_TICKETS && (
                <div className="animate-fade">
                    {tickets.length === 0 ? (
                        <div className="premium-card" style={{ textAlign: 'center', padding: '60px 20px' }}>
                            <AlertCircle size={56} style={{ margin: '0 auto 16px', color: 'var(--text-dim)' }} />
                            <h3 style={{ marginBottom: '8px' }}>No Tickets Yet</h3>
                            <p style={{ color: 'var(--text-dim)', marginBottom: '24px' }}>Buy your first ticket for just 20 ETB!</p>
                            <button onClick={() => setActiveTab(TAB_OVERVIEW)} className="btn-primary" style={{ padding: '0.8rem 2rem' }}>
                                <Ticket size={18} /> Buy Tickets
                            </button>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
                            {tickets.map(ticket => (
                                <TicketCard key={ticket.id} ticket={ticket} />
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* ── PROFILE TAB ── */}
            {activeTab === TAB_PROFILE && (
                <div className="animate-fade" style={{ maxWidth: '600px' }}>
                    <div className="premium-card">
                        {/* Avatar */}
                        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                            <div style={{
                                width: '80px', height: '80px',
                                background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                                borderRadius: '50%',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                margin: '0 auto 12px',
                                fontSize: '2rem', fontWeight: '900', color: '#000',
                            }}>
                                {user.fullName?.charAt(0)?.toUpperCase()}
                            </div>
                            <h3>{user.fullName}</h3>
                            <span className="badge badge-primary" style={{ marginTop: '6px' }}>
                                {user.role === 'admin' ? '👑 Admin' : '🎟 Player'}
                            </span>
                        </div>

                        <div className="divider-h" style={{ marginBottom: '1.5rem' }} />

                        {[
                            { icon: <User size={18} />, label: 'Full Name', value: user.fullName },
                            { icon: <Mail size={18} />, label: 'Email', value: user.email },
                            { icon: <Phone size={18} />, label: 'Phone', value: user.phone },
                            { icon: <Calendar size={18} />, label: 'Member Since', value: user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-ET', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A' },
                            { icon: <Wallet size={18} />, label: 'Wallet Balance', value: `${user.walletBalance} ETB`, highlight: true },
                        ].map(({ icon, label, value, highlight }) => (
                            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '14px 0', borderBottom: '1px solid var(--glass-border)' }}>
                                <div style={{ color: 'var(--primary)', flexShrink: 0 }}>{icon}</div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
                                    <div style={{ fontWeight: '600', color: highlight ? 'var(--primary)' : 'white', marginTop: '2px' }}>{value}</div>
                                </div>
                            </div>
                        ))}

                        <div style={{ marginTop: '1.5rem', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                            <button onClick={() => setIsPaymentOpen(true)} className="btn-primary" style={{ flex: 1 }}>
                                <Plus size={18} /> Add Funds
                            </button>
                        </div>
                    </div>

                    {/* Summary stats */}
                    <div className="stats-grid" style={{ marginTop: '1rem' }}>
                        <div className="premium-card" style={{ padding: '1.25rem', textAlign: 'center' }}>
                            <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--secondary)' }}>{tickets.length}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '4px' }}>Total Tickets</div>
                        </div>
                        <div className="premium-card" style={{ padding: '1.25rem', textAlign: 'center' }}>
                            <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--primary)' }}>{wonTickets.length}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '4px' }}>Times Won</div>
                        </div>
                        <div className="premium-card" style={{ padding: '1.25rem', textAlign: 'center' }}>
                            <div style={{ fontSize: '1.8rem', fontWeight: '800', color: totalWon > 0 ? 'var(--secondary)' : 'var(--text-dim)' }}>{totalWon} ETB</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '4px' }}>Total Won</div>
                        </div>
                    </div>
                </div>
            )}

            <PaymentModal
                isOpen={isPaymentOpen}
                onClose={() => setIsPaymentOpen(false)}
                onPaymentSuccess={() => fetchData(true)}
            />
        </div>
    );
};

const TicketCard = ({ ticket }) => {
    const borderColor = ticket.status === 'won' ? 'var(--secondary)' :
        ticket.status === 'lost' ? 'var(--danger)' : 'var(--primary)';
    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            className="premium-card"
            style={{ padding: '1.25rem', borderLeft: `4px solid ${borderColor}` }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                    {ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString() : '—'}
                </span>
                <span className={`badge ${ticket.status === 'won' ? 'badge-success' : ticket.status === 'lost' ? 'badge-danger' : 'badge-warning'}`}>
                    {ticket.status === 'won' ? '🏆 Won' : ticket.status === 'lost' ? 'Lost' : '⏳ Pending'}
                </span>
            </div>
            <div style={{ fontSize: '1.3rem', fontWeight: '800', letterSpacing: '3px', color: ticket.status === 'won' ? 'var(--secondary)' : 'white', marginBottom: '8px', fontFamily: 'monospace' }}>
                {ticket.ticketNumber}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Draw: {ticket.drawDate}</div>
            {ticket.status === 'won' && ticket.prizeAmount && (
                <div style={{ marginTop: '8px', color: 'var(--secondary)', fontWeight: '800', fontSize: '1rem' }}>
                    +{ticket.prizeAmount} ETB
                </div>
            )}
        </motion.div>
    );
};

export default Dashboard;
