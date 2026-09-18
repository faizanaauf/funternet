'use client';

import React from 'react';
import { Flame, Star, Target, Home } from 'lucide-react';
import SoundToggle from './SoundToggle';
import { motion } from 'framer-motion';

interface ScoreHUDProps {
  score: number;
  xp: number;
  streak: number;
  currentStage: number;
  totalStages: number;
  onExit: () => void;
  isBossPhase?: boolean;
}

export default function ScoreHUD({
  score,
  xp,
  streak,
  currentStage,
  totalStages,
  onExit,
  isBossPhase = false,
}: ScoreHUDProps) {
  const progressPercent = Math.min(100, Math.round((currentStage / totalStages) * 100));

  return (
    <div className="w-full bg-white/95 backdrop-blur-md border-b-3 border-slate-900 sticky top-0 z-30 px-3 sm:px-6 py-2.5 shadow-[0px_4px_0px_rgba(15,23,42,0.06)]">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Home / Exit Button */}
        <button
          type="button"
          onClick={onExit}
          title="Return to Arcade Lobby"
          className="arcade-btn bg-slate-100 hover:bg-slate-200 text-slate-800 p-2 sm:px-3 sm:py-1.5 flex items-center gap-1.5 text-xs uppercase"
        >
          <Home className="w-4 h-4" />
          <span className="hidden sm:inline">Exit</span>
        </button>

        {/* Center: Live Stats HUD */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Streak Flame */}
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border-2 border-slate-900 transition-all font-black text-xs ${
              streak > 2
                ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 shadow-[2px_2px_0px_#0f172a]'
                : streak > 0
                ? 'bg-amber-100 text-amber-900'
                : 'bg-slate-100 text-slate-400'
            }`}
          >
            <span className={streak > 1 ? 'animate-flame' : ''}>
              <Flame
                className={`w-4 h-4 ${
                  streak > 1 ? 'text-rose-600 fill-rose-500' : 'text-slate-400'
                }`}
              />
            </span>
            <span>
              {streak} <span className="hidden sm:inline">streak</span>
            </span>
            {streak >= 3 && (
              <span className="text-[10px] bg-rose-600 text-white px-1.5 rounded-md uppercase font-black tracking-wider ml-0.5">
                {streak >= 5 ? 'x3' : 'x2'}
              </span>
            )}
          </div>

          {/* XP Counter */}
          <motion.div
            key={xp}
            initial={{ scale: 1.15 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl border-2 border-slate-900 bg-amber-300 text-slate-950 font-black text-xs shadow-[2px_2px_0px_#0f172a]"
          >
            <Star className="w-4 h-4 fill-amber-500 text-slate-950" />
            <span>{xp} XP</span>
          </motion.div>

          {/* Stage Counter / Phase Indicator */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl border-2 border-slate-900 bg-indigo-50 text-indigo-950 font-bold text-xs">
            <Target className="w-4 h-4 text-indigo-600" />
            <span>
              {isBossPhase
                ? 'FINAL BOSS'
                : `Stage ${Math.min(currentStage + 1, totalStages)}/${totalStages}`}
            </span>
          </div>
        </div>

        {/* Right: Sound Toggle */}
        <SoundToggle />
      </div>

      {/* Thin Animated Quest Progress Line */}
      <div className="max-w-4xl mx-auto mt-2 h-2 bg-slate-100 rounded-full border border-slate-900 overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${
            isBossPhase
              ? 'bg-gradient-to-r from-rose-500 to-red-600'
              : 'bg-gradient-to-r from-indigo-500 to-emerald-400'
          }`}
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}
