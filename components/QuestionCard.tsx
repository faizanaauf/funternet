'use client';

import React, { useState, useEffect } from 'react';
import { GameStage } from '@/types/game';
import { sounds } from '@/lib/sound';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  ArrowRight,
  HelpCircle,
  Flame,
} from 'lucide-react';

interface QuestionCardProps {
  stage: GameStage;
  stageNumber: number;
  totalStages: number;
  onAnswer: (isCorrect: boolean, xpAwarded: number) => void;
}

const CORRECT_CHEERS = [
  '+100 XP 🔥',
  'Critical hit! 🎯',
  'Big brain energy! 🧠',
  'You cooked! 🍳',
  'Flawless logic! ⚡',
  'Giga chad reasoning! 👑',
];

const WRONG_CHEERS = [
  'Oof. The boss blocked that! 🛡️',
  'Almost! The glitch caught you. 👾',
  'Plot twist! Check the explanation.',
  'Minor setback, huge comeback loading! 🔋',
  'V8 engine tossed an error! ⚠️',
];

export default function QuestionCard({
  stage,
  stageNumber,
  totalStages,
  onAnswer,
}: QuestionCardProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState<number | null>(
    stage.timeLimitSeconds || (stage.type === 'speed_challenge' ? 15 : null)
  );

  // Reset state when stage changes
  useEffect(() => {
    setSelectedIndex(null);
    setIsSubmitted(false);
    setFeedbackMessage('');
    setTimeLeft(stage.timeLimitSeconds || (stage.type === 'speed_challenge' ? 15 : null));
  }, [stage]);

  // Countdown timer if applicable
  useEffect(() => {
    if (timeLeft === null || isSubmitted) return;
    if (timeLeft <= 0) {
      // Time expired - auto submit wrong or first
      handleChoice(-1);
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev !== null && prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isSubmitted]);

  // Keyboard shortcut listener (1-4 or A-D)
  useEffect(() => {
    if (isSubmitted) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['1', 'a', 'A'].includes(e.key) && stage.options[0]) handleChoice(0);
      else if (['2', 'b', 'B'].includes(e.key) && stage.options[1]) handleChoice(1);
      else if (['3', 'c', 'C'].includes(e.key) && stage.options[2]) handleChoice(2);
      else if (['4', 'd', 'D'].includes(e.key) && stage.options[3]) handleChoice(3);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSubmitted, stage.options]);

  const handleChoice = (index: number) => {
    if (isSubmitted) return;
    setSelectedIndex(index);
    setIsSubmitted(true);

    const isCorrect = index === stage.correctIndex;

    if (isCorrect) {
      sounds.playCorrect();
      const randomCheer = CORRECT_CHEERS[Math.floor(Math.random() * CORRECT_CHEERS.length)];
      setFeedbackMessage(randomCheer);
    } else {
      sounds.playWrong();
      const randomWrong = WRONG_CHEERS[Math.floor(Math.random() * WRONG_CHEERS.length)];
      setFeedbackMessage(randomWrong);
    }
  };

  const handleNext = () => {
    sounds.playClick();
    const isCorrect = selectedIndex === stage.correctIndex;
    const xp = isCorrect ? stage.xp : Math.floor(stage.xp * 0.25); // give partial XP for participation
    onAnswer(isCorrect, xp);
  };

  const optionLetters = ['A', 'B', 'C', 'D'];

  return (
    <div className="w-full max-w-2xl mx-auto arcade-card bg-white p-5 sm:p-8 relative">
      {/* Top Banner: Stage Badge & Timer */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <span className="sticker-badge bg-indigo-100 text-indigo-900 border-slate-900 text-xs font-black">
            Stage {stageNumber} of {totalStages}
          </span>
          <span className="text-[11px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-slate-100 border border-slate-300 text-slate-600">
            {stage.type.replace('_', ' ')}
          </span>
        </div>

        {timeLeft !== null && (
          <div
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full border-2 border-slate-900 text-xs font-black ${
              timeLeft <= 5 ? 'bg-rose-400 text-slate-950 animate-bounce' : 'bg-amber-200 text-slate-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{timeLeft}s</span>
          </div>
        )}
      </div>

      {/* Story / Context Hook */}
      {stage.story && (
        <div className="mb-3 text-xs sm:text-sm font-semibold text-slate-600 italic border-l-4 border-amber-400 pl-3 py-0.5">
          &quot;{stage.story}&quot;
        </div>
      )}

      {/* Main Question */}
      <h2 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 leading-snug mb-6">
        {stage.question}
      </h2>

      {/* Options List */}
      <div className="flex flex-col gap-3 mb-6">
        {stage.options.map((option, idx) => {
          let btnStyle = 'border-slate-300 bg-white hover:border-slate-900 hover:bg-slate-50 text-slate-800';
          let badgeStyle = 'bg-slate-100 text-slate-700 border-slate-300';

          if (isSubmitted) {
            if (idx === stage.correctIndex) {
              btnStyle = 'border-emerald-600 bg-emerald-100 text-emerald-950 shadow-[4px_4px_0px_#059669] scale-[1.01]';
              badgeStyle = 'bg-emerald-500 text-white border-emerald-700';
            } else if (idx === selectedIndex) {
              btnStyle = 'border-rose-600 bg-rose-100 text-rose-950 shadow-[4px_4px_0px_#e11d48]';
              badgeStyle = 'bg-rose-500 text-white border-rose-700';
            } else {
              btnStyle = 'opacity-40 border-slate-200 bg-slate-50 text-slate-400';
            }
          }

          return (
            <motion.button
              key={idx}
              type="button"
              disabled={isSubmitted}
              whileTap={!isSubmitted ? { scale: 0.98 } : {}}
              onClick={() => handleChoice(idx)}
              className={`arcade-btn text-left p-3.5 sm:p-4 rounded-2xl flex items-center justify-between gap-3 text-sm sm:text-base font-bold transition-all ${btnStyle}`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center text-xs font-black shrink-0 ${badgeStyle}`}
                >
                  {optionLetters[idx] || idx + 1}
                </span>
                <span className="leading-snug">{option}</span>
              </div>

              {isSubmitted && idx === stage.correctIndex && (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              )}
              {isSubmitted && idx === selectedIndex && idx !== stage.correctIndex && (
                <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Answer Feedback & Explanation Reveal */}
      <AnimatePresence>
        {isSubmitted && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className={`p-4 rounded-2xl border-3 border-slate-900 mb-6 ${
              selectedIndex === stage.correctIndex
                ? 'bg-emerald-100 text-emerald-950'
                : 'bg-amber-100 text-amber-950'
            }`}
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-base font-black tracking-tight flex items-center gap-1.5">
                {selectedIndex === stage.correctIndex ? (
                  <Sparkles className="w-5 h-5 text-emerald-600" />
                ) : (
                  <Flame className="w-5 h-5 text-amber-600" />
                )}
                {feedbackMessage}
              </span>
              <span className="text-xs font-black uppercase px-2 py-0.5 rounded bg-white/70 border border-slate-900">
                {selectedIndex === stage.correctIndex ? `+${stage.xp} XP` : `+${Math.floor(stage.xp * 0.25)} XP`}
              </span>
            </div>
            <p className="text-xs sm:text-sm font-semibold leading-relaxed">
              {stage.explanation}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Next Button */}
      {isSubmitted && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <button
            type="button"
            onClick={handleNext}
            className="w-full arcade-btn bg-indigo-500 hover:bg-indigo-600 text-white py-3.5 px-6 text-base uppercase tracking-wider flex items-center justify-center gap-2"
          >
            <span>Continue Quest</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      )}

      {/* Helper text */}
      {!isSubmitted && (
        <div className="text-center text-[11px] font-bold text-slate-400 mt-2 flex items-center justify-center gap-1">
          <HelpCircle className="w-3 h-3" />
          <span>Press 1-4 or click your choice</span>
        </div>
      )}
    </div>
  );
}
