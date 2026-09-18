'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Gamepad2, Sparkles, Trophy, Flame } from 'lucide-react';
import SoundToggle from './SoundToggle';
import { getUserStats } from '@/lib/storage';
import { UserStats } from '@/types/game';

interface NavbarProps {
  onSelectDemo?: (demoId: string) => void;
}

export default function Navbar({ onSelectDemo }: NavbarProps) {
  const [stats, setStats] = useState<UserStats | null>(null);

  useEffect(() => {
    setStats(getUserStats());
    const interval = setInterval(() => {
      setStats(getUserStats());
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/85 border-b-3 border-slate-900 px-4 lg:px-8 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-indigo-500 border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a] flex items-center justify-center text-white transform group-hover:rotate-6 transition-transform">
            <Gamepad2 className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-black tracking-tight text-slate-900 leading-none">
                FUNTERNET
              </span>
              <span className="text-xs font-black uppercase px-1.5 py-0.5 rounded-md bg-amber-400 border border-slate-900 text-slate-950">
                ARCADE
              </span>
            </div>
            <span className="text-[11px] font-bold text-slate-500 hidden sm:inline">
              We make the internet playable
            </span>
          </div>
        </Link>

        {/* Stats & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Player Stats Pill */}
          {stats && stats.totalXP > 0 && (
            <div className="hidden md:flex items-center gap-2 bg-amber-100 border-2 border-slate-900 px-3 py-1 rounded-xl text-xs font-extrabold shadow-[2px_2px_0px_#0f172a]">
              <Trophy className="w-3.5 h-3.5 text-amber-600" />
              <span>{stats.totalXP.toLocaleString()} XP</span>
              {stats.maxStreak > 1 && (
                <span className="flex items-center text-orange-600 border-l border-slate-300 pl-1.5">
                  <Flame className="w-3.5 h-3.5" />
                  {stats.maxStreak} streak
                </span>
              )}
            </div>
          )}

          {/* Quick Demo Dropdown/Button */}
          {onSelectDemo && (
            <div className="relative group">
              <button
                type="button"
                className="arcade-btn bg-emerald-400 text-slate-950 px-3 py-1.5 text-xs uppercase flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Try Demo</span>
              </button>
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl border-3 border-slate-900 shadow-[4px_4px_0px_#0f172a] p-2 hidden group-hover:flex flex-col gap-1 z-50">
                <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-2 py-1">
                  Offline Ready Demos:
                </div>
                <button
                  type="button"
                  onClick={() => onSelectDemo('terms-and-conditions')}
                  className="text-left px-3 py-2 rounded-xl text-xs font-bold hover:bg-amber-100 hover:text-slate-900 transition-colors flex items-center justify-between"
                >
                  <span>📜 Terms & Conditions Demon</span>
                  <span className="text-[10px] bg-rose-200 text-rose-800 px-1 rounded font-black">BOSS</span>
                </button>
                <button
                  type="button"
                  onClick={() => onSelectDemo('javascript-dungeon')}
                  className="text-left px-3 py-2 rounded-xl text-xs font-bold hover:bg-amber-100 hover:text-slate-900 transition-colors flex items-center justify-between"
                >
                  <span>⚡ JavaScript Dungeon</span>
                  <span className="text-[10px] bg-amber-200 text-amber-800 px-1 rounded font-black">ESCAPE</span>
                </button>
                <button
                  type="button"
                  onClick={() => onSelectDemo('black-hole')}
                  className="text-left px-3 py-2 rounded-xl text-xs font-bold hover:bg-amber-100 hover:text-slate-900 transition-colors flex items-center justify-between"
                >
                  <span>🕳️ Defeat Black Hole</span>
                  <span className="text-[10px] bg-purple-200 text-purple-800 px-1 rounded font-black">SPEED</span>
                </button>
              </div>
            </div>
          )}

          {/* Sound Toggle */}
          <SoundToggle />
        </div>
      </div>
    </header>
  );
}
