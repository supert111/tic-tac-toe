// 'use client';

// import { useState } from 'react';

// export default function ProfileSection() {
//   const [userName, setUserName] = useState('Олександр_Крутий');
//   const [isEditingName, setIsEditingName] = useState(false);
//   const [tempName, setTempName] = useState(userName);
//   const [avatar, setAvatar] = useState('👑');

//   const handleNameSave = () => {
//     if (tempName.trim()) {
//       setUserName(tempName.trim());
//       setIsEditingName(false);
//     }
//   };

//   const handleNameCancel = () => {
//     setTempName(userName);
//     setIsEditingName(false);
//   };

//   const handleAvatarChange = (newAvatar: string) => {
//     setAvatar(newAvatar);
//   };

//   const availableAvatars = ['👑', '🔥', '🧠', '⚡', '🎯', '🚀', '🤔', '💎', '🏆', '🌟', '💪', '🎮'];

//   return (
//     <div className="space-y-6">
//       {/* Аватар */}
//       <div className="text-center">
//         <div className="relative inline-block">
//           <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-4xl mb-4 shadow-lg">
//             {avatar}
//           </div>
//           <button 
//             className="absolute -bottom-1 -right-1 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-xs hover:bg-white/30 transition-colors"
//             onClick={() => {
//               const randomAvatar = availableAvatars[Math.floor(Math.random() * availableAvatars.length)];
//               handleAvatarChange(randomAvatar);
//             }}
//           >
//             📸
//           </button>
//         </div>
        
//         {/* Вибір аватара */}
//         <div className="grid grid-cols-6 gap-2 max-w-xs mx-auto">
//           {availableAvatars.map((ava) => (
//             <button
//               key={ava}
//               onClick={() => handleAvatarChange(ava)}
//               className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg transition-all duration-200 ${
//                 avatar === ava 
//                   ? 'bg-purple-500/50 border-2 border-purple-400' 
//                   : 'bg-white/10 hover:bg-white/20 border border-white/20'
//               }`}
//             >
//               {ava}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Ім'я */}
//       <div className="bg-white/10 rounded-xl p-4">
//         <div className="flex items-center justify-between mb-2">
//           <span className="text-sm text-white/70">📝 Ім'я:</span>
//           {!isEditingName && (
//             <button
//               onClick={() => setIsEditingName(true)}
//               className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
//             >
//               Редагувати
//             </button>
//           )}
//         </div>
        
//         {isEditingName ? (
//           <div className="space-y-2">
//             <input
//               type="text"
//               value={tempName}
//               onChange={(e) => setTempName(e.target.value)}
//               className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400"
//               placeholder="Введіть ім'я"
//               maxLength={20}
//             />
//             <div className="flex gap-2">
//               <button
//                 onClick={handleNameSave}
//                 className="flex-1 bg-green-500/20 hover:bg-green-500/30 text-green-300 px-3 py-1 rounded-lg text-sm transition-colors"
//               >
//                 ✅ Зберегти
//               </button>
//               <button
//                 onClick={handleNameCancel}
//                 className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-300 px-3 py-1 rounded-lg text-sm transition-colors"
//               >
//                 ❌ Скасувати
//               </button>
//             </div>
//           </div>
//         ) : (
//           <div className="font-medium text-white">{userName}</div>
//         )}
//       </div>

//       {/* Баланс */}
//       <div className="bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border border-yellow-500/30 rounded-xl p-4">
//         <div className="flex items-center justify-between">
//           <span className="text-sm text-white/70">💰 Баланс:</span>
//           <div className="text-right">
//             <div className="font-bold text-yellow-400 text-lg">2340</div>
//             <div className="text-xs text-white/60">монет</div>
//           </div>
//         </div>
//       </div>

//       {/* Статистика */}
//       <div className="bg-white/10 rounded-xl p-4">
//         <h3 className="font-semibold mb-3 text-center">📊 Моя статистика</h3>
//         <div className="grid grid-cols-2 gap-3 text-sm">
//           <div className="text-center">
//             <div className="text-green-400 font-bold text-lg">85</div>
//             <div className="text-white/60">Перемоги</div>
//           </div>
//           <div className="text-center">
//             <div className="text-red-400 font-bold text-lg">12</div>
//             <div className="text-white/60">Поразки</div>
//           </div>
//           <div className="text-center">
//             <div className="text-yellow-400 font-bold text-lg">8</div>
//             <div className="text-white/60">Нічиї</div>
//           </div>
//           <div className="text-center">
//             <div className="text-blue-400 font-bold text-lg">+7</div>
//             <div className="text-white/60">Серія</div>
//           </div>
//         </div>
        
