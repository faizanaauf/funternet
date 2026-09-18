'use client';

import React, { useState } from 'react';
import { DAILY_CHAOS_CHALLENGES } from '@/lib/demo-games';
import { sounds } from '@/lib/sound';
import { showToast } from './Toast';
import { recordGameCompletion } from '@/lib/storage';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Zap, CheckCircle2, XCircle, RotateCcw } from 'lucide-react';

export default function DailyChaos() {
  const [activeChallengeIdx, setActiveChallengeIdx] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answered, setAnswered] = useState<boolean>(false);

  const challenge = DAILY_CHAOS_CHALLENGES[activeChallengeIdx];

  const handleSelect = (idx: number) => {
    if (answered) return;
    setSelectedOption(idx);
    setAnswered(true);

    const isCorrect = idx === challenge.correctIndex;
    if (isCorrect) {
      sounds.playCorrect();
      showToast(`🔥 +${challenge.xp} XP! Chaos Challenge Mastered!`, 'success');

      // Record quick XP in player stats
      recordGameCompletion({
        gameId: challenge.id,
        gameTitle: challenge.title,
        gameMode: 'trivia_rush',
        score: challenge.xp * 10,
        xpEarned: challenge.xp,
        accuracy: 100,
        longestStreak: 1,
        totalQuestions: 1,
        correctCount: 1,
        achievement: 'Chaos Breaker',
        completedAt: Date.now(),
      });
    } else {
      sounds.playWrong();
      showToast('Oof! The chaos prevailed this time!', 'error');
    }
  };

  const handleSwitchChallenge = (newIdx: number) => {
    sounds.playClick();
    setActiveChallengeIdx(newIdx);
    setSelectedOption(null);
    setAnswered(false);
  };

  return (
    <section className="w-full max-w-4xl mx-auto my-12 px-4">
      <div className="arcade-card bg-gradient-to-br from-amber-50 via-white to-pink-50 p-6 sm:p-8 border-4 border-slate-950 relative overflow-hidden">
        {/* Header Ribbon */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-2">
            <span className="sticker-badge bg-rose-500 text-white text-xs font-black shadow-[2px_2px_0px_#0f172a]">
              ⚡ DAILY INTERNET CHAOS
            </span>
            <span className="text-xs font-black text-slate-500 hidden sm:inline">
              Instant 30-Second Drill
            </span>
          </div>

          {/* Switcher Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {DAILY_CHAOS_CHALLENGES.map((ch, i) => (
              <button
                key={ch.id}
                type="button"
                onClick={() => handleSwitchChallenge(i)}
                className={`arcade-btn text-xs px-2.5 py-1 uppercase tracking-wider shrink-0 ${
                  activeChallengeIdx === i
                    ? 'bg-slate-900 text-white'
                    : 'bg-white text-slate-700 hover:bg-slate-100'
                }`}
              >
                {ch.badge.split(' ')[0]} {i + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Challenge Box */}
        <AnimatePresence mode="wait">
          <motion.div
            key={challenge.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">
                {challenge.category}
              </span>
              <span className="text-xs font-extrabold text-slate-500">
                +{challenge.xp} XP Reward
              </span>
            </div>

            <h3 className="text-lg sm:text-xl font-black text-slate-950 leading-snug mb-2">
              {challenge.title}
            </h3>

            <p className="text-xs sm:text-sm font-semibold text-slate-600 mb-5">
              {challenge.description}
            </p>

            {/* Question */}
            <div className="p-3.5 rounded-2xl bg-white border-2 border-slate-900 mb-4 font-extrabold text-sm sm:text-base text-slate-900 shadow-[2px_2px_0px_#0f172a]">
              {challenge.question}
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-5">
              {challenge.options.map((opt, idx) => {
                let btnStyle = 'border-slate-300 bg-white hover:border-slate-950 text-slate-800';

                if (answered) {
                  if (idx === challenge.correctIndex) {
                    btnStyle = 'border-emerald-600 bg-emerald-100 text-emerald-950 shadow-[3px_3px_0px_#059669] font-black';
                  } else if (idx === selectedOption) {
                    btnStyle = 'border-rose-600 bg-rose-100 text-rose-950 shadow-[3px_3px_0px_#e11d48]';
                  } else {
                    btnStyle = 'opacity-40 border-slate-200 bg-slate-50 text-slate-400';
                  }
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={answered}
                    onClick={() => handleSelect(idx)}
                    className={`arcade-btn text-left p-3 rounded-xl flex items-center justify-between text-xs sm:text-sm font-bold transition-all ${btnStyle}`}
                  >
                    <span>{opt}</span>
                    {answered && idx === challenge.correctIndex && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />
                    )}
                    {answered && idx === selectedOption && idx !== challenge.correctIndex && (
                      <XCircle className="w-4 h-4 text-rose-600 shrink-0 ml-2" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation & Retry */}
            {answered && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-2xl bg-white border-2 border-slate-900 shadow-[3px_3px_0px_#0f172a] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="text-xs sm:text-sm font-semibold text-slate-800">
                  <strong className="text-slate-950 block mb-0.5">
                    {selectedOption === challenge.correctIndex ? '🎉 Spot On!' : '💡 Reality Check:'}
                  </strong>
                  {challenge.explanation}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setSelectedOption(null);
                    setAnswered(false);
                  }}
                  className="arcade-btn bg-amber-300 hover:bg-amber-400 text-slate-950 px-3 py-1.5 text-xs uppercase tracking-wider shrink-0 flex items-center gap-1 self-start sm:self-center"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Try Again</span>
                </button>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
