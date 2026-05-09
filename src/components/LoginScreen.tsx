
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
      backgroundColor: '#050505',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: "'Montserrat', sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&family=Rajdhani:wght@400;500;600;700;800;900&display=swap');

        .bg-glow {
          position: absolute;
          width: 60vw;
          height: 60vw;
          background: radial-gradient(circle, rgba(255,49,49,0.15) 0%, rgba(0,0,0,0) 70%);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 0;
          pointer-events: none;
        }

        .main-container {
          display: flex;
          width: 100%;
          max-width: 1100px;
          height: 600px;
          background: rgba(15, 15, 15, 0.6);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 30px;
          overflow: hidden;
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.6), 0 0 40px rgba(255, 49, 49, 0.1);
          z-index: 1;
          position: relative;
        }

        .image-section {
          flex: 1;
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: flex-end;
          padding: 40px;
        }

        .image-section::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url('/hero-image.png');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          transition: transform 10s ease;
          z-index: 0;
        }

        .main-container:hover .image-section::before {
          transform: scale(1.05);
        }

        .image-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.4) 100%);
          z-index: 1;
        }

        .image-content {
          position: relative;
          z-index: 2;
        }

        .quote {
          color: #fff;
          font-family: 'Rajdhani', sans-serif;
          font-size: 28px;
          font-weight: 700;
          line-height: 1.2;
          text-transform: uppercase;
          text-shadow: 0 2px 10px rgba(0,0,0,0.8);
          margin: 0;
        }

        .quote span {
          color: #ff3131;
        }

        .form-section {
          flex: 0 0 450px;
          padding: 50px 40px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          background: linear-gradient(135deg, rgba(20, 20, 20, 0.9) 0%, rgba(10, 10, 10, 0.95) 100%);
          border-left: 1px solid rgba(255, 255, 255, 0.05);
          position: relative;
        }

        .header-subtitle {
          color: #ff3131;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          margin: 0 0 8px 0;
        }

        .header-title {
          font-family: 'Rajdhani', sans-serif;
          font-size: 42px;
          font-weight: 900;
          line-height: 1.1;
          color: #fff;
          margin: 0 0 30px 0;
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
          border: 1px solid rgba(255, 255, 255, 0.1);
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
          background: rgba(255, 49, 49, 0.03);
          box-shadow: 0 0 0 4px rgba(255, 49, 49, 0.1);
        }

        .input-icon {
          position: absolute;
          left: 14px;
          font-size: 18px;
          opacity: 0.5;
          transition: opacity 0.3s;
        }

        .input-field:focus + .input-icon, 
        .input-field:not(:placeholder-shown) + .input-icon {
          opacity: 1;
        }

        .start-button {
          width: 100%;
          padding: 16px;
          background: linear-gradient(90deg, #ff3131, #d62828);
          border: none;
          border-radius: 12px;
          color: #fff;
          font-family: 'Rajdhani', sans-serif;
          font-size: 18px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(255, 49, 49, 0.3);
          margin-top: 10px;
          position: relative;
          overflow: hidden;
        }

        .start-button::after {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.5s ease;
        }

        .start-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(255, 49, 49, 0.5);
        }

        .start-button:hover::after {
          left: 100%;
        }

        .start-button:active {
          transform: translateY(0);
        }

        .teacher-link {
          text-align: center;
          margin-top: 24px;
          color: #666;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.1em;
          cursor: pointer;
          transition: color 0.3s;
        }

        .teacher-link:hover {
          color: #aaa;
        }

        @media (max-width: 900px) {
          .main-container {
            flex-direction: column;
            height: auto;
            max-width: 500px;
          }
          .image-section {
            height: 250px;
            flex: none;
            padding: 30px;
          }
          .quote {
            font-size: 22px;
          }
          .form-section {
            flex: none;
            padding: 40px 30px;
            border-left: none;
            border-top: 1px solid rgba(255, 255, 255, 0.05);
          }
        }
          
        @media (max-width: 480px) {
          .image-section {
            height: 200px;
          }
          .form-section {
            padding: 30px 20px;
          }
          .header-title {
            font-size: 32px;
          }
        }
      `}</style>

      <div className="bg-glow" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="main-container"
      >
        <div className="image-section">
          <div className="image-overlay" />
          <motion.div 
            className="image-content"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            {/* Image section purely for aesthetics now, without extra messaging */}
          </motion.div>
        </div>

        <div className="form-section">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <h3 className="header-subtitle">VÌ MỘT MÔI TRƯỜNG KHÔNG KHÓI THUỐC</h3>
            <h1 className="header-title" style={{ marginBottom: '10px' }}>ĐẤU TRƯỜNG<br/><span style={{ color: '#ff3131' }}>BẢN LĨNH</span></h1>
            <p style={{
              fontFamily: "'Rajdhani', sans-serif",
              color: '#fff',
              fontSize: '18px',
              fontWeight: 600,
              letterSpacing: '0.05em',
              marginBottom: '30px',
              opacity: 0.9,
            }}>
              SẴN SÀNG QUÉT SẠCH LÀN KHÓI ẢO?
            </p>

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

              <AnimatePresence>
                {error && (
                  <motion.p 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    style={{ color: '#ff4d4d', fontSize: '13px', textAlign: 'center', marginBottom: '16px', margin: '0 0 16px 0' }}
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>

              <button type="submit" className="start-button">
                BẮT ĐẦU HÀNH TRÌNH
              </button>
            </form>

            <div 
              className="teacher-link"
              onClick={() => setShowPinDialog(true)}
            >
              CHẾ ĐỘ GIÁO VIÊN
            </div>
          </motion.div>
        </div>
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
              background: 'rgba(0,0,0,0.85)',
              backdropFilter: 'blur(15px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              zIndex: 100, padding: '1rem',
            }}
            onClick={() => { setShowPinDialog(false); setPin(''); setPinError(''); }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              style={{ 
                background: 'rgba(20, 20, 20, 0.9)', 
                border: '1px solid rgba(255,255,255,0.1)',
                padding: '40px 30px',
                borderRadius: '24px',
                boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                maxWidth: '360px',
                width: '100%'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 style={{ color: '#fff', textAlign: 'center', marginBottom: '8px', fontFamily: 'Rajdhani', fontSize: '24px' }}>TRUY CẬP HỆ THỐNG</h3>
              <p style={{ color: '#888', textAlign: 'center', fontSize: '13px', marginBottom: '24px' }}>Vui lòng nhập mã PIN để tiếp tục</p>
              
              <input
                type="password"
                className="input-field"
                style={{ textAlign: 'center', letterSpacing: '0.5em', paddingLeft: '14px', fontSize: '20px', marginBottom: '10px' }}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                onKeyDown={handlePinKeyDown}
                autoFocus
                placeholder="••••"
              />
              
              <AnimatePresence>
                {pinError && (
                  <motion.p 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    style={{ color: '#ff4d4d', fontSize: '13px', textAlign: 'center', margin: '0 0 10px 0' }}
                  >
                    {pinError}
                  </motion.p>
                )}
              </AnimatePresence>
              
              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button 
                  className="start-button" 
                  style={{ background: 'rgba(255,255,255,0.05)', color: '#aaa', margin: 0, boxShadow: 'none' }}
                  onClick={() => { setShowPinDialog(false); setPin(''); setPinError(''); }}
                >
                  HỦY
                </button>
                <button className="start-button" style={{ margin: 0 }} onClick={handlePinSubmit}>XÁC NHẬN</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
