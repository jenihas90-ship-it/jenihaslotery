import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, Shield, Zap, Ticket, Users, Star, ArrowRight, CheckCircle } from 'lucide-react';
import CountdownTimer from '../components/CountdownTimer';

const StatCard = ({ value, label, icon }) => (
    <motion.div
        whileHover={{ scale: 1.04 }}
        style={{
            background: 'var(--glass)',
            border: '1px solid var(--glass-border)',
            borderRadius: '16px',
            padding: '1.5rem',
            textAlign: 'center',
        }}
    >
        <div style={{ fontSize: '1.8rem', marginBottom: '6px' }}>{icon}</div>
        <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--primary)', lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
    </motion.div>
);

const HowStep = ({ step, title, desc, icon }) => (
    <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
        <div style={{
            width: '70px', height: '70px',
            background: 'linear-gradient(135deg, var(--primary), #d4a717)',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1.25rem',
            fontSize: '28px',
            boxShadow: '0 8px 24px rgba(245,197,24,0.3)',
        }}>{icon}</div>
        <div style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--primary)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>Step {step}</div>
        <h4 style={{ fontSize: '1.15rem', marginBottom: '8px' }}>{title}</h4>
        <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', lineHeight: 1.6 }}>{desc}</p>
    </div>
);

const testimonials = [
    { name: 'Abebe G.', city: 'Addis Ababa', text: 'I won 500 ETB on my very first ticket! This platform is amazing and I trust it completely.', stars: 5 },
    { name: 'Tigist M.', city: 'Bahir Dar', text: 'Instant payout right into my wallet. I was impressed how fast it was after the midnight draw!', stars: 5 },
    { name: 'Dawit K.', city: 'Hawassa', text: 'Clean, simple, and transparent. I can see all winners publicly which gives me confidence.', stars: 5 },
];

