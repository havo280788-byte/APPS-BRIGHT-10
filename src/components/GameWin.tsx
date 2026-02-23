
import React from 'react';
import { motion } from 'framer-motion';

interface GameWinProps {
    playerName: string;
    score: number;
    totalQuestions: number;
    elapsedSeconds: number;
    mode: 'student' | 'teacher';
    onRestart: () => void;
    onLeaderboard: () => void;
    onReview: () => void;
    onWaiting: () => void;
}

export default function GameWin({ playerName, score, totalQuestions, elapsedSeconds, mode, onRestart, onLeaderboard, onReview }: GameWinProps) {
    const formatTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;
    const accuracy = Math.round((score / totalQuestions) * 100);

    const getBadge = () => {
        if (accuracy >= 90) return { label: 'Digital Quest Champion', icon: '👑', from: '#f59e0b', to: '#d97706' };
        if (accuracy >= 80) return { label: 'Quest Master', icon: '🏆', from: '#00d4ff', to: '#3b82f6' };
        if (accuracy >= 60) return { label: 'Quest Explorer', icon: '🔭', from: '#a78bfa', to: '#7c3aed' };
        return { label: 'Quest Starter', icon: '🌱', from: '#34d399', to: '#059669' };
    };
    const badge = getBadge();

    // SVG ring
    const r = 36, circ = 2 * Math.PI * r;
    const offset = circ - (accuracy / 100) * circ;

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(160deg,#020817 0%,#080f2a 30%,#0c1640 55%,#0a0f2e 80%,#020817 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '1rem', position: 'relative', overflow: 'hidden',
            fontFamily: "'Inter','Poppins',sans-serif",
        }}>
            {/* Grid + glow */}
            <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
                <svg width="100%" height="100%" style={{ opacity: 0.04 }}>
                    <defs><pattern id="gw" width="60" height="60" patternUnits="userSpaceOnUse">
                        <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#00d4ff" strokeWidth="0.5" />
                    </pattern></defs>
                    <rect width="100%" height="100%" fill="url(#gw)" />
                </svg>
                <div style={{ position: 'absolute', top: '-10%', left: '50%', transform: 'translateX(-50%)', width: '700px', height: '400px', background: 'radial-gradient(ellipse,rgba(0,212,255,0.08) 0%,transparent 70%)' }} />
                <div style={{ position: 'absolute', bottom: '-5%', left: '15%', width: '400px', height: '300px', background: 'radial-gradient(ellipse,rgba(139,92,246,0.07) 0%,transparent 70%)' }} />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 32, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                style={{
                    width: '100%', maxWidth: '440px', position: 'relative', zIndex: 1,
                    background: 'rgba(10,18,50,0.80)',
                    backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
                    border: '1px solid rgba(0,212,255,0.15)',
                    borderRadius: '28px',
                    boxShadow: '0 0 0 1px rgba(255,255,255,0.04) inset, 0 24px 80px rgba(0,0,0,0.55), 0 0 40px rgba(0,212,255,0.06)',
                    overflow: 'hidden', padding: '36px 28px 28px',
                }}
            >
                {/* Top shimmer */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg,transparent,rgba(0,212,255,0.6),rgba(139,92,246,0.5),transparent)' }} />

                {/* Accuracy ring */}
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                    <motion.div
                        initial={{ scale: 0.6, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: 'spring', bounce: 0.4, delay: 0.15 }}
                        style={{ position: 'relative', width: '96px', height: '96px' }}
                    >
                        <svg width="96" height="96" style={{ transform: 'rotate(-90deg)' }}>
                            <defs>
                                <linearGradient id="rg" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#00d4ff" />
                                    <stop offset="100%" stopColor="#8b5cf6" />
                                </linearGradient>
                            </defs>
                            <circle cx="48" cy="48" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="7" />
                            <motion.circle cx="48" cy="48" r={r} fill="none" stroke="url(#rg)" strokeWidth="7"
                                strokeLinecap="round" strokeDasharray={circ}
                                initial={{ strokeDashoffset: circ }}
                                animate={{ strokeDashoffset: offset }}
                                transition={{ duration: 1.2, delay: 0.3, ease: 'easeOut' }}
                            />
                        </svg>
                        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            <span style={{ fontSize: '20px', fontWeight: 900, color: '#e2e8f0', lineHeight: 1 }}>{accuracy}%</span>
                            <span style={{ fontSize: '9px', color: 'rgba(0,212,255,0.7)', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '2px' }}>score</span>
                        </div>
                    </motion.div>
                </div>

                {/* Title */}
                <h1 style={{
                    textAlign: 'center', fontSize: '22px', fontWeight: 900, margin: 0,
                    background: 'linear-gradient(135deg,#00d4ff 0%,#a78bfa 60%,#00d4ff 100%)',
                    backgroundSize: '200% auto', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    letterSpacing: '0.04em', textTransform: 'uppercase',
                }}>Challenge Completed</h1>
                <p style={{ textAlign: 'center', fontSize: '13px', color: 'rgba(148,163,184,0.6)', marginTop: '6px', marginBottom: 0 }}>
                    Well done, <span style={{ color: 'rgba(0,212,255,0.8)', fontWeight: 600 }}>{playerName}</span>
                </p>

                {/* Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', margin: '22px 0' }}>
                    {[
                        { label: 'Correct', value: `${score} / ${totalQuestions}`, accent: '#00d4ff' },
                        { label: 'Time', value: formatTime(elapsedSeconds), accent: '#a78bfa' },
                    ].map(({ label, value, accent }) => (
                        <div key={label} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '14px 12px', textAlign: 'center' }}>
                            <div style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(148,163,184,0.5)', marginBottom: '6px' }}>{label}</div>
                            <div style={{ fontSize: '20px', fontWeight: 900, color: accent, letterSpacing: '-0.01em' }}>{value}</div>
                        </div>
                    ))}
                </div>

                {/* Badge */}
                <div style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    background: `linear-gradient(135deg,${badge.from}18,${badge.to}10)`,
                    border: `1px solid ${badge.from}35`, borderRadius: '14px', padding: '12px 16px', marginBottom: '22px',
                }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: `linear-gradient(135deg,${badge.from}30,${badge.to}20)`, border: `1px solid ${badge.from}50`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>{badge.icon}</div>
                    <div>
                        <div style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: badge.from, marginBottom: '3px' }}>Achievement Unlocked</div>
                        <div style={{ fontSize: '13px', fontWeight: 800, color: '#e2e8f0' }}>{badge.label}</div>
                    </div>
                </div>

                {/* Buttons */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {/* Primary: Leaderboard */}
                    <motion.button
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                        onClick={onLeaderboard}
                        style={{
                            width: '100%', padding: '15px', border: 'none', borderRadius: '14px', color: 'white',
                            fontSize: '13px', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase',
                            cursor: 'pointer', fontFamily: 'inherit',
                            background: 'linear-gradient(135deg,#00bcd4,#3b82f6,#8b5cf6)',
                            boxShadow: '0 4px 24px rgba(0,188,212,0.35), inset 0 1px 0 rgba(255,255,255,0.15)',
                        }}
                    >🏆 View Leaderboard</motion.button>

                    {/* Secondary: Review */}
                    <motion.button
                        whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.97 }}
                        onClick={onReview}
                        style={{
                            width: '100%', padding: '14px', borderRadius: '14px', color: 'rgba(203,213,225,0.85)',
                            fontSize: '13px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
                            cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s',
                            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(0,212,255,0.25)',
                        }}
                        onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'rgba(0,212,255,0.08)'; el.style.borderColor = 'rgba(0,212,255,0.45)'; el.style.boxShadow = '0 0 16px rgba(0,212,255,0.1)'; }}
                        onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'rgba(255,255,255,0.04)'; el.style.borderColor = 'rgba(0,212,255,0.25)'; el.style.boxShadow = 'none'; }}
                    >🔍 Review Answers</motion.button>


                </div>
            </motion.div>
        </div>
    );
}
