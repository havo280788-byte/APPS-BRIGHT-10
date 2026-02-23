
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoginScreenProps {
  onStart: (name: string, className: string) => void;
  onTeacherStart: () => void;
}

export default function LoginScreen({ onStart, onTeacherStart }: LoginScreenProps) {
  const [name, setName] = useState('');
  const [className, setClassName] = useState('');
  const [error, setError] = useState('');
  const [showPinDialog, setShowPinDialog] = useState(false);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [nameFocused, setNameFocused] = useState(false);
  const [classFocused, setClassFocused] = useState(false);

  const TEACHER_PIN = '1234';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !className.trim()) {
      setError('Please fill in all fields.');
      return;
    }
    onStart(name, className);
  };

  const handlePinSubmit = () => {
    if (pin === TEACHER_PIN) {
      setPinError('');
      setShowPinDialog(false);
      setPin('');
      onTeacherStart();
    } else {
      setPinError('Incorrect PIN. Please try again.');
    }
  };

  const handlePinKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handlePinSubmit();
    if (e.key === 'Escape') {
      setShowPinDialog(false);
      setPin('');
      setPinError('');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #020817 0%, #0a0f2e 25%, #0d1b4b 50%, #0a0f2e 75%, #020817 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: "'Inter', 'Poppins', sans-serif",
    }}>
      {/* Animated background grid */}
      <div style={{
        position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none',
      }}>
        <svg width="100%" height="100%" style={{ opacity: 0.07 }}>
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#00d4ff" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
        {/* Ambient glow blobs */}
        <div style={{
          position: 'absolute', top: '-20%', left: '50%', transform: 'translateX(-50%)',
          width: '600px', height: '400px',
          background: 'radial-gradient(ellipse, rgba(0,212,255,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '-10%', left: '20%',
          width: '400px', height: '300px',
          background: 'radial-gradient(ellipse, rgba(139,92,246,0.10) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', top: '30%', right: '5%',
          width: '300px', height: '300px',
          background: 'radial-gradient(ellipse, rgba(59,130,246,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
      </div>

      {/* Floating particles */}
      {[...Array(8)].map((_, i) => (
        <div key={i} style={{
          position: 'absolute',
          width: i % 2 === 0 ? '3px' : '2px',
          height: i % 2 === 0 ? '3px' : '2px',
          borderRadius: '50%',
          background: i % 3 === 0 ? '#00d4ff' : i % 3 === 1 ? '#8b5cf6' : '#3b82f6',
          left: `${10 + i * 11}%`,
          top: `${15 + (i * 13) % 70}%`,
          opacity: 0.6,
          animation: `float-particle ${3 + i * 0.7}s ease-in-out infinite alternate`,
          pointerEvents: 'none',
        }} />
      ))}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Poppins:wght@400;600;700;800&display=swap');

        @keyframes float-particle {
          from { transform: translateY(0px) scale(1); opacity: 0.4; }
          to   { transform: translateY(-20px) scale(1.3); opacity: 0.9; }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(0,212,255,0.3), 0 0 60px rgba(0,212,255,0.1); }
          50%       { box-shadow: 0 0 30px rgba(0,212,255,0.5), 0 0 80px rgba(0,212,255,0.2); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes scan-line {
          0%   { transform: translateY(-100%); opacity: 0; }
          10%  { opacity: 0.4; }
          90%  { opacity: 0.4; }
          100% { transform: translateY(400px); opacity: 0; }
        }

        .ai-card {
          background: rgba(10, 18, 50, 0.75);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(0, 212, 255, 0.2);
          border-radius: 28px;
          box-shadow:
            0 0 0 1px rgba(255,255,255,0.05) inset,
            0 24px 80px rgba(0,0,0,0.6),
            0 0 40px rgba(0,212,255,0.08);
          position: relative;
          overflow: hidden;
        }
        .ai-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(0,212,255,0.6), rgba(139,92,246,0.6), transparent);
        }

        .scan-overlay {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(0,212,255,0.6), transparent);
          animation: scan-line 6s ease-in-out infinite;
          pointer-events: none;
        }

        .title-gradient {
          background: linear-gradient(135deg, #00d4ff 0%, #3b82f6 40%, #a78bfa 80%, #00d4ff 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 4s linear infinite;
        }

        .ai-input {
          width: 100%;
          padding: 14px 16px 14px 48px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 14px;
          color: #e2e8f0;
          font-size: 15px;
          font-family: inherit;
          transition: all 0.25s ease;
          outline: none;
          box-sizing: border-box;
        }
        .ai-input::placeholder { color: rgba(148,163,184,0.5); }
        .ai-input:focus {
          border-color: rgba(0,212,255,0.6);
          background: rgba(0,212,255,0.05);
          box-shadow: 0 0 0 3px rgba(0,212,255,0.12), 0 0 20px rgba(0,212,255,0.1);
        }
        .ai-input-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 16px;
          transition: filter 0.25s ease;
          pointer-events: none;
        }
        .ai-input-focused .ai-input-icon {
          filter: drop-shadow(0 0 6px rgba(0,212,255,0.8));
        }

        .start-btn {
          width: 100%;
          padding: 16px;
          background: linear-gradient(135deg, #00bcd4 0%, #3b82f6 40%, #8b5cf6 80%, #06b6d4 100%);
          background-size: 200% auto;
          border: none;
          border-radius: 16px;
          color: white;
          font-size: 16px;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.3s ease;
          box-shadow:
            0 4px 30px rgba(0,188,212,0.4),
            0 0 60px rgba(59,130,246,0.2),
            inset 0 1px 0 rgba(255,255,255,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          animation: pulse-glow 3s ease-in-out infinite;
        }
        .start-btn:hover {
          transform: scale(1.03) translateY(-1px);
          background-position: right center;
          box-shadow:
            0 8px 40px rgba(0,188,212,0.6),
            0 0 80px rgba(59,130,246,0.3),
            inset 0 1px 0 rgba(255,255,255,0.3);
          animation: none;
        }
        .start-btn:active { transform: scale(0.98); }

        .teacher-btn {
          width: 100%;
          padding: 12px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 14px;
          color: rgba(148,163,184,0.8);
          font-size: 13px;
          font-weight: 500;
          font-family: inherit;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          letter-spacing: 0.04em;
        }
        .teacher-btn:hover {
          background: rgba(139,92,246,0.1);
          border-color: rgba(139,92,246,0.3);
          color: rgba(167,139,250,0.9);
          box-shadow: 0 0 15px rgba(139,92,246,0.1);
        }

        .pin-card {
          background: rgba(10,18,50,0.95);
          backdrop-filter: blur(24px);
          border: 1px solid rgba(0,212,255,0.25);
          border-radius: 24px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.7), 0 0 40px rgba(0,212,255,0.1);
        }
        .pin-input {
          width: 100%;
          padding: 14px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 12px;
          color: #e2e8f0;
          font-size: 24px;
          letter-spacing: 0.5em;
          text-align: center;
          font-family: monospace;
          outline: none;
          transition: all 0.25s;
          box-sizing: border-box;
        }
        .pin-input:focus {
          border-color: rgba(0,212,255,0.5);
          box-shadow: 0 0 0 3px rgba(0,212,255,0.1);
        }
        .label-text {
          display: block;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(0,212,255,0.7);
          margin-bottom: 8px;
        }
      `}</style>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        style={{ width: '100%', maxWidth: '420px', position: 'relative', zIndex: 1 }}
      >
        {/* Logo orb */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              width: '72px', height: '72px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(0,212,255,0.2), rgba(139,92,246,0.2))',
              border: '1px solid rgba(0,212,255,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '32px',
              boxShadow: '0 0 30px rgba(0,212,255,0.3), 0 0 60px rgba(0,212,255,0.1)',
            }}
          >
            🧠
          </motion.div>
        </div>

        {/* Main card */}
        <div className="ai-card" style={{ padding: '36px 32px 28px' }}>
          <div className="scan-overlay" />

          {/* Title */}
          <h1 className="title-gradient" style={{
            fontSize: '36px', fontWeight: 900, textAlign: 'center',
            letterSpacing: '0.05em', margin: 0, lineHeight: 1.1,
          }}>
            ENGLISH 10
          </h1>
          <h2 style={{
            fontSize: '13px', fontWeight: 600, textAlign: 'center',
            color: 'rgba(148,163,184,0.7)', letterSpacing: '0.2em',
            textTransform: 'uppercase', margin: '8px 0 0',
          }}>
            New Ways to Learn
          </h2>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '8px', margin: '10px 0 0',
          }}>
            <div style={{ height: '1px', width: '32px', background: 'linear-gradient(to right, transparent, rgba(0,212,255,0.4))' }} />
            <span style={{ fontSize: '12px', color: 'rgba(0,212,255,0.8)', fontWeight: 600, letterSpacing: '0.1em' }}>
              ◈ READING CHALLENGE ◈
            </span>
            <div style={{ height: '1px', width: '32px', background: 'linear-gradient(to left, transparent, rgba(0,212,255,0.4))' }} />
          </div>
          <p style={{
            fontSize: '13px', color: 'rgba(148,163,184,0.5)', textAlign: 'center',
            margin: '12px 0 0', letterSpacing: '0.02em',
          }}>
            Prove your skills. Climb the leaderboard.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ marginTop: '28px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Full Name */}
            <div>
              <label className="label-text">Full Name</label>
              <div className={nameFocused ? 'ai-input-focused' : ''} style={{ position: 'relative' }}>
                <span className="ai-input-icon">👤</span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onFocus={() => setNameFocused(true)}
                  onBlur={() => setNameFocused(false)}
                  className="ai-input"
                  placeholder="Enter your name"
                />
              </div>
            </div>

            {/* Class */}
            <div>
              <label className="label-text">Class</label>
              <div className={classFocused ? 'ai-input-focused' : ''} style={{ position: 'relative' }}>
                <span className="ai-input-icon">🎓</span>
                <input
                  type="text"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  onFocus={() => setClassFocused(true)}
                  onBlur={() => setClassFocused(false)}
                  className="ai-input"
                  placeholder="e.g. 10A1"
                />
              </div>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ color: '#f87171', fontSize: '13px', textAlign: 'center', fontWeight: 500 }}
              >
                {error}
              </motion.p>
            )}

            {/* Start Button */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="start-btn"
              style={{ marginTop: '4px' }}
            >
              START CHALLENGE
              <span style={{
                width: '28px', height: '28px',
                background: 'rgba(255,255,255,0.15)',
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '12px',
              }}>▶</span>
            </motion.button>
          </form>

          {/* Divider */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '12px', margin: '20px 0 16px',
          }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.07)' }} />
            <span style={{ fontSize: '10px', color: 'rgba(148,163,184,0.3)', letterSpacing: '0.1em' }}>OR</span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.07)' }} />
          </div>

          {/* Teacher Button */}
          <div className="hidden md:block">
            <button
              className="teacher-btn"
              onClick={() => {
                setShowPinDialog(true);
                setPinError('');
                setPin('');
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              Teacher Access
            </button>
          </div>
        </div>

        {/* Decorative corner accents */}
        <div style={{ position: 'absolute', top: '96px', left: '-1px', width: '6px', height: '30px', background: 'linear-gradient(to bottom, transparent, rgba(0,212,255,0.5), transparent)', borderRadius: '3px' }} />
        <div style={{ position: 'absolute', top: '96px', right: '-1px', width: '6px', height: '30px', background: 'linear-gradient(to bottom, transparent, rgba(139,92,246,0.5), transparent)', borderRadius: '3px' }} />
      </motion.div>

      {/* PIN Dialog */}
      <AnimatePresence>
        {showPinDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(2,8,23,0.85)',
              backdropFilter: 'blur(12px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              zIndex: 50, padding: '1rem',
            }}
            onClick={() => { setShowPinDialog(false); setPin(''); setPinError(''); }}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 20 }}
              className="pin-card"
              onClick={(e) => e.stopPropagation()}
              style={{ padding: '32px 28px', width: '100%', maxWidth: '320px' }}
            >
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <div style={{
                  width: '52px', height: '52px', margin: '0 auto 12px',
                  borderRadius: '50%',
                  background: 'rgba(139,92,246,0.15)',
                  border: '1px solid rgba(139,92,246,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px',
                }}>🔑</div>
                <h3 style={{ color: '#e2e8f0', fontWeight: 700, fontSize: '17px', margin: 0 }}>Teacher Access</h3>
                <p style={{ color: 'rgba(148,163,184,0.5)', fontSize: '12px', marginTop: '6px' }}>Enter your PIN to continue</p>
              </div>

              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                onKeyDown={handlePinKeyDown}
                className="pin-input"
                placeholder="••••"
                maxLength={6}
                autoFocus
              />

              {pinError && (
                <p style={{ color: '#f87171', fontSize: '12px', textAlign: 'center', marginTop: '8px', fontWeight: 500 }}>
                  {pinError}
                </p>
              )}

              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button
                  onClick={() => { setShowPinDialog(false); setPin(''); setPinError(''); }}
                  style={{
                    flex: 1, padding: '11px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    color: 'rgba(148,163,184,0.7)',
                    fontWeight: 500, fontSize: '13px',
                    fontFamily: 'inherit', cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handlePinSubmit}
                  style={{
                    flex: 1, padding: '11px',
                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    border: 'none',
                    borderRadius: '12px',
                    color: 'white',
                    fontWeight: 700, fontSize: '13px',
                    fontFamily: 'inherit', cursor: 'pointer',
                    boxShadow: '0 4px 15px rgba(139,92,246,0.3)',
                    transition: 'all 0.2s',
                  }}
                >
                  Enter
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
