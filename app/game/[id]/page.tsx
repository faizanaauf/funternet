'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { GameData } from '@/types/game';
import { DEMO_GAMES } from '@/lib/demo-games';
import { getRecentGames } from '@/lib/storage';
import GameRenderer from '@/components/GameRenderer';
import { ToastContainer } from '@/components/Toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function GamePage() {
  const params = useParams();
  const router = useRouter();
  const [game, setGame] = useState<GameData | null>(null);
  const [notFound, setNotFound] = useState<boolean>(false);

  useEffect(() => {
    if (!params?.id) return;
    const rawId = Array.isArray(params.id) ? params.id[0] : params.id;
    const cleanId = rawId.replace('demo-', '');

    // Check prebuilt demo presets
    if (DEMO_GAMES[cleanId]) {
      setGame(DEMO_GAMES[cleanId]);
      return;
    }

    // Check localStorage recent games
    const recent = getRecentGames();
    const match = recent.find((g) => g.id === rawId || g.id.includes(rawId));
    if (match) {
      setGame(match);
      return;
    }

    setNotFound(true);
  }, [params]);

  if (notFound) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 max-w-xl mx-auto flex flex-col items-center justify-center p-6 text-center">
          <div className="arcade-card bg-white p-8">
            <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
            <h1 className="text-2xl font-black text-slate-900 mb-2">Game Not Found</h1>
            <p className="text-sm font-semibold text-slate-600 mb-6">
              This arcade cartridge was either cleared from browser cache or the link is invalid.
            </p>
            <Link
              href="/"
              className="arcade-btn bg-amber-300 hover:bg-amber-400 text-slate-950 py-3 px-6 text-sm uppercase font-black inline-flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Arcade Lobby</span>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!game) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-2xl bg-amber-400 border-3 border-slate-950 animate-bounce flex items-center justify-center text-xl font-black">
          👾
        </div>
        <p className="text-sm font-bold text-slate-500 mt-4">Loading Arcade Cartridge...</p>
      </div>
    );
  }

  return (
    <>
      <ToastContainer />
      <GameRenderer
        game={game}
        onExit={() => router.push('/')}
        onRestart={() => setGame({ ...game, id: `replay_${Date.now()}` })}
      />
    </>
  );
}
