
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
      setError('Vui lòng nhập đầy đủ thông tin.');
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
      setPinError('Mã PIN không đúng.');
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
      backgroundColor: '#000',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
      position: 'relative',
      overflowX: 'hidden',
      overflowY: 'auto',
      fontFamily: "'Inter', sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700&display=swap');

        .grid-bg {
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(rgba(255, 0, 0, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 0, 0, 0.05) 1px, transparent 1px);
          background-size: 40px 40px;
          pointer-events: none;
          z-index: 0;
        }

        .grid-bg::after {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at center, transparent 0%, #000 80%);
        }

        .content-container {
          width: 100%;
          max-width: 500px;
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          z-index: 1;
        }

        .login-card {
          background: rgba(15, 15, 15, 0.95);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          width: 100%;
          padding: 40px 30px;
          position: relative;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
        }

        .login-card::before {
          content: '';
          position: absolute;
          top: -1px;
          left: 50%;
          transform: translateX(-50%);
          width: 80%;
          height: 2px;
          background: linear-gradient(90deg, transparent, #ff3131, transparent);
          box-shadow: 0 0 15px #ff3131;
        }

        .input-group {
          margin-bottom: 24px;
        }

        .input-label {
          display: block;
          color: #888;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          margin-bottom: 10px;
        }

        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-field {
          width: 100%;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 12px;
          padding: 14px 14px 14px 44px;
          color: #fff;
          font-size: 15px;
          transition: all 0.3s ease;
          outline: none;
          box-sizing: border-box;
        }

        .input-field:focus {
          border-color: rgba(255, 49, 49, 0.5);
          background: rgba(255, 49, 49, 0.02);
          box-shadow: 0 0 0 4px rgba(255, 49, 49, 0.1);
        }

        .input-icon {
          position: absolute;
          left: 14px;
          font-size: 18px;
          opacity: 0.6;
          filter: grayscale(1);
        }

        .start-button {
          width: 100%;
          padding: 16px;
          background: #ff3131;
          border: none;
          border-radius: 12px;
          color: #fff;
          font-family: 'Orbitron', sans-serif;
          font-size: 14px;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(255, 49, 49, 0.3);
          margin-top: 10px;
        }

        .start-button:hover {
          background: #ff4d4d;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(255, 49, 49, 0.4);
        }

        .start-button:active {
          transform: translateY(0);
        }

        .teacher-link {
          text-align: center;
          margin-top: 24px;
          color: #555;
          font-size: 12px;
          cursor: pointer;
          transition: color 0.3s;
        }

        .teacher-link:hover {
          color: #888;
        }

        @media (max-width: 480px) {
          .login-card {
            padding: 30px 20px;
          }
        }
      `}</style>

      <div className="grid-bg" />

      <div className="content-container">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ textAlign: 'center', marginBottom: '40px', width: '100%' }}
        >
          <h3 style={{
            color: '#ff3131',
            fontSize: 'clamp(12px, 2vw, 14px)',
            fontWeight: 800,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            margin: '0 0 12px 0',
          }}>
            VÌ MỘT MÔI TRƯỜNG KHÔNG KHÓI THUỐC
          </h3>
          
          <h1 style={{
            fontFamily: "'Orbitron', sans-serif",
            fontSize: 'clamp(32px, 6vw, 48px)',
            fontWeight: 900,
            lineHeight: 1.1,
            margin: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
            <span style={{ color: '#fff' }}>ĐẤU TRƯỜNG</span>
            <span style={{ color: '#ff3131', marginTop: '5px' }}>BẢN LĨNH</span>
          </h1>

          <p style={{
            fontFamily: "'Orbitron', sans-serif",
            color: '#fff',
            fontSize: 'clamp(12px, 2.5vw, 16px)',
            fontWeight: 600,
            letterSpacing: '0.05em',
            marginTop: '20px',
            opacity: 0.9,
          }}>
            SẴN SÀNG QUÉT SẠCH LÀN KHÓI ẢO?
          </p>
        </motion.div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="login-card"
        >
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label className="input-label">HỌ VÀ TÊN</label>
              <div className="input-wrapper">
                <span className="input-icon">👤</span>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Nhập họ và tên"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onFocus={() => setNameFocused(true)}
                  onBlur={() => setNameFocused(false)}
                />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">LỚP</label>
              <div className="input-wrapper">
                <span className="input-icon">🏫</span>
                <input
                  type="text"
                  className="input-field"
                  placeholder="VD: 12A1"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  onFocus={() => setClassFocused(true)}
                  onBlur={() => setClassFocused(false)}
                />
              </div>
            </div>

            {error && (
              <p style={{ color: '#ff4d4d', fontSize: '13px', textAlign: 'center', marginBottom: '16px' }}>
                {error}
              </p>
            )}

            <button type="submit" className="start-button">
              BẮT ĐẦU HÀNH TRÌNH
            </button>
          </form>

          <div 
            className="teacher-link"
            onClick={() => setShowPinDialog(true)}
          >
            GIÁO VIÊN
          </div>
        </motion.div>
      </div>

      {/* PIN Dialog */}
      <AnimatePresence>
        {showPinDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(0,0,0,0.9)',
              backdropFilter: 'blur(10px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              zIndex: 100, padding: '1rem',
            }}
            onClick={() => { setShowPinDialog(false); setPin(''); setPinError(''); }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="login-card"
              style={{ maxWidth: '320px' }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 style={{ color: '#fff', textAlign: 'center', marginBottom: '20px', fontFamily: 'Orbitron' }}>NHẬP MÃ PIN</h3>
              <input
                type="password"
                className="input-field"
                style={{ textAlign: 'center', letterSpacing: '0.5em', paddingLeft: '14px' }}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                onKeyDown={handlePinKeyDown}
                autoFocus
                placeholder="••••"
              />
              {pinError && <p style={{ color: '#ff4d4d', fontSize: '12px', textAlign: 'center', marginTop: '10px' }}>{pinError}</p>}
              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button 
                  className="start-button" 
                  style={{ background: '#333', boxShadow: 'none' }}
                  onClick={() => { setShowPinDialog(false); setPin(''); setPinError(''); }}
                >
                  HỦY
                </button>
                <button className="start-button" onClick={handlePinSubmit}>XÁC NHẬN</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