//         <div className="mt-3 text-center">
//           <div className="text-sm text-white/70">Відсоток перемог</div>
//           <div className="font-bold text-blue-400">81.0%</div>
//           <div className="bg-white/20 rounded-full h-2 mt-1">
//             <div className="bg-gradient-to-r from-blue-400 to-blue-500 h-2 rounded-full" style={{ width: '81%' }}></div>
//           </div>
//         </div>
//       </div>

//       {/* Налаштування */}
//       <div className="bg-white/10 rounded-xl p-4">
//         <h3 className="font-semibold mb-3 text-center">⚙️ Налаштування</h3>
//         <div className="space-y-3">
//           <div className="flex items-center justify-between">
//             <span className="text-sm">🔊 Звук</span>
//             <button className="w-10 h-6 bg-green-500 rounded-full relative">
//               <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1 transition-all duration-200"></div>
//             </button>
//           </div>
//           <div className="flex items-center justify-between">
//             <span className="text-sm">🎵 Музика</span>
//             <button className="w-10 h-6 bg-gray-500 rounded-full relative">
//               <div className="w-4 h-4 bg-white rounded-full absolute top-1 left-1 transition-all duration-200"></div>
//             </button>
//           </div>
//           <div className="flex items-center justify-between">
//             <span className="text-sm">🌙 Темна тема</span>
//             <button className="w-10 h-6 bg-green-500 rounded-full relative">
//               <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1 transition-all duration-200"></div>
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }





































// 'use client';

// import { useState } from 'react';

// export default function ProfileSection() {
//   const [userName, setUserName] = useState('Олександр_Крутий');
//   const [isEditingName, setIsEditingName] = useState(false);
//   const [tempName, setTempName] = useState(userName);
//   const [avatar, setAvatar] = useState<string | null>(null);
//   const [walletAddress] = useState('0x1234...5678'); // Приклад адреси
//   const [isWalletVerified] = useState(true);
//   const [theme, setTheme] = useState<'purple' | 'blue' | 'green'>('purple');

//   const handleNameSave = () => {
//     if (tempName.trim()) {
//       setUserName(tempName.trim());
//       setIsEditingName(false);
//     }
//   };

//   const handleNameCancel = () => {
//     setTempName(userName);
//     setIsEditingName(false);
//   };

//   const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = (event) => {
//         setAvatar(event.target?.result as string);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const themeColors = {
//     purple: { bg: 'from-purple-500 to-purple-600', border: 'border-purple-400' },
//     blue: { bg: 'from-blue-500 to-blue-600', border: 'border-blue-400' },
//     green: { bg: 'from-green-500 to-green-600', border: 'border-green-400' }
//   };

//   return (
//     <div className="space-y-4">
//       {/* Заголовок */}
//       <div className="text-center">
//         <h2 className="text-xl font-bold">👤 Мій профіль</h2>
//       </div>

//       {/* Аватар */}
//       <div className="bg-white/10 rounded-xl p-4">
//         <div className="flex items-center gap-4">
//           <div className="relative">
//             <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg">
//               {avatar ? (
//                 <img 
//                   src={avatar} 
//                   alt="Avatar" 
//                   className="w-full h-full object-cover"
//                 />
//               ) : (
//                 <span className="text-2xl">👤</span>
//               )}
//             </div>
//             <input
//               type="file"
//               accept="image/*"
//               onChange={handleAvatarUpload}
//               className="absolute inset-0 opacity-0 cursor-pointer"
//               id="avatar-upload"
//             />
//           </div>
//           <div className="flex-1">
//             <span className="text-sm text-white/70">📸 Аватар</span>
//             <label 
//               htmlFor="avatar-upload"
//               className="block mt-1 text-sm text-blue-400 hover:text-blue-300 cursor-pointer transition-colors"
//             >
//               Редагувати
//             </label>
//           </div>
//         </div>
//       </div>

//       {/* Ім'я */}
//       <div className="bg-white/10 rounded-xl p-4">
//         <div className="flex items-center justify-between mb-2">
//           <div className="flex items-center gap-2">
//             <span className="text-sm text-white/70">📝 Ім'я:</span>
//             {isWalletVerified && (
//               <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full border border-green-500/30">
//                 ✅ Verified
//               </span>
//             )}
//           </div>
//           {!isEditingName && (
//             <button
//               onClick={() => setIsEditingName(true)}
//               className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
//             >
//               Редагувати
//             </button>
//           )}
//         </div>
        
