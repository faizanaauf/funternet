'use client';

import React, { useEffect, useState } from 'react';
import { GameData } from '@/types/game';
import { getRecentGames } from '@/lib/storage';
import { sounds } from '@/lib/sound';
import { History, Play, Sparkles, Trophy } from 'lucide-react';

interface RecentlyPlayedProps {
  onPlayGame: (game: GameData) => void;
}

export default function RecentlyPlayed({ onPlayGame }: RecentlyPlayedProps) {
  const [recentGames, setRecentGames] = useState<GameData[]>([]);

  useEffect(() => {
    setRecentGames(getRecentGames());
  }, []);

  if (recentGames.length === 0) return null;

  return (
    <section className="w-full max-w-4xl mx-auto my-10 px-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-indigo-600" />
          <h3 className="text-lg font-black text-slate-900 tracking-tight uppercase">
            Recently Played
          </h3>
        </div>
        <span className="text-xs font-bold text-slate-400">
          Saved locally in browser
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {recentGames.map((game) => (
          <div
            key={game.id}
            className="arcade-card bg-white p-4 flex flex-col justify-between hover:border-slate-950 transition-all"
          >
            <div>
              <div className="flex items-center justify-between gap-1 mb-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-900 border border-indigo-200">
                  {game.gameMode.replace('_', ' ')}
                </span>
                <span className="text-[10px] font-extrabold uppercase text-slate-400">
                  {game.stages.length + (game.boss ? 1 : 0)} stages
                </span>
              </div>

              <h4 className="font-black text-sm text-slate-900 leading-snug line-clamp-1 mb-1">
                {game.title}
              </h4>
              <p className="text-xs text-slate-500 font-semibold line-clamp-2 mb-3">
                {game.subtitle || game.intro}
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                onPlayGame(game);
              }}
              className="w-full arcade-btn bg-amber-300 hover:bg-amber-400 text-slate-950 py-2 text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 font-black"
            >
              <Play className="w-3.5 h-3.5 fill-slate-950" />
              <span>Play Again</span>
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
