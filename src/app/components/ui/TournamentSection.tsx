// 'use client';

// import { useState } from 'react';

// interface Tournament {
//   id: number;
//   name: string;
//   mode: 'classic' | 'pro';
//   participants: number;
//   maxParticipants: number;
//   prizePool: number;
//   status: 'upcoming' | 'active' | 'finished';
//   startTime: string;
// }

// const mockTournaments: Tournament[] = [
//   {
//     id: 1,
//     name: 'Весняний кубок',
//     mode: 'classic',
//     participants: 12,
//     maxParticipants: 16,
//     prizePool: 1000,
//     status: 'active',
//     startTime: '2025-06-26T18:00:00'
//   },
//   {
//     id: 2,
//     name: 'Профі чемпіонат',
//     mode: 'pro',
//     participants: 8,
//     maxParticipants: 12,
//     prizePool: 2500,
//     status: 'upcoming',
//     startTime: '2025-06-27T20:00:00'
//   },
//   {
//     id: 3,
//     name: 'Літній турнір',
//     mode: 'classic',
//     participants: 16,
//     maxParticipants: 16,
//     prizePool: 1500,
//     status: 'finished',
//     startTime: '2025-06-25T16:00:00'
//   }
// ];

// export default function TournamentSection() {
//   const [selectedTab, setSelectedTab] = useState<'all' | 'active' | 'upcoming'>('all');
//   const [registeredTournaments, setRegisteredTournaments] = useState<number[]>([]);

//   const filteredTournaments = mockTournaments.filter(tournament => {
//     if (selectedTab === 'all') return true;
//     return tournament.status === selectedTab;
//   });

//   const handleRegister = (tournamentId: number) => {
//     if (!registeredTournaments.includes(tournamentId)) {
//       setRegisteredTournaments([...registeredTournaments, tournamentId]);
//     }
//   };

//   const getStatusIcon = (status: Tournament['status']) => {
//     switch (status) {
//       case 'active': return '🔴';
//       case 'upcoming': return '🟡';
//       case 'finished': return '🏁';
//       default: return '⚪';
//     }
//   };

//   const getStatusText = (status: Tournament['status']) => {
//     switch (status) {
//       case 'active': return 'Активний';
//       case 'upcoming': return 'Очікується';
//       case 'finished': return 'Завершено';
//       default: return 'Невідомо';
//     }
//   };

//   const getModeIcon = (mode: Tournament['mode']) => {
//     return mode === 'classic' ? '🎲' : '🏆';
//   };

//   const formatTime = (timeString: string) => {
//     const date = new Date(timeString);
//     return date.toLocaleString('uk-UA', {
//       day: '2-digit',
//       month: '2-digit',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   return (
//     <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 shadow-2xl">
//       <h2 className="text-3xl font-bold mb-6 text-center">🏆 Турніри</h2>
      
//       {/* Вкладки фільтрів */}
//       <div className="flex gap-2 mb-6 bg-white/10 rounded-2xl p-2">
//         {[
//           { key: 'all' as const, label: 'Всі', icon: '📋' },
//           { key: 'active' as const, label: 'Активні', icon: '🔴' },
//           { key: 'upcoming' as const, label: 'Майбутні', icon: '🟡' }
//         ].map((tab) => (
//           <button
//             key={tab.key}
//             onClick={() => setSelectedTab(tab.key)}
//             className={`
//               flex-1 py-2 px-3 rounded-xl font-medium transition-all duration-300
//               ${selectedTab === tab.key
//                 ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
//                 : 'text-white/70 hover:text-white hover:bg-white/10'
//               }
//             `}
//           >
//             {tab.icon} {tab.label}
//           </button>
//         ))}
//       </div>

//       {/* Список турнірів */}
//       <div className="space-y-4 max-h-96 overflow-y-auto">
//         {filteredTournaments.map((tournament) => (
//           <div key={tournament.id} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
//             <div className="flex items-start justify-between mb-3">
//               <div>
//                 <h3 className="font-bold text-lg flex items-center gap-2">
//                   {getModeIcon(tournament.mode)} {tournament.name}
//                 </h3>
//                 <div className="flex items-center gap-2 text-sm text-white/70 mt-1">
//                   {getStatusIcon(tournament.status)} {getStatusText(tournament.status)}
//                 </div>
//               </div>
//               <div className="text-right">
//                 <div className="text-sm text-white/70">Призовий фонд</div>
//                 <div className="font-bold text-yellow-400">{tournament.prizePool}₴</div>
//               </div>
//             </div>