//         {isEditingName ? (
//           <div className="space-y-2">
//             <input
//               type="text"
//               value={tempName}
//               onChange={(e) => setTempName(e.target.value)}
//               className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
//               placeholder="Введіть ім'я"
//               maxLength={20}
//             />
//             <div className="flex gap-2">
//               <button
//                 onClick={handleNameSave}
//                 className="flex-1 bg-green-500/20 hover:bg-green-500/30 text-green-300 px-3 py-1 rounded-lg text-sm transition-colors"
//               >
//                 ✅ Зберегти
//               </button>
//               <button
//                 onClick={handleNameCancel}
//                 className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-300 px-3 py-1 rounded-lg text-sm transition-colors"
//               >
//                 ❌ Скасувати
//               </button>
//             </div>
//           </div>
//         ) : (
//           <div>
//             <div className="font-medium text-white">{userName}</div>
//             {isWalletVerified && (
//               <div className="text-xs text-white/50 mt-1">{walletAddress}</div>
//             )}
//           </div>
//         )}
//       </div>

//       {/* Баланс */}
//       <div className="bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border border-yellow-500/30 rounded-xl p-4">
//         <div className="flex items-center justify-between">
//           <span className="text-sm text-white/70">💰 Баланс:</span>
//           <div className="text-right">
//             <div className="font-bold text-yellow-400 text-lg">2340</div>
//             <div className="text-xs text-white/60">монет</div>
//           </div>
//         </div>
//       </div>

//       {/* Статистика */}
//       <div className="bg-white/10 rounded-xl p-4">
//         <h3 className="font-semibold mb-3 text-center">📊 Статистика</h3>
//         <div className="grid grid-cols-2 gap-3 text-sm">
//           <div className="text-center">
//             <div className="text-green-400 font-bold text-lg">85</div>
//             <div className="text-white/60">Перемоги</div>
//           </div>
//           <div className="text-center">
//             <div className="text-red-400 font-bold text-lg">12</div>
//             <div className="text-white/60">Поразки</div>
//           </div>
//           <div className="text-center">
//             <div className="text-yellow-400 font-bold text-lg">8</div>
//             <div className="text-white/60">Нічиї</div>
//           </div>
//           <div className="text-center">
//             <div className="text-blue-400 font-bold text-lg">+7</div>
//             <div className="text-white/60">Серія</div>
//           </div>
//         </div>
        
//         <div className="mt-3 text-center">
//           <div className="text-sm text-white/70">Відсоток перемог</div>
//           <div className="font-bold text-blue-400">81.0%</div>
//           <div className="bg-white/20 rounded-full h-2 mt-1">
//             <div className="bg-gradient-to-r from-blue-400 to-blue-500 h-2 rounded-full" style={{ width: '81%' }}></div>
//           </div>
//         </div>
//       </div>

//       {/* Налаштування теми */}
//       <div className="bg-white/10 rounded-xl p-4">
//         <h3 className="font-semibold mb-3 text-center">⚙️ Налаштування</h3>
//         <div className="flex items-center justify-center gap-3">
//           <button
//             onClick={() => setTheme('purple')}
//             className={`w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 transition-all duration-200 ${
//               theme === 'purple' 
//                 ? 'ring-2 ring-purple-400 ring-offset-2 ring-offset-transparent scale-110' 
//                 : 'hover:scale-105'
//             }`}
//           />
//           <button
//             onClick={() => setTheme('blue')}
//             className={`w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 transition-all duration-200 ${
//               theme === 'blue' 
//                 ? 'ring-2 ring-blue-400 ring-offset-2 ring-offset-transparent scale-110' 
//                 : 'hover:scale-105'
//             }`}
//           />
//           <button
//             onClick={() => setTheme('green')}
//             className={`w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-green-600 transition-all duration-200 ${
//               theme === 'green' 
//                 ? 'ring-2 ring-green-400 ring-offset-2 ring-offset-transparent scale-110' 
//                 : 'hover:scale-105'
//             }`}
//           />
//         </div>
//         <div className="text-center mt-2 text-sm text-white/60">
//           Оберіть колір теми
//         </div>
//       </div>
//     </div>
//   );
// }





















// 'use client';

// import { useState } from 'react';

