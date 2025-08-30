//tic-tac-toe\src\utils\api\leaderboardApi.ts
// Типи даних
import { LeaderboardPlayer } from '@/types/game';

// Додайте цей кеш вгорі файлу
const apiCache = new Map();
const CACHE_DURATION = 30000; // 30 секунд

export interface LeaderboardEntry {
  userId: number;
  username: string;
  walletAddress: string;
  score: number; 
  gameId: number;
  rank?: number;
}

export interface LeaderboardResponse {
  data: LeaderboardEntry[];
}

export interface PlayerStatsResponse {
  hasUsername: boolean;
  user?: {
    userId: number;
    username: string;
    walletAddress: string;
  };
  stats?: {
    score: number;
    rank: number;
  };
}

export const getLeaderboard = async (gameId: number = 217): Promise<LeaderboardResponse> => {
  const cacheKey = `leaderboard-${gameId}`;
  const cached = apiCache.get(cacheKey);
  
  // Повертаємо кешовані дані якщо вони ще актуальні
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  try {
    const response = await fetch(`/api/proxy-leaderboard?gameId=${gameId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    
    // Зберігаємо в кеш
    apiCache.set(cacheKey, {
      data: result,
      timestamp: Date.now()
    });
    
    return result;
  } catch (error) {
    console.error('❌ Помилка завантаження лідерборду:', error);
    throw error;
  }
};

// Функція для відстеження активності через зміну скора
function isRecentlyActive(userId: number, currentScore: number): boolean {
  const storageKey = `player_${userId}_activity`;
  const stored = localStorage.getItem(storageKey);
  const now = Date.now();
  
  if (!stored) {
    // Перший раз - записати і вважати активним
    localStorage.setItem(storageKey, JSON.stringify({
      score: currentScore,
      timestamp: now
    }));
    return true;
  }
  
  const { score: prevScore, timestamp } = JSON.parse(stored);
  
  if (currentScore > prevScore) {
    // Скор збільшився = активний
    localStorage.setItem(storageKey, JSON.stringify({
      score: currentScore,
      timestamp: now
    }));
    return true;
  }
  
  // Скор не змінився, перевірити час (15 хвилин)
  return (now - timestamp) < 15 * 60 * 1000;
}

// Головні функції API
export async function getGlobalLeaderboard(): Promise<LeaderboardEntry[]> {
  const cacheKey = 'global-leaderboard-v1';
  const cached = apiCache.get(cacheKey);
  
  // Повертаємо кешовані дані якщо вони актуальні
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  try {
    // const response = await fetch('https://monad-games-id-site.vercel.app/api/leaderboard');
    const response = await fetch('/api/proxy/leaderboard?gameId=217&sortBy=scores');
    if (!response.ok) {
      throw new Error(`Помилка HTTP: ${response.status}`);
    }
    
    const data: LeaderboardResponse = await response.json();
    const result = data.data || [];
    
    // Зберігаємо в кеш
    apiCache.set(cacheKey, {
      data: result,
      timestamp: Date.now()
    });

  return result; // Змінено з data.leaderboard на data.data
  } catch (error) {
    console.error('Помилка отримання лідерборду:', error);
    throw error;
  }
}

export async function getPlayerStats(walletAddress: string): Promise<PlayerStatsResponse> {
  try {
    const response = await fetch(
      `https://monad-games-id-site.vercel.app/api/check-wallet?wallet=${walletAddress}`
    );
    
    if (!response.ok) {
      throw new Error(`Помилка HTTP: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Помилка отримання статистики гравця:', error);
    throw error;
  }
}

export function convertToPlayerFormat(apiData: LeaderboardEntry[]): LeaderboardPlayer[] {
  return apiData.map((player, index) => {
    return {
      id: index + 1,
      name: player.username || `Гравець ${player.rank || index + 1}`,
      wins: Math.floor(player.score / 10),
      losses: Math.max(0, (player.score || 0) - Math.floor(player.score / 10)),
      draws: 0,
      points: player.score || 0,
      winRate: player.score > 0 ? Math.min(100, (Math.floor(player.score / 10) / Math.max(1, player.score)) * 100) : 0,
      streak: Math.random() > 0.5 ? Math.floor(Math.random() * 10) : -Math.floor(Math.random() * 5),
      rank: player.rank || index + 1,
      lastActive: isRecentlyActive(player.userId, player.score) 
        ? new Date().toISOString() 
        : new Date(Date.now() - 16 * 60 * 1000).toISOString(),
      wallet: player.walletAddress || 'Невідомо'
    };
  });
}

// function getAvatarByRank(rank: number): string {
//   if (rank === 1) return '👑';
//   if (rank === 2) return '🔥';
//   if (rank === 3) return '⚡';
//   const avatars = ['🎯', '🚀', '💎', '🧠', '🌟', '🏆'];
//   return avatars[rank % avatars.length];
// }