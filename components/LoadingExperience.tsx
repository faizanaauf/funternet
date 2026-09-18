'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Gamepad2, Skull, Zap, Swords } from 'lucide-react';

const LOADING_MESSAGES = [
  'Summoning internet chaos...',
  'Teaching the boss your weaknesses...',
  'Generating questionable game mechanics...',
  'Adding unnecessary XP...',
  'Making boring things illegal...',
  'Compressing 40 pages of legal fluff...',
  'Calibrating critical hit multipliers...',
  'Injecting 8-bit dopamine...',
];

interface LoadingExperienceProps {
  topic?: string;
}

export default function LoadingExperience({ topic }: LoadingExperienceProps) {
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(15);

  useEffect(() => {
    const textTimer = setInterval(() => {
      setIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 2200);

    const progTimer = setInterval(() => {
      setProgress((prev) => (prev < 92 ? prev + Math.floor(Math.random() * 8) + 4 : prev));
    }, 400);

    return () => {
      clearInterval(textTimer);
      clearInterval(progTimer);
    };
  }, []);

  return (
    <div className="w-full max-w-xl mx-auto my-12 p-8 arcade-card bg-white text-center relative overflow-hidden">
      {/* Decorative Arcade Corner Lights */}
      <div className="absolute top-3 left-3 flex gap-1.5">
        <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
        <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        {/* Animated Arcade Centerpiece */}
        <div className="relative mb-6">
          <motion.div
            animate={{
              rotate: [0, -6, 6, -3, 3, 0],
              scale: [1, 1.05, 1],
            }}
            transition={{
              repeat: Infinity,
              duration: 2.4,
              ease: 'easeInOut',
            }}
            className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 border-4 border-slate-900 shadow-[5px_5px_0px_#0f172a] flex items-center justify-center text-white"
          >
            <Gamepad2 className="w-12 h-12" />
          </motion.div>

          {/* Floating Orbiting Sprites */}
          <motion.div
            animate={{ y: [-4, 6, -4], rotate: [0, 15, 0] }}
            transition={{ repeat: Infinity, duration: 1.8 }}
            className="absolute -top-3 -right-4 w-9 h-9 rounded-xl bg-amber-400 border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a] flex items-center justify-center text-slate-950 font-black text-sm"
          >
            <Zap className="w-5 h-5 text-slate-950" />
          </motion.div>

          <motion.div
            animate={{ y: [6, -4, 6], rotate: [0, -15, 0] }}
            transition={{ repeat: Infinity, duration: 2.1 }}
            className="absolute -bottom-2 -left-4 w-9 h-9 rounded-xl bg-rose-500 border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a] flex items-center justify-center text-white font-black text-sm"
          >
            <Swords className="w-4 h-4 text-white" />
          </motion.div>
        </div>

        {/* Target Topic Pill */}
        {topic && (
          <div className="mb-3 max-w-md inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border-2 border-slate-900 text-xs font-bold text-slate-700 truncate shadow-[2px_2px_0px_#0f172a]">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
            <span className="truncate">Gamifying: &quot;{topic}&quot;</span>
          </div>
        )}

        {/* Dynamic Loading Text */}
        <div className="h-12 flex items-center justify-center mb-6">
          <AnimatePresence mode="wait">
            <motion.p
              key={index}
              initial={{ opacity: 0, y: 12, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className="text-lg sm:text-xl font-black text-slate-900 tracking-tight"
            >
              {LOADING_MESSAGES[index]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Retro Progress Bar */}
        <div className="w-full max-w-md bg-slate-100 rounded-full h-5 border-3 border-slate-900 shadow-[3px_3px_0px_#0f172a] overflow-hidden p-0.5">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500"
            style={{ width: `${progress}%` }}
            transition={{ ease: 'easeOut', duration: 0.3 }}
          />
        </div>

        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-3">
          Gemini 3.8 Flash • Neural Arcade Engine
        </p>
      </div>
    </div>
  );
}
