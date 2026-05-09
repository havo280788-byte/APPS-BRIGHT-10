import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import LoginScreen from './components/LoginScreen';
import GameHeader from './components/GameHeader';
import QuizCard from './components/QuizCard';
import GameOver from './components/GameOver';
import GameWin from './components/GameWin';
import Leaderboard from './components/Leaderboard';
import ReviewMode from './components/ReviewMode';
import WaitingScreen from './components/WaitingScreen';
import { STAGES, getRandomQuestions, Question } from './utils/gameData';
import { db } from './utils/firebase';
import { collection, addDoc } from 'firebase/firestore';

export type AnswerRecord = {
  questionId: string;
  question: string;
  selectedAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
};

export default function App() {
  const [screen, setScreen] = useState<'login' | 'game' | 'gameover' | 'win' | 'leaderboard' | 'review' | 'waiting'>('login');
  const [player, setPlayer] = useState({ name: '', className: '' });
  const [currentStage, setCurrentStage] = useState(0);
  const [timeLeft, setTimeLeft] = useState(8 * 60);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [mode, setMode] = useState<'student' | 'teacher'>('student');
  const timerRef = useRef<any>(null);

  // Timer disabled
  useEffect(() => {
    // No timer logic needed
  }, []);

  // Student start
  const handleStart = (name: string, className: string) => {
    setPlayer({ name, className });
    setQuestions(getRandomQuestions());
    setCurrentStage(0);
    setTimeLeft(8 * 60);
    setScore(0);
    setAnswers([]);
    setMode('student');
    setScreen('game');
  };

  // Teacher start (no name/class needed, no timer)
  const handleTeacherStart = () => {
    setPlayer({ name: 'Teacher', className: '' });
    setQuestions(getRandomQuestions());
    setCurrentStage(0);
    setTimeLeft(8 * 60); // not used but reset
    setScore(0);
    setAnswers([]);
    setMode('teacher');
    setScreen('game');
  };

  // Student: handle answer with score/save logic
  const handleAnswer = (selected: string, isCorrect: boolean) => {
    const q = questions[currentStage];
    const record: AnswerRecord = {
      questionId: q.id,
      question: q.question,
      selectedAnswer: selected,
      correctAnswer: q.answer,
      isCorrect
    };
    setAnswers(prev => [...prev, record]);

    if (isCorrect) {
      setScore(prev => prev + 1);
      if (currentStage < STAGES.length - 1) {
        setCurrentStage(prev => prev + 1);
      } else {
        const duration = (8 * 60) - timeLeft;
        const finalScore = score + 1;
        // Only save in student mode
        if (mode === 'student') {
          saveToLeaderboard(duration, finalScore, [...answers, record]);
        }
        setScreen(mode === 'student' ? 'win' : 'login');
      }
    } else {
      // Wrong answer: advance to next question (feedback shown inline in QuizCard)
      if (currentStage < STAGES.length - 1) {
        setCurrentStage(prev => prev + 1);
      } else {
        const duration = (8 * 60) - timeLeft;
        if (mode === 'student') {
          saveToLeaderboard(duration, score, [...answers, record]);
        }
        setScreen(mode === 'student' ? 'win' : 'login');
      }
    }
  };

  // Teacher: next question (no scoring)
  const handleTeacherNext = () => {
    if (currentStage < STAGES.length - 1) {
      setCurrentStage(prev => prev + 1);
    } else {
      // All questions reviewed — go back to login
      setScreen('login');
    }
  };

  const saveToLeaderboard = async (duration: number, finalScore: number, allAnswers: AnswerRecord[]) => {
    const entry = {
      name: player.name,
      class: player.className,
      time: duration,
      score: finalScore,
      totalQuestions: STAGES.length,
      answers: allAnswers,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    try {
      await addDoc(collection(db, 'leaderboard'), entry);
    } catch (err) {
      console.error('Failed to save to Firestore:', err);
    }
  };

  const elapsedSeconds = (8 * 60) - timeLeft;

  return (
    <div className="font-sans antialiased">
      <AnimatePresence mode="wait">
        {screen === 'login' && (
          <motion.div key="login" exit={{ opacity: 0 }}>
            <LoginScreen onStart={handleStart} onTeacherStart={handleTeacherStart} />
          </motion.div>
        )}

        {screen === 'game' && (
          <motion.div key="game" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="game-dark-bg flex flex-col min-h-screen" style={{ position: 'relative' }}>
            
            {/* Left Side: Student Image + No Vape Icon */}
            <div className="hidden lg:flex" style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '45%', zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
               {/* Student Image */}
               <img src="/hero-image.png" alt="Students" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.9, maskImage: 'linear-gradient(to right, black 60%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to right, black 60%, transparent 100%)' }} />
               
               {/* No Vape Icon over the image */}
               <div style={{ position: 'absolute', left: '10%', top: '50%', transform: 'translateY(-50%)', width: '20vw', maxWidth: '300px' }}>
                 <img src="/no-vape.png" alt="No Smoking" style={{ width: '100%', height: 'auto', objectFit: 'contain', filter: 'drop-shadow(0 0 40px rgba(255,49,49,0.6))' }} />
               </div>
            </div>

            <GameHeader
              currentStage={currentStage}
              timeLeft={timeLeft}
              mode={mode}
              onShowLeaderboard={mode === 'teacher' ? () => setScreen('leaderboard') : undefined}
              onShowReview={mode === 'teacher' ? () => setScreen('review') : undefined}
            />
            <div className="p-3 md:p-5 w-full flex-1" style={{ position: 'relative', zIndex: 1 }}>
              <QuizCard
                question={questions[currentStage]}
                stageNum={currentStage + 1}
                onAnswer={handleAnswer}
                mode={mode}
                onNextQuestion={mode === 'teacher' ? handleTeacherNext : undefined}
              />
            </div>
          </motion.div>
        )}

        {screen === 'gameover' && (
          <motion.div key="gameover" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <GameOver
              score={score}
              totalQuestions={STAGES.length}
              onRestart={() => setScreen('login')}
              onLeaderboard={() => setScreen('leaderboard')}
              onReview={() => setScreen('review')}
            />
          </motion.div>
        )}

        {screen === 'win' && (
          <motion.div key="win" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <GameWin
              playerName={player.name}
              score={score}
              totalQuestions={STAGES.length}
              elapsedSeconds={elapsedSeconds}
              mode={mode}
              onRestart={() => setScreen('login')}
              onLeaderboard={() => setScreen('leaderboard')}
              onReview={() => setScreen('review')}
              onWaiting={() => setScreen('waiting')}
            />
          </motion.div>
        )}

        {screen === 'waiting' && (
          <motion.div key="waiting" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <WaitingScreen />
          </motion.div>
        )}

        {screen === 'leaderboard' && (
          <motion.div key="leaderboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Leaderboard
              onBack={() => setScreen(mode === 'teacher' ? 'game' : 'win')}
              onReview={() => setScreen('review')}
              playerName={mode === 'student' ? player.name : undefined}
              playerClass={mode === 'student' ? player.className : undefined}
            />
          </motion.div>
        )}

        {screen === 'review' && (
          <motion.div key="review" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <ReviewMode
              answers={answers}
              questions={questions}
              onBack={() => setScreen(mode === 'teacher' ? 'game' : 'win')}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