const Landing = () => {
    return (
        <div className="animate-fade">
            {/* ── HERO ── */}
            <section style={{ position: 'relative', padding: '120px 5% 100px', textAlign: 'center', overflow: 'hidden' }}>
                {/* Glows */}
                <div className="hero-glow" style={{ top: '-100px', left: '50%', transform: 'translateX(-50%)', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(245,197,24,0.12) 0%, transparent 70%)' }} />
                <div className="hero-glow" style={{ bottom: '0', left: '-100px', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)' }} />

                <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                        <span className="badge badge-primary" style={{ marginBottom: '20px', fontSize: '0.8rem', padding: '0.4rem 1rem' }}>🇪🇹 Ethiopia's #1 Daily Lottery</span>

                        <h1 style={{ fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', lineHeight: 1.1, marginBottom: '20px', fontWeight: 900 }}>
                            Win Your Fortune<br />
                            <span className="text-gradient">Every Single Midnight</span>
                        </h1>

                        <p style={{ color: 'var(--text-dim)', fontSize: 'clamp(1rem, 2.5vw, 1.25rem)', maxWidth: '620px', margin: '0 auto 40px', lineHeight: 1.7 }}>
                            Join thousands of winners today. Just <strong style={{ color: 'var(--primary)' }}>20 ETB</strong> gives you a chance to change your life. Transparent, secure, and instant payouts.
                        </p>

                        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <Link to="/register" className="btn-primary" style={{ padding: '1.1rem 2.8rem', fontSize: '1.05rem', borderRadius: '50px', boxShadow: '0 12px 36px rgba(245,197,24,0.3)' }}>
                                <Ticket size={20} /> Get Started Free
                            </Link>
                            <Link to="/winners" className="btn-secondary" style={{ padding: '1.1rem 2.2rem', borderRadius: '50px' }}>
                                View Past Results <ArrowRight size={18} />
                            </Link>
                        </div>
                    </motion.div>

                    {/* Live Stats Bar */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        style={{ marginTop: '70px' }}
                    >
                        <div style={{
                            display: 'inline-flex',
                            gap: '0',
                            background: 'rgba(10,10,26,0.8)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: '20px',
                            overflow: 'hidden',
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                        }}>
                            {[
                                { label: 'Prize Pool Today', value: '1,200 ETB' },
                                null,
                                { label: 'Time Until Draw', value: <CountdownTimer compact /> },
                                null,
                                { label: 'Status', value: '🟢 Live' },
                            ].map((item, i) =>
                                item === null ? (
                                    <div key={i} style={{ width: '1px', background: 'var(--glass-border)', alignSelf: 'stretch' }} />
                                ) : (
                                    <div key={i} style={{ padding: '1.2rem 2rem', textAlign: 'center', minWidth: '150px' }}>
                                        <div style={{ fontWeight: '700', color: 'var(--primary)', fontSize: '1.05rem' }}>{item.value}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '4px' }}>{item.label}</div>
                                    </div>
                                )
                            )}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ── LIVE STATS ── */}
            <section style={{ padding: '60px 5%' }}>
                <div className="container">
                    <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
                        <StatCard value="12,400+" label="Total Players" icon="👥" />
                        <StatCard value="48,200+" label="Tickets Sold" icon="🎟" />
                        <StatCard value="350,000 ETB" label="Total Paid Out" icon="💰" />
                        <StatCard value="100%" label="Payout Rate" icon="✅" />
                    </div>
                </div>
            </section>

            {/* ── PRIZE POOL ── */}
            <section style={{ padding: '80px 5%' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)' }}>Daily <span className="text-gradient">Prize Pool</span></h2>
                        <p style={{ color: 'var(--text-dim)', marginTop: '10px' }}>Three winners every midnight, selected randomly and fairly.</p>
                    </div>
                    <div className="dashboard-grid" style={{ maxWidth: '900px', margin: '0 auto' }}>
                        {[
                            { pos: '🥇', prize: '500 ETB', label: '1st Place', color: 'var(--primary)', glow: 'rgba(245,197,24,0.2)' },
                            { pos: '🥈', prize: '400 ETB', label: '2nd Place', color: '#C0C0C0', glow: 'rgba(192,192,192,0.1)' },
                            { pos: '🥉', prize: '300 ETB', label: '3rd Place', color: '#cd7f32', glow: 'rgba(205,127,50,0.15)' },
                        ].map(({ pos, prize, label, color, glow }) => (
                            <motion.div
                                key={label}
                                whileHover={{ scale: 1.04, boxShadow: `0 20px 50px ${glow}` }}
                                className="premium-card"
                                style={{ textAlign: 'center', background: `radial-gradient(circle at 50% 0%, ${glow} 0%, transparent 60%), var(--glass)` }}
                            >
                                <div style={{ fontSize: '3.5rem', marginBottom: '12px' }}>{pos}</div>
                                <h3 style={{ fontSize: '2rem', color, margin: '0 0 6px' }}>{prize}</h3>
                                <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>{label}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── HOW IT WORKS ── */}
            <section style={{ padding: '80px 5%', background: 'rgba(255,255,255,0.01)', borderTop: '1px solid var(--glass-border)', borderBottom: '1px solid var(--glass-border)' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)' }}>How It <span className="text-gradient">Works</span></h2>
                        <p style={{ color: 'var(--text-dim)', marginTop: '10px' }}>Get started in minutes, no experience needed.</p>
                    </div>
                    <div className="dashboard-grid" style={{ maxWidth: '1000px', margin: '0 auto' }}>
                        <HowStep step={1} icon="👤" title="Create Your Account" desc="Sign up for free with just your name, email, and phone number. Takes under 60 seconds." />
                        <HowStep step={2} icon="💳" title="Top Up & Buy Tickets" desc="Add funds via Telebirr or CBE, then buy lottery tickets for just 20 ETB each." />
                        <HowStep step={3} icon="🌙" title="Win at Midnight" desc="Every night at 12:00 AM, three lucky tickets are picked. Winners are paid instantly." />
                    </div>
                </div>
            </section>

            {/* ── FEATURES ── */}
            <section style={{ padding: '80px 5%' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)' }}>Why <span className="text-gradient">Trust Us</span></h2>
                    </div>
                    <div className="dashboard-grid">
                        {[
                            { icon: <Shield size={24} />, title: 'Secure & Fair', desc: 'Our cryptographic random selection ensures total fairness. No manipulation, ever.' },
                            { icon: <Zap size={24} />, title: 'Instant Payout', desc: 'Winners receive prizes directly into their wallet at exactly midnight. No delays.' },
                            { icon: <Trophy size={24} />, title: 'Public Results', desc: 'All past winners are archived publicly for complete transparency.' },
                            { icon: <Users size={24} />, title: 'Community Driven', desc: 'Join a growing community of thousands of players across Ethiopia.' },
                        ].map(({ icon, title, desc }) => (
                            <div key={title} className="premium-card" style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
                                <div className="btn-primary" style={{ minWidth: '50px', height: '50px', borderRadius: '12px', flexShrink: 0 }}>{icon}</div>
                                <div>
                                    <h4 style={{ marginBottom: '8px' }}>{title}</h4>
                                    <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', lineHeight: 1.6 }}>{desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── TESTIMONIALS ── */}
            <section style={{ padding: '80px 5%', background: 'rgba(255,255,255,0.01)', borderTop: '1px solid var(--glass-border)' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)' }}>What <span className="text-gradient">Winners Say</span></h2>
                    </div>
                    <div className="dashboard-grid">
                        {testimonials.map(({ name, city, text, stars }) => (
                            <motion.div key={name} whileHover={{ scale: 1.02 }} className="premium-card">
                                <div style={{ display: 'flex', gap: '4px', marginBottom: '12px' }}>
                                    {Array.from({ length: stars }).map((_, i) => (
                                        <Star key={i} size={16} fill="var(--primary)" color="var(--primary)" />
                                    ))}
                                </div>
                                <p style={{ color: 'var(--text-dim)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '1.25rem' }}>"{text}"</p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div style={{
                                        width: '36px', height: '36px',
                                        background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                                        borderRadius: '50%',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: '#000', fontWeight: '800', fontSize: '14px',
                                    }}>{name.charAt(0)}</div>
                                    <div>
                                        <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{name}</div>
                                        <div style={{ color: 'var(--text-dim)', fontSize: '0.78rem' }}>{city}</div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA BANNER ── */}
            <section style={{ padding: '80px 5%' }}>
                <div className="container">
                    <motion.div
                        whileHover={{ scale: 1.01 }}
                        style={{
                            background: 'linear-gradient(135deg, rgba(245,197,24,0.15), rgba(16,185,129,0.08))',
                            border: '1px solid rgba(245,197,24,0.2)',
                            borderRadius: '24px',
                            padding: 'clamp(2rem, 5vw, 4rem)',
                            textAlign: 'center',
                        }}
                    >
                        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', marginBottom: '12px' }}>
                            Ready to <span className="text-gradient">Win Big?</span>
                        </h2>
                        <p style={{ color: 'var(--text-dim)', maxWidth: '500px', margin: '0 auto 30px', lineHeight: 1.7 }}>
                            Join thousands of daily participants. Your winning ticket is only 20 ETB away.
                        </p>
                        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <Link to="/register" className="btn-primary" style={{ padding: '1.1rem 2.8rem', borderRadius: '50px', fontSize: '1.05rem' }}>
                                <Ticket size={20} /> Buy Your First Ticket
                            </Link>
                            <Link to="/winners" className="btn-secondary" style={{ padding: '1.1rem 2rem', borderRadius: '50px' }}>
                                See Who Won
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ── FOOTER ── */}
            <footer style={{ padding: '50px 5% 40px', borderTop: '1px solid var(--glass-border)' }}>
                <div className="container">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ fontSize: '24px' }}>🎟</div>
                            <span style={{ fontWeight: '800', fontSize: '1.1rem' }}>DAILY<span style={{ color: 'var(--primary)' }}>LOTTERY</span></span>
                        </div>
                        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                            <Link to="/" style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>Home</Link>
                            <Link to="/winners" style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>Results</Link>
                            <Link to="/login" style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>Login</Link>
                            <Link to="/register" style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>Register</Link>
                        </div>
                        <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>© 2024 Daily Online Lottery. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
