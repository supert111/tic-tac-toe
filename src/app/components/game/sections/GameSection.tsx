// // components/game/sections/GameSection.tsx
// // Головний компонент ігрової секції з інтеграцією всіх нових хуків
// // ✅ Використовує useGameState для управління станом
// // ✅ Інтегрує GameStatus, GameTimer, ProgressBar
// // ✅ Зберігає існуючий інтерфейс
// // ✅ Підтримує AI та PvP режими

// 'use client';

// import React, { useCallback, useEffect } from 'react';
// import { useGameState } from '../../../../hooks/useGameState';
// import GameStatus from '../ui/GameStatus';
// import GameTimer from '../ui/GameTimer';
// import ProgressBar from '../ui/ProgressBar';

// import type { 
//   GameMode, 
//   Player, 
//   BoardSize, 
//   Difficulty,
//   FirstMove,
//   GameAccess,
// } from '../../../../types/game';

// // Типи для табів
// type GameTab = 'create-game' | 'create-tournament' | 'available-games';

// interface GameSectionProps {
//   className?: string;
// }

// export default function GameSection({ className = '' }: GameSectionProps) {
//   // Стан інтерфейсу (зберігаємо існуючу логіку)
//   const [activeTab, setActiveTab] = React.useState<GameTab>('create-game');
//   const [gameMode, setGameMode] = React.useState<GameMode>('ai');
  
//   // Налаштування гри (зберігаємо існуючі)
//   const [boardSize, setBoardSize] = React.useState<BoardSize>(3);
//   const [playerSymbol, setPlayerSymbol] = React.useState<Player>('X');
//   const [firstMove, setFirstMove] = React.useState<FirstMove>('random');
//   const [difficulty, setDifficulty] = React.useState<Difficulty>('medium');
//   const [hasStake, setHasStake] = React.useState(false);
//   const [stakeAmount, setStakeAmount] = React.useState('');
//   const [gameAccess, setGameAccess] = React.useState<GameAccess>('public');

//   // Ініціалізуємо новий хук управління грою
//   const gameState = useGameState({
//     initialSettings: {
//       boardSize,
//       gameMode,
//       playerSymbol,
//       aiDifficulty: difficulty,
//       timerEnabled: true,
//       timePerMove: 22,
//       aiThinkingTime: 1000
//     },
//     onGameEnd: (result, winner) => {
//       console.log('Гра завершена:', { result, winner });
//       // Тут можна додати логіку показу результатів
//     },
//     onStatisticsUpdate: (stats) => {
//       console.log('Статистика оновлена:', stats);
//     },
//    // persistGame: true
//   });

//   // Обробка кліку по клітинці
//   const handleCellClick = useCallback(async (index: number) => {
//     if (!gameState.canMakeMove(index)) return;
    
//     await gameState.makeMove(index);
//   }, [gameState]);

//   const determineFirstPlayer = useCallback((): Player => {
//     if (gameMode === 'ai') {
//       switch (firstMove) {
//         case 'player': return playerSymbol;
//         case 'ai': return playerSymbol === 'X' ? 'O' : 'X';
//         case 'random': return Math.random() < 0.5 ? playerSymbol : (playerSymbol === 'X' ? 'O' : 'X');
//       }
//     }
//     return playerSymbol;
//   }, [firstMove, playerSymbol, gameMode]);

//   // Початок нової гри
//   const handleStartNewGame = useCallback(() => {
//     const firstPlayer = determineFirstPlayer(); // 🔥 ВИКОРИСТОВУЙТЕ ЦЮ ФУНКЦІЮ
//     // Оновлюємо налаштування перед початком
//     gameState.updateSettings({
//       boardSize,
//       gameMode,
//       playerSymbol,
//       aiDifficulty: difficulty,
//       timerEnabled: true,
//       timePerMove: 22,
//       aiThinkingTime: 1000
//     });
    
//     gameState.startNewGame(firstPlayer);

//     console.log('Налаштування гри:', {
//       gameMode: gameState.settings.gameMode,
//       playerSymbol: gameState.settings.playerSymbol,
//       firstPlayer, // 🔥 ДОДАЙТЕ ЦЕЙ ЛОГ
//       currentPlayer: gameState.currentPlayer,
//       isPlayerTurn: gameState.currentPlayer === gameState.settings.playerSymbol
//     });
//   }, [gameState, boardSize, gameMode, playerSymbol, difficulty, determineFirstPlayer, firstMove]);

//   // Синхронізація налаштувань
//   useEffect(() => {
//     gameState.updateSettings({
//       boardSize,
//       gameMode,
//       playerSymbol,
//       aiDifficulty: difficulty
//     });
//   }, [boardSize, gameMode, playerSymbol, difficulty]);

//   // Рендеринг ігрової дошки
//   const renderGameBoard = () => {
//     const gridSize = boardSize === 3 ? 'grid-cols-3' : 'grid-cols-4';
//     const boardWidth = boardSize === 3 ? 'w-64' : 'w-80';
    
//     return (
//       <div className={`bg-white/10 rounded-xl p-4 mb-6`}>
//         <div className={`grid ${gridSize} gap-2 ${boardWidth} mx-auto`}>
//           {gameState.board.map((cell, index) => (
//             <button
//               key={index}
//               onClick={() => handleCellClick(index)}
//               disabled={!gameState.gameActive || !gameState.canMakeMove(index)}
//               className={`
//                 aspect-square bg-white/20 hover:bg-white/30 
//                 rounded-xl flex items-center justify-center 
//                 text-2xl font-bold transition-all hover:scale-105
//                 disabled:opacity-50 disabled:cursor-not-allowed
//                 ${gameState.winningLine.includes(index) ? 'bg-green-500/50' : ''}
//               `}
//             >
//               {cell}
//             </button>
//           ))}
//         </div>
//       </div>
//     );
//   };

//   // Рендеринг статусу гри та таймера
//   const renderGameStatus = () => {
//     return (
//       <div className="space-y-4 mb-6">
//         {/* Статус гри */}
//         <GameStatus
//           gameState={gameState.gameState}
//           currentPlayer={gameState.currentPlayer}
//           gameResult={gameState.gameResult}
//           gameMode={gameMode}
//           playerSymbol={playerSymbol}
//           isAIThinking={gameState.isAIThinking}
//           aiDifficulty={difficulty}
//           variant="default"
//         />

//         {/* Таймер (якщо гра активна) */}
//         {gameState.gameActive && gameState.settings.timerEnabled && (
//           <div className="flex items-center justify-center">
//             <GameTimer
//               timeLeft={gameState.timeLeft}
//               maxTime={gameState.settings.timePerMove}
//               isRunning={gameState.isTimerRunning}
//               isPaused={gameState.gameState === 'paused'}
//               size="large"
//               showIcon={true}
//             />
//           </div>
//         )}

//         {/* Прогрес гри */}
//         {gameState.gameActive && (
//           <ProgressBar
//             value={gameState.gameStats.moves}
//             maxValue={boardSize * boardSize}
//             label="Прогрес гри"
//             variant="default"
//             size="medium"
//             showValues={true}
//             animated={true}
//           />
//         )}
//       </div>
//     );
//   };

//   // Компонент створення гри (зберігаємо існуючий дизайн)
//   const CreateGameTab = () => (
//     <div className="space-y-4">
//       {/* Режим AI/PvP */}
//       <div className="flex gap-3 mb-6">
//         <button
//           onClick={() => setGameMode('ai')}
//           className={`flex-1 py-3 px-4 rounded-xl font-semibold text-base transition-all ${
//             gameMode === 'ai'
//               ? 'bg-purple-600 text-white shadow-lg'
//               : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
//           }`}
//         >
//           🤖 AI
//         </button>
//         <button
//           onClick={() => setGameMode('pvp')}
//           className={`flex-1 py-3 px-4 rounded-xl font-semibold text-base transition-all ${
//             gameMode === 'pvp'
//               ? 'bg-purple-600 text-white shadow-lg'
//               : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
//           }`}
//         >
//           ⚔️ PvP
//         </button>
//       </div>

//       {/* Назва гри */}
//       <div className="text-center text-xl font-semibold mb-6 flex items-center justify-center gap-2">
//         🎮 Хрестики-нулики
//       </div>

//       {/* Статус гри та таймер */}
//       {gameState.gameState !== 'setup' && renderGameStatus()}

//       {/* Ігрове поле */}
//       {renderGameBoard()}

//       {/* Компактні налаштування */}
//       <div className="space-y-4">
//         {/* Розмір поля */}
//         <div className="flex justify-between items-center">
//           <span className="text-base font-medium opacity-90">Розмір:</span>
//           <div className="flex gap-2">
//             <button
//               onClick={() => setBoardSize(3)}
//               className={`px-4 py-2 text-base rounded-lg font-medium transition-all ${
//                 boardSize === 3
//                   ? 'bg-purple-600 text-white shadow-lg'
//                   : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
//               }`}
//             >
//               3×3
//             </button>
//             <button
//               onClick={() => setBoardSize(4)}
//               className={`px-4 py-2 text-base rounded-lg font-medium transition-all ${
//                 boardSize === 4
//                   ? 'bg-purple-600 text-white shadow-lg'
//                   : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
//               }`}
//             >
//               4×4
//             </button>
//           </div>
//         </div>

//         {/* Фігура */}
//         <div className="flex justify-between items-center">
//           <span className="text-base font-medium opacity-90">Фігура:</span>
//           <div className="flex gap-2">
//             <button
//               onClick={() => setPlayerSymbol('X')}
//               className={`px-4 py-2 text-base rounded-lg font-medium transition-all ${
//                 playerSymbol === 'X'
//                   ? 'bg-purple-600 text-white shadow-lg'
//                   : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
//               }`}
//             >
//               X
//             </button>
//             <button
//               onClick={() => setPlayerSymbol('O')}
//               className={`px-4 py-2 text-base rounded-lg font-medium transition-all ${
//                 playerSymbol === 'O'
//                   ? 'bg-purple-600 text-white shadow-lg'
//                   : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
//               }`}
//             >
//               O
//             </button>
//           </div>
//         </div>

//         {/* AI налаштування */}
//         {gameMode === 'ai' && (
//           <>
//             <div className="flex justify-between items-center">
//               <span className="text-base font-medium opacity-90">Перший хід:</span>
//               <div className="flex gap-2">
//                 <button
//                   onClick={() => setFirstMove('player')}
//                   className={`px-3 py-2 text-sm rounded-lg font-medium transition-all ${
//                     firstMove === 'player'
//                       ? 'bg-purple-600 text-white shadow-lg'
//                       : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
//                   }`}
//                 >
//                   Я
//                 </button>
//                 <button
//                   onClick={() => setFirstMove('ai')}
//                   className={`px-3 py-2 text-sm rounded-lg font-medium transition-all ${
//                     firstMove === 'ai'
//                       ? 'bg-purple-600 text-white shadow-lg'
//                       : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
//                   }`}
//                 >
//                   AI
//                 </button>
//                 <button
//                   onClick={() => setFirstMove('random')}
//                   className={`px-3 py-2 text-sm rounded-lg font-medium transition-all ${
//                     firstMove === 'random'
//                       ? 'bg-purple-600 text-white shadow-lg'
//                       : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
//                   }`}
//                 >
//                   Випадково
//                 </button>
//               </div>
//             </div>

//             <div className="flex justify-between items-center">
//               <span className="text-base font-medium opacity-90">Складність:</span>
//               <div className="flex gap-2">
//                 <button
//                   onClick={() => setDifficulty('easy')}
//                   className={`px-3 py-2 text-sm rounded-lg font-medium transition-all ${
//                     difficulty === 'easy'
//                       ? 'bg-green-600 text-white shadow-lg'
//                       : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
//                   }`}
//                 >
//                   Легка
//                 </button>
//                 <button
//                   onClick={() => setDifficulty('medium')}
//                   className={`px-3 py-2 text-sm rounded-lg font-medium transition-all ${
//                     difficulty === 'medium'
//                       ? 'bg-yellow-600 text-white shadow-lg'
//                       : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
//                   }`}
//                 >
//                   Середня
//                 </button>
//                 <button
//                   onClick={() => setDifficulty('hard')}
//                   className={`px-3 py-2 text-sm rounded-lg font-medium transition-all ${
//                     difficulty === 'hard'
//                       ? 'bg-red-600 text-white shadow-lg'
//                       : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
//                   }`}
//                 >
//                   Важка
//                 </button>
//               </div>
//             </div>
//           </>
//         )}

//         {/* PvP налаштування */}
//         {gameMode === 'pvp' && (
//           <>
//             <div className="flex justify-between items-center">
//               <span className="text-base font-medium opacity-90">Перший хід:</span>
//               <div className="flex gap-2">
//                 <button
//                   onClick={() => setFirstMove('player')}
//                   className={`px-3 py-2 text-sm rounded-lg font-medium transition-all ${
//                     firstMove === 'player'
//                       ? 'bg-purple-600 text-white shadow-lg'
//                       : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
//                   }`}
//                 >
//                   Я перший
//                 </button>
//                 <button
//                   onClick={() => setFirstMove('random')}
//                   className={`px-3 py-2 text-sm rounded-lg font-medium transition-all ${
//                     firstMove === 'random'
//                       ? 'bg-purple-600 text-white shadow-lg'
//                       : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
//                   }`}
//                 >
//                   Випадково
//                 </button>
//               </div>
//             </div>

//             {/* Ставка */}
//             <div className="flex justify-between items-center">
//               <span className="text-base font-medium opacity-90">Ставка:</span>
//               <div className="flex gap-4 items-center">
//                 <label className="flex items-center gap-2 cursor-pointer text-sm">
//                   <input
//                     type="radio"
//                     name="stake"
//                     checked={!hasStake}
//                     onChange={() => setHasStake(false)}
//                     className="w-4 h-4"
//                   />
//                   <span>Без ставки</span>
//                 </label>
//                 <label className="flex items-center gap-2 cursor-pointer text-sm">
//                   <input
//                     type="radio"
//                     name="stake"
//                     checked={hasStake}
//                     onChange={() => setHasStake(true)}
//                     className="w-4 h-4"
//                   />
//                   <span>Зі ставкою</span>
//                 </label>
//               </div>
//             </div>

//             {hasStake && (
//               <div className="flex justify-between items-center">
//                 <span className="text-base font-medium opacity-90">Сума:</span>
//                 <input
//                   type="number"
//                   value={stakeAmount}
//                   onChange={(e) => setStakeAmount(e.target.value)}
//                   placeholder="0.01"
//                   step="0.01"
//                   min="0.01"
//                   className="w-24 px-3 py-2 text-sm bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50"
//                 />
//               </div>
//             )}

//             {/* Доступ */}
//             <div className="flex justify-between items-center">
//               <span className="text-base font-medium opacity-90">Доступ:</span>
//               <div className="flex gap-4 items-center">
//                 <label className="flex items-center gap-2 cursor-pointer text-sm">
//                   <input
//                     type="radio"
//                     name="access"
//                     checked={gameAccess === 'public'}
//                     onChange={() => setGameAccess('public')}
//                     className="w-4 h-4"
//                   />
//                   <span>Публічна</span>
//                 </label>
//                 <label className="flex items-center gap-2 cursor-pointer text-sm">
//                   <input
//                     type="radio"
//                     name="access"
//                     checked={gameAccess === 'private'}
//                     onChange={() => setGameAccess('private')}
//                     className="w-4 h-4"
//                   />
//                   <span>Приватна</span>
//                 </label>
//               </div>
//             </div>
//           </>
//         )}
//       </div>

//       {/* Кнопки управління */}
//       <div className="space-y-3">
//         {/* Кнопка старту/рестарту */}
//         <button
//           onClick={handleStartNewGame}
//           className="w-full bg-purple-600 hover:bg-purple-700 py-4 px-6 rounded-xl font-bold text-lg text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
//         >
//           {gameState.gameState === 'setup' ? '🎮 ПОЧАТИ ГРУ' : '🔄 НОВА ГРА'}
//         </button>

//         {/* Додаткові кнопки під час гри */}
//         {gameState.gameActive && (
//           <div className="flex gap-3">
//             <button
//               onClick={() => gameState.pauseGame()}
//               className="flex-1 bg-yellow-600 hover:bg-yellow-700 py-2 px-4 rounded-lg font-medium text-white transition-all"
//             >
//               ⏸️ Пауза
//             </button>
//             <button
//               onClick={() => gameState.resetGame()}
//               className="flex-1 bg-red-600 hover:bg-red-700 py-2 px-4 rounded-lg font-medium text-white transition-all"
//             >
//               🔄 Скинути
//             </button>
//           </div>
//         )}

//         {/* Кнопка продовження */}
//         {gameState.gameState === 'paused' && (
//           <button
//             onClick={() => gameState.resumeGame()}
//             className="w-full bg-green-600 hover:bg-green-700 py-3 px-6 rounded-xl font-bold text-white transition-all"
//           >
//             ▶️ ПРОДОВЖИТИ
//           </button>
//         )}
//       </div>

//       {/* Статистика сесії */}
//       {gameState.sessionStats.gamesPlayed > 0 && (
//         <div className="mt-6 p-4 bg-white/5 rounded-xl">
//           <h4 className="text-sm font-semibold text-white/90 mb-2">📊 Статистика сесії</h4>
//           <div className="grid grid-cols-2 gap-3 text-xs">
//             <div className="flex justify-between">
//               <span className="text-white/70">Ігор:</span>
//               <span className="text-white">{gameState.sessionStats.gamesPlayed}</span>
//             </div>
//             <div className="flex justify-between">
//               <span className="text-white/70">Перемог:</span>
//               <span className="text-green-400">{gameState.sessionStats.wins}</span>
//             </div>
//             <div className="flex justify-between">
//               <span className="text-white/70">Поразок:</span>
//               <span className="text-red-400">{gameState.sessionStats.losses}</span>
//             </div>
//             <div className="flex justify-between">
//               <span className="text-white/70">% перемог:</span>
//               <span className="text-blue-400">{gameState.sessionStats.winRate.toFixed(1)}%</span>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );

//   // Заглушка для інших табів (зберігаємо існуючі)
//   const CreateTournamentTab = () => (
//     <div className="text-center py-8">
//       <h3 className="text-xl font-semibold text-white mb-4">🏆 Турніри</h3>
//       <p className="text-white/70">Функціональність турнірів буде додана пізніше</p>
//     </div>
//   );

//   const AvailableGamesTab = () => (
//     <div className="text-center py-8">
//       <h3 className="text-xl font-semibold text-white mb-4">📋 Доступні ігри</h3>
//       <p className="text-white/70">Пошук ігор буде додано пізніше</p>
//     </div>
//   );

//   return (
//     <div className={`
//       bg-gradient-to-br from-gray-800/50 via-purple-800/50 to-gray-800/50 
//       backdrop-blur-md rounded-3xl p-4 lg:p-6 shadow-2xl 
//       border border-purple-500/20
//       ${className}
//     `}>
//       {/* Таби */}
//       <div className="flex gap-1 mb-6 bg-white/10 rounded-xl p-1">
//         <button
//           onClick={() => setActiveTab('create-game')}
//           className={`
//             flex-1 flex flex-col items-center gap-1 py-2 px-2 rounded-lg transition-all duration-300 text-xs
//             ${activeTab === 'create-game'
//               ? 'bg-purple-600 text-white'
//               : 'text-white/70 hover:text-white hover:bg-white/10'
//             }
//           `}
//         >
//           <span className="text-sm">🎮</span>
//           <span className="font-medium leading-tight text-center">Створити гру</span>
//         </button>
//         <button
//           onClick={() => setActiveTab('create-tournament')}
//           className={`
//             flex-1 flex flex-col items-center gap-1 py-2 px-2 rounded-lg transition-all duration-300 text-xs
//             ${activeTab === 'create-tournament'
//               ? 'bg-purple-600 text-white'
//               : 'text-white/70 hover:text-white hover:bg-white/10'
//             }
//           `}
//         >
//           <span className="text-sm">🏆</span>
//           <span className="font-medium leading-tight text-center">Створити турнір</span>
//         </button>
//         <button
//           onClick={() => setActiveTab('available-games')}
//           className={`
//             flex-1 flex flex-col items-center gap-1 py-2 px-2 rounded-lg transition-all duration-300 text-xs
//             ${activeTab === 'available-games'
//               ? 'bg-purple-600 text-white'
//               : 'text-white/70 hover:text-white hover:bg-white/10'
//             }
//           `}
//         >
//           <span className="text-sm">📋</span>
//           <span className="font-medium leading-tight text-center">Доступні ігри</span>
//         </button>
//       </div>

//       {/* Контент залежно від активного табу */}
//       <div className="min-h-[400px]">
//         {activeTab === 'create-game' && <CreateGameTab />}
//         {activeTab === 'create-tournament' && <CreateTournamentTab />}
//         {activeTab === 'available-games' && <AvailableGamesTab />}
//       </div>
//     </div>
//   );
// }































































// // components/game/sections/GameSection.tsx
// // Головний компонент ігрової секції з інтеграцією всіх нових хуків
// // ✅ Використовує useGameState для управління станом
// // ✅ Інтегрує GameStatus, GameTimer, ProgressBar
// // ✅ Зберігає існуючий інтерфейс
// // ✅ Підтримує AI та PvP режими

// 'use client';

// import React, { useCallback, useEffect } from 'react';
// import { useGameState } from '../../../../hooks/useGameState';
// import GameStatus from '../ui/GameStatus';
// import GameTimer from '../ui/GameTimer';
// import ProgressBar from '../ui/ProgressBar';

// import type { 
//   GameMode, 
//   Player, 
//   BoardSize, 
//   Difficulty,
//   FirstMove,
//   GameAccess,
// } from '../../../../types/game';

// // Типи для табів
// type GameTab = 'create-game' | 'create-tournament' | 'available-games';

// interface GameSectionProps {
//   className?: string;
// }

// export default function GameSection({ className = '' }: GameSectionProps) {
//   // Стан інтерфейсу (зберігаємо існуючу логіку)
//   const [activeTab, setActiveTab] = React.useState<GameTab>('create-game');
//   const [gameMode, setGameMode] = React.useState<GameMode>('ai');
  
//   // Налаштування гри (зберігаємо існуючі)
//   const [boardSize, setBoardSize] = React.useState<BoardSize>(3);
//   const [playerSymbol, setPlayerSymbol] = React.useState<Player>('X');
//   const [firstMove, setFirstMove] = React.useState<FirstMove>('random');
//   const [difficulty, setDifficulty] = React.useState<Difficulty>('medium');
//   const [hasStake, setHasStake] = React.useState(false);
//   const [stakeAmount, setStakeAmount] = React.useState('');
//   const [gameAccess, setGameAccess] = React.useState<GameAccess>('public');

//   // Ініціалізуємо новий хук управління грою
//   const gameState = useGameState({
//     initialSettings: {
//       boardSize,
//       gameMode,
//       playerSymbol,
//       aiDifficulty: difficulty,
//       timerEnabled: true,
//       timePerMove: 22,
//       aiThinkingTime: 1000
//     },
//     onGameEnd: (result, winner) => {
//       console.log('Гра завершена:', { result, winner });
//       // Тут можна додати логіку показу результатів
//     },
//     onStatisticsUpdate: (stats) => {
//       console.log('Статистика оновлена:', stats);
//     },
//     //persistGame: true
//   });

//   // Обробка кліку по клітинці
//   const handleCellClick = useCallback(async (index: number) => {
//     if (!gameState.canMakeMove(index)) return;
    
//     await gameState.makeMove(index);
//   }, [gameState]);

//   // Початок нової гри
//   const handleStartNewGame = useCallback(() => {
//     // Оновлюємо налаштування перед початком
//     gameState.updateSettings({
//       boardSize,
//       gameMode,
//       playerSymbol,
//       aiDifficulty: difficulty,
//       timerEnabled: true,
//       timePerMove: 22,
//       aiThinkingTime: 1000
//     });
    
//     gameState.startNewGame();
//   }, [gameState, boardSize, gameMode, playerSymbol, difficulty]);

//   // Синхронізація налаштувань
//   useEffect(() => {
//     gameState.updateSettings({
//       boardSize,
//       gameMode,
//       playerSymbol,
//       aiDifficulty: difficulty
//     });
//   }, [boardSize, gameMode, playerSymbol, difficulty]);

//   // Рендеринг ігрової дошки
//   const renderGameBoard = () => {
//     const gridSize = boardSize === 3 ? 'grid-cols-3' : 'grid-cols-4';
//     const boardWidth = boardSize === 3 ? 'w-64' : 'w-80';
    
//     return (
//       <div className={`bg-white/10 rounded-xl p-4 mb-6`}>
//         <div className={`grid ${gridSize} gap-2 ${boardWidth} mx-auto`}>
//           {gameState.board.map((cell, index) => (
//             <button
//               key={index}
//               onClick={() => handleCellClick(index)}
//               disabled={!gameState.gameActive || !gameState.canMakeMove(index)}
//               className={`
//                 aspect-square bg-white/20 hover:bg-white/30 
//                 rounded-xl flex items-center justify-center 
//                 text-2xl font-bold transition-all hover:scale-105
//                 disabled:opacity-50 disabled:cursor-not-allowed
//                 ${gameState.winningLine.includes(index) ? 'bg-green-500/50' : ''}
//               `}
//             >
//               {cell}
//             </button>
//           ))}
//         </div>
//       </div>
//     );
//   };

//   // Рендеринг статусу гри та таймера
//   const renderGameStatus = () => {
//     return (
//       <div className="space-y-4 mb-6">
//         {/* Статус гри */}
//         <GameStatus
//           gameState={gameState.gameState}
//           currentPlayer={gameState.currentPlayer}
//           gameResult={gameState.gameResult}
//           gameMode={gameMode}
//           playerSymbol={playerSymbol}
//           isAIThinking={gameState.isAIThinking}
//           aiDifficulty={difficulty}
//           variant="default"
//         />

//         {/* Таймер (якщо гра активна) */}
//         {gameState.gameActive && gameState.settings.timerEnabled && (
//           <div className="flex items-center justify-center">
//             <GameTimer
//               timeLeft={gameState.timeLeft}
//               maxTime={gameState.settings.timePerMove}
//               isRunning={gameState.isTimerRunning}
//               isPaused={gameState.gameState === 'paused'}
//               size="large"
//               showIcon={true}
//             />
//           </div>
//         )}

//         {/* Прогрес гри */}
//         {gameState.gameActive && (
//           <ProgressBar
//             value={gameState.gameStats.moves}
//             maxValue={boardSize * boardSize}
//             label="Прогрес гри"
//             variant="default"
//             size="medium"
//             showValues={true}
//             animated={true}
//           />
//         )}
//       </div>
//     );
//   };

//   // Компонент створення гри (зберігаємо існуючий дизайн)
//   const CreateGameTab = () => (
//     <div className="space-y-4">
//       {/* Режим AI/PvP */}
//       <div className="flex gap-3 mb-6">
//         <button
//           onClick={() => setGameMode('ai')}
//           className={`flex-1 py-3 px-4 rounded-xl font-semibold text-base transition-all ${
//             gameMode === 'ai'
//               ? 'bg-purple-600 text-white shadow-lg'
//               : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
//           }`}
//         >
//           🤖 AI
//         </button>
//         <button
//           onClick={() => setGameMode('pvp')}
//           className={`flex-1 py-3 px-4 rounded-xl font-semibold text-base transition-all ${
//             gameMode === 'pvp'
//               ? 'bg-purple-600 text-white shadow-lg'
//               : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
//           }`}
//         >
//           ⚔️ PvP
//         </button>
//       </div>

//       {/* Назва гри */}
//       <div className="text-center text-xl font-semibold mb-6 flex items-center justify-center gap-2">
//         🎮 Хрестики-нулики
//       </div>

//       {/* Статус гри та таймер */}
//       {gameState.gameState !== 'setup' && renderGameStatus()}

//       {/* Ігрове поле */}
//       {renderGameBoard()}

//       {/* Компактні налаштування */}
//       <div className="space-y-4">
//         {/* Розмір поля */}
//         <div className="flex justify-between items-center">
//           <span className="text-base font-medium opacity-90">Розмір:</span>
//           <div className="flex gap-2">
//             <button
//               onClick={() => setBoardSize(3)}
//               className={`px-4 py-2 text-base rounded-lg font-medium transition-all ${
//                 boardSize === 3
//                   ? 'bg-purple-600 text-white shadow-lg'
//                   : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
//               }`}
//             >
//               3×3
//             </button>
//             <button
//               onClick={() => setBoardSize(4)}
//               className={`px-4 py-2 text-base rounded-lg font-medium transition-all ${
//                 boardSize === 4
//                   ? 'bg-purple-600 text-white shadow-lg'
//                   : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
//               }`}
//             >
//               4×4
//             </button>
//           </div>
//         </div>

//         {/* Фігура */}
//         <div className="flex justify-between items-center">
//           <span className="text-base font-medium opacity-90">Фігура:</span>
//           <div className="flex gap-2">
//             <button
//               onClick={() => setPlayerSymbol('X')}
//               className={`px-4 py-2 text-base rounded-lg font-medium transition-all ${
//                 playerSymbol === 'X'
//                   ? 'bg-purple-600 text-white shadow-lg'
//                   : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
//               }`}
//             >
//               X
//             </button>
//             <button
//               onClick={() => setPlayerSymbol('O')}
//               className={`px-4 py-2 text-base rounded-lg font-medium transition-all ${
//                 playerSymbol === 'O'
//                   ? 'bg-purple-600 text-white shadow-lg'
//                   : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
//               }`}
//             >
//               O
//             </button>
//           </div>
//         </div>

//         {/* AI налаштування */}
//         {gameMode === 'ai' && (
//           <>
//             <div className="flex justify-between items-center">
//               <span className="text-base font-medium opacity-90">Перший хід:</span>
//               <div className="flex gap-2">
//                 <button
//                   onClick={() => setFirstMove('player')}
//                   className={`px-3 py-2 text-sm rounded-lg font-medium transition-all ${
//                     firstMove === 'player'
//                       ? 'bg-purple-600 text-white shadow-lg'
//                       : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
//                   }`}
//                 >
//                   Я
//                 </button>
//                 <button
//                   onClick={() => setFirstMove('ai')}
//                   className={`px-3 py-2 text-sm rounded-lg font-medium transition-all ${
//                     firstMove === 'ai'
//                       ? 'bg-purple-600 text-white shadow-lg'
//                       : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
//                   }`}
//                 >
//                   AI
//                 </button>
//                 <button
//                   onClick={() => setFirstMove('random')}
//                   className={`px-3 py-2 text-sm rounded-lg font-medium transition-all ${
//                     firstMove === 'random'
//                       ? 'bg-purple-600 text-white shadow-lg'
//                       : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
//                   }`}
//                 >
//                   Випадково
//                 </button>
//               </div>
//             </div>

//             <div className="flex justify-between items-center">
//               <span className="text-base font-medium opacity-90">Складність:</span>
//               <div className="flex gap-2">
//                 <button
//                   onClick={() => setDifficulty('easy')}
//                   className={`px-3 py-2 text-sm rounded-lg font-medium transition-all ${
//                     difficulty === 'easy'
//                       ? 'bg-green-600 text-white shadow-lg'
//                       : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
//                   }`}
//                 >
//                   Легка
//                 </button>
//                 <button
//                   onClick={() => setDifficulty('medium')}
//                   className={`px-3 py-2 text-sm rounded-lg font-medium transition-all ${
//                     difficulty === 'medium'
//                       ? 'bg-yellow-600 text-white shadow-lg'
//                       : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
//                   }`}
//                 >
//                   Середня
//                 </button>
//                 <button
//                   onClick={() => setDifficulty('hard')}
//                   className={`px-3 py-2 text-sm rounded-lg font-medium transition-all ${
//                     difficulty === 'hard'
//                       ? 'bg-red-600 text-white shadow-lg'
//                       : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
//                   }`}
//                 >
//                   Важка
//                 </button>
//               </div>
//             </div>
//           </>
//         )}

//         {/* PvP налаштування */}
//         {gameMode === 'pvp' && (
//           <>
//             <div className="flex justify-between items-center">
//               <span className="text-base font-medium opacity-90">Перший хід:</span>
//               <div className="flex gap-2">
//                 <button
//                   onClick={() => setFirstMove('player')}
//                   className={`px-3 py-2 text-sm rounded-lg font-medium transition-all ${
//                     firstMove === 'player'
//                       ? 'bg-purple-600 text-white shadow-lg'
//                       : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
//                   }`}
//                 >
//                   Я перший
//                 </button>
//                 <button
//                   onClick={() => setFirstMove('random')}
//                   className={`px-3 py-2 text-sm rounded-lg font-medium transition-all ${
//                     firstMove === 'random'
//                       ? 'bg-purple-600 text-white shadow-lg'
//                       : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
//                   }`}
//                 >
//                   Випадково
//                 </button>
//               </div>
//             </div>

//             {/* Ставка */}
//             <div className="flex justify-between items-center">
//               <span className="text-base font-medium opacity-90">Ставка:</span>
//               <div className="flex gap-4 items-center">
//                 <label className="flex items-center gap-2 cursor-pointer text-sm">
//                   <input
//                     type="radio"
//                     name="stake"
//                     checked={!hasStake}
//                     onChange={() => setHasStake(false)}
//                     className="w-4 h-4"
//                   />
//                   <span>Без ставки</span>
//                 </label>
//                 <label className="flex items-center gap-2 cursor-pointer text-sm">
//                   <input
//                     type="radio"
//                     name="stake"
//                     checked={hasStake}
//                     onChange={() => setHasStake(true)}
//                     className="w-4 h-4"
//                   />
//                   <span>Зі ставкою</span>
//                 </label>
//               </div>
//             </div>

//             {hasStake && (
//               <div className="flex justify-between items-center">
//                 <span className="text-base font-medium opacity-90">Сума:</span>
//                 <input
//                   type="number"
//                   value={stakeAmount}
//                   onChange={(e) => setStakeAmount(e.target.value)}
//                   placeholder="0.01"
//                   step="0.01"
//                   min="0.01"
//                   className="w-24 px-3 py-2 text-sm bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50"
//                 />
//               </div>
//             )}

