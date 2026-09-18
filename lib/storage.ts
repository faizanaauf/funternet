import { GameData, GameResult, UserStats } from '@/types/game';

const RECENT_GAMES_KEY = 'funternet_recent_games';
const USER_STATS_KEY = 'funternet_user_stats';

export function getRecentGames(): GameData[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(RECENT_GAMES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error('Failed to load recent games', e);
    return [];
  }
}

export function saveRecentGame(game: GameData): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getRecentGames();
    // Prevent duplicate entries of the same game id
    const filtered = current.filter((g) => g.id !== game.id);
    const updated = [game, ...filtered].slice(0, 5); // Keep max 5
    localStorage.setItem(RECENT_GAMES_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save recent game', e);
  }
}

export function getUserStats(): UserStats {
  const defaultStats: UserStats = {
    totalXP: 0,
    totalGamesPlayed: 0,
    maxStreak: 0,
    badges: ['Novice Netizen'],
  };

  if (typeof window === 'undefined') return defaultStats;
  try {
    const raw = localStorage.getItem(USER_STATS_KEY);
    if (!raw) return defaultStats;
    const parsed = JSON.parse(raw);
    return {
      ...defaultStats,
      ...parsed,
    };
  } catch (e) {
    return defaultStats;
  }
}

export function recordGameCompletion(result: GameResult): UserStats {
  const current = getUserStats();
  const newTotalXP = current.totalXP + result.xpEarned;
  const newGamesPlayed = current.totalGamesPlayed + 1;
  const newMaxStreak = Math.max(current.maxStreak, result.longestStreak);

  const newBadges = new Set(current.badges);
  if (result.achievement) {
    newBadges.add(result.achievement);
  }
  if (newTotalXP >= 500) newBadges.add('Arcade Apprentice');
  if (newTotalXP >= 1500) newBadges.add('Digital Glitchmaster');
  if (newTotalXP >= 3000) newBadges.add('Internet Overlord');
  if (result.longestStreak >= 5) newBadges.add('Flaming Streak');

  const updatedStats: UserStats = {
    totalXP: newTotalXP,
    totalGamesPlayed: newGamesPlayed,
    maxStreak: newMaxStreak,
    badges: Array.from(newBadges),
  };

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(USER_STATS_KEY, JSON.stringify(updatedStats));
    } catch (e) {
      console.error('Failed to save user stats', e);
    }
  }

  return updatedStats;
}
