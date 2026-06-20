import React, { useState, useEffect } from 'react';

const CountdownTimer = ({ compact = false }) => {
    const [timeLeft, setTimeLeft] = useState({ h: 0, m: 0, s: 0 });

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            const midnight = new Date();
            midnight.setHours(24, 0, 0, 0);
            const diff = midnight.getTime() - now.getTime();

            if (diff <= 0) {
                setTimeLeft({ h: 0, m: 0, s: 0 });
            } else {
                setTimeLeft({
                    h: Math.floor((diff / (1000 * 60 * 60)) % 24),
                    m: Math.floor((diff / (1000 * 60)) % 60),
                    s: Math.floor((diff / 1000) % 60),
                });
            }
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const pad = (v) => v.toString().padStart(2, '0');

    // Compact inline version (used in hero bar)
    if (compact) {
        return (
            <span style={{ fontWeight: '700', color: 'var(--primary)', fontVariantNumeric: 'tabular-nums' }}>
                {pad(timeLeft.h)}:{pad(timeLeft.m)}:{pad(timeLeft.s)}
            </span>
        );
    }

    // Full version (standalone usage)
    const Unit = ({ value, label }) => (
        <div style={{ textAlign: 'center' }}>
            <div style={{
                fontSize: '2.5rem',
                fontWeight: '800',
                color: 'var(--primary)',
                background: 'rgba(255,255,255,0.05)',
                padding: '0.5rem 1rem',
                borderRadius: '12px',
                minWidth: '80px',
                marginBottom: '0.5rem',
                fontVariantNumeric: 'tabular-nums',
            }}>
                {pad(value)}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '1px' }}>{label}</span>
        </div>
    );

    return (
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', alignItems: 'center' }}>
            <Unit value={timeLeft.h} label="Hours" />
            <span style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--primary)', paddingBottom: '22px' }}>:</span>
            <Unit value={timeLeft.m} label="Mins" />
            <span style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--primary)', paddingBottom: '22px' }}>:</span>
            <Unit value={timeLeft.s} label="Secs" />
        </div>
    );
};

export default CountdownTimer;
