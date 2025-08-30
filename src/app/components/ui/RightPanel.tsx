// 'use client';

// import { useState } from 'react';
// import WalletConnection from './WalletConnection';
// import ProfileSection from './ProfileSection';
// import ChatSection from './ChatSection';
// import Leaderboard from './Leaderboard';

// export default function RightPanel() {
//   const [activeTab, setActiveTab] = useState<'profile' | 'leaderboard' | 'chat'>('profile');

//   const tabs = [
//     { id: 'profile' as const, label: 'Профіль', icon: '👤' },
//     { id: 'leaderboard' as const, label: 'Лідерборд', icon: '🏆' },
//     { id: 'chat' as const, label: 'Чат', icon: '💬' },
//   ];

//   const renderContent = () => {
//     switch (activeTab) {
//       case 'profile':
//         return <ProfileSection />;
//       case 'leaderboard':
//         return <Leaderboard />;
//       case 'chat':
//         return <ChatSection />;
//       default:
//         return <ProfileSection />;
//     }
//   };

//   return (
//     <div className="space-y-4">
//       {/* Гаманець вгорі */}
//       <div className="relative bg-gradient-to-br from-gray-800/50 via-purple-800/50 to-gray-800/50 backdrop-blur-md rounded-3xl p-6 shadow-2xl z-[30] border border-purple-500/20">
//         <h2 className="text-2xl font-bold mb-4 text-center">💳 Гаманець</h2>
//         <WalletConnection />
//       </div>

//       {/* Панель з табами */}
//       <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 shadow-2xl">
//         {/* Таби */}
//         <div className="flex gap-1 mb-6 bg-white/10 rounded-2xl p-1">
//           {tabs.map((tab) => (
//             <button
//               key={tab.id}
//               onClick={() => setActiveTab(tab.id)}
//               className={`
//                 flex-1 py-3 px-2 rounded-xl font-medium transition-all duration-300 text-sm
//                 ${activeTab === tab.id
//                   ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
//                   : 'text-white/70 hover:text-white hover:bg-white/10'
//                 }
//               `}
//             >
//               <div className="flex flex-col items-center gap-1">
//                 <span className="text-lg">{tab.icon}</span>
//                 <span className="hidden sm:inline">{tab.label}</span>
//               </div>
//             </button>
//           ))}
//         </div>

//         {/* Контент */}
//         <div className="min-h-[400px]">
//           {renderContent()}
//         </div>
//       </div>
//     </div>
//   );
// }







// 'use client';

// import { useState } from 'react';
// import WalletConnection from './WalletConnection';
// import ProfileSection from './ProfileSection';
// import ChatSection from './ChatSection';
// import Leaderboard from './Leaderboard';

// export default function RightPanel() {
//   const [activeTab, setActiveTab] = useState<'profile' | 'leaderboard' | 'chat'>('profile');

//   const tabs = [
//     { id: 'profile' as const, label: 'Профіль', icon: '👤' },
//     { id: 'leaderboard' as const, label: 'Лідерборд', icon: '🏆' },
//     { id: 'chat' as const, label: 'Чат', icon: '💬' },
//   ];

//   const renderContent = () => {
//     switch (activeTab) {
//       case 'profile':
//         return <ProfileSection />;
//       case 'leaderboard':
//         return <Leaderboard />;
//       case 'chat':
//         return <ChatSection />;
//       default:
//         return <ProfileSection />;
//     }
//   };

//   return (
//     <div className="space-y-4">
//       {/* Гаманець вгорі */}
//       <div className="relative bg-gradient-to-br from-gray-800/50 via-purple-800/50 to-gray-800/50 backdrop-blur-md rounded-3xl p-6 shadow-2xl z-[30] border border-purple-500/20">
//         <h2 className="text-2xl font-bold mb-4 text-center">💳 Гаманець</h2>
//         <WalletConnection />
//       </div>

//       {/* Панель з табами */}
//       <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 shadow-2xl">
//         {/* Таби */}
//         <div className="flex gap-1 mb-6 bg-white/10 rounded-2xl p-1">
//           {tabs.map((tab) => (
//             <button
//               key={tab.id}
//               onClick={() => setActiveTab(tab.id)}
//               className={`
//                 flex-1 py-2 px-2 rounded-xl font-medium transition-all duration-300 text-sm
//                 ${activeTab === tab.id
//                   ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
//                   : 'text-white/70 hover:text-white hover:bg-white/10'
//                 }
//               `}
//             >
//               <div className="flex items-center justify-center gap-1">
//                 <span className="text-base">{tab.icon}</span>
//                 <span className="hidden sm:inline text-xs">{tab.label}</span>
//               </div>
//             </button>
//           ))}
//         </div>

//         {/* Контент */}
//         <div className="min-h-[400px]">
//           {renderContent()}
//         </div>
//       </div>
//     </div>
//   );
// }























// // src/app/sections/RightPanel.tsx
// 'use client';

