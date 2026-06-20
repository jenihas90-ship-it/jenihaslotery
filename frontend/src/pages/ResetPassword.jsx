import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, Loader2, CheckCircle, ShieldCheck } from 'lucide-react';
import api from '../utils/api';
import { toast } from 'react-toastify';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token') || '';
    const navigate = useNavigate();

    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirm) {
            toast.error('Passwords do not match');
            return;
        }
        if (password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }
        setLoading(true);
        try {
            await api.post('/auth/reset-password', { token, password });
            setSuccess(true);
            setTimeout(() => navigate('/login'), 2500);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Reset failed. The link may have expired.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div style={{ minHeight: 'calc(100vh - 80px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="premium-card"
                    style={{ width: '100%', maxWidth: '440px', textAlign: 'center', padding: '3rem' }}
                >
                    <CheckCircle size={64} color="var(--secondary)" style={{ margin: '0 auto 1.5rem' }} />
                    <h2>Password Reset!</h2>
                    <p style={{ color: 'var(--text-dim)', marginTop: '10px' }}>
                        Your password has been updated. Redirecting to login…
                    </p>
                </motion.div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: 'calc(100vh - 80px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="premium-card"
                style={{ width: '100%', maxWidth: '440px' }}
            >
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{
                        width: '60px', height: '60px',
                        background: 'rgba(245,197,24,0.1)',
                        borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 1rem'
                    }}>
                        <ShieldCheck size={28} color="var(--primary)" />
                    </div>
                    <h2 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>Set New Password</h2>
                    <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>
                        Choose a strong password for your account.
                    </p>
                </div>

                {!token && (
                    <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', padding: '12px 16px', marginBottom: '1.5rem', color: 'var(--danger)', fontSize: '0.85rem' }}>
                        ⚠ No reset token found. Please use the link from your email.
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>New Password</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="••••••••"
                                style={{ paddingLeft: '45px', paddingRight: '45px' }}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Confirm Password</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="••••••••"
                                style={{ paddingLeft: '45px', borderColor: confirm && password !== confirm ? 'var(--danger)' : undefined }}
                                value={confirm}
                                onChange={(e) => setConfirm(e.target.value)}
                                required
                            />
                        </div>
                        {confirm && password !== confirm && (
                            <p style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '5px' }}>Passwords don't match</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="btn-primary"
                        style={{ width: '100%', padding: '1rem' }}
                        disabled={loading || !token}
                    >
                        {loading ? <Loader2 className="animate-spin" /> : 'Reset Password'}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-dim)', fontSize: '0.85rem' }}>
                    Remember it? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '600' }}>Sign in</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default ResetPassword;