//             {/* Доступ */}
//             <div className="flex justify-between items-center">
//               <span className="text-base font-medium opacity-90">Доступ:</span>
//               <div className="flex gap-4 items-center">
//                 <label className="flex items-center gap-2 cursor-pointer text-sm">
//                   <input
//                     type="radio"
//                     name="access"
//                     checked={gameAccess === 'public'}
//                     onChange={() => setGameAccess('public')}
//                     className="w-4 h-4"
//                   />
//                   <span>Публічна</span>
//                 </label>
//                 <label className="flex items-center gap-2 cursor-pointer text-sm">
//                   <input
//                     type="radio"
//                     name="access"
//                     checked={gameAccess === 'private'}
//                     onChange={() => setGameAccess('private')}
//                     className="w-4 h-4"
//                   />
//                   <span>Приватна</span>
//                 </label>
//               </div>
//             </div>
//           </>
//         )}
//       </div>

//       {/* Кнопки управління */}
//       <div className="space-y-3">
//         {/* Кнопка старту/рестарту */}
//         <button
//           onClick={handleStartNewGame}
//           className="w-full bg-purple-600 hover:bg-purple-700 py-4 px-6 rounded-xl font-bold text-lg text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
//         >
//           {gameState.gameState === 'setup' ? '🎮 ПОЧАТИ ГРУ' : '🔄 НОВА ГРА'}
//         </button>

//         {/* Додаткові кнопки під час гри */}
//         {gameState.gameActive && (
//           <div className="flex gap-3">
//             <button
//               onClick={() => gameState.pauseGame()}
//               className="flex-1 bg-yellow-600 hover:bg-yellow-700 py-2 px-4 rounded-lg font-medium text-white transition-all"
//             >
//               ⏸️ Пауза
//             </button>
//             <button
//               onClick={() => gameState.resetGame()}
//               className="flex-1 bg-red-600 hover:bg-red-700 py-2 px-4 rounded-lg font-medium text-white transition-all"
//             >
//               🔄 Скинути
//             </button>
//           </div>
//         )}

//         {/* Кнопка продовження */}
//         {gameState.gameState === 'paused' && (
//           <button
//             onClick={() => gameState.resumeGame()}
//             className="w-full bg-green-600 hover:bg-green-700 py-3 px-6 rounded-xl font-bold text-white transition-all"
//           >
//             ▶️ ПРОДОВЖИТИ
//           </button>
//         )}
//       </div>

//       {/* Статистика сесії */}
//       {gameState.sessionStats.gamesPlayed > 0 && (
//         <div className="mt-6 p-4 bg-white/5 rounded-xl">
//           <h4 className="text-sm font-semibold text-white/90 mb-2">📊 Статистика сесії</h4>
//           <div className="grid grid-cols-2 gap-3 text-xs">
//             <div className="flex justify-between">
//               <span className="text-white/70">Ігор:</span>
//               <span className="text-white">{gameState.sessionStats.gamesPlayed}</span>
//             </div>
//             <div className="flex justify-between">
//               <span className="text-white/70">Перемог:</span>
//               <span className="text-green-400">{gameState.sessionStats.wins}</span>
//             </div>
//             <div className="flex justify-between">
//               <span className="text-white/70">Поразок:</span>
//               <span className="text-red-400">{gameState.sessionStats.losses}</span>
//             </div>
//             <div className="flex justify-between">
//               <span className="text-white/70">% перемог:</span>
//               <span className="text-blue-400">{gameState.sessionStats.winRate.toFixed(1)}%</span>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );

//   // Заглушка для інших табів (зберігаємо існуючі)
//   const CreateTournamentTab = () => (
//     <div className="text-center py-8">
//       <h3 className="text-xl font-semibold text-white mb-4">🏆 Турніри</h3>
//       <p className="text-white/70">Функціональність турнірів буде додана пізніше</p>
//     </div>
//   );

//   const AvailableGamesTab = () => (
//     <div className="text-center py-8">
//       <h3 className="text-xl font-semibold text-white mb-4">📋 Доступні ігри</h3>
//       <p className="text-white/70">Пошук ігор буде додано пізніше</p>
//     </div>
//   );

//   return (
//     <div className={`
//       bg-gradient-to-br from-gray-800/50 via-purple-800/50 to-gray-800/50 
//       backdrop-blur-md rounded-3xl p-4 lg:p-6 shadow-2xl 
//       border border-purple-500/20
//       ${className}
//     `}>
//       {/* Таби */}
//       <div className="flex gap-1 mb-6 bg-white/10 rounded-xl p-1">
//         <button
//           onClick={() => setActiveTab('create-game')}
//           className={`
//             flex-1 flex flex-col items-center gap-1 py-2 px-2 rounded-lg transition-all duration-300 text-xs
//             ${activeTab === 'create-game'
//               ? 'bg-purple-600 text-white'
//               : 'text-white/70 hover:text-white hover:bg-white/10'
//             }
//           `}
//         >
//           <span className="text-sm">🎮</span>
//           <span className="font-medium leading-tight text-center">Створити гру</span>
//         </button>
//         <button
//           onClick={() => setActiveTab('create-tournament')}
//           className={`
//             flex-1 flex flex-col items-center gap-1 py-2 px-2 rounded-lg transition-all duration-300 text-xs
//             ${activeTab === 'create-tournament'
//               ? 'bg-purple-600 text-white'
//               : 'text-white/70 hover:text-white hover:bg-white/10'
//             }
//           `}
//         >
//           <span className="text-sm">🏆</span>
//           <span className="font-medium leading-tight text-center">Створити турнір</span>
//         </button>
//         <button
//           onClick={() => setActiveTab('available-games')}
//           className={`
//             flex-1 flex flex-col items-center gap-1 py-2 px-2 rounded-lg transition-all duration-300 text-xs
//             ${activeTab === 'available-games'
//               ? 'bg-purple-600 text-white'
//               : 'text-white/70 hover:text-white hover:bg-white/10'
//             }
//           `}
//         >
//           <span className="text-sm">📋</span>
//           <span className="font-medium leading-tight text-center">Доступні ігри</span>
//         </button>
//       </div>

//       {/* Контент залежно від активного табу */}
//       <div className="min-h-[400px]">
//         {activeTab === 'create-game' && <CreateGameTab />}
//         {activeTab === 'create-tournament' && <CreateTournamentTab />}
//         {activeTab === 'available-games' && <AvailableGamesTab />}
//       </div>
//     </div>
//   );
// }









































// // components/game/sections/GameSection.tsx
// // Головний компонент ігрової секції з інтеграцією всіх нових хуків
// // ✅ Використовує useGameState для управління станом
// // ✅ Інтегрує GameStatus, GameTimer, ProgressBar
// // ✅ Зберігає існуючий інтерфейс
// // ✅ Підтримує AI та PvP режими

// 'use client';

// import React, { useCallback, useEffect } from 'react';
// import { useGameState } from '../../../../hooks/useGameState';
// import GameStatus from '../ui/GameStatus';
// import GameTimer from '../ui/GameTimer';
// import ProgressBar from '../ui/ProgressBar';

// import type { 
//   GameMode, 
//   Player, 
//   BoardSize, 
//   Difficulty,
//   FirstMove,
//   GameAccess
// } from '../../../../types/game';

// // Типи для табів
// type GameTab = 'create-game' | 'create-tournament' | 'available-games';

// interface GameSectionProps {
//   className?: string;
// }

// const DECORATIVE_ICONS = [
//   'aijarvis.jpg',
//   'bean.jpg', 
//   'berzan.jpg',
//   'cultverse.jpg',
//   'enjoyoors.jpg',
//   'fantasy.jpg',
//   'keone.jpg',
//   'kintsu.png',
//   'kizzy.jpg',
//   'laMouch.jpg',
//   'lootgo.jpg',
//   'magicEden.jpg',
//   'medusa.jpg',
//   'mikeinweb.png',
//   'monadverse.jpg',
//   'monorail.png',
//   'moyaking.jpg',
//   'nadsa.jpg',
//   'narwhal.jpg',
//   'pump.jpg',
//   'purps.png',
//   'rugRumble.png',
//   'talentum.jpg',
//   'thedaks.jpg',
//   'thevapelabs.jpg'
// ].map(filename => `/game-icons/${filename}`);

// // Функція для отримання випадкових іконок
// const getRandomIcons = (count: number): string[] => {
//   const shuffled = [...DECORATIVE_ICONS].sort(() => 0.5 - Math.random());
//   return shuffled.slice(0, count);
// };

// export default function GameSection({ className = '' }: GameSectionProps) {
//   // Стан інтерфейсу (зберігаємо існуючу логіку)
//   const [activeTab, setActiveTab] = React.useState<GameTab>('create-game');
//   const [gameMode, setGameMode] = React.useState<GameMode>('ai');
  
//   // Налаштування гри (зберігаємо існуючі)
//   const [boardSize, setBoardSize] = React.useState<BoardSize>(3);
//   const [playerSymbol, setPlayerSymbol] = React.useState<Player>('X');
//   const [firstMove, setFirstMove] = React.useState<FirstMove>('random');
//   const [difficulty, setDifficulty] = React.useState<Difficulty>('medium');
//   const [hasStake, setHasStake] = React.useState(false);
//   const [stakeAmount, setStakeAmount] = React.useState('');
//   const [gameAccess, setGameAccess] = React.useState<GameAccess>('public');
//   const [decorativeIcons, setDecorativeIcons] = React.useState<string[]>([]);

//   // Ініціалізуємо новий хук управління грою
//   const gameState = useGameState({
//     initialSettings: {
//       boardSize,
//       gameMode,
//       playerSymbol,
//       aiDifficulty: difficulty,
//       timerEnabled: true,
//       timePerMove: 22,
//       aiThinkingTime: 1000
//     },
//     onGameEnd: (result, winner) => {
//       console.log('Гра завершена:', { result, winner });
//       // Тут можна додати логіку показу результатів
//     },
//     onStatisticsUpdate: (stats) => {
//       console.log('Статистика оновлена:', stats);
//     },
//    // persistGame: true
//   });

//   // ✅ ДОДАТИ ТУТ:
//   useEffect(() => {
//     const iconCount = boardSize * boardSize;
//     setDecorativeIcons(getRandomIcons(iconCount));
//   }, [boardSize]);

//   // Обробка кліку по клітинці
//   const handleCellClick = useCallback(async (index: number) => {
//      // ДОДАТИ DEBUG ІНФОРМАЦІЮ:
//     if (boardSize === 4) {
//       console.log('🎯 Клік по клітинці:', {
//         index,
//         isRestricted: gameState.restrictedCells.includes(index),
//         canMakeMove: gameState.canMakeMoveWithRestrictions(index),
//         restrictedCells: gameState.restrictedCells,
//         currentPlayer: gameState.currentPlayer,
//         firstPlayer: gameState.firstPlayer
//       });
//     }

//     if (!gameState.canMakeMove(index)) return;
    
//     await gameState.makeMove(index);
//   }, [gameState, boardSize]);

//   const determineFirstPlayer = useCallback((): Player => {
//     if (gameMode === 'ai') {
//       switch (firstMove) {
//         case 'player': return playerSymbol;
//         case 'ai': return playerSymbol === 'X' ? 'O' : 'X';
//         case 'random': return Math.random() < 0.5 ? playerSymbol : (playerSymbol === 'X' ? 'O' : 'X');
//       }
//     }
//     return playerSymbol;
//   }, [firstMove, playerSymbol, gameMode]);

//   // Початок нової гри
//   const handleStartNewGame = useCallback(() => {
//     const firstPlayer = determineFirstPlayer(); // 🔥 ВИКОРИСТОВУЙТЕ ЦЮ ФУНКЦІЮ
//     // Оновлюємо налаштування перед початком
//     gameState.updateSettings({
//       boardSize,
//       gameMode,
//       playerSymbol,
//       aiDifficulty: difficulty,
//       timerEnabled: true,
//       timePerMove: 22,
//       aiThinkingTime: 1000
//     });
    
//     gameState.startNewGame(firstPlayer);

//     console.log('Налаштування гри:', {
//       gameMode: gameState.settings.gameMode,
//       playerSymbol: gameState.settings.playerSymbol,
//       firstPlayer, // 🔥 ДОДАЙТЕ ЦЕЙ ЛОГ
//       currentPlayer: gameState.currentPlayer,
//       isPlayerTurn: gameState.currentPlayer === gameState.settings.playerSymbol
//     });
//   }, [gameState, boardSize, gameMode, playerSymbol, difficulty, determineFirstPlayer, firstMove]);

//   // Синхронізація налаштувань
//   useEffect(() => {
//     gameState.updateSettings({
//       boardSize,
//       gameMode,
//       playerSymbol,
//       aiDifficulty: difficulty
//     });
//   }, [boardSize, gameMode, playerSymbol, difficulty]);

//   // Рендеринг ігрової дошки
//   // const renderGameBoard = () => {
//   //   const gridSize = boardSize === 3 ? 'grid-cols-3' : 'grid-cols-4';
//   //   const boardWidth = boardSize === 3 ? 'w-64' : 'w-80';
    
//   //   return (
//   //     <div className={`bg-white/10 rounded-xl p-4 mb-6`}>
//   //       <div className={`grid ${gridSize} gap-2 ${boardWidth} mx-auto`}>
//   //         {gameState.board.map((cell, index) => {
//   //           // ДОДАТИ ПЕРЕВІРКУ ОБМЕЖЕНЬ:
//   //           const isRestricted = gameState.restrictedCells.includes(index);
//   //           const canClick = gameState.canMakeMoveWithRestrictions ? 
//   //             gameState.canMakeMoveWithRestrictions(index) : 
//   //             gameState.canMakeMove(index);
            
//   //           return (
//   //             <button
//   //               key={index}
//   //               onClick={() => handleCellClick(index)}
//   //               disabled={!gameState.gameActive || !canClick}
//   //               title={isRestricted ? 'Заборонено правилами 4×4: другий хід не може бути поруч з першим' : undefined}
//   //               className={`
//   //                 aspect-square rounded-xl flex items-center justify-center 
//   //                 text-2xl font-bold transition-all hover:scale-105
//   //                 disabled:cursor-not-allowed
//   //                 ${gameState.winningLine.includes(index) ? 'bg-green-500/50' : ''}
//   //                 ${isRestricted ? 
//   //                   'bg-white/20 hover:bg-white/30 cursor-not-allowed' : 
//   //                   'bg-white/20 hover:bg-white/30'
//   //                 }
//   //                 ${!canClick ? 'opacity-50' : ''}
//   //               `}
//   //             >
//   //               {cell}
//   //               {/* ДОДАТИ ІНДИКАТОР ОБМЕЖЕННЯ:
//   //               {isRestricted && !cell && (
//   //                 <span className="text-red-400 text-sm">🚫</span>
//   //               )} */}
//   //             </button>
//   //           );
//   //         })}
//   //       </div>
        
//   //       {/* ДОДАТИ ІНФОРМАЦІЮ ПРО ОБМЕЖЕННЯ: */}
//   //       {boardSize === 4 && gameState.restrictionInfo.hasRestrictions && (
//   //         <div className="mt-3 p-2 bg-red-500/20 rounded-lg border border-red-400/30">
//   //           <div className="flex items-center gap-2 text-sm text-red-200">
//   //             <span>⚠️</span>
//   //             <span>{gameState.restrictionInfo.reasonDescription}</span>
//   //           </div>
//   //         </div>
//   //       )}
//   //     </div>
//   //   );
//   // };

//   // 5. ЗАМІНИТИ ФУНКЦІЮ renderGameBoard() НА ЦЮ:
// const renderGameBoard = () => {
//   const gridSize = boardSize === 3 ? 'grid-cols-3' : 'grid-cols-4';
//   const boardWidth = boardSize === 3 ? 'w-64' : 'w-80';
//   const isGameSetup = gameState.gameState === 'setup';
  
//   return (
//     <div className={`bg-white/10 rounded-xl p-4 mb-6`}>
//       <div className={`grid ${gridSize} gap-2 ${boardWidth} mx-auto`}>
//         {gameState.board.map((cell, index) => {
//           // Перевірка обмежень для 4×4
//           const isRestricted = gameState.restrictedCells.includes(index);
//           const canClick = gameState.canMakeMoveWithRestrictions ? 
//             gameState.canMakeMoveWithRestrictions(index) : 
//             gameState.canMakeMove(index);
          
//           return (
//             <button
//               key={index}
//               onClick={() => handleCellClick(index)}
//               disabled={!gameState.gameActive || !canClick}
//               title={isRestricted ? 'Заборонено правилами 4×4: другий хід не може бути поруч з першим' : undefined}
//               className={`
//                 aspect-square rounded-xl flex items-center justify-center 
//                 text-2xl font-bold transition-all duration-500 hover:scale-105
//                 disabled:cursor-not-allowed overflow-hidden
//                 ${gameState.winningLine.includes(index) ? 'bg-green-500/50' : ''}
//                 ${isRestricted ? 
//                   'bg-white/20 hover:bg-white/30 cursor-not-allowed' : 
//                   'bg-white/20 hover:bg-white/30'
//                 }
//                 ${!canClick ? 'opacity-50' : ''}
//               `}
//             >
//               {/* НОВА ЛОГІКА ВІДОБРАЖЕННЯ: */}
//               {isGameSetup ? (
//                 // До початку гри показуємо декоративні іконки
//                 <div className="w-full h-full flex items-center justify-center">
//                   <img 
//                     src={decorativeIcons[index] || '/game-icons/icon-1.png'} 
//                     alt={`Декоративна іконка ${index + 1}`}
//                     className="w-8 h-8 object-contain opacity-70 transition-all duration-500
//                              hover:opacity-90 hover:scale-110"
//                     onError={(e) => {
//                       // Fallback до emoji якщо іконка не завантажилась
//                       const target = e.target as HTMLImageElement;
//                       target.style.display = 'none';
//                       target.nextElementSibling!.textContent = '🎮';
//                     }}
//                   />
//                   <span className="hidden text-lg">🎮</span>
//                 </div>
//               ) : (
//                 // Під час гри показуємо X/O або порожні клітинки
//                 cell
//               )}
//             </button>
//           );
//         })}
//       </div>
      
//       {/* Інформація про обмеження (без змін) */}
//       {boardSize === 4 && gameState.restrictionInfo.hasRestrictions && (
//         <div className="mt-3 p-2 bg-red-500/20 rounded-lg border border-red-400/30">
//           <div className="flex items-center gap-2 text-sm text-red-200">
//             <span>⚠️</span>
//             <span>{gameState.restrictionInfo.reasonDescription}</span>
//           </div>
//         </div>
//       )}

//       {/* ДОДАТИ ПІДКАЗКУ ПРО ІКОНКИ (опціонально): */}
//       {isGameSetup && (
//         <div className="mt-3 text-center text-xs text-white/60">
//           ✨ Декоративні іконки зникнуть після початку гри
//         </div>
//       )}
//     </div>
//   );
// };

//   // Рендеринг статусу гри та таймера
//   const renderGameStatus = () => {
//     return (
//       <div className="space-y-4 mb-6">
//         {/* Статус гри */}
//         <GameStatus
//           gameState={gameState.gameState}
//           currentPlayer={gameState.currentPlayer}
//           gameResult={gameState.gameResult}
//           gameMode={gameMode}
//           playerSymbol={playerSymbol}
//           isAIThinking={gameState.isAIThinking}
//           aiDifficulty={difficulty}
//           variant="default"
//           // ДОДАТИ ЦІ РЯДКИ:
//           boardSize={boardSize}
//           restrictionInfo={gameState.restrictionInfo}
//           firstPlayer={gameState.firstPlayer}
//         />

//         {/* Таймер (якщо гра активна) */}
//         {gameState.gameActive && gameState.settings.timerEnabled && (
//           <div className="flex items-center justify-center">
//             <GameTimer
//               timeLeft={gameState.timeLeft}
//               maxTime={gameState.settings.timePerMove}
//               isRunning={gameState.isTimerRunning}
//               isPaused={gameState.gameState === 'paused'}
//               size="large"
//               showIcon={true}
//             />
//           </div>
//         )}

//         {/* Прогрес гри */}
//         {gameState.gameActive && (
//           <ProgressBar
//             value={gameState.gameStats.moves}
//             maxValue={boardSize * boardSize}
//             label="Прогрес гри"
//             variant="default"
//             size="medium"
//             showValues={true}
//             animated={true}
//           />
//         )}
//       </div>
//     );
//   };

//   // Компонент створення гри (зберігаємо існуючий дизайн)
//   const CreateGameTab = () => (
//     <div className="space-y-4">
//       {/* Режим AI/PvP */}
//       <div className="flex gap-3 mb-6">
//         <button
//           onClick={() => setGameMode('ai')}
//           className={`flex-1 py-3 px-4 rounded-xl font-semibold text-base transition-all ${
//             gameMode === 'ai'
//               ? 'bg-purple-600 text-white shadow-lg'
//               : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
//           }`}
//         >
//           🤖 AI
//         </button>
//         <button
//           onClick={() => setGameMode('pvp')}
//           className={`flex-1 py-3 px-4 rounded-xl font-semibold text-base transition-all ${
//             gameMode === 'pvp'
//               ? 'bg-purple-600 text-white shadow-lg'
//               : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
//           }`}
//         >
//           ⚔️ PvP
//         </button>
//       </div>

//       {/* Назва гри */}
//       <div className="text-center text-xl font-semibold mb-6 flex items-center justify-center gap-2">
//         🎮 Хрестики-нулики
//       </div>

//       {/* Статус гри та таймер */}
//       {gameState.gameState !== 'setup' && renderGameStatus()}

//       {/* Ігрове поле */}
//       {renderGameBoard()}

//       {/* Компактні налаштування */}
//       <div className="space-y-4">
//         {/* Розмір поля */}
//         <div className="flex justify-between items-center">
//           <span className="text-base font-medium opacity-90">Розмір:</span>
//           <div className="flex gap-2">
//             <button
//               onClick={() => setBoardSize(3)}
//               className={`px-4 py-2 text-base rounded-lg font-medium transition-all ${
//                 boardSize === 3
//                   ? 'bg-purple-600 text-white shadow-lg'
//                   : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
//               }`}
//             >
//               3×3
//             </button>
//             <button
//               onClick={() => setBoardSize(4)}
//               className={`px-4 py-2 text-base rounded-lg font-medium transition-all ${
//                 boardSize === 4
//                   ? 'bg-purple-600 text-white shadow-lg'
//                   : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
//               }`}
//             >
//               4×4
//             </button>
//           </div>
//         </div>

//         {/* Фігура */}
//         <div className="flex justify-between items-center">
//           <span className="text-base font-medium opacity-90">Фігура:</span>
//           <div className="flex gap-2">
//             <button
//               onClick={() => setPlayerSymbol('X')}
//               className={`px-4 py-2 text-base rounded-lg font-medium transition-all ${
//                 playerSymbol === 'X'
//                   ? 'bg-purple-600 text-white shadow-lg'
//                   : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
//               }`}
//             >
//               X
//             </button>
//             <button
//               onClick={() => setPlayerSymbol('O')}
//               className={`px-4 py-2 text-base rounded-lg font-medium transition-all ${
//                 playerSymbol === 'O'
//                   ? 'bg-purple-600 text-white shadow-lg'
//                   : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
//               }`}
//             >
//               O
//             </button>
//           </div>
//         </div>

//         {/* AI налаштування */}
//         {gameMode === 'ai' && (
//           <>
//             <div className="flex justify-between items-center">
//               <span className="text-base font-medium opacity-90">Перший хід:</span>
//               <div className="flex gap-2">
//                 <button
//                   onClick={() => setFirstMove('player')}
//                   className={`px-3 py-2 text-sm rounded-lg font-medium transition-all ${
//                     firstMove === 'player'
//                       ? 'bg-purple-600 text-white shadow-lg'
//                       : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
//                   }`}
//                 >
//                   Я
//                 </button>
//                 <button
//                   onClick={() => setFirstMove('ai')}
//                   className={`px-3 py-2 text-sm rounded-lg font-medium transition-all ${
//                     firstMove === 'ai'
//                       ? 'bg-purple-600 text-white shadow-lg'
//                       : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
//                   }`}
//                 >
//                   AI
//                 </button>
//                 <button
//                   onClick={() => setFirstMove('random')}
//                   className={`px-3 py-2 text-sm rounded-lg font-medium transition-all ${
//                     firstMove === 'random'
//                       ? 'bg-purple-600 text-white shadow-lg'
//                       : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
//                   }`}
//                 >
//                   Випадково
//                 </button>
//               </div>
//             </div>

//             <div className="flex justify-between items-center">
//               <span className="text-base font-medium opacity-90">Складність:</span>
//               <div className="flex gap-2">
//                 <button
//                   onClick={() => setDifficulty('easy')}
//                   className={`px-3 py-2 text-sm rounded-lg font-medium transition-all ${
//                     difficulty === 'easy'
//                       ? 'bg-green-600 text-white shadow-lg'
//                       : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
//                   }`}
//                 >
//                   Легка
//                 </button>
//                 <button
//                   onClick={() => setDifficulty('medium')}
//                   className={`px-3 py-2 text-sm rounded-lg font-medium transition-all ${
//                     difficulty === 'medium'
//                       ? 'bg-yellow-600 text-white shadow-lg'
//                       : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
//                   }`}
//                 >
//                   Середня
//                 </button>
//                 <button
//                   onClick={() => setDifficulty('hard')}
//                   className={`px-3 py-2 text-sm rounded-lg font-medium transition-all ${
//                     difficulty === 'hard'
//                       ? 'bg-red-600 text-white shadow-lg'
//                       : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
//                   }`}
//                 >
//                   Важка
//                 </button>
//               </div>
//             </div>
//           </>
//         )}

//         {/* PvP налаштування */}
//         {gameMode === 'pvp' && (
//           <>
//             <div className="flex justify-between items-center">
//               <span className="text-base font-medium opacity-90">Перший хід:</span>
//               <div className="flex gap-2">
//                 <button
//                   onClick={() => setFirstMove('player')}
//                   className={`px-3 py-2 text-sm rounded-lg font-medium transition-all ${
//                     firstMove === 'player'
//                       ? 'bg-purple-600 text-white shadow-lg'
//                       : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
//                   }`}
//                 >
//                   Я перший
//                 </button>
//                 <button
//                   onClick={() => setFirstMove('random')}
//                   className={`px-3 py-2 text-sm rounded-lg font-medium transition-all ${
//                     firstMove === 'random'
//                       ? 'bg-purple-600 text-white shadow-lg'
//                       : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
//                   }`}
//                 >
//                   Випадково
//                 </button>
//               </div>
//             </div>

//             {/* Ставка */}
//             <div className="flex justify-between items-center">
//               <span className="text-base font-medium opacity-90">Ставка:</span>
//               <div className="flex gap-4 items-center">
//                 <label className="flex items-center gap-2 cursor-pointer text-sm">
//                   <input
//                     type="radio"
//                     name="stake"
//                     checked={!hasStake}
//                     onChange={() => setHasStake(false)}
//                     className="w-4 h-4"
//                   />
//                   <span>Без ставки</span>
//                 </label>
//                 <label className="flex items-center gap-2 cursor-pointer text-sm">
//                   <input
//                     type="radio"
//                     name="stake"
//                     checked={hasStake}
//                     onChange={() => setHasStake(true)}
//                     className="w-4 h-4"
//                   />
//                   <span>Зі ставкою</span>
//                 </label>
//               </div>
//             </div>

//             {hasStake && (
//               <div className="flex justify-between items-center">
//                 <span className="text-base font-medium opacity-90">Сума:</span>
//                 <input
//                   type="number"
//                   value={stakeAmount}
//                   onChange={(e) => setStakeAmount(e.target.value)}
//                   placeholder="0.01"
//                   step="0.01"
//                   min="0.01"
//                   className="w-24 px-3 py-2 text-sm bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50"
//                 />
//               </div>
//             )}

//             {/* Доступ */}
//             <div className="flex justify-between items-center">
//               <span className="text-base font-medium opacity-90">Доступ:</span>
//               <div className="flex gap-4 items-center">
//                 <label className="flex items-center gap-2 cursor-pointer text-sm">
//                   <input
//                     type="radio"
//                     name="access"
//                     checked={gameAccess === 'public'}
//                     onChange={() => setGameAccess('public')}
//                     className="w-4 h-4"
//                   />
//                   <span>Публічна</span>
//                 </label>
//                 <label className="flex items-center gap-2 cursor-pointer text-sm">
//                   <input
//                     type="radio"
//                     name="access"
//                     checked={gameAccess === 'private'}
//                     onChange={() => setGameAccess('private')}
//                     className="w-4 h-4"
//                   />
//                   <span>Приватна</span>
//                 </label>
//               </div>
//             </div>
//           </>
//         )}
//       </div>

//       {/* Кнопки управління */}
//       <div className="space-y-3">
//         {/* Кнопка старту/рестарту */}
//         <button
//           onClick={handleStartNewGame}
//           className="w-full bg-purple-600 hover:bg-purple-700 py-4 px-6 rounded-xl font-bold text-lg text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
//         >
//           {gameState.gameState === 'setup' ? '🎮 ПОЧАТИ ГРУ' : '🔄 НОВА ГРА'}
//         </button>

//         {/* Додаткові кнопки під час гри */}
//         {gameState.gameActive && (
//           <div className="flex gap-3">
//             <button
//               onClick={() => gameState.pauseGame()}
//               className="flex-1 bg-yellow-600 hover:bg-yellow-700 py-2 px-4 rounded-lg font-medium text-white transition-all"
//             >
//               ⏸️ Пауза
//             </button>
//             <button
//               onClick={() => gameState.resetGame()}
//               className="flex-1 bg-red-600 hover:bg-red-700 py-2 px-4 rounded-lg font-medium text-white transition-all"
//             >
//               🔄 Скинути
//             </button>
//           </div>
//         )}

//         {/* Кнопка продовження */}
//         {gameState.gameState === 'paused' && (
//           <button
//             onClick={() => gameState.resumeGame()}
//             className="w-full bg-green-600 hover:bg-green-700 py-3 px-6 rounded-xl font-bold text-white transition-all"
//           >
//             ▶️ ПРОДОВЖИТИ
//           </button>
//         )}
//       </div>

//       {/* Статистика сесії */}
//       {gameState.sessionStats.gamesPlayed > 0 && (
//         <div className="mt-6 p-4 bg-white/5 rounded-xl">
//           <h4 className="text-sm font-semibold text-white/90 mb-2">📊 Статистика сесії</h4>
//           <div className="grid grid-cols-2 gap-3 text-xs">
//             <div className="flex justify-between">
//               <span className="text-white/70">Ігор:</span>
//               <span className="text-white">{gameState.sessionStats.gamesPlayed}</span>
//             </div>
//             <div className="flex justify-between">
//               <span className="text-white/70">Перемог:</span>
//               <span className="text-green-400">{gameState.sessionStats.wins}</span>
//             </div>
//             <div className="flex justify-between">
//               <span className="text-white/70">Поразок:</span>
//               <span className="text-red-400">{gameState.sessionStats.losses}</span>
//             </div>
//             <div className="flex justify-between">
//               <span className="text-white/70">% перемог:</span>
//               <span className="text-blue-400">{gameState.sessionStats.winRate.toFixed(1)}%</span>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );

//   // Заглушка для інших табів (зберігаємо існуючі)
//   const CreateTournamentTab = () => (
//     <div className="text-center py-8">
//       <h3 className="text-xl font-semibold text-white mb-4">🏆 Турніри</h3>
//       <p className="text-white/70">Функціональність турнірів буде додана пізніше</p>
//     </div>
//   );

//   const AvailableGamesTab = () => (
//     <div className="text-center py-8">
//       <h3 className="text-xl font-semibold text-white mb-4">📋 Доступні ігри</h3>
//       <p className="text-white/70">Пошук ігор буде додано пізніше</p>
//     </div>
//   );

//   return (
//     <div className={`
//       bg-gradient-to-br from-gray-800/50 via-purple-800/50 to-gray-800/50 
//       backdrop-blur-md rounded-3xl p-4 lg:p-6 shadow-2xl 
//       border border-purple-500/20
//       ${className}
//     `}>
//       {/* Таби */}
//       <div className="flex gap-1 mb-6 bg-white/10 rounded-xl p-1">
//         <button
//           onClick={() => setActiveTab('create-game')}
//           className={`
//             flex-1 flex flex-col items-center gap-1 py-2 px-2 rounded-lg transition-all duration-300 text-xs
//             ${activeTab === 'create-game'
//               ? 'bg-purple-600 text-white'
//               : 'text-white/70 hover:text-white hover:bg-white/10'
//             }
//           `}
//         >
//           <span className="text-sm">🎮</span>
//           <span className="font-medium leading-tight text-center">Створити гру</span>
//         </button>
//         <button
//           onClick={() => setActiveTab('create-tournament')}
//           className={`
//             flex-1 flex flex-col items-center gap-1 py-2 px-2 rounded-lg transition-all duration-300 text-xs
//             ${activeTab === 'create-tournament'
//               ? 'bg-purple-600 text-white'
//               : 'text-white/70 hover:text-white hover:bg-white/10'
//             }
//           `}
//         >
//           <span className="text-sm">🏆</span>
//           <span className="font-medium leading-tight text-center">Створити турнір</span>
//         </button>
//         <button
//           onClick={() => setActiveTab('available-games')}
//           className={`
//             flex-1 flex flex-col items-center gap-1 py-2 px-2 rounded-lg transition-all duration-300 text-xs
//             ${activeTab === 'available-games'
//               ? 'bg-purple-600 text-white'
//               : 'text-white/70 hover:text-white hover:bg-white/10'
//             }
//           `}
//         >
//           <span className="text-sm">📋</span>
//           <span className="font-medium leading-tight text-center">Доступні ігри</span>
//         </button>
//       </div>

//       {/* Контент залежно від активного табу */}
//       <div className="min-h-[400px]">
//         {activeTab === 'create-game' && <CreateGameTab />}
//         {activeTab === 'create-tournament' && <CreateTournamentTab />}
//         {activeTab === 'available-games' && <AvailableGamesTab />}
//       </div>
//     </div>
//   );
// }



















