// import { useState } from 'react';
// import { useTranslation } from '../../../lib/i18n';
// import WalletConnection from './WalletConnection';
// import ProfileSection from './ProfileSection';
// import ChatSection from './ChatSection';
// import Leaderboard from './Leaderboard';

// export default function RightPanel() {
//   const { t } = useTranslation();
//   const [activeTab, setActiveTab] = useState<'profile' | 'leaderboard' | 'chat'>('profile');

//   const tabs = [
//     { id: 'profile' as const, label: t.tabs.profile, icon: '👤' },
//     { id: 'leaderboard' as const, label: t.tabs.leaderboard, icon: '🏆' },
//     { id: 'chat' as const, label: t.tabs.chat, icon: '💬' },
//   ];

//   const renderContent = () => {
//     switch (activeTab) {
//       case 'profile':
//         return <ProfileSection />;
//       case 'leaderboard':
//         return <Leaderboard />;
//       case 'chat':
//         return <ChatSection />;
//       default:
//         return <ProfileSection />;
//     }
//   };

//   return (
//     <div className="space-y-4">
//       {/* Гаманець вгорі */}
//       <div className="relative bg-gradient-to-br from-gray-800/50 via-purple-800/50 to-gray-800/50 backdrop-blur-md rounded-3xl p-6 shadow-2xl z-[30] border border-purple-500/20">
//         <h2 className="text-2xl font-bold mb-4 text-center">{t.wallet.title}</h2>
//         <WalletConnection />
//       </div>

//       {/* Панель з табами */}
//       <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 shadow-2xl">
//         {/* Таби */}
//         <div className="flex gap-1 mb-6 bg-white/10 rounded-2xl p-1">
//           {tabs.map((tab) => (
//             <button
//               key={tab.id}
//               onClick={() => setActiveTab(tab.id)}
//               className={`
//                 flex-1 py-2 px-2 rounded-xl font-medium transition-all duration-300 text-sm
//                 ${activeTab === tab.id
//                   ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
//                   : 'text-white/70 hover:text-white hover:bg-white/10'
//                 }
//               `}
//             >
//               <div className="flex items-center justify-center gap-1">
//                 <span className="text-base">{tab.icon}</span>
//                 <span className="hidden sm:inline text-xs">{tab.label}</span>
//               </div>
//             </button>
//           ))}
//         </div>

//         {/* Контент */}
//         <div className="min-h-[400px]">
//           {renderContent()}
//         </div>
//       </div>
//     </div>
//   );
// }






























// src/app/sections/RightPanel.tsx
'use client';

import { useState, useMemo, memo } from 'react';
import { useTranslation } from '../../../lib/i18n';
import WalletConnection from './WalletConnection';
import ProfileSection from './ProfileSection';
import ChatSection from './ChatSection';
import Leaderboard from './Leaderboard';

const MemoizedLeaderboard = memo(() => <Leaderboard />);
MemoizedLeaderboard.displayName = 'MemoizedLeaderboard';

export default function RightPanel() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'profile' | 'leaderboard' | 'chat'>('leaderboard');

  const tabs = [
    { id: 'leaderboard' as const, label: t.tabs.leaderboard, icon: '🏆' },
    { id: 'profile' as const, label: t.tabs.profile, icon: '👤' },
    { id: 'chat' as const, label: t.tabs.chat, icon: '💬' },
  ];

  // Мемоізуйте renderContent
  const renderContent = useMemo(() => {
    switch (activeTab) {
      case 'leaderboard':
        return <MemoizedLeaderboard />;
      case 'profile':
        return <ProfileSection />;
      case 'chat':
        return <ChatSection />;
      default:
        return <MemoizedLeaderboard />;
    }
  }, [activeTab]);

  return (
    <div className="space-y-3 lg:space-y-4"> {/* Менше відступів на мобільній */}
      {/* Гаманець вгорі */}
      <div className="relative bg-gradient-to-br from-gray-800/50 via-purple-800/50 to-gray-800/50 backdrop-blur-md rounded-3xl p-4 lg:p-6 shadow-2xl z-[30] border border-purple-500/20">
        {/* Приховуємо заголовок на мобільній версії */}
        <h2 className="hidden text-2xl font-bold mb-4 text-center">{t.wallet.title}</h2>
        {/* <h2 className="hidden lg:block text-2xl font-bold mb-4 text-center">{t.wallet.title}</h2> */}
        <WalletConnection />
      </div>

      {/* Панель з табами */}
      <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 shadow-2xl">
        {/* Таби */}
        <div className="flex gap-1 mb-6 bg-white/10 rounded-2xl p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex-1 py-2 px-2 rounded-xl font-medium transition-all duration-300 text-sm
                ${activeTab === tab.id
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
                }
              `}
            >
              <div className="flex items-center justify-center gap-1">
                <span className="text-base">{tab.icon}</span>
                <span className="hidden md:inline text-xs">{tab.label}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Контент */}
        <div className="min-h-[400px]">
          {renderContent}
        </div>
      </div>
    </div>
  );
}