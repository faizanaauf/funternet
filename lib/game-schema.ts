import { z } from 'zod';
import { GameData, GameStage, BossConfig } from '@/types/game';

export const StageTypeSchema = z.enum([
  'multiple_choice',
  'true_false',
  'quick_reaction',
  'branching_decision',
  'speed_challenge',
  'boss_phase',
]);

export const GameStageSchema = z.object({
  id: z.number().default(1),
  type: StageTypeSchema.default('multiple_choice'),
  title: z.string().min(1, 'Stage title required'),
  story: z.string().default(''),
  question: z.string().min(1, 'Question required'),
  options: z.array(z.string()).min(2, 'At least 2 options required'),
  correctIndex: z.number().int().min(0),
  explanation: z.string().min(1, 'Explanation required'),
  xp: z.number().int().positive().default(100),
  timeLimitSeconds: z.number().optional(),
  bonusClue: z.string().optional(),
});

export const BossConfigSchema = z.object({
  name: z.string().min(1, 'Boss name required'),
  title: z.string().default('The Final Obstacle'),
  intro: z.string().default('A powerful enemy steps into your path!'),
  avatarEmoji: z.string().default('👾'),
  themeColor: z.string().default('red'),
  hp: z.number().int().positive().default(100),
  attackQuotes: z.array(z.string()).default([
    'Is that all your brain can handle?',
    'You are merely a 404 error to me!',
    'Your connection has timed out!',
  ]),
  defeatQuote: z.string().default('Impossible! You decrypted my logic!'),
  questions: z.array(GameStageSchema).min(1, 'At least 1 boss question required'),
});

export const GameDataSchema = z.object({
  title: z.string().min(1, 'Title required'),
  subtitle: z.string().default('An AI-generated interactive arcade quest'),
  theme: z.string().default('arcade'),
  difficulty: z.enum(['easy', 'medium', 'hard', 'chaos']).default('medium'),
  gameMode: z.enum([
    'surprise_me',
    'boss_battle',
    'trivia_rush',
    'escape_room',
    'mystery_quest',
    'choose_adventure',
    'speed_challenge',
  ]).default('boss_battle'),
  intro: z.string().default('Welcome to the simulation. Your challenge begins now.'),
  playerName: z.string().default('Player 1'),
  stages: z.array(GameStageSchema).min(3, 'At least 3 stages required'),
  boss: BossConfigSchema.optional(),
  victoryMessage: z.string().default('You beat the internet! High scores all around!'),
  funFact: z.string().default('Fun fact: You just learned something while playing a game.'),
  achievementTitle: z.string().default('Internet Wizard'),
  achievementDescription: z.string().default('Completed the challenge with flying colors!'),
});

/**
 * Sanitizes and repairs common Gemini JSON generation quirks
 */
export function sanitizeAndParseJSON(rawText: string): any {
  let cleaned = rawText.trim();

  // Strip markdown code fences if present (```json ... ``` or ``` ...)
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '');
    cleaned = cleaned.replace(/\s*```$/, '');
    cleaned = cleaned.trim();
  }

  // Find opening and closing brackets if there is conversational preamble
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }

  // Remove potential trailing commas before closing braces/brackets
  cleaned = cleaned.replace(/,\s*([}\]])/g, '$1');

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    console.error('Initial JSON parse error. Raw text was:', rawText.slice(0, 300));
    throw new Error('Failed to parse AI response into valid JSON: ' + (err as Error).message);
  }
}

/**
 * Validates and post-processes game data to guarantee clean playable states
 */
export function validateGameData(rawObj: any, defaultId?: string): GameData {
  const parsed = GameDataSchema.parse(rawObj);

  // Guarantee valid correctIndex for every stage
  const sanitizedStages: GameStage[] = parsed.stages.map((stage, idx) => {
    let correctIdx = stage.correctIndex;
    if (correctIdx < 0 || correctIdx >= stage.options.length) {
      correctIdx = 0; // Fallback to first option safely
    }
    return {
      ...stage,
      id: idx + 1,
      correctIndex: correctIdx,
      xp: stage.xp || 100,
    };
  });

  let sanitizedBoss: BossConfig | undefined = undefined;
  if (parsed.boss) {
    const bossQuestions = parsed.boss.questions.map((q, idx) => {
      let correctIdx = q.correctIndex;
      if (correctIdx < 0 || correctIdx >= q.options.length) {
        correctIdx = 0;
      }
      return {
        ...q,
        id: 100 + idx + 1,
        type: 'boss_phase' as const,
        correctIndex: correctIdx,
        xp: q.xp || 150,
      };
    });

    sanitizedBoss = {
      ...parsed.boss,
      hp: parsed.boss.hp || 100,
      questions: bossQuestions,
    };
  }

  return {
    ...parsed,
    id: defaultId || `game_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    stages: sanitizedStages,
    boss: sanitizedBoss,
    createdAt: Date.now(),
  };
}
