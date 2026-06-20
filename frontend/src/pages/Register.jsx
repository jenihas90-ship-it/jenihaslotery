import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { UserPlus, Mail, Lock, Phone, User, Loader2, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const Register = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }
        if (formData.password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }
        setLoading(true);
        try {
            await register({
                fullName: formData.fullName,
                email: formData.email,
                phone: formData.phone,
                password: formData.password,
            });
            toast.success('Registration successful! Please verify your email.');
            navigate(`/verify-otp?email=${encodeURIComponent(formData.email)}`);
        } catch (err) {
            console.error('Registration Error:', err);
            const msg = err.response?.data?.message ||
                err.response?.data?.errors?.[0]?.msg ||
                err.message || 'Registration failed';
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    const passwordMatch = formData.confirmPassword && formData.password === formData.confirmPassword;
    const passwordMismatch = formData.confirmPassword && formData.password !== formData.confirmPassword;

    return (
        <div style={{ minHeight: 'calc(100vh - 80px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '10%', right: '-100px', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="premium-card"
                style={{ width: '100%', maxWidth: '520px', position: 'relative' }}
            >
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🎟</div>
                    <h2 style={{ fontSize: '1.9rem', marginBottom: '8px' }}>Join the Draw</h2>
                    <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>Create your free account in seconds</p>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Full Name */}
                    <div className="input-group">
                        <label>Full Name</label>
                        <div style={{ position: 'relative' }}>
                            <User size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
                            <input
                                name="fullName"
                                type="text"
                                placeholder="Abebe Bikila"
                                style={{ paddingLeft: '45px' }}
                                value={formData.fullName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div className="input-group">
                        <label>Email Address</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
                            <input
                                name="email"
                                type="email"
                                placeholder="abebe@example.com"
                                style={{ paddingLeft: '45px' }}
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    {/* Phone */}
                    <div className="input-group">
                        <label>Phone Number</label>
                        <div style={{ position: 'relative' }}>
                            <Phone size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
                            <input
                                name="phone"
                                type="tel"
                                placeholder="0911223344"
                                style={{ paddingLeft: '45px' }}
                                value={formData.phone}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div className="input-group">
                        <label>Password</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
                            <input
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Min. 6 characters"
                                style={{ paddingLeft: '45px', paddingRight: '45px' }}
                                value={formData.password}
                                onChange={handleChange}
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

                    {/* Confirm Password */}
                    <div className="input-group">
                        <label>Confirm Password</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
                            <input
                                name="confirmPassword"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Repeat your password"
                                style={{
                                    paddingLeft: '45px',
                                    paddingRight: '45px',
                                    borderColor: passwordMismatch ? 'var(--danger)' : passwordMatch ? 'var(--secondary)' : undefined,
                                }}
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                            {passwordMatch && (
                                <CheckCircle size={18} style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--secondary)' }} />
                            )}
                        </div>
                        {passwordMismatch && (
                            <p style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '5px' }}>Passwords don't match</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="btn-primary"
                        style={{ width: '100%', padding: '1rem', marginTop: '0.5rem' }}
                        disabled={loading}
                    >
                        {loading ? <Loader2 className="animate-spin" /> : <><UserPlus size={20} /> Create Account</>}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-dim)', fontSize: '0.9rem' }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '600' }}>Sign In</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Register;
