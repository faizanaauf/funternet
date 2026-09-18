'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import LoadingExperience from '@/components/LoadingExperience';
import GameRenderer from '@/components/GameRenderer';
import DailyChaos from '@/components/DailyChaos';
import RecentlyPlayed from '@/components/RecentlyPlayed';
import Footer from '@/components/Footer';
import { ToastContainer, showToast } from '@/components/Toast';
import { GameData, GameMode } from '@/types/game';
import { DEMO_GAMES } from '@/lib/demo-games';
import { sounds } from '@/lib/sound';
import {
  Sparkles,
  Zap,
  Swords,
  Trophy,
  Brain,
  ShieldCheck,
  Flame,
} from 'lucide-react';

export default function HomePage() {
  const [activeGame, setActiveGame] = useState<GameData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentTopic, setCurrentTopic] = useState<string>('');

  // Check URL query parameters for direct demo launch on load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const demoParam = params.get('demo');
      if (demoParam && DEMO_GAMES[demoParam]) {
        setActiveGame(DEMO_GAMES[demoParam]);
      }
    }
  }, []);

  const handleGenerateGame = async (input: string, mode: GameMode) => {
    setCurrentTopic(input.slice(0, 60));
    setIsLoading(true);

    try {
      const res = await fetch('/api/generate-game', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input, gameMode: mode }),
      });

      const data = await res.json();

      if (!res.ok || !data.success || !data.game) {
        throw new Error(data.error || 'Failed to generate game');
      }

      sounds.playVictory();
      setActiveGame(data.game);
      showToast('🎮 Game Generated Successfully! Prepare for Battle!', 'success');
    } catch (err: any) {
      console.error('Game generation error:', err);
      showToast(
        err.message || 'The internet goblins broke something. Loading demo backup...',
        'error'
      );
      // Fallback to one of the rich demo presets so presentation never stalls
      sounds.playClick();
      setActiveGame(DEMO_GAMES['terms-and-conditions']);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectDemo = (demoId: string) => {
    sounds.playClick();
    const demo = DEMO_GAMES[demoId];
    if (demo) {
      setActiveGame(demo);
      showToast(`⚡ Loaded "${demo.title}" demo preset!`, 'success');
    }
  };

  const handleRestartGame = () => {
    sounds.playClick();
    if (activeGame) {
      // Create a fresh clone so state re-renders clean
      setActiveGame({ ...activeGame, id: `replay_${Date.now()}` });
    }
  };

  return (
    <div className="min-h-screen flex flex-col selection:bg-amber-300 selection:text-slate-950">
      <ToastContainer />

      {/* If a game is currently active, render the GameRenderer */}
      {activeGame ? (
        <GameRenderer
          game={activeGame}
          onExit={() => {
            sounds.playClick();
            setActiveGame(null);
          }}
          onRestart={handleRestartGame}
        />
      ) : (
        <>
          <Navbar onSelectDemo={handleSelectDemo} />

          {isLoading ? (
            <main className="flex-1 flex items-center justify-center p-4">
              <LoadingExperience topic={currentTopic} />
            </main>
          ) : (
            <main className="flex-1">
              {/* Hero Section */}
              <Hero
                onGenerate={handleGenerateGame}
                onSelectDemo={handleSelectDemo}
                isLoading={isLoading}
              />

              {/* Daily Chaos 30-Second Challenge */}
              <DailyChaos />

              {/* Recently Played from LocalStorage */}
              <RecentlyPlayed onPlayGame={(game) => setActiveGame(game)} />

              {/* How It Works & Why It's Fun */}
              <section className="w-full max-w-5xl mx-auto my-14 px-4">
                <div className="text-center mb-8">
                  <span className="sticker-badge bg-indigo-100 text-indigo-900 text-xs font-black mb-2">
                    🕹️ THE FORMULA
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
                    How We Make The Internet Playable
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Step 1 */}
                  <div className="arcade-card bg-white p-6 flex flex-col items-start">
                    <div className="w-12 h-12 rounded-2xl bg-amber-400 border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a] flex items-center justify-center text-slate-950 font-black text-lg mb-4">
                      1
                    </div>
                    <h3 className="font-black text-base text-slate-950 mb-1">
                      Feed Any Boring Content
                    </h3>
                    <p className="text-xs sm:text-sm font-semibold text-slate-600 leading-relaxed">
                      EULAs, legal arbitration, dense code documentation, or quantum physics lectures.
                    </p>
                  </div>

                  {/* Step 2 */}
                  <div className="arcade-card bg-white p-6 flex flex-col items-start">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500 border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a] flex items-center justify-center text-white font-black text-lg mb-4">
                      2
                    </div>
                    <h3 className="font-black text-base text-slate-950 mb-1">
                      AI Gamification Engine
                    </h3>
                    <p className="text-xs sm:text-sm font-semibold text-slate-600 leading-relaxed">
                      Gemini 3.8 Flash extracts core logic, constructs hilarious stages, and forges a terrifying final boss.
                    </p>
                  </div>

                  {/* Step 3 */}
                  <div className="arcade-card bg-white p-6 flex flex-col items-start">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-400 border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a] flex items-center justify-center text-slate-950 font-black text-lg mb-4">
                      3
                    </div>
                    <h3 className="font-black text-base text-slate-950 mb-1">
                      Earn XP & Slay the Boss
                    </h3>
                    <p className="text-xs sm:text-sm font-semibold text-slate-600 leading-relaxed">
                      Answer questions, build streaks, deplete the villain&apos;s HP bar, and earn shareable achievement badges!
                    </p>
                  </div>
                </div>
              </section>
            </main>
          )}

          <Footer />
        </>
      )}
    </div>
  );
}
