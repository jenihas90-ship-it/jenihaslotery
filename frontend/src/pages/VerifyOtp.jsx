import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Mail, CheckCircle2, Loader2, RefreshCw, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const VerifyOtp = () => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const { verifyOtp, resendOtp } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const email = new URLSearchParams(location.search).get('email');

    useEffect(() => {
        if (!email) {
            navigate('/register');
        }
    }, [email, navigate]);

    const handleChange = (element, index) => {
        if (isNaN(element.value)) return false;

        setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

        // Focus next input
        if (element.nextSibling && element.value !== '') {
            element.nextSibling.focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace') {
            if (otp[index] === '' && e.target.previousSibling) {
                e.target.previousSibling.focus();
            }
        }
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        const code = otp.join('');
        if (code.length < 6) {
            toast.error('Please enter the full 6-digit code');
            return;
        }

        setLoading(true);
        try {
            await verifyOtp(email, code);
            toast.success('Email verified successfully!');
            navigate('/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Verification failed');
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setResending(true);
        try {
            await resendOtp(email);
            toast.success('A new code has been sent to your email');
        } catch (err) {
            toast.error('Failed to resend code');
        } finally {
            setResending(false);
        }
    };

    return (
        <div style={{ minHeight: 'calc(100vh - 80px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="premium-card"
                style={{ width: '100%', maxWidth: '440px', textAlign: 'center' }}
            >
                <div style={{ marginBottom: '2rem' }}>
                    <div style={{ width: '70px', height: '70px', background: 'rgba(245,197,24,0.1)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'var(--primary)' }}>
                        <Mail size={32} />
                    </div>
                    <h2 style={{ fontSize: '1.8rem', marginBottom: '10px' }}>Verify Your Email</h2>
                    <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>
                        We've sent a 6-digit code to <br />
                        <strong style={{ color: 'var(--text-main)' }}>{email}</strong>
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '2rem' }}>
                        {otp.map((data, index) => (
                            <input
                                key={index}
                                type="text"
                                maxLength="1"
                                value={data}
                                onChange={e => handleChange(e.target, index)}
                                onKeyDown={e => handleKeyDown(e, index)}
                                onFocus={e => e.target.select()}
                                style={{
                                    width: '45px',
                                    height: '55px',
                                    textAlign: 'center',
                                    fontSize: '1.2rem',
                                    fontWeight: 'bold',
                                    borderRadius: '12px',
                                    border: '1px solid var(--glass-border)',
                                    background: 'rgba(255,255,255,0.03)',
                                    color: 'white',
                                    outline: 'none',
                                    transition: 'all 0.2s',
                                    borderColor: data ? 'var(--primary)' : 'var(--glass-border)'
                                }}
                            />
                        ))}
                    </div>

                    <button
                        type="submit"
                        className="btn-primary"
                        style={{ width: '100%', padding: '1rem', borderRadius: '12px' }}
                        disabled={loading}
                    >
                        {loading ? <Loader2 className="animate-spin" /> : <><CheckCircle2 size={20} /> Verify & Complete</>}
                    </button>
                </form>

                <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>
                        Didn't receive the code?{' '}
                        <button
                            onClick={handleResend}
                            disabled={resending}
                            style={{ color: 'var(--primary)', fontWeight: '600', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                        >
                            {resending ? 'Sending...' : 'Resend Code'}
                        </button>
                    </p>

                    <Link to="/register" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', color: 'var(--text-dim)', fontSize: '0.85rem' }}>
                        <ArrowLeft size={14} /> Back to Register
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default VerifyOtp;