// // components/game/sections/GameSection.tsx
// // Головний компонент ігрової секції з інтеграцією всіх нових хуків
// // ✅ Використовує useGameState для управління станом
// // ✅ Інтегрує GameStatus, GameTimer, ProgressBar
// // ✅ Зберігає існуючий інтерфейс
// // ✅ Підтримує AI та PvP режими

// 'use client';

// import React, { useCallback, useEffect } from 'react';
// import { useGameState } from '../../../../hooks/useGameState';
// import GameStatus from '../ui/GameStatus';
// import GameTimer from '../ui/GameTimer';
// import ProgressBar from '../ui/ProgressBar';

// import type { 
//   GameMode, 
//   Player, 
//   BoardSize, 
//   Difficulty,
//   FirstMove,
//   GameAccess
// } from '../../../../types/game';

// // Типи для табів
// type GameTab = 'create-game' | 'create-tournament' | 'available-games';

// interface GameSectionProps {
//   className?: string;
// }

// const DECORATIVE_ICONS = [
//   'aijarvis.jpg',
//   'bean.jpg', 
//   'berzan.jpg',
//   'cultverse.jpg',
//   'enjoyoors.jpg',
//   'fantasy.jpg',
//   'keone.jpg',
//   'kintsu.png',
//   'kizzy.jpg',
//   'laMouch.jpg',
//   'lootgo.jpg',
//   'magicEden.jpg',
//   'medusa.jpg',
//   'mikeinweb.png',
//   'monadverse.jpg',
//   'monorail.png',
//   'moyaking.jpg',
//   'nadsa.jpg',
//   'narwhal.jpg',
//   'pump.jpg',
//   'purps.png',
//   'rugRumble.png',
//   'talentum.jpg',
//   'thedaks.jpg',
//   'thevapelabs.jpg'
// ].map(filename => `/game-icons/${filename}`);

// // Функція для отримання випадкових іконок
// const getRandomIcons = (count: number): string[] => {
//   const shuffled = [...DECORATIVE_ICONS].sort(() => 0.5 - Math.random());
//   return shuffled.slice(0, count);
// };

// export default function GameSection({ className = '' }: GameSectionProps) {
//   // Стан інтерфейсу (зберігаємо існуючу логіку)
//   const [activeTab, setActiveTab] = React.useState<GameTab>('create-game');
//   const [gameMode, setGameMode] = React.useState<GameMode>('ai');
  
//   // Налаштування гри (зберігаємо існуючі)
//   const [boardSize, setBoardSize] = React.useState<BoardSize>(3);
//   const [playerSymbol, setPlayerSymbol] = React.useState<Player>('X');
//   const [firstMove, setFirstMove] = React.useState<FirstMove>('random');
//   const [difficulty, setDifficulty] = React.useState<Difficulty>('medium');
//   const [hasStake, setHasStake] = React.useState(false);
//   const [stakeAmount, setStakeAmount] = React.useState('');
//   const [gameAccess, setGameAccess] = React.useState<GameAccess>('public');
//   const [decorativeIcons, setDecorativeIcons] = React.useState<string[]>([]);
//   // 1. ДОДАТИ НОВИЙ СТАН для відстежування зміни розміру поля:
//   const [lastBoardSize, setLastBoardSize] = React.useState<BoardSize>(boardSize);
//   const [showIconsAfterSizeChange, setShowIconsAfterSizeChange] = React.useState(false);

//   // Ініціалізуємо новий хук управління грою
//   const gameState = useGameState({
//     initialSettings: {
//       boardSize,
//       gameMode,
//       playerSymbol,
//       aiDifficulty: difficulty,
//       timerEnabled: true,
//       timePerMove: 22,
//       aiThinkingTime: 1000
//     },
//     onGameEnd: (result, winner) => {
//       console.log('Гра завершена:', { result, winner });
//       // Тут можна додати логіку показу результатів
//     },
//     onStatisticsUpdate: (stats) => {
//       console.log('Статистика оновлена:', stats);
//     },
//     // persistGame: true
//   });

//   // Додати тут:
//   useEffect(() => {
//     const iconCount = boardSize * boardSize;
//     setDecorativeIcons(getRandomIcons(iconCount));
    
//     // Перевіряємо чи змінився розмір поля
//     if (lastBoardSize !== boardSize) {
//       console.log('📐 Розмір поля змінено з', lastBoardSize, 'на', boardSize);
//       setShowIconsAfterSizeChange(true);
//       setLastBoardSize(boardSize);
//     }
//   }, [boardSize, lastBoardSize]);

//   // Обробка кліку по клітинці
//   const handleCellClick = useCallback(async (index: number) => {
//     // Додати debug інформацію:
//     if (boardSize === 4) {
//       console.log('🎯 Клік по клітинці:', {
//         index,
//         isRestricted: gameState.restrictedCells.includes(index),
//         canMakeMove: gameState.canMakeMoveWithRestrictions(index),
//         restrictedCells: gameState.restrictedCells,
//         currentPlayer: gameState.currentPlayer,
//         firstPlayer: gameState.firstPlayer
//       });
//     }

//     if (!gameState.canMakeMove(index)) return;
    
//     await gameState.makeMove(index);
//   }, [gameState, boardSize]);

//   const determineFirstPlayer = useCallback((): Player => {
//     if (gameMode === 'ai') {
//       switch (firstMove) {
//         case 'player': return playerSymbol;
//         case 'ai': return playerSymbol === 'X' ? 'O' : 'X';
//         case 'random': return Math.random() < 0.5 ? playerSymbol : (playerSymbol === 'X' ? 'O' : 'X');
//       }
//     }
//     return playerSymbol;
//   }, [firstMove, playerSymbol, gameMode]);

//   // Початок нової гри
//   const handleStartNewGame = useCallback(() => {
//     setShowIconsAfterSizeChange(false);

//     const firstPlayer = determineFirstPlayer(); // Використовуйте цю функцію
//     // Оновлюємо налаштування перед початком
//     gameState.updateSettings({
//       boardSize,
//       gameMode,
//       playerSymbol,
//       aiDifficulty: difficulty,
//       timerEnabled: true,
//       timePerMove: 22,
//       aiThinkingTime: 1000
//     });
    
//     gameState.startNewGame(firstPlayer);

//     console.log('Налаштування гри:', {
//       gameMode: gameState.settings.gameMode,
//       playerSymbol: gameState.settings.playerSymbol,
//       firstPlayer, // Додайте цей лог
//       currentPlayer: gameState.currentPlayer,
//       isPlayerTurn: gameState.currentPlayer === gameState.settings.playerSymbol,
//       showIconsAfterSizeChange: false // ✅ ДОДАНО ДЛЯ DEBUG
//     });
//   }, [gameState, boardSize, gameMode, playerSymbol, difficulty, determineFirstPlayer, firstMove]);

//   // Синхронізація налаштувань
//   useEffect(() => {
//     gameState.updateSettings({
//       boardSize,
//       gameMode,
//       playerSymbol,
//       aiDifficulty: difficulty
//     });
//   }, [boardSize, gameMode, playerSymbol, difficulty]);

//   // Замінити функцію renderGameBoard() на цю:
//   const renderGameBoard = () => {
//     const gridSize = boardSize === 3 ? 'grid-cols-3' : 'grid-cols-4';
//     const boardWidth = boardSize === 3 ? 'w-64' : 'w-80';  // ✅ Різні розміри
//     const cellSize = boardSize === 3 ? 'w-16 h-16' : 'w-16 h-16';
  
//     // Адаптивна висота для grid контейнера
//     const gridHeight = boardSize === 3 ? 'h-48' : 'h-64';  // ✅ Пропорційні висоти
//     // 🔍 DEBUG
//   console.log('🎯 Board render:', { 
//     boardSize, 
//     boardWidth, 
//     gridSize 
//   });
  

//     // // Фіксована висота для grid контейнера
//     // const gridHeight = boardSize === 3 ? 'h-[200px]' : 'h-[264px]';

//     const shouldShowIcons = gameState.gameState === 'setup' || showIconsAfterSizeChange;

//     console.log('🖼️ Стан іконок:', {
//       gameState: gameState.gameState,
//       showIconsAfterSizeChange,
//       shouldShowIcons,
//       boardSize
//     });
    
//     return (
//       <div className={`bg-white/10 rounded-xl p-4 mb-6 min-h-[400px] flex flex-col justify-center`}>
//         {/* Додаємо overflow-hidden та фіксовану висоту */}
//         <div 
//           className="mx-auto flex items-center justify-center transition-all duration-300"
//           style={{ 
//             width: boardSize === 3 ? '16rem' : '20rem' // 256px : 320px
//           }}
//         >
//           <div className={`grid ${gridSize} gap-2 ${gridHeight} place-content-center`}>
//             {gameState.board.map((cell, index) => {

//               // Додайте цю перевірку:
//             const maxIconIndex = boardSize * boardSize - 1;
//             if (shouldShowIcons && index > maxIconIndex) {
//               return null; // Не рендеримо зайві іконки
//             }
            
//             // Перевірка обмежень для 4×4
//             const isRestricted = gameState.restrictedCells.includes(index);
//             const canClick = gameState.canMakeMoveWithRestrictions ? 
//               gameState.canMakeMoveWithRestrictions(index) : 
//               gameState.canMakeMove(index);
            
//             return (
//               <button
//                 key={index}
//                 onClick={() => handleCellClick(index)}
//                 disabled={!gameState.gameActive || !canClick}
//                 title={isRestricted ? 'Заборонено правилами 4×4: другий хід не може бути поруч з першим' : undefined}
//                 className={`
//                   ${cellSize} rounded-xl flex items-center justify-center 
//                   text-2xl font-bold transition-all duration-300 hover:scale-105
//                   disabled:cursor-not-allowed overflow-hidden relative
//                   ${gameState.winningLine.includes(index) ? 'bg-green-500/50' : ''}
//                   ${shouldShowIcons ? 
//                     // Для іконок: без фону, тільки рамка
//                     'bg-transparent border-2 border-white/20 hover:border-white/40' : 
//                     // Для гри: звичайний фон
//                     isRestricted ? 
//                       'bg-white/20 hover:bg-white/30 cursor-not-allowed' : 
//                       'bg-white/20 hover:bg-white/30'
//                   }
//                   ${!canClick && !shouldShowIcons ? 'opacity-50' : ''}
//                 `}
//               >
//                 {/* ✅ ВИПРАВЛЕНА ЛОГІКА ВІДОБРАЖЕННЯ: */}
//                 {shouldShowIcons ? (
//                   // До початку гри або після зміни розміру показуємо декоративні іконки
//                   <>
//                     <img 
//                       src={decorativeIcons[index] || '/game-icons/aijarvis.jpg'} 
//                       alt={`Декоративна іконка ${index + 1}`}
//                       className="absolute inset-0 w-full h-full object-cover rounded-lg
//                                transition-all duration-300 hover:scale-110"
//                       style={{ aspectRatio: '1 / 1' }}
//                       onError={(e) => {
//                         // Fallback до emoji якщо іконка не завантажилась
//                         const target = e.target as HTMLImageElement;
//                         target.style.display = 'none';
//                         const parent = target.parentElement!;
//                         parent.classList.add('bg-gradient-to-br', 'from-purple-500/50', 'to-blue-500/50');
//                         parent.innerHTML += '<span class="absolute inset-0 flex items-center justify-center text-3xl">🎮</span>';
//                       }}
//                     />
//                     {/* Градієнтний overlay для кращого вигляду */}
//                     <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/10 rounded-lg"></div>
//                   </>
//                 ) : (
//                   // Під час гри показуємо X/O або порожні клітинки
//                   <span className="z-10 relative">{cell}</span>
//                 )}
//               </button>
//             );
//           })}
//         </div>
//       </div>
        
//         {/* Інформація про обмеження (без змін) */}
//         {boardSize === 4 && gameState.restrictionInfo.hasRestrictions && (
//           <div className="mt-3 p-2 bg-red-500/20 rounded-lg border border-red-400/30">
//             <div className="flex items-center gap-2 text-sm text-red-200">
//               <span>⚠️</span>
//               <span>{gameState.restrictionInfo.reasonDescription}</span>
//             </div>
//           </div>
//         )}
//         </div>
//       );
//     };

//   // Рендеринг статусу гри та таймера
//   const renderGameStatus = () => {
//     return (
//       <div className="space-y-4 mb-6">
//         {/* Статус гри */}
//         <GameStatus
//           gameState={gameState.gameState}
//           currentPlayer={gameState.currentPlayer}
//           gameResult={gameState.gameResult}
//           gameMode={gameMode}
//           playerSymbol={playerSymbol}
//           isAIThinking={gameState.isAIThinking}
//           aiDifficulty={difficulty}
//           variant="default"
//           // Додати ці рядки:
//           boardSize={boardSize}
//           restrictionInfo={gameState.restrictionInfo}
//           firstPlayer={gameState.firstPlayer}
//         />

//         {/* Таймер (якщо гра активна) */}
//         {gameState.gameActive && gameState.settings.timerEnabled && (
//           <div className="flex items-center justify-center">
//             <GameTimer
//               timeLeft={gameState.timeLeft}
//               maxTime={gameState.settings.timePerMove}
//               isRunning={gameState.isTimerRunning}
//               isPaused={gameState.gameState === 'paused'}
//               size="large"
//               showIcon={true}
//             />
//           </div>
//         )}

//         {/* Прогрес гри */}
//         {gameState.gameActive && (
//           <ProgressBar
//             value={gameState.gameStats.moves}
//             maxValue={boardSize * boardSize}
//             label="Прогрес гри"
//             variant="default"
//             size="medium"
//             showValues={true}
//             animated={true}
//           />
//         )}
//       </div>
//     );
//   };

//   // Компонент створення гри (зберігаємо існуючий дизайн)
//   const CreateGameTab = () => (
//     <div className="space-y-4">
//       {/* Режим AI/PvP */}
//       <div className="flex gap-3 mb-6">
//         <button
//           onClick={() => setGameMode('ai')}
//           className={`flex-1 py-3 px-4 rounded-xl font-semibold text-base transition-all ${
//             gameMode === 'ai'
//               ? 'bg-purple-600 text-white shadow-lg'
//               : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
//           }`}
//         >
//           🤖 AI
//         </button>
//         <button
//           onClick={() => setGameMode('pvp')}
//           className={`flex-1 py-3 px-4 rounded-xl font-semibold text-base transition-all ${
//             gameMode === 'pvp'
//               ? 'bg-purple-600 text-white shadow-lg'
//               : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
//           }`}
//         >
//           ⚔️ PvP
//         </button>
//       </div>

//       {/* Назва гри */}
//       <div className="text-center text-xl font-semibold mb-6 flex items-center justify-center gap-2">
//         🎮 Хрестики-нулики
//       </div>

//       {/* Статус гри та таймер */}
//       {gameState.gameState !== 'setup' && renderGameStatus()}

//       {/* Ігрове поле */}
//       {renderGameBoard()}

//       {/* Компактні налаштування */}
//       <div className="space-y-4">
//         {/* Розмір поля */}
//         <div className="flex justify-between items-center">
//           <span className="text-base font-medium opacity-90">Розмір:</span>
//           <div className="flex gap-2">
//             {/* <button
//               onClick={() => setBoardSize(3)}
//               className={`px-4 py-2 text-base rounded-lg font-medium transition-all ${
//                 boardSize === 3
//                   ? 'bg-purple-600 text-white shadow-lg'
//                   : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
//               }`}
//             >
//               3×3
//             </button>
//             <button
//               onClick={() => setBoardSize(4)}
//               className={`px-4 py-2 text-base rounded-lg font-medium transition-all ${
//                 boardSize === 4
//                   ? 'bg-purple-600 text-white shadow-lg'
//                   : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
//               }`}
//             >
//               4×4
//             </button> */}
//             <button
//               onClick={() => {
//                 console.log('🔘 Натиснуто кнопку 3×3');
//                 setBoardSize(3);
//                 // Якщо гра не в стані setup, показуємо іконки
//                 if (gameState.gameState !== 'setup') {
//                   setShowIconsAfterSizeChange(true);
//                 }
//               }}
//               className={`px-4 py-2 text-base rounded-lg font-medium transition-all ${
//                 boardSize === 3
//                   ? 'bg-purple-600 text-white shadow-lg'
//                   : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
//               }`}
//             >
//               3×3
//             </button>
//             <button
//               onClick={() => {
//                 console.log('🔘 Натиснуто кнопку 4×4');
//                 setBoardSize(4);
//                 // Якщо гра не в стані setup, показуємо іконки
//                 if (gameState.gameState !== 'setup') {
//                   setShowIconsAfterSizeChange(true);
//                 }
//               }}
//               className={`px-4 py-2 text-base rounded-lg font-medium transition-all ${
//                 boardSize === 4
//                   ? 'bg-purple-600 text-white shadow-lg'
//                   : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
//               }`}
//             >
//               4×4
//             </button>
//           </div>
//         </div>

//         {/* Фігура */}
//         <div className="flex justify-between items-center">
//           <span className="text-base font-medium opacity-90">Фігура:</span>
//           <div className="flex gap-2">
//             <button
//               onClick={() => setPlayerSymbol('X')}
//               className={`px-4 py-2 text-base rounded-lg font-medium transition-all ${
//                 playerSymbol === 'X'
//                   ? 'bg-purple-600 text-white shadow-lg'
//                   : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
//               }`}
//             >
//               X
//             </button>
//             <button
//               onClick={() => setPlayerSymbol('O')}
//               className={`px-4 py-2 text-base rounded-lg font-medium transition-all ${
//                 playerSymbol === 'O'
//                   ? 'bg-purple-600 text-white shadow-lg'
//                   : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
//               }`}
//             >
//               O
//             </button>
//           </div>
//         </div>

//         {/* AI налаштування */}
//         {gameMode === 'ai' && (
//           <>
//             <div className="flex justify-between items-center">
//               <span className="text-base font-medium opacity-90">Перший хід:</span>
//               <div className="flex gap-2">
//                 <button
//                   onClick={() => setFirstMove('player')}
//                   className={`px-3 py-2 text-sm rounded-lg font-medium transition-all ${
//                     firstMove === 'player'
//                       ? 'bg-purple-600 text-white shadow-lg'
//                       : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
//                   }`}
//                 >
//                   Я
//                 </button>
//                 <button
//                   onClick={() => setFirstMove('ai')}
//                   className={`px-3 py-2 text-sm rounded-lg font-medium transition-all ${
//                     firstMove === 'ai'
//                       ? 'bg-purple-600 text-white shadow-lg'
//                       : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
//                   }`}
//                 >
//                   AI
//                 </button>
//                 <button
//                   onClick={() => setFirstMove('random')}
//                   className={`px-3 py-2 text-sm rounded-lg font-medium transition-all ${
//                     firstMove === 'random'
//                       ? 'bg-purple-600 text-white shadow-lg'
//                       : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
//                   }`}
//                 >
//                   Випадково
//                 </button>
//               </div>
//             </div>

//             <div className="flex justify-between items-center">
//               <span className="text-base font-medium opacity-90">Складність:</span>
//               <div className="flex gap-2">
//                 <button
//                   onClick={() => setDifficulty('easy')}
//                   className={`px-3 py-2 text-sm rounded-lg font-medium transition-all ${
//                     difficulty === 'easy'
//                       ? 'bg-green-600 text-white shadow-lg'
//                       : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
//                   }`}
//                 >
//                   Легка
//                 </button>
//                 <button
//                   onClick={() => setDifficulty('medium')}
//                   className={`px-3 py-2 text-sm rounded-lg font-medium transition-all ${
//                     difficulty === 'medium'
//                       ? 'bg-yellow-600 text-white shadow-lg'
//                       : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
//                   }`}
//                 >
//                   Середня
//                 </button>
//                 <button
//                   onClick={() => setDifficulty('hard')}
//                   className={`px-3 py-2 text-sm rounded-lg font-medium transition-all ${
//                     difficulty === 'hard'
//                       ? 'bg-red-600 text-white shadow-lg'
//                       : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
//                   }`}
//                 >
//                   Важка
//                 </button>
//               </div>
//             </div>
//           </>
//         )}

//         {/* PvP налаштування */}
//         {gameMode === 'pvp' && (
//           <>
//             <div className="flex justify-between items-center">
//               <span className="text-base font-medium opacity-90">Перший хід:</span>
//               <div className="flex gap-2">
//                 <button
//                   onClick={() => setFirstMove('player')}
//                   className={`px-3 py-2 text-sm rounded-lg font-medium transition-all ${
//                     firstMove === 'player'
//                       ? 'bg-purple-600 text-white shadow-lg'
//                       : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
//                   }`}
//                 >
//                   Я перший
//                 </button>
//                 <button
//                   onClick={() => setFirstMove('random')}
//                   className={`px-3 py-2 text-sm rounded-lg font-medium transition-all ${
//                     firstMove === 'random'
//                       ? 'bg-purple-600 text-white shadow-lg'
//                       : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
//                   }`}
//                 >
//                   Випадково
//                 </button>
//               </div>
//             </div>

//             {/* Ставка */}
//             <div className="flex justify-between items-center">
//               <span className="text-base font-medium opacity-90">Ставка:</span>
//               <div className="flex gap-4 items-center">
//                 <label className="flex items-center gap-2 cursor-pointer text-sm">
//                   <input
//                     type="radio"
//                     name="stake"
//                     checked={!hasStake}
//                     onChange={() => setHasStake(false)}
//                     className="w-4 h-4"
//                   />
//                   <span>Без ставки</span>
//                 </label>
//                 <label className="flex items-center gap-2 cursor-pointer text-sm">
//                   <input
//                     type="radio"
//                     name="stake"
//                     checked={hasStake}
//                     onChange={() => setHasStake(true)}
//                     className="w-4 h-4"
//                   />
//                   <span>Зі ставкою</span>
//                 </label>
//               </div>
//             </div>

//             {hasStake && (
//               <div className="flex justify-between items-center">
//                 <span className="text-base font-medium opacity-90">Сума:</span>
//                 <input
//                   type="number"
//                   value={stakeAmount}
//                   onChange={(e) => setStakeAmount(e.target.value)}
//                   placeholder="0.01"
//                   step="0.01"
//                   min="0.01"
//                   className="w-24 px-3 py-2 text-sm bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50"
//                 />
//               </div>
//             )}

//             {/* Доступ */}
//             <div className="flex justify-between items-center">
//               <span className="text-base font-medium opacity-90">Доступ:</span>
//               <div className="flex gap-4 items-center">
//                 <label className="flex items-center gap-2 cursor-pointer text-sm">
//                   <input
//                     type="radio"
//                     name="access"
//                     checked={gameAccess === 'public'}
//                     onChange={() => setGameAccess('public')}
//                     className="w-4 h-4"
//                   />
//                   <span>Публічна</span>
//                 </label>
//                 <label className="flex items-center gap-2 cursor-pointer text-sm">
//                   <input
//                     type="radio"
//                     name="access"
//                     checked={gameAccess === 'private'}
//                     onChange={() => setGameAccess('private')}
//                     className="w-4 h-4"
//                   />
//                   <span>Приватна</span>
//                 </label>
//               </div>
//             </div>
//           </>
//         )}
//       </div>

//       {/* Кнопки управління */}
//       <div className="space-y-3">
//         {/* Кнопка старту/рестарту */}
//         <button
//           onClick={handleStartNewGame}
//           className="w-full bg-purple-600 hover:bg-purple-700 py-4 px-6 rounded-xl font-bold text-lg text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
//         >
//           {gameState.gameState === 'setup' ? '🎮 ПОЧАТИ ГРУ' : '🔄 НОВА ГРА'}
//         </button>

//         {/* Додаткові кнопки під час гри */}
//         {gameState.gameActive && (
//           <div className="flex gap-3">
//             <button
//               onClick={() => gameState.pauseGame()}
//               className="flex-1 bg-yellow-600 hover:bg-yellow-700 py-2 px-4 rounded-lg font-medium text-white transition-all"
//             >
//               ⏸️ Пауза
//             </button>
//             <button
//               onClick={() => gameState.resetGame()}
//               className="flex-1 bg-red-600 hover:bg-red-700 py-2 px-4 rounded-lg font-medium text-white transition-all"
//             >
//               🔄 Скинути
//             </button>
//           </div>
//         )}

//         {/* Кнопка продовження */}
//         {gameState.gameState === 'paused' && (
//           <button
//             onClick={() => gameState.resumeGame()}
//             className="w-full bg-green-600 hover:bg-green-700 py-3 px-6 rounded-xl font-bold text-white transition-all"
//           >
//             ▶️ ПРОДОВЖИТИ
//           </button>
//         )}
//       </div>

//       {/* Статистика сесії */}
//       {gameState.sessionStats.gamesPlayed > 0 && (
//         <div className="mt-6 p-4 bg-white/5 rounded-xl">
//           <h4 className="text-sm font-semibold text-white/90 mb-2">📊 Статистика сесії</h4>
//           <div className="grid grid-cols-2 gap-3 text-xs">
//             <div className="flex justify-between">
//               <span className="text-white/70">Ігор:</span>
//               <span className="text-white">{gameState.sessionStats.gamesPlayed}</span>
//             </div>
//             <div className="flex justify-between">
//               <span className="text-white/70">Перемог:</span>
//               <span className="text-green-400">{gameState.sessionStats.wins}</span>
//             </div>
//             <div className="flex justify-between">
//               <span className="text-white/70">Поразок:</span>
//               <span className="text-red-400">{gameState.sessionStats.losses}</span>
//             </div>
//             <div className="flex justify-between">
//               <span className="text-white/70">% перемог:</span>
//               <span className="text-blue-400">{gameState.sessionStats.winRate.toFixed(1)}%</span>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );

//   // Заглушка для інших табів (зберігаємо існуючі)
//   const CreateTournamentTab = () => (
//     <div className="text-center py-8">
//       <h3 className="text-xl font-semibold text-white mb-4">🏆 Турніри</h3>
//       <p className="text-white/70">Функціональність турнірів буде додана пізніше</p>
//     </div>
//   );

//   const AvailableGamesTab = () => (
//     <div className="text-center py-8">
//       <h3 className="text-xl font-semibold text-white mb-4">📋 Доступні ігри</h3>
//       <p className="text-white/70">Пошук ігор буде додано пізніше</p>
//     </div>
//   );

//   return (
//     <div className={`
//       bg-gradient-to-br from-gray-800/50 via-purple-800/50 to-gray-800/50 
//       backdrop-blur-md rounded-3xl p-4 lg:p-6 shadow-2xl 
//       border border-purple-500/20
//       ${className}
//     `}>
//       {/* Таби */}
//       <div className="flex gap-1 mb-6 bg-white/10 rounded-xl p-1">
//         <button
//           onClick={() => setActiveTab('create-game')}
//           className={`
//             flex-1 flex flex-col items-center gap-1 py-2 px-2 rounded-lg transition-all duration-300 text-xs
//             ${activeTab === 'create-game'
//               ? 'bg-purple-600 text-white'
//               : 'text-white/70 hover:text-white hover:bg-white/10'
//             }
//           `}
//         >
//           <span className="text-sm">🎮</span>
//           <span className="font-medium leading-tight text-center">Створити гру</span>
//         </button>
//         <button
//           onClick={() => setActiveTab('create-tournament')}
//           className={`
//             flex-1 flex flex-col items-center gap-1 py-2 px-2 rounded-lg transition-all duration-300 text-xs
//             ${activeTab === 'create-tournament'
//               ? 'bg-purple-600 text-white'
//               : 'text-white/70 hover:text-white hover:bg-white/10'
//             }
//           `}
//         >
//           <span className="text-sm">🏆</span>
//           <span className="font-medium leading-tight text-center">Створити турнір</span>
//         </button>
//         <button
//           onClick={() => setActiveTab('available-games')}
//           className={`
//             flex-1 flex flex-col items-center gap-1 py-2 px-2 rounded-lg transition-all duration-300 text-xs
//             ${activeTab === 'available-games'
//               ? 'bg-purple-600 text-white'
//               : 'text-white/70 hover:text-white hover:bg-white/10'
//             }
//           `}
//         >
//           <span className="text-sm">📋</span>
//           <span className="font-medium leading-tight text-center">Доступні ігри</span>
//         </button>
//       </div>

//       {/* Контент залежно від активного табу */}
//       <div className="min-h-[400px]">
//         {activeTab === 'create-game' && <CreateGameTab />}
//         {activeTab === 'create-tournament' && <CreateTournamentTab />}
//         {activeTab === 'available-games' && <AvailableGamesTab />}
//       </div>
//     </div>
//   );
// }

































// // components/game/sections/GameSection.tsx
// // Головний компонент ігрової секції з інтеграцією всіх нових хуків
// // ✅ Використовує useGameState для управління станом
// // ✅ Інтегрує GameStatus, GameTimer, ProgressBar
// // ✅ Зберігає існуючий інтерфейс
// // ✅ Підтримує AI та PvP режими

// 'use client';

// import React, { useCallback, useEffect } from 'react';
// import { useGameState } from '../../../../hooks/useGameState';
// import GameStatus from '../ui/GameStatus';
// import GameTimer from '../ui/GameTimer';
// import ProgressBar from '../ui/ProgressBar';

// import type { 
//   GameMode, 
//   Player, 
//   BoardSize, 
//   Difficulty,
//   FirstMove,
//   GameAccess
// } from '../../../../types/game';

// // Типи для табів
// type GameTab = 'create-game' | 'create-tournament' | 'available-games';

// interface GameSectionProps {
//   className?: string;
// }

// const DECORATIVE_ICONS = [
//   'aijarvis.jpg',
//   'bean.jpg', 
//   'berzan.jpg',
//   'cultverse.jpg',
//   'enjoyoors.jpg',
//   'fantasy.jpg',
//   'keone.jpg',
//   'kintsu.png',
//   'kizzy.jpg',
//   'laMouch.jpg',
//   'lootgo.jpg',
//   'magicEden.jpg',
//   'medusa.jpg',
//   'mikeinweb.png',
//   'monadverse.jpg',
//   'monorail.png',
//   'moyaking.jpg',
//   'nadsa.jpg',
//   'narwhal.jpg',
//   'pump.jpg',
//   'purps.png',
//   'rugRumble.png',
//   'talentum.jpg',
//   'thedaks.jpg',
//   'thevapelabs.jpg'
// ].map(filename => `/game-icons/${filename}`);

// // Функція для отримання випадкових іконок
// const getRandomIcons = (count: number): string[] => {
//   const shuffled = [...DECORATIVE_ICONS].sort(() => 0.5 - Math.random());
//   return shuffled.slice(0, count);
// };

// export default function GameSection({ className = '' }: GameSectionProps) {
//   // Стан інтерфейсу (зберігаємо існуючу логіку)
//   const [activeTab, setActiveTab] = React.useState<GameTab>('create-game');
//   const [gameMode, setGameMode] = React.useState<GameMode>('ai');
  
//   // Налаштування гри (зберігаємо існуючі)
//   const [boardSize, setBoardSize] = React.useState<BoardSize>(3);
//   const [playerSymbol, setPlayerSymbol] = React.useState<Player>('X');
//   const [firstMove, setFirstMove] = React.useState<FirstMove>('random');
//   const [difficulty, setDifficulty] = React.useState<Difficulty>('medium');
//   const [hasStake, setHasStake] = React.useState(false);
//   const [stakeAmount, setStakeAmount] = React.useState('');
//   const [gameAccess, setGameAccess] = React.useState<GameAccess>('public');
//   const [decorativeIcons, setDecorativeIcons] = React.useState<string[]>([]);
//   // 1. ДОДАТИ НОВИЙ СТАН для відстежування зміни розміру поля:
//   const [lastBoardSize, setLastBoardSize] = React.useState<BoardSize>(boardSize);
//   const [showIconsAfterSizeChange, setShowIconsAfterSizeChange] = React.useState(false);

//   // Ініціалізуємо новий хук управління грою
//   const gameState = useGameState({
//     initialSettings: {
//       boardSize,
//       gameMode,
//       playerSymbol,
//       aiDifficulty: difficulty,
//       timerEnabled: true,
//       timePerMove: 22,
//       aiThinkingTime: 1000
//     },
//     onGameEnd: (result, winner) => {
//       console.log('Гра завершена:', { result, winner });
//       // Тут можна додати логіку показу результатів
//     },
//     onStatisticsUpdate: (stats) => {
//       console.log('Статистика оновлена:', stats);
//     },
//     // persistGame: true
//   });

//   // Додати тут:
//   useEffect(() => {
//     const iconCount = boardSize * boardSize;
//     setDecorativeIcons(getRandomIcons(iconCount));
    
//     // Перевіряємо чи змінився розмір поля
//     if (lastBoardSize !== boardSize) {
//       console.log('📐 Розмір поля змінено з', lastBoardSize, 'на', boardSize);
//       setShowIconsAfterSizeChange(true);
//       setLastBoardSize(boardSize);
//     }
//   }, [boardSize, lastBoardSize]);

//   // Обробка кліку по клітинці
//   const handleCellClick = useCallback(async (index: number) => {
//     // Додати debug інформацію:
//     if (boardSize === 4) {
//       console.log('🎯 Клік по клітинці:', {
//         index,
//         isRestricted: gameState.restrictedCells.includes(index),
//         canMakeMove: gameState.canMakeMoveWithRestrictions(index),
//         restrictedCells: gameState.restrictedCells,
//         currentPlayer: gameState.currentPlayer,
//         firstPlayer: gameState.firstPlayer
//       });
//     }

//     if (!gameState.canMakeMove(index)) return;
    
//     await gameState.makeMove(index);
//   }, [gameState, boardSize]);

//   const determineFirstPlayer = useCallback((): Player => {
//     if (gameMode === 'ai') {
//       switch (firstMove) {
//         case 'player': return playerSymbol;
//         case 'ai': return playerSymbol === 'X' ? 'O' : 'X';
//         case 'random': return Math.random() < 0.5 ? playerSymbol : (playerSymbol === 'X' ? 'O' : 'X');
//       }
//     }
//     return playerSymbol;
//   }, [firstMove, playerSymbol, gameMode]);

