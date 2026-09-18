'use client';

import React, { useState } from 'react';
import { GameMode } from '@/types/game';
import GameModeSelector from './GameModeSelector';
import { Sparkles, Gamepad2, Play, Flame, ShieldAlert, Cpu } from 'lucide-react';
import { sounds } from '@/lib/sound';

interface HeroProps {
  onGenerate: (input: string, mode: GameMode) => void;
  onSelectDemo: (demoId: string) => void;
  isLoading: boolean;
}

const EXAMPLE_CHIPS = [
  { label: 'Learn JavaScript', value: 'Teach me JavaScript closures, hoisting, and event loop microtasks' },
  { label: 'Understand Black Holes', value: 'Explain Black Holes, gravitational time dilation, and event horizons' },
  { label: 'Survive Terms & Conditions 💀', value: 'Terms and conditions arbitration clauses, tracking cookies, and data ownership agreements' },
  { label: 'Master Psychology', value: 'Cognitive biases, confirmation bias, and the Dunning-Kruger effect in human decision making' },
  { label: 'Decode AI', value: 'How Large Language Models, attention mechanisms, and transformer neural networks actually work' },
  { label: 'Explore Space', value: 'James Webb Space Telescope discoveries, exoplanet atmospheres, and red giant star life cycles' },
];

export default function Hero({ onGenerate, onSelectDemo, isLoading }: HeroProps) {
  const [input, setInput] = useState('');
  const [selectedMode, setSelectedMode] = useState<GameMode>('surprise_me');

  const handleChipClick = (chipValue: string) => {
    sounds.playClick();
    setInput(chipValue);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sounds.playClick();
    onGenerate(input.trim(), selectedMode);
  };

  return (
    <section className="w-full max-w-4xl mx-auto px-4 pt-8 pb-12 text-center">
      {/* Playful Floating Hero Header */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-300 border-2 border-slate-950 text-slate-950 text-xs font-black uppercase tracking-wider shadow-[3px_3px_0px_#0f172a] mb-6 rotate-[-1deg]">
        <Flame className="w-4 h-4 text-rose-600 fill-rose-500 animate-flame" />
        <span>Hackathon Special Edition • The Gamified Web</span>
      </div>

      {/* Main Titles */}
      <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-950 tracking-tight leading-[0.95] mb-4">
        FUNTERNET <br />
        <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          ARCADE
        </span>
      </h1>

      <p className="text-lg sm:text-2xl font-extrabold text-slate-800 max-w-2xl mx-auto mb-2 leading-tight">
        &ldquo;The internet is full of information. <br className="hidden sm:inline" />
        We make it playable.&rdquo;
      </p>

      <p className="text-sm sm:text-base font-semibold text-slate-500 max-w-xl mx-auto mb-8">
        Paste anything boring and turn it into an AI-powered game in seconds.
      </p>

      {/* Main Generator Card */}
      <div className="arcade-card bg-white p-5 sm:p-8 text-left relative">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Text Input Area */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label
                htmlFor="content-input"
                className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5"
              >
                <span>📝 What should we turn into a game?</span>
              </label>
              <span className="text-[11px] font-bold text-slate-400">
                {input.length} chars
              </span>
            </div>

            <div className="relative">
              <textarea
                id="content-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Paste an article, study notes, Terms & Conditions, or type: 'Teach me JavaScript closures' or 'Explain black holes'..."
                rows={4}
                className="w-full p-4 rounded-2xl border-3 border-slate-900 bg-slate-50/70 focus:bg-white text-slate-900 font-bold text-sm sm:text-base focus:outline-none focus:ring-4 focus:ring-amber-200 transition-all placeholder:text-slate-400 resize-y shadow-inner"
              />
            </div>
          </div>

          {/* Quick Example Chips */}
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 block mb-2">
              ⚡ Quick Topics to Try:
            </span>
            <div className="flex flex-wrap gap-2">
              {EXAMPLE_CHIPS.map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleChipClick(chip.value)}
                  className="px-3 py-1 rounded-xl text-xs font-extrabold border-2 border-slate-900 bg-white hover:bg-amber-100 text-slate-800 shadow-[2px_2px_0px_#0f172a] hover:-translate-y-0.5 transition-all"
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

          {/* Game Mode Selector */}
          <GameModeSelector
            selectedMode={selectedMode}
            onSelectMode={setSelectedMode}
          />

          {/* Primary CTA Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className={`w-full arcade-btn py-4 px-6 text-lg sm:text-xl uppercase tracking-wider flex items-center justify-center gap-2.5 font-black text-slate-950 ${
                !input.trim() || isLoading
                  ? 'bg-slate-200 text-slate-400 border-slate-400 shadow-none cursor-not-allowed'
                  : 'bg-amber-400 hover:bg-amber-300'
              }`}
            >
              <Sparkles className="w-6 h-6 text-slate-950" />
              <span>{isLoading ? 'Summoning Game...' : '✨ MAKE IT FUN'}</span>
            </button>
          </div>
        </form>

        {/* Guaranteed Offline Demo Presets Banner */}
        <div className="mt-6 pt-5 border-t-2 border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-left">
            <span className="text-[11px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 inline-block mb-0.5">
              Instant Hackathon Demos (No API Key Required)
            </span>
            <p className="text-xs text-slate-500 font-semibold">
              Live presentation safe — zero quota consumption or network dependencies:
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => onSelectDemo('terms-and-conditions')}
              className="arcade-btn bg-rose-100 hover:bg-rose-200 text-rose-950 px-2.5 py-1.5 text-xs font-extrabold flex items-center gap-1"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
              <span>Terms Demon</span>
            </button>
            <button
              type="button"
              onClick={() => onSelectDemo('javascript-dungeon')}
              className="arcade-btn bg-amber-100 hover:bg-amber-200 text-amber-950 px-2.5 py-1.5 text-xs font-extrabold flex items-center gap-1"
            >
              <Cpu className="w-3.5 h-3.5 text-amber-700" />
              <span>JS Dungeon</span>
            </button>
            <button
              type="button"
              onClick={() => onSelectDemo('black-hole')}
              className="arcade-btn bg-purple-100 hover:bg-purple-200 text-purple-950 px-2.5 py-1.5 text-xs font-extrabold flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-700" />
              <span>Black Hole</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
