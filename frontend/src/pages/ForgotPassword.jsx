import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, Loader2, CheckCircle } from 'lucide-react';
import api from '../utils/api';
import { toast } from 'react-toastify';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/auth/forgot-password', { email });
            setSubmitted(true);
        } catch (err) {
            toast.error('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: 'calc(100vh - 80px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="premium-card"
                style={{ width: '100%', maxWidth: '440px' }}
            >
                {submitted ? (
                    <div style={{ textAlign: 'center', padding: '20px 0' }}>
                        <div style={{ color: 'var(--secondary)', marginBottom: '1.5rem' }}>
                            <CheckCircle size={64} style={{ margin: '0 auto' }} />
                        </div>
                        <h2 style={{ marginBottom: '12px' }}>Check Your Email</h2>
                        <p style={{ color: 'var(--text-dim)', marginBottom: '2rem', lineHeight: 1.7 }}>
                            If <strong style={{ color: 'white' }}>{email}</strong> has an account, we've sent a password reset link. Check your inbox.
                        </p>
                        <Link to="/login" className="btn-primary" style={{ width: '100%' }}>
                            <ArrowLeft size={18} /> Back to Login
                        </Link>
                    </div>
                ) : (
                    <>
                        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                            <div style={{
                                width: '60px', height: '60px',
                                background: 'rgba(245,197,24,0.1)',
                                borderRadius: '50%',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                margin: '0 auto 1rem'
                            }}>
                                <Mail size={28} color="var(--primary)" />
                            </div>
                            <h2 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>Forgot Password?</h2>
                            <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>
                                No worries. Enter your email and we'll send a reset link.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="input-group">
                                <label>Email Address</label>
                                <div style={{ position: 'relative' }}>
                                    <Mail size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
                                    <input
                                        type="email"
                                        placeholder="abebe@example.com"
                                        style={{ paddingLeft: '45px' }}
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="btn-primary"
                                style={{ width: '100%', padding: '1rem', marginBottom: '1rem' }}
                                disabled={loading}
                            >
                                {loading ? <Loader2 className="animate-spin" /> : 'Send Reset Link'}
                            </button>
                        </form>

                        <p style={{ textAlign: 'center', color: 'var(--text-dim)', fontSize: '0.9rem' }}>
                            <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                                <ArrowLeft size={14} /> Back to Login
                            </Link>
                        </p>
                    </>
                )}
            </motion.div>
        </div>
    );
};

export default ForgotPassword;
