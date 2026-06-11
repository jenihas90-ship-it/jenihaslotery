import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { motion } from 'framer-motion';
import { Users, Ticket, TrendingUp, DollarSign, Play, ShieldAlert, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [salesData, setSalesData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [runningDraw, setRunningDraw] = useState(false);
    const [view, setView] = useState('overview');
    const [pendingTickets, setPendingTickets] = useState([]);

    const fetchAdminData = async () => {
        try {
            const [statsRes, usersRes, salesRes, ticketsRes] = await Promise.all([
                api.get('/admin/stats'),
                api.get('/admin/users'),
                api.get('/admin/reports/sales'),
                api.get('/admin/tickets/pending')
            ]);
            setStats(statsRes.data);
            setUsers(usersRes.data);
            setSalesData(salesRes.data.reverse());
            setPendingTickets(ticketsRes.data);
        } catch (err) {
            toast.error('Failed to load admin data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAdminData();
    }, []);

    const handleToggleStatus = async (userId, currentStatus) => {
        try {
            await api.patch(`/admin/users/${userId}/status`, { isActive: !currentStatus });
            toast.success(`User ${!currentStatus ? 'activated' : 'suspended'}`);
            fetchAdminData();
        } catch (err) {
            toast.error('Operation failed');
        }
    };

    const handleTicketAction = async (ticketId, action) => {
        try {
            await api.post(`/admin/tickets/${ticketId}/${action}`);
            toast.success(`Ticket ${action}d successfully`);
            fetchAdminData();
        } catch (err) {
            toast.error(`Failed to ${action} ticket`);
        }
    };

    const handleRunDraw = async () => {
        if (!window.confirm('Are you sure you want to trigger the draw for today right now?')) return;
        setRunningDraw(true);
        try {
            await api.post('/admin/draw/run-now', {});
            toast.success('Draw completed successfully!');
            fetchAdminData();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Draw failed');
        } finally {
            setRunningDraw(false);
        }
    };

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
            <Loader2 size={48} className="animate-spin" color="var(--primary)" />
        </div>
    );

    return (
        <div className="animate-fade" style={{ padding: '40px 5%' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem' }}>Admin <span className="text-gradient">Control</span></h1>
                    <div style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>
                        <button
                            onClick={() => setView('overview')}
                            style={{ color: view === 'overview' ? 'var(--primary)' : 'var(--text-dim)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: view === 'overview' ? 'bold' : 'normal' }}
                        >
                            Overview
                        </button>
                        <button
                            onClick={() => setView('tickets')}
                            style={{ color: view === 'tickets' ? 'var(--primary)' : 'var(--text-dim)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: view === 'tickets' ? 'bold' : 'normal', position: 'relative' }}
                        >
                            Ticket Approvals
                            {pendingTickets.length > 0 && (
                                <span style={{ position: 'absolute', top: '-8px', right: '-15px', background: 'var(--danger)', color: 'white', borderRadius: '50%', padding: '2px 6px', fontSize: '10px' }}>
                                    {pendingTickets.length}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
                <button
                    onClick={handleRunDraw}
                    className="btn-primary"
                    style={{ background: 'var(--accent)' }}
                    disabled={runningDraw}
                >
                    {runningDraw ? <Loader2 className="animate-spin" /> : <><Play size={18} /> Trigger Today's Draw</>}
                </button>
            </header>

            {view === 'overview' ? (
                <>
                    {/* Stats Cards */}
                    <div className="dashboard-grid" style={{ marginBottom: '40px' }}>
                        <div className="premium-card">
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Users color="var(--primary)" />
                                <span style={{ color: 'var(--secondary)', fontSize: '0.8rem' }}>Active Platform</span>
                            </div>
                            <h2 style={{ fontSize: '2rem', margin: '10px 0' }}>{stats.userCount}</h2>
                            <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>Total Registered Users</p>
                        </div>
                        <div className="premium-card">
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Ticket color="var(--primary)" />
                                <span style={{ color: 'var(--secondary)', fontSize: '0.8rem' }}>All-time</span>
                            </div>
                            <h2 style={{ fontSize: '2rem', margin: '10px 0' }}>{stats.ticketCount}</h2>
                            <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>Total Tickets Sold</p>
                        </div>
                        <div className="premium-card">
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <DollarSign color="var(--primary)" />
                                <span style={{ color: 'var(--secondary)', fontSize: '0.8rem' }}>ETB</span>
                            </div>
                            <h2 style={{ fontSize: '2rem', margin: '10px 0' }}>{stats.totalRevenue}</h2>
                            <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>Total Revenue</p>
                        </div>
                        <div className="premium-card">
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <TrendingUp color="var(--primary)" />
                                <span style={{ color: stats.netProfit >= 0 ? 'var(--secondary)' : 'var(--danger)', fontSize: '0.8rem' }}>Net</span>
                            </div>
                            <h2 style={{ fontSize: '2rem', margin: '10px 0' }}>{stats.netProfit}</h2>
                            <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>System Profit/Loss</p>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
                        {/* User Management */}
                        <section className="premium-card" style={{ padding: '0' }}>
                            <div style={{ padding: '2rem', borderBottom: '1px solid var(--glass-border)' }}>
                                <h3>User Management</h3>
                            </div>
                            <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                    <thead style={{ background: 'rgba(255,255,255,0.02)', color: 'var(--text-dim)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                                        <tr>
                                            <th style={{ padding: '15px 20px' }}>User</th>
                                            <th style={{ padding: '15px 20px' }}>Phone</th>
                                            <th style={{ padding: '15px 20px' }}>Wallet</th>
                                            <th style={{ padding: '15px 20px' }}>Status</th>
                                            <th style={{ padding: '15px 20px' }}>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map(u => (
                                            <tr key={u.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                                <td style={{ padding: '15px 20px' }}>
                                                    <div style={{ fontWeight: '600' }}>{u.fullName}</div>
                                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{u.email}</div>
                                                </td>
                                                <td style={{ padding: '15px 20px' }}>{u.phone}</td>
                                                <td style={{ padding: '15px 20px' }}>{u.walletBalance} ETB</td>
                                                <td style={{ padding: '15px 20px' }}>
                                                    <span className={`badge ${u.isActive ? 'badge-success' : 'badge-danger'}`}>
                                                        {u.isActive ? 'Active' : 'Suspended'}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '15px 20px' }}>
                                                    <button
                                                        onClick={() => handleToggleStatus(u.id, u.isActive)}
                                                        style={{ color: u.isActive ? 'var(--danger)' : 'var(--secondary)', fontSize: '0.8rem', fontWeight: 'bold' }}
                                                    >
                                                        {u.isActive ? 'Suspend' : 'Activate'}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        {/* Revenue Chart */}
                        <section>
                            <div className="premium-card" style={{ height: '100%' }}>
                                <h3>Revenue Trend</h3>
                                <div style={{ height: '300px', marginTop: '20px' }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={salesData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                            <XAxis dataKey="drawDate" stroke="var(--text-dim)" fontSize={10} tickLine={false} axisLine={false} />
                                            <YAxis stroke="var(--text-dim)" fontSize={10} tickLine={false} axisLine={false} />
                                            <Tooltip
                                                contentStyle={{ background: 'var(--bg-accent)', border: '1px solid var(--glass-border)', borderRadius: '8px' }}
                                                itemStyle={{ color: 'var(--primary)' }}
                                            />
                                            <Line type="monotone" dataKey="totalRevenue" stroke="var(--primary)" strokeWidth={3} dot={{ r: 4, fill: 'var(--primary)' }} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </section>
                    </div>
                </>
            ) : (
                <section className="premium-card" style={{ padding: '0' }}>
                    <div style={{ padding: '2rem', borderBottom: '1px solid var(--glass-border)' }}>
                        <h3>Pending Ticket Approvals</h3>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>New requests waiting for bank payment details</p>
                    </div>
                    <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead style={{ background: 'rgba(255,255,255,0.02)', color: 'var(--text-dim)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                                <tr>
                                    <th style={{ padding: '15px 20px' }}>Ticket #</th>
                                    <th style={{ padding: '15px 20px' }}>User</th>
                                    <th style={{ padding: '15px 20px' }}>Date</th>
                                    <th style={{ padding: '15px 20px' }}>Price</th>
                                    <th style={{ padding: '15px 20px' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pendingTickets.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-dim)' }}>No pending approvals</td>
                                    </tr>
                                ) : (
                                    pendingTickets.map(t => (
                                        <tr key={t.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                            <td style={{ padding: '15px 20px' }}>
                                                <code style={{ background: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: '4px' }}>{t.ticketNumber}</code>
                                            </td>
                                            <td style={{ padding: '15px 20px' }}>
                                                <div style={{ fontWeight: '600' }}>{t.User.fullName}</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{t.User.phone}</div>
                                            </td>
                                            <td style={{ padding: '15px 20px' }}>{t.drawDate}</td>
                                            <td style={{ padding: '15px 20px' }}>{t.price} ETB</td>
                                            <td style={{ padding: '15px 20px', display: 'flex', gap: '10px' }}>
                                                <button
                                                    onClick={() => handleTicketAction(t.id, 'approve')}
                                                    className="btn-primary"
                                                    style={{ padding: '6px 12px', fontSize: '0.75rem', background: 'var(--secondary)', minWidth: 'auto' }}
                                                >
                                                    Approve & Send Info
                                                </button>
                                                <button
                                                    onClick={() => handleTicketAction(t.id, 'reject')}
                                                    className="btn-primary"
                                                    style={{ padding: '6px 12px', fontSize: '0.75rem', background: 'var(--danger)', minWidth: 'auto' }}
                                                >
                                                    Reject
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
            )}
        </div>
    );
};

export default AdminDashboard;
