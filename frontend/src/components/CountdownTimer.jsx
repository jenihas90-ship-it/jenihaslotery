import React, { useState, useEffect } from 'react';

const CountdownTimer = () => {
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
                const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
                const m = Math.floor((diff / (1000 * 60)) % 60);
                const s = Math.floor((diff / 1000) % 60);
                setTimeLeft({ h, m, s });
            }
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const Unit = ({ value, label }) => (
        <div style={{ textAlign: 'center' }}>
            <div style={{
                fontSize: '2.5rem',
                fontWeight: '800',
                color: 'var(--primary)',
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '0.5rem 1rem',
                borderRadius: '12px',
                minWidth: '80px',
                marginBottom: '0.5rem'
            }}>
                {value.toString().padStart(2, '0')}
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '1px' }}>{label}</span>
        </div>
    );

    return (
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
            <Unit value={timeLeft.h} label="Hours" />
            <Unit value={timeLeft.m} label="Mins" />
            <Unit value={timeLeft.s} label="Secs" />
        </div>
    );
};

export default CountdownTimer;
