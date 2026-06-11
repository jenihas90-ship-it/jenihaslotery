import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, LogOut, LayoutDashboard, Trophy, Menu } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav style={{
            height: '80px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 5%',
            background: 'rgba(10, 10, 26, 0.8)',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid var(--glass-border)',
            position: 'sticky',
            top: 0,
            zIndex: 1000
        }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                    width: '40px',
                    height: '40px',
                    background: 'var(--primary)',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#000',
                    fontWeight: 'bold',
                    fontSize: '24px'
                }}>L</div>
                <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'white' }}>DAILY<span style={{ color: 'var(--primary)' }}>LOTTERY</span></span>
            </Link>

            <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                <Link to="/winners" className="nav-link" style={{ color: 'var(--text-dim)', fontWeight: 500 }}>Results</Link>

                {user ? (
                    <>
                        <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'white' }}>
                            <LayoutDashboard size={20} color="var(--primary)" />
                            <span>Dashboard</span>
                        </Link>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <span className="badge badge-warning" style={{ margin: 0 }}>{user.walletBalance} ETB</span>
                            <button onClick={handleLogout} style={{ color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <LogOut size={20} />
                            </button>
                        </div>
                    </>
                ) : (
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <Link to="/login" className="btn-secondary">Login</Link>
                        <Link to="/register" className="btn-primary">Get Started</Link>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