//   // Початок нової гри
//   const handleStartNewGame = useCallback(() => {
//     setShowIconsAfterSizeChange(false);

//     const firstPlayer = determineFirstPlayer(); // Використовуйте цю функцію
//     // Оновлюємо налаштування перед початком
//     gameState.updateSettings({
//       boardSize,
//       gameMode,
//       playerSymbol,
//       aiDifficulty: difficulty,
//       timerEnabled: true,
//       timePerMove: 22,
//       aiThinkingTime: 1000
//     });
    
//     gameState.startNewGame(firstPlayer);

//     console.log('Налаштування гри:', {
//       gameMode: gameState.settings.gameMode,
//       playerSymbol: gameState.settings.playerSymbol,
//       firstPlayer, // Додайте цей лог
//       currentPlayer: gameState.currentPlayer,
//       isPlayerTurn: gameState.currentPlayer === gameState.settings.playerSymbol,
//       showIconsAfterSizeChange: false // ✅ ДОДАНО ДЛЯ DEBUG
//     });
//   }, [gameState, boardSize, gameMode, playerSymbol, difficulty, determineFirstPlayer, firstMove]);

//   // Синхронізація налаштувань
//   useEffect(() => {
//     gameState.updateSettings({
//       boardSize,
//       gameMode,
//       playerSymbol,
//       aiDifficulty: difficulty
//     });
//   }, [boardSize, gameMode, playerSymbol, difficulty]);

//   // Замінити функцію renderGameBoard() на цю:
//   const renderGameBoard = () => {
//     const gridSize = boardSize === 3 ? 'grid-cols-3' : 'grid-cols-4';
//     const boardWidth = boardSize === 3 ? 'w-64' : 'w-80';  // ✅ Різні розміри
//     //const cellSize = boardSize === 3 ? 'w-16 h-16' : 'w-16 h-16';
  
//     // Адаптивна висота для grid контейнера
//    // const gridHeight = boardSize === 3 ? 'h-48' : 'h-64';  // ✅ Пропорційні висоти
//     // 🔍 DEBUG
//   console.log('🎯 Board render:', { 
//     boardSize, 
//     boardWidth, 
//     gridSize 
//   });
  

//     // // Фіксована висота для grid контейнера
//     // const gridHeight = boardSize === 3 ? 'h-[200px]' : 'h-[264px]';

//     const shouldShowIcons = gameState.gameState === 'setup' || showIconsAfterSizeChange;

//     console.log('🖼️ Стан іконок:', {
//       gameState: gameState.gameState,
//       showIconsAfterSizeChange,
//       shouldShowIcons,
//       boardSize
//     });
    
//     return (
//       <div className={`bg-white/10 rounded-xl p-4 mb-6`}>
//            <div className={`grid ${gridSize} gap-2 ${boardWidth} mx-auto`}>
//             {gameState.board.map((cell, index) => {

//               // Додайте цю перевірку:
//             const maxIconIndex = boardSize * boardSize - 1;
//             if (shouldShowIcons && index > maxIconIndex) {
//               return null; // Не рендеримо зайві іконки
//             }
            
//             // Перевірка обмежень для 4×4
//             const isRestricted = gameState.restrictedCells.includes(index);
//             const canClick = gameState.canMakeMoveWithRestrictions ? 
//               gameState.canMakeMoveWithRestrictions(index) : 
//               gameState.canMakeMove(index);
            
//             return (
//               <button
//                 key={index}
//                 onClick={() => handleCellClick(index)}
//                 disabled={!gameState.gameActive || !canClick}
//                 title={isRestricted ? 'Заборонено правилами 4×4: другий хід не може бути поруч з першим' : undefined}
//                 className={`
//                   aspect-square rounded-xl flex items-center justify-center 
//                   text-2xl font-bold transition-all duration-300 hover:scale-105
//                   disabled:cursor-not-allowed overflow-hidden relative
//                   ${gameState.winningLine.includes(index) ? 'bg-green-500/50' : ''}
//                   ${shouldShowIcons ? 
//                     // Для іконок: без фону, тільки рамка
//                     'bg-transparent border-2 border-white/20 hover:border-white/40' : 
//                     // Для гри: звичайний фон
//                     isRestricted ? 
//                       'bg-white/20 hover:bg-white/30 cursor-not-allowed' : 
//                       'bg-white/20 hover:bg-white/30'
//                   }
//                   ${!canClick && !shouldShowIcons ? 'opacity-50' : ''}
//                 `}
//               >
//                 {/* ✅ ВИПРАВЛЕНА ЛОГІКА ВІДОБРАЖЕННЯ: */}
//                 {shouldShowIcons ? (
//                   // До початку гри або після зміни розміру показуємо декоративні іконки
//                   <>
//                     <img 
//                       src={decorativeIcons[index] || '/game-icons/aijarvis.jpg'} 
//                       alt={`Декоративна іконка ${index + 1}`}
//                       className="absolute inset-0 w-full h-full object-cover rounded-lg
//                                transition-all duration-300 hover:scale-110"
//                       style={{ aspectRatio: '1 / 1' }}
//                       onError={(e) => {
//                         // Fallback до emoji якщо іконка не завантажилась
//                         const target = e.target as HTMLImageElement;
//                         target.style.display = 'none';
//                         const parent = target.parentElement!;
//                         parent.classList.add('bg-gradient-to-br', 'from-purple-500/50', 'to-blue-500/50');
//                         parent.innerHTML += '<span class="absolute inset-0 flex items-center justify-center text-3xl">🎮</span>';
//                       }}
//                     />
//                     {/* Градієнтний overlay для кращого вигляду */}
//                     <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/10 rounded-lg"></div>
//                   </>
//                 ) : (
//                   // Під час гри показуємо X/O або порожні клітинки
//                   <span className="z-10 relative">{cell}</span>
//                 )}
//               </button>
//             );
//           })}
//         </div>
    
        
//         {/* Інформація про обмеження (без змін) */}
//         {boardSize === 4 && gameState.restrictionInfo.hasRestrictions && (
//           <div className="mt-3 p-2 bg-red-500/20 rounded-lg border border-red-400/30">
//             <div className="flex items-center gap-2 text-sm text-red-200">
//               <span>⚠️</span>
//               <span>{gameState.restrictionInfo.reasonDescription}</span>
//             </div>
//           </div>
//         )}
//         </div>
//       );
//     };

//   // Рендеринг статусу гри та таймера
//   const renderGameStatus = () => {
//     return (
//       <div className="space-y-4 mb-6">
//         {/* Статус гри */}
//         <GameStatus
//           gameState={gameState.gameState}
//           currentPlayer={gameState.currentPlayer}
//           gameResult={gameState.gameResult}
//           gameMode={gameMode}
//           playerSymbol={playerSymbol}
//           isAIThinking={gameState.isAIThinking}
//           aiDifficulty={difficulty}
//           variant="default"
//           // Додати ці рядки:
//           boardSize={boardSize}
//           restrictionInfo={gameState.restrictionInfo}
//           firstPlayer={gameState.firstPlayer}
//         />

//         {/* Таймер (якщо гра активна) */}
//         {gameState.gameActive && gameState.settings.timerEnabled && (
//           <div className="flex items-center justify-center">
//             <GameTimer
//               timeLeft={gameState.timeLeft}
//               maxTime={gameState.settings.timePerMove}
//               isRunning={gameState.isTimerRunning}
//               isPaused={gameState.gameState === 'paused'}
//               size="large"
//               showIcon={true}
//             />
//           </div>
//         )}

//         {/* Прогрес гри */}
//         {gameState.gameActive && (
//           <ProgressBar
//             value={gameState.gameStats.moves}
//             maxValue={boardSize * boardSize}
//             label="Прогрес гри"
//             variant="default"
//             size="medium"
//             showValues={true}
//             animated={true}
//           />
//         )}
//       </div>
//     );
//   };

//   // Компонент створення гри (зберігаємо існуючий дизайн)
//   const CreateGameTab = () => (
//     <div className="space-y-4">
//       {/* Режим AI/PvP */}
//       <div className="flex gap-3 mb-6">
//         <button
//           onClick={() => setGameMode('ai')}
//           className={`flex-1 py-3 px-4 rounded-xl font-semibold text-base transition-all ${
//             gameMode === 'ai'
//               ? 'bg-purple-600 text-white shadow-lg'
//               : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
//           }`}
//         >
//           🤖 AI
//         </button>
//         <button
//           onClick={() => setGameMode('pvp')}
//           className={`flex-1 py-3 px-4 rounded-xl font-semibold text-base transition-all ${
//             gameMode === 'pvp'
//               ? 'bg-purple-600 text-white shadow-lg'
//               : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
//           }`}
//         >
//           ⚔️ PvP
//         </button>
//       </div>

//       {/* Назва гри */}
//       <div className="text-center text-xl font-semibold mb-6 flex items-center justify-center gap-2">
//         🎮 Хрестики-нулики
//       </div>

//       {/* Статус гри та таймер */}
//       {gameState.gameState !== 'setup' && renderGameStatus()}

//       {/* Ігрове поле */}
//       {renderGameBoard()}

//       {/* Компактні налаштування */}
//       <div className="space-y-4">
//         {/* Розмір поля */}
//         <div className="flex justify-between items-center">
//           <span className="text-base font-medium opacity-90">Розмір:</span>
//           <div className="flex gap-2">
//             {/* <button
//               onClick={() => setBoardSize(3)}
//               className={`px-4 py-2 text-base rounded-lg font-medium transition-all ${
//                 boardSize === 3
//                   ? 'bg-purple-600 text-white shadow-lg'
//                   : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
//               }`}
//             >
//               3×3
//             </button>
//             <button
//               onClick={() => setBoardSize(4)}
//               className={`px-4 py-2 text-base rounded-lg font-medium transition-all ${
//                 boardSize === 4
//                   ? 'bg-purple-600 text-white shadow-lg'
//                   : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
//               }`}
//             >
//               4×4
//             </button> */}
//             <button
//               onClick={() => {
//                 console.log('🔘 Натиснуто кнопку 3×3');
//                 setBoardSize(3);
//                 // Якщо гра не в стані setup, показуємо іконки
//                 if (gameState.gameState !== 'setup') {
//                   setShowIconsAfterSizeChange(true);
//                 }
//               }}
//               className={`px-4 py-2 text-base rounded-lg font-medium transition-all ${
//                 boardSize === 3
//                   ? 'bg-purple-600 text-white shadow-lg'
//                   : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
//               }`}
//             >
//               3×3
//             </button>
//             <button
//               onClick={() => {
//                 console.log('🔘 Натиснуто кнопку 4×4');
//                 setBoardSize(4);
//                 // Якщо гра не в стані setup, показуємо іконки
//                 if (gameState.gameState !== 'setup') {
//                   setShowIconsAfterSizeChange(true);
//                 }
//               }}
//               className={`px-4 py-2 text-base rounded-lg font-medium transition-all ${
//                 boardSize === 4
//                   ? 'bg-purple-600 text-white shadow-lg'
//                   : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
//               }`}
//             >
//               4×4
//             </button>
//           </div>
//         </div>

//         {/* Фігура */}
//         <div className="flex justify-between items-center">
//           <span className="text-base font-medium opacity-90">Фігура:</span>
//           <div className="flex gap-2">
//             <button
//               onClick={() => setPlayerSymbol('X')}
//               className={`px-4 py-2 text-base rounded-lg font-medium transition-all ${
//                 playerSymbol === 'X'
//                   ? 'bg-purple-600 text-white shadow-lg'
//                   : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
//               }`}
//             >
//               X
//             </button>
//             <button
//               onClick={() => setPlayerSymbol('O')}
//               className={`px-4 py-2 text-base rounded-lg font-medium transition-all ${
//                 playerSymbol === 'O'
//                   ? 'bg-purple-600 text-white shadow-lg'
//                   : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
//               }`}
//             >
//               O
//             </button>
//           </div>
//         </div>

//         {/* AI налаштування */}
//         {gameMode === 'ai' && (
//           <>
//             <div className="flex justify-between items-center">
//               <span className="text-base font-medium opacity-90">Перший хід:</span>
//               <div className="flex gap-2">
//                 <button
//                   onClick={() => setFirstMove('player')}
//                   className={`px-3 py-2 text-sm rounded-lg font-medium transition-all ${
//                     firstMove === 'player'
//                       ? 'bg-purple-600 text-white shadow-lg'
//                       : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
//                   }`}
//                 >
//                   Я
//                 </button>
//                 <button
//                   onClick={() => setFirstMove('ai')}
//                   className={`px-3 py-2 text-sm rounded-lg font-medium transition-all ${
//                     firstMove === 'ai'
//                       ? 'bg-purple-600 text-white shadow-lg'
//                       : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
//                   }`}
//                 >
//                   AI
//                 </button>
//                 <button
//                   onClick={() => setFirstMove('random')}
//                   className={`px-3 py-2 text-sm rounded-lg font-medium transition-all ${
//                     firstMove === 'random'
//                       ? 'bg-purple-600 text-white shadow-lg'
//                       : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
//                   }`}
//                 >
//                   Випадково
//                 </button>
//               </div>
//             </div>

//             <div className="flex justify-between items-center">
//               <span className="text-base font-medium opacity-90">Складність:</span>
//               <div className="flex gap-2">
//                 <button
//                   onClick={() => setDifficulty('easy')}
//                   className={`px-3 py-2 text-sm rounded-lg font-medium transition-all ${
//                     difficulty === 'easy'
//                       ? 'bg-green-600 text-white shadow-lg'
//                       : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
//                   }`}
//                 >
//                   Легка
//                 </button>
//                 <button
//                   onClick={() => setDifficulty('medium')}
//                   className={`px-3 py-2 text-sm rounded-lg font-medium transition-all ${
//                     difficulty === 'medium'
//                       ? 'bg-yellow-600 text-white shadow-lg'
//                       : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
//                   }`}
//                 >
//                   Середня
//                 </button>
//                 <button
//                   onClick={() => setDifficulty('hard')}
//                   className={`px-3 py-2 text-sm rounded-lg font-medium transition-all ${
//                     difficulty === 'hard'
//                       ? 'bg-red-600 text-white shadow-lg'
//                       : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
//                   }`}
//                 >
//                   Важка
//                 </button>
//               </div>
//             </div>
//           </>
//         )}

//         {/* PvP налаштування */}
//         {gameMode === 'pvp' && (
//           <>
//             <div className="flex justify-between items-center">
//               <span className="text-base font-medium opacity-90">Перший хід:</span>
//               <div className="flex gap-2">
//                 <button
//                   onClick={() => setFirstMove('player')}
//                   className={`px-3 py-2 text-sm rounded-lg font-medium transition-all ${
//                     firstMove === 'player'
//                       ? 'bg-purple-600 text-white shadow-lg'
//                       : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
//                   }`}
//                 >
//                   Я перший
//                 </button>
//                 <button
//                   onClick={() => setFirstMove('random')}
//                   className={`px-3 py-2 text-sm rounded-lg font-medium transition-all ${
//                     firstMove === 'random'
//                       ? 'bg-purple-600 text-white shadow-lg'
//                       : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
//                   }`}
//                 >
//                   Випадково
//                 </button>
//               </div>
//             </div>

//             {/* Ставка */}
//             <div className="flex justify-between items-center">
//               <span className="text-base font-medium opacity-90">Ставка:</span>
//               <div className="flex gap-4 items-center">
//                 <label className="flex items-center gap-2 cursor-pointer text-sm">
//                   <input
//                     type="radio"
//                     name="stake"
//                     checked={!hasStake}
//                     onChange={() => setHasStake(false)}
//                     className="w-4 h-4"
//                   />
//                   <span>Без ставки</span>
//                 </label>
//                 <label className="flex items-center gap-2 cursor-pointer text-sm">
//                   <input
//                     type="radio"
//                     name="stake"
//                     checked={hasStake}
//                     onChange={() => setHasStake(true)}
//                     className="w-4 h-4"
//                   />
//                   <span>Зі ставкою</span>
//                 </label>
//               </div>
//             </div>

//             {hasStake && (
//               <div className="flex justify-between items-center">
//                 <span className="text-base font-medium opacity-90">Сума:</span>
//                 <input
//                   type="number"
//                   value={stakeAmount}
//                   onChange={(e) => setStakeAmount(e.target.value)}
//                   placeholder="0.01"
//                   step="0.01"
//                   min="0.01"
//                   className="w-24 px-3 py-2 text-sm bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50"
//                 />
//               </div>
//             )}

//             {/* Доступ */}
//             <div className="flex justify-between items-center">
//               <span className="text-base font-medium opacity-90">Доступ:</span>
//               <div className="flex gap-4 items-center">
//                 <label className="flex items-center gap-2 cursor-pointer text-sm">
//                   <input
//                     type="radio"
//                     name="access"
//                     checked={gameAccess === 'public'}
//                     onChange={() => setGameAccess('public')}
//                     className="w-4 h-4"
//                   />
//                   <span>Публічна</span>
//                 </label>
//                 <label className="flex items-center gap-2 cursor-pointer text-sm">
//                   <input
//                     type="radio"
//                     name="access"
//                     checked={gameAccess === 'private'}
//                     onChange={() => setGameAccess('private')}
//                     className="w-4 h-4"
//                   />
//                   <span>Приватна</span>
//                 </label>
//               </div>
//             </div>
//           </>
//         )}
//       </div>

//       {/* Кнопки управління */}
//       <div className="space-y-3">
//         {/* Кнопка старту/рестарту */}
//         <button
//           onClick={handleStartNewGame}
//           className="w-full bg-purple-600 hover:bg-purple-700 py-4 px-6 rounded-xl font-bold text-lg text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
//         >
//           {gameState.gameState === 'setup' ? '🎮 ПОЧАТИ ГРУ' : '🔄 НОВА ГРА'}
//         </button>

//         {/* Додаткові кнопки під час гри */}
//         {gameState.gameActive && (
//           <div className="flex gap-3">
//             <button
//               onClick={() => gameState.pauseGame()}
//               className="flex-1 bg-yellow-600 hover:bg-yellow-700 py-2 px-4 rounded-lg font-medium text-white transition-all"
//             >
//               ⏸️ Пауза
//             </button>
//             <button
//               onClick={() => gameState.resetGame()}
//               className="flex-1 bg-red-600 hover:bg-red-700 py-2 px-4 rounded-lg font-medium text-white transition-all"
//             >
//               🔄 Скинути
//             </button>
//           </div>
//         )}

//         {/* Кнопка продовження */}
//         {gameState.gameState === 'paused' && (
//           <button
//             onClick={() => gameState.resumeGame()}
//             className="w-full bg-green-600 hover:bg-green-700 py-3 px-6 rounded-xl font-bold text-white transition-all"
//           >
//             ▶️ ПРОДОВЖИТИ
//           </button>
//         )}
//       </div>

//       {/* Статистика сесії */}
//       {gameState.sessionStats.gamesPlayed > 0 && (
//         <div className="mt-6 p-4 bg-white/5 rounded-xl">
//           <h4 className="text-sm font-semibold text-white/90 mb-2">📊 Статистика сесії</h4>
//           <div className="grid grid-cols-2 gap-3 text-xs">
//             <div className="flex justify-between">
//               <span className="text-white/70">Ігор:</span>
//               <span className="text-white">{gameState.sessionStats.gamesPlayed}</span>
//             </div>
//             <div className="flex justify-between">
//               <span className="text-white/70">Перемог:</span>
//               <span className="text-green-400">{gameState.sessionStats.wins}</span>
//             </div>
//             <div className="flex justify-between">
//               <span className="text-white/70">Поразок:</span>
//               <span className="text-red-400">{gameState.sessionStats.losses}</span>
//             </div>
//             <div className="flex justify-between">
//               <span className="text-white/70">% перемог:</span>
//               <span className="text-blue-400">{gameState.sessionStats.winRate.toFixed(1)}%</span>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );

//   // Заглушка для інших табів (зберігаємо існуючі)
//   const CreateTournamentTab = () => (
//     <div className="text-center py-8">
//       <h3 className="text-xl font-semibold text-white mb-4">🏆 Турніри</h3>
//       <p className="text-white/70">Функціональність турнірів буде додана пізніше</p>
//     </div>
//   );

//   const AvailableGamesTab = () => (
//     <div className="text-center py-8">
//       <h3 className="text-xl font-semibold text-white mb-4">📋 Доступні ігри</h3>
//       <p className="text-white/70">Пошук ігор буде додано пізніше</p>
//     </div>
//   );

//   return (
//     <div className={`
//       bg-gradient-to-br from-gray-800/50 via-purple-800/50 to-gray-800/50 
//       backdrop-blur-md rounded-3xl p-4 lg:p-6 shadow-2xl 
//       border border-purple-500/20
//       ${className}
//     `}>
//       {/* Таби */}
//       <div className="flex gap-1 mb-6 bg-white/10 rounded-xl p-1">
//         <button
//           onClick={() => setActiveTab('create-game')}
//           className={`
//             flex-1 flex flex-col items-center gap-1 py-2 px-2 rounded-lg transition-all duration-300 text-xs
//             ${activeTab === 'create-game'
//               ? 'bg-purple-600 text-white'
//               : 'text-white/70 hover:text-white hover:bg-white/10'
//             }
//           `}
//         >
//           <span className="text-sm">🎮</span>
//           <span className="font-medium leading-tight text-center">Створити гру</span>
//         </button>
//         <button
//           onClick={() => setActiveTab('create-tournament')}
//           className={`
//             flex-1 flex flex-col items-center gap-1 py-2 px-2 rounded-lg transition-all duration-300 text-xs
//             ${activeTab === 'create-tournament'
//               ? 'bg-purple-600 text-white'
//               : 'text-white/70 hover:text-white hover:bg-white/10'
//             }
//           `}
//         >
//           <span className="text-sm">🏆</span>
//           <span className="font-medium leading-tight text-center">Створити турнір</span>
//         </button>
//         <button
//           onClick={() => setActiveTab('available-games')}
//           className={`
//             flex-1 flex flex-col items-center gap-1 py-2 px-2 rounded-lg transition-all duration-300 text-xs
//             ${activeTab === 'available-games'
//               ? 'bg-purple-600 text-white'
//               : 'text-white/70 hover:text-white hover:bg-white/10'
//             }
//           `}
//         >
//           <span className="text-sm">📋</span>
//           <span className="font-medium leading-tight text-center">Доступні ігри</span>
//         </button>
//       </div>

//       {/* Контент залежно від активного табу */}
//       <div className="min-h-[400px]">
//         {activeTab === 'create-game' && <CreateGameTab />}
//         {activeTab === 'create-tournament' && <CreateTournamentTab />}
//         {activeTab === 'available-games' && <AvailableGamesTab />}
//       </div>
//     </div>
//   );
// }










































// // components/game/sections/GameSection.tsx
// // Головний компонент ігрової секції з інтеграцією всіх нових хуків
// // ✅ Використовує useGameState для управління станом
// // ✅ Інтегрує GameStatus, GameTimer, ProgressBar
// // ✅ Зберігає існуючий інтерфейс
// // ✅ Підтримує AI та PvP режими

// 'use client';

// import React, { useCallback, useEffect } from 'react';
// import { useGameState } from '../../../../hooks/useGameState';
// import GameStatus from '../ui/GameStatus';
// import GameTimer from '../ui/GameTimer';
// import ProgressBar from '../ui/ProgressBar';

// import type { 
//   GameMode, 
//   Player, 
//   BoardSize, 
//   Difficulty,
//   FirstMove,
//   GameAccess
// } from '../../../../types/game';

// // Типи для табів
// type GameTab = 'create-game' | 'create-tournament' | 'available-games';

// interface GameSectionProps {
//   className?: string;
// }

// const DECORATIVE_ICONS = [
//   'aijarvis.jpg',
//   'bean.jpg', 
//   'berzan.jpg',
//   'cultverse.jpg',
//   'enjoyoors.jpg',
//   'fantasy.jpg',
//   'keone.jpg',
//   'kintsu.png',
//   'kizzy.jpg',
//   'laMouch.jpg',
//   'lootgo.jpg',
//   'magicEden.jpg',
//   'medusa.jpg',
//   'mikeinweb.png',
//   'monadverse.jpg',
//   'monorail.png',
//   'moyaking.jpg',
//   'nadsa.jpg',
//   'narwhal.jpg',
//   'pump.jpg',
//   'purps.png',
//   'rugRumble.png',
//   'talentum.jpg',
//   'thedaks.jpg',
//   'thevapelabs.jpg'
// ].map(filename => `/game-icons/${filename}`);

// // Функція для отримання випадкових іконок
// const getRandomIcons = (count: number): string[] => {
//   const shuffled = [...DECORATIVE_ICONS].sort(() => 0.5 - Math.random());
//   return shuffled.slice(0, count);
// };

// export default function GameSection({ className = '' }: GameSectionProps) {
//   // Стан інтерфейсу (зберігаємо існуючу логіку)
//   const [activeTab, setActiveTab] = React.useState<GameTab>('create-game');
//   const [gameMode, setGameMode] = React.useState<GameMode>('ai');
  
//   // Налаштування гри (зберігаємо існуючі)
//   const [boardSize, setBoardSize] = React.useState<BoardSize>(3);
//   const [playerSymbol, setPlayerSymbol] = React.useState<Player>('X');
//   const [firstMove, setFirstMove] = React.useState<FirstMove>('random');
//   const [difficulty, setDifficulty] = React.useState<Difficulty>('medium');
//   const [hasStake, setHasStake] = React.useState(false);
//   const [stakeAmount, setStakeAmount] = React.useState('');
//   const [gameAccess, setGameAccess] = React.useState<GameAccess>('public');
//   const [decorativeIcons, setDecorativeIcons] = React.useState<string[]>([]);
//   // 1. ДОДАТИ НОВИЙ СТАН для відстежування зміни розміру поля:
//   const [lastBoardSize, setLastBoardSize] = React.useState<BoardSize>(boardSize);
//   const [showIconsAfterSizeChange, setShowIconsAfterSizeChange] = React.useState(false);

//   // Ініціалізуємо новий хук управління грою
//   const gameState = useGameState({
//     initialSettings: {
//       boardSize,
//       gameMode,
//       playerSymbol,
//       aiDifficulty: difficulty,
//       timerEnabled: true,
//       timePerMove: 22,
//       aiThinkingTime: 1000
//     },
//     onGameEnd: (result, winner) => {
//       console.log('Гра завершена:', { result, winner });
//       // Тут можна додати логіку показу результатів
//     },
//     onStatisticsUpdate: (stats) => {
//       console.log('Статистика оновлена:', stats);
//     },
//     // persistGame: true
//   });

//   // Додати тут:
//   useEffect(() => {
//     const iconCount = boardSize * boardSize;
//     setDecorativeIcons(getRandomIcons(iconCount));
    
//     // Перевіряємо чи змінився розмір поля
//     if (lastBoardSize !== boardSize) {
//       console.log('📐 Розмір поля змінено з', lastBoardSize, 'на', boardSize);
//       setShowIconsAfterSizeChange(true);
//       setLastBoardSize(boardSize);
//     }
//   }, [boardSize, lastBoardSize]);

//   // Обробка кліку по клітинці
//   const handleCellClick = useCallback(async (index: number) => {
//     // Додати debug інформацію:
//     if (boardSize === 4) {
//       console.log('🎯 Клік по клітинці:', {
//         index,
//         isRestricted: gameState.restrictedCells.includes(index),
//         canMakeMove: gameState.canMakeMoveWithRestrictions(index),
//         restrictedCells: gameState.restrictedCells,
//         currentPlayer: gameState.currentPlayer,
//         firstPlayer: gameState.firstPlayer
//       });
//     }

//     if (!gameState.canMakeMove(index)) return;
    
//     await gameState.makeMove(index);
//   }, [gameState, boardSize]);

//   const determineFirstPlayer = useCallback((): Player => {
//     if (gameMode === 'ai') {
//       switch (firstMove) {
//         case 'player': return playerSymbol;
//         case 'ai': return playerSymbol === 'X' ? 'O' : 'X';
//         case 'random': return Math.random() < 0.5 ? playerSymbol : (playerSymbol === 'X' ? 'O' : 'X');
//       }
//     }
//     return playerSymbol;
//   }, [firstMove, playerSymbol, gameMode]);

//   // Початок нової гри
//   const handleStartNewGame = useCallback(() => {
//     setShowIconsAfterSizeChange(false);

//     const firstPlayer = determineFirstPlayer(); // Використовуйте цю функцію
//     // Оновлюємо налаштування перед початком
//     gameState.updateSettings({
//       boardSize,
//       gameMode,
//       playerSymbol,
//       aiDifficulty: difficulty,
//       timerEnabled: true,
//       timePerMove: 22,
//       aiThinkingTime: 1000
//     });
    
//     gameState.startNewGame(firstPlayer);

//     console.log('Налаштування гри:', {
//       gameMode: gameState.settings.gameMode,
//       playerSymbol: gameState.settings.playerSymbol,
//       firstPlayer, // Додайте цей лог
//       currentPlayer: gameState.currentPlayer,
//       isPlayerTurn: gameState.currentPlayer === gameState.settings.playerSymbol,
//       showIconsAfterSizeChange: false // ✅ ДОДАНО ДЛЯ DEBUG
//     });
//   }, [gameState, boardSize, gameMode, playerSymbol, difficulty, determineFirstPlayer, firstMove]);

//   // Синхронізація налаштувань
//   useEffect(() => {
//     gameState.updateSettings({
//       boardSize,
//       gameMode,
//       playerSymbol,
//       aiDifficulty: difficulty
//     });
//   }, [boardSize, gameMode, playerSymbol, difficulty]);

//   // Замінити функцію renderGameBoard() на цю:
//   const renderGameBoard = () => {
//     const gridSize = boardSize === 3 ? 'grid-cols-3' : 'grid-cols-4';
//     const boardWidth = boardSize === 3 ? 'w-64' : 'w-80';  // ✅ Різні розміри
//     //const cellSize = boardSize === 3 ? 'w-16 h-16' : 'w-16 h-16';
  
//     // Адаптивна висота для grid контейнера
//    // const gridHeight = boardSize === 3 ? 'h-48' : 'h-64';  // ✅ Пропорційні висоти
//     // 🔍 DEBUG
//   console.log('🎯 Board render:', { 
//     boardSize, 
//     boardWidth, 
//     gridSize 
//   });
  

//     // // Фіксована висота для grid контейнера
//     // const gridHeight = boardSize === 3 ? 'h-[200px]' : 'h-[264px]';

//     const shouldShowIcons = gameState.gameState === 'setup' || showIconsAfterSizeChange;

//     console.log('🖼️ Стан іконок:', {
//       gameState: gameState.gameState,
//       showIconsAfterSizeChange,
//       shouldShowIcons,
//       boardSize
//     });
    
//     return (
//       <div className={`bg-white/10 rounded-xl p-4 mb-6`}>
//            <div className={`grid ${gridSize} gap-2 ${boardWidth} mx-auto`}>
//             {gameState.board.map((cell, index) => {

//               // Додайте цю перевірку:
//             const maxIconIndex = boardSize * boardSize - 1;
//             if (shouldShowIcons && index > maxIconIndex) {
//               return null; // Не рендеримо зайві іконки
//             }
            
//             // Перевірка обмежень для 4×4
//             const isRestricted = gameState.restrictedCells.includes(index);
//             const canClick = gameState.canMakeMoveWithRestrictions ? 
//               gameState.canMakeMoveWithRestrictions(index) : 
//               gameState.canMakeMove(index);
            
//             return (
//               <button
//                 key={index}
//                 onClick={() => handleCellClick(index)}
//                 disabled={!gameState.gameActive || !canClick}
//                 title={isRestricted ? 'Заборонено правилами 4×4: другий хід не може бути поруч з першим' : undefined}
//                 className={`
//                   aspect-square rounded-xl flex items-center justify-center 
//                   text-2xl font-bold transition-all duration-300 hover:scale-105
//                   disabled:cursor-not-allowed overflow-hidden relative
//                   ${gameState.winningLine.includes(index) ? 'bg-green-500/50' : ''}
//                   ${shouldShowIcons ? 
//                     // Для іконок: без фону, тільки рамка
//                     'bg-transparent border-2 border-white/20 hover:border-white/40' : 
//                     // Для гри: звичайний фон
//                     isRestricted ? 
//                       'bg-white/20 hover:bg-white/30 cursor-not-allowed' : 
//                       'bg-white/20 hover:bg-white/30'
//                   }
//                   ${!canClick && !shouldShowIcons ? 'opacity-50' : ''}
//                 `}
//               >
//                 {/* ✅ ВИПРАВЛЕНА ЛОГІКА ВІДОБРАЖЕННЯ: */}
//                 {shouldShowIcons ? (
//                   // До початку гри або після зміни розміру показуємо декоративні іконки
//                   <>
//                     <img 
//                       src={decorativeIcons[index] || '/game-icons/aijarvis.jpg'} 
//                       alt={`Декоративна іконка ${index + 1}`}
//                       className="absolute inset-0 w-full h-full object-cover rounded-lg
//                                transition-all duration-300 hover:scale-110"
//                       style={{ aspectRatio: '1 / 1' }}
//                       onError={(e) => {
//                         // Fallback до emoji якщо іконка не завантажилась
//                         const target = e.target as HTMLImageElement;
//                         target.style.display = 'none';
//                         const parent = target.parentElement!;
//                         parent.classList.add('bg-gradient-to-br', 'from-purple-500/50', 'to-blue-500/50');
//                         parent.innerHTML += '<span class="absolute inset-0 flex items-center justify-center text-3xl">🎮</span>';
//                       }}
//                     />
//                     {/* Градієнтний overlay для кращого вигляду */}
//                     <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/10 rounded-lg"></div>
//                   </>
//                 ) : (
//                   // Під час гри показуємо X/O або порожні клітинки
//                   <span className="z-10 relative">{cell}</span>
//                 )}
//               </button>
//             );
//           })}
//         </div>
    
        
//         {/* Інформація про обмеження (без змін) */}
//         {boardSize === 4 && gameState.restrictionInfo.hasRestrictions && (
//           <div className="mt-3 p-2 bg-red-500/20 rounded-lg border border-red-400/30">
//             <div className="flex items-center gap-2 text-sm text-red-200">
//               <span>⚠️</span>
//               <span>{gameState.restrictionInfo.reasonDescription}</span>
//             </div>
//           </div>
//         )}
//         </div>
//       );
//     };