//             <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
//               <div>
//                 <div className="text-white/70">Учасники</div>
//                 <div className="font-medium">
//                   {tournament.participants}/{tournament.maxParticipants}
//                 </div>
//               </div>
//               <div>
//                 <div className="text-white/70">Початок</div>
//                 <div className="font-medium">{formatTime(tournament.startTime)}</div>
//               </div>
//             </div>

//             {/* Прогрес бар учасників */}
//             <div className="mb-4">
//               <div className="bg-white/20 rounded-full h-2 mb-2">
//                 <div 
//                   className="bg-gradient-to-r from-green-400 to-green-500 h-2 rounded-full transition-all duration-500"
//                   style={{ width: `${(tournament.participants / tournament.maxParticipants) * 100}%` }}
//                 />
//               </div>
//             </div>

//             {/* Кнопка реєстрації */}
//             {tournament.status === 'upcoming' && (
//               <button
//                 onClick={() => handleRegister(tournament.id)}
//                 disabled={registeredTournaments.includes(tournament.id) || tournament.participants >= tournament.maxParticipants}
//                 className={`
//                   w-full py-2 px-4 rounded-xl font-medium transition-all duration-300
//                   ${registeredTournaments.includes(tournament.id)
//                     ? 'bg-green-500/50 text-white cursor-default'
//                     : tournament.participants >= tournament.maxParticipants
//                     ? 'bg-gray-500/50 text-white/50 cursor-not-allowed'
//                     : 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white hover:shadow-lg transform hover:-translate-y-0.5'
//                   }
//                 `}
//               >
//                 {registeredTournaments.includes(tournament.id)
//                   ? '✅ Зареєстровано'
//                   : tournament.participants >= tournament.maxParticipants
//                   ? '❌ Місць немає'
//                   : '📝 Зареєструватись'
//                 }
//               </button>
//             )}

//             {tournament.status === 'active' && (
//               <button className="w-full py-2 px-4 rounded-xl font-medium bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5">
//                 🎮 Дивитись матч
//               </button>
//             )}

//             {tournament.status === 'finished' && (
//               <button className="w-full py-2 px-4 rounded-xl font-medium bg-gradient-to-r from-gray-500 to-gray-600 text-white">
//                 📊 Результати
//               </button>
//             )}
//           </div>
//         ))}
//       </div>

//       {filteredTournaments.length === 0 && (
//         <div className="text-center py-8 text-white/60">
//           <div className="text-4xl mb-2">🔍</div>
//           <div>Турнірів у цій категорії немає</div>
//         </div>
//       )}
//     </div>
//   );
// }































// src/app/sections/TournamentSection.tsx
'use client';

import { useState } from 'react';
import { useTranslation } from '../../../lib/i18n';

interface Tournament {
  id: number;
  name: string;
  nameKey: string; // Додаємо ключ для перекладу
  mode: 'classic' | 'pro';
  participants: number;
  maxParticipants: number;
  prizePool: number;
  status: 'upcoming' | 'active' | 'finished';
  startTime: string;
}

const mockTournaments: Tournament[] = [
  {
    id: 1,
    name: 'Весняний кубок',
    nameKey: 'springCup',
    mode: 'classic',
    participants: 12,
    maxParticipants: 16,
    prizePool: 1000,
    status: 'active',
    startTime: '2025-06-26T18:00:00'
  },
  {
    id: 2,
    name: 'Профі чемпіонат',
    nameKey: 'proChampionship',
    mode: 'pro',
    participants: 8,
    maxParticipants: 12,
    prizePool: 2500,
    status: 'upcoming',
    startTime: '2025-06-27T20:00:00'
  },
  {
    id: 3,
    name: 'Літній турнір',
    nameKey: 'summerTournament',
    mode: 'classic',
    participants: 16,
    maxParticipants: 16,
    prizePool: 1500,
    status: 'finished',
    startTime: '2025-06-25T16:00:00'
  }
];

