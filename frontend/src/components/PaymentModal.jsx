import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, Phone, CheckCircle, Loader2 } from 'lucide-react';
import api from '../utils/api';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const METHODS = [
    { id: 'telebirr', label: 'Telebirr', emoji: '📱', color: '#00a8e0' },
    { id: 'cbe', label: 'CBE Birr', emoji: '🏦', color: '#006633' },
    { id: 'mpesa', label: 'M-Pesa', emoji: '💚', color: '#4caf50' },
];

const QUICK_AMOUNTS = [50, 100, 200, 500];

const PaymentModal = ({ isOpen, onClose, onPaymentSuccess }) => {
    const { user } = useAuth();
    const [step, setStep] = useState(1);
    const [amount, setAmount] = useState(100);
    const [method, setMethod] = useState('telebirr');
    const [phone, setPhone] = useState(user?.phone || '');
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [reference, setReference] = useState('');

    const handleClose = () => {
        setStep(1);
        setOtp('');
        setReference('');
        onClose();
    };

    const handleInitiate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post('/payment/initiate', { amount, method, phone });
            setReference(res.data.reference);
            setStep(2);
            toast.info('OTP Sent • Demo code: 123456');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Initiation failed');
        } finally {
            setLoading(false);
        }
    };

    const handleConfirm = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/payment/confirm', { reference, amount, otp });
            setStep(3);
            onPaymentSuccess();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Confirmation failed');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(10px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 2000, padding: '20px',
        }}>
            <AnimatePresence>
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="premium-card"
                    style={{ width: '100%', maxWidth: '420px', position: 'relative' }}
                >
                    {/* Close & Step indicator */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            {[1, 2, 3].map(s => (
                                <div key={s} style={{
                                    width: s === step ? '24px' : '8px',
                                    height: '8px',
                                    borderRadius: '4px',
                                    background: s <= step ? 'var(--primary)' : 'var(--glass-border)',
                                    transition: 'all 0.3s ease',
                                }} />
                            ))}
                        </div>
                        <button onClick={handleClose} style={{ color: 'var(--text-dim)', padding: '4px' }}>
                            <X size={20} />
                        </button>
                    </div>

                    {/* Step 1: Amount & Method */}
                    {step === 1 && (
                        <div className="animate-fade">
                            <h3 style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <CreditCard color="var(--primary)" size={22} /> Top Up Wallet
                            </h3>
                            <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                                Add funds via your preferred payment method.
                            </p>

                            <form onSubmit={handleInitiate}>
                                {/* Quick amounts */}
                                <div className="input-group">
                                    <label>Amount (ETB)</label>
                                    <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                                        {QUICK_AMOUNTS.map(a => (
                                            <button
                                                key={a} type="button"
                                                onClick={() => setAmount(a)}
                                                style={{
                                                    padding: '6px 14px',
                                                    borderRadius: '8px',
                                                    fontSize: '0.85rem',
                                                    fontWeight: '600',
                                                    background: amount === a ? 'var(--primary)' : 'var(--glass)',
                                                    color: amount === a ? '#000' : 'var(--text-dim)',
                                                    border: `1px solid ${amount === a ? 'var(--primary)' : 'var(--glass-border)'}`,
                                                    transition: 'all 0.2s',
                                                }}
                                            >{a}</button>
                                        ))}
                                    </div>
                                    <input
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(Number(e.target.value))}
                                        min="20"
                                        required
                                    />
                                </div>

                                {/* Method */}
                                <div className="input-group">
                                    <label>Payment Method</label>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                                        {METHODS.map(m => (
                                            <button
                                                key={m.id}
                                                type="button"
                                                onClick={() => setMethod(m.id)}
                                                style={{
                                                    padding: '10px 8px',
                                                    borderRadius: '10px',
                                                    textAlign: 'center',
                                                    border: `1px solid ${method === m.id ? m.color : 'var(--glass-border)'}`,
                                                    background: method === m.id ? `${m.color}18` : 'var(--glass)',
                                                    color: method === m.id ? m.color : 'var(--text-dim)',
                                                    fontWeight: '600',
                                                    fontSize: '0.8rem',
                                                    transition: 'all 0.2s',
                                                }}
                                            >
                                                <div style={{ fontSize: '1.2rem' }}>{m.emoji}</div>
                                                {m.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Phone */}
                                <div className="input-group">
                                    <label>Phone Number</label>
                                    <div style={{ position: 'relative' }}>
                                        <Phone size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
                                        <input
                                            type="tel"
                                            placeholder="09xxxxxxxx"
                                            style={{ paddingLeft: '45px' }}
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <button type="submit" className="btn-primary" style={{ width: '100%', padding: '1rem' }} disabled={loading}>
                                    {loading ? <Loader2 className="animate-spin" /> : `Pay ${amount} ETB via ${METHODS.find(m => m.id === method)?.label}`}
                                </button>
                            </form>
                        </div>
                    )}

                    {/* Step 2: OTP */}
                    {step === 2 && (
                        <div className="animate-fade">
                            <h3 style={{ marginBottom: '0.5rem' }}>Enter OTP Code</h3>
                            <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                                A 6-digit code was sent to <strong style={{ color: 'white' }}>{phone}</strong>.<br />
                                Demo code: <strong style={{ color: 'var(--primary)' }}>123456</strong>
                            </p>
                            <form onSubmit={handleConfirm}>
                                <div className="input-group">
                                    <label>Verification Code</label>
                                    <input
                                        type="text"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        placeholder="______"
                                        maxLength="6"
                                        required
                                        style={{ textAlign: 'center', fontSize: '1.8rem', letterSpacing: '8px', fontWeight: '700' }}
                                    />
                                </div>
                                <button type="submit" className="btn-primary" style={{ width: '100%', padding: '1rem' }} disabled={loading}>
                                    {loading ? <Loader2 className="animate-spin" /> : 'Confirm Payment'}
                                </button>
                                <button type="button" onClick={() => setStep(1)} style={{ width: '100%', marginTop: '10px', color: 'var(--text-dim)', padding: '0.6rem', fontSize: '0.85rem' }}>
                                    ← Change amount or method
                                </button>
                            </form>
                        </div>
                    )}

                    {/* Step 3: Success */}
                    {step === 3 && (
                        <div className="animate-fade" style={{ textAlign: 'center', padding: '1rem 0' }}>
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
                                <CheckCircle size={72} color="var(--secondary)" style={{ margin: '0 auto 1.5rem' }} />
                            </motion.div>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Payment Successful!</h3>
                            <p style={{ color: 'var(--text-dim)', marginBottom: '0.5rem' }}>
                                <strong style={{ color: 'var(--primary)', fontSize: '1.3rem' }}>{amount} ETB</strong> added to your wallet.
                            </p>
                            <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem', marginBottom: '2rem' }}>
                                You're ready to buy lottery tickets!
                            </p>
                            <button onClick={handleClose} className="btn-primary" style={{ width: '100%', padding: '1rem' }}>
                                Back to Dashboard
                            </button>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default PaymentModal;