//   // Рендеринг статусу гри та таймера
//   const renderGameStatus = () => {
//     return (
//       <div className="space-y-4 mb-6">
//         {/* Статус гри */}
//         <GameStatus
//           gameState={gameState.gameState}
//           currentPlayer={gameState.currentPlayer}
//           gameResult={gameState.gameResult}
//           gameMode={gameMode}
//           playerSymbol={playerSymbol}
//           isAIThinking={gameState.isAIThinking}
//           aiDifficulty={difficulty}
//           variant="default"
//           // Додати ці рядки:
//           boardSize={boardSize}
//           restrictionInfo={gameState.restrictionInfo}
//           firstPlayer={gameState.firstPlayer}
//         />

//         {/* Новий компактний макет таймера + прогресу */}
//       {gameState.gameActive && (
//         <div className="bg-white/5 rounded-lg p-2">
//           {/* Верхня лінія: Прогрес + Міні таймер */}
//           <div className="flex items-center justify-between gap-3 mb-2">
//             <div className="flex-1">
//               <ProgressBar
//                 value={gameState.gameStats.moves}
//                 maxValue={boardSize * boardSize}
//                 variant="timer"
//                 size="small"
//                 animated={true}
//                 className="h-2"
//                 showValues={false}
//                 showPercentage={false}
//               />
//             </div>
            
//             <div className="flex items-center gap-2 shrink-0">
//               {/* Міні круглий таймер */}
//               <div className="w-6 h-6 relative">
//                 <GameTimer
//                   timeLeft={gameState.timeLeft}
//                   maxTime={gameState.settings.timePerMove}
//                   isRunning={gameState.isTimerRunning}
//                   isPaused={gameState.gameState === 'paused'}
//                   size="small"
//                   showIcon={false}
//                   className="w-6 h-6"
//                 />
//               </div>
//               <span className="text-sm font-medium text-white">{gameState.timeLeft}</span>
//             </div>
//           </div>
          
//           {/* Нижня лінія: Інфо */}
//           <div className="flex justify-between text-xs text-white/50">
//             <span>Ходів: {gameState.gameStats.moves}/{boardSize * boardSize}</span>
//             <span>Час на хід</span>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

//   // Компонент створення гри (зберігаємо існуючий дизайн)
//   const CreateGameTab = () => (
//     <div className="space-y-4">
//       {/* Режим AI/PvP */}
//       <div className="flex gap-3 mb-6">
//         <button
//           onClick={() => setGameMode('ai')}
//           className={`flex-1 py-3 px-4 rounded-xl font-semibold text-base transition-all ${
//             gameMode === 'ai'
//               ? 'bg-purple-600 text-white shadow-lg'
//               : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
//           }`}
//         >
//           🤖 AI
//         </button>
//         <button
//           onClick={() => setGameMode('pvp')}
//           className={`flex-1 py-3 px-4 rounded-xl font-semibold text-base transition-all ${
//             gameMode === 'pvp'
//               ? 'bg-purple-600 text-white shadow-lg'
//               : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
//           }`}
//         >
//           ⚔️ PvP
//         </button>
//       </div>

//       {/* Назва гри */}
//       <div className="text-center text-xl font-semibold mb-6 flex items-center justify-center gap-2">
//         🎮 Хрестики-нулики
//       </div>

//       {/* Статус гри та таймер */}
//       {gameState.gameState !== 'setup' && renderGameStatus()}

//       {/* Ігрове поле */}
//       {renderGameBoard()}

//       {/* Компактні налаштування */}
//       <div className="space-y-4">
//         {/* Розмір поля */}
//         <div className="flex justify-between items-center">
//           <span className="text-base font-medium opacity-90">Розмір:</span>
//           <div className="flex gap-2">
//             {/* <button
//               onClick={() => setBoardSize(3)}
//               className={`px-4 py-2 text-base rounded-lg font-medium transition-all ${
//                 boardSize === 3
//                   ? 'bg-purple-600 text-white shadow-lg'
//                   : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
//               }`}
//             >
//               3×3
//             </button>
//             <button
//               onClick={() => setBoardSize(4)}
//               className={`px-4 py-2 text-base rounded-lg font-medium transition-all ${
//                 boardSize === 4
//                   ? 'bg-purple-600 text-white shadow-lg'
//                   : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
//               }`}
//             >
//               4×4
//             </button> */}
//             <button
//               onClick={() => {
//                 console.log('🔘 Натиснуто кнопку 3×3');
//                 setBoardSize(3);
//                 gameState.setupGame()
//                 // Якщо гра не в стані setup, показуємо іконки
//                 if (gameState.gameState !== 'setup') {
//                   setShowIconsAfterSizeChange(true);
//                 }
//               }}
//               className={`px-4 py-2 text-base rounded-lg font-medium transition-all ${
//                 boardSize === 3
//                   ? 'bg-purple-600 text-white shadow-lg'
//                   : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
//               }`}
//             >
//               3×3
//             </button>
//             <button
//               onClick={() => {
//                 console.log('🔘 Натиснуто кнопку 4×4');
//                 setBoardSize(4);
//                 gameState.setupGame()
//                 // Якщо гра не в стані setup, показуємо іконки
//                 if (gameState.gameState !== 'setup') {
//                   setShowIconsAfterSizeChange(true);
//                 }
//               }}
//               className={`px-4 py-2 text-base rounded-lg font-medium transition-all ${
//                 boardSize === 4
//                   ? 'bg-purple-600 text-white shadow-lg'
//                   : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
//               }`}
//             >
//               4×4
//             </button>
//           </div>
//         </div>

//         {/* Фігура */}
//         <div className="flex justify-between items-center">
//           <span className="text-base font-medium opacity-90">Фігура:</span>
//           <div className="flex gap-2">
//             <button
//               onClick={() => setPlayerSymbol('X')}
//               className={`px-4 py-2 text-base rounded-lg font-medium transition-all ${
//                 playerSymbol === 'X'
//                   ? 'bg-purple-600 text-white shadow-lg'
//                   : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
//               }`}
//             >
//               X
//             </button>
//             <button
//               onClick={() => setPlayerSymbol('O')}
//               className={`px-4 py-2 text-base rounded-lg font-medium transition-all ${
//                 playerSymbol === 'O'
//                   ? 'bg-purple-600 text-white shadow-lg'
//                   : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
//               }`}
//             >
//               O
//             </button>
//           </div>
//         </div>

//         {/* AI налаштування */}
//         {gameMode === 'ai' && (
//           <>
//             <div className="flex justify-between items-center">
//               <span className="text-base font-medium opacity-90">Перший хід:</span>
//               <div className="flex gap-2">
//                 <button
//                   onClick={() => setFirstMove('player')}
//                   className={`px-3 py-2 text-sm rounded-lg font-medium transition-all ${
//                     firstMove === 'player'
//                       ? 'bg-purple-600 text-white shadow-lg'
//                       : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
//                   }`}
//                 >
//                   Я
//                 </button>
//                 <button
//                   onClick={() => setFirstMove('ai')}
//                   className={`px-3 py-2 text-sm rounded-lg font-medium transition-all ${
//                     firstMove === 'ai'
//                       ? 'bg-purple-600 text-white shadow-lg'
//                       : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
//                   }`}
//                 >
//                   AI
//                 </button>
//                 <button
//                   onClick={() => setFirstMove('random')}
//                   className={`px-3 py-2 text-sm rounded-lg font-medium transition-all ${
//                     firstMove === 'random'
//                       ? 'bg-purple-600 text-white shadow-lg'
//                       : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
//                   }`}
//                 >
//                   Випадково
//                 </button>
//               </div>
//             </div>

//             <div className="flex justify-between items-center">
//               <span className="text-base font-medium opacity-90">Складність:</span>
//               <div className="flex gap-2">
//                 <button
//                   onClick={() => setDifficulty('easy')}
//                   className={`px-3 py-2 text-sm rounded-lg font-medium transition-all ${
//                     difficulty === 'easy'
//                       ? 'bg-green-600 text-white shadow-lg'
//                       : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
//                   }`}
//                 >
//                   Легка
//                 </button>
//                 <button
//                   onClick={() => setDifficulty('medium')}
//                   className={`px-3 py-2 text-sm rounded-lg font-medium transition-all ${
//                     difficulty === 'medium'
//                       ? 'bg-yellow-600 text-white shadow-lg'
//                       : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
//                   }`}
//                 >
//                   Середня
//                 </button>
//                 <button
//                   onClick={() => setDifficulty('hard')}
//                   className={`px-3 py-2 text-sm rounded-lg font-medium transition-all ${
//                     difficulty === 'hard'
//                       ? 'bg-red-600 text-white shadow-lg'
//                       : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
//                   }`}
//                 >
//                   Важка
//                 </button>
//               </div>
//             </div>
//           </>
//         )}

//         {/* PvP налаштування */}
//         {gameMode === 'pvp' && (
//           <>
//             <div className="flex justify-between items-center">
//               <span className="text-base font-medium opacity-90">Перший хід:</span>
//               <div className="flex gap-2">
//                 <button
//                   onClick={() => setFirstMove('player')}
//                   className={`px-3 py-2 text-sm rounded-lg font-medium transition-all ${
//                     firstMove === 'player'
//                       ? 'bg-purple-600 text-white shadow-lg'
//                       : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
//                   }`}
//                 >
//                   Я перший
//                 </button>
//                 <button
//                   onClick={() => setFirstMove('random')}
//                   className={`px-3 py-2 text-sm rounded-lg font-medium transition-all ${
//                     firstMove === 'random'
//                       ? 'bg-purple-600 text-white shadow-lg'
//                       : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
//                   }`}
//                 >
//                   Випадково
//                 </button>
//               </div>
//             </div>

//             {/* Ставка */}
//             <div className="flex justify-between items-center">
//               <span className="text-base font-medium opacity-90">Ставка:</span>
//               <div className="flex gap-4 items-center">
//                 <label className="flex items-center gap-2 cursor-pointer text-sm">
//                   <input
//                     type="radio"
//                     name="stake"
//                     checked={!hasStake}
//                     onChange={() => setHasStake(false)}
//                     className="w-4 h-4"
//                   />
//                   <span>Без ставки</span>
//                 </label>
//                 <label className="flex items-center gap-2 cursor-pointer text-sm">
//                   <input
//                     type="radio"
//                     name="stake"
//                     checked={hasStake}
//                     onChange={() => setHasStake(true)}
//                     className="w-4 h-4"
//                   />
//                   <span>Зі ставкою</span>
//                 </label>
//               </div>
//             </div>

//             {hasStake && (
//               <div className="flex justify-between items-center">
//                 <span className="text-base font-medium opacity-90">Сума:</span>
//                 <input
//                   type="number"
//                   value={stakeAmount}
//                   onChange={(e) => setStakeAmount(e.target.value)}
//                   placeholder="0.01"
//                   step="0.01"
//                   min="0.01"
//                   className="w-24 px-3 py-2 text-sm bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50"
//                 />
//               </div>
//             )}

//             {/* Доступ */}
//             <div className="flex justify-between items-center">
//               <span className="text-base font-medium opacity-90">Доступ:</span>
//               <div className="flex gap-4 items-center">
//                 <label className="flex items-center gap-2 cursor-pointer text-sm">
//                   <input
//                     type="radio"
//                     name="access"
//                     checked={gameAccess === 'public'}
//                     onChange={() => setGameAccess('public')}
//                     className="w-4 h-4"
//                   />
//                   <span>Публічна</span>
//                 </label>
//                 <label className="flex items-center gap-2 cursor-pointer text-sm">
//                   <input
//                     type="radio"
//                     name="access"
//                     checked={gameAccess === 'private'}
//                     onChange={() => setGameAccess('private')}
//                     className="w-4 h-4"
//                   />
//                   <span>Приватна</span>
//                 </label>
//               </div>
//             </div>
//           </>
//         )}
//       </div>

//       {/* Кнопки управління */}
//       <div className="space-y-3">
//         {/* Кнопка старту/рестарту */}
//         <button
//           onClick={handleStartNewGame}
//           className="w-full bg-purple-600 hover:bg-purple-700 py-4 px-6 rounded-xl font-bold text-lg text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
//         >
//           {gameState.gameState === 'setup' ? '🎮 ПОЧАТИ ГРУ' : '🔄 НОВА ГРА'}
//         </button>

//         {/* Додаткові кнопки під час гри */}
//         {gameState.gameActive && (
//           <div className="flex gap-3">
//             <button
//               onClick={() => gameState.pauseGame()}
//               className="flex-1 bg-yellow-600 hover:bg-yellow-700 py-2 px-4 rounded-lg font-medium text-white transition-all"
//             >
//               ⏸️ Пауза
//             </button>
//             <button
//               onClick={() => gameState.resetGame()}
//               className="flex-1 bg-red-600 hover:bg-red-700 py-2 px-4 rounded-lg font-medium text-white transition-all"
//             >
//               🔄 Скинути
//             </button>
//           </div>
//         )}

//         {/* Кнопка продовження */}
//         {gameState.gameState === 'paused' && (
//           <button
//             onClick={() => gameState.resumeGame()}
//             className="w-full bg-green-600 hover:bg-green-700 py-3 px-6 rounded-xl font-bold text-white transition-all"
//           >
//             ▶️ ПРОДОВЖИТИ
//           </button>
//         )}
//       </div>

//       {/* Статистика сесії */}
//       {gameState.sessionStats.gamesPlayed > 0 && (
//         <div className="mt-6 p-4 bg-white/5 rounded-xl">
//           <h4 className="text-sm font-semibold text-white/90 mb-2">📊 Статистика сесії</h4>
//           <div className="grid grid-cols-2 gap-3 text-xs">
//             <div className="flex justify-between">
//               <span className="text-white/70">Ігор:</span>
//               <span className="text-white">{gameState.sessionStats.gamesPlayed}</span>
//             </div>
//             <div className="flex justify-between">
//               <span className="text-white/70">Перемог:</span>
//               <span className="text-green-400">{gameState.sessionStats.wins}</span>
//             </div>
//             <div className="flex justify-between">
//               <span className="text-white/70">Поразок:</span>
//               <span className="text-red-400">{gameState.sessionStats.losses}</span>
//             </div>
//             <div className="flex justify-between">
//               <span className="text-white/70">% перемог:</span>
//               <span className="text-blue-400">{gameState.sessionStats.winRate.toFixed(1)}%</span>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );

//   // Заглушка для інших табів (зберігаємо існуючі)
//   const CreateTournamentTab = () => (
//     <div className="text-center py-8">
//       <h3 className="text-xl font-semibold text-white mb-4">🏆 Турніри</h3>
//       <p className="text-white/70">Функціональність турнірів буде додана пізніше</p>
//     </div>
//   );

//   const AvailableGamesTab = () => (
//     <div className="text-center py-8">
//       <h3 className="text-xl font-semibold text-white mb-4">📋 Доступні ігри</h3>
//       <p className="text-white/70">Пошук ігор буде додано пізніше</p>
//     </div>
//   );

//   return (
//     <div className={`
//       bg-gradient-to-br from-gray-800/50 via-purple-800/50 to-gray-800/50 
//       backdrop-blur-md rounded-3xl p-4 lg:p-6 shadow-2xl 
//       border border-purple-500/20
//       ${className}
//     `}>
//       {/* Таби */}
//       <div className="flex gap-1 mb-6 bg-white/10 rounded-xl p-1">
//         <button
//           onClick={() => setActiveTab('create-game')}
//           className={`
//             flex-1 flex flex-col items-center gap-1 py-2 px-2 rounded-lg transition-all duration-300 text-xs
//             ${activeTab === 'create-game'
//               ? 'bg-purple-600 text-white'
//               : 'text-white/70 hover:text-white hover:bg-white/10'
//             }
//           `}
//         >
//           <span className="text-sm">🎮</span>
//           <span className="font-medium leading-tight text-center">Створити гру</span>
//         </button>
//         <button
//           onClick={() => setActiveTab('create-tournament')}
//           className={`
//             flex-1 flex flex-col items-center gap-1 py-2 px-2 rounded-lg transition-all duration-300 text-xs
//             ${activeTab === 'create-tournament'
//               ? 'bg-purple-600 text-white'
//               : 'text-white/70 hover:text-white hover:bg-white/10'
//             }
//           `}
//         >
//           <span className="text-sm">🏆</span>
//           <span className="font-medium leading-tight text-center">Створити турнір</span>
//         </button>
//         <button
//           onClick={() => setActiveTab('available-games')}
//           className={`
//             flex-1 flex flex-col items-center gap-1 py-2 px-2 rounded-lg transition-all duration-300 text-xs
//             ${activeTab === 'available-games'
//               ? 'bg-purple-600 text-white'
//               : 'text-white/70 hover:text-white hover:bg-white/10'
//             }
//           `}
//         >
//           <span className="text-sm">📋</span>
//           <span className="font-medium leading-tight text-center">Доступні ігри</span>
//         </button>
//       </div>

//       {/* Контент залежно від активного табу */}
//       <div className="min-h-[400px]">
//         {activeTab === 'create-game' && <CreateGameTab />}
//         {activeTab === 'create-tournament' && <CreateTournamentTab />}
//         {activeTab === 'available-games' && <AvailableGamesTab />}
//       </div>
//     </div>
//   );
// }































// // components/game/sections/GameSection.tsx
// // Головний компонент ігрової секції з інтеграцією всіх нових хуків
// // ✅ Використовує useGameState для управління станом
// // ✅ Інтегрує GameStatus, GameTimer, ProgressBar
// // ✅ Зберігає існуючий інтерфейс
// // ✅ Підтримує AI та PvP режими
// // ✅ Додано колапсні налаштування

// 'use client';

// import React, { useCallback, useEffect } from 'react';
// import { useGameState } from '../../../../hooks/useGameState';
// import GameStatus from '../ui/GameStatus';
// import GameTimer from '../ui/GameTimer';
// import ProgressBar from '../ui/ProgressBar';

// import type { 
//   GameMode, 
//   Player, 
//   BoardSize, 
//   Difficulty,
//   FirstMove,
//   GameAccess
// } from '../../../../types/game';

// // Типи для табів
// type GameTab = 'create-game' | 'create-tournament' | 'available-games';

// interface GameSectionProps {
//   className?: string;
// }

// const DECORATIVE_ICONS = [
//   'aijarvis.jpg',
//   'bean.jpg', 
//   'berzan.jpg',
//   'cultverse.jpg',
//   'enjoyoors.jpg',
//   'fantasy.jpg',
//   'keone.jpg',
//   'kintsu.png',
//   'kizzy.jpg',
//   'laMouch.jpg',
//   'lootgo.jpg',
//   'magicEden.jpg',
//   'medusa.jpg',
//   'mikeinweb.png',
//   'monadverse.jpg',
//   'monorail.png',
//   'moyaking.jpg',
//   'nadsa.jpg',
//   'narwhal.jpg',
//   'pump.jpg',
//   'purps.png',
//   'rugRumble.png',
//   'talentum.jpg',
//   'thedaks.jpg',
//   'thevapelabs.jpg'
// ].map(filename => `/game-icons/${filename}`);

// // Функція для отримання випадкових іконок
// const getRandomIcons = (count: number): string[] => {
//   const shuffled = [...DECORATIVE_ICONS].sort(() => 0.5 - Math.random());
//   return shuffled.slice(0, count);
// };

// export default function GameSection({ className = '' }: GameSectionProps) {
//   // Стан інтерфейсу (зберігаємо існуючу логіку)
//   const [activeTab, setActiveTab] = React.useState<GameTab>('create-game');
//   const [gameMode, setGameMode] = React.useState<GameMode>('ai');
  
//   // Налаштування гри (зберігаємо існуючі)
//   const [boardSize, setBoardSize] = React.useState<BoardSize>(3);
//   const [playerSymbol, setPlayerSymbol] = React.useState<Player>('X');
//   const [firstMove, setFirstMove] = React.useState<FirstMove>('random');
//   const [difficulty, setDifficulty] = React.useState<Difficulty>('medium');
//   const [hasStake, setHasStake] = React.useState(false);
//   const [stakeAmount, setStakeAmount] = React.useState('');
//   const [gameAccess, setGameAccess] = React.useState<GameAccess>('public');
//   const [decorativeIcons, setDecorativeIcons] = React.useState<string[]>([]);
  
//   // Стан для згортання/розгортання налаштувань
//   const [isSettingsCollapsed, setIsSettingsCollapsed] = React.useState(false);
  
//   // Відстежування зміни розміру поля
//   const [lastBoardSize, setLastBoardSize] = React.useState<BoardSize>(boardSize);
//   const [showIconsAfterSizeChange, setShowIconsAfterSizeChange] = React.useState(false);

//   // Ініціалізуємо новий хук управління грою
//   const gameState = useGameState({
//     initialSettings: {
//       boardSize,
//       gameMode,
//       playerSymbol,
//       aiDifficulty: difficulty,
//       timerEnabled: true,
//       timePerMove: 22,
//       aiThinkingTime: 1000
//     },
//     onGameEnd: (result, winner) => {
//       console.log('Гра завершена:', { result, winner });
//       // Тут можна додати логіку показу результатів
//     },
//     onStatisticsUpdate: (stats) => {
//       console.log('Статистика оновлена:', stats);
//     },
//     // persistGame: true
//   });

//   // Автоматичне згортання налаштувань при старті гри
//   useEffect(() => {
//     if (gameState.gameState === 'playing' && !isSettingsCollapsed) {
//       setIsSettingsCollapsed(true);
//     }
//   }, [gameState.gameState, isSettingsCollapsed]);

//   // Reset згортання при зміні табу
//   useEffect(() => {
//     setIsSettingsCollapsed(false);
//   }, [activeTab]);

//   // Іконки та розмір поля
//   useEffect(() => {
//     const iconCount = boardSize * boardSize;
//     setDecorativeIcons(getRandomIcons(iconCount));
    
//     // Перевіряємо чи змінився розмір поля
//     if (lastBoardSize !== boardSize) {
//       console.log('📐 Розмір поля змінено з', lastBoardSize, 'на', boardSize);
//       setShowIconsAfterSizeChange(true);
//       setLastBoardSize(boardSize);
//     }
//   }, [boardSize, lastBoardSize]);

//   // Обробка кліку по клітинці
//   const handleCellClick = useCallback(async (index: number) => {
//     // Додати debug інформацію:
//     if (boardSize === 4) {
//       console.log('🎯 Клік по клітинці:', {
//         index,
//         isRestricted: gameState.restrictedCells.includes(index),
//         canMakeMove: gameState.canMakeMoveWithRestrictions(index),
//         restrictedCells: gameState.restrictedCells,
//         currentPlayer: gameState.currentPlayer,
//         firstPlayer: gameState.firstPlayer
//       });
//     }

//     if (!gameState.canMakeMove(index)) return;
    
//     await gameState.makeMove(index);
//   }, [gameState, boardSize]);

//   const determineFirstPlayer = useCallback((): Player => {
//     if (gameMode === 'ai') {
//       switch (firstMove) {
//         case 'player': return playerSymbol;
//         case 'ai': return playerSymbol === 'X' ? 'O' : 'X';
//         case 'random': return Math.random() < 0.5 ? playerSymbol : (playerSymbol === 'X' ? 'O' : 'X');
//       }
//     }
//     return playerSymbol;
//   }, [firstMove, playerSymbol, gameMode]);

//   // Початок нової гри
//   const handleStartNewGame = useCallback(() => {
//     setShowIconsAfterSizeChange(false);

//     const firstPlayer = determineFirstPlayer();
//     // Оновлюємо налаштування перед початком
//     gameState.updateSettings({
//       boardSize,
//       gameMode,
//       playerSymbol,
//       aiDifficulty: difficulty,
//       timerEnabled: true,
//       timePerMove: 22,
//       aiThinkingTime: 1000
//     });
    
//     gameState.startNewGame(firstPlayer);

//     console.log('Налаштування гри:', {
//       gameMode: gameState.settings.gameMode,
//       playerSymbol: gameState.settings.playerSymbol,
//       firstPlayer,
//       currentPlayer: gameState.currentPlayer,
//       isPlayerTurn: gameState.currentPlayer === gameState.settings.playerSymbol,
//       showIconsAfterSizeChange: false
//     });
//   }, [gameState, boardSize, gameMode, playerSymbol, difficulty, determineFirstPlayer, firstMove]);

//   // Синхронізація налаштувань
//   useEffect(() => {
//     gameState.updateSettings({
//       boardSize,
//       gameMode,
//       playerSymbol,
//       aiDifficulty: difficulty
//     });
//   }, [boardSize, gameMode, playerSymbol, difficulty]);

//   // Рендеринг ігрового поля
//   const renderGameBoard = () => {
//     const gridSize = boardSize === 3 ? 'grid-cols-3' : 'grid-cols-4';
//     const boardWidth = boardSize === 3 ? 'w-64' : 'w-80';
    
//     console.log('🎯 Board render:', { 
//       boardSize, 
//       boardWidth, 
//       gridSize 
//     });

//     const shouldShowIcons = gameState.gameState === 'setup' || showIconsAfterSizeChange;

//     console.log('🖼️ Стан іконок:', {
//       gameState: gameState.gameState,
//       showIconsAfterSizeChange,
//       shouldShowIcons,
//       boardSize
//     });
    
//     return (
//       <div className={`bg-white/10 rounded-xl p-4 mb-6`}>
//         <div className={`grid ${gridSize} gap-2 ${boardWidth} mx-auto`}>
//           {gameState.board.map((cell, index) => {
//             // Додайте цю перевірку:
//             const maxIconIndex = boardSize * boardSize - 1;
//             if (shouldShowIcons && index > maxIconIndex) {
//               return null; // Не рендеримо зайві іконки
//             }
            
//             // Перевірка обмежень для 4×4
//             const isRestricted = gameState.restrictedCells.includes(index);
//             const canClick = gameState.canMakeMoveWithRestrictions ? 
//               gameState.canMakeMoveWithRestrictions(index) : 
//               gameState.canMakeMove(index);
            
//             return (
//               <button
//                 key={index}
//                 onClick={() => handleCellClick(index)}
//                 disabled={!gameState.gameActive || !canClick}
//                 title={isRestricted ? 'Заборонено правилами 4×4: другий хід не може бути поруч з першим' : undefined}
//                 className={`
//                   aspect-square rounded-xl flex items-center justify-center 
//                   text-2xl font-bold transition-all duration-300 hover:scale-105
//                   disabled:cursor-not-allowed overflow-hidden relative
//                   ${gameState.winningLine.includes(index) ? 'bg-green-500/50' : ''}
//                   ${shouldShowIcons ? 
//                     // Для іконок: без фону, тільки рамка
//                     'bg-transparent border-2 border-white/20 hover:border-white/40' : 
//                     // Для гри: звичайний фон
//                     isRestricted ? 
//                       'bg-white/20 hover:bg-white/30 cursor-not-allowed' : 
//                       'bg-white/20 hover:bg-white/30'
//                   }
//                   ${!canClick && !shouldShowIcons ? 'opacity-50' : ''}
//                 `}
//               >
//                 {/* Логіка відображення */}
//                 {shouldShowIcons ? (
//                   // До початку гри або після зміни розміру показуємо декоративні іконки
//                   <>
//                     <img 
//                       src={decorativeIcons[index] || '/game-icons/aijarvis.jpg'} 
//                       alt={`Декоративна іконка ${index + 1}`}
//                       className="absolute inset-0 w-full h-full object-cover rounded-lg
//                                transition-all duration-300 hover:scale-110"
//                       style={{ aspectRatio: '1 / 1' }}
//                       onError={(e) => {
//                         // Fallback до emoji якщо іконка не завантажилась
//                         const target = e.target as HTMLImageElement;
//                         target.style.display = 'none';
//                         const parent = target.parentElement!;
//                         parent.classList.add('bg-gradient-to-br', 'from-purple-500/50', 'to-blue-500/50');
//                         parent.innerHTML += '<span class="absolute inset-0 flex items-center justify-center text-3xl">🎮</span>';
//                       }}
//                     />
//                     {/* Градієнтний overlay для кращого вигляду */}
//                     <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/10 rounded-lg"></div>
//                   </>
//                 ) : (
//                   // Під час гри показуємо X/O або порожні клітинки
//                   <span className="z-10 relative">{cell}</span>
//                 )}
//               </button>
//             );
//           })}
//         </div>
        
//         {/* Інформація про обмеження */}
//         {boardSize === 4 && gameState.restrictionInfo.hasRestrictions && (
//           <div className="mt-3 p-2 bg-red-500/20 rounded-lg border border-red-400/30">
//             <div className="flex items-center gap-2 text-sm text-red-200">
//               <span>⚠️</span>
//               <span>{gameState.restrictionInfo.reasonDescription}</span>
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   };

//   // Рендеринг статусу гри та таймера
//   const renderGameStatus = () => {
//     return (
//       <div className="space-y-4 mb-6">
//         {/* Статус гри */}
//         <GameStatus
//           gameState={gameState.gameState}
//           currentPlayer={gameState.currentPlayer}
//           gameResult={gameState.gameResult}
//           gameMode={gameMode}
//           playerSymbol={playerSymbol}
//           isAIThinking={gameState.isAIThinking}
//           aiDifficulty={difficulty}
//           variant="default"
//           boardSize={boardSize}
//           restrictionInfo={gameState.restrictionInfo}
//           firstPlayer={gameState.firstPlayer}
//         />

//         {/* Новий компактний макет таймера + прогресу */}
//         {gameState.gameActive && (
//           <div className="bg-white/5 rounded-lg p-2">
//             {/* Верхня лінія: Прогрес + Міні таймер */}
//             <div className="flex items-center justify-between gap-3 mb-2">
//               <div className="flex-1">
//                 <ProgressBar
//                   value={gameState.gameStats.moves}
//                   maxValue={boardSize * boardSize}
//                   variant="timer"
//                   size="small"
//                   animated={true}
//                   className="h-2"
//                   showValues={false}
//                   showPercentage={false}
//                 />
//               </div>
              
//               <div className="flex items-center gap-2 shrink-0">
//                 {/* Міні круглий таймер */}
//                 <div className="w-6 h-6 relative">
//                   <GameTimer
//                     timeLeft={gameState.timeLeft}
//                     maxTime={gameState.settings.timePerMove}
//                     isRunning={gameState.isTimerRunning}
//                     isPaused={gameState.gameState === 'paused'}
//                     size="small"
//                     showIcon={false}
//                     className="w-6 h-6"
//                   />
//                 </div>
//                 <span className="text-sm font-medium text-white">{gameState.timeLeft}</span>
//               </div>
//             </div>
            
//             {/* Нижня лінія: Інфо */}
//             <div className="flex justify-between text-xs text-white/50">
//               <span>Ходів: {gameState.gameStats.moves}/{boardSize * boardSize}</span>
//               <span>Час на хід</span>
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   };

//   // Компонент створення гри
//   const CreateGameTab = () => (
//     <div className="space-y-4">
//       {/* Режим AI/PvP */}
//       <div className="flex gap-3 mb-6">
//         <button
//           onClick={() => setGameMode('ai')}
//           className={`flex-1 py-3 px-4 rounded-xl font-semibold text-base transition-all ${
//             gameMode === 'ai'
//               ? 'bg-purple-600 text-white shadow-lg'
//               : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
//           }`}
//         >
//           🤖 AI
//         </button>
//         <button
//           onClick={() => setGameMode('pvp')}
//           className={`flex-1 py-3 px-4 rounded-xl font-semibold text-base transition-all ${
//             gameMode === 'pvp'
//               ? 'bg-purple-600 text-white shadow-lg'
//               : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
//           }`}
//         >
//           ⚔️ PvP
//         </button>
//       </div>

//       {/* Назва гри */}
//       <div className="text-center text-xl font-semibold mb-6 flex items-center justify-center gap-2">
//         🎮 Хрестики-нулики
//       </div>

//       {/* Статус гри та таймер */}
//       {gameState.gameState !== 'setup' && renderGameStatus()}

//       {/* Ігрове поле */}
//       {renderGameBoard()}

//       {/* Кнопка розгортання налаштувань (показується тільки коли згорнуто) */}
//       {/* Тонка лінія з кнопкою розгортання (показується тільки коли згорнуто) */}
//       {isSettingsCollapsed && (
//         <div className="relative my-4">
//           <div className="absolute inset-0 flex items-center">
//             <div className="w-full border-t border-white/20"></div>
//           </div>
//           <div className="relative flex justify-center">
//             <button
//               onClick={() => setIsSettingsCollapsed(false)}
//               className="w-8 h-8 bg-purple-600 hover:bg-purple-700 rounded-full flex items-center justify-center
//                         transition-all duration-300 hover:scale-110 shadow-lg"
//             >
//               <span className="text-white text-sm">
//                 ▼
//               </span>
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Блок налаштувань з анімацією згортання/розгортання */}
//       <div className={`transition-all duration-700 ease-out overflow-hidden ${
//         isSettingsCollapsed 
//           ? 'max-h-0 opacity-0 transform -translate-y-2 pointer-events-none' 
//           : 'max-h-[1000px] opacity-100 transform translate-y-0'
//       }`}>