// export default function ProfileSection() {
//   const [userName, setUserName] = useState('Олександр_Крутий');
//   const [isEditingName, setIsEditingName] = useState(false);
//   const [tempName, setTempName] = useState(userName);
//   const [avatar, setAvatar] = useState<string | null>(null);
//   const [walletAddress] = useState('0x1234...5678'); // Приклад адреси
//   const [isWalletVerified] = useState(true);
//   const [theme, setTheme] = useState<'purple' | 'blue' | 'green'>('purple');

//   const handleNameSave = () => {
//     if (tempName.trim()) {
//       setUserName(tempName.trim());
//       setIsEditingName(false);
//     }
//   };

//   const handleNameCancel = () => {
//     setTempName(userName);
//     setIsEditingName(false);
//   };

//   const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = (event) => {
//         setAvatar(event.target?.result as string);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const themeColors = {
//     purple: { bg: 'from-purple-500 to-purple-600', border: 'border-purple-400' },
//     blue: { bg: 'from-blue-500 to-blue-600', border: 'border-blue-400' },
//     green: { bg: 'from-green-500 to-green-600', border: 'border-green-400' }
//   };

//   return (
//     <div className="space-y-4">
//       {/* Заголовок */}
//       <div className="text-center">
//         <h2 className="text-xl font-bold">👤 Мій профіль</h2>
//       </div>

//       {/* Аватар з балансом */}
//       <div className="bg-white/10 rounded-xl p-4">
//         <div className="flex items-center gap-4">
//           <div className="relative">
//             <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg">
//               {avatar ? (
//                 <img 
//                   src={avatar} 
//                   alt="Avatar" 
//                   className="w-full h-full object-cover"
//                 />
//               ) : (
//                 <span className="text-2xl">👤</span>
//               )}
//             </div>
//             <input
//               type="file"
//               accept="image/*"
//               onChange={handleAvatarUpload}
//               className="absolute inset-0 opacity-0 cursor-pointer"
//               id="avatar-upload"
//             />
//           </div>
//           <div className="flex-1">
//             <div className="flex items-center justify-between">
//               <div>
//                 <span className="text-sm text-white/70">📸 Аватар</span>
//                 <label 
//                   htmlFor="avatar-upload"
//                   className="block mt-1 text-sm text-blue-400 hover:text-blue-300 cursor-pointer transition-colors"
//                 >
//                   Редагувати
//                 </label>
//               </div>
//               <div className="text-right">
//                 <div className="text-sm text-white/70">💰 Баланс:</div>
//                 <div className="font-bold text-yellow-400 text-lg">2340</div>
//                 <div className="text-xs text-white/60">монет</div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Ім'я */}
//       <div className="bg-white/10 rounded-xl p-4">
//         <div className="flex items-center justify-between mb-2">
//           <div className="flex items-center gap-2">
//             <span className="text-sm text-white/70">📝 Ім'я:</span>
//             {isWalletVerified && (
//               <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full border border-green-500/30">
//                 ✅ Verified
//               </span>
//             )}
//           </div>
//           {!isEditingName && (
//             <button
//               onClick={() => setIsEditingName(true)}
//               className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
//             >
//               Редагувати
//             </button>
//           )}
//         </div>
        
//         {isEditingName ? (
//           <div className="space-y-2">
//             <input
//               type="text"
//               value={tempName}
//               onChange={(e) => setTempName(e.target.value)}
//               className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
//               placeholder="Введіть ім'я"
//               maxLength={20}
//             />
//             <div className="flex gap-2">
//               <button
//                 onClick={handleNameSave}
//                 className="flex-1 bg-green-500/20 hover:bg-green-500/30 text-green-300 px-3 py-1 rounded-lg text-sm transition-colors"
//               >
//                 ✅ Зберегти
//               </button>
//               <button
//                 onClick={handleNameCancel}
//                 className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-300 px-3 py-1 rounded-lg text-sm transition-colors"
//               >
//                 ❌ Скасувати
//               </button>
//             </div>
//           </div>
//         ) : (
//           <div>
//             <div className="font-medium text-white">{userName}</div>
//             {isWalletVerified && (
//               <div className="text-xs text-white/50 mt-1">{walletAddress}</div>
//             )}
//           </div>
//         )}
//       </div>

//       {/* Статистика */}
//       <div className="bg-white/10 rounded-xl p-4">
//         <h3 className="font-semibold mb-3 text-center">📊 Статистика</h3>
        
