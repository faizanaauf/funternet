'use client';

import React from 'react';
import { GameMode } from '@/types/game';
import {
  Sparkles,
  Swords,
  Zap,
  KeyRound,
  Compass,
  GitFork,
  Timer,
  CheckCircle2,
} from 'lucide-react';
import { sounds } from '@/lib/sound';

interface ModeOption {
  id: GameMode;
  title: string;
  badge: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  colorClass: string;
  bgLight: string;
}

const MODES: ModeOption[] = [
  {
    id: 'surprise_me',
    title: 'Surprise Me',
    badge: 'AI PICK',
    icon: Sparkles,
    description: 'Gemini decides the wildest format for your content.',
    colorClass: 'bg-indigo-500 text-white',
    bgLight: 'hover:bg-indigo-50/80',
  },
  {
    id: 'boss_battle',
    title: 'Boss Battle',
    badge: 'HIGH STAKES',
    icon: Swords,
    description: 'Deplete a giant villain’s HP bar with critical hits!',
    colorClass: 'bg-rose-500 text-white',
    bgLight: 'hover:bg-rose-50/80',
  },
  {
    id: 'trivia_rush',
    title: 'Trivia Rush',
    badge: 'FAST PACED',
    icon: Zap,
    description: 'Rapid-fire knowledge gauntlet with streak multipliers.',
    colorClass: 'bg-amber-500 text-slate-950',
    bgLight: 'hover:bg-amber-50/80',
  },
  {
    id: 'escape_room',
    title: 'Escape Room',
    badge: 'LOGIC & PUZZLES',
    icon: KeyRound,
    description: 'Crack security protocols and decipher locked clues.',
    colorClass: 'bg-emerald-500 text-white',
    bgLight: 'hover:bg-emerald-50/80',
  },
  {
    id: 'mystery_quest',
    title: 'Mystery Quest',
    badge: 'STORY ARC',
    icon: Compass,
    description: 'Uncover hidden lore and solve digital investigations.',
    colorClass: 'bg-sky-500 text-white',
    bgLight: 'hover:bg-sky-50/80',
  },
  {
    id: 'choose_adventure',
    title: 'Choose Adventure',
    badge: 'BRANCHING',
    icon: GitFork,
    description: 'Your tactical decisions determine your fate and XP.',
    colorClass: 'bg-purple-500 text-white',
    bgLight: 'hover:bg-purple-50/80',
  },
  {
    id: 'speed_challenge',
    title: 'Speed Challenge',
    badge: 'TIMED REFLEX',
    icon: Timer,
    description: 'Beat the countdown timer before the clock runs dry!',
    colorClass: 'bg-orange-500 text-white',
    bgLight: 'hover:bg-orange-50/80',
  },
];

interface GameModeSelectorProps {
  selectedMode: GameMode;
  onSelectMode: (mode: GameMode) => void;
}

export default function GameModeSelector({
  selectedMode,
  onSelectMode,
}: GameModeSelectorProps) {
  const handleSelect = (mode: GameMode) => {
    sounds.playClick();
    onSelectMode(mode);
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <label className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
          <span>🎮 Select Game Experience</span>
          <span className="text-[10px] text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded-full font-bold">
            7 Playable Modes
          </span>
        </label>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3">
        {MODES.map((mode) => {
          const isSelected = selectedMode === mode.id;
          const Icon = mode.icon;

          return (
            <button
              key={mode.id}
              type="button"
              onClick={() => handleSelect(mode.id)}
              className={`text-left p-3 sm:p-3.5 rounded-2xl border-3 transition-all relative flex flex-col justify-between ${
                isSelected
                  ? 'border-slate-950 bg-amber-50 shadow-[4px_4px_0px_#0f172a] -translate-y-1'
                  : 'border-slate-200 bg-white hover:border-slate-400 shadow-[2px_2px_0px_rgba(0,0,0,0.06)] hover:-translate-y-0.5'
              }`}
            >
              {/* Header inside card */}
              <div className="flex items-center justify-between gap-1 mb-2">
                <div
                  className={`w-8 h-8 rounded-xl border-2 border-slate-900 shadow-[1.5px_1.5px_0px_#0f172a] flex items-center justify-center ${mode.colorClass}`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                {isSelected ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100 shrink-0" />
                ) : (
                  <span className="text-[9px] font-black uppercase tracking-wider bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-md">
                    {mode.badge}
                  </span>
                )}
              </div>

              {/* Title & Description */}
              <div>
                <div className="font-black text-xs sm:text-sm text-slate-900 leading-tight">
                  {mode.title}
                </div>
                <div className="text-[11px] text-slate-500 leading-snug mt-1 line-clamp-2">
                  {mode.description}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
