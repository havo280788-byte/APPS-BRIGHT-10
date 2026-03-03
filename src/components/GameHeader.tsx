
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { STAGES } from '../utils/gameData';

interface GameHeaderProps {
    currentStage: number;
    timeLeft: number;
    mode: 'student' | 'teacher';
    onShowLeaderboard?: () => void;
    onShowReview?: () => void;
}

export default function GameHeader({ currentStage, timeLeft, mode, onShowLeaderboard, onShowReview }: GameHeaderProps) {
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const isLow = timeLeft <= 60;
    const containerRef = useRef<HTMLDivElement>(null);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const toggleFullscreen = useCallback(() => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(() => { });
        } else {
            document.exitFullscreen().catch(() => { });
        }
    }, []);

    useEffect(() => {
        const onFSChange = () => setIsFullscreen(!!document.fullscreenElement);
        document.addEventListener('fullscreenchange', onFSChange);
        return () => document.removeEventListener('fullscreenchange', onFSChange);
    }, []);

    useEffect(() => {
        if (containerRef.current) {
            const activeElement = containerRef.current.children[currentStage] as HTMLElement;
            if (activeElement) {
                const containerWidth = containerRef.current.offsetWidth;
                const elementOffset = activeElement.offsetLeft;
                const elementWidth = activeElement.offsetWidth;
                containerRef.current.scrollTo({
                    left: elementOffset - containerWidth / 2 + elementWidth / 2,
                    behavior: 'smooth'
                });
            }
        }
    }, [currentStage]);

    return (
        <div style={{
            width: '100%',
            background: 'linear-gradient(180deg, #020817 0%, #0a0f2e 60%, #0d1340 100%)',
            borderBottom: '1px solid rgba(0,212,255,0.15)',
            boxShadow: '0 4px 30px rgba(0,0,0,0.5), 0 0 40px rgba(0,212,255,0.05)',
            padding: '12px 20px 10px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            position: 'relative',
            overflow: 'hidden',
        }}>
            {/* Top shimmer line */}
            <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
                background: 'linear-gradient(90deg, transparent, rgba(0,212,255,0.5), rgba(139,92,246,0.5), transparent)',
            }} />

            {/* Row 1: Title + Timer */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {/* Left: Logo + Title */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                        width: '36px', height: '36px', borderRadius: '10px',
                        background: 'linear-gradient(135deg, rgba(0,212,255,0.2), rgba(139,92,246,0.25))',
                        border: '1px solid rgba(0,212,255,0.3)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '18px',
                        boxShadow: '0 0 12px rgba(0,212,255,0.2)',
                    }}>🧠</div>
                    <div>
                        <div style={{
                            fontSize: '13px', fontWeight: 800, color: 'white',
                            letterSpacing: '0.04em', textTransform: 'uppercase', lineHeight: 1.1,
                            fontFamily: "'Inter', sans-serif",
                        }}>
                            <span style={{
                                background: 'linear-gradient(90deg, #00d4ff, #a78bfa)',
                                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                            }}>English 10</span>
                            <span style={{ color: 'rgba(255,255,255,0.5)', fontWeight: 400 }}> — New Ways to Learn</span>
                        </div>
                        <div style={{
                            fontSize: '9px', color: 'rgba(0,212,255,0.6)', letterSpacing: '0.18em',
                            textTransform: 'uppercase', fontWeight: 600,
                        }}>◈ Reading Challenge</div>
                    </div>
                </div>

                {/* Right: Fullscreen + Timer or Teacher badge */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {/* Fullscreen toggle button */}
                    <button
                        onClick={toggleFullscreen}
                        title={isFullscreen ? 'Thu nhỏ (Esc)' : 'Toàn màn hình'}
                        style={{
                            width: '32px', height: '32px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(0,212,255,0.2)',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            color: 'rgba(0,212,255,0.8)',
                            fontSize: '15px',
                            transition: 'all 0.2s',
                            flexShrink: 0,
                        }}
                        onMouseEnter={e => {
                            const el = e.currentTarget as HTMLButtonElement;
                            el.style.background = 'rgba(0,212,255,0.12)';
                            el.style.borderColor = 'rgba(0,212,255,0.5)';
                            el.style.boxShadow = '0 0 10px rgba(0,212,255,0.2)';
                        }}
                        onMouseLeave={e => {
                            const el = e.currentTarget as HTMLButtonElement;
                            el.style.background = 'rgba(255,255,255,0.05)';
                            el.style.borderColor = 'rgba(0,212,255,0.2)';
                            el.style.boxShadow = 'none';
                        }}
                    >
                        {isFullscreen ? (
                            /* Compress icon */
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M8 3v3a2 2 0 0 1-2 2H3" />
                                <path d="M21 8h-3a2 2 0 0 1-2-2V3" />
                                <path d="M3 16h3a2 2 0 0 1 2 2v3" />
                                <path d="M16 21v-3a2 2 0 0 1 2-2h3" />
                            </svg>
                        ) : (
                            /* Expand icon */
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="15 3 21 3 21 9" />
                                <polyline points="9 21 3 21 3 15" />
                                <line x1="21" y1="3" x2="14" y2="10" />
                                <line x1="3" y1="21" x2="10" y2="14" />
                            </svg>
                        )}
                    </button>
                    {mode === 'student' ? (
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: '6px',
                            background: isLow ? 'rgba(239,68,68,0.15)' : 'rgba(0,212,255,0.08)',
                            border: `1px solid ${isLow ? 'rgba(239,68,68,0.4)' : 'rgba(0,212,255,0.3)'}`,
                            borderRadius: '999px',
                            padding: '6px 14px',
                            boxShadow: isLow ? '0 0 12px rgba(239,68,68,0.2)' : '0 0 12px rgba(0,212,255,0.1)',
                        }}>
                            <span style={{ fontSize: '13px' }}>⏱</span>
                            <span style={{
                                fontFamily: 'monospace', fontSize: '16px', fontWeight: 700,
                                color: isLow ? '#f87171' : '#e2e8f0', letterSpacing: '0.08em',
                            }}>{formatTime(timeLeft)}</span>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: '6px',
                                background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)',
                                borderRadius: '999px', padding: '5px 12px',
                                boxShadow: '0 0 12px rgba(16,185,129,0.15)',
                            }}>
                                <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981' }} />
                                <span style={{ fontSize: '10px', fontWeight: 700, color: '#6ee7b7', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Teacher Mode</span>
                            </div>
                            <div className="hidden md:flex" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                {onShowReview && (
                                    <button onClick={onShowReview} style={{
                                        padding: '5px 10px', fontSize: '10px', fontWeight: 700,
                                        background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '8px', color: 'rgba(148,163,184,0.8)', cursor: 'pointer',
                                        letterSpacing: '0.08em', textTransform: 'uppercase', transition: 'all 0.2s',
                                        fontFamily: 'inherit',
                                    }}
                                        onMouseEnter={e => { (e.target as HTMLElement).style.background = 'rgba(139,92,246,0.15)'; (e.target as HTMLElement).style.color = '#a78bfa'; (e.target as HTMLElement).style.borderColor = 'rgba(139,92,246,0.3)'; }}
                                        onMouseLeave={e => { (e.target as HTMLElement).style.background = 'rgba(255,255,255,0.05)'; (e.target as HTMLElement).style.color = 'rgba(148,163,184,0.8)'; (e.target as HTMLElement).style.borderColor = 'rgba(255,255,255,0.1)'; }}
                                    >Review</button>
                                )}
                                {onShowLeaderboard && (
                                    <button onClick={onShowLeaderboard} style={{
                                        padding: '5px 10px', fontSize: '10px', fontWeight: 700,
                                        background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '8px', color: 'rgba(148,163,184,0.8)', cursor: 'pointer',
                                        letterSpacing: '0.08em', textTransform: 'uppercase', transition: 'all 0.2s',
                                        fontFamily: 'inherit',
                                    }}
                                        onMouseEnter={e => { (e.target as HTMLElement).style.background = 'rgba(0,212,255,0.1)'; (e.target as HTMLElement).style.color = '#00d4ff'; (e.target as HTMLElement).style.borderColor = 'rgba(0,212,255,0.3)'; }}
                                        onMouseLeave={e => { (e.target as HTMLElement).style.background = 'rgba(255,255,255,0.05)'; (e.target as HTMLElement).style.color = 'rgba(148,163,184,0.8)'; (e.target as HTMLElement).style.borderColor = 'rgba(255,255,255,0.1)'; }}
                                    >Leaderboard</button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Stage Progress Bar */}
            <div style={{ position: 'relative', width: '100%', maxWidth: '640px', margin: '0 auto' }}>
                {/* Track */}
                <div style={{
                    position: 'absolute', top: '50%', left: '0', width: '100%',
                    height: '2px', background: 'rgba(255,255,255,0.08)', transform: 'translateY(-50%)',
                }} />
                {/* Fill */}
                <motion.div
                    style={{
                        position: 'absolute', top: '50%', left: '0', height: '2px',
                        background: 'linear-gradient(90deg, #00d4ff, #8b5cf6)',
                        transform: 'translateY(-50%)',
                        boxShadow: '0 0 8px rgba(0,212,255,0.5)',
                    }}
                    initial={{ width: '0%' }}
                    animate={{ width: `${(currentStage / (STAGES.length - 1)) * 100}%` }}
                    transition={{ duration: 0.5 }}
                />

                {/* Stage dots */}
                <div
                    ref={containerRef}
                    style={{
                        position: 'relative', display: 'flex', justifyContent: 'space-between',
                        alignItems: 'center', overflowX: 'auto', padding: '4px 2px',
                        scrollbarWidth: 'none',
                    }}
                    className="no-scrollbar"
                >
                    {STAGES.map((stage, index) => {
                        const isActive = index === currentStage;
                        const isCompleted = index < currentStage;

                        return (
                            <motion.div
                                key={stage.id}
                                style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10, margin: '0 2px' }}
                                animate={{ scale: isActive ? 1.2 : 1 }}
                                transition={{ type: 'spring', stiffness: 300 }}
                            >
                                <div style={{
                                    width: isActive ? '34px' : '28px',
                                    height: isActive ? '34px' : '28px',
                                    borderRadius: '50%',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: isActive ? '15px' : '13px',
                                    transition: 'all 0.3s ease',
                                    border: isActive
                                        ? '2px solid rgba(0,212,255,0.8)'
                                        : isCompleted
                                            ? '2px solid rgba(0,212,255,0.3)'
                                            : '2px solid rgba(255,255,255,0.1)',
                                    background: isActive
                                        ? 'rgba(0,212,255,0.15)'
                                        : isCompleted
                                            ? 'rgba(139,92,246,0.15)'
                                            : 'rgba(255,255,255,0.04)',
                                    boxShadow: isActive
                                        ? '0 0 12px rgba(0,212,255,0.5), 0 0 24px rgba(0,212,255,0.2)'
                                        : 'none',
                                    opacity: isCompleted ? 0.85 : isActive ? 1 : 0.4,
                                }}>
                                    {isCompleted ? (
                                        <span style={{ fontSize: '11px', color: 'rgba(0,212,255,0.7)' }}>✓</span>
                                    ) : (
                                        stage.icon
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
