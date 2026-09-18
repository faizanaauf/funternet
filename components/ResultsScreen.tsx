'use client';

import React, { useEffect } from 'react';
import { GameData, GameResult } from '@/types/game';
import { sounds } from '@/lib/sound';
import { showToast } from './Toast';
import { motion } from 'framer-motion';
import {
  Trophy,
  Star,
  Target,
  Flame,
  Share2,
  RotateCcw,
  PlusCircle,
  Award,
  Lightbulb,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ResultsScreenProps {
  game: GameData;
  result: GameResult;
  onPlayAgain: () => void;
  onMakeAnother: () => void;
}

export default function ResultsScreen({
  game,
  result,
  onPlayAgain,
  onMakeAnother,
}: ResultsScreenProps) {
  useEffect(() => {
    sounds.playVictory();

    // Multistage celebratory confetti
    try {
      const end = Date.now() + 2.5 * 1000;
      const colors = ['#f59e0b', '#ec4899', '#6366f1', '#10b981'];

      (function frame() {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: colors,
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: colors,
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      })();
    } catch {
      // Safe fallback
    }
  }, []);

  const handleShare = async () => {
    sounds.playClick();
    const shareText = `I conquered "${game.title}" and earned ${result.xpEarned} XP with a ${result.longestStreak}x streak on Funternet Arcade! 🎮 Level: ${result.achievement}`;
    const shareUrl = typeof window !== 'undefined' ? window.location.href : 'https://funternet-arcade.vercel.app';

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Funternet Arcade Victory',
          text: shareText,
          url: shareUrl,
        });
        showToast('🎉 Shared successfully!', 'success');
        return;
      } catch (err) {
        // Fallback to clipboard if user dismissed native share dialog
      }
    }

    try {
      await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      showToast('📋 Copied score to clipboard!', 'success');
    } catch (e) {
      showToast('Unable to access clipboard', 'error');
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto arcade-card bg-white p-6 sm:p-10 text-center relative overflow-hidden">
      {/* Decorative Arcade Victory Ribbons */}
      <div className="flex justify-center mb-3">
        <span className="sticker-badge bg-amber-300 text-slate-950 text-xs sm:text-sm font-black rotate-[-2deg]">
          👑 QUEST COMPLETE
        </span>
      </div>

      <h1 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight leading-tight mb-2">
        YOU BEAT THE INTERNET 🎉
      </h1>

      <p className="text-sm font-bold text-slate-500 mb-6">
        {game.title} &bull; {game.subtitle}
      </p>

      {/* Dynamic Achievement Badge */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-8 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-100 via-orange-100 to-amber-200 border-3 border-slate-950 shadow-[4px_4px_0px_#0f172a] flex items-center gap-4 text-left"
      >
        <div className="w-14 h-14 rounded-2xl bg-amber-400 border-2 border-slate-950 shadow-[2px_2px_0px_#0f172a] flex items-center justify-center text-slate-950 shrink-0">
          <Award className="w-8 h-8" />
        </div>
        <div>
          <div className="text-[10px] font-black uppercase tracking-wider text-amber-900">
            UNLOCKED ACHIEVEMENT
          </div>
          <div className="text-base sm:text-lg font-black text-slate-950">
            {result.achievement || game.achievementTitle || 'Certified Big Brain'}
          </div>
          <div className="text-xs font-semibold text-slate-700 leading-snug">
            {game.achievementDescription || 'Conquered digital chaos with undeniable arcade precision.'}
          </div>
        </div>
      </motion.div>

      {/* Progression Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {/* Total XP */}
        <div className="p-3 sm:p-4 rounded-2xl border-2 border-slate-900 bg-amber-50 shadow-[2px_2px_0px_#0f172a] flex flex-col items-center">
          <Star className="w-5 h-5 text-amber-500 fill-amber-400 mb-1" />
          <span className="text-xl sm:text-2xl font-black text-slate-950">
            +{result.xpEarned}
          </span>
          <span className="text-[10px] font-extrabold uppercase text-slate-500">XP Earned</span>
        </div>

        {/* Accuracy */}
        <div className="p-3 sm:p-4 rounded-2xl border-2 border-slate-900 bg-emerald-50 shadow-[2px_2px_0px_#0f172a] flex flex-col items-center">
          <Target className="w-5 h-5 text-emerald-600 mb-1" />
          <span className="text-xl sm:text-2xl font-black text-slate-950">
            {result.accuracy}%
          </span>
          <span className="text-[10px] font-extrabold uppercase text-slate-500">Accuracy</span>
        </div>

        {/* Longest Streak */}
        <div className="p-3 sm:p-4 rounded-2xl border-2 border-slate-900 bg-rose-50 shadow-[2px_2px_0px_#0f172a] flex flex-col items-center">
          <Flame className="w-5 h-5 text-rose-500 fill-rose-400 mb-1" />
          <span className="text-xl sm:text-2xl font-black text-slate-950">
            {result.longestStreak}x
          </span>
          <span className="text-[10px] font-extrabold uppercase text-slate-500">Max Streak</span>
        </div>

        {/* Questions Cleared */}
        <div className="p-3 sm:p-4 rounded-2xl border-2 border-slate-900 bg-indigo-50 shadow-[2px_2px_0px_#0f172a] flex flex-col items-center">
          <Trophy className="w-5 h-5 text-indigo-600 mb-1" />
          <span className="text-xl sm:text-2xl font-black text-slate-950">
            {result.correctCount}/{result.totalQuestions}
          </span>
          <span className="text-[10px] font-extrabold uppercase text-slate-500">Questions</span>
        </div>
      </div>

      {/* Fun Fact Card */}
      {game.funFact && (
        <div className="mb-8 p-4 rounded-2xl border-2 border-slate-900 bg-sky-50 text-left flex gap-3 shadow-[2px_2px_0px_#0f172a]">
          <Lightbulb className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm font-semibold text-slate-700">
            <strong className="text-slate-950 block mb-0.5">Internet Trivia:</strong>
            {game.funFact}
          </div>
        </div>
      )}

      {/* Action CTA Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <button
          type="button"
          onClick={handleShare}
          className="w-full sm:flex-1 arcade-btn bg-emerald-400 hover:bg-emerald-500 text-slate-950 py-3.5 px-4 text-sm uppercase tracking-wider flex items-center justify-center gap-2"
        >
          <Share2 className="w-4 h-4" />
          <span>Share Score</span>
        </button>

        <button
          type="button"
          onClick={onPlayAgain}
          className="w-full sm:flex-1 arcade-btn bg-amber-300 hover:bg-amber-400 text-slate-950 py-3.5 px-4 text-sm uppercase tracking-wider flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Play Again</span>
        </button>

        <button
          type="button"
          onClick={onMakeAnother}
          className="w-full sm:flex-1 arcade-btn bg-indigo-500 hover:bg-indigo-600 text-white py-3.5 px-4 text-sm uppercase tracking-wider flex items-center justify-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Make Another</span>
        </button>
      </div>
    </div>
  );
}
