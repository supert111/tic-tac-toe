'use client';

import { useState, useEffect } from 'react';

interface Player {
  id: number;
  name: string;
  wins: number;
  losses: number;
  draws: number;
  points: number;
  winRate: number;
  streak: number;
  avatar: string;
  rank: number;
  lastActive: string;
}

const mockPlayers: Player[] = [
  {
    id: 1,
    name: 'Олександр_Крутий',
    wins: 85,
    losses: 12,
    draws: 8,
    points: 2340,
    winRate: 80.95,
    streak: 7,
    avatar: '👑',
    rank: 1,
    lastActive: '2025-06-26T15:30:00'
  },
  {
    id: 2,
    name: 'Марія_Переможниця',
    wins: 72,
    losses: 18,
    draws: 6,
    points: 2180,
    winRate: 75.0,
    streak: -2,
    avatar: '🔥',
    rank: 2,
    lastActive: '2025-06-26T14:45:00'
  },
  {
    id: 3,
    name: 'Іван_Стратег',
    wins: 64,
    losses: 24,
    draws: 12,
    points: 1980,
    winRate: 64.0,
    streak: 3,
    avatar: '🧠',
    rank: 3,
    lastActive: '2025-06-26T16:20:00'
  },
  {
    id: 4,
    name: 'Тетяна_Блискавка',
    wins: 58,
    losses: 28,
    draws: 9,
    points: 1850,
    winRate: 61.05,
    streak: 1,
    avatar: '⚡',
    rank: 4,
    lastActive: '2025-06-26T13:15:00'
  },
  {
    id: 5,
    name: 'Максим_Тактик',
    wins: 45,
    losses: 22,
    draws: 8,
    points: 1720,
    winRate: 60.0,
    streak: -1,
    avatar: '🎯',
    rank: 5,
    lastActive: '2025-06-26T12:30:00'
  },
  {
    id: 6,
    name: 'Анна_Швидка',
    wins: 42,
    losses: 25,
    draws: 5,
    points: 1650,
    winRate: 58.33,
    streak: 2,
    avatar: '🚀',
    rank: 6,
    lastActive: '2025-06-26T11:45:00'
  },
  {
    id: 7,
    name: 'Сергій_Мислитель',
    wins: 38,
    losses: 30,
    draws: 7,
    points: 1580,
    winRate: 50.67,
    streak: 0,
    avatar: '🤔',
    rank: 7,
    lastActive: '2025-06-26T10:20:00'
  },
  {
    id: 8,
    name: 'Ольга_Майстер',
    wins: 35,
    losses: 28,
    draws: 4,
    points: 1520,
    winRate: 52.24,
    streak: 4,
    avatar: '💎',
    rank: 8,
    lastActive: '2025-06-26T16:45:00'
  }
];

type SortOption = 'points' | 'winRate' | 'wins' | 'streak';