//         {/* Компактні налаштування */}
//         <div className="space-y-4">
//           {/* Розмір поля */}
//           <div className="flex justify-between items-center">
//             <span className="text-base font-medium opacity-90">Розмір:</span>
//             <div className="flex gap-2">
//               <button
//                 onClick={() => {
//                   console.log('🔘 Натиснуто кнопку 3×3');
//                   setBoardSize(3);
//                   gameState.setupGame()
//                   // Якщо гра не в стані setup, показуємо іконки
//                   if (gameState.gameState !== 'setup') {
//                     setShowIconsAfterSizeChange(true);
//                   }
//                 }}
//                 className={`px-4 py-2 text-base rounded-lg font-medium transition-all ${
//                   boardSize === 3
//                     ? 'bg-purple-600 text-white shadow-lg'
//                     : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
//                 }`}
//               >
//                 3×3
//               </button>
//               <button
//                 onClick={() => {
//                   console.log('🔘 Натиснуто кнопку 4×4');
//                   setBoardSize(4);
//                   gameState.setupGame()
//                   // Якщо гра не в стані setup, показуємо іконки
//                   if (gameState.gameState !== 'setup') {
//                     setShowIconsAfterSizeChange(true);
//                   }
//                 }}
//                 className={`px-4 py-2 text-base rounded-lg font-medium transition-all ${
//                   boardSize === 4
//                     ? 'bg-purple-600 text-white shadow-lg'
//                     : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
//                 }`}
//               >
//                 4×4
//               </button>
//             </div>
//           </div>

//           {/* Фігура */}
//           <div className="flex justify-between items-center">
//             <span className="text-base font-medium opacity-90">Фігура:</span>
//             <div className="flex gap-2">
//               <button
//                 onClick={() => setPlayerSymbol('X')}
//                 className={`px-4 py-2 text-base rounded-lg font-medium transition-all ${
//                   playerSymbol === 'X'
//                     ? 'bg-purple-600 text-white shadow-lg'
//                     : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
//                 }`}
//               >
//                 X
//               </button>
//               <button
//                 onClick={() => setPlayerSymbol('O')}
//                 className={`px-4 py-2 text-base rounded-lg font-medium transition-all ${
//                   playerSymbol === 'O'
//                     ? 'bg-purple-600 text-white shadow-lg'
//                     : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
//                 }`}
//               >
//                 O
//               </button>
//             </div>
//           </div>

//           {/* AI налаштування */}
//           {gameMode === 'ai' && (
//             <>
//               <div className="flex justify-between items-center">
//                 <span className="text-base font-medium opacity-90">Перший хід:</span>
//                 <div className="flex gap-2">
//                   <button
//                     onClick={() => setFirstMove('player')}
//                     className={`px-3 py-2 text-sm rounded-lg font-medium transition-all ${
//                       firstMove === 'player'
//                         ? 'bg-purple-600 text-white shadow-lg'
//                         : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
//                     }`}
//                   >
//                     Я
//                   </button>
//                   <button
//                     onClick={() => setFirstMove('ai')}
//                     className={`px-3 py-2 text-sm rounded-lg font-medium transition-all ${
//                       firstMove === 'ai'
//                         ? 'bg-purple-600 text-white shadow-lg'
//                         : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
//                     }`}
//                   >
//                     AI
//                   </button>
//                   <button
//                     onClick={() => setFirstMove('random')}
//                     className={`px-3 py-2 text-sm rounded-lg font-medium transition-all ${
//                       firstMove === 'random'
//                         ? 'bg-purple-600 text-white shadow-lg'
//                         : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
//                     }`}
//                   >
//                     Випадково
//                   </button>
//                 </div>
//               </div>

//               <div className="flex justify-between items-center">
//                 <span className="text-base font-medium opacity-90">Складність:</span>
//                 <div className="flex gap-2">
//                   <button
//                     onClick={() => setDifficulty('easy')}
//                     className={`px-3 py-2 text-sm rounded-lg font-medium transition-all ${
//                       difficulty === 'easy'
//                         ? 'bg-green-600 text-white shadow-lg'
//                         : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
//                     }`}
//                   >
//                     Легка
//                   </button>
//                   <button
//                     onClick={() => setDifficulty('medium')}
//                     className={`px-3 py-2 text-sm rounded-lg font-medium transition-all ${
//                       difficulty === 'medium'
//                         ? 'bg-yellow-600 text-white shadow-lg'
//                         : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
//                     }`}
//                   >
//                     Середня
//                   </button>
//                   <button
//                     onClick={() => setDifficulty('hard')}
//                     className={`px-3 py-2 text-sm rounded-lg font-medium transition-all ${
//                       difficulty === 'hard'
//                         ? 'bg-red-600 text-white shadow-lg'
//                         : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
//                     }`}
//                   >
//                     Важка
//                   </button>
//                 </div>
//               </div>
//             </>
//           )}

//           {/* PvP налаштування */}
//           {gameMode === 'pvp' && (
//             <>
//               <div className="flex justify-between items-center">
//                 <span className="text-base font-medium opacity-90">Перший хід:</span>
//                 <div className="flex gap-2">
//                   <button
//                     onClick={() => setFirstMove('player')}
//                     className={`px-3 py-2 text-sm rounded-lg font-medium transition-all ${
//                       firstMove === 'player'
//                         ? 'bg-purple-600 text-white shadow-lg'
//                         : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
//                     }`}
//                   >
//                     Я перший
//                   </button>
//                   <button
//                     onClick={() => setFirstMove('random')}
//                     className={`px-3 py-2 text-sm rounded-lg font-medium transition-all ${
//                       firstMove === 'random'
//                         ? 'bg-purple-600 text-white shadow-lg'
//                         : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
//                     }`}
//                   >
//                     Випадково
//                   </button>
//                 </div>
//               </div>

//               {/* Ставка */}
//               <div className="flex justify-between items-center">
//                 <span className="text-base font-medium opacity-90">Ставка:</span>
//                 <div className="flex gap-4 items-center">
//                   <label className="flex items-center gap-2 cursor-pointer text-sm">
//                     <input
//                       type="radio"
//                       name="stake"
//                       checked={!hasStake}
//                       onChange={() => setHasStake(false)}
//                       className="w-4 h-4"
//                     />
//                     <span>Без ставки</span>
//                   </label>
//                   <label className="flex items-center gap-2 cursor-pointer text-sm">
//                     <input
//                       type="radio"
//                       name="stake"
//                       checked={hasStake}
//                       onChange={() => setHasStake(true)}
//                       className="w-4 h-4"
//                     />
//                     <span>Зі ставкою</span>
//                   </label>
//                 </div>
//               </div>

//               {hasStake && (
//                 <div className="flex justify-between items-center">
//                   <span className="text-base font-medium opacity-90">Сума:</span>
//                   <input
//                     type="number"
//                     value={stakeAmount}
//                     onChange={(e) => setStakeAmount(e.target.value)}
//                     placeholder="0.01"
//                     step="0.01"
//                     min="0.01"
//                     className="w-24 px-3 py-2 text-sm bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50"
//                   />
//                 </div>
//               )}

//               {/* Доступ */}
//               <div className="flex justify-between items-center">
//                 <span className="text-base font-medium opacity-90">Доступ:</span>
//                 <div className="flex gap-4 items-center">
//                   <label className="flex items-center gap-2 cursor-pointer text-sm">
//                     <input
//                       type="radio"
//                       name="access"
//                       checked={gameAccess === 'public'}
//                       onChange={() => setGameAccess('public')}
//                       className="w-4 h-4"
//                     />
//                     <span>Публічна</span>
//                   </label>
//                   <label className="flex items-center gap-2 cursor-pointer text-sm">
//                     <input
//                       type="radio"
//                       name="access"
//                       checked={gameAccess === 'private'}
//                       onChange={() => setGameAccess('private')}
//                       className="w-4 h-4"
//                     />
//                     <span>Приватна</span>
//                   </label>
//                 </div>
//               </div>
//             </>
//           )}
//         </div>
//       </div>

//       {/* Кнопки управління */}
//       <div className="space-y-3">
//         {/* Кнопка старту/рестарту */}
//         <button
//           onClick={handleStartNewGame}
//           className="w-full bg-purple-600 hover:bg-purple-700 py-4 px-6 rounded-xl font-bold text-lg text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
//         >
//           {gameState.gameState === 'setup' ? '🎮 ПОЧАТИ ГРУ' : '🔄 НОВА ГРА'}
//         </button>

//         {/* Додаткові кнопки під час гри */}
//         {gameState.gameActive && (
//           <div className="flex gap-3">
//             <button
//               onClick={() => gameState.pauseGame()}
//               className="flex-1 bg-yellow-600 hover:bg-yellow-700 py-2 px-4 rounded-lg font-medium text-white transition-all"
//             >
//               ⏸️ Пауза
//             </button>
//             <button
//               onClick={() => gameState.resetGame()}
//               className="flex-1 bg-red-600 hover:bg-red-700 py-2 px-4 rounded-lg font-medium text-white transition-all"
//             >
//               🔄 Скинути
//             </button>
//           </div>
//         )}

//         {/* Кнопка продовження */}
//         {gameState.gameState === 'paused' && (
//           <button
//             onClick={() => gameState.resumeGame()}
//             className="w-full bg-green-600 hover:bg-green-700 py-3 px-6 rounded-xl font-bold text-white transition-all"
//           >
//             ▶️ ПРОДОВЖИТИ
//           </button>
//         )}
//       </div>

//       {/* Статистика сесії */}
//       {gameState.sessionStats.gamesPlayed > 0 && (
//         <div className="mt-6 p-4 bg-white/5 rounded-xl">
//           <h4 className="text-sm font-semibold text-white/90 mb-2">📊 Статистика сесії</h4>
//           <div className="grid grid-cols-2 gap-3 text-xs">
//             <div className="flex justify-between">
//               <span className="text-white/70">Ігор:</span>
//               <span className="text-white">{gameState.sessionStats.gamesPlayed}</span>
//             </div>
//             <div className="flex justify-between">
//               <span className="text-white/70">Перемог:</span>
//               <span className="text-green-400">{gameState.sessionStats.wins}</span>
//             </div>
//             <div className="flex justify-between">
//               <span className="text-white/70">Поразок:</span>
//               <span className="text-red-400">{gameState.sessionStats.losses}</span>
//             </div>
//             <div className="flex justify-between">
//               <span className="text-white/70">% перемог:</span>
//               <span className="text-blue-400">{gameState.sessionStats.winRate.toFixed(1)}%</span>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );

//   // Заглушка для інших табів
//   const CreateTournamentTab = () => (
//     <div className="text-center py-8">
//       <h3 className="text-xl font-semibold text-white mb-4">🏆 Турніри</h3>
//       <p className="text-white/70">Функціональність турнірів буде додана пізніше</p>
//     </div>
//   );

//   const AvailableGamesTab = () => (
//     <div className="text-center py-8">
//       <h3 className="text-xl font-semibold text-white mb-4">📋 Доступні ігри</h3>
//       <p className="text-white/70">Пошук ігор буде додано пізніше</p>
//     </div>
//   );

//   return (
//     <div className={`
//       bg-gradient-to-br from-gray-800/50 via-purple-800/50 to-gray-800/50 
//       backdrop-blur-md rounded-3xl p-4 lg:p-6 shadow-2xl 
//       border border-purple-500/20
//       ${className}
//     `}>
//       {/* Таби */}
//       <div className="flex gap-1 mb-6 bg-white/10 rounded-xl p-1">
//         <button
//           onClick={() => setActiveTab('create-game')}
//           className={`
//             flex-1 flex flex-col items-center gap-1 py-2 px-2 rounded-lg transition-all duration-300 text-xs
//             ${activeTab === 'create-game'
//               ? 'bg-purple-600 text-white'
//               : 'text-white/70 hover:text-white hover:bg-white/10'
//             }
//           `}
//         >
//           <span className="text-sm">🎮</span>
//           <span className="font-medium leading-tight text-center">Створити гру</span>
//         </button>
//         <button
//           onClick={() => setActiveTab('create-tournament')}
//           className={`
//             flex-1 flex flex-col items-center gap-1 py-2 px-2 rounded-lg transition-all duration-300 text-xs
//             ${activeTab === 'create-tournament'
//               ? 'bg-purple-600 text-white'
//               : 'text-white/70 hover:text-white hover:bg-white/10'
//             }
//           `}
//         >
//           <span className="text-sm">🏆</span>
//           <span className="font-medium leading-tight text-center">Створити турнір</span>
//         </button>
//         <button
//           onClick={() => setActiveTab('available-games')}
//           className={`
//             flex-1 flex flex-col items-center gap-1 py-2 px-2 rounded-lg transition-all duration-300 text-xs
//             ${activeTab === 'available-games'
//               ? 'bg-purple-600 text-white'
//               : 'text-white/70 hover:text-white hover:bg-white/10'
//             }
//           `}
//         >
//           <span className="text-sm">📋</span>
//           <span className="font-medium leading-tight text-center">Доступні ігри</span>
//         </button>
//       </div>

//       {/* Контент залежно від активного табу */}
//       <div className="min-h-[400px]">
//         {activeTab === 'create-game' && <CreateGameTab />}
//         {activeTab === 'create-tournament' && <CreateTournamentTab />}
//         {activeTab === 'available-games' && <AvailableGamesTab />}
//       </div>
//     </div>
//   );
// }












































// // components/game/sections/GameSection.tsx
// // Головний компонент ігрової секції з інтеграцією всіх нових хуків
// // ✅ Використовує useGameState для управління станом
// // ✅ Інтегрує GameStatus, GameTimer, ProgressBar
// // ✅ Зберігає існуючий інтерфейс
// // ✅ Підтримує AI та PvP режими
// // ✅ Додано колапсні налаштування

// 'use client';

// import React, { useCallback, useEffect } from 'react';
// import { useGameState } from '../../../../hooks/useGameState';
// import GameStatus from '../ui/GameStatus';
// import GameTimer from '../ui/GameTimer';
// import ProgressBar from '../ui/ProgressBar';

// import type { 
//   GameMode, 
//   Player, 
//   BoardSize, 
//   Difficulty,
//   FirstMove,
//   GameAccess
// } from '../../../../types/game';

// // Типи для табів
// type GameTab = 'create-game' | 'create-tournament' | 'available-games';

// interface GameSectionProps {
//   className?: string;
// }

// const DECORATIVE_ICONS = [
//   'aijarvis.jpg',
//   'bean.jpg', 
//   'berzan.jpg',
//   'cultverse.jpg',
//   'enjoyoors.jpg',
//   'fantasy.jpg',
//   'keone.jpg',
//   'kintsu.png',
//   'kizzy.jpg',
//   'laMouch.jpg',
//   'lootgo.jpg',
//   'magicEden.jpg',
//   'medusa.jpg',
//   'mikeinweb.png',
//   'monadverse.jpg',
//   'monorail.png',
//   'moyaking.jpg',
//   'nadsa.jpg',
//   'narwhal.jpg',
//   'pump.jpg',
//   'purps.png',
//   'rugRumble.png',
//   'talentum.jpg',
//   'thedaks.jpg',
//   'thevapelabs.jpg'
// ].map(filename => `/game-icons/${filename}`);

// // Функція для отримання випадкових іконок
// const getRandomIcons = (count: number): string[] => {
//   const shuffled = [...DECORATIVE_ICONS].sort(() => 0.5 - Math.random());
//   return shuffled.slice(0, count);
// };

// function GameSection({ className = '' }: GameSectionProps) {
//   // Стан інтерфейсу (зберігаємо існуючу логіку)
//   const [activeTab, setActiveTab] = React.useState<GameTab>('create-game');
//   const [gameMode, setGameMode] = React.useState<GameMode>('ai');
  
//   // Налаштування гри (зберігаємо існуючі)
//   const [boardSize, setBoardSize] = React.useState<BoardSize>(3);
//   const [playerSymbol, setPlayerSymbol] = React.useState<Player>('X');
//   const [firstMove, setFirstMove] = React.useState<FirstMove>('random');
//   const [difficulty, setDifficulty] = React.useState<Difficulty>('medium');
//   const [hasStake, setHasStake] = React.useState(false);
//   const [stakeAmount, setStakeAmount] = React.useState('');
//   const [gameAccess, setGameAccess] = React.useState<GameAccess>('public');
//   const [decorativeIcons, setDecorativeIcons] = React.useState<string[]>([]);
  
//   // Стан для згортання/розгортання налаштувань
//   const [isSettingsCollapsed, setIsSettingsCollapsed] = React.useState(false);
  
//   // Відстежування зміни розміру поля
//   const [lastBoardSize, setLastBoardSize] = React.useState<BoardSize>(boardSize);
//   const [showIconsAfterSizeChange, setShowIconsAfterSizeChange] = React.useState(false);
//   const [animationKey, setAnimationKey] = React.useState(0);

//   // Ініціалізуємо новий хук управління грою
//   const gameState = useGameState({
//     initialSettings: {
//       boardSize,
//       gameMode,
//       playerSymbol,
//       aiDifficulty: difficulty,
//       timerEnabled: true,
//       timePerMove: 22,
//       aiThinkingTime: 1000
//     },
//     onGameEnd: (result, winner) => {
//       console.log('Гра завершена:', { result, winner });
//       // Тут можна додати логіку показу результатів
//     },
//     onStatisticsUpdate: (stats) => {
//       console.log('Статистика оновлена:', stats);
//     },
//     // persistGame: true
//   });

//   // Автоматичне згортання налаштувань при старті гри
//   useEffect(() => {
//     if (gameState.gameState === 'playing' && !isSettingsCollapsed) {
//       setIsSettingsCollapsed(true);
//     }
//   }, [gameState.gameState, isSettingsCollapsed]);

//   useEffect(() => {
//     if (gameState.winningLine.length > 0) {
//       // Перезапускаємо анімацію при новій виграшній комбінації
//       setAnimationKey(prev => prev + 1);
//     }
//   }, [gameState.winningLine]);

//   // Reset згортання при зміні табу
//   useEffect(() => {
//     setIsSettingsCollapsed(false);
//   }, [activeTab]);

//   // Іконки та розмір поля
//   useEffect(() => {
//     const iconCount = boardSize * boardSize;
//     setDecorativeIcons(getRandomIcons(iconCount));
    
//     // Перевіряємо чи змінився розмір поля
//     if (lastBoardSize !== boardSize) {
//       console.log('📐 Розмір поля змінено з', lastBoardSize, 'на', boardSize);
//       setShowIconsAfterSizeChange(true);
//       setLastBoardSize(boardSize);
//     }
//   }, [boardSize, lastBoardSize]);

//   // Обробка кліку по клітинці
//   const handleCellClick = useCallback(async (index: number) => {
//     // Додати debug інформацію:
//     if (boardSize === 4) {
//       console.log('🎯 Клік по клітинці:', {
//         index,
//         isRestricted: gameState.restrictedCells.includes(index),
//         canMakeMove: gameState.canMakeMoveWithRestrictions(index),
//         restrictedCells: gameState.restrictedCells,
//         currentPlayer: gameState.currentPlayer,
//         firstPlayer: gameState.firstPlayer
//       });
//     }

//     if (!gameState.canMakeMove(index)) return;
    
//     await gameState.makeMove(index);
//   }, [gameState, boardSize]);

//   const determineFirstPlayer = useCallback((): Player => {
//     if (gameMode === 'ai') {
//       switch (firstMove) {
//         case 'player': return playerSymbol;
//         case 'ai': return playerSymbol === 'X' ? 'O' : 'X';
//         case 'random': return Math.random() < 0.5 ? playerSymbol : (playerSymbol === 'X' ? 'O' : 'X');
//       }
//     }
//     return playerSymbol;
//   }, [firstMove, playerSymbol, gameMode]);

//   // Початок нової гри
//   const handleStartNewGame = useCallback(() => {
//     setShowIconsAfterSizeChange(false);

//     const firstPlayer = determineFirstPlayer();
//     // Оновлюємо налаштування перед початком
//     gameState.updateSettings({
//       boardSize,
//       gameMode,
//       playerSymbol,
//       aiDifficulty: difficulty,
//       timerEnabled: true,
//       timePerMove: 22,
//       aiThinkingTime: 1000
//     });
    
//     gameState.startNewGame(firstPlayer);

//     console.log('Налаштування гри:', {
//       gameMode: gameState.settings.gameMode,
//       playerSymbol: gameState.settings.playerSymbol,
//       firstPlayer,
//       currentPlayer: gameState.currentPlayer,
//       isPlayerTurn: gameState.currentPlayer === gameState.settings.playerSymbol,
//       showIconsAfterSizeChange: false
//     });
//   }, [gameState, boardSize, gameMode, playerSymbol, difficulty, determineFirstPlayer, firstMove]);

//   // Синхронізація налаштувань
//   useEffect(() => {
//     gameState.updateSettings({
//       boardSize,
//       gameMode,
//       playerSymbol,
//       aiDifficulty: difficulty
//     });
//   }, [boardSize, gameMode, playerSymbol, difficulty]);


//   // Рендеринг ігрового поля
//   const renderGameBoard = () => {
//     const gridSize = boardSize === 3 ? 'grid-cols-3' : 'grid-cols-4';
//     const boardWidth = boardSize === 3 ? 'w-64' : 'w-80'; // Залишаємо для CSS стилізації
    
//     console.log('🎯 Board render:', { 
//       boardSize, 
//       boardWidth,
//       gridSize 
//     });
  
//     const shouldShowIcons = gameState.gameState === 'setup' || showIconsAfterSizeChange;
  
//     console.log('🖼️ Стан іконок:', {
//       gameState: gameState.gameState,
//       showIconsAfterSizeChange,
//       shouldShowIcons,
//       boardSize
//     });
    
//     return (
//       <div className={`bg-white/10 rounded-xl p-4 mb-6 relative`}>
//         {/* ✅ ЗМІНЮЄМО: Додаємо relative та data-атрибути для точних розрахунків */}
//         <div 
//           className={`grid ${gridSize} gap-2 ${boardWidth} mx-auto relative`}
//           data-board-size={boardSize}
//         >
//           {gameState.board.map((cell, index) => {
//             // Додайте цю перевірку:
//             const maxIconIndex = boardSize * boardSize - 1;
//             if (shouldShowIcons && index > maxIconIndex) {
//               return null; // Не рендеримо зайві іконки
//             }
            
//             // Перевірка обмежень для 4×4
//             const isRestricted = gameState.restrictedCells.includes(index);
//             const canClick = gameState.canMakeMoveWithRestrictions ? 
//               gameState.canMakeMoveWithRestrictions(index) : 
//               gameState.canMakeMove(index);
  
//             // ✅ ДОДАЄМО: Логіка для електричних ефектів
//             const isWinning = gameState.winningLine.includes(index);
//             const winIndex = gameState.winningLine.indexOf(index);
  
  
//             const getElectricEffects = () => {
//               if (!isWinning) return null;
              
//               return (
//                 <>
//                   {/* Основні електричні спалахи */}
//                   <div className="absolute top-0 left-1/2 w-1 h-1 bg-cyan-300 rounded-full animate-ping" 
//                        style={{ animationDelay: `${winIndex * 50}ms` }}></div>
//                   <div className="absolute bottom-0 right-1/2 w-1 h-1 bg-purple-400 rounded-full animate-ping" 
//                        style={{ animationDelay: `${winIndex * 50 + 200}ms` }}></div>
//                   <div className="absolute left-0 top-1/2 w-1 h-1 bg-pink-400 rounded-full animate-ping" 
//                        style={{ animationDelay: `${winIndex * 50 + 400}ms` }}></div>
//                   <div className="absolute right-0 bottom-1/2 w-1 h-1 bg-indigo-400 rounded-full animate-ping" 
//                        style={{ animationDelay: `${winIndex * 50 + 600}ms` }}></div>
                  
//                   {/* Кутові спалахи з різними кольорами */}
//                   <div className="absolute top-1 right-1 w-0.5 h-0.5 bg-cyan-200 rounded-full animate-pulse" 
//                        style={{ animationDelay: `${winIndex * 100}ms` }}></div>
//                   <div className="absolute bottom-1 left-1 w-0.5 h-0.5 bg-purple-300 rounded-full animate-pulse" 
//                        style={{ animationDelay: `${winIndex * 100 + 300}ms` }}></div>
//                   <div className="absolute top-1 left-1 w-0.5 h-0.5 bg-pink-300 rounded-full animate-pulse" 
//                        style={{ animationDelay: `${winIndex * 100 + 500}ms` }}></div>
//                   <div className="absolute bottom-1 right-1 w-0.5 h-0.5 bg-indigo-300 rounded-full animate-pulse" 
//                        style={{ animationDelay: `${winIndex * 100 + 700}ms` }}></div>
//                 </>
//               );
//             };
            
//             return (
//               <button
//                 key={`${animationKey}-${index}`}
//                 onClick={() => handleCellClick(index)}
//                 disabled={!gameState.gameActive || !canClick}
//                 title={isRestricted ? 'Заборонено правилами 4×4: другий хід не може бути поруч з першим' : undefined}
//                 style={isWinning ? { animationDelay: `${winIndex * 150}ms` } : {}}
//                 className={
//                   isWinning 
//                     ? 'aspect-square rounded-xl flex items-center justify-center text-2xl font-bold relative overflow-hidden animate-pulse bg-gradient-to-br from-purple-600 via-pink-500 to-indigo-800 scale-110 shadow-[0_0_30px_rgba(168,85,247,0.8)] border-2 border-purple-300'
//                     : `aspect-square rounded-xl flex items-center justify-center text-2xl font-bold transition-all duration-500 relative overflow-hidden
//                       ${shouldShowIcons ? 'bg-transparent border-2 border-white/20 hover:border-white/40' : 
//                         (isRestricted ? 'bg-white/20 hover:bg-white/30 cursor-not-allowed' : 'bg-white/20 hover:bg-white/30')}
//                       ${!canClick && !shouldShowIcons ? 'opacity-50' : ''}
//                       ${!gameState.gameActive && !shouldShowIcons ? 'cursor-default' : ''}`
//                 }
//               >
//                 {/* Логіка відображення */}
//                 {shouldShowIcons ? (
//                   // До початку гри або після зміни розміру показуємо декоративні іконки
//                   <>
//                     <img 
//                       src={decorativeIcons[index] || '/game-icons/aijarvis.jpg'} 
//                       alt={`Декоративна іконка ${index + 1}`}
//                       className="absolute inset-0 w-full h-full object-cover rounded-lg
//                                transition-all duration-300 hover:scale-110"
//                       style={{ aspectRatio: '1 / 1' }}
//                       onError={(e) => {
//                         // Fallback до emoji якщо іконка не завантажилась
//                         const target = e.target as HTMLImageElement;
//                         target.style.display = 'none';
//                         const parent = target.parentElement!;
//                         parent.classList.add('bg-gradient-to-br', 'from-purple-500/50', 'to-blue-500/50');
//                         parent.innerHTML += '<span class="absolute inset-0 flex items-center justify-center text-3xl">🎮</span>';
//                       }}
//                     />
//                     {/* Градієнтний overlay для кращого вигляду */}
//                     <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/10 rounded-lg"></div>
//                   </>
//               ) : (
//                 // ✅ ЗМІНЮЄМО: Під час гри показуємо X/O з ефектами
//                 <>
//                   <span className={`
//                     ${isWinning ? 'text-white font-black text-3xl drop-shadow-lg' : 'text-white/90'} 
//                     z-20 relative
//                   `}>
//                     {cell}
//                   </span>
                  
//                   {getElectricEffects()}
//                 </>
//               )}
//               </button>
//             );
//           })}
//         </div>
        
//         {/* Інформація про обмеження */}
//         {boardSize === 4 && gameState.restrictionInfo.hasRestrictions && (
//           <div className="mt-3 p-2 bg-red-500/20 rounded-lg border border-red-400/30">
//             <div className="flex items-center gap-2 text-sm text-red-200">
//               <span>⚠️</span>
//               <span>{gameState.restrictionInfo.reasonDescription}</span>
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   };

//   // Рендеринг статусу гри та таймера
//   const renderGameStatus = () => {
//     return (
//       <div className="space-y-4 mb-6">
//         {/* Статус гри */}
//         <GameStatus
//           gameState={gameState.gameState}
//           currentPlayer={gameState.currentPlayer}
//           gameResult={gameState.gameResult}
//           gameMode={gameMode}
//           playerSymbol={playerSymbol}
//           isAIThinking={gameState.isAIThinking}
//           aiDifficulty={difficulty}
//           variant="default"
//           boardSize={boardSize}
//           restrictionInfo={gameState.restrictionInfo}
//           firstPlayer={gameState.firstPlayer}
//         />

//         {/* Новий компактний макет таймера + прогресу */}
//         {gameState.gameActive && (
//           <div className="bg-white/5 rounded-lg p-2">
//             {/* Верхня лінія: Прогрес + Міні таймер */}
//             <div className="flex items-center justify-between gap-3 mb-2">
//               <div className="flex-1">
//                 <ProgressBar
//                   value={gameState.gameStats.moves}
//                   maxValue={boardSize * boardSize}
//                   variant="timer"
//                   size="small"
//                   animated={true}
//                   className="h-2"
//                   showValues={false}
//                   showPercentage={false}
//                 />
//               </div>
              
//               <div className="flex items-center gap-2 shrink-0">
//                 {/* Міні круглий таймер */}
//                 <div className="w-6 h-6 relative">
//                   <GameTimer
//                     timeLeft={gameState.timeLeft}
//                     maxTime={gameState.settings.timePerMove}
//                     isRunning={gameState.isTimerRunning}
//                     isPaused={gameState.gameState === 'paused'}
//                     size="small"
//                     showIcon={false}
//                     className="w-6 h-6"
//                   />
//                 </div>
//                 <span className="text-sm font-medium text-white">{gameState.timeLeft}</span>
//               </div>
//             </div>
            
//             {/* Нижня лінія: Інфо */}
//             <div className="flex justify-between text-xs text-white/50">
//               <span>Ходів: {gameState.gameStats.moves}/{boardSize * boardSize}</span>
//               <span>Час на хід</span>
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   };

//   // Компонент створення гри
//   const CreateGameTab = () => (
//     <div className="space-y-4">
//       {/* Режим AI/PvP */}
//       <div className="flex gap-3 mb-6">
//         <button
//           onClick={() => setGameMode('ai')}
//           className={`flex-1 py-3 px-4 rounded-xl font-semibold text-base transition-all ${
//             gameMode === 'ai'
//               ? 'bg-purple-600 text-white shadow-lg'
//               : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
//           }`}
//         >
//           🤖 AI
//         </button>
//         <button
//           onClick={() => setGameMode('pvp')}
//           className={`flex-1 py-3 px-4 rounded-xl font-semibold text-base transition-all ${
//             gameMode === 'pvp'
//               ? 'bg-purple-600 text-white shadow-lg'
//               : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
//           }`}
//         >
//           ⚔️ PvP
//         </button>
//       </div>

//       {/* Назва гри */}
//       <div className="text-center text-xl font-semibold mb-6 flex items-center justify-center gap-2">
//         🎮 Хрестики-нулики
//       </div>

//       {/* Статус гри та таймер */}
//       {gameState.gameState !== 'setup' && renderGameStatus()}

//       {/* Ігрове поле */}
//       {renderGameBoard()}

//       {/* Кнопка розгортання налаштувань (показується тільки коли згорнуто) */}
//       {/* Тонка лінія з кнопкою розгортання (показується тільки коли згорнуто) */}
//       {isSettingsCollapsed && (
//         <div className="relative my-4">
//           <div className="absolute inset-0 flex items-center">
//             <div className="w-full border-t border-white/20"></div>
//           </div>
//           <div className="relative flex justify-center">
//             <button
//               onClick={() => setIsSettingsCollapsed(false)}
//               className="w-8 h-8 bg-purple-600 hover:bg-purple-700 rounded-full flex items-center justify-center
//                         transition-all duration-300 hover:scale-110 shadow-lg"
//             >
//               <span className="text-white text-sm">
//                 ▼
//               </span>
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Блок налаштувань з анімацією згортання/розгортання */}
//       <div className={`transition-all duration-700 ease-out overflow-hidden ${
//         isSettingsCollapsed 
//           ? 'max-h-0 opacity-0 transform -translate-y-2 pointer-events-none' 
//           : 'max-h-[1000px] opacity-100 transform translate-y-0'
//       }`}>

//         {/* Компактні налаштування */}
//         <div className="space-y-4">
//           {/* Розмір поля */}
//           <div className="flex justify-between items-center">
//             <span className="text-base font-medium opacity-90">Розмір:</span>
//             <div className="flex gap-2">
//               <button
//                 onClick={() => {
//                   console.log('🔘 Натиснуто кнопку 3×3');
//                   setBoardSize(3);
//                   gameState.setupGame()
//                   // Якщо гра не в стані setup, показуємо іконки
//                   if (gameState.gameState !== 'setup') {
//                     setShowIconsAfterSizeChange(true);
//                   }
//                 }}
//                 className={`px-4 py-2 text-base rounded-lg font-medium transition-all ${
//                   boardSize === 3
//                     ? 'bg-purple-600 text-white shadow-lg'
//                     : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
//                 }`}
//               >
//                 3×3
//               </button>
//               <button
//                 onClick={() => {
//                   console.log('🔘 Натиснуто кнопку 4×4');
//                   setBoardSize(4);
//                   gameState.setupGame()
//                   // Якщо гра не в стані setup, показуємо іконки
//                   if (gameState.gameState !== 'setup') {
//                     setShowIconsAfterSizeChange(true);
//                   }
//                 }}
//                 className={`px-4 py-2 text-base rounded-lg font-medium transition-all ${
//                   boardSize === 4
//                     ? 'bg-purple-600 text-white shadow-lg'
//                     : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
//                 }`}
//               >
//                 4×4
//               </button>
//             </div>
//           </div>

//           {/* Фігура */}
//           <div className="flex justify-between items-center">
//             <span className="text-base font-medium opacity-90">Фігура:</span>
//             <div className="flex gap-2">
//               <button
//                 onClick={() => setPlayerSymbol('X')}
//                 className={`px-4 py-2 text-base rounded-lg font-medium transition-all ${
//                   playerSymbol === 'X'
//                     ? 'bg-purple-600 text-white shadow-lg'
//                     : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
//                 }`}
//               >
//                 X
//               </button>
//               <button
//                 onClick={() => setPlayerSymbol('O')}
//                 className={`px-4 py-2 text-base rounded-lg font-medium transition-all ${
//                   playerSymbol === 'O'
//                     ? 'bg-purple-600 text-white shadow-lg'
//                     : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
//                 }`}
//               >
//                 O
//               </button>
//             </div>
//           </div>

