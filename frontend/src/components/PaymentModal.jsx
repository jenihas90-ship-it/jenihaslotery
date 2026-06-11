import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, Phone, CheckCircle, Loader2 } from 'lucide-react';
import api from '../utils/api';
import { toast } from 'react-toastify';

const PaymentModal = ({ isOpen, onClose, onPaymentSuccess }) => {
    const [step, setStep] = useState(1); // 1: Amount/Method, 2: OTP, 3: Success
    const [amount, setAmount] = useState(100);
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [reference, setReference] = useState('');

    const handleInitiate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post('/payment/initiate', { amount, method: 'telebirr', phone });
            setReference(res.data.reference);
            setStep(2);
            toast.info('OTP Sent (Mock: 123456)');
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
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000,
            padding: '20px'
        }}>
            <AnimatePresence>
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="premium-card"
                    style={{ width: '100%', maxWidth: '400px', position: 'relative' }}
                >
                    <button onClick={onClose} style={{ position: 'absolute', top: '20px', right: '20px', color: 'var(--text-dim)' }}><X /></button>

                    {step === 1 && (
                        <div className="animate-fade">
                            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <CreditCard color="var(--primary)" /> Top Up Wallet
                            </h3>
                            <form onSubmit={handleInitiate}>
                                <div className="input-group">
                                    <label>Amount (ETB)</label>
                                    <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} min="20" required />
                                </div>
                                <div className="input-group">
                                    <label>Telebirr Phone Number</label>
                                    <div style={{ position: 'relative' }}>
                                        <Phone size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
                                        <input type="tel" placeholder="09..." style={{ paddingLeft: '45px' }} value={phone} onChange={(e) => setPhone(e.target.value)} required />
                                    </div>
                                </div>
                                <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={loading}>
                                    {loading ? <Loader2 className="animate-spin" /> : 'Pay with Telebirr'}
                                </button>
                            </form>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="animate-fade">
                            <h3 style={{ marginBottom: '1.5rem' }}>Enter Verification Code</h3>
                            <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                                A mock OTP was sent to {phone}. Use <strong>123456</strong> for this demo.
                            </p>
                            <form onSubmit={handleConfirm}>
                                <div className="input-group">
                                    <label>OTP Code</label>
                                    <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="XXXXXX" maxLength="6" required style={{ textAlign: 'center', fontSize: '1.5rem', letterSpacing: '5px' }} />
                                </div>
                                <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={loading}>
                                    {loading ? <Loader2 className="animate-spin" /> : 'Confirm Payment'}
                                </button>
                            </form>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="animate-fade" style={{ textAlign: 'center', padding: '20px 0' }}>
                            <div style={{ color: 'var(--secondary)', marginBottom: '1.5rem' }}><CheckCircle size={64} style={{ margin: '0 auto' }} /></div>
                            <h3>Deposit Successful!</h3>
                            <p style={{ color: 'var(--text-dim)', marginTop: '10px' }}>Your wallet has been credited with {amount} ETB.</p>
                            <button onClick={onClose} className="btn-primary" style={{ width: '100%', marginTop: '2rem' }}>Go to Dashboard</button>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default PaymentModal;