//         {/* Статистика як на фото */}
//         <div className="grid grid-cols-4 gap-2 text-center mb-3">
//           <div>
//             <div className="text-green-400 font-bold text-xl">85</div>
//             <div className="text-white/60 text-xs">Перемоги</div>
//           </div>
//           <div>
//             <div className="text-red-400 font-bold text-xl">12</div>
//             <div className="text-white/60 text-xs">Поразки</div>
//           </div>
//           <div>
//             <div className="text-yellow-400 font-bold text-xl">8</div>
//             <div className="text-white/60 text-xs">Нічиї</div>
//           </div>
//           <div>
//             <div className="text-blue-400 font-bold text-xl">+7</div>
//             <div className="text-white/60 text-xs">Серія</div>
//           </div>
//         </div>
        
//         <div className="text-center">
//           <div className="text-sm text-white/70">Відсоток перемог: <span className="font-bold text-blue-400">81.0%</span></div>
//           <div className="bg-white/20 rounded-full h-2 mt-1">
//             <div className="bg-gradient-to-r from-blue-400 to-blue-500 h-2 rounded-full" style={{ width: '81%' }}></div>
//           </div>
//         </div>
//       </div>

//       {/* Налаштування теми */}
//       <div className="bg-white/10 rounded-xl p-4">
//         <h3 className="font-semibold mb-3 text-center">⚙️ Налаштування</h3>
//         <div className="flex items-center justify-center gap-3">
//           <button
//             onClick={() => setTheme('purple')}
//             className={`w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 transition-all duration-200 ${
//               theme === 'purple' 
//                 ? 'ring-2 ring-purple-400 ring-offset-2 ring-offset-transparent scale-110' 
//                 : 'hover:scale-105'
//             }`}
//           />
//           <button
//             onClick={() => setTheme('blue')}
//             className={`w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 transition-all duration-200 ${
//               theme === 'blue' 
//                 ? 'ring-2 ring-blue-400 ring-offset-2 ring-offset-transparent scale-110' 
//                 : 'hover:scale-105'
//             }`}
//           />
//           <button
//             onClick={() => setTheme('green')}
//             className={`w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-green-600 transition-all duration-200 ${
//               theme === 'green' 
//                 ? 'ring-2 ring-green-400 ring-offset-2 ring-offset-transparent scale-110' 
//                 : 'hover:scale-105'
//             }`}
//           />
//         </div>
//         <div className="text-center mt-2 text-sm text-white/60">
//           Оберіть колір теми
//         </div>
//       </div>
//     </div>
//   );
// }













































// src/app/sections/ProfileSection.tsx
'use client';

import { useState } from 'react';
import { useTranslation } from '../../../lib/i18n';

