import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { Wallet, Ticket, History, Plus, AlertCircle, Loader2 } from 'lucide-react';
import PaymentModal from '../components/PaymentModal';

const Dashboard = () => {
    const { user, setUser } = useAuth();
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [buying, setBuying] = useState(false);
    const [isPaymentOpen, setIsPaymentOpen] = useState(false);
    const [ticketQty, setTicketQty] = useState(1);

    const fetchData = async () => {
        try {
            const [ticketRes, userRes] = await Promise.all([
                api.get('/tickets/my-tickets'),
                api.get('/auth/me')
            ]);
            setTickets(ticketRes.data);
            setUser(userRes.data);
        } catch (err) {
            toast.error('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleBuyTicket = async () => {
        if (user.walletBalance < (ticketQty * 20)) {
            toast.error('Insufficient balance. Please top up.');
            setIsPaymentOpen(true);
            return;
        }

        setBuying(true);
        try {
            const res = await api.post('/tickets/buy', { quantity: ticketQty });
            toast.success(res.data.message);
            fetchData();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Purchase failed');
        } finally {
            setBuying(false);
        }
    };

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
            <Loader2 size={48} className="animate-spin" color="var(--primary)" />
        </div>
    );

    return (
        <div className="animate-fade" style={{ padding: '40px 5%' }}>
            <header style={{ marginBottom: '40px' }}>
                <h1 style={{ fontSize: '2.5rem' }}>User <span className="text-gradient">Dashboard</span></h1>
                <p style={{ color: 'var(--text-dim)' }}>Welcome back, {user.fullName}</p>
            </header>

            <div className="dashboard-grid">
                {/* Wallet Section */}
                <div className="premium-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                        <div>
                            <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', textTransform: 'uppercase' }}>Wallet Balance</p>
                            <h2 style={{ fontSize: '2.5rem', color: 'var(--primary)' }}>{user.walletBalance} <span style={{ fontSize: '1rem' }}>ETB</span></h2>
                        </div>
                        <div className="btn-primary" style={{ padding: '10px', borderRadius: '10px' }}><Wallet size={24} /></div>
                    </div>
                    <button onClick={() => setIsPaymentOpen(true)} className="btn-primary" style={{ width: '100%', gap: '10px' }}>
                        <Plus size={20} /> Add Funds
                    </button>
                </div>

                {/* Quick Buy Section */}
                <div className="premium-card">
                    <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Ticket color="var(--primary)" /> Buy Tickets
                    </h3>
                    <div style={{ marginBottom: '20px' }}>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)', marginBottom: '10px' }}>Ticket Price: 20 ETB</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <input
                                type="number"
                                value={ticketQty}
                                onChange={(e) => setTicketQty(Math.max(1, parseInt(e.target.value) || 1))}
                                style={{
                                    background: 'var(--bg-accent)', border: '1px solid var(--glass-border)',
                                    color: 'white', padding: '10px', borderRadius: '8px', width: '80px'
                                }}
                            />
                            <span style={{ color: 'var(--text-dim)' }}>x 20 = <strong>{ticketQty * 20} ETB</strong></span>
                        </div>
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

            {/* Tickets List */}
            <section style={{ marginTop: '50px' }}>
                <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <History size={20} color="var(--primary)" /> My Ticket History
                </h3>

                {tickets.length === 0 ? (
                    <div className="premium-card" style={{ textAlign: 'center', padding: '40px' }}>
                        <AlertCircle size={48} style={{ margin: '0 auto 15px', color: 'var(--text-dim)' }} />
                        <p style={{ color: 'var(--text-dim)' }}>You haven't purchased any tickets yet.</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
                        {tickets.map(ticket => (
                            <motion.div
                                key={ticket.id}
                                whileHover={{ scale: 1.02 }}
                                className="premium-card"
                                style={{ padding: '1.5rem', borderLeft: `4px solid ${ticket.status === 'won' ? 'var(--secondary)' : ticket.status === 'lost' ? 'var(--danger)' : 'var(--primary)'}` }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                                    <span className={`badge ${ticket.status === 'won' ? 'badge-success' : ticket.status === 'lost' ? 'badge-danger' : 'badge-warning'}`}>
                                        {ticket.status}
                                    </span>
                                </div>
                                <h4 style={{ fontSize: '1.4rem', margin: '15px 0', letterSpacing: '2px', color: ticket.status === 'won' ? 'var(--secondary)' : 'white' }}>
                                    {ticket.ticketNumber}
                                </h4>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>
                                    Draw Date: {ticket.drawDate}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </section>

            <PaymentModal
                isOpen={isPaymentOpen}
                onClose={() => setIsPaymentOpen(false)}
                onPaymentSuccess={fetchData}
            />
        </div>
    );
};

export default Dashboard;
