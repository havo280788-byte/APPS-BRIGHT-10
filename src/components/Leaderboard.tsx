
import React, { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { db } from '../utils/firebase';
import { collection, onSnapshot, deleteDoc, doc, getDocs } from 'firebase/firestore';

interface Entry {
    id?: string;
    name: string;
    class: string;
    time: number;
    score?: number;
    totalQuestions?: number;
    answers?: { questionId: string; isCorrect: boolean }[];
    date: string;
}

type ViewMode = 'student' | 'teacher';

const card: React.CSSProperties = {
    background: 'rgba(10,18,50,0.75)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(0,212,255,0.12)',
    borderRadius: '20px',
    boxShadow: '0 8px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04) inset',
    overflow: 'hidden',
};

export default function Leaderboard({ onBack, onReview, playerName, playerClass }: {
    onBack: () => void;
    onReview?: () => void;
    playerName?: string;
    playerClass?: string;
}) {
    const [viewMode, setViewMode] = useState<ViewMode>('student');
    const [resetConfirm, setResetConfirm] = useState(false);
    const [data, setData] = useState<Entry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsub = onSnapshot(collection(db, 'leaderboard'), (snapshot) => {
            const entries: Entry[] = snapshot.docs.map(d => ({
                id: d.id,
                ...(d.data() as Omit<Entry, 'id'>)
            }));
            entries.sort((a, b) => {
                const scoreA = a.score ?? 0;
                const scoreB = b.score ?? 0;
                if (scoreB !== scoreA) return scoreB - scoreA;
                return a.time - b.time;
            });
            setData(entries);
            setLoading(false);
        });
        return () => unsub();
    }, []);

    const handleReset = async () => {
        try {
            const snap = await getDocs(collection(db, 'leaderboard'));
            await Promise.all(snap.docs.map(d => deleteDoc(doc(db, 'leaderboard', d.id))));
        } catch (err) { console.error('Reset failed:', err); }
        setResetConfirm(false);
    };

    const top10 = data.slice(0, 10);
    const totalEntries = data.length;

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    const analytics = useMemo(() => {
        if (data.length === 0) return null;
        const done = data.filter(e => (e.score ?? 0) === (e.totalQuestions ?? 8));
        const completionRate = Math.round((done.length / data.length) * 100);
        const avgAccuracy = Math.round(data.reduce((s, e) => s + ((e.score ?? 0) / (e.totalQuestions ?? 8)) * 100, 0) / data.length);
        const hi = data.filter(e => ((e.score ?? 0) / (e.totalQuestions ?? 8)) >= 0.8);
        const fastestTime = hi.length > 0 ? Math.min(...hi.map(e => e.time)) : null;
        const qStats: { [k: string]: { correct: number; total: number } } = {};
        data.forEach(e => e.answers?.forEach(a => {
            if (!qStats[a.questionId]) qStats[a.questionId] = { correct: 0, total: 0 };
            qStats[a.questionId].total++;
            if (a.isCorrect) qStats[a.questionId].correct++;
        }));
        const questionRates = Object.entries(qStats)
            .sort(([a], [b]) => parseInt(a.replace(/\D/g, '')) - parseInt(b.replace(/\D/g, '')))
            .map(([id, s]) => ({ id, label: `Q${id.replace(/\D/g, '')}`, rate: s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0 }));
        const hardest = [...questionRates].sort((a, b) => a.rate - b.rate).slice(0, 2);
        return { completionRate, avgAccuracy, fastestTime, questionRates, hardest, totalTeams: data.length };
    }, [data]);

    const skillsBreakdown = useMemo(() => {
        if (!analytics || analytics.questionRates.length === 0) return [];
        const skills = [
            { name: 'Scanning', icon: '🔍', questions: ['q1', 'q2', 'q3', 'q4', 'q5', 'q6'], color: '#00d4ff' },
            { name: 'Identifying Main Idea', icon: '💡', questions: ['q8'], color: '#8b5cf6' },
            { name: 'Viewpoint', icon: '⚖️', questions: ['q7'], color: '#f59e0b' },
        ];
        return skills.map(skill => {
            const rel = data.flatMap(e => (e.answers || []).filter(a => skill.questions.includes(a.questionId)));
            const correct = rel.filter(a => a.isCorrect).length;
            const total = rel.length;
            return { ...skill, rate: total > 0 ? Math.round((correct / total) * 100) : 0, correct, total };
        });
    }, [data, analytics]);

    const rankColors = ['#f59e0b', '#94a3b8', '#d97706'];

    const BG = (
        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
            <svg width="100%" height="100%" style={{ opacity: 0.04 }}>
                <defs><pattern id="glb" width="60" height="60" patternUnits="userSpaceOnUse">
                    <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#00d4ff" strokeWidth="0.5" />
                </pattern></defs>
                <rect width="100%" height="100%" fill="url(#glb)" />
            </svg>
            <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '600px', height: '300px', background: 'radial-gradient(ellipse, rgba(0,212,255,0.07), transparent 70%)' }} />
        </div>
    );

    if (loading) return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg,#020817 0%,#080f2a 40%,#0c1640 65%,#020817 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter','Poppins',sans-serif" }}>
            {BG}
            <div style={{ textAlign: 'center', zIndex: 1 }}>
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>⏳</div>
                <p style={{ fontSize: '13px', color: 'rgba(148,163,184,0.6)', letterSpacing: '0.08em' }}>Loading leaderboard…</p>
            </div>
        </div>
    );

    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg,#020817 0%,#080f2a 30%,#0c1640 55%,#0a0f2e 80%,#020817 100%)', padding: '20px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: "'Inter','Poppins',sans-serif", position: 'relative' }}>
            {BG}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ width: '100%', maxWidth: '860px', position: 'relative', zIndex: 1 }}>

                {/* ── Header ── */}
                <div style={{ ...card, marginBottom: '14px' }}>
                    <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'linear-gradient(135deg,rgba(0,212,255,0.2),rgba(139,92,246,0.2))', border: '1px solid rgba(0,212,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', boxShadow: '0 0 16px rgba(0,212,255,0.2)' }}>🏆</div>
                            <div>
                                <h1 style={{ fontSize: '16px', fontWeight: 900, color: 'white', letterSpacing: '0.06em', textTransform: 'uppercase', margin: 0 }}>Leaderboard</h1>
                                <p style={{ fontSize: '10px', color: 'rgba(0,212,255,0.6)', letterSpacing: '0.12em', margin: 0 }}>◈ APPS READING CHALLENGE</p>
                            </div>
                        </div>

                        {/* Teacher toggle — hidden in student context */}
                        {!playerName && (
                            <div style={{ display: 'flex', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '4px', gap: '4px' }}>
                                {(['student', 'teacher'] as ViewMode[]).map(v => (
                                    <button key={v} onClick={() => setViewMode(v)} style={{ padding: '6px 14px', borderRadius: '7px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', transition: 'all 0.2s', border: 'none', background: viewMode === v ? 'linear-gradient(135deg,#00bcd4,#6366f1)' : 'transparent', color: viewMode === v ? 'white' : 'rgba(148,163,184,0.6)', boxShadow: viewMode === v ? '0 0 12px rgba(0,188,212,0.3)' : 'none' }}>
                                        {v === 'student' ? '🎓 Student' : '👩‍🏫 Teacher'}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Back button always visible */}
                        <button onClick={onBack} style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: 'rgba(203,213,225,0.7)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' }}
                            onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'rgba(0,212,255,0.08)'; el.style.borderColor = 'rgba(0,212,255,0.3)'; el.style.color = '#00d4ff'; }}
                            onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'rgba(255,255,255,0.04)'; el.style.borderColor = 'rgba(255,255,255,0.1)'; el.style.color = 'rgba(203,213,225,0.7)'; }}
                        >← Back</button>
                    </div>
                </div>

                {/* ── STUDENT / default view ── */}
                {(viewMode === 'student' || !!playerName) && (
                    <div style={card}>
                        {/* Column headers */}
                        <div style={{ padding: '10px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '9px', fontWeight: 700, color: 'rgba(148,163,184,0.4)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>Rank & Student</span>
                            <div style={{ display: 'flex', gap: '28px' }}>
                                {['Score', 'Time'].map(h => <span key={h} style={{ fontSize: '9px', fontWeight: 700, color: 'rgba(148,163,184,0.4)', letterSpacing: '0.14em', textTransform: 'uppercase', width: '52px', textAlign: 'center' }}>{h}</span>)}
                            </div>
                        </div>

                        <div>
                            {top10.length > 0 ? top10.map((entry, index) => {
                                const isTop3 = index < 3;
                                const rankColor = isTop3 ? rankColors[index] : 'rgba(255,255,255,0.08)';
                                const isMyRow = !!(playerName && entry.name === playerName && entry.class === playerClass);
                                return (
                                    <motion.div
                                        key={entry.id || index}
                                        initial={{ opacity: 0, x: -12 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.04 }}
                                        style={{
                                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                            padding: '12px 20px',
                                            borderBottom: index < top10.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                                            background: isMyRow ? 'rgba(0,212,255,0.06)' : isTop3 ? `rgba(${index === 0 ? '245,158,11' : index === 1 ? '148,163,184' : '217,119,6'},0.04)` : 'transparent',
                                            boxShadow: isMyRow ? 'inset 0 0 0 1px rgba(0,212,255,0.22)' : 'none',
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
                                            {/* Rank badge */}
                                            <div style={{ width: '30px', height: '30px', borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 900, background: isTop3 ? `${rankColor}25` : 'rgba(255,255,255,0.04)', border: `1px solid ${isTop3 ? rankColor + '50' : 'rgba(255,255,255,0.08)'}`, color: isTop3 ? rankColor : 'rgba(148,163,184,0.5)' }}>
                                                {index + 1}
                                            </div>
                                            {/* Name */}
                                            <div style={{ minWidth: 0 }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                                                    <span style={{ fontSize: '13px', fontWeight: 700, color: isMyRow ? '#00d4ff' : '#e2e8f0' }}>{entry.name}</span>
                                                    {isMyRow && <span style={{ fontSize: '8px', fontWeight: 800, letterSpacing: '0.1em', background: 'rgba(0,212,255,0.12)', border: '1px solid rgba(0,212,255,0.3)', borderRadius: '999px', padding: '1px 6px', color: '#00d4ff', textTransform: 'uppercase' }}>YOU</span>}
                                                </div>
                                                <div style={{ fontSize: '10px', color: 'rgba(148,163,184,0.5)', marginTop: '1px' }}>{entry.class}</div>
                                            </div>
                                            {/* My Attempt button */}
                                            {isMyRow && onReview && (
                                                <button onClick={onReview} style={{ marginLeft: 'auto', padding: '5px 10px', flexShrink: 0, background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: '8px', color: '#a78bfa', fontSize: '10px', fontWeight: 700, letterSpacing: '0.06em', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap', transition: 'all 0.2s' }}
                                                    onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'rgba(139,92,246,0.2)'; el.style.boxShadow = '0 0 10px rgba(139,92,246,0.2)'; }}
                                                    onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'rgba(139,92,246,0.1)'; el.style.boxShadow = 'none'; }}
                                                >My Attempt →</button>
                                            )}
                                        </div>

                                        <div style={{ display: 'flex', alignItems: 'center', gap: '28px', flexShrink: 0, marginLeft: '10px' }}>
                                            <div style={{ width: '52px', textAlign: 'center', fontSize: '13px', fontWeight: 800, color: '#00d4ff' }}>{entry.score ?? '—'}/{entry.totalQuestions ?? 8}</div>
                                            <div style={{ width: '52px', textAlign: 'center', fontFamily: 'monospace', fontSize: '13px', fontWeight: 700, color: 'rgba(203,213,225,0.7)' }}>{formatTime(entry.time)}</div>
                                        </div>
                                    </motion.div>
                                );
                            }) : (
                                <div style={{ padding: '60px 20px', textAlign: 'center', color: 'rgba(148,163,184,0.4)', fontSize: '13px', fontStyle: 'italic' }}>
                                    No entries yet. Be the first to complete the challenge!
                                </div>
                            )}
                        </div>

                        <div style={{ padding: '12px 20px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: '11px', color: 'rgba(148,163,184,0.4)' }}>{totalEntries} total entries</span>
                        </div>
                    </div>
                )}

                {/* ── TEACHER VIEW ── */}
                {!playerName && viewMode === 'teacher' && analytics && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        {/* Class Snapshot */}
                        <div style={card}>
                            <div style={{ padding: '12px 18px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                                <h2 style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(0,212,255,0.65)', letterSpacing: '0.14em', textTransform: 'uppercase', margin: 0 }}>📊 Class Snapshot</h2>
                            </div>
                            <div style={{ padding: '16px', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '10px' }}>
                                {[
                                    { label: 'Teams Joined', value: analytics.totalTeams, color: '#e2e8f0' },
                                    { label: 'Completion', value: `${analytics.completionRate}%`, color: '#6ee7b7' },
                                    { label: 'Avg Accuracy', value: `${analytics.avgAccuracy}%`, color: '#00d4ff' },
                                    { label: 'Fastest ≥80%', value: analytics.fastestTime !== null ? formatTime(analytics.fastestTime) : '—', color: '#fbbf24' },
                                ].map(({ label, value, color }) => (
                                    <div key={label} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '14px 10px', textAlign: 'center' }}>
                                        <div style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(148,163,184,0.45)', marginBottom: '6px' }}>{label}</div>
                                        <div style={{ fontSize: '20px', fontWeight: 900, color }}>{value}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Question Insights */}
                        <div style={card}>
                            <div style={{ padding: '12px 18px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <h2 style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(0,212,255,0.65)', letterSpacing: '0.14em', textTransform: 'uppercase', margin: 0 }}>📈 Question Insights</h2>
                                {analytics.hardest.length > 0 && <span style={{ fontSize: '9px', fontWeight: 700, background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '999px', padding: '2px 8px', color: '#f87171' }}>Hardest: {analytics.hardest.map(h => h.label).join(', ')}</span>}
                            </div>
                            <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {analytics.questionRates.map(q => (
                                    <div key={q.id} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <span style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(148,163,184,0.5)', width: '24px', flexShrink: 0 }}>{q.label}</span>
                                        <div style={{ flex: 1, height: '22px', background: 'rgba(255,255,255,0.05)', borderRadius: '999px', overflow: 'hidden' }}>
                                            <motion.div initial={{ width: 0 }} animate={{ width: `${q.rate}%` }} transition={{ duration: 0.8, delay: 0.1 }} style={{ height: '100%', borderRadius: '999px', background: q.rate >= 80 ? 'linear-gradient(90deg,#34d399,#10b981)' : q.rate >= 50 ? 'linear-gradient(90deg,#fbbf24,#f59e0b)' : 'linear-gradient(90deg,#f87171,#dc2626)', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: '8px' }}>
                                                {q.rate > 15 && <span style={{ fontSize: '9px', fontWeight: 700, color: 'white' }}>{q.rate}%</span>}
                                            </motion.div>
                                        </div>
                                        {q.rate <= 15 && <span style={{ fontSize: '9px', fontWeight: 700, color: 'rgba(148,163,184,0.45)', flexShrink: 0 }}>{q.rate}%</span>}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Skills Breakdown */}
                        <div style={card}>
                            <div style={{ padding: '12px 18px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                                <h2 style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(0,212,255,0.65)', letterSpacing: '0.14em', textTransform: 'uppercase', margin: 0 }}>🧠 Skills Breakdown (Apps Reading)</h2>
                            </div>
                            <div style={{ padding: '16px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '10px' }}>
                                {skillsBreakdown.map(skill => (
                                    <div key={skill.name} style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${skill.color}22`, borderRadius: '14px', padding: '14px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <span style={{ fontSize: '16px' }}>{skill.icon}</span>
                                                <span style={{ fontSize: '11px', fontWeight: 700, color: '#e2e8f0' }}>{skill.name}</span>
                                            </div>
                                            <span style={{ fontSize: '15px', fontWeight: 900, color: skill.color }}>{skill.rate}%</span>
                                        </div>
                                        <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '999px', overflow: 'hidden' }}>
                                            <motion.div initial={{ width: 0 }} animate={{ width: `${skill.rate}%` }} transition={{ duration: 0.8 }} style={{ height: '100%', borderRadius: '999px', background: skill.color, boxShadow: `0 0 8px ${skill.color}70` }} />
                                        </div>
                                        <div style={{ fontSize: '10px', color: 'rgba(148,163,184,0.4)', marginTop: '6px' }}>{skill.correct}/{skill.total} correct</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Teacher footer */}
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', paddingBottom: '8px' }}>
                            {!resetConfirm ? (
                                <button onClick={() => setResetConfirm(true)} style={{ padding: '10px 22px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '12px', color: '#f87171', fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit' }}>🗑 Reset Data</button>
                            ) : (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '12px', padding: '8px 14px' }}>
                                    <span style={{ fontSize: '11px', color: '#f87171', fontWeight: 700 }}>Are you sure?</span>
                                    <button onClick={handleReset} style={{ padding: '5px 12px', background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.4)', borderRadius: '8px', color: '#f87171', fontSize: '11px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>Yes</button>
                                    <button onClick={() => setResetConfirm(false)} style={{ padding: '5px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'rgba(148,163,184,0.7)', fontSize: '11px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {!playerName && viewMode === 'teacher' && !analytics && (
                    <div style={{ ...card, padding: '48px 24px', textAlign: 'center' }}>
                        <p style={{ color: 'rgba(148,163,184,0.4)', fontSize: '13px', fontStyle: 'italic' }}>No data available yet for analytics.</p>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
