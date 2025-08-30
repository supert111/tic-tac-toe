// //tic-tac-toe\src\app\components\ui\Leaderboard.tsx
// 'use client';

// import { useState, useEffect } from 'react';

// interface Player {
//   id: number;
//   name: string;
//   wins: number;
//   losses: number;
//   draws: number;
//   points: number;
//   winRate: number;
//   streak: number;
//   avatar: string;
//   rank: number;
//   lastActive: string;
// }

// const mockPlayers: Player[] = [
//   {
//     id: 1,
//     name: 'Олександр_Крутий',
//     wins: 85,
//     losses: 12,
//     draws: 8,
//     points: 2340,
//     winRate: 80.95,
//     streak: 7,
//     avatar: '👑',
//     rank: 1,
//     lastActive: '2025-06-26T15:30:00'
//   },
//   {
//     id: 2,
//     name: 'Марія_Переможниця',
//     wins: 72,
//     losses: 18,
//     draws: 6,
//     points: 2180,
//     winRate: 75.0,
//     streak: -2,
//     avatar: '🔥',
//     rank: 2,
//     lastActive: '2025-06-26T14:45:00'
//   },
//   {
//     id: 3,
//     name: 'Іван_Стратег',
//     wins: 64,
//     losses: 24,
//     draws: 12,
//     points: 1980,
//     winRate: 64.0,
//     streak: 3,
//     avatar: '🧠',
//     rank: 3,
//     lastActive: '2025-06-26T16:20:00'
//   },
//   {
//     id: 4,
//     name: 'Тетяна_Блискавка',
//     wins: 58,
//     losses: 28,
//     draws: 9,
//     points: 1850,
//     winRate: 61.05,
//     streak: 1,
//     avatar: '⚡',
//     rank: 4,
//     lastActive: '2025-06-26T13:15:00'
//   },
//   {
//     id: 5,
//     name: 'Максим_Тактик',
//     wins: 45,
//     losses: 22,
//     draws: 8,
//     points: 1720,
//     winRate: 60.0,
//     streak: -1,
//     avatar: '🎯',
//     rank: 5,
//     lastActive: '2025-06-26T12:30:00'
//   },
//   {
//     id: 6,
//     name: 'Анна_Швидка',
//     wins: 42,
//     losses: 25,
//     draws: 5,
//     points: 1650,
//     winRate: 58.33,
//     streak: 2,
//     avatar: '🚀',
//     rank: 6,
//     lastActive: '2025-06-26T11:45:00'
//   },
//   {
//     id: 7,
//     name: 'Сергій_Мислитель',
//     wins: 38,
//     losses: 30,
//     draws: 7,
//     points: 1580,
//     winRate: 50.67,
//     streak: 0,
//     avatar: '🤔',
//     rank: 7,
//     lastActive: '2025-06-26T10:20:00'
//   },
//   {
//     id: 8,
//     name: 'Ольга_Майстер',
//     wins: 35,
//     losses: 28,
//     draws: 4,
//     points: 1520,
//     winRate: 52.24,
//     streak: 4,
//     avatar: '💎',
//     rank: 8,
//     lastActive: '2025-06-26T16:45:00'
//   }
// ];

// type SortOption = 'points' | 'winRate' | 'wins' | 'streak';

// export default function Leaderboard() {
//   const [players, setPlayers] = useState<Player[]>(mockPlayers);
//   const [sortBy, setSortBy] = useState<SortOption>('points');
//   const [showOnlyOnline, setShowOnlyOnline] = useState(false);

//   useEffect(() => {
//     const sortedPlayers = [...mockPlayers].sort((a, b) => {
//       switch (sortBy) {
//         case 'points':
//           return b.points - a.points;
//         case 'winRate':
//           return b.winRate - a.winRate;
//         case 'wins':
//           return b.wins - a.wins;
//         case 'streak':
//           return b.streak - a.streak;
//         default:
//           return b.points - a.points;
//       }
//     });

//     // Оновлюємо ранги після сортування
//     const rankedPlayers = sortedPlayers.map((player, index) => ({
//       ...player,
//       rank: index + 1
//     }));

//     setPlayers(rankedPlayers);
//   }, [sortBy]);

//   const filteredPlayers = showOnlyOnline 
//     ? players.filter(player => isOnline(player.lastActive))
//     : players;

//   function isOnline(lastActive: string): boolean {
//     const now = new Date();
//     const lastActiveDate = new Date(lastActive);
//     const diffMinutes = (now.getTime() - lastActiveDate.getTime()) / (1000 * 60);
//     return diffMinutes < 30; // Онлайн, якщо активність менше 30 хвилин тому
//   }

