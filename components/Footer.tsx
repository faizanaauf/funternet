'use client';

import React from 'react';
import { Gamepad2, Heart, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full border-t-3 border-slate-900 bg-white py-8 px-4 mt-auto">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-indigo-500 border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a] flex items-center justify-center text-white">
            <Gamepad2 className="w-4 h-4" />
          </div>
          <div>
            <div className="font-black text-sm text-slate-900 leading-tight">
              FUNTERNET ARCADE
            </div>
            <div className="text-xs text-slate-500 font-bold">
              “The internet is full of information. We make it playable.”
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-xs font-bold text-slate-600">
          <span className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for the Hackathon
          </span>
          <span className="hidden sm:inline">&bull;</span>
          <span className="flex items-center gap-1 text-indigo-600 font-extrabold">
            <Sparkles className="w-3.5 h-3.5" /> Powered by Gemini 3.8 Flash
          </span>
        </div>
      </div>
    </footer>
  );
}
