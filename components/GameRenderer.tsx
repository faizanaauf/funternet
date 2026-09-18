'use client';

import React, { useState } from 'react';
import { GameData, GameResult } from '@/types/game';
import ScoreHUD from './ScoreHUD';
import QuestionCard from './QuestionCard';
import BossBattle from './BossBattle';
import ResultsScreen from './ResultsScreen';
import { recordGameCompletion, saveRecentGame } from '@/lib/storage';
import { motion, AnimatePresence } from 'framer-motion';

interface GameRendererProps {
  game: GameData;
  onExit: () => void;
  onRestart: () => void;
}

export default function GameRenderer({ game, onExit, onRestart }: GameRendererProps) {
  const [currentStageIdx, setCurrentStageIdx] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [xp, setXp] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [longestStreak, setLongestStreak] = useState<number>(0);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [totalAnswered, setTotalAnswered] = useState<number>(0);

  // Phases: 'stages' | 'boss' | 'results'
  const [phase, setPhase] = useState<'stages' | 'boss' | 'results'>(
    game.stages.length > 0 ? 'stages' : game.boss ? 'boss' : 'results'
  );
  const [gameResult, setGameResult] = useState<GameResult | null>(null);

  const totalMainStages = game.stages.length;
  const currentStage = game.stages[currentStageIdx];

  const handleStageAnswer = (isCorrect: boolean, xpAwarded: number) => {
    setTotalAnswered((prev) => prev + 1);

    if (isCorrect) {
      setCorrectCount((prev) => prev + 1);
      const newStreak = streak + 1;
      setStreak(newStreak);
      setLongestStreak((prev) => Math.max(prev, newStreak));

      // Streak multiplier bonus
      const multiplier = newStreak >= 5 ? 3 : newStreak >= 3 ? 2 : 1;
      const finalXp = xpAwarded * multiplier;
      setXp((prev) => prev + finalXp);
      setScore((prev) => prev + finalXp * 10);
    } else {
      setStreak(0);
      setXp((prev) => prev + xpAwarded);
      setScore((prev) => prev + xpAwarded * 5);
    }

    // Move to next stage or to boss
    if (currentStageIdx + 1 < totalMainStages) {
      setCurrentStageIdx((prev) => prev + 1);
    } else if (game.boss && game.boss.questions && game.boss.questions.length > 0) {
      setPhase('boss');
    } else {
      concludeGame(xp + xpAwarded, correctCount + (isCorrect ? 1 : 0), totalAnswered + 1);
    }
  };

  const handleBossPhaseAnswer = (isCorrect: boolean, xpAwarded: number) => {
    setTotalAnswered((prev) => prev + 1);

    if (isCorrect) {
      setCorrectCount((prev) => prev + 1);
      const newStreak = streak + 1;
      setStreak(newStreak);
      setLongestStreak((prev) => Math.max(prev, newStreak));

      const multiplier = newStreak >= 5 ? 3 : newStreak >= 3 ? 2 : 1;
      const finalXp = xpAwarded * multiplier;
      setXp((prev) => prev + finalXp);
      setScore((prev) => prev + finalXp * 10);
    } else {
      setStreak(0);
      setXp((prev) => prev + xpAwarded);
      setScore((prev) => prev + xpAwarded * 5);
    }
  };

  const handleBossDefeated = () => {
    // Add boss bonus XP
    const bossBonusXp = 500;
    const finalXp = xp + bossBonusXp;
    setXp(finalXp);
    concludeGame(finalXp, correctCount, totalAnswered);
  };

  const concludeGame = (finalXp: number, finalCorrect: number, finalTotal: number) => {
    const accuracy = finalTotal > 0 ? Math.round((finalCorrect / finalTotal) * 100) : 100;
    const result: GameResult = {
      gameId: game.id,
      gameTitle: game.title,
      gameMode: game.gameMode,
      score: score + finalXp * 10,
      xpEarned: finalXp,
      accuracy,
      longestStreak,
      totalQuestions: finalTotal,
      correctCount: finalCorrect,
      achievement: game.achievementTitle || 'Internet Wizard',
      completedAt: Date.now(),
    };

    setGameResult(result);
    setPhase('results');

    // Persist to local storage
    recordGameCompletion(result);
    saveRecentGame(game);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/60 pb-12">
      {/* Top HUD */}
      <ScoreHUD
        score={score}
        xp={xp}
        streak={streak}
        currentStage={currentStageIdx}
        totalStages={totalMainStages}
        onExit={onExit}
        isBossPhase={phase === 'boss'}
      />

      {/* Main Play Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 sm:py-10 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {phase === 'stages' && currentStage && (
            <motion.div
              key={`stage_${currentStage.id}`}
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <QuestionCard
                stage={currentStage}
                stageNumber={currentStageIdx + 1}
                totalStages={totalMainStages}
                onAnswer={handleStageAnswer}
              />
            </motion.div>
          )}

          {phase === 'boss' && game.boss && (
            <motion.div
              key="boss_battle"
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <BossBattle
                boss={game.boss}
                streak={streak}
                playerXP={xp}
                onBossDefeated={handleBossDefeated}
                onBossPhaseAnswer={handleBossPhaseAnswer}
              />
            </motion.div>
          )}

          {phase === 'results' && gameResult && (
            <motion.div
              key="results_screen"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <ResultsScreen
                game={game}
                result={gameResult}
                onPlayAgain={onRestart}
                onMakeAnother={onExit}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