//   function getLastActiveText(lastActive: string): string {
//     const now = new Date();
//     const lastActiveDate = new Date(lastActive);
//     const diffMinutes = Math.floor((now.getTime() - lastActiveDate.getTime()) / (1000 * 60));
    
//     if (diffMinutes < 30) return 'В мережі';
//     if (diffMinutes < 60) return `${diffMinutes} хв тому`;
//     if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)} год тому`;
//     return `${Math.floor(diffMinutes / 1440)} дн тому`;
//   }

//   function getRankIcon(rank: number): string {
//     switch (rank) {
//       case 1: return '🥇';
//       case 2: return '🥈';
//       case 3: return '🥉';
//       default: return `#${rank}`;
//     }
//   }

//   function getStreakDisplay(streak: number): { text: string; color: string } {
//     if (streak > 0) {
//       return { text: `+${streak}`, color: 'text-green-400' };
//     } else if (streak < 0) {
//       return { text: `${streak}`, color: 'text-red-400' };
//     } else {
//       return { text: '0', color: 'text-gray-400' };
//     }
//   }

//   return (
//     <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 shadow-2xl">
//       <h2 className="text-3xl font-bold mb-6 text-center">🏅 Лідерборд</h2>
      
//       {/* Фільтри та сортування */}
//       <div className="mb-6 space-y-4">
//         <div className="flex items-center gap-2">
//           <input
//             type="checkbox"
//             id="onlineOnly"
//             checked={showOnlyOnline}
//             onChange={(e) => setShowOnlyOnline(e.target.checked)}
//             className="w-4 h-4 text-green-500 bg-white/20 border-white/30 rounded focus:ring-green-400"
//           />
//           <label htmlFor="onlineOnly" className="text-sm text-white/80">
//             🟢 Тільки онлайн
//           </label>
//         </div>
        
//         <select
//           value={sortBy}
//           onChange={(e) => setSortBy(e.target.value as SortOption)}
//           className="w-full px-4 py-2 rounded-xl bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
//         >
//           <option value="points">📊 За очками</option>
//           <option value="winRate">📈 За відсотком перемог</option>
//           <option value="wins">🏆 За кількістю перемог</option>
//           <option value="streak">🔥 За серією</option>
//         </select>
//       </div>

//       {/* Список гравців */}
//       <div className="space-y-3 max-h-80 overflow-y-auto">
//         {filteredPlayers.map((player) => {
//           const streakDisplay = getStreakDisplay(player.streak);
//           const totalGames = player.wins + player.losses + player.draws;
          
//           return (
//             <div 
//               key={player.id} 
//               className={`
//                 bg-white/10 backdrop-blur-sm rounded-2xl p-4 border transition-all duration-300 hover:bg-white/15
//                 ${player.rank <= 3 ? 'border-yellow-400/50 shadow-lg' : 'border-white/20'}
//               `}
//             >
//               <div className="flex items-center justify-between mb-2">
//                 <div className="flex items-center gap-3">
//                   <div className="text-2xl">{player.avatar}</div>
//                   <div>
//                     <div className="flex items-center gap-2">
//                       <span className="font-bold text-lg">{getRankIcon(player.rank)}</span>
//                       <span className="font-medium">{player.name}</span>
//                       {isOnline(player.lastActive) && (
//                         <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
//                       )}
//                     </div>
//                     <div className="text-xs text-white/60">
//                       {getLastActiveText(player.lastActive)}
//                     </div>
//                   </div>
//                 </div>
//                 <div className="text-right">
//                   <div className="font-bold text-yellow-400">{player.points}</div>
//                   <div className="text-xs text-white/60">очків</div>
//                 </div>
//               </div>

//               <div className="grid grid-cols-4 gap-2 text-sm">
//                 <div className="text-center">
//                   <div className="text-green-400 font-bold">{player.wins}</div>
//                   <div className="text-white/60 text-xs">Перемоги</div>
//                 </div>
//                 <div className="text-center">
//                   <div className="text-red-400 font-bold">{player.losses}</div>
//                   <div className="text-white/60 text-xs">Поразки</div>
//                 </div>
//                 <div className="text-center">
//                   <div className="text-yellow-400 font-bold">{player.draws}</div>
//                   <div className="text-white/60 text-xs">Нічиї</div>
//                 </div>
//                 <div className="text-center">
//                   <div className={`font-bold ${streakDisplay.color}`}>
//                     {streakDisplay.text}
//                   </div>
//                   <div className="text-white/60 text-xs">Серія</div>
//                 </div>
//               </div>