export default function TournamentSection() {
  const { t } = useTranslation();
  const [selectedTab, setSelectedTab] = useState<'all' | 'active' | 'upcoming'>('all');
  const [registeredTournaments, setRegisteredTournaments] = useState<number[]>([]);

  const filteredTournaments = mockTournaments.filter(tournament => {
    if (selectedTab === 'all') return true;
    return tournament.status === selectedTab;
  });

  const handleRegister = (tournamentId: number) => {
    if (!registeredTournaments.includes(tournamentId)) {
      setRegisteredTournaments([...registeredTournaments, tournamentId]);
    }
  };

  const getStatusIcon = (status: Tournament['status']) => {
    switch (status) {
      case 'active': return '🔴';
      case 'upcoming': return '🟡';
      case 'finished': return '🏁';
      default: return '⚪';
    }
  };

  const getStatusText = (status: Tournament['status']) => {
    switch (status) {
      case 'active': return t.tournaments.active_status;
      case 'upcoming': return t.tournaments.expected;
      case 'finished': return 'Завершено'; // Додайте до перекладів якщо потрібно
      default: return 'Невідомо';
    }
  };

  const getTournamentName = (tournament: Tournament) => {
    // Перевіряємо чи є переклад для цього турніру
    const translationKey = tournament.nameKey as keyof typeof t.tournaments;
    if (t.tournaments[translationKey]) {
      return t.tournaments[translationKey] as string;
    }
    // Fallback на оригінальну назву
    return tournament.name;
  };

  const getModeIcon = (mode: Tournament['mode']) => {
    return mode === 'classic' ? '🎲' : '🏆';
  };

  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    return date.toLocaleString('uk-UA', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 shadow-2xl">
      <h2 className="text-3xl font-bold mb-6 text-center">{t.tournaments.title}</h2>
      
      {/* Вкладки фільтрів */}
      <div className="flex gap-2 mb-6 bg-white/10 rounded-2xl p-2">
        {[
          { key: 'all' as const, label: t.tournaments.all, icon: '📋' },
          { key: 'active' as const, label: t.tournaments.active, icon: '🔴' },
          { key: 'upcoming' as const, label: t.tournaments.upcoming, icon: '🟡' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setSelectedTab(tab.key)}
            className={`
              flex-1 py-2 px-3 rounded-xl font-medium transition-all duration-300
              ${selectedTab === tab.key
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                : 'text-white/70 hover:text-white hover:bg-white/10'
              }
            `}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Список турнірів */}
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {filteredTournaments.map((tournament) => (
          <div key={tournament.id} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-bold text-lg flex items-center gap-2">
                  {getModeIcon(tournament.mode)} {getTournamentName(tournament)}
                </h3>
                <div className="flex items-center gap-2 text-sm text-white/70 mt-1">
                  {getStatusIcon(tournament.status)} {getStatusText(tournament.status)}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-white/70">{t.tournaments.prizePool}</div>
                <div className="font-bold text-yellow-400">{tournament.prizePool}₴</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
              <div>
                <div className="text-white/70">{t.tournaments.participants}</div>
                <div className="font-medium">
                  {tournament.participants}/{tournament.maxParticipants}
                </div>
              </div>
              <div>
                <div className="text-white/70">{t.tournaments.start}</div>
                <div className="font-medium">{formatTime(tournament.startTime)}</div>
              </div>
            </div>

            {/* Прогрес бар учасників */}
            <div className="mb-4">
              <div className="bg-white/20 rounded-full h-2 mb-2">
                <div 
                  className="bg-gradient-to-r from-green-400 to-green-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(tournament.participants / tournament.maxParticipants) * 100}%` }}
                />
              </div>
            </div>

            {/* Кнопка реєстрації */}
            {tournament.status === 'upcoming' && (
              <button
                onClick={() => handleRegister(tournament.id)}
                disabled={registeredTournaments.includes(tournament.id) || tournament.participants >= tournament.maxParticipants}
                className={`
                  w-full py-2 px-4 rounded-xl font-medium transition-all duration-300
                  ${registeredTournaments.includes(tournament.id)
                    ? 'bg-green-500/50 text-white cursor-default'
                    : tournament.participants >= tournament.maxParticipants
                    ? 'bg-gray-500/50 text-white/50 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white hover:shadow-lg transform hover:-translate-y-0.5'
                  }
                `}
              >
                {registeredTournaments.includes(tournament.id)
                  ? '✅ Зареєстровано'
                  : tournament.participants >= tournament.maxParticipants
                  ? '❌ Місць немає'
                  : t.tournaments.register
                }
              </button>
            )}

            {tournament.status === 'active' && (
              <button className="w-full py-2 px-4 rounded-xl font-medium bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5">
                {t.tournaments.watchMatch}
              </button>
            )}

            {tournament.status === 'finished' && (
              <button className="w-full py-2 px-4 rounded-xl font-medium bg-gradient-to-r from-gray-500 to-gray-600 text-white">
                {t.tournaments.results}
              </button>
            )}
          </div>
        ))}
      </div>

      {filteredTournaments.length === 0 && (
        <div className="text-center py-8 text-white/60">
          <div className="text-4xl mb-2">🔍</div>
          <div>Турнірів у цій категорії немає</div>
        </div>
      )}
    </div>
  );
}