//           {/* AI налаштування */}
//           {gameMode === 'ai' && (
//             <>
//               <div className="flex justify-between items-center">
//                 <span className="text-base font-medium opacity-90">Перший хід:</span>
//                 <div className="flex gap-2">
//                   <button
//                     onClick={() => setFirstMove('player')}
//                     className={`px-3 py-2 text-sm rounded-lg font-medium transition-all ${
//                       firstMove === 'player'
//                         ? 'bg-purple-600 text-white shadow-lg'
//                         : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
//                     }`}
//                   >
//                     Я
//                   </button>
//                   <button
//                     onClick={() => setFirstMove('ai')}
//                     className={`px-3 py-2 text-sm rounded-lg font-medium transition-all ${
//                       firstMove === 'ai'
//                         ? 'bg-purple-600 text-white shadow-lg'
//                         : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
//                     }`}
//                   >
//                     AI
//                   </button>
//                   <button
//                     onClick={() => setFirstMove('random')}
//                     className={`px-3 py-2 text-sm rounded-lg font-medium transition-all ${
//                       firstMove === 'random'
//                         ? 'bg-purple-600 text-white shadow-lg'
//                         : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
//                     }`}
//                   >
//                     Випадково
//                   </button>
//                 </div>
//               </div>

//               <div className="flex justify-between items-center">
//                 <span className="text-base font-medium opacity-90">Складність:</span>
//                 <div className="flex gap-2">
//                   <button
//                     onClick={() => setDifficulty('easy')}
//                     className={`px-3 py-2 text-sm rounded-lg font-medium transition-all ${
//                       difficulty === 'easy'
//                         ? 'bg-green-600 text-white shadow-lg'
//                         : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
//                     }`}
//                   >
//                     Легка
//                   </button>
//                   <button
//                     onClick={() => setDifficulty('medium')}
//                     className={`px-3 py-2 text-sm rounded-lg font-medium transition-all ${
//                       difficulty === 'medium'
//                         ? 'bg-yellow-600 text-white shadow-lg'
//                         : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
//                     }`}
//                   >
//                     Середня
//                   </button>
//                   <button
//                     onClick={() => setDifficulty('hard')}
//                     className={`px-3 py-2 text-sm rounded-lg font-medium transition-all ${
//                       difficulty === 'hard'
//                         ? 'bg-red-600 text-white shadow-lg'
//                         : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
//                     }`}
//                   >
//                     Важка
//                   </button>
//                 </div>
//               </div>
//             </>
//           )}

//           {/* PvP налаштування */}
//           {gameMode === 'pvp' && (
//             <>
//               <div className="flex justify-between items-center">
//                 <span className="text-base font-medium opacity-90">Перший хід:</span>
//                 <div className="flex gap-2">
//                   <button
//                     onClick={() => setFirstMove('player')}
//                     className={`px-3 py-2 text-sm rounded-lg font-medium transition-all ${
//                       firstMove === 'player'
//                         ? 'bg-purple-600 text-white shadow-lg'
//                         : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
//                     }`}
//                   >
//                     Я перший
//                   </button>
//                   <button
//                     onClick={() => setFirstMove('random')}
//                     className={`px-3 py-2 text-sm rounded-lg font-medium transition-all ${
//                       firstMove === 'random'
//                         ? 'bg-purple-600 text-white shadow-lg'
//                         : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
//                     }`}
//                   >
//                     Випадково
//                   </button>
//                 </div>
//               </div>

//               {/* Ставка */}
//               <div className="flex justify-between items-center">
//                 <span className="text-base font-medium opacity-90">Ставка:</span>
//                 <div className="flex gap-4 items-center">
//                   <label className="flex items-center gap-2 cursor-pointer text-sm">
//                     <input
//                       type="radio"
//                       name="stake"
//                       checked={!hasStake}
//                       onChange={() => setHasStake(false)}
//                       className="w-4 h-4"
//                     />
//                     <span>Без ставки</span>
//                   </label>
//                   <label className="flex items-center gap-2 cursor-pointer text-sm">
//                     <input
//                       type="radio"
//                       name="stake"
//                       checked={hasStake}
//                       onChange={() => setHasStake(true)}
//                       className="w-4 h-4"
//                     />
//                     <span>Зі ставкою</span>
//                   </label>
//                 </div>
//               </div>

//               {hasStake && (
//                 <div className="flex justify-between items-center">
//                   <span className="text-base font-medium opacity-90">Сума:</span>
//                   <input
//                     type="number"
//                     value={stakeAmount}
//                     onChange={(e) => setStakeAmount(e.target.value)}
//                     placeholder="0.01"
//                     step="0.01"
//                     min="0.01"
//                     className="w-24 px-3 py-2 text-sm bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50"
//                   />
//                 </div>
//               )}

//               {/* Доступ */}
//               <div className="flex justify-between items-center">
//                 <span className="text-base font-medium opacity-90">Доступ:</span>
//                 <div className="flex gap-4 items-center">
//                   <label className="flex items-center gap-2 cursor-pointer text-sm">
//                     <input
//                       type="radio"
//                       name="access"
//                       checked={gameAccess === 'public'}
//                       onChange={() => setGameAccess('public')}
//                       className="w-4 h-4"
//                     />
//                     <span>Публічна</span>
//                   </label>
//                   <label className="flex items-center gap-2 cursor-pointer text-sm">
//                     <input
//                       type="radio"
//                       name="access"
//                       checked={gameAccess === 'private'}
//                       onChange={() => setGameAccess('private')}
//                       className="w-4 h-4"
//                     />
//                     <span>Приватна</span>
//                   </label>
//                 </div>
//               </div>
//             </>
//           )}
//         </div>
//       </div>

//       {/* Кнопки управління */}
//       <div className="space-y-3">
//         {/* Кнопка старту/рестарту */}
//         <button
//           onClick={handleStartNewGame}
//           className="w-full bg-purple-600 hover:bg-purple-700 py-4 px-6 rounded-xl font-bold text-lg text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
//         >
//           {gameState.gameState === 'setup' ? '🎮 ПОЧАТИ ГРУ' : '🔄 НОВА ГРА'}
//         </button>

//         {/* Додаткові кнопки під час гри */}
//         {gameState.gameActive && (
//           <div className="flex gap-3">
//             <button
//               onClick={() => gameState.pauseGame()}
//               className="flex-1 bg-yellow-600 hover:bg-yellow-700 py-2 px-4 rounded-lg font-medium text-white transition-all"
//             >
//               ⏸️ Пауза
//             </button>
//             <button
//               onClick={() => gameState.resetGame()}
//               className="flex-1 bg-red-600 hover:bg-red-700 py-2 px-4 rounded-lg font-medium text-white transition-all"
//             >
//               🔄 Скинути
//             </button>
//           </div>
//         )}

//         {/* Кнопка продовження */}
//         {gameState.gameState === 'paused' && (
//           <button
//             onClick={() => gameState.resumeGame()}
//             className="w-full bg-green-600 hover:bg-green-700 py-3 px-6 rounded-xl font-bold text-white transition-all"
//           >
//             ▶️ ПРОДОВЖИТИ
//           </button>
//         )}
//       </div>

//       {/* Статистика сесії */}
//       {gameState.sessionStats.gamesPlayed > 0 && (
//         <div className="mt-6 p-4 bg-white/5 rounded-xl">
//           <h4 className="text-sm font-semibold text-white/90 mb-2">📊 Статистика сесії</h4>
//           <div className="grid grid-cols-2 gap-3 text-xs">
//             <div className="flex justify-between">
//               <span className="text-white/70">Ігор:</span>
//               <span className="text-white">{gameState.sessionStats.gamesPlayed}</span>
//             </div>
//             <div className="flex justify-between">
//               <span className="text-white/70">Перемог:</span>
//               <span className="text-green-400">{gameState.sessionStats.wins}</span>
//             </div>
//             <div className="flex justify-between">
//               <span className="text-white/70">Поразок:</span>
//               <span className="text-red-400">{gameState.sessionStats.losses}</span>
//             </div>
//             <div className="flex justify-between">
//               <span className="text-white/70">% перемог:</span>
//               <span className="text-blue-400">{gameState.sessionStats.winRate.toFixed(1)}%</span>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );

//   // Заглушка для інших табів
//   const CreateTournamentTab = () => (
//     <div className="text-center py-8">
//       <h3 className="text-xl font-semibold text-white mb-4">🏆 Турніри</h3>
//       <p className="text-white/70">Функціональність турнірів буде додана пізніше</p>
//     </div>
//   );

//   const AvailableGamesTab = () => (
//     <div className="text-center py-8">
//       <h3 className="text-xl font-semibold text-white mb-4">📋 Доступні ігри</h3>
//       <p className="text-white/70">Пошук ігор буде додано пізніше</p>
//     </div>
//   );

//   return (
//     <div className={`
//       bg-gradient-to-br from-gray-800/50 via-purple-800/50 to-gray-800/50 
//       backdrop-blur-md rounded-3xl p-4 lg:p-6 shadow-2xl 
//       border border-purple-500/20
//       ${className}
//     `}>
//       {/* Таби */}
//       <div className="flex gap-1 mb-6 bg-white/10 rounded-xl p-1">
//         <button
//           onClick={() => setActiveTab('create-game')}
//           className={`
//             flex-1 flex flex-col items-center gap-1 py-2 px-2 rounded-lg transition-all duration-300 text-xs
//             ${activeTab === 'create-game'
//               ? 'bg-purple-600 text-white'
//               : 'text-white/70 hover:text-white hover:bg-white/10'
//             }
//           `}
//         >
//           <span className="text-sm">🎮</span>
//           <span className="font-medium leading-tight text-center">Створити гру</span>
//         </button>
//         <button
//           onClick={() => setActiveTab('create-tournament')}
//           className={`
//             flex-1 flex flex-col items-center gap-1 py-2 px-2 rounded-lg transition-all duration-300 text-xs
//             ${activeTab === 'create-tournament'
//               ? 'bg-purple-600 text-white'
//               : 'text-white/70 hover:text-white hover:bg-white/10'
//             }
//           `}
//         >
//           <span className="text-sm">🏆</span>
//           <span className="font-medium leading-tight text-center">Створити турнір</span>
//         </button>
//         <button
//           onClick={() => setActiveTab('available-games')}
//           className={`
//             flex-1 flex flex-col items-center gap-1 py-2 px-2 rounded-lg transition-all duration-300 text-xs
//             ${activeTab === 'available-games'
//               ? 'bg-purple-600 text-white'
//               : 'text-white/70 hover:text-white hover:bg-white/10'
//             }
//           `}
//         >
//           <span className="text-sm">📋</span>
//           <span className="font-medium leading-tight text-center">Доступні ігри</span>
//         </button>
//       </div>

//       {/* Контент залежно від активного табу */}
//       <div className="min-h-[400px]">
//         {activeTab === 'create-game' && <CreateGameTab />}
//         {activeTab === 'create-tournament' && <CreateTournamentTab />}
//         {activeTab === 'available-games' && <AvailableGamesTab />}
//       </div>
//     </div>
//   );
// }
// export default React.memo(GameSection);
































































// // components/game/sections/GameSection.tsx
// // Головний компонент ігрової секції з інтеграцією всіх нових хуків
// // ✅ Використовує useGameState для управління станом
// // ✅ Інтегрує GameStatus, GameTimer, ProgressBar
// // ✅ Зберігає існуючий інтерфейс
// // ✅ Підтримує AI та PvP режими
// // ✅ Додано колапсні налаштування

// 'use client';

// import React, { useCallback, useEffect } from 'react';
// import { useTranslation } from '../../../../lib/i18n';
// import { useGameState } from '../../../../hooks/useGameState';
// import GameStatus from '../ui/GameStatus';
// import GameTimer from '../ui/GameTimer';
// import ProgressBar from '../ui/ProgressBar';

// import type { 
//   GameMode, 
//   Player, 
//   BoardSize, 
//   Difficulty,
//   FirstMove
// } from '../../../../types/game';

// // Типи для табів
// type GameTab = 'create-game' | 'create-tournament' | 'available-games';

// interface GameSectionProps {
//   className?: string;
// }

// const DECORATIVE_ICONS = [
//   'aijarvis.jpg',
//   'bean.jpg', 
//   'berzan.jpg',
//   'cultverse.jpg',
//   'enjoyoors.jpg',
//   'fantasy.jpg',
//   'keone.jpg',
//   'kintsu.png',
//   'kizzy.jpg',
//   'laMouch.jpg',
//   'lootgo.jpg',
//   'magicEden.jpg',
//   'medusa.jpg',
//   'mikeinweb.png',
//   'monadverse.jpg',
//   'monorail.png',
//   'moyaking.jpg',
//   'nadsa.jpg',
//   'narwhal.jpg',
//   'pump.jpg',
//   'purps.png',
//   'rugRumble.png',
//   'talentum.jpg',
//   'thedaks.jpg',
//   'thevapelabs.jpg'
// ].map(filename => `/game-icons/${filename}`);

// // Функція для отримання випадкових іконок
// const getRandomIcons = (count: number): string[] => {
//   const shuffled = [...DECORATIVE_ICONS].sort(() => 0.5 - Math.random());
//   return shuffled.slice(0, count);
// };

// function GameSection({ className = '' }: GameSectionProps) {
//   const { t } = useTranslation();
//   // Стан інтерфейсу (зберігаємо існуючу логіку)
//   const [activeTab, setActiveTab] = React.useState<GameTab>('create-game');
//   const [gameMode, setGameMode] = React.useState<GameMode>('ai');
  
//   // Налаштування гри (зберігаємо існуючі)
//   const [boardSize, setBoardSize] = React.useState<BoardSize>(3);
//   const [playerSymbol, setPlayerSymbol] = React.useState<Player>('X');
//   const [firstMove, setFirstMove] = React.useState<FirstMove>('random');
//   const [difficulty, setDifficulty] = React.useState<Difficulty>('medium');
//   const [hasStake, setHasStake] = React.useState(false);
//   const [stakeAmount, setStakeAmount] = React.useState('');
//   const [decorativeIcons, setDecorativeIcons] = React.useState<string[]>([]);
  
//   // Стан для згортання/розгортання налаштувань
//   const [isSettingsCollapsed, setIsSettingsCollapsed] = React.useState(false);
  
//   // Відстежування зміни розміру поля
//   const [lastBoardSize, setLastBoardSize] = React.useState<BoardSize>(boardSize);
//   const [showIconsAfterSizeChange, setShowIconsAfterSizeChange] = React.useState(false);
//   const [animationKey, setAnimationKey] = React.useState(0);

//   // Ініціалізуємо новий хук управління грою
//   const gameState = useGameState({
//     initialSettings: {
//       boardSize,
//       gameMode,
//       playerSymbol,
//       aiDifficulty: difficulty,
//       timerEnabled: true,
//       timePerMove: 22,
//       aiThinkingTime: 1000
//     },
//     //language: 'uk', 
//     onGameEnd: (result, winner) => {
//       console.log('Гра завершена:', { result, winner });
//       // Тут можна додати логіку показу результатів
//     },
//     onStatisticsUpdate: (stats) => {
//       console.log('Статистика оновлена:', stats);
//     },
//     // persistGame: true
//   });

//   // Автоматичне згортання налаштувань при старті гри
//   useEffect(() => {
//     if (gameState.gameState === 'playing' && !isSettingsCollapsed) {
//       setIsSettingsCollapsed(true);
//     }
//   }, [gameState.gameState, isSettingsCollapsed]);

//   useEffect(() => {
//     if (gameState.winningLine.length > 0) {
//       // Перезапускаємо анімацію при новій виграшній комбінації
//       setAnimationKey(prev => prev + 1);
//     }
//   }, [gameState.winningLine]);

//   // Reset згортання при зміні табу
//   useEffect(() => {
//     setIsSettingsCollapsed(false);
//   }, [activeTab]);

//   // Іконки та розмір поля
//   useEffect(() => {
//     const iconCount = boardSize * boardSize;
//     setDecorativeIcons(getRandomIcons(iconCount));
    
//     // Перевіряємо чи змінився розмір поля
//     if (lastBoardSize !== boardSize) {
//       console.log('📐 Розмір поля змінено з', lastBoardSize, 'на', boardSize);
//       setShowIconsAfterSizeChange(true);
//       setLastBoardSize(boardSize);
//     }
//   }, [boardSize, lastBoardSize]);

//   // Обробка кліку по клітинці
//   const handleCellClick = useCallback(async (index: number) => {
//     // Додати debug інформацію:
//     if (boardSize === 4) {
//       console.log('🎯 Клік по клітинці:', {
//         index,
//         isRestricted: gameState.restrictedCells.includes(index),
//         canMakeMove: gameState.canMakeMoveWithRestrictions(index),
//         restrictedCells: gameState.restrictedCells,
//         currentPlayer: gameState.currentPlayer,
//         firstPlayer: gameState.firstPlayer
//       });
//     }

//     if (!gameState.canMakeMove(index)) return;
    
//     await gameState.makeMove(index);
//   }, [gameState, boardSize]);

//   const determineFirstPlayer = useCallback((): Player => {
//     if (gameMode === 'ai') {
//       switch (firstMove) {
//         case 'player': return playerSymbol;
//         case 'ai': return playerSymbol === 'X' ? 'O' : 'X';
//         case 'random': return Math.random() < 0.5 ? playerSymbol : (playerSymbol === 'X' ? 'O' : 'X');
//       }
//     }
//     return playerSymbol;
//   }, [firstMove, playerSymbol, gameMode]);

//   // Початок нової гри
//   const handleStartNewGame = useCallback(() => {
//     setShowIconsAfterSizeChange(false);

//     const firstPlayer = determineFirstPlayer();
//     // Оновлюємо налаштування перед початком
//     gameState.updateSettings({
//       boardSize,
//       gameMode,
//       playerSymbol,
//       aiDifficulty: difficulty,
//       timerEnabled: true,
//       timePerMove: 22,
//       aiThinkingTime: 1000
//     });
    
//     gameState.startNewGame(firstPlayer);

//     console.log('Налаштування гри:', {
//       gameMode: gameState.settings.gameMode,
//       playerSymbol: gameState.settings.playerSymbol,
//       firstPlayer,
//       currentPlayer: gameState.currentPlayer,
//       isPlayerTurn: gameState.currentPlayer === gameState.settings.playerSymbol,
//       showIconsAfterSizeChange: false
//     });
//   }, [gameState, boardSize, gameMode, playerSymbol, difficulty, determineFirstPlayer, firstMove]);

//   // Синхронізація налаштувань
//   useEffect(() => {
//     gameState.updateSettings({
//       boardSize,
//       gameMode,
//       playerSymbol,
//       aiDifficulty: difficulty
//     });
//   }, [boardSize, gameMode, playerSymbol, difficulty]);


//   // Рендеринг ігрового поля
//   const renderGameBoard = () => {
//     const gridSize = boardSize === 3 ? 'grid-cols-3' : 'grid-cols-4';
//     const boardWidth = boardSize === 3 ? 'w-56 lg:w-64' : 'w-72 lg:w-80'; // Менше на мобільній
    
//     console.log('🎯 Board render:', { 
//       boardSize, 
//       boardWidth,
//       gridSize 
//     });
  
//     const shouldShowIcons = gameState.gameState === 'setup' || showIconsAfterSizeChange;
  
//     console.log('🖼️ Стан іконок:', {
//       gameState: gameState.gameState,
//       showIconsAfterSizeChange,
//       shouldShowIcons,
//       boardSize
//     });
    
//     return (
//       <div className={`bg-white/10 rounded-xl p-4 mb-6 relative`}>
//         {/* ✅ ЗМІНЮЄМО: Додаємо relative та data-атрибути для точних розрахунків */}
//         <div 
//           className={`grid ${gridSize} gap-2 ${boardWidth} mx-auto relative`}
//           data-board-size={boardSize}
//         >
//           {gameState.board.map((cell, index) => {
//             // Додайте цю перевірку:
//             const maxIconIndex = boardSize * boardSize - 1;
//             if (shouldShowIcons && index > maxIconIndex) {
//               return null; // Не рендеримо зайві іконки
//             }
            
//             // Перевірка обмежень для 4×4
//             const isRestricted = gameState.restrictedCells.includes(index);
//             const canClick = gameState.canMakeMoveWithRestrictions ? 
//               gameState.canMakeMoveWithRestrictions(index) : 
//               gameState.canMakeMove(index);
  
//             // ✅ ДОДАЄМО: Логіка для електричних ефектів
//             const isWinning = gameState.winningLine.includes(index);
//             const winIndex = gameState.winningLine.indexOf(index);
  
  
//             const getElectricEffects = () => {
//               if (!isWinning) return null;
              
//               return (
//                 <>
//                   {/* Основні електричні спалахи */}
//                   <div className="absolute top-0 left-1/2 w-1 h-1 bg-cyan-300 rounded-full animate-ping" 
//                        style={{ animationDelay: `${winIndex * 50}ms` }}></div>
//                   <div className="absolute bottom-0 right-1/2 w-1 h-1 bg-purple-400 rounded-full animate-ping" 
//                        style={{ animationDelay: `${winIndex * 50 + 200}ms` }}></div>
//                   <div className="absolute left-0 top-1/2 w-1 h-1 bg-pink-400 rounded-full animate-ping" 
//                        style={{ animationDelay: `${winIndex * 50 + 400}ms` }}></div>
//                   <div className="absolute right-0 bottom-1/2 w-1 h-1 bg-indigo-400 rounded-full animate-ping" 
//                        style={{ animationDelay: `${winIndex * 50 + 600}ms` }}></div>
                  
//                   {/* Кутові спалахи з різними кольорами */}
//                   <div className="absolute top-1 right-1 w-0.5 h-0.5 bg-cyan-200 rounded-full animate-pulse" 
//                        style={{ animationDelay: `${winIndex * 100}ms` }}></div>
//                   <div className="absolute bottom-1 left-1 w-0.5 h-0.5 bg-purple-300 rounded-full animate-pulse" 
//                        style={{ animationDelay: `${winIndex * 100 + 300}ms` }}></div>
//                   <div className="absolute top-1 left-1 w-0.5 h-0.5 bg-pink-300 rounded-full animate-pulse" 
//                        style={{ animationDelay: `${winIndex * 100 + 500}ms` }}></div>
//                   <div className="absolute bottom-1 right-1 w-0.5 h-0.5 bg-indigo-300 rounded-full animate-pulse" 
//                        style={{ animationDelay: `${winIndex * 100 + 700}ms` }}></div>
//                 </>
//               );
//             };
            
//             return (
//               <button
//                 key={`${animationKey}-${index}`}
//                 onClick={() => handleCellClick(index)}
//                 disabled={!gameState.gameActive || !canClick}
//                 title={isRestricted ? 'Заборонено правилами 4×4: другий хід не може бути поруч з першим' : undefined}
//                 style={isWinning ? { animationDelay: `${winIndex * 150}ms` } : {}}
//                 className={
//                   isWinning 
//                     ? 'aspect-square rounded-xl flex items-center justify-center text-2xl font-bold relative overflow-hidden animate-pulse bg-gradient-to-br from-purple-600 via-pink-500 to-indigo-800 scale-110 shadow-[0_0_30px_rgba(168,85,247,0.8)] border-2 border-purple-300'
//                     : `aspect-square rounded-xl flex items-center justify-center text-2xl font-bold transition-all duration-500 relative overflow-hidden
//                       ${shouldShowIcons ? 'bg-transparent border-2 border-white/20 hover:border-white/40' : 
//                         (isRestricted ? 'bg-white/20 hover:bg-white/30 cursor-not-allowed' : 'bg-white/20 hover:bg-white/30')}
//                       ${!canClick && !shouldShowIcons ? 'opacity-50' : ''}
//                       ${!gameState.gameActive && !shouldShowIcons ? 'cursor-default' : ''}`
//                 }
//               >
//                 {/* Логіка відображення */}
//                 {shouldShowIcons ? (
//                   // До початку гри або після зміни розміру показуємо декоративні іконки
//                   <>
//                     <img 
//                       src={decorativeIcons[index] || '/game-icons/aijarvis.jpg'} 
//                       alt={`Декоративна іконка ${index + 1}`}
//                       className="absolute inset-0 w-full h-full object-cover rounded-lg
//                                transition-all duration-300 hover:scale-110"
//                       style={{ aspectRatio: '1 / 1' }}
//                       onError={(e) => {
//                         // Fallback до emoji якщо іконка не завантажилась
//                         const target = e.target as HTMLImageElement;
//                         target.style.display = 'none';
//                         const parent = target.parentElement!;
//                         parent.classList.add('bg-gradient-to-br', 'from-purple-500/50', 'to-blue-500/50');
//                         parent.innerHTML += '<span class="absolute inset-0 flex items-center justify-center text-3xl">🎮</span>';
//                       }}
//                     />
//                     {/* Градієнтний overlay для кращого вигляду */}
//                     <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/10 rounded-lg"></div>
//                   </>
//               ) : (
//                 // ✅ ЗМІНЮЄМО: Під час гри показуємо X/O з ефектами
//                 <>
//                   <span className={`
//                     ${isWinning ? 'text-white font-black text-3xl drop-shadow-lg' : 'text-white/90'} 
//                     z-20 relative
//                   `}>
//                     {cell}
//                   </span>
                  
//                   {getElectricEffects()}
//                 </>
//               )}
//               </button>
//             );
//           })}
//         </div>

        
//         {/* Інформація про обмеження */}
//         {boardSize === 4 && gameState.restrictionInfo.hasRestrictions && (
//           <div className="mt-3 p-2 bg-red-500/20 rounded-lg border border-red-400/30">
//             <div className="flex items-center gap-2 text-sm text-red-200">
//               <span>⚠️</span>
//               <span>{gameState.restrictionInfo.reasonDescription}</span>
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   };

  
 
//   // Рендеринг статусу гри та таймера
//   const renderGameStatus = () => {
//     return (
//       <div className="space-y-4 mb-6">
//         {/* Статус гри */}
//         <GameStatus
//           gameState={gameState.gameState}
//           currentPlayer={gameState.currentPlayer}
//           gameResult={gameState.gameResult}
//           gameMode={gameMode}
//           playerSymbol={playerSymbol}
//           isAIThinking={gameState.isAIThinking}
//           aiDifficulty={difficulty}
//           variant="default"
//           boardSize={boardSize}
//           restrictionInfo={gameState.restrictionInfo}
//           firstPlayer={gameState.firstPlayer}
//         />

//         {/* Новий компактний макет таймера + прогресу */}
//         {gameState.gameActive && (
//           <div className="bg-white/5 rounded-lg p-2">
//             {/* Верхня лінія: Прогрес + Міні таймер */}
//             <div className="flex items-center justify-between gap-3 mb-2">
//               <div className="flex-1">
//                 <ProgressBar
//                   value={gameState.gameStats.moves}
//                   maxValue={boardSize * boardSize}
//                   variant="timer"
//                   size="small"
//                   animated={true}
//                   className="h-2"
//                   showValues={false}
//                   showPercentage={false}
//                 />
//               </div>
              
//               <div className="flex items-center gap-2 shrink-0">
//                 {/* Міні круглий таймер */}
//                 <div className="w-6 h-6 relative">
//                   <GameTimer
//                     timeLeft={gameState.timeLeft}
//                     maxTime={gameState.settings.timePerMove}
//                     isRunning={gameState.isTimerRunning}
//                     isPaused={gameState.gameState === 'paused'}
//                     size="small"
//                     showIcon={false}
//                     className="w-6 h-6"
//                   />
//                 </div>
//                 <span className="text-sm font-medium text-white">{gameState.timeLeft}</span>
//               </div>
//             </div>
            
//             {/* Нижня лінія: Інфо */}
//             <div className="flex justify-between text-xs text-white/50">
//             <span>{t.gameStatus.moves} {gameState.gameStats.moves}/{boardSize * boardSize}</span>
//             <span>{t.gameStatus.moveTime}</span>
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   };

//   // Компонент створення гри
//   const CreateGameTab = () => (
//     <div className="space-y-4">
//       {/* Режим AI/PvP */}
//       <div className="flex gap-3 mb-6">
//         <button
//           onClick={() => setGameMode('ai')}
//           className={`flex-1 py-3 px-4 rounded-xl font-semibold text-base transition-all ${
//             gameMode === 'ai'
//               ? 'bg-purple-600 text-white shadow-lg'
//               : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
//           }`}
//         >
//           {t.gameMode.ai}
//         </button>
//         <button
//           onClick={() => setGameMode('pvp')}
//           className={`flex-1 py-3 px-4 rounded-xl font-semibold text-base transition-all ${
//             gameMode === 'pvp'
//               ? 'bg-purple-600 text-white shadow-lg'
//               : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
//           }`}
//         >
//           {t.gameMode.pvp}
//         </button>
//       </div>

//       {/* Назва гри */}
//       <div className="text-center text-xl font-semibold mb-6 flex items-center justify-center gap-2">
//       🎮 {t.gameMode.crossesZeros}
//       </div>

//       {/* Статус гри та таймер */}
//       {gameState.gameState !== 'setup' && renderGameStatus()}

//       {/* Ігрове поле */}
//       {renderGameBoard()}

//       {/* Кнопка розгортання налаштувань (показується тільки коли згорнуто) */}
//       {/* Тонка лінія з кнопкою розгортання (показується тільки коли згорнуто) */}
//       {isSettingsCollapsed && (
//         <div className="relative my-4">
//           <div className="absolute inset-0 flex items-center">
//             <div className="w-full border-t border-white/20"></div>
//           </div>
//           <div className="relative flex justify-center">
//             <button
//               onClick={() => setIsSettingsCollapsed(false)}
//               className="w-8 h-8 bg-purple-600 hover:bg-purple-700 rounded-full flex items-center justify-center
//                         transition-all duration-300 hover:scale-110 shadow-lg"
//             >
//               <span className="text-white text-sm">
//                 ▼
//               </span>
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Блок налаштувань з анімацією згортання/розгортання */}
//       <div className={`transition-all duration-700 ease-out overflow-hidden ${
//         isSettingsCollapsed 
//           ? 'max-h-0 opacity-0 transform -translate-y-2 pointer-events-none' 
//           : 'max-h-[1000px] opacity-100 transform translate-y-0'
//       }`}>

//         {/* Компактні налаштування */}
//         <div className="space-y-4">
//           {/* Розмір поля */}
//           <div className="flex justify-between items-center">
//             <span className="text-base font-medium opacity-90">{t.gameMode.size}</span>
//             <div className="flex gap-2">
//               <button
//                 onClick={() => {
//                   console.log('🔘 Натиснуто кнопку 3×3');
//                   setBoardSize(3);
//                   gameState.setupGame()
//                   // Якщо гра не в стані setup, показуємо іконки
//                   if (gameState.gameState !== 'setup') {
//                     setShowIconsAfterSizeChange(true);
//                   }
//                 }}
//                 className={`px-4 py-2 text-base rounded-lg font-medium transition-all ${
//                   boardSize === 3
//                     ? 'bg-purple-600 text-white shadow-lg'
//                     : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
//                 }`}
//               >
//                 3×3
//               </button>
//               <button
//                 onClick={() => {
//                   console.log('🔘 Натиснуто кнопку 4×4');
//                   setBoardSize(4);
//                   gameState.setupGame()
//                   // Якщо гра не в стані setup, показуємо іконки
//                   if (gameState.gameState !== 'setup') {
//                     setShowIconsAfterSizeChange(true);
//                   }
//                 }}
//                 className={`px-4 py-2 text-base rounded-lg font-medium transition-all ${
//                   boardSize === 4
//                     ? 'bg-purple-600 text-white shadow-lg'
//                     : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
//                 }`}
//               >
//                 4×4
//               </button>
//             </div>
//           </div>

//           {/* Фігура */}
//           <div className="flex justify-between items-center">
//             <span className="text-base font-medium opacity-90">{t.gameMode.figure}</span>
//             <div className="flex gap-2">
//               <button
//                 onClick={() => setPlayerSymbol('X')}
//                 className={`px-4 py-2 text-base rounded-lg font-medium transition-all ${
//                   playerSymbol === 'X'
//                     ? 'bg-purple-600 text-white shadow-lg'
//                     : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
//                 }`}
//               >
//                 X
//               </button>
//               <button
//                 onClick={() => setPlayerSymbol('O')}
//                 className={`px-4 py-2 text-base rounded-lg font-medium transition-all ${
//                   playerSymbol === 'O'
//                     ? 'bg-purple-600 text-white shadow-lg'
//                     : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
//                 }`}
//               >
//                 O
//               </button>
//             </div>
//           </div>

//           {/* AI налаштування */}
//           {gameMode === 'ai' && (
//             <>
//               <div className="flex justify-between items-center">
//                 <span className="text-base font-medium opacity-90">{t.gameMode.firstMove}</span>
//                 <div className="flex gap-2">
//                   <button
//                     onClick={() => setFirstMove('player')}
//                     className={`px-3 py-2 text-sm rounded-lg font-medium transition-all ${
//                       firstMove === 'player'
//                         ? 'bg-purple-600 text-white shadow-lg'
//                         : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
//                     }`}
//                   >
//                     {t.gameMode.you}
//                   </button>
//                   <button
//                     onClick={() => setFirstMove('ai')}
//                     className={`px-3 py-2 text-sm rounded-lg font-medium transition-all ${
//                       firstMove === 'ai'
//                         ? 'bg-purple-600 text-white shadow-lg'
//                         : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
//                     }`}
//                   >
//                     {t.gameMode.ai_move}
//                   </button>
//                   <button
//                     onClick={() => setFirstMove('random')}
//                     className={`px-3 py-2 text-sm rounded-lg font-medium transition-all ${
//                       firstMove === 'random'
//                         ? 'bg-purple-600 text-white shadow-lg'
//                         : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
//                     }`}
//                   >
//                     {t.gameMode.random}
//                   </button>
//                 </div>
//               </div>

