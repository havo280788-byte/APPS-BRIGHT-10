
import React, { useState, useEffect } from 'react';
import { Question, READING_PASSAGE, QUESTIONS } from '../utils/gameData';
import { AnswerRecord } from '../App';
import { db } from '../utils/firebase';
import { collection, getDocs } from 'firebase/firestore';

interface LeaderboardEntry {
    name: string;
    class: string;
    time: number;
    score: number;
    totalQuestions: number;
    answers: { questionId: string; question: string; selectedAnswer: string; correctAnswer: string; isCorrect: boolean }[];
    date: string;
}

interface ReviewModeProps {
    answers: AnswerRecord[];
    questions: Question[];
    onBack: () => void;
}

const cardStyle: React.CSSProperties = {
    background: 'rgba(10,18,50,0.7)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(0,212,255,0.12)',
    borderRadius: '22px',
    boxShadow: '0 8px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04) inset',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
};

export default function ReviewMode({ answers, questions, onBack }: ReviewModeProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedStudent, setSelectedStudent] = useState(0);
    const [studentEntries, setStudentEntries] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (answers.length > 0) {
            setLoading(false);
            return;
        }
        const load = async () => {
            try {
                const snap = await getDocs(collection(db, 'leaderboard'));
                const entries = snap.docs
                    .map(d => d.data() as LeaderboardEntry)
                    .filter(e => e.answers && e.answers.length > 0);
                setStudentEntries(entries);
            } catch (err) {
                console.error('Failed to load student data:', err);
            }
            setLoading(false);
        };
        load();
    }, [answers]);

    const isTeacherView = answers.length === 0;
    const activeAnswers = isTeacherView
        ? (studentEntries[selectedStudent]?.answers || [])
        : answers;
    const activeQuestions = questions.length > 0 ? questions : QUESTIONS;

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    if (loading) {
        return (
            <div className="min-h-screen game-dark-bg flex items-center justify-center">
                <div className="text-white text-center relative z-10">
                    <div className="text-4xl mb-4 animate-pulse">⏳</div>
                    <p className="text-sm text-[#94A3B8]">Loading student data...</p>
                </div>
            </div>
        );
    }

    if (activeAnswers.length === 0) {
        return (
            <div className="min-h-screen game-dark-bg flex items-center justify-center p-4">
                <div style={{ ...cardStyle, maxWidth: '400px', padding: '32px', textAlign: 'center' }} className="relative z-10">
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
                    <p style={{ color: '#e2e8f0', fontWeight: 700, marginBottom: '8px' }}>No answers to review.</p>
                    <p style={{ color: 'rgba(148,163,184,0.7)', fontSize: '14px', marginBottom: '24px' }}>No student submissions found yet.</p>
                    <button onClick={onBack} style={{
                        padding: '12px 24px',
                        background: 'rgba(0,212,255,0.1)',
                        border: '1px solid rgba(0,212,255,0.25)',
                        borderRadius: '12px',
                        color: '#00d4ff',
                        fontWeight: 700,
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                        transition: 'all 0.2s',
                    }}>
                        ← Back
                    </button>
                </div>
            </div>
        );
    }

    const answer = activeAnswers[currentIndex];
    const question = activeQuestions.find(q => q.id === answer.questionId);

    const getHighlightedPassage = () => {
        if (!question) return READING_PASSAGE;
        const passageParagraphs = READING_PASSAGE.split('\n\n');
        const questionLower = question.question.toLowerCase();
        let relevantParagraphIndex = -1;
        if (questionLower.includes('paragraph 1') || questionLower.includes('what can ai do')) {
            relevantParagraphIndex = 0;
        } else if (questionLower.includes('paragraph 2') || questionLower.includes('"them"') || questionLower.includes('robot') || questionLower.includes('rescue') || questionLower.includes('factory') || questionLower.includes('industrial')) {
            relevantParagraphIndex = 1;
        } else if (questionLower.includes('paragraph 3') || questionLower.includes('digital assistant') || questionLower.includes('navigation') || questionLower.includes('diet') || questionLower.includes('gadget') || questionLower.includes('personal habits')) {
            relevantParagraphIndex = 2;
        } else if (questionLower.includes('last paragraph') || questionLower.includes('inferred')) {
            relevantParagraphIndex = 3;
        }
        return passageParagraphs.map((p, i) => ({ text: p, highlighted: i === relevantParagraphIndex }));
    };

    const highlightedParagraphs = getHighlightedPassage();

    // Option styles matching QuizCard
    const getOptionStyle = (option: string): React.CSSProperties => {
        const base: React.CSSProperties = {
            width: '100%',
            padding: '12px 14px',
            borderRadius: '14px',
            border: '1px solid',
            textAlign: 'left',
            fontWeight: 500,
            fontSize: '14px',
            cursor: 'default',
            fontFamily: "'Inter', sans-serif",
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            transition: 'all 0.2s',
        };
        const isCorrectOption = option === answer.correctAnswer;
        const wasSelected = option === answer.selectedAnswer;
        const isWrongSelection = wasSelected && !answer.isCorrect;

        if (isCorrectOption) {
            return { ...base, background: 'rgba(16,185,129,0.12)', borderColor: 'rgba(16,185,129,0.5)', color: '#6ee7b7', boxShadow: '0 0 12px rgba(16,185,129,0.2)' };
        }
        if (isWrongSelection) {
            return { ...base, background: 'rgba(239,68,68,0.12)', borderColor: 'rgba(239,68,68,0.45)', color: '#fca5a5', boxShadow: '0 0 10px rgba(239,68,68,0.12)' };
        }
        return { ...base, background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)', color: 'rgba(203,213,225,0.8)' };
    };

    const getBadgeStyle = (option: string): React.CSSProperties => {
        const base: React.CSSProperties = {
            width: '26px', height: '26px', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '11px', fontWeight: 700, flexShrink: 0,
        };
        const isCorrectOption = option === answer.correctAnswer;
        const wasSelected = option === answer.selectedAnswer;
        const isWrongSelection = wasSelected && !answer.isCorrect;
        if (isCorrectOption) return { ...base, background: 'rgba(16,185,129,0.25)', color: '#6ee7b7' };
        if (isWrongSelection) return { ...base, background: 'rgba(239,68,68,0.25)', color: '#fca5a5' };
        return { ...base, background: 'rgba(255,255,255,0.07)', color: 'rgba(148,163,184,0.6)' };
    };

    return (
        <div className="min-h-screen game-dark-bg flex flex-col" style={{ fontFamily: "'Inter','Poppins',sans-serif" }}>
            {/* Header */}
            <div style={{
                background: 'rgba(2,8,23,0.6)',
                backdropFilter: 'blur(16px)',
                borderBottom: '1px solid rgba(0,212,255,0.08)',
                padding: '12px 20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                position: 'relative',
                zIndex: 10,
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '18px' }}>📖</span>
                        <h1 style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(0,212,255,0.8)', margin: 0 }}>Review Mode</h1>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '11px', color: 'rgba(148,163,184,0.5)' }}>
                            Question {currentIndex + 1} / {activeAnswers.length}
                        </span>
                        <button onClick={onBack} style={{
                            padding: '5px 12px', fontSize: '11px', fontWeight: 700, borderRadius: '8px',
                            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
                            color: 'rgba(148,163,184,0.7)', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s',
                        }}>
                            ✕ Close
                        </button>
                    </div>
                </div>

                {/* Student picker (teacher view only) */}
                {isTeacherView && studentEntries.length > 0 && (
                    <div style={{
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(0,212,255,0.1)',
                        borderRadius: '10px', padding: '8px 12px',
                        display: 'flex', alignItems: 'center', gap: '8px',
                    }}>
                        <span style={{ fontSize: '11px', color: 'rgba(148,163,184,0.6)', whiteSpace: 'nowrap' }}>👤 Student:</span>
                        <select
                            value={selectedStudent}
                            onChange={(e) => { setSelectedStudent(Number(e.target.value)); setCurrentIndex(0); }}
                            style={{ flex: 1, background: 'transparent', color: '#e2e8f0', fontSize: '13px', fontWeight: 700, border: 'none', outline: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
                        >
                            {studentEntries.map((entry, idx) => (
                                <option key={idx} value={idx} style={{ background: '#020817', color: 'white' }}>
                                    {entry.name} ({entry.class}) — {entry.score}/{entry.totalQuestions} — {formatTime(entry.time)}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            {/* Body */}
            <div style={{ flex: 1, padding: '16px 20px', position: 'relative', zIndex: 10 }}>
                <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '14px' }} className="md:flex-row md:gap-5 quiz-layout">
                    <style>{`
                        @media (min-width: 768px) {
                            .quiz-layout { flex-direction: row !important; }
                            .review-left { width: 40% !important; }
                            .review-right { width: 60% !important; }
                        }
                        .ai-passage-text {
                            font-size: 13px;
                            color: rgba(203,213,225,0.75);
                            line-height: 1.75;
                            margin: 0;
                        }
                        @media (min-width: 768px) {
                            .ai-passage-text { font-size: 16px; }
                        }
                    `}</style>

                    {/* LEFT: Reading Passage */}
                    <div className="review-left" style={{ width: '100%', flexShrink: 0 }}>
                        <div style={{ ...cardStyle, height: '100%' }}>
                            <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>📖</div>
                                <span style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(0,212,255,0.7)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>Reading Passage</span>
                                <span style={{ marginLeft: 'auto', fontSize: '9px', fontWeight: 700, background: 'rgba(0,212,255,0.1)', color: '#00d4ff', border: '1px solid rgba(0,212,255,0.2)', borderRadius: '999px', padding: '2px 8px', letterSpacing: '0.08em' }}>
                                    📍 Evidence
                                </span>
                            </div>
                            <div className="reading-scroll" style={{ padding: '16px', overflowY: 'auto', maxHeight: '60vh', flex: 1 }}>
                                <h3 style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '12px', background: 'linear-gradient(90deg, #00d4ff, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                    Apps of the Future
                                </h3>
                                {Array.isArray(highlightedParagraphs) ? (
                                    highlightedParagraphs.map((p, i) => (
                                        <p key={i} className="ai-passage-text" style={{
                                            marginBottom: '12px',
                                            background: p.highlighted ? 'rgba(255,255,0,0.15)' : 'transparent',
                                            padding: p.highlighted ? '6px 8px' : '0',
                                            borderRadius: p.highlighted ? '6px' : '0',
                                        }}>
                                            {p.text}
                                        </p>
                                    ))
                                ) : (
                                    <p className="ai-passage-text whitespace-pre-line">{READING_PASSAGE}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: Question + Answers */}
                    <div className="review-right" style={{ width: '100%' }}>
                        <div style={cardStyle}>
                            {/* Question header */}
                            <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{
                                        fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
                                        background: 'linear-gradient(90deg, rgba(0,212,255,0.15), rgba(99,102,241,0.15))',
                                        border: '1px solid rgba(0,212,255,0.3)',
                                        borderRadius: '6px', padding: '3px 10px', color: '#00d4ff',
                                    }}>
                                        Stage {currentIndex + 1}
                                    </span>
                                    <span style={{ fontSize: '10px', color: 'rgba(148,163,184,0.4)', letterSpacing: '0.06em' }}>
                                        {question?.type === 'mcq' ? 'Multiple Choice' : 'True / False / Doesn\'t Say'}
                                    </span>
                                </div>
                                <span style={{
                                    fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
                                    padding: '3px 10px', borderRadius: '6px', border: '1px solid',
                                    ...(answer.isCorrect
                                        ? { background: 'rgba(16,185,129,0.12)', borderColor: 'rgba(16,185,129,0.4)', color: '#6ee7b7' }
                                        : { background: 'rgba(239,68,68,0.12)', borderColor: 'rgba(239,68,68,0.4)', color: '#fca5a5' }
                                    )
                                }}>
                                    {answer.isCorrect ? '✓ Correct' : '✕ Incorrect'}
                                </span>
                            </div>

                            <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                {/* Question text */}
                                <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#e2e8f0', lineHeight: 1.55, margin: 0 }} className="md:text-lg">
                                    {answer.question}
                                </h2>

                                {/* Options */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {question?.options?.map((option, idx) => {
                                        const isCorrectOption = option === answer.correctAnswer;
                                        const wasSelected = option === answer.selectedAnswer;
                                        const isWrongSelection = wasSelected && !answer.isCorrect;
                                        return (
                                            <div key={idx} style={getOptionStyle(option)}>
                                                <span style={getBadgeStyle(option)}>
                                                    {isCorrectOption ? '✓' : isWrongSelection ? '✕' : String.fromCharCode(65 + idx)}
                                                </span>
                                                <span style={{ textAlign: 'left', lineHeight: 1.4, fontSize: 'inherit' }}>{option}</span>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Navigation */}
                                <div style={{ display: 'flex', gap: '10px', paddingTop: '4px' }}>
                                    <button
                                        onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                                        disabled={currentIndex === 0}
                                        style={{
                                            flex: 1, padding: '13px',
                                            background: currentIndex === 0 ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.06)',
                                            border: '1px solid rgba(255,255,255,0.08)',
                                            borderRadius: '14px', color: currentIndex === 0 ? 'rgba(148,163,184,0.25)' : '#e2e8f0',
                                            fontWeight: 700, fontSize: '13px', letterSpacing: '0.08em',
                                            textTransform: 'uppercase', cursor: currentIndex === 0 ? 'not-allowed' : 'pointer',
                                            fontFamily: 'inherit', transition: 'all 0.2s',
                                        }}
                                    >
                                        ← Previous
                                    </button>
                                    <button
                                        onClick={() => setCurrentIndex(prev => Math.min(activeAnswers.length - 1, prev + 1))}
                                        disabled={currentIndex === activeAnswers.length - 1}
                                        style={{
                                            flex: 1, padding: '13px', border: 'none',
                                            background: currentIndex === activeAnswers.length - 1
                                                ? 'rgba(255,255,255,0.04)'
                                                : 'linear-gradient(135deg, #00bcd4, #3b82f6, #8b5cf6)',
                                            backgroundSize: '200% auto',
                                            borderRadius: '14px', color: currentIndex === activeAnswers.length - 1 ? 'rgba(148,163,184,0.3)' : 'white',
                                            fontWeight: 800, fontSize: '13px', letterSpacing: '0.1em',
                                            textTransform: 'uppercase', cursor: currentIndex === activeAnswers.length - 1 ? 'not-allowed' : 'pointer',
                                            fontFamily: 'inherit', transition: 'all 0.3s ease',
                                            boxShadow: currentIndex === activeAnswers.length - 1 ? 'none' : '0 4px 20px rgba(0,188,212,0.3)',
                                        }}
                                    >
                                        Next →
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
