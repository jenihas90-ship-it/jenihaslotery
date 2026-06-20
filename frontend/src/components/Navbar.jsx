import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, LogOut, LayoutDashboard, Trophy, Menu, X, Ticket } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
        setMenuOpen(false);
    };

    const isActive = (path) => location.pathname === path;

    const navLinkStyle = (path) => ({
        color: isActive(path) ? 'var(--primary)' : 'var(--text-dim)',
        fontWeight: isActive(path) ? '600' : '500',
        fontSize: '0.95rem',
        transition: 'color 0.2s',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
    });

    return (
        <>
            <nav style={{
                height: 'var(--navbar-height)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 5%',
                background: 'rgba(10, 10, 26, 0.85)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                borderBottom: '1px solid var(--glass-border)',
                position: 'sticky',
                top: 0,
                zIndex: 1000,
            }}>
                {/* Logo */}
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px' }} onClick={() => setMenuOpen(false)}>
                    <div style={{
                        width: '40px', height: '40px',
                        background: 'linear-gradient(135deg, var(--primary), #d4a717)',
                        borderRadius: '10px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#000', fontWeight: '900', fontSize: '22px',
                        boxShadow: '0 4px 15px rgba(245,197,24,0.3)',
                    }}>🎟</div>
                    <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'white' }}>
                        DAILY<span style={{ color: 'var(--primary)' }}>LOTTERY</span>
                    </span>
                </Link>

                {/* Desktop Nav */}
                <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }} className="desktop-nav">
                    <Link to="/winners" style={navLinkStyle('/winners')}>
                        <Trophy size={16} /> Results
                    </Link>

                    {user ? (
                        <>
                            <Link
                                to={user.role === 'admin' ? '/admin' : '/dashboard'}
                                style={navLinkStyle(user.role === 'admin' ? '/admin' : '/dashboard')}
                            >
                                <LayoutDashboard size={16} />
                                Dashboard
                            </Link>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <span className="badge badge-warning" style={{ margin: 0 }}>
                                    {user.walletBalance} ETB
                                </span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <div style={{
                                        width: '32px', height: '32px',
                                        background: 'linear-gradient(135deg, var(--primary), #d4a717)',
                                        borderRadius: '50%',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: '#000', fontWeight: '800', fontSize: '13px',
                                    }}>
                                        {user.fullName?.charAt(0)?.toUpperCase()}
                                    </div>
                                    <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>{user.fullName?.split(' ')[0]}</span>
                                </div>
                                <button onClick={handleLogout} style={{ color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.85rem', opacity: 0.8 }}
                                    title="Logout">
                                    <LogOut size={18} />
                                </button>
                            </div>
                        </>
                    ) : (
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <Link to="/login" className="btn-secondary" style={{ padding: '0.6rem 1.2rem' }}>Login</Link>
                            <Link to="/register" className="btn-primary" style={{ padding: '0.6rem 1.2rem' }}>Get Started</Link>
                        </div>
                    )}
                </div>

                {/* Mobile Hamburger */}
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    style={{ color: 'white', display: 'none', padding: '8px' }}
                    className="hamburger-btn"
                    aria-label="Toggle menu"
                >
                    {menuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </nav>

            {/* Mobile Menu */}
            {menuOpen && (
                <div style={{
                    background: 'rgba(10,10,26,0.98)',
                    backdropFilter: 'blur(20px)',
                    borderBottom: '1px solid var(--glass-border)',
                    padding: '1.5rem 5%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    position: 'sticky',
                    top: 'var(--navbar-height)',
                    zIndex: 999,
                }}>
                    <Link to="/winners" onClick={() => setMenuOpen(false)} style={{ color: isActive('/winners') ? 'var(--primary)' : 'var(--text-dim)', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px', padding: '0.5rem 0' }}>
                        <Trophy size={18} /> Results
                    </Link>

                    {user ? (
                        <>
                            <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} onClick={() => setMenuOpen(false)}
                                style={{ color: 'var(--primary)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', padding: '0.5rem 0' }}>
                                <LayoutDashboard size={18} /> Dashboard
                            </Link>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0', borderTop: '1px solid var(--glass-border)', paddingTop: '1rem' }}>
                                <div>
                                    <div style={{ fontWeight: '600' }}>{user.fullName}</div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--primary)' }}>{user.walletBalance} ETB</div>
                                </div>
                                <button onClick={handleLogout} style={{ color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600' }}>
                                    <LogOut size={18} /> Logout
                                </button>
                            </div>
                        </>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid var(--glass-border)' }}>
                            <Link to="/login" onClick={() => setMenuOpen(false)} className="btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>Login</Link>
                            <Link to="/register" onClick={() => setMenuOpen(false)} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Get Started</Link>
                        </div>
                    )}
                </div>
            )}

            <style>{`
                @media (max-width: 768px) {
                    .desktop-nav { display: none !important; }
                    .hamburger-btn { display: flex !important; }
                }
            `}</style>
        </>
    );
};

export default Navbar;
