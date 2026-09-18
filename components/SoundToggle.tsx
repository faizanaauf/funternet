'use client';

import React, { useEffect, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { sounds } from '@/lib/sound';
import { showToast } from './Toast';

export default function SoundToggle({ className = '' }: { className?: string }) {
  const [muted, setMuted] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMuted(sounds.getMuted());
    setMounted(true);
  }, []);

  const handleToggle = () => {
    const isNowMuted = sounds.toggleMute();
    setMuted(isNowMuted);
    if (!isNowMuted) {
      sounds.playClick();
      showToast('🔊 Arcade Sound Activated!', 'info');
    } else {
      showToast('🔇 Sound Muted', 'info');
    }
  };

  if (!mounted) {
    return (
      <div className={`w-10 h-10 rounded-xl border-2 border-slate-900 bg-white/80 ${className}`} />
    );
  }

  return (
    <button
      onClick={handleToggle}
      type="button"
      title={muted ? 'Unmute arcade sound' : 'Mute arcade sound'}
      aria-label={muted ? 'Unmute arcade sound' : 'Mute arcade sound'}
      className={`arcade-btn flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs uppercase tracking-wider font-extrabold ${
        muted ? 'bg-slate-200 text-slate-600' : 'bg-amber-300 text-slate-900'
      } ${className}`}
    >
      {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-slate-900" />}
      <span className="hidden sm:inline">{muted ? 'Muted' : 'Sound ON'}</span>
    </button>
  );
}
