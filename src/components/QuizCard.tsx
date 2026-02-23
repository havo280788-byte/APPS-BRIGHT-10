
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Question, READING_PASSAGE } from '../utils/gameData';

interface QuizCardProps {
    question: Question;
    stageNum: number;
    onAnswer: (selected: string, isCorrect: boolean) => void;
    mode?: 'student' | 'teacher';
    onNextQuestion?: () => void;
}

export default function QuizCard({ question, stageNum, onAnswer, mode = 'student', onNextQuestion }: QuizCardProps) {
    const [selected, setSelected] = useState<string | null>(null);
    const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
    const [highlightMode, setHighlightMode] = useState(false);
    const [highlights, setHighlights] = useState<Array<{ text: string; start: number; end: number }>>([]);
    const [revealed, setRevealed] = useState(false);
    const [hoveredOption, setHoveredOption] = useState<string | null>(null);

    useEffect(() => {
        setSelected(null);
        setFeedback(null);
        setRevealed(false);
    }, [question]);

    if (!question) return null;

    const handleCheck = () => {
        if (!selected) return;
        setFeedback(selected === question.answer ? 'correct' : 'incorrect');
    };

    const handleReveal = () => setRevealed(true);
    const handleHighlightToggle = () => setHighlightMode(prev => !prev);
    const handleClearHighlights = () => setHighlights([]);

    const handleTextSelect = useCallback(() => {
        if (!highlightMode || mode !== 'teacher') return;
        const selection = window.getSelection();
        if (!selection || selection.isCollapsed) return;
        const selectedText = selection.toString().trim();
        if (selectedText.length > 0) {
            setHighlights(prev => [...prev, { text: selectedText, start: 0, end: selectedText.length }]);
            selection.removeAllRanges();
        }
    }, [highlightMode, mode]);

    const renderPassage = () => {
        if (mode === 'teacher' && highlights.length > 0) {
            const parts: Array<{ text: string; highlighted: boolean }> = [];
            let remaining = READING_PASSAGE;
            for (const h of highlights) {
                const idx = remaining.indexOf(h.text);
                if (idx !== -1) {
                    if (idx > 0) parts.push({ text: remaining.substring(0, idx), highlighted: false });
                    parts.push({ text: h.text, highlighted: true });
                    remaining = remaining.substring(idx + h.text.length);
                }
            }
            if (remaining.length > 0) parts.push({ text: remaining, highlighted: false });
            if (parts.length > 0) {
                return (
                    <p className="ai-passage-text">
                        {parts.map((part, i) => (
                            <span key={i} className={part.highlighted ? 'teacher-highlight' : ''}>
                                {part.text}
                            </span>
                        ))}
                    </p>
                );
            }
        }
        return <p className="ai-passage-text whitespace-pre-line">{READING_PASSAGE}</p>;
    };

    // ----- Option styling -----
    const getOptionStyle = (option: string): React.CSSProperties => {
        const base: React.CSSProperties = {
            width: '100%',
            padding: '12px 14px',
            borderRadius: '14px',
            border: '1px solid',
            textAlign: 'left',
            transition: 'all 0.2s ease',
            fontWeight: 500,
            fontSize: '14px',
            cursor: 'pointer',
            fontFamily: "'Inter', sans-serif",
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
        };

        // Teacher reveal
        if (mode === 'teacher' && revealed && option === question.answer) {
            return { ...base, background: 'rgba(16,185,129,0.15)', borderColor: 'rgba(16,185,129,0.5)', color: '#6ee7b7', boxShadow: '0 0 12px rgba(16,185,129,0.15)' };
        }
        if (feedback === 'correct' && option === question.answer) {
            return { ...base, background: 'rgba(16,185,129,0.12)', borderColor: 'rgba(16,185,129,0.5)', color: '#6ee7b7', boxShadow: '0 0 12px rgba(16,185,129,0.2)' };
        }
        if (feedback === 'incorrect' && selected === option) {
            return { ...base, background: 'rgba(239,68,68,0.12)', borderColor: 'rgba(239,68,68,0.45)', color: '#fca5a5', boxShadow: '0 0 10px rgba(239,68,68,0.12)' };
        }
        if (selected === option) {
            return { ...base, background: 'rgba(99,102,241,0.15)', borderColor: 'rgba(99,102,241,0.55)', color: '#c4b5fd', boxShadow: '0 0 12px rgba(99,102,241,0.2)' };
        }
        if (hoveredOption === option && !feedback) {
            return { ...base, background: 'rgba(255,255,255,0.06)', borderColor: 'rgba(0,212,255,0.25)', color: '#e2e8f0' };
        }
        return { ...base, background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)', color: 'rgba(203,213,225,0.8)' };
    };

    const getBadgeStyle = (option: string): React.CSSProperties => {
        const base: React.CSSProperties = {
            width: '26px', height: '26px', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '11px', fontWeight: 700, flexShrink: 0, transition: 'all 0.2s',
        };
        if (mode === 'teacher' && revealed && option === question.answer) return { ...base, background: 'rgba(16,185,129,0.3)', color: '#6ee7b7' };
        if (feedback === 'correct' && option === question.answer) return { ...base, background: 'rgba(16,185,129,0.25)', color: '#6ee7b7' };
        if (feedback === 'incorrect' && selected === option) return { ...base, background: 'rgba(239,68,68,0.25)', color: '#fca5a5' };
        if (selected === option) return { ...base, background: 'rgba(99,102,241,0.35)', color: '#c4b5fd' };
        return { ...base, background: 'rgba(255,255,255,0.07)', color: 'rgba(148,163,184,0.6)' };
    };

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

    return (
        <div style={{ width: '100%', maxWidth: '1100px', margin: '0 auto', fontFamily: "'Inter','Poppins',sans-serif" }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }} className="md:flex-row md:gap-5 quiz-layout">
                <style>{`
                    @media (min-width: 768px) {
                        .quiz-layout { flex-direction: row !important; }
                        .quiz-left { width: 40% !important; }
                        .quiz-right { width: 60% !important; }
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
                    .ai-check-btn {
                        width: 100%; padding: 14px;
                        background: linear-gradient(135deg, #00bcd4, #3b82f6, #8b5cf6);
                        background-size: 200% auto;
                        border: none; border-radius: 14px; color: white;
                        font-size: 14px; font-weight: 800; letter-spacing: 0.12em;
                        text-transform: uppercase; cursor: pointer; font-family: inherit;
                        transition: all 0.3s ease;
                        box-shadow: 0 4px 20px rgba(0,188,212,0.3), inset 0 1px 0 rgba(255,255,255,0.15);
                    }
                    .ai-check-btn:hover {
                        transform: scale(1.02);
                        background-position: right center;
                        box-shadow: 0 6px 30px rgba(0,188,212,0.45);
                    }
                    .ai-check-btn:disabled {
                        background: rgba(255,255,255,0.06);
                        color: rgba(148,163,184,0.4);
                        cursor: not-allowed;
                        box-shadow: none;
                        transform: none;
                    }
                    .ai-continue-btn {
                        width: 100%; padding: 14px;
                        background: linear-gradient(135deg, rgba(0,212,255,0.15), rgba(99,102,241,0.15));
                        border: 1px solid rgba(0,212,255,0.3);
                        border-radius: 14px; color: #e2e8f0;
                        font-size: 14px; font-weight: 700; letter-spacing: 0.1em;
                        text-transform: uppercase; cursor: pointer; font-family: inherit;
                        transition: all 0.2s;
                    }
                    .ai-continue-btn:hover {
                        background: linear-gradient(135deg, rgba(0,212,255,0.25), rgba(99,102,241,0.25));
                        transform: scale(1.01);
                        box-shadow: 0 4px 20px rgba(0,212,255,0.15);
                    }
                    .reading-scroll::-webkit-scrollbar { width: 4px; }
                    .reading-scroll::-webkit-scrollbar-track { background: rgba(255,255,255,0.03); border-radius: 4px; }
                    .reading-scroll::-webkit-scrollbar-thumb { background: rgba(0,212,255,0.2); border-radius: 4px; }
                    .reading-scroll::-webkit-scrollbar-thumb:hover { background: rgba(0,212,255,0.4); }
                    .teacher-highlight {
                        background: rgba(255, 255, 0, 0.4);
                        padding: 1px 2px; border-radius: 2px;
                    }
                `}</style>

                {/* LEFT: Reading Passage */}
                <div className="quiz-left" style={{ width: '100%', flexShrink: 0 }}>
                    <div style={{ ...cardStyle, height: '100%' }}>
                        {/* Reading Header */}
                        <div style={{
                            padding: '12px 16px',
                            borderBottom: '1px solid rgba(255,255,255,0.06)',
                            display: 'flex', alignItems: 'center', gap: '8px',
                        }}>
                            <div style={{
                                width: '28px', height: '28px', borderRadius: '8px',
                                background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.2)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px',
                            }}>📖</div>
                            <span style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(0,212,255,0.7)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                                Reading Passage
                            </span>
                            {mode === 'teacher' && highlightMode && (
                                <span style={{
                                    marginLeft: 'auto', fontSize: '9px', fontWeight: 700,
                                    background: 'rgba(255, 255, 0, 0.15)', color: '#ffff00',
                                    border: '1px solid rgba(255, 255, 0, 0.3)', borderRadius: '999px', padding: '2px 8px',
                                    letterSpacing: '0.08em',
                                }}>Highlighting...</span>
                            )}
                        </div>

                        {/* Passage Content */}
                        <div
                            className="reading-scroll"
                            style={{ padding: '16px', overflowY: 'auto', maxHeight: '58vh', flex: 1, cursor: mode === 'teacher' && highlightMode ? 'text' : 'default' }}
                            onMouseUp={handleTextSelect}
                        >
                            <h3 style={{
                                fontSize: '11px', fontWeight: 800, letterSpacing: '0.12em',
                                textTransform: 'uppercase', marginBottom: '12px',
                                background: 'linear-gradient(90deg, #00d4ff, #a78bfa)',
                                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                            }}>Apps of the Future</h3>
                            {renderPassage()}
                        </div>
                    </div>
                </div>

                {/* RIGHT: Question Card */}
                <div className="quiz-right" style={{ width: '100%' }}>
                    <div style={cardStyle}>
                        {/* Question Header */}
                        <div style={{
                            padding: '12px 16px',
                            borderBottom: '1px solid rgba(255,255,255,0.06)',
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{
                                    fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em',
                                    textTransform: 'uppercase',
                                    background: 'linear-gradient(90deg, rgba(0,212,255,0.15), rgba(99,102,241,0.15))',
                                    border: '1px solid rgba(0,212,255,0.3)',
                                    borderRadius: '6px', padding: '3px 10px',
                                    color: '#00d4ff',
                                }}>
                                    Stage {stageNum}
                                </span>
                                <span style={{ fontSize: '10px', color: 'rgba(148,163,184,0.4)', letterSpacing: '0.06em' }}>
                                    {question.type === 'mcq' ? 'Multiple Choice' : 'True / False / Doesn\'t Say'}
                                </span>
                            </div>

                            {/* Teacher toolbar */}
                            {mode === 'teacher' && (
                                <div style={{ display: 'flex', gap: '6px' }}>
                                    <button onClick={handleHighlightToggle} style={{
                                        padding: '5px 10px', fontSize: '10px', fontWeight: 700, borderRadius: '6px', cursor: 'pointer',
                                        fontFamily: 'inherit', border: '1px solid', transition: 'all 0.2s',
                                        background: highlightMode ? 'rgba(255, 255, 0, 0.2)' : 'rgba(255,255,255,0.04)',
                                        borderColor: highlightMode ? '#ffff00' : 'rgba(255,255,255,0.1)',
                                        color: highlightMode ? '#ffff00' : 'rgba(148,163,184,0.6)',
                                    }}>{highlightMode ? 'Highlight ON' : 'Highlight'}</button>
                                    <button onClick={handleClearHighlights} style={{
                                        padding: '5px 10px', fontSize: '10px', fontWeight: 700, borderRadius: '6px', cursor: 'pointer',
                                        fontFamily: 'inherit', border: '1px solid rgba(255,255,255,0.1)',
                                        background: 'rgba(255,255,255,0.04)', color: 'rgba(148,163,184,0.6)', transition: 'all 0.2s',
                                    }}>Clear highlight</button>
                                </div>
                            )}
                        </div>

                        <div style={{ padding: '18px 18px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            {/* Question Text */}
                            <h2 style={{
                                fontSize: '15px', fontWeight: 700, color: '#e2e8f0',
                                lineHeight: 1.55, margin: 0,
                            }} className="md:text-lg">
                                {question.question}
                            </h2>

                            {/* Options */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {question.options?.map((option, idx) => (
                                    <motion.button
                                        key={idx}
                                        whileTap={{ scale: 0.99 }}
                                        onClick={() => {
                                            if (mode === 'teacher') {
                                                setSelected(selected === option ? null : option);
                                            } else {
                                                if (!feedback) setSelected(option);
                                            }
                                        }}
                                        onMouseEnter={() => setHoveredOption(option)}
                                        onMouseLeave={() => setHoveredOption(null)}
                                        style={getOptionStyle(option)}
                                        disabled={mode === 'student' && !!feedback}
                                    >
                                        <span style={getBadgeStyle(option)}>
                                            {mode === 'teacher' && revealed && option === question.answer
                                                ? '✓' : String.fromCharCode(65 + idx)}
                                        </span>
                                        <span style={{ textAlign: 'left', lineHeight: 1.4, fontSize: 'inherit' }}>{option}</span>
                                    </motion.button>
                                ))}
                            </div>

                            {/* Bottom Controls */}
                            <div style={{ paddingTop: '4px' }}>
                                {mode === 'student' ? (
                                    <AnimatePresence mode="wait">
                                        {feedback === 'correct' ? (
                                            <motion.div
                                                key="correct"
                                                initial={{ opacity: 0, y: 8 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                style={{ textAlign: 'center' }}
                                            >
                                                {/* Correct banner */}
                                                <div style={{
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                                                    padding: '12px 16px', borderRadius: '14px', marginBottom: '12px',
                                                    background: 'rgba(16,185,129,0.1)',
                                                    border: '1px solid rgba(16,185,129,0.3)',
                                                    boxShadow: '0 0 20px rgba(16,185,129,0.12)',
                                                }}>
                                                    <div style={{
                                                        width: '28px', height: '28px', borderRadius: '50%',
                                                        background: 'rgba(16,185,129,0.2)', border: '1px solid rgba(16,185,129,0.4)',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px',
                                                    }}>✓</div>
                                                    <div style={{ textAlign: 'left' }}>
                                                        <div style={{ fontSize: '13px', fontWeight: 800, color: '#6ee7b7', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Correct!</div>
                                                        <div style={{ fontSize: '11px', color: 'rgba(110,231,183,0.6)', marginTop: '1px' }}>Well done — keep going.</div>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => onAnswer(selected!, true)}
                                                    className="ai-continue-btn"
                                                >
                                                    Continue →
                                                </button>
                                            </motion.div>
                                        ) : feedback === 'incorrect' ? (
                                            <motion.div
                                                key="incorrect"
                                                initial={{ opacity: 0 }}
                                                animate={{ x: [0, -6, 6, -6, 6, 0], opacity: 1 }}
                                                style={{ textAlign: 'center' }}
                                            >
                                                {/* Incorrect banner */}
                                                <div style={{
                                                    display: 'flex', alignItems: 'center', gap: '10px',
                                                    padding: '12px 16px', borderRadius: '14px', marginBottom: '12px',
                                                    background: 'rgba(239,68,68,0.08)',
                                                    border: '1px solid rgba(239,68,68,0.25)',
                                                }}>
                                                    <div style={{
                                                        width: '28px', height: '28px', borderRadius: '50%',
                                                        background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', color: '#fca5a5',
                                                    }}>✕</div>
                                                    <div style={{ textAlign: 'left' }}>
                                                        <div style={{ fontSize: '13px', fontWeight: 800, color: '#fca5a5', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Incorrect</div>
                                                        <div style={{ fontSize: '11px', color: 'rgba(252,165,165,0.6)', marginTop: '1px' }}>Review the passage and continue.</div>
                                                    </div>
                                                </div>
                                                <button onClick={() => onAnswer(selected!, false)} className="ai-continue-btn">
                                                    ▶ Continue Challenge
                                                </button>
                                            </motion.div>
                                        ) : (
                                            <button
                                                onClick={handleCheck}
                                                disabled={!selected}
                                                className="ai-check-btn"
                                            >
                                                Check Answer
                                            </button>
                                        )}
                                    </AnimatePresence>
                                ) : (
                                    /* Teacher Mode */
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        {!revealed ? (
                                            <button onClick={handleReveal} style={{
                                                flex: 1, padding: '12px',
                                                background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.3)',
                                                borderRadius: '12px', color: '#fbbf24',
                                                fontWeight: 700, fontSize: '13px', letterSpacing: '0.08em',
                                                textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s',
                                            }}>👁 Reveal</button>
                                        ) : (
                                            <div style={{
                                                flex: 1, padding: '12px',
                                                background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)',
                                                borderRadius: '12px', color: '#6ee7b7',
                                                fontWeight: 700, fontSize: '12px', letterSpacing: '0.06em',
                                                textTransform: 'uppercase', textAlign: 'center',
                                            }}>✓ {question.answer.length > 36 ? question.answer.substring(0, 36) + '…' : question.answer}</div>
                                        )}
                                        <button onClick={onNextQuestion} style={{
                                            flex: 1, padding: '12px',
                                            background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.3)',
                                            borderRadius: '12px', color: '#a5b4fc',
                                            fontWeight: 700, fontSize: '13px', letterSpacing: '0.08em',
                                            textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s',
                                        }}>Next →</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