//               <div className="flex justify-between items-center">
//                 <span className="text-base font-medium opacity-90">{t.gameMode.difficulty}</span>
//                 <div className="flex gap-2">
//                   <button
//                     onClick={() => setDifficulty('easy')}
//                     className={`px-3 py-2 text-sm rounded-lg font-medium transition-all ${
//                       difficulty === 'easy'
//                         ? 'bg-green-600 text-white shadow-lg'
//                         : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
//                     }`}
//                   >
//                     {t.gameMode.easy}
//                   </button>
//                   <button
//                     onClick={() => setDifficulty('medium')}
//                     className={`px-3 py-2 text-sm rounded-lg font-medium transition-all ${
//                       difficulty === 'medium'
//                         ? 'bg-yellow-600 text-white shadow-lg'
//                         : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
//                     }`}
//                   >
//                      {t.gameMode.medium}
//                   </button>
//                   <button
//                     onClick={() => setDifficulty('hard')}
//                     className={`px-3 py-2 text-sm rounded-lg font-medium transition-all ${
//                       difficulty === 'hard'
//                         ? 'bg-red-600 text-white shadow-lg'
//                         : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
//                     }`}
//                   >
//                      {t.gameMode.hard}
//                   </button>
//                 </div>
//               </div>
//             </>
//           )}

//           {/* PvP налаштування */}
//           {gameMode === 'pvp' && (
//             <>
//               <div className="flex justify-between items-center">
//                 <span className="text-base font-medium opacity-90">{t.gameMode.firstMove}</span>
//                 <div className="flex gap-2">
//                   <button
//                     onClick={() => setFirstMove('player')}
//                     className={`px-3 py-2 text-sm rounded-lg font-medium transition-all ${
//                       firstMove === 'player'
//                         ? 'bg-purple-600 text-white shadow-lg'
//                         : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
//                     }`}
//                   >
//                     {t.gameMode.meFirst}
//                   </button>
//                   <button
//                     onClick={() => setFirstMove('random')}
//                     className={`px-3 py-2 text-sm rounded-lg font-medium transition-all ${
//                       firstMove === 'random'
//                         ? 'bg-purple-600 text-white shadow-lg'
//                         : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
//                     }`}
//                   >
//                     {t.gameMode.random}
//                   </button>
//                 </div>
//               </div>

//               {/* Ставка */}
//               <div className="flex justify-between items-center">
//                 <span className="text-base font-medium opacity-90">{t.gameMode.stake}</span>
//                 <div className="flex gap-4 items-center">
//                   <label className="flex items-center gap-2 cursor-pointer text-sm">
//                     <input
//                       type="radio"
//                       name="stake"
//                       checked={!hasStake}
//                       onChange={() => setHasStake(false)}
//                       className="w-4 h-4"
//                     />
//                     <span>{t.gameMode.withoutStake}</span>
//                   </label>
//                   <label className="flex items-center gap-2 cursor-pointer text-sm">
//                     <input
//                       type="radio"
//                       name="stake"
//                       checked={hasStake}
//                       onChange={() => setHasStake(true)}
//                       className="w-4 h-4"
//                     />
//                     <span>{t.gameMode.withStake}</span>
//                   </label>
//                 </div>
//               </div>

//               {hasStake && (
//                 <div className="flex justify-between items-center">
//                   <span className="text-base font-medium opacity-90">Сума:</span>
//                   <input
//                     type="number"
//                     value={stakeAmount}
//                     onChange={(e) => setStakeAmount(e.target.value)}
//                     placeholder="0.01"
//                     step="0.01"
//                     min="0.01"
//                     className="w-24 px-3 py-2 text-sm bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50"
//                   />
//                 </div>
//               )}
//             </>
//           )}
//         </div>
//       </div>

//       {/* Кнопки управління */}
//       <div className="space-y-3">
//         {/* Кнопка старту/рестарту */}
//         <button
//           onClick={handleStartNewGame}
//           className="w-full bg-purple-600 hover:bg-purple-700 py-4 px-6 rounded-xl font-bold text-lg text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
//         >
//           {gameState.gameState === 'setup' ? t.gameMode.startGame : t.gameMode.newGame}
//         </button>

//         {/* Додаткові кнопки під час гри */}
//         {gameState.gameActive && (
//           <div className="flex gap-3">
//             <button
//               onClick={() => gameState.pauseGame()}
//               className="flex-1 bg-yellow-600 hover:bg-yellow-700 py-2 px-4 rounded-lg font-medium text-white transition-all"
//             >
//               {t.gameMode.pause}
//             </button>
//             <button
//               onClick={() => gameState.resetGame()}
//               className="flex-1 bg-red-600 hover:bg-red-700 py-2 px-4 rounded-lg font-medium text-white transition-all"
//             >
//               {t.gameMode.reset}
//             </button>
//           </div>
//         )}

//         {/* Кнопка продовження */}
//         {gameState.gameState === 'paused' && (
//           <button
//             onClick={() => gameState.resumeGame()}
//             className="w-full bg-green-600 hover:bg-green-700 py-3 px-6 rounded-xl font-bold text-white transition-all"
//           >
//             {t.gameMode.continue}
//           </button>
//         )}
//       </div>

//       {/* Статистика сесії */}
//       {gameState.sessionStats.gamesPlayed > 0 && (
//         <div className="mt-6 p-4 bg-white/5 rounded-xl">
//           <h4 className="text-sm font-semibold text-white/90 mb-2">{t.gameMode.sessionStats}</h4>
//           <div className="grid grid-cols-2 gap-3 text-xs">
//           <div className="flex justify-between">
//             <span className="text-white/70">{t.gameMode.wins}</span>
//             <span className="text-green-400">{gameState.sessionStats.wins}</span>
//           </div>
//           <div className="flex justify-between">
//             <span className="text-white/70">{t.gameMode.losses}</span>
//             <span className="text-red-400">{gameState.sessionStats.losses}</span>
//           </div>
//           <div className="flex justify-between">
//             <span className="text-white/70">{t.gameMode.winRate}</span>
//             <span className="text-blue-400">{gameState.sessionStats.winRate.toFixed(1)}%</span>
//           </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );

//   // Заглушка для інших табів
//   const CreateTournamentTab = () => (
//     <div className="text-center py-8">
//       <h3 className="text-xl font-semibold text-white mb-4">🏆 Турніри</h3>
//       <p className="text-white/70">Функціональність турнірів буде додана пізніше</p>
//     </div>
//   );

//   const AvailableGamesTab = () => (
//     <div className="text-center py-8">
//       <h3 className="text-xl font-semibold text-white mb-4">📋 Доступні ігри</h3>
//       <p className="text-white/70">Пошук ігор буде додано пізніше</p>
//     </div>
//   );

//   return (
//     <div className={`
//       bg-gradient-to-br from-gray-800/50 via-purple-800/50 to-gray-800/50 
//       backdrop-blur-md rounded-2xl lg:rounded-3xl p-3 lg:p-4 lg:p-6 shadow-2xl 
//       border border-purple-500/20
//       ${className}
//     `}>
//       {/* Таби */}
//       <div className="flex gap-1 mb-6 bg-white/10 rounded-xl p-1">
//         <button
//           onClick={() => setActiveTab('create-game')}
//           className={`
//             flex-1 flex flex-col items-center gap-1 py-2 px-2 rounded-lg transition-all duration-300 text-xs
//             ${activeTab === 'create-game'
//               ? 'bg-purple-600 text-white'
//               : 'text-white/70 hover:text-white hover:bg-white/10'
//             }
//           `}
//         >
//           <span className="text-sm">🎮</span>
//           <span className="font-medium leading-tight text-center">{t.gameMode.createGame}</span>
//         </button>
//         <button
//           onClick={() => setActiveTab('create-tournament')}
//           className={`
//             flex-1 flex flex-col items-center gap-1 py-2 px-2 rounded-lg transition-all duration-300 text-xs
//             ${activeTab === 'create-tournament'
//               ? 'bg-purple-600 text-white'
//               : 'text-white/70 hover:text-white hover:bg-white/10'
//             }
//           `}
//         >
//           <span className="text-sm">🏆</span>
//           <span className="font-medium leading-tight text-center">{t.gameMode.createTournament}</span>
//         </button>
//         <button
//           onClick={() => setActiveTab('available-games')}
//           className={`
//             flex-1 flex flex-col items-center gap-1 py-2 px-2 rounded-lg transition-all duration-300 text-xs
//             ${activeTab === 'available-games'
//               ? 'bg-purple-600 text-white'
//               : 'text-white/70 hover:text-white hover:bg-white/10'
//             }
//           `}
//         >
//           <span className="text-sm">📋</span>
//           <span className="font-medium leading-tight text-center">{t.gameMode.availableGames}</span>
//         </button>
//       </div>

//       {/* Контент залежно від активного табу */}
//       <div className="min-h-[400px]">
//         {activeTab === 'create-game' && <CreateGameTab />}
//         {activeTab === 'create-tournament' && <CreateTournamentTab />}
//         {activeTab === 'available-games' && <AvailableGamesTab />}
//       </div>
//     </div>
//   );
// }
// export default React.memo(GameSection);










































// components/game/sections/GameSection.tsx
// Головний компонент ігрової секції з інтеграцією всіх нових хуків
// ✅ Використовує useGameState для управління станом
// ✅ Інтегрує GameStatus, GameTimer, ProgressBar
// ✅ Зберігає існуючий інтерфейс
// ✅ Підтримує AI та PvP режими
// ✅ Додано колапсні налаштування

'use client';

import React, { useCallback, useEffect } from 'react';
import { useTranslation } from '../../../../lib/i18n';
import { useGameState } from '../../../../hooks/useGameState';
import GameStatus from '../ui/GameStatus';
import GameTimer from '../ui/GameTimer';
import ProgressBar from '../ui/ProgressBar';
import { useMonadAuth } from '../../../../hooks/useMonadAuth';
import { submitScore } from '../../../../utils/scoreSubmission';
import GameCell from '../GameCell'; 

import type { 
  GameMode, 
  Player, 
  BoardSize, 
  Difficulty,
  GameResult,
  FirstMove
} from '../../../../types/game';

// Типи для табів
type GameTab = 'create-game' | 'create-tournament' | 'available-games';

interface GameSectionProps {
  className?: string;
}

const DECORATIVE_ICONS = [
  'aijarvis.jpg',
  'bean.jpg', 
  'berzan.jpg',
  'cultverse.jpg',
  'enjoyoors.jpg',
  'fantasy.jpg',
  'keone.jpg',
  'kintsu.png',
  'kizzy.jpg',
  'laMouch.jpg',
  'lootgo.jpg',
  'magicEden.jpg',
  'medusa.jpg',
  'mikeinweb.png',
  'monadverse.jpg',
  'monorail.png',
  'moyaking.jpg',
  'nadsa.jpg',
  'narwhal.jpg',
  'pump.jpg',
  'purps.png',
  'rugRumble.png',
  'talentum.jpg',
  'thedaks.jpg',
  'thevapelabs.jpg'
].map(filename => `/game-icons/${filename}`);

// Функція для отримання випадкових іконок
const getRandomIcons = (count: number): string[] => {
  const shuffled = [...DECORATIVE_ICONS].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

function GameSection({ className = '' }: GameSectionProps) {
  const { t } = useTranslation();
  const { isConnected } = useMonadAuth();
  const { user: monadUser } = useMonadAuth(); 
  // Стан інтерфейсу (зберігаємо існуючу логіку)
  const [activeTab, setActiveTab] = React.useState<GameTab>('create-game');
  const [gameMode, setGameMode] = React.useState<GameMode>('ai');
  
  // Налаштування гри (зберігаємо існуючі)
  const [boardSize, setBoardSize] = React.useState<BoardSize>(3);
  const [playerSymbol, setPlayerSymbol] = React.useState<Player>('X');
  const [firstMove, setFirstMove] = React.useState<FirstMove>('random');
  const [difficulty, setDifficulty] = React.useState<Difficulty>('medium');
  const [hasStake, setHasStake] = React.useState(false);
  const [stakeAmount, setStakeAmount] = React.useState('');
  const [decorativeIcons, setDecorativeIcons] = React.useState<string[]>([]);
  
  // Стан для згортання/розгортання налаштувань
  const [isSettingsCollapsed, setIsSettingsCollapsed] = React.useState(false);
  
  // Відстежування зміни розміру поля
  const [lastBoardSize, setLastBoardSize] = React.useState<BoardSize>(boardSize);
  const [showIconsAfterSizeChange, setShowIconsAfterSizeChange] = React.useState(false);
  const [animationKey, setAnimationKey] = React.useState(0);


  // const handleGameEnd = useCallback(async (result: GameResult) => {
    
  //   // Відправка очок на контракт
  //   if (monadUser?.address && result !== 'draw') {
        
  //     const scoreToAdd = result === 'win' ? 10 : 0;
  //     const transactionsToAdd = 1;
  //       // ЗМІНИТИ: Сервер сам визначає очки
  //       await submitScore({
  //         playerAddress: monadUser.address,
  //         scoreToAdd,  // Тільки для логування
  //         transactionsToAdd
  //       });            
  //   }
  // }, [monadUser]);

  const handleGameEnd = useCallback(async (result: GameResult) => {
    console.log('📤 GameSection handleGameEnd:', { result, shouldSubmit: result === 'win' });
    
    // Відправка очок на контракт ТІЛЬКИ при перемозі гравця
    if (monadUser?.address && result === 'win') {
      console.log('🎯 Відправляємо транзакцію - гравець виграв');
      
      const scoreToAdd = 10;
      const transactionsToAdd = 1;
      
      await submitScore({
        playerAddress: monadUser.address,
        scoreToAdd,
        transactionsToAdd
      });            
    } else {
      console.log('❌ Транзакція не відправляється:', { 
        result, 
        reason: result === 'lose' ? 'гравець програв' : result === 'draw' ? 'нічия' : 'невідомий результат'
      });
    }
  }, [monadUser]);

  // Ініціалізуємо новий хук управління грою
  const gameState = useGameState({
    initialSettings: {
      boardSize,
      gameMode,
      playerSymbol,
      aiDifficulty: difficulty,
      timerEnabled: true,
      timePerMove: 22,
      aiThinkingTime: 1000
    },
    onGameEnd: handleGameEnd,
    onStatisticsUpdate: () => {},
  });



  // Автоматичне згортання налаштувань при старті гри
  useEffect(() => {
    if (gameState.gameState === 'playing' && !isSettingsCollapsed) {
      setIsSettingsCollapsed(true);
    }
  }, [gameState.gameState, isSettingsCollapsed]);

  useEffect(() => {
    if (gameState.winningLine.length > 0) {
      // Перезапускаємо анімацію при новій виграшній комбінації
      setAnimationKey(prev => prev + 1);
    }
  }, [gameState.winningLine]);

  // Reset згортання при зміні табу
  useEffect(() => {
    setIsSettingsCollapsed(false);
  }, [activeTab]);

  // Іконки та розмір поля
  useEffect(() => {
    const iconCount = boardSize * boardSize;
    setDecorativeIcons(getRandomIcons(iconCount));
    
    // Перевіряємо чи змінився розмір поля
    if (lastBoardSize !== boardSize) {
      setShowIconsAfterSizeChange(true);
      setLastBoardSize(boardSize);
    }
  }, [boardSize, lastBoardSize]);

  // Обробка кліку по клітинці
  const handleCellClick = useCallback(async (index: number) => {
 

    if (!gameState.canMakeMove(index)) return;
    
    await gameState.makeMove(index);
  }, [gameState]);

  const determineFirstPlayer = useCallback((): Player => {
    if (gameMode === 'ai') {
      switch (firstMove) {
        case 'player': return playerSymbol;
        case 'ai': return playerSymbol === 'X' ? 'O' : 'X';
        case 'random': return Math.random() < 0.5 ? playerSymbol : (playerSymbol === 'X' ? 'O' : 'X');
      }
    }
    return playerSymbol;
  }, [firstMove, playerSymbol, gameMode]);

  // Початок нової гри
  const handleStartNewGame = useCallback(() => {
    if (!isConnected) {
      // Показати повідомлення про необхідність логіну
      alert('To play, you need to log in with your Monad Games ID. Go to your wallet on the right.');
      return;
    }
    
    setShowIconsAfterSizeChange(false);

    const firstPlayer = determineFirstPlayer();
    // Оновлюємо налаштування перед початком
    gameState.updateSettings({
      boardSize,
      gameMode,
      playerSymbol,
      aiDifficulty: difficulty,
      timerEnabled: true,
      timePerMove: 22,
      aiThinkingTime: 1000
    });
    
    gameState.startNewGame(firstPlayer);

  }, [gameState, boardSize, gameMode, playerSymbol, difficulty, determineFirstPlayer, isConnected]);

  // Синхронізація налаштувань
  useEffect(() => {
    gameState.updateSettings({
      boardSize,
      gameMode,
      playerSymbol,
      aiDifficulty: difficulty
    });
  }, [boardSize, gameMode, playerSymbol, difficulty]);


  // Рендеринг ігрового поля
  const renderGameBoard = () => {
    const gridSize = boardSize === 3 ? 'grid-cols-3' : 'grid-cols-4';
    const boardWidth = boardSize === 3 ? 'w-56 lg:w-64' : 'w-72 lg:w-80'; // Менше на мобільній
  
    const shouldShowIcons = gameState.gameState === 'setup' || showIconsAfterSizeChange;
    
    return (
      <div className={`bg-white/10 rounded-xl p-4 mb-6 relative`}>
        {/* ✅ ЗМІНЮЄМО: Додаємо relative та data-атрибути для точних розрахунків */}
        <div 
          className={`grid ${gridSize} gap-2 ${boardWidth} mx-auto relative`}
          data-board-size={boardSize}
        >
          {gameState.board.map((cell, index) => {
            // Додайте цю перевірку:
            const maxIconIndex = boardSize * boardSize - 1;
            if (shouldShowIcons && index > maxIconIndex) {
              return null; // Не рендеримо зайві іконки
            }
            
            // Перевірка обмежень для 4×4
            const isRestricted = gameState.restrictedCells.includes(index);
            const canClick = gameState.canMakeMoveWithRestrictions ? 
              gameState.canMakeMoveWithRestrictions(index) : 
              gameState.canMakeMove(index);
  
            // ✅ ДОДАЄМО: Логіка для електричних ефектів
            const isWinning = gameState.winningLine.includes(index);
            const winIndex = gameState.winningLine.indexOf(index);

            return (
              <GameCell
                key={`${animationKey}-${index}`}
                cell={cell}
                index={index}
                isWinning={isWinning}
                canClick={canClick}
                onClick={() => handleCellClick(index)}
                shouldShowIcons={shouldShowIcons}
                decorativeIcon={decorativeIcons[index]}
                isRestricted={isRestricted}
                winIndex={winIndex}
              />
            );
          })}
        </div>

        
        {/* Інформація про обмеження */}
        {boardSize === 4 && gameState.restrictionInfo.hasRestrictions && (
          <div className="mt-3 p-2 bg-red-500/20 rounded-lg border border-red-400/30">
            <div className="flex items-center gap-2 text-sm text-red-200">
              <span>⚠️</span>
              <span>{gameState.restrictionInfo.reasonDescription}</span>
            </div>
          </div>
        )}
      </div>
    );
  };

  
 
  // Рендеринг статусу гри та таймера
  const renderGameStatus = () => {
    return (
      <div className="space-y-4 mb-6">
        {/* Статус гри */}
        <GameStatus
          gameState={gameState.gameState}
          currentPlayer={gameState.currentPlayer}
          gameResult={gameState.gameResult}
          gameMode={gameMode}
          playerSymbol={playerSymbol}
          isAIThinking={gameState.isAIThinking}
          aiDifficulty={difficulty}
          variant="default"
          boardSize={boardSize}
          restrictionInfo={gameState.restrictionInfo}
          firstPlayer={gameState.firstPlayer}
        />

        {/* Новий компактний макет таймера + прогресу */}
        {gameState.gameActive && (
          <div className="bg-white/5 rounded-lg p-2">
            {/* Верхня лінія: Прогрес + Міні таймер */}
            <div className="flex items-center justify-between gap-3 mb-2">
              <div className="flex-1">
                <ProgressBar
                  value={gameState.gameStats.moves}
                  maxValue={boardSize * boardSize}
                  variant="timer"
                  size="small"
                  animated={true}
                  className="h-2"
                  showValues={false}
                  showPercentage={false}
                />
              </div>
              
              <div className="flex items-center gap-2 shrink-0">
                {/* Міні круглий таймер */}
                <div className="w-6 h-6 relative">
                  <GameTimer
                    timeLeft={gameState.timeLeft}
                    maxTime={gameState.settings.timePerMove}
                    isRunning={gameState.isTimerRunning}
                    isPaused={gameState.gameState === 'paused'}
                    size="small"
                    showIcon={false}
                    className="w-6 h-6"
                  />
                </div>
                <span className="text-sm font-medium text-white">{gameState.timeLeft}</span>
              </div>
            </div>
            
            {/* Нижня лінія: Інфо */}
            <div className="flex justify-between text-xs text-white/50">
            <span>{t.gameStatus.moves} {gameState.gameStats.moves}/{boardSize * boardSize}</span>
            <span>{t.gameStatus.moveTime}</span>
            </div>
          </div>
        )}
      </div>
    );
  };

  const { user } = useMonadAuth();

  // Компонент створення гри
  const CreateGameTab = () => (
    <div className="space-y-4">
      {/* Режим AI/PvP */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setGameMode('ai')}
          className={`flex-1 py-3 px-4 rounded-xl font-semibold text-base transition-all ${
            gameMode === 'ai'
              ? 'bg-purple-600 text-white shadow-lg'
              : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
          }`}
        >
          {t.gameMode.ai}
        </button>
        <button
          onClick={() => setGameMode('pvp')}
          className={`flex-1 py-3 px-4 rounded-xl font-semibold text-base transition-all ${
            gameMode === 'pvp'
              ? 'bg-purple-600 text-white shadow-lg'
              : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
          }`}
        >
          {t.gameMode.pvp}
        </button>
      </div>

      {/* Назва гри */}
      <div className="text-center text-xl font-semibold mb-6 flex items-center justify-center gap-2">
      🎮 {t.gameMode.crossesZeros}
      </div>

      {/* Статус гри та таймер */}
      {gameState.gameState !== 'setup' && renderGameStatus()}

      {/* Ігрове поле */}
      {renderGameBoard()}

      {/* Кнопка розгортання налаштувань (показується тільки коли згорнуто) */}
      {/* Тонка лінія з кнопкою розгортання (показується тільки коли згорнуто) */}
      {isSettingsCollapsed && (
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/20"></div>
          </div>
          <div className="relative flex justify-center">
            <button
              onClick={() => setIsSettingsCollapsed(false)}
              className="w-8 h-8 bg-purple-600 hover:bg-purple-700 rounded-full flex items-center justify-center
                        transition-all duration-300 hover:scale-110 shadow-lg"
            >
              <span className="text-white text-sm">
                ▼
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Блок налаштувань з анімацією згортання/розгортання */}
      <div className={`transition-all duration-700 ease-out overflow-hidden ${
        isSettingsCollapsed 
          ? 'max-h-0 opacity-0 transform -translate-y-2 pointer-events-none' 
          : 'max-h-[1000px] opacity-100 transform translate-y-0'
      }`}>

        {/* Компактні налаштування */}
        <div className="space-y-4">
          {/* Розмір поля */}
          <div className="flex justify-between items-center">
            <span className="text-base font-medium opacity-90">{t.gameMode.size}</span>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setBoardSize(3);
                  gameState.setupGame()
                  // Якщо гра не в стані setup, показуємо іконки
                  if (gameState.gameState !== 'setup') {
                    setShowIconsAfterSizeChange(true);
                  }
                }}
                className={`px-4 py-2 text-base rounded-lg font-medium transition-all ${
                  boardSize === 3
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
                }`}
              >
                3×3
              </button>
              <button
                onClick={() => {
                  setBoardSize(4);
                  gameState.setupGame()
                  // Якщо гра не в стані setup, показуємо іконки
                  if (gameState.gameState !== 'setup') {
                    setShowIconsAfterSizeChange(true);
                  }
                }}
                className={`px-4 py-2 text-base rounded-lg font-medium transition-all ${
                  boardSize === 4
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
                }`}
              >
                4×4
              </button>
            </div>
          </div>

          {/* Фігура */}
          <div className="flex justify-between items-center">
            <span className="text-base font-medium opacity-90">{t.gameMode.figure}</span>
            <div className="flex gap-2">
              <button
                onClick={() => setPlayerSymbol('X')}
                className={`px-4 py-2 text-base rounded-lg font-medium transition-all ${
                  playerSymbol === 'X'
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
                }`}
              >
                X
              </button>
              <button
                onClick={() => setPlayerSymbol('O')}
                className={`px-4 py-2 text-base rounded-lg font-medium transition-all ${
                  playerSymbol === 'O'
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
                }`}
              >
                O
              </button>
            </div>
          </div>

          {/* AI налаштування */}
          {gameMode === 'ai' && (
            <>
              <div className="flex justify-between items-center">
                <span className="text-base font-medium opacity-90">{t.gameMode.firstMove}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setFirstMove('player')}
                    className={`px-3 py-2 text-sm rounded-lg font-medium transition-all ${
                      firstMove === 'player'
                        ? 'bg-purple-600 text-white shadow-lg'
                        : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
                    }`}
                  >
                    {t.gameMode.you}
                  </button>
                  <button
                    onClick={() => setFirstMove('ai')}
                    className={`px-3 py-2 text-sm rounded-lg font-medium transition-all ${
                      firstMove === 'ai'
                        ? 'bg-purple-600 text-white shadow-lg'
                        : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
                    }`}
                  >
                    {t.gameMode.ai_move}
                  </button>
                  <button
                    onClick={() => setFirstMove('random')}
                    className={`px-3 py-2 text-sm rounded-lg font-medium transition-all ${
                      firstMove === 'random'
                        ? 'bg-purple-600 text-white shadow-lg'
                        : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
                    }`}
                  >
                    {t.gameMode.random}
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-base font-medium opacity-90">{t.gameMode.difficulty}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setDifficulty('easy')}
                    className={`px-3 py-2 text-sm rounded-lg font-medium transition-all ${
                      difficulty === 'easy'
                        ? 'bg-green-600 text-white shadow-lg'
                        : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
                    }`}
                  >
                    {t.gameMode.easy}
                  </button>
                  <button
                    onClick={() => setDifficulty('medium')}
                    className={`px-3 py-2 text-sm rounded-lg font-medium transition-all ${
                      difficulty === 'medium'
                        ? 'bg-yellow-600 text-white shadow-lg'
                        : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
                    }`}
                  >
                     {t.gameMode.medium}
                  </button>
                  <button
                    onClick={() => setDifficulty('hard')}
                    className={`px-3 py-2 text-sm rounded-lg font-medium transition-all ${
                      difficulty === 'hard'
                        ? 'bg-red-600 text-white shadow-lg'
                        : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
                    }`}
                  >
                     {t.gameMode.hard}
                  </button>
                </div>
              </div>
            </>
          )}

          {/* PvP налаштування */}
          {gameMode === 'pvp' && (
            <>
              <div className="flex justify-between items-center">
                <span className="text-base font-medium opacity-90">{t.gameMode.firstMove}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setFirstMove('player')}
                    className={`px-3 py-2 text-sm rounded-lg font-medium transition-all ${
                      firstMove === 'player'
                        ? 'bg-purple-600 text-white shadow-lg'
                        : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
                    }`}
                  >
                    {t.gameMode.meFirst}
                  </button>
                  <button
                    onClick={() => setFirstMove('random')}
                    className={`px-3 py-2 text-sm rounded-lg font-medium transition-all ${
                      firstMove === 'random'
                        ? 'bg-purple-600 text-white shadow-lg'
                        : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
                    }`}
                  >
                    {t.gameMode.random}
                  </button>
                </div>
              </div>

              {/* Ставка */}
              <div className="flex justify-between items-center">
                <span className="text-base font-medium opacity-90">{t.gameMode.stake}</span>
                <div className="flex gap-4 items-center">
                  <label className="flex items-center gap-2 cursor-pointer text-sm">
                    <input
                      type="radio"
                      name="stake"
                      checked={!hasStake}
                      onChange={() => setHasStake(false)}
                      className="w-4 h-4"
                    />
                    <span>{t.gameMode.withoutStake}</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-sm">
                    <input
                      type="radio"
                      name="stake"
                      checked={hasStake}
                      onChange={() => setHasStake(true)}
                      className="w-4 h-4"
                    />
                    <span>{t.gameMode.withStake}</span>
                  </label>
                </div>
              </div>

              {hasStake && (
                <div className="flex justify-between items-center">
                  <span className="text-base font-medium opacity-90">Сума:</span>
                  <input
                    type="number"
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(e.target.value)}
                    placeholder="0.01"
                    step="0.01"
                    min="0.01"
                    className="w-24 px-3 py-2 text-sm bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50"
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Кнопки управління */}
      <div className="space-y-3">
        {/* Кнопка старту/рестарту */}
        <button
          onClick={handleStartNewGame}
          disabled={!isConnected || gameMode === 'pvp' || (!user?.hasUsername || !user?.username)}
          className={`w-full py-4 px-6 rounded-xl font-bold text-lg text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg ${
            !isConnected || gameMode === 'pvp'
              ? 'bg-gray-500 cursor-not-allowed opacity-50' 
              : 'bg-purple-600 hover:bg-purple-700'
          }`}
        >
          {!isConnected 
            ? '🔒 Sign in to play' 
            : (!user?.hasUsername || !user?.username)
              ? '🔒 Username required to play'
              : gameMode === 'pvp'
                ? 'SOON'
                : (gameState.gameState === 'setup' ? t.gameMode.startGame : t.gameMode.newGame)
          }
        </button>

        {/* Додаткові кнопки під час гри */}
        {gameState.gameActive && (
          <div className="flex gap-3">
            <button
              onClick={() => gameState.pauseGame()}
              className="flex-1 bg-yellow-600 hover:bg-yellow-700 py-2 px-4 rounded-lg font-medium text-white transition-all"
            >
              {t.gameMode.pause}
            </button>
            <button
              onClick={() => gameState.resetGame()}
              className="flex-1 bg-red-600 hover:bg-red-700 py-2 px-4 rounded-lg font-medium text-white transition-all"
            >
              {t.gameMode.reset}
            </button>
          </div>
        )}

        {/* Кнопка продовження */}
        {gameState.gameState === 'paused' && (
          <button
            onClick={() => gameState.resumeGame()}
            className="w-full bg-green-600 hover:bg-green-700 py-3 px-6 rounded-xl font-bold text-white transition-all"
          >
            {t.gameMode.continue}
          </button>
        )}
      </div>

      {/* Статистика сесії */}
      {gameState.sessionStats.gamesPlayed > 0 && (
        <div className="mt-6 p-4 bg-white/5 rounded-xl">
          <h4 className="text-sm font-semibold text-white/90 mb-2">{t.gameMode.sessionStats}</h4>
          <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="flex justify-between">
            <span className="text-white/70">{t.gameMode.wins}</span>
            <span className="text-green-400">{gameState.sessionStats.wins}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/70">{t.gameMode.losses}</span>
            <span className="text-red-400">{gameState.sessionStats.losses}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/70">{t.gameMode.winRate}</span>
            <span className="text-blue-400">{gameState.sessionStats.winRate.toFixed(1)}%</span>
          </div>
          </div>
        </div>
      )}
    </div>
  );

  // Заглушка для інших табів
  const CreateTournamentTab = () => (
    <div className="text-center py-8">
      <h3 className="text-xl font-semibold text-white mb-4">🏆 {t.tournaments.title}</h3>
      <p className="text-white/70">{t.tournaments.messageTurnaments}</p>
    </div>
  );

  const AvailableGamesTab = () => (
    <div className="text-center py-8">
      <h3 className="text-xl font-semibold text-white mb-4">📋 {t.gameMode.availableGames}</h3>
      <p className="text-white/70">{t.gameMode.availableGamesMessage}</p>
    </div>
  );

  return (
    <div className={`
      bg-gradient-to-br from-gray-800/50 via-purple-800/50 to-gray-800/50 
      backdrop-blur-md rounded-2xl lg:rounded-3xl p-3 lg:p-4 lg:p-6 shadow-2xl 
      border border-purple-500/20
      ${className}
    `}>
      {/* Таби */}
      <div className="flex gap-1 mb-6 bg-white/10 rounded-xl p-1">
        <button
          onClick={() => setActiveTab('create-game')}
          className={`
            flex-1 flex flex-col items-center gap-1 py-2 px-2 rounded-lg transition-all duration-300 text-xs
            ${activeTab === 'create-game'
              ? 'bg-purple-600 text-white'
              : 'text-white/70 hover:text-white hover:bg-white/10'
            }
          `}
        >
          <span className="text-sm">🎮</span>
          <span className="font-medium leading-tight text-center">{t.gameMode.createGame}</span>
        </button>
        <button
          onClick={() => setActiveTab('create-tournament')}
          className={`
            flex-1 flex flex-col items-center gap-1 py-2 px-2 rounded-lg transition-all duration-300 text-xs
            ${activeTab === 'create-tournament'
              ? 'bg-purple-600 text-white'
              : 'text-white/70 hover:text-white hover:bg-white/10'
            }
          `}
        >
          <span className="text-sm">🏆</span>
          <span className="font-medium leading-tight text-center">{t.gameMode.createTournament}</span>
        </button>
        <button
          onClick={() => setActiveTab('available-games')}
          className={`
            flex-1 flex flex-col items-center gap-1 py-2 px-2 rounded-lg transition-all duration-300 text-xs
            ${activeTab === 'available-games'
              ? 'bg-purple-600 text-white'
              : 'text-white/70 hover:text-white hover:bg-white/10'
            }
          `}
        >
          <span className="text-sm">📋</span>
          <span className="font-medium leading-tight text-center">{t.gameMode.availableGames}</span>
        </button>
      </div>

      {/* Контент залежно від активного табу */}
      <div className="min-h-[400px]">
        {activeTab === 'create-game' && <CreateGameTab />}
        {activeTab === 'create-tournament' && <CreateTournamentTab />}
        {activeTab === 'available-games' && <AvailableGamesTab />}
      </div>
    </div>
  );
}
export default React.memo(GameSection);