//               <div className="mt-3 flex items-center justify-between">
//                 <div className="text-sm">
//                   <span className="text-white/70">Відсоток перемог: </span>
//                   <span className="font-bold text-blue-400">{player.winRate.toFixed(1)}%</span>
//                 </div>
//                 <div className="text-xs text-white/60">
//                   {totalGames} ігор
//                 </div>
//               </div>

//               {/* Прогрес бар відсотка перемог */}
//               <div className="mt-2">
//                 <div className="bg-white/20 rounded-full h-1">
//                   <div 
//                     className="bg-gradient-to-r from-blue-400 to-blue-500 h-1 rounded-full transition-all duration-500"
//                     style={{ width: `${player.winRate}%` }}
//                   />
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {filteredPlayers.length === 0 && (
//         <div className="text-center py-8 text-white/60">
//           <div className="text-4xl mb-2">👥</div>
//           <div>Немає гравців онлайн</div>
//         </div>
//       )}

//       {/* Статистика внизу */}
//       <div className="mt-6 pt-4 border-t border-white/20 text-center text-sm text-white/70">
//         Всього гравців: {players.length} | Онлайн: {players.filter(p => isOnline(p.lastActive)).length}
//       </div>
//     </div>
//   );
// }






















// // //tic-tac-toe\src\app\components\ui\Leaderboard.tsx
// 'use client';

// import { useState, useEffect } from 'react';

// interface Player {
//   id: number;
//   name: string;
//   wins: number;
//   losses: number;
//   draws: number;
//   points: number;
//   winRate: number;
//   streak: number;
//   //avatar: string;
//   rank: number;
//   lastActive: string;
//   wallet: string;
// }

// const mockPlayers: Player[] = [
//   {
//     id: 1,
//     name: 'Олександр_Крутий',
//     wins: 85,
//     losses: 12,
//     draws: 8,
//     points: 2340,
//     winRate: 80.95,
//     streak: 7,
//     rank: 1,
//     lastActive: '2025-08-28T15:30:00',
//     wallet: '0x54Dd...b251cB'
//   },
//   {
//     id: 2,
//     name: 'Марія_Переможниця',
//     wins: 72,
//     losses: 18,
//     draws: 6,
//     points: 2180,
//     winRate: 75.0,
//     streak: -2,
//     rank: 2,
//     lastActive: '2025-08-28T14:45:00',
//     wallet: '0x23Aa...c891dE'
//   },
//   {
//     id: 3,
//     name: 'Іван_Стратег',
//     wins: 64,
//     losses: 24,
//     draws: 12,
//     points: 1980,
//     winRate: 64.0,
//     streak: 3,
//     rank: 3,
//     lastActive: '2025-08-28T16:20:00',
//     wallet: '0x78Ff...d234eF'
//   },
//   {
//     id: 4,
//     name: 'Тетяна_Блискавка',
//     wins: 58,
//     losses: 28,
//     draws: 9,
//     points: 1850,
//     winRate: 61.05,
//     streak: 1,
//     rank: 4,
//     lastActive: '2025-08-28T13:15:00',
//     wallet: '0x45Cc...e567gH'
//   },
//   {
//     id: 5,
//     name: 'Максим_Тактик',
//     wins: 45,
//     losses: 22,
//     draws: 8,
//     points: 1720,
//     winRate: 60.0,
//     streak: -1,
//     rank: 5,
//     lastActive: '2025-08-28T12:30:00',
//     wallet: '0x89Bb...f890iJ'
//   },
//   {
//     id: 6,
//     name: 'Анна_Швидка',
//     wins: 42,
//     losses: 25,
//     draws: 5,
//     points: 1650,
//     winRate: 58.33,
//     streak: 2,
//     rank: 6,
//     lastActive: '2025-08-28T11:45:00',
//     wallet: '0x12Dd...g123kL'
//   },
//   {
//     id: 7,
//     name: 'Сергій_Мислитель',
//     wins: 38,
//     losses: 30,
//     draws: 7,
//     points: 1580,
//     winRate: 50.67,
//     streak: 0,
//     rank: 7,
//     lastActive: '2025-08-28T10:20:00',
//     wallet: '0x34Ee...h456mN'
//   },
//   {
//     id: 8,
//     name: 'Ольга_Майстер',
//     wins: 35,
//     losses: 28,
//     draws: 4,
//     points: 1520,
//     winRate: 52.24,
//     streak: 4,
//     rank: 8,
//     lastActive: '2025-08-28T16:45:00',
//     wallet: '0x56Ff...i789oP'
//   }
// ];

// // Додаємо поточного гравця який не в топі
// const currentPlayer: Player = {
//   id: 99,
//   name: 'Myk',
//   wins: 2,
//   losses: 8,
//   draws: 0,
//   points: 20,
//   winRate: 20.0,
//   streak: -3,
//   rank: 11,
//   lastActive: '2025-08-28T16:50:00',
//   wallet: '0x54Dd...b251cB'
// };

// type SortOption = 'points' | 'winRate' | 'wins' | 'streak';

// export default function Leaderboard() {
//   const [players, setPlayers] = useState<Player[]>(mockPlayers);
//   const [sortBy, setSortBy] = useState<SortOption>('points');
//   const [showOnlyOnline, setShowOnlyOnline] = useState(false);

//   useEffect(() => {
//     const sortedPlayers = [...mockPlayers].sort((a, b) => {
//       switch (sortBy) {
//         case 'points':
//           return b.points - a.points;
//         case 'winRate':
//           return b.winRate - a.winRate;
//         case 'wins':
//           return b.wins - a.wins;
//         case 'streak':
//           return b.streak - a.streak;
//         default:
//           return b.points - a.points;
//       }
//     });

//     // Оновлюємо ранги після сортування
//     const rankedPlayers = sortedPlayers.map((player, index) => ({
//       ...player,
//       rank: index + 1
//     }));

//     setPlayers(rankedPlayers);
//   }, [sortBy]);

//   const filteredPlayers = showOnlyOnline 
//     ? players.filter(player => isOnline(player.lastActive))
//     : players;

//   function isOnline(lastActive: string): boolean {
//     const now = new Date();
//     const lastActiveDate = new Date(lastActive);
//     const diffMinutes = (now.getTime() - lastActiveDate.getTime()) / (1000 * 60);
//     return diffMinutes < 30; // Онлайн, якщо активність менше 30 хвилин тому
//   }

//   function getLastActiveText(lastActive: string): string {
//     const now = new Date();
//     const lastActiveDate = new Date(lastActive);
//     const diffMinutes = Math.floor((now.getTime() - lastActiveDate.getTime()) / (1000 * 60));
    
//     if (diffMinutes < 30) return 'В мережі';
//     if (diffMinutes < 60) return `${diffMinutes} хв тому`;
//     if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)} год тому`;
//     return `${Math.floor(diffMinutes / 1440)} дн тому`;
//   }

//   function getStreakDisplay(streak: number): { text: string; color: string } {
//     if (streak > 0) {
//       return { text: `+${streak}`, color: 'text-green-400' };
//     } else if (streak < 0) {
//       return { text: `${streak}`, color: 'text-red-400' };
//     } else {
//       return { text: '0', color: 'text-gray-400' };
//     }
//   }

//   const onlineCount = players.filter(p => isOnline(p.lastActive)).length + (isOnline(currentPlayer.lastActive) ? 1 : 0);

//   return (
//     <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 rounded-2xl shadow-2xl overflow-hidden border border-purple-400/30">
//       {/* Gaming Header */}
//       <div className="bg-black/30 p-4 border-b border-purple-400/30">
//         <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 text-center">
//           ⚡ ЛІДЕРБОРД ⚡
//         </h2>
//       </div>

//       <div className="p-4">
//         {/* Futuristic Controls */}
//         <div className="flex gap-2 mb-4">
//           <label className="flex items-center gap-2 px-3 py-1 bg-purple-600/50 border border-purple-400/50 rounded-lg text-xs text-purple-200 hover:bg-purple-600/70 transition-all cursor-pointer">
//             <input
//               type="checkbox"
//               checked={showOnlyOnline}
//               onChange={(e) => setShowOnlyOnline(e.target.checked)}
//               className="w-3 h-3 text-green-500 bg-purple-700 border-purple-400 rounded focus:ring-green-400"
//             />
//             🟢 ОНЛАЙН
//           </label>
          
//           <select
//             value={sortBy}
//             onChange={(e) => setSortBy(e.target.value as SortOption)}
//             className="px-3 py-1 bg-purple-600 border border-purple-400 rounded-lg text-xs text-white font-semibold focus:outline-none focus:ring-2 focus:ring-purple-300"
//           >
//             <option value="points">ОЧКИ ↓</option>
//             {/* <option value="winRate">WIN RATE ↓</option> */}
//             {/* <option value="wins">ПЕРЕМОГИ ↓</option> */}
//             <option value="streak">СЕРІЯ ↓</option>
//           </select>
//         </div>

//         {/* Cyber Table */}
//         <div className="bg-black/20 rounded-xl p-2 border border-purple-500/30">
//           <div className="grid grid-cols-12 gap-2 p-2 text-xs font-bold text-purple-300 border-b border-purple-500/30 mb-1">
//             <div className="col-span-1">#</div>
//             <div className="col-span-4">ГРАВЕЦЬ</div>
//             <div className="col-span-3">ГАМАНЕЦЬ</div>
//             <div className="col-span-2 text-right">ОЧКИ</div>
//             <div className="col-span-2 text-center">СЕРІЯ</div>
//           </div>
          
//           <div className="space-y-1 max-h-72 overflow-y-auto">
//             {filteredPlayers.map((player, index) => {
//               const streakDisplay = getStreakDisplay(player.streak);
              
//               return (
//                 <div key={player.id} className={`
//                   grid grid-cols-12 gap-2 items-center p-2 rounded-lg transition-all hover:bg-purple-500/20
//                   ${index < 3 ? 'bg-gradient-to-r' : 'bg-purple-800/20'}
//                   ${index === 0 ? 'from-yellow-500/20 to-yellow-600/20 border border-yellow-400/30' : ''}
//                   ${index === 1 ? 'from-gray-300/20 to-gray-400/20 border border-gray-400/30' : ''}
//                   ${index === 2 ? 'from-orange-500/20 to-orange-600/20 border border-orange-400/30' : ''}
//                 `}>
//                   <div className="col-span-1">
//                     <div className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold
//                       ${index < 3 ? '' : 'bg-purple-600/50 text-purple-200'}
//                       ${index === 0 ? 'bg-yellow-500 text-black' : ''}
//                       ${index === 1 ? 'bg-gray-400 text-black' : ''}
//                       ${index === 2 ? 'bg-orange-500 text-black' : ''}
//                     `}>
//                       {player.rank}
//                     </div>
//                   </div>
//                   <div className="col-span-4">
//                     <div className="flex items-center gap-1">
//                       {/* <span className="text-sm">{player.avatar}</span> */}
//                       <div className="min-w-0">
//                         <div className="font-semibold text-white text-sm truncate flex items-center gap-1">
//                           {player.name}
//                           {isOnline(player.lastActive) && (
//                             <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
//                           )}
//                         </div>
//                         <div className="text-xs text-purple-300">{getLastActiveText(player.lastActive)}</div>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="col-span-3">
//                     <div className="text-xs text-purple-300 font-mono truncate">{player.wallet}</div>
//                   </div>
//                   <div className="col-span-2 text-right">
//                     <div className="font-bold text-green-400">{player.points.toLocaleString()}</div>
//                   </div>
//                   <div className="col-span-2 text-center">
//                     <div className={`font-bold ${streakDisplay.color}`}>
//                       {streakDisplay.text}
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>

//         {/* Current Player Highlight - показуємо тільки якщо гравець не в топі */}
//         {currentPlayer.rank > (filteredPlayers.length > 0 ? Math.max(...filteredPlayers.map(p => p.rank)) : 0) && (
//           <div className="mt-4 p-3 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/50 rounded-xl">
//             <div className="grid grid-cols-12 gap-2 items-center">
//               <div className="col-span-1">
//                 <div className="w-6 h-6 bg-cyan-500 rounded flex items-center justify-center text-xs font-bold text-black">
//                   {currentPlayer.rank}
//                 </div>
//               </div>
//               <div className="col-span-4">
//                 <div className="flex items-center gap-1">
//                   {/* <span className="text-sm">{currentPlayer.avatar}</span> */}
//                   <div className="min-w-0">
//                     <div className="font-semibold text-cyan-300 text-sm flex items-center gap-1">
//                       {currentPlayer.name} ⭐
//                       {isOnline(currentPlayer.lastActive) && (
//                         <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
//                       )}
//                     </div>
//                     <div className="text-xs text-cyan-400">{getLastActiveText(currentPlayer.lastActive)}</div>
//                   </div>
//                 </div>
//               </div>
//               <div className="col-span-3">
//                 <div className="text-xs text-cyan-400 font-mono truncate">{currentPlayer.wallet}</div>
//               </div>
//               <div className="col-span-2 text-right">
//                 <div className="font-bold text-cyan-400">{currentPlayer.points.toLocaleString()}</div>
//               </div>
//               <div className="col-span-2 text-center">
//                 <div className="font-bold text-red-400">
//                   {getStreakDisplay(currentPlayer.streak).text}
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Empty State */}
//         {filteredPlayers.length === 0 && (
//           <div className="text-center py-8 text-purple-300">
//             <div className="text-4xl mb-2">👥</div>
//             <div>НЕМАЄ ГРАВЦІВ ОНЛАЙН</div>
//           </div>
//         )}

//         {/* Stats Bar */}
//         <div className="mt-4 bg-purple-800/30 rounded-lg p-2 text-center">
//           <div className="text-xs text-purple-300">
//             ГРАВЦІВ: <span className="text-purple-100 font-bold">{players.length + 1}</span> | 
//             ОНЛАЙН: <span className="text-green-400 font-bold">{onlineCount}</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


































//tic-tac-toe\src\app\components\ui\Leaderboard.tsx
'use client';

import { useState, useMemo } from 'react';
import { useLeaderboard } from '@/hooks/useLeaderboard';
import { PlayerStatsResponse } from '@/lib/api/leaderboardApi';
import { useTranslation } from '../../../lib/i18n';
import { LeaderboardPlayer } from '@/types/game';



function formatWallet(wallet: string): string {
  if (!wallet || wallet === 'Невідомо') return wallet;
  if (wallet.length <= 10) return wallet;
  return `${wallet.slice(0, 6)}...${wallet.slice(-6)}`;
}
//   {
//     id: 1,
//     name: 'Олександр_Крутий',
//     wins: 85,
//     losses: 12,
//     draws: 8,
//     points: 2340,
//     winRate: 80.95,
//     streak: 7,
//     rank: 1,
//     lastActive: '2025-08-28T15:30:00',
//     wallet: '0x54Dd...b251cB'
//   },
//   {
//     id: 2,
//     name: 'Марія_Переможниця',
//     wins: 72,
//     losses: 18,
//     draws: 6,
//     points: 2180,
//     winRate: 75.0,
//     streak: -2,
//     rank: 2,
//     lastActive: '2025-08-28T14:45:00',
//     wallet: '0x23Aa...c891dE'
//   },
//   {
//     id: 3,
//     name: 'Іван_Стратег',
//     wins: 64,
//     losses: 24,
//     draws: 12,
//     points: 1980,
//     winRate: 64.0,
//     streak: 3,
//     rank: 3,
//     lastActive: '2025-08-28T16:20:00',
//     wallet: '0x78Ff...d234eF'
//   },
//   {
//     id: 4,
//     name: 'Тетяна_Блискавка',
//     wins: 58,
//     losses: 28,
//     draws: 9,
//     points: 1850,
//     winRate: 61.05,
//     streak: 1,
//     rank: 4,
//     lastActive: '2025-08-28T13:15:00',
//     wallet: '0x45Cc...e567gH'
//   },
//   {
//     id: 5,
//     name: 'Максим_Тактик',
//     wins: 45,
//     losses: 22,
//     draws: 8,
//     points: 1720,
//     winRate: 60.0,
//     streak: -1,
//     rank: 5,
//     lastActive: '2025-08-28T12:30:00',
//     wallet: '0x89Bb...f890iJ'
//   },
//   {
//     id: 6,
//     name: 'Анна_Швидка',
//     wins: 42,
//     losses: 25,
//     draws: 5,
//     points: 1650,
//     winRate: 58.33,
//     streak: 2,
//     rank: 6,
//     lastActive: '2025-08-28T11:45:00',
//     wallet: '0x12Dd...g123kL'
//   },
//   {
//     id: 7,
//     name: 'Сергій_Мислитель',
//     wins: 38,
//     losses: 30,
//     draws: 7,
//     points: 1580,
//     winRate: 50.67,
//     streak: 0,
//     rank: 7,
//     lastActive: '2025-08-28T10:20:00',
//     wallet: '0x34Ee...h456mN'
//   },
//   {
//     id: 8,
//     name: 'Ольга_Майстер',
//     wins: 35,
//     losses: 28,
//     draws: 4,
//     points: 1520,
//     winRate: 52.24,
//     streak: 4,
//     rank: 8,
//     lastActive: '2025-08-28T16:45:00',
//     wallet: '0x56Ff...i789oP'
//   }
// ];

// const currentPlayer: Player = {
//   id: 99,
//   name: 'Myk',
//   wins: 2,
//   losses: 8,
//   draws: 0,
//   points: 20,
//   winRate: 20.0,
//   streak: -3,
//   rank: 11,
//   lastActive: '2025-08-28T16:50:00',
//   wallet: '0x54Dd...b251cB'
// };

type SortOption = 'points' | 'winRate' | 'wins' | 'streak';


interface LeaderboardProps {
  playerStats?: PlayerStatsResponse;
}

export default function Leaderboard({ playerStats }: LeaderboardProps) {

// export default function Leaderboard() {
  const [sortBy, setSortBy] = useState<SortOption>('points');
  const [showOnlyOnline, setShowOnlyOnline] = useState(false);

  // Використовуємо хук для глобальних даних
  const { data: globalData, loading, error, refetch } = useLeaderboard();

  const sortedPlayers = useMemo(() => {
    const dataToUse = globalData.length > 0 ? globalData : [];
    const sorted = [...dataToUse].sort((a, b) => {
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
    return sorted.map((player, index) => ({
      ...player,
      rank: index + 1
    }));
  }, [globalData, sortBy]);

  const filteredPlayers = showOnlyOnline 
  ? sortedPlayers.filter((player: LeaderboardPlayer) => isOnline(player.lastActive))
  : sortedPlayers;

  function isOnline(lastActive: string): boolean {
    const now = new Date();
    const lastActiveDate = new Date(lastActive);
    const diffMinutes = (now.getTime() - lastActiveDate.getTime()) / (1000 * 60);
    return diffMinutes < 30;
  }

  // Використовуємо дані з PlayerStatsResponse
  const currentPlayer: LeaderboardPlayer | null = playerStats?.user ? {
    id: playerStats.user.userId,
    name: playerStats.hasUsername ? playerStats.user.username : formatWallet(playerStats.user.walletAddress),
    wins: Math.floor((playerStats.stats?.score || 0) / 10),
    losses: Math.max(0, (playerStats.stats?.score || 0) - Math.floor((playerStats.stats?.score || 0) / 10)),
    draws: 0,
    points: playerStats.stats?.score || 0,
    winRate: playerStats.stats?.score ? Math.min(100, (Math.floor(playerStats.stats.score / 10) / Math.max(1, playerStats.stats.score)) * 100) : 0,
    streak: Math.random() > 0.5 ? Math.floor(Math.random() * 10) : -Math.floor(Math.random() * 5),
    rank: playerStats.stats?.rank || sortedPlayers.length + 1,
    lastActive: new Date().toISOString(),
    wallet: playerStats.user.walletAddress
  } : null;

  const onlineCount = sortedPlayers.filter((p: LeaderboardPlayer) => isOnline(p.lastActive)).length + (currentPlayer && isOnline(currentPlayer.lastActive) ? 1 : 0);
  const { t } = useTranslation();

  return (
    <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 rounded-2xl shadow-2xl overflow-hidden border border-purple-400/30">
      {/* Gaming Header */}
      <div className="bg-black/30 p-4 border-b border-purple-400/30">
        <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 text-center">
          {t.leaderboard.title}
        </h2>
      </div>

      <div className="p-4">

        {/* Помилка */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/20 rounded-lg border border-red-400/30">
            <span className="text-red-300 text-sm">❌ {error}</span>
          </div>
        )}

        {/* Futuristic Controls */}
        <div className="flex gap-2 mb-4">
          <label className="flex items-center gap-2 px-3 py-1 bg-purple-600/50 border border-purple-400/50 rounded-lg text-xs text-purple-200 hover:bg-purple-600/70 transition-all cursor-pointer">
            <input
              type="checkbox"
              name="online-filter"
              checked={showOnlyOnline}
              onChange={(e) => setShowOnlyOnline(e.target.checked)}
              className="w-3 h-3 text-green-500 bg-purple-700 border-purple-400 rounded focus:ring-green-400"
            />
            🟢 {t.leaderboard.online}
          </label>
          
          <select
            name="sort-by"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="px-3 py-1 bg-purple-600 border border-purple-400 rounded-lg text-xs text-white font-semibold focus:outline-none focus:ring-2 focus:ring-purple-300"
          >
            <option value="points">{t.leaderboard.points} ↓</option>
          </select>

          <button 
            onClick={refetch} 
            disabled={loading} 
            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 border border-blue-400 rounded-lg text-xs text-white font-semibold transition-all disabled:cursor-not-allowed"
          >
            {loading ? '⏳' : `🔄 ${t.leaderboard.refresh}`}
          </button>
        </div>

        {/* Cyber Table */}
        <div className="bg-black/20 rounded-xl p-2 border border-purple-500/30">
          <div className="grid grid-cols-12 gap-2 p-2 text-xs font-bold text-purple-300 border-b border-purple-500/30 mb-1">
            <div className="col-span-1">#</div>
            <div className="col-span-5">{t.leaderboard.player}</div>
            <div className="col-span-4">{t.leaderboard.wallet}</div>
            <div className="col-span-2 text-right">{t.leaderboard.points}</div>
          </div>
          
          <div className="space-y-1 max-h-96 overflow-y-auto">
            {filteredPlayers.map((player, index) => (
              <div key={player.id} className={`
                grid grid-cols-12 gap-2 items-center p-2 rounded-lg transition-all hover:bg-purple-500/20
                ${index < 3 ? 'bg-gradient-to-r' : 'bg-purple-800/20'}
                ${index === 0 ? 'from-yellow-500/20 to-yellow-600/20 border border-yellow-400/30' : ''}
                ${index === 1 ? 'from-gray-300/20 to-gray-400/20 border border-gray-400/30' : ''}
                ${index === 2 ? 'from-orange-500/20 to-orange-600/20 border border-orange-400/30' : ''}
              `}>
                <div className="col-span-1 pr-2">
                  <div className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold
                    ${index < 3 ? '' : 'bg-purple-600/50 text-purple-200'}
                    ${index === 0 ? 'bg-yellow-500 text-black' : ''}
                    ${index === 1 ? 'bg-gray-400 text-black' : ''}
                    ${index === 2 ? 'bg-orange-500 text-black' : ''}
                  `}>
                    {player.rank}
                  </div>
                </div>
                <div className="col-span-5 pl-2">
                  <div className="flex items-center gap-1">
                    <div className="min-w-0">
                      <div className="font-semibold text-white text-sm truncate flex items-center gap-1">
                        {player.name}
                        {isOnline(player.lastActive) && (
                          <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-span-4 relative overflow-hidden">
                  <div className="text-xs text-purple-300 font-mono relative">
                    <span className="block truncate pr-2">{formatWallet(player.wallet)}</span>
                    <div className="absolute top-0 right-0 w-4 h-full bg-gradient-to-l from-purple-900 via-purple-900/80 to-transparent pointer-events-none"></div>
                  </div>
                </div>
                <div className="col-span-2 text-right">
                  <div className="font-bold text-green-400">{(player.points || 0).toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Current Player Highlight */}
        {currentPlayer && currentPlayer.rank > (filteredPlayers.length > 0 ? Math.max(...filteredPlayers.map(p => p.rank)) : 0) && (
          <div className="mt-4 p-3 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/50 rounded-xl">
            <div className="grid grid-cols-12 gap-2 items-center">
              <div className="col-span-1 pr-2">
                <div className="w-6 h-6 bg-cyan-500 rounded flex items-center justify-center text-xs font-bold text-black">
                  {currentPlayer.rank}
                </div>
              </div>
              <div className="col-span-5 pl-2">
                <div className="flex items-center gap-1">
                  <div className="min-w-0">
                    <div className="font-semibold text-cyan-300 text-sm flex items-center gap-1">
                      {currentPlayer.name} ⭐
                      {isOnline(currentPlayer.lastActive) && (
                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-span-4">
                <div className="text-xs text-cyan-400 font-mono">{formatWallet(currentPlayer.wallet)}</div>
              </div>
              <div className="col-span-2 text-right">
                <div className="font-bold text-cyan-400">{currentPlayer.points.toLocaleString()}</div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredPlayers.length === 0 && (
          <div className="text-center py-8 text-purple-300">
            <div className="text-4xl mb-2">👥</div>
            <div>
            {loading ? `${t.leaderboard.loading}` : `${t.leaderboard.noPlayers}`}
            </div>
          </div>
        )}

        {/* Stats Bar */}
        <div className="mt-4 bg-purple-800/30 rounded-lg p-2 text-center">
          <div className="text-xs text-purple-300">
          {t.leaderboard.playersCount}: <span className="text-purple-100 font-bold">{sortedPlayers.length}</span>
            <span className="mx-2">|</span>
            {t.leaderboard.online}: <span className="text-green-400 font-bold">{onlineCount}</span>
            <span className="mx-2">|</span>
            {t.leaderboard.apiStatus}: <span className="text-green-400 font-bold">{t.leaderboard.connected}</span>
          </div>
        </div>
      </div>
    </div>
  );
}