export default function ProfileSection() {
  const { t, language, setLanguage } = useTranslation();
  //const [userName, setUserName] = useState('Олександр_Крутий');
  //const [isEditingName, setIsEditingName] = useState(false);
 // const [tempName, setTempName] = useState(userName);
  //const [avatar, setAvatar] = useState<string | null>(null);
  //const [walletAddress] = useState('0x1234...5678');
  //const [isWalletVerified] = useState(true);
  const [theme, setTheme] = useState<'purple' | 'blue' | 'green'>('purple');

  // const handleNameSave = () => {
  //   if (tempName.trim()) {
  //     setUserName(tempName.trim());
  //     setIsEditingName(false);
  //   }
  // };

  // const handleNameCancel = () => {
  //   setTempName(userName);
  //   setIsEditingName(false);
  // };

  // const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onload = (event) => {
  //       setAvatar(event.target?.result as string);
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };

  return (
    <div className="space-y-4">
      {/* Заголовок */}
      <div className="text-center">
        <h2 className="text-xl font-bold">{t.profile.title}</h2>
      </div>

      {/* Аватар з балансом */}
      {/* <div className="bg-white/10 rounded-xl p-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg">
              {avatar ? (
                <img 
                  src={avatar} 
                  alt="Avatar" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-2xl">👤</span>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="absolute inset-0 opacity-0 cursor-pointer"
              id="avatar-upload"
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm text-white/70">{t.profile.avatar}</span>
                <label 
                  htmlFor="avatar-upload"
                  className="block mt-1 text-sm text-blue-400 hover:text-blue-300 cursor-pointer transition-colors"
                >
                  {t.profile.edit}
                </label>
              </div>
              <div className="text-right">
                <div className="text-sm text-white/70">{t.profile.balance}</div>
                <div className="font-bold text-yellow-400 text-lg">2340</div>
                <div className="text-xs text-white/60">{t.profile.coins}</div>
              </div>
            </div>
          </div>
        </div>
      </div> */}

      {/* Ім'я */}
      {/* <div className="bg-white/10 rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-sm text-white/70">{t.profile.name}</span>
            {isWalletVerified && (
              <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full border border-green-500/30">
                {t.profile.verified}
              </span>
            )}
          </div>
          {!isEditingName && (
            <button
              onClick={() => setIsEditingName(true)}
              className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
            >
              {t.profile.edit}
            </button>
          )}
        </div>
        
        {isEditingName ? (
          <div className="space-y-2">
            <input
              type="text"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
              placeholder={t.profile.enterName}
              maxLength={20}
            />
            <div className="flex gap-2">
              <button
                onClick={handleNameSave}
                className="flex-1 bg-green-500/20 hover:bg-green-500/30 text-green-300 px-3 py-1 rounded-lg text-sm transition-colors"
              >
                {t.profile.save}
              </button>
              <button
                onClick={handleNameCancel}
                className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-300 px-3 py-1 rounded-lg text-sm transition-colors"
              >
                {t.profile.cancel}
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="font-medium text-white">{userName}</div>
            {isWalletVerified && (
              <div className="text-xs text-white/50 mt-1">{walletAddress}</div>
            )}
          </div>
        )}
      </div> */}

      {/* Статистика */}
      {/* <div className="bg-white/10 rounded-xl p-4">
        <h3 className="font-semibold mb-3 text-center">{t.profile.statistics}</h3>
        
        <div className="grid grid-cols-4 gap-2 text-center mb-3">
          <div>
            <div className="text-green-400 font-bold text-xl">85</div>
            <div className="text-white/60 text-xs">{t.profile.wins}</div>
          </div>
          <div>
            <div className="text-red-400 font-bold text-xl">12</div>
            <div className="text-white/60 text-xs">{t.profile.losses}</div>
          </div>
          <div>
            <div className="text-yellow-400 font-bold text-xl">8</div>
            <div className="text-white/60 text-xs">{t.profile.draws}</div>
          </div>
          <div>
            <div className="text-blue-400 font-bold text-xl">+7</div>
            <div className="text-white/60 text-xs">{t.profile.streak}</div>
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-sm text-white/70">
            {t.profile.winRate} <span className="font-bold text-blue-400">81.0%</span>
          </div>
          <div className="bg-white/20 rounded-full h-2 mt-1">
            <div className="bg-gradient-to-r from-blue-400 to-blue-500 h-2 rounded-full" style={{ width: '81%' }}></div>
          </div>
        </div>
      </div> */}

      {/* Налаштування */}
      <div className="bg-white/10 rounded-xl p-4">
        <h3 className="font-semibold mb-3 text-center">{t.profile.settings}</h3>
        
    {/* Перемикач мови */}
    <div className="mb-4">
    <div className="flex items-center justify-between">
      <span className="text-sm text-white/70">{t.profile.language}</span>
      <div className="relative flex-shrink-0 w-32">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value as 'uk' | 'en')}
          className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm appearance-none cursor-pointer"
        >
          <option value="uk" className="bg-gray-800 text-white">
            {t.profile.selectLanguage.uk}
          </option>
          <option value="en" className="bg-gray-800 text-white">
            {t.profile.selectLanguage.en}
          </option>
        </select>
        {/* Стрілка для випадаючого списку */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
    </div>

        {/* Вибір теми */}
        <div>
          <div className="flex items-center justify-center gap-3 mb-2">
            <button
              onClick={() => setTheme('purple')}
              className={`w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 transition-all duration-200 ${
                theme === 'purple' 
                  ? 'ring-2 ring-purple-400 ring-offset-2 ring-offset-transparent scale-110' 
                  : 'hover:scale-105'
              }`}
            />
            <button
              onClick={() => setTheme('blue')}
              className={`w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 transition-all duration-200 ${
                theme === 'blue' 
                  ? 'ring-2 ring-blue-400 ring-offset-2 ring-offset-transparent scale-110' 
                  : 'hover:scale-105'
              }`}
            />
            <button
              onClick={() => setTheme('green')}
              className={`w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-green-600 transition-all duration-200 ${
                theme === 'green' 
                  ? 'ring-2 ring-green-400 ring-offset-2 ring-offset-transparent scale-110' 
                  : 'hover:scale-105'
              }`}
            />
          </div>
          <div className="text-center text-sm text-white/60">
            {t.profile.selectTheme}
          </div>
        </div>
      </div>
    </div>
  );
}