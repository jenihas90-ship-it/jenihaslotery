import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, Shield, Zap, Ticket } from 'lucide-react';
import CountdownTimer from '../components/CountdownTimer';

const Landing = () => {
    return (
        <div className="animate-fade">
            {/* Hero Section */}
            <section style={{
                padding: '100px 5% 60px',
                textAlign: 'center',
                background: 'radial-gradient(circle at 50% 10%, rgba(245, 197, 24, 0.05) 0%, transparent 50%)'
            }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 style={{ fontSize: '4rem', lineHeight: 1.1, marginBottom: '20px' }}>
                        Daily Fortune <br />
                        <span className="text-gradient">Just 20 ETB Away</span>
                    </h1>
                    <p style={{ color: 'var(--text-dim)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto 40px' }}>
                        Join Ethiopia's most transparent daily lottery. Buy your ticket today and join the midnight draw for a chance to win 500 ETB!
                    </p>

                    <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                        <Link to="/register" className="btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>
                            <Ticket size={22} /> Buy Your First Ticket
                        </Link>
                        <Link to="/winners" className="btn-secondary" style={{ padding: '1rem 2rem' }}>
                            View Recent Winners
                        </Link>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="premium-card"
                    style={{ maxWidth: '500px', margin: '60px auto 0', padding: '40px' }}
                >
                    <h3 style={{ color: 'var(--text-dim)', textTransform: 'uppercase', fontSize: '0.9rem' }}>Next Draw In</h3>
                    <CountdownTimer />
                </motion.div>
            </section>

            {/* Prize Section */}
            <section style={{ padding: '80px 5%' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '50px' }}>Daily Prize Pool</h2>
                <div className="dashboard-grid">
                    <div className="premium-card" style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🥇</div>
                        <h3 style={{ color: 'var(--primary)' }}>500 ETB</h3>
                        <p style={{ color: 'var(--text-dim)' }}>1st Position Winner</p>
                    </div>
                    <div className="premium-card" style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🥈</div>
                        <h3 style={{ color: 'var(--text-dim)' }}>400 ETB</h3>
                        <p style={{ color: 'var(--text-dim)' }}>2nd Position Winner</p>
                    </div>
                    <div className="premium-card" style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🥉</div>
                        <h3 style={{ color: '#cd7f32' }}>300 ETB</h3>
                        <p style={{ color: 'var(--text-dim)' }}>3rd Position Winner</p>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section style={{ padding: '80px 5%', background: 'rgba(255,255,255,0.01)' }}>
                <div className="dashboard-grid">
                    <div style={{ display: 'flex', gap: '20px' }}>
                        <div className="btn-primary" style={{ height: '50px', width: '50px', borderRadius: '12px' }}><Shield /></div>
                        <div>
                            <h4>Secure & Fair</h4>
                            <p style={{ color: 'var(--text-dim)' }}>Our random selection algorithm ensures complete fairness for every user.</p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '20px' }}>
                        <div className="btn-primary" style={{ height: '50px', width: '50px', borderRadius: '12px' }}><Zap /></div>
                        <div>
                            <h4>Instant Payout</h4>
                            <p style={{ color: 'var(--text-dim)' }}>Winners receive their prizes directly into their wallet at exactly midnight.</p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '20px' }}>
                        <div className="btn-primary" style={{ height: '50px', width: '50px', borderRadius: '12px' }}><Trophy /></div>
                        <div>
                            <h4>Public Results</h4>
                            <p style={{ color: 'var(--text-dim)' }}>All past winners are archived publicly to maintain system integrity.</p>
                        </div>
                    </div>
                </div>
            </section>

            <footer style={{ padding: '60px 5%', textAlign: 'center', borderTop: '1px solid var(--glass-border)', marginTop: '40px' }}>
                <p style={{ color: 'var(--text-dim)' }}>&copy; 2024 Daily Online Lottery. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Landing;
