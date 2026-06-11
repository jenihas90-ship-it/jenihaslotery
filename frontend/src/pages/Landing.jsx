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
                position: 'relative',
                padding: '120px 5% 80px',
                textAlign: 'center',
                overflow: 'hidden',
                background: 'var(--bg-dark)'
            }}>
                {/* Background Glow */}
                <div style={{
                    position: 'absolute',
                    top: '-20%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '100%',
                    height: '100%',
                    background: 'radial-gradient(circle at 50% 30%, rgba(245, 197, 24, 0.1) 0%, transparent 60%)',
                    zIndex: 0
                }}></div>

                <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="badge badge-primary" style={{ marginBottom: '20px' }}>Ethiopia's #1 Daily Lottery</span>
                        <h1 style={{ fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', lineHeight: 1.1, marginBottom: '20px', fontWeight: 800 }}>
                            Win your Fortune <br />
                            <span className="text-gradient">Every Single Midnight</span>
                        </h1>
                        <p style={{ color: 'var(--text-dim)', fontSize: '1.25rem', maxWidth: '650px', margin: '0 auto 40px', lineHeight: 1.6 }}>
                            Join thousands of winners today. Just 20 ETB gives you a chance to change your life. Transparent, secure, and instant payouts.
                        </p>

                        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <Link to="/register" className="btn-primary" style={{ padding: '1.2rem 3rem', fontSize: '1.1rem', borderRadius: '50px', boxShadow: '0 10px 30px rgba(245, 197, 24, 0.3)' }}>
                                <Ticket size={24} /> Get Started Now
                            </Link>
                            <Link to="/winners" className="btn-secondary" style={{ padding: '1.2rem 2.5rem', borderRadius: '50px' }}>
                                View Past Result
                            </Link>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4, duration: 1 }}
                        style={{ marginTop: '80px', position: 'relative' }}
                    >
                        <img
                            src="/src/assets/hero_premium.png"
                            alt="Lottery Premium"
                            style={{
                                width: '100%',
                                maxWidth: '900px',
                                borderRadius: '30px',
                                boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
                                border: '1px solid rgba(255,255,255,0.1)'
                            }}
                        />
                        <div style={{
                            position: 'absolute',
                            bottom: '-20px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '90%',
                            background: 'rgba(10, 10, 26, 0.8)',
                            backdropFilter: 'blur(20px)',
                            padding: '20px',
                            borderRadius: '20px',
                            border: '1px solid var(--glass-border)',
                            display: 'flex',
                            justifyContent: 'space-around',
                            alignItems: 'center'
                        }}>
                            <div>
                                <h4 style={{ margin: 0, color: 'var(--primary)' }}>500 ETB</h4>
                                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-dim)' }}>Jackpot</p>
                            </div>
                            <div style={{ width: '1px', height: '40px', background: 'var(--glass-border)' }}></div>
                            <div>
                                <CountdownTimer />
                                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-dim)', textAlign: 'center' }}>Time Left</p>
                            </div>
                            <div style={{ width: '1px', height: '40px', background: 'var(--glass-border)' }}></div>
                            <div>
                                <h4 style={{ margin: 0, color: 'white' }}>Live</h4>
                                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-dim)' }}>Status</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
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
