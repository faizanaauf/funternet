export type GameMode =
  | 'surprise_me'
  | 'boss_battle'
  | 'trivia_rush'
  | 'escape_room'
  | 'mystery_quest'
  | 'choose_adventure'
  | 'speed_challenge';

export type StageType =
  | 'multiple_choice'
  | 'true_false'
  | 'quick_reaction'
  | 'branching_decision'
  | 'speed_challenge'
  | 'boss_phase';

export interface GameStage {
  id: number;
  type: StageType;
  title: string;
  story: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  xp: number;
  timeLimitSeconds?: number;
  bonusClue?: string;
}

export interface BossConfig {
  name: string;
  title: string;
  intro: string;
  avatarEmoji: string;
  themeColor: string; // Tailwind color class or hex
  hp: number;
  attackQuotes: string[];
  defeatQuote: string;
  questions: GameStage[];
}

export interface GameData {
  id: string;
  title: string;
  subtitle: string;
  theme: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'chaos';
  gameMode: GameMode;
  intro: string;
  playerName: string;
  stages: GameStage[];
  boss?: BossConfig;
  victoryMessage: string;
  funFact: string;
  achievementTitle: string;
  achievementDescription: string;
  createdAt: number;
  sourceTopic?: string;
}

export interface GameResult {
  gameId: string;
  gameTitle: string;
  gameMode: GameMode;
  score: number;
  xpEarned: number;
  accuracy: number;
  longestStreak: number;
  totalQuestions: number;
  correctCount: number;
  achievement: string;
  completedAt: number;
}

export interface UserStats {
  totalXP: number;
  totalGamesPlayed: number;
  maxStreak: number;
  badges: string[];
}

export interface ChaosChallenge {
  id: string;
  title: string;
  category: string;
  badge: string;
  description: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  xp: number;
}
