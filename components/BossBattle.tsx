'use client';

import React, { useState, useEffect } from 'react';
import { BossConfig, GameStage } from '@/types/game';
import { sounds } from '@/lib/sound';
import { motion, AnimatePresence } from 'framer-motion';
import { Swords, ShieldAlert, Sparkles, CheckCircle2, XCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface BossBattleProps {
  boss: BossConfig;
  streak: number;
  playerXP: number;
  onBossDefeated: () => void;
  onBossPhaseAnswer: (isCorrect: boolean, xpAwarded: number) => void;
}

export default function BossBattle({
  boss,
  streak,
  playerXP,
  onBossDefeated,
  onBossPhaseAnswer,
}: BossBattleProps) {
  const [currentHp, setCurrentHp] = useState<number>(boss.hp);
  const [questionIndex, setQuestionIndex] = useState<number>(0);
  const [isShaking, setIsShaking] = useState<boolean>(false);
  const [damageNumber, setDamageNumber] = useState<number | null>(null);
  const [speechBubble, setSpeechBubble] = useState<string>(boss.intro);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isDefeated, setIsDefeated] = useState<boolean>(false);

  const currentQuestion: GameStage | undefined = boss.questions[questionIndex];
  const hpPercent = Math.max(0, Math.min(100, Math.round((currentHp / boss.hp) * 100)));

  // Trigger defeat when HP hits 0
  useEffect(() => {
    if (currentHp <= 0 && !isDefeated) {
      setIsDefeated(true);
      setSpeechBubble(boss.defeatQuote);
      sounds.playVictory();

      // Confetti burst for boss defeat!
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // Safe canvas fallback
      }

      setTimeout(() => {
        onBossDefeated();
      }, 2400);
    }
  }, [currentHp, isDefeated, boss.defeatQuote, onBossDefeated]);

  const handleSelectOption = (index: number) => {
    if (isAnswered || !currentQuestion || isDefeated) return;
    setSelectedIndex(index);
    setIsAnswered(true);

    const isCorrect = index === currentQuestion.correctIndex;

    if (isCorrect) {
      sounds.playBossHit();
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);

      // Calculate boss damage based on questions remaining
      const damagePerHit = Math.ceil(boss.hp / boss.questions.length);
      setDamageNumber(damagePerHit);
      setCurrentHp((prev) => Math.max(0, prev - damagePerHit));

      const quotes = boss.attackQuotes;
      const quote = quotes[Math.floor(Math.random() * quotes.length)] || 'Arrgh! That burns!';
      setSpeechBubble(quote);

      onBossPhaseAnswer(true, currentQuestion.xp);
    } else {
      sounds.playWrong();
      setSpeechBubble('Ha! Your logic is too weak to breach my firewall!');
      onBossPhaseAnswer(false, Math.floor(currentQuestion.xp * 0.2));
    }
  };

  const handleNextPhase = () => {
    sounds.playClick();
    if (questionIndex + 1 < boss.questions.length && currentHp > 0) {
      setQuestionIndex((prev) => prev + 1);
      setSelectedIndex(null);
      setIsAnswered(false);
      setDamageNumber(null);
    } else if (currentHp > 0) {
      // Even if questions finished, conclude boss fight
      setCurrentHp(0);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto arcade-card bg-gradient-to-b from-rose-50 via-white to-amber-50 p-6 sm:p-8 border-4 border-slate-950 relative overflow-hidden">
      {/* Dramatic Boss Banner */}
      <div className="flex items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2">
          <span className="sticker-badge bg-rose-500 text-white border-slate-950 text-xs font-black animate-pulse">
            <Swords className="w-3.5 h-3.5 mr-1 inline" />
            BOSS BATTLE
          </span>
          <span className="text-xs font-black uppercase text-slate-600 hidden sm:inline">
            Phase {questionIndex + 1} of {boss.questions.length}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs font-black text-rose-600">
          <ShieldAlert className="w-4 h-4" />
          <span>RAGE MODE</span>
        </div>
      </div>

      {/* Boss Visual & Animated Avatar */}
      <div className="flex flex-col items-center mb-6">
        <div className="relative">
          {/* Avatar frame */}
          <motion.div
            animate={
              isShaking
                ? { x: [-8, 8, -6, 6, -3, 3, 0], y: [-4, 4, -2, 2, 0] }
                : { y: [0, -6, 0] }
            }
            transition={
              isShaking
                ? { duration: 0.4 }
                : { repeat: Infinity, duration: 2.5, ease: 'easeInOut' }
            }
            className={`w-28 h-28 sm:w-32 sm:h-32 rounded-3xl border-4 border-slate-950 bg-gradient-to-tr ${boss.themeColor} shadow-[6px_6px_0px_#0f172a] flex items-center justify-center text-5xl sm:text-6xl select-none`}
          >
            <span>{isDefeated ? '💥' : boss.avatarEmoji || '👾'}</span>
          </motion.div>

          {/* Floating Damage Value Popup */}
          <AnimatePresence>
            {damageNumber && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.5 }}
                animate={{ opacity: 1, y: -25, scale: 1.25 }}
                exit={{ opacity: 0, y: -40 }}
                className="absolute -top-6 -right-8 bg-rose-600 text-white font-black text-lg sm:text-xl px-3 py-1 rounded-2xl border-3 border-slate-950 shadow-[3px_3px_0px_#0f172a] z-20"
              >
                -{damageNumber} HP! 🔥
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Boss Names */}
        <h2 className="text-xl sm:text-2xl font-black text-slate-950 mt-3 text-center">
          {boss.name}
        </h2>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest text-center">
          {boss.title}
        </p>

        {/* Speech Bubble */}
        <div className="mt-3 max-w-lg bg-amber-100 border-2 border-slate-900 rounded-2xl px-4 py-2 text-xs sm:text-sm font-bold text-slate-900 shadow-[3px_3px_0px_#0f172a] relative text-center">
          &quot;{speechBubble}&quot;
        </div>

        {/* Boss Health Bar */}
        <div className="w-full max-w-md mt-5">
          <div className="flex justify-between items-center text-xs font-black uppercase mb-1">
            <span className="text-rose-700 flex items-center gap-1">
              <span>BOSS HP</span>
            </span>
            <span className="text-slate-700">{hpPercent}%</span>
          </div>
          <div className="w-full h-6 bg-slate-200 rounded-full border-3 border-slate-950 p-0.5 shadow-[3px_3px_0px_#0f172a] overflow-hidden">
            <motion.div
              className={`h-full rounded-full transition-all duration-500 ${
                hpPercent > 50
                  ? 'bg-gradient-to-r from-amber-400 to-rose-500'
                  : 'bg-gradient-to-r from-red-600 to-rose-700'
              }`}
              initial={{ width: '100%' }}
              animate={{ width: `${hpPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Boss Phase Question */}
      {currentQuestion && !isDefeated && (
        <div className="mt-6 pt-6 border-t-3 border-slate-900">
          <div className="text-xs font-black uppercase text-indigo-700 mb-1">
            {currentQuestion.title}
          </div>
          <h3 className="text-base sm:text-lg font-black text-slate-950 leading-snug mb-4">
            {currentQuestion.question}
          </h3>

          <div className="grid grid-cols-1 gap-2.5 mb-4">
            {currentQuestion.options.map((opt, idx) => {
              let btnClass = 'border-slate-300 bg-white hover:border-slate-950 hover:bg-slate-50 text-slate-800';

              if (isAnswered) {
                if (idx === currentQuestion.correctIndex) {
                  btnClass = 'border-emerald-600 bg-emerald-100 text-emerald-950 shadow-[3px_3px_0px_#059669] font-black';
                } else if (idx === selectedIndex) {
                  btnClass = 'border-rose-600 bg-rose-100 text-rose-950 shadow-[3px_3px_0px_#e11d48]';
                } else {
                  btnClass = 'opacity-40 border-slate-200 bg-slate-50 text-slate-400';
                }
              }

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={isAnswered}
                  onClick={() => handleSelectOption(idx)}
                  className={`arcade-btn text-left p-3 rounded-xl flex items-center justify-between text-xs sm:text-sm font-bold transition-all ${btnClass}`}
                >
                  <span>{opt}</span>
                  {isAnswered && idx === currentQuestion.correctIndex && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />
                  )}
                  {isAnswered && idx === selectedIndex && idx !== currentQuestion.correctIndex && (
                    <XCircle className="w-4 h-4 text-rose-600 shrink-0 ml-2" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation reveal */}
          {isAnswered && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-indigo-50 border-2 border-indigo-900 rounded-xl mb-4 text-xs font-semibold text-indigo-950"
            >
              <strong>Counter Attack Insight:</strong> {currentQuestion.explanation}
            </motion.div>
          )}

          {/* Next Phase Button */}
          {isAnswered && !isDefeated && (
            <button
              type="button"
              onClick={handleNextPhase}
              className="w-full arcade-btn bg-rose-500 hover:bg-rose-600 text-white py-3 px-6 text-sm uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <span>{questionIndex + 1 < boss.questions.length ? 'Next Boss Move' : 'Deliver Final Blow'}</span>
              <Swords className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* Defeat Banner */}
      {isDefeated && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-6 rounded-2xl bg-amber-300 border-3 border-slate-950 shadow-[4px_4px_0px_#0f172a] mt-4"
        >
          <div className="text-3xl mb-2">🏆⚡</div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-950">
            {boss.name} DEFEATED!
          </h3>
          <p className="text-xs font-bold text-slate-800 mt-1">
            Loading your final victory summary and loot...
          </p>
        </motion.div>
      )}
    </div>
  );
}