export default function Leaderboard() {
  const [players, setPlayers] = useState<Player[]>(mockPlayers);
  const [sortBy, setSortBy] = useState<SortOption>('points');
  const [showOnlyOnline, setShowOnlyOnline] = useState(false);

  useEffect(() => {
    const sortedPlayers = [...mockPlayers].sort((a, b) => {
      switch (sortBy) {
        case 'points':
          return b.points - a.points;
        case 'winRate':
          return b.winRate - a.winRate;
        case 'wins':
          return b.wins - a.wins;
        case 'streak':
          return b.streak - a.streak;
        default:
          return b.points - a.points;
      }
    });

    // Оновлюємо ранги після сортування
    const rankedPlayers = sortedPlayers.map((player, index) => ({
      ...player,
      rank: index + 1
    }));

    setPlayers(rankedPlayers);
  }, [sortBy]);

  const filteredPlayers = showOnlyOnline 
    ? players.filter(player => isOnline(player.lastActive))
    : players;

  function isOnline(lastActive: string): boolean {
    const now = new Date();
    const lastActiveDate = new Date(lastActive);
    const diffMinutes = (now.getTime() - lastActiveDate.getTime()) / (1000 * 60);
    return diffMinutes < 30; // Онлайн, якщо активність менше 30 хвилин тому
  }

  function getLastActiveText(lastActive: string): string {
    const now = new Date();
    const lastActiveDate = new Date(lastActive);
    const diffMinutes = Math.floor((now.getTime() - lastActiveDate.getTime()) / (1000 * 60));
    
    if (diffMinutes < 30) return 'В мережі';
    if (diffMinutes < 60) return `${diffMinutes} хв тому`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)} год тому`;
    return `${Math.floor(diffMinutes / 1440)} дн тому`;
  }

  function getRankIcon(rank: number): string {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `#${rank}`;
    }
  }

  function getStreakDisplay(streak: number): { text: string; color: string } {
    if (streak > 0) {
      return { text: `+${streak}`, color: 'text-green-400' };
    } else if (streak < 0) {
      return { text: `${streak}`, color: 'text-red-400' };
    } else {
      return { text: '0', color: 'text-gray-400' };
    }
  }

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 shadow-2xl">
      <h2 className="text-3xl font-bold mb-6 text-center">🏅 Лідерборд</h2>
      
      {/* Фільтри та сортування */}
      <div className="mb-6 space-y-4">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="onlineOnly"
            checked={showOnlyOnline}
            onChange={(e) => setShowOnlyOnline(e.target.checked)}
            className="w-4 h-4 text-green-500 bg-white/20 border-white/30 rounded focus:ring-green-400"
          />
          <label htmlFor="onlineOnly" className="text-sm text-white/80">
            🟢 Тільки онлайн
          </label>
        </div>
        
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortOption)}
          className="w-full px-4 py-2 rounded-xl bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="points">📊 За очками</option>
          <option value="winRate">📈 За відсотком перемог</option>
          <option value="wins">🏆 За кількістю перемог</option>
          <option value="streak">🔥 За серією</option>
        </select>
      </div>

      {/* Список гравців */}
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {filteredPlayers.map((player) => {
          const streakDisplay = getStreakDisplay(player.streak);
          const totalGames = player.wins + player.losses + player.draws;
          
          return (
            <div 
              key={player.id} 
              className={`
                bg-white/10 backdrop-blur-sm rounded-2xl p-4 border transition-all duration-300 hover:bg-white/15
                ${player.rank <= 3 ? 'border-yellow-400/50 shadow-lg' : 'border-white/20'}
              `}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{player.avatar}</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-lg">{getRankIcon(player.rank)}</span>
                      <span className="font-medium">{player.name}</span>
                      {isOnline(player.lastActive) && (
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                      )}
                    </div>
                    <div className="text-xs text-white/60">
                      {getLastActiveText(player.lastActive)}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-yellow-400">{player.points}</div>
                  <div className="text-xs text-white/60">очків</div>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2 text-sm">
                <div className="text-center">
                  <div className="text-green-400 font-bold">{player.wins}</div>
                  <div className="text-white/60 text-xs">Перемоги</div>
                </div>
                <div className="text-center">
                  <div className="text-red-400 font-bold">{player.losses}</div>
                  <div className="text-white/60 text-xs">Поразки</div>
                </div>
                <div className="text-center">
                  <div className="text-yellow-400 font-bold">{player.draws}</div>
                  <div className="text-white/60 text-xs">Нічиї</div>
                </div>
                <div className="text-center">
                  <div className={`font-bold ${streakDisplay.color}`}>
                    {streakDisplay.text}
                  </div>
                  <div className="text-white/60 text-xs">Серія</div>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <div className="text-sm">
                  <span className="text-white/70">Відсоток перемог: </span>
                  <span className="font-bold text-blue-400">{player.winRate.toFixed(1)}%</span>
                </div>
                <div className="text-xs text-white/60">
                  {totalGames} ігор
                </div>
              </div>

              {/* Прогрес бар відсотка перемог */}
              <div className="mt-2">
                <div className="bg-white/20 rounded-full h-1">
                  <div 
                    className="bg-gradient-to-r from-blue-400 to-blue-500 h-1 rounded-full transition-all duration-500"
                    style={{ width: `${player.winRate}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredPlayers.length === 0 && (
        <div className="text-center py-8 text-white/60">
          <div className="text-4xl mb-2">👥</div>
          <div>Немає гравців онлайн</div>
        </div>
      )}

      {/* Статистика внизу */}
      <div className="mt-6 pt-4 border-t border-white/20 text-center text-sm text-white/70">
        Всього гравців: {players.length} | Онлайн: {players.filter(p => isOnline(p.lastActive)).length}
      </div>
    </div>
  );
}