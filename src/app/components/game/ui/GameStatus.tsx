// // components/game/ui/GameStatus.tsx
// // Компонент відображення статусу гри
// // ✅ Поточний гравець та стан гри
// // ✅ Результат гри з анімаціями
// // ✅ AI статус (думає/готовий)
// // ✅ Адаптивні стилі та емодзі

// 'use client';

// import React from 'react';
// import { 
//   User, 
//   Bot, 
//   Trophy, 
//   Clock,
//   Play,
//   Pause,
//   Brain
// } from 'lucide-react';

// import type { 
//   Player, 
//   GameState,
//   GameResult,
//   GameMode,
//   // ДОДАТИ ЦІ РЯДКИ:
//   BoardSize,
//   RestrictionInfo
// } from '../../../../types/game';

// import { GAME_EMOJIS, GAME_LABELS } from '../../../../constants/game';

// interface GameStatusProps {
//   // Основні дані гри
//   gameState: GameState;
//   currentPlayer: Player;
//   gameResult: GameResult;
//   gameMode: GameMode;
  
//   // Символи гравців
//   playerSymbol: Player;
//   opponentSymbol?: Player;

//    // НОВІ ПОЛЯ ДЛЯ 4×4:
//    boardSize?: BoardSize;
//    restrictionInfo?: RestrictionInfo;
//    firstPlayer?: Player;
  
//   // AI стан
//   isAIThinking?: boolean;
//   aiDifficulty?: string;
  
//   // PvP дані
//   playerName?: string;
//   opponentName?: string;
  
//   // Турнірні дані
//   tournamentName?: string;
//   currentRound?: number;
//   totalRounds?: number;
  
//   // Налаштування відображення
//   showDetails?: boolean;
//   showEmojis?: boolean;
//   variant?: 'default' | 'compact' | 'detailed';
  
//   // Стилізація
//   className?: string;
// }

// // Отримання іконки гравця
// function getPlayerIcon(player: Player, isAI?: boolean) {
//   if (isAI) {
//     return <Bot className="w-4 h-4" />;
//   }
//   return <User className="w-4 h-4" />;
// }

// // Отримання статусу гри як текст
// function getGameStatusText(
//   gameState: GameState,
//   currentPlayer: Player,
//   isAIThinking: boolean,
//   playerSymbol: Player,
//   gameMode: GameMode,
//   // НОВІ ПАРАМЕТРИ:
//   boardSize?: BoardSize,
//   restrictionInfo?: RestrictionInfo,
//   firstPlayer?: Player
// ): { text: string; subtext?: string; emoji?: string } {
  
//   switch (gameState) {
//     case 'setup':
//       return {
//         text: 'Налаштування гри',
//         emoji: GAME_EMOJIS.SETTINGS
//       };
      
//     case 'waiting':
//       return {
//         text: 'Очікування опонента',
//         subtext: 'Шукаємо гравця для вас...',
//         emoji: GAME_EMOJIS.SEARCH
//       };
      
//     case 'playing':
//       // ДОДАТИ ПЕРЕВІРКУ ОБМЕЖЕНЬ ДЛЯ 4×4:
//       if (boardSize === 4 && restrictionInfo?.hasRestrictions && currentPlayer === firstPlayer) {
//         return {
//           text: 'Ваш хід з обмеженням',
//           subtext: 'Другий хід не може бути поруч з першим',
//           emoji: '🚫'
//         };
//       }

//       if (gameMode === 'ai') {
//         if (isAIThinking) {
//           return {
//             text: 'ШІ думає',
//             subtext: 'Розраховуємо найкращий хід...',
//             emoji: GAME_EMOJIS.THINKING
//           };
//         }
        
//         if (currentPlayer === playerSymbol) {
//           return {
//             text: 'Ваш хід',
//             subtext: `Граєте ${GAME_LABELS.SYMBOLS[playerSymbol]}`,
//             emoji: GAME_EMOJIS.TARGET
//           };
//         } else {
//           return {
//             text: 'Хід ШІ',
//             subtext: 'Очікуйте на хід комп\'ютера',
//             emoji: GAME_EMOJIS.ROBOT
//           };
//         }
//       }
      
//       if (gameMode === 'pvp') {
//         return {
//           text: `Хід: ${GAME_LABELS.SYMBOLS[currentPlayer]}`,
//           subtext: currentPlayer === playerSymbol ? 'Ваш хід' : 'Хід опонента',
//           emoji: GAME_EMOJIS.VERSUS
//         };
//       }
      
//       if (gameMode === 'tournament') {
//         return {
//           text: `Хід: ${GAME_LABELS.SYMBOLS[currentPlayer]}`,
//           subtext: 'Турнірна гра',
//           emoji: GAME_EMOJIS.TROPHY
//         };
//       }
      
//       return {
//         text: `Хід: ${GAME_LABELS.SYMBOLS[currentPlayer]}`,
//         emoji: GAME_EMOJIS.GAME
//       };
      
//     case 'paused':
//       return {
//         text: 'Гра призупинена',
//         subtext: 'Натисніть щоб продовжити',
//         emoji: '⏸️'
//       };
      
//     case 'finished':
//       return {
//         text: 'Гра завершена',
//         emoji: GAME_EMOJIS.WIN
//       };
      
//     default:
//       return {
//         text: 'Невідомий стан',
//         emoji: GAME_EMOJIS.INFO
//       };
//   }
// }

// // Отримання результату гри як текст
// function getGameResultText(
//   result: GameResult,
//   gameMode: GameMode
// ): { text: string; color: string; emoji: string } | null {
  
//   if (!result) return null;
  
//   switch (result) {
//     case 'win':
//       return {
//         text: gameMode === 'ai' ? 'Ви перемогли!' : 'Перемога!',
//         color: 'text-green-600',
//         emoji: GAME_EMOJIS.WIN
//       };
      
//     case 'lose':
//       return {
//         text: gameMode === 'ai' ? 'ШІ переміг' : 'Поразка',
//         color: 'text-red-600',
//         emoji: GAME_EMOJIS.LOSE
//       };
      
//     case 'draw':
//       return {
//         text: 'Нічия',
//         color: 'text-yellow-600',
//         emoji: GAME_EMOJIS.DRAW
//       };
      
//     default:
//       return null;
//   }
// }

// export default function GameStatus({
//   gameState,
//   currentPlayer,
//   gameResult,
//   gameMode,
//   playerSymbol,
//   opponentSymbol,
//   // ДОДАТИ ЦІ РЯДКИ:
//   boardSize,
//   restrictionInfo,
//   firstPlayer,
//   isAIThinking = false,
//   aiDifficulty,
//   playerName,
//   opponentName,
//   tournamentName,
//   currentRound,
//   totalRounds,
//   showDetails = true,
//   showEmojis = true,
//   variant = 'default',
//   className = ''
// }: GameStatusProps) {
  
//   const statusInfo = getGameStatusText(
//     gameState, 
//     currentPlayer, 
//     isAIThinking, 
//     playerSymbol, 
//     gameMode,
//      // НОВІ АРГУМЕНТИ:
//     boardSize,
//     restrictionInfo,
//     firstPlayer
//   );
  
//   const resultInfo = getGameResultText(gameResult, gameMode);
  
//   // Компактний варіант
//   if (variant === 'compact') {
//     return (
//       <div className={`
//         flex items-center space-x-2 px-3 py-2 
//         bg-white/50 backdrop-blur-sm rounded-lg
//         border border-gray-200/50
//         ${className}
//       `}>
//         {showEmojis && statusInfo.emoji && (
//           <span className="text-lg">{statusInfo.emoji}</span>
//         )}
        
//         <div className="flex-1 min-w-0">
//           <p className="text-sm font-medium text-gray-900 truncate">
//             {resultInfo ? resultInfo.text : statusInfo.text}
//           </p>
          
//           {statusInfo.subtext && !resultInfo && (
//             <p className="text-xs text-gray-500 truncate">
//               {statusInfo.subtext}
//             </p>
//           )}
//         </div>
        
//         {isAIThinking && (
//           <div className="flex items-center">
//             <Brain className="w-4 h-4 text-purple-500 animate-pulse" />
//           </div>
//         )}
//       </div>
//     );
//   }
  
//   // Детальний варіант
//   if (variant === 'detailed') {
//     return (
//       <div className={`
//         p-6 bg-gradient-to-br from-white to-gray-50
//         rounded-xl shadow-lg border border-gray-200/50
//         ${className}
//       `}>
//         {/* Заголовок */}
//         <div className="flex items-center justify-between mb-4">
//           <h3 className="text-lg font-semibold text-gray-900">
//             {GAME_LABELS.MODES[gameMode]}
//           </h3>
          
//           {gameState === 'playing' && (
//             <div className="flex items-center space-x-1">
//               <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
//               <span className="text-sm text-green-600">Активна</span>
//             </div>
//           )}
//         </div>
        
//         {/* Основний статус */}
//         <div className="flex items-center space-x-3 mb-4">
//           {showEmojis && statusInfo.emoji && (
//             <span className="text-2xl">{statusInfo.emoji}</span>
//           )}
          
//           <div className="flex-1">
//             <h4 className={`text-xl font-bold ${
//               resultInfo ? resultInfo.color : 'text-gray-900'
//             }`}>
//               {resultInfo ? resultInfo.text : statusInfo.text}
//             </h4>
            
//             {statusInfo.subtext && !resultInfo && (
//               <p className="text-sm text-gray-600 mt-1">
//                 {statusInfo.subtext}
//               </p>
//             )}
//           </div>
          
//           {isAIThinking && (
//             <div className="flex flex-col items-center">
//               <Brain className="w-6 h-6 text-purple-500 animate-pulse mb-1" />
//               <span className="text-xs text-purple-600">Думає</span>
//             </div>
//           )}
//         </div>
        
//         {/* Детальна інформація */}
//         {showDetails && (
//           <div className="space-y-3 pt-4 border-t border-gray-200">
//             {/* Гравці */}
//             <div className="grid grid-cols-2 gap-4">
//               <div className="flex items-center space-x-2">
//                 {getPlayerIcon(playerSymbol, false)}
//                 <span className="text-sm font-medium">
//                   {playerName || 'Ви'} ({GAME_LABELS.SYMBOLS[playerSymbol]})
//                 </span>
//               </div>
              
//               <div className="flex items-center space-x-2">
//                 {getPlayerIcon(opponentSymbol || 'O', gameMode === 'ai')}
//                 <span className="text-sm font-medium">
//                   {gameMode === 'ai' ? 
//                     `ШІ (${aiDifficulty})` : 
//                     (opponentName || 'Опонент')
//                   } ({GAME_LABELS.SYMBOLS[opponentSymbol || 'O']})
//                 </span>
//               </div>
//             </div>
            
//             {/* Турнірна інформація */}
//             {gameMode === 'tournament' && tournamentName && (
//               <div className="flex items-center space-x-2 text-sm text-gray-600">
//                 <Trophy className="w-4 h-4" />
//                 <span>{tournamentName}</span>
//                 {currentRound && totalRounds && (
//                   <span className="ml-auto">
//                     Раунд {currentRound}/{totalRounds}
//                   </span>
//                 )}
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     );
//   }
  
//   // Стандартний варіант
//   return (
//     <div className={`
//       flex items-center justify-between p-4
//       bg-white/80 backdrop-blur-sm rounded-lg
//       border border-gray-200/50 shadow-sm
//       transition-all duration-300
//       ${className}
//     `}>
//       {/* Лівий блок - статус */}
//       <div className="flex items-center space-x-3">
//         {showEmojis && statusInfo.emoji && (
//           <span className="text-xl">{statusInfo.emoji}</span>
//         )}
        
//         <div>
//           <h4 className={`font-semibold ${
//             resultInfo ? resultInfo.color : 'text-gray-900'
//           }`}>
//             {resultInfo ? resultInfo.text : statusInfo.text}
//           </h4>
          
//           {statusInfo.subtext && !resultInfo && (
//             <p className="text-sm text-gray-500">
//               {statusInfo.subtext}
//             </p>
//           )}
//         </div>
//       </div>
      
//       {/* Правий блок - додаткова інформація */}
//       <div className="flex items-center space-x-4">
//         {/* AI індикатор */}
//         {gameMode === 'ai' && isAIThinking && (
//           <div className="flex items-center space-x-2 px-3 py-1 bg-purple-100 rounded-full">
//             <Brain className="w-4 h-4 text-purple-600 animate-pulse" />
//             <span className="text-xs font-medium text-purple-700">ШІ думає</span>
//           </div>
//         )}
        
//         {/* Індикатор поточного гравця */}
//         {gameState === 'playing' && !resultInfo && (
//           <div className="flex items-center space-x-2">
//             <div className={`
//               w-3 h-3 rounded-full 
//               ${currentPlayer === 'X' ? 'bg-blue-500' : 'bg-red-500'}
//               ${gameState === 'playing' ? 'animate-pulse' : ''}
//             `} />
//             <span className="text-sm font-medium text-gray-700">
//               {GAME_LABELS.SYMBOLS[currentPlayer]}
//             </span>
//           </div>
//         )}
        
//         {/* Стан гри */}
//         <div className="flex items-center space-x-1">
//           {gameState === 'playing' && <Play className="w-4 h-4 text-green-500" />}
//           {gameState === 'paused' && <Pause className="w-4 h-4 text-yellow-500" />}
//           {gameState === 'waiting' && <Clock className="w-4 h-4 text-blue-500 animate-spin" />}
//           {gameState === 'finished' && <Trophy className="w-4 h-4 text-purple-500" />}
//         </div>
//       </div>
//     </div>
//   );
// }

// // Компонент швидкого статусу для мобільних пристроїв
// export function GameStatusMobile({
//   currentPlayer,
//   gameResult,
//   isAIThinking = false,
//   className = ''
// }: Pick<GameStatusProps, 'currentPlayer' | 'gameResult' | 'isAIThinking' | 'className'>) {
  
//   const resultInfo = getGameResultText(gameResult, 'ai');
  
//   return (
//     <div className={`
//       flex items-center justify-center space-x-2 py-2 px-4
//       bg-white/90 backdrop-blur-sm rounded-full
//       border border-gray-200/50 shadow-sm
//       ${className}
//     `}>
//       {resultInfo ? (
//         <>
//           <span className="text-sm">{resultInfo.emoji}</span>
//           <span className={`text-sm font-semibold ${resultInfo.color}`}>
//             {resultInfo.text}
//           </span>
//         </>
//       ) : (
//         <>
//           {isAIThinking ? (
//             <>
//               <Brain className="w-4 h-4 text-purple-500 animate-pulse" />
//               <span className="text-sm font-medium text-purple-600">ШІ думає</span>
//             </>
//           ) : (
//             <>
//               <div className={`
//                 w-2 h-2 rounded-full 
//                 ${currentPlayer === 'X' ? 'bg-blue-500' : 'bg-red-500'}
//                 animate-pulse
//               `} />
//               <span className="text-sm font-medium">
//                 Хід: {GAME_LABELS.SYMBOLS[currentPlayer]}
//               </span>
//             </>
//           )}
//         </>
//       )}
//     </div>
//   );
// }








































// components/game/ui/GameStatus.tsx
// Компонент відображення статусу гри
// ✅ Поточний гравець та стан гри
// ✅ Результат гри з анімаціями
// ✅ AI статус (думає/готовий)
// ✅ Адаптивні стилі та емодзі

'use client';

import React from 'react';
import { 
  User, 
  Bot, 
  Trophy, 
  Clock,
  Play,
  Pause,
  Brain
} from 'lucide-react';

import type { 
  Player, 
  GameState,
  GameResult,
  GameMode,
  // ДОДАТИ ЦІ РЯДКИ:
  BoardSize,
  RestrictionInfo
} from '../../../../types/game';

import { GAME_EMOJIS, GAME_LABELS, getGameLabels } from '../../../../constants/game';
import { useTranslation, translations, TranslationStructure } from '../../../../lib/i18n';

interface GameStatusProps {
  // Основні дані гри
  gameState: GameState;
  currentPlayer: Player;
  gameResult: GameResult;
  gameMode: GameMode;
  
  // Символи гравців
  playerSymbol: Player;
  opponentSymbol?: Player;

   // НОВІ ПОЛЯ ДЛЯ 4×4:
   boardSize?: BoardSize;
   restrictionInfo?: RestrictionInfo;
   firstPlayer?: Player;
  
  // AI стан
  isAIThinking?: boolean;
  aiDifficulty?: string;
  
  // PvP дані
  playerName?: string;
  opponentName?: string;
  
  // Турнірні дані
  tournamentName?: string;
  currentRound?: number;
  totalRounds?: number;
  
  // Налаштування відображення
  showDetails?: boolean;
  showEmojis?: boolean;
  variant?: 'default' | 'compact' | 'detailed';
  
  // Стилізація
  className?: string;
}

// Отримання іконки гравця
function getPlayerIcon(player: Player, isAI?: boolean) {
  if (isAI) {
    return <Bot className="w-4 h-4" />;
  }
  return <User className="w-4 h-4" />;
}

// Отримання статусу гри як текст
function getGameStatusText(
  gameState: GameState,
  currentPlayer: Player,
  isAIThinking: boolean,
  playerSymbol: Player,
  gameMode: GameMode,
  t: TranslationStructure,   // додайте параметр t
  gameLabels: ReturnType<typeof getGameLabels>
): { text: string; subtext?: string; emoji?: string } {
  
  switch (gameState) {
    case 'setup':
      return {
        text: t.gameStatus.setup,
        emoji: GAME_EMOJIS.SETTINGS
      };
      
    case 'waiting':
      return {
        text: t.gameStatus.waiting,
        subtext: t.gameStatus.waitingSubtext,
        emoji: GAME_EMOJIS.SEARCH
      };
      
    case 'playing':
      if (gameMode === 'ai') {
        if (currentPlayer === playerSymbol) {
          return {
            text: t.gameStatus.yourTurn,
            emoji: GAME_EMOJIS.TARGET
          };
        } else {
          return {
            text: t.gameStatus.aiTurn,
            emoji: GAME_EMOJIS.ROBOT
          };
        }
      }
      
      if (gameMode === 'pvp') {
        return {
          text: currentPlayer === playerSymbol ? t.gameStatus.yourTurn : t.gameStatus.opponentTurn,
          emoji: GAME_EMOJIS.VERSUS
        };
      }
      
      if (gameMode === 'tournament') {
        return {
          text: `${t.gameStatus.turn}: ${gameLabels.SYMBOLS[currentPlayer]}`,
          subtext: t.gameStatus.tournamentTurn,
          emoji: GAME_EMOJIS.TROPHY
        };
      }
      
      return {
        text: `${t.gameStatus.turn}: ${gameLabels.SYMBOLS[currentPlayer]}`,
        emoji: GAME_EMOJIS.GAME
      };
      
    case 'paused':
      return {
        text: t.gameStatus.paused,
        subtext: t.gameStatus.pausedSubtext,
        emoji: '⏸️'
      };
      
    case 'finished':
      return {
        text: t.gameStatus.finished,
        emoji: GAME_EMOJIS.WIN
      };
      
    default:
      return {
        text: t.gameStatus.unknown,
        emoji: GAME_EMOJIS.INFO
      };
  }
}

// Отримання результату гри як текст
function getGameResultText(
  result: GameResult,
  gameMode: GameMode,
  t: TranslationStructure // додайте параметр t
): { text: string; color: string; emoji: string } | null {
  
  if (!result) return null;
  
  switch (result) {
    case 'win':
      return {
        text: gameMode === 'ai' ? t.gameStatus.youWin : t.gameStatus.victory,
        color: 'text-green-600',
        emoji: GAME_EMOJIS.WIN
      };
      
    case 'lose':
      return {
        text: gameMode === 'ai' ? t.gameStatus.aiWins : t.gameStatus.defeat,
        color: 'text-red-600',
        emoji: GAME_EMOJIS.LOSE
      };
      
    case 'draw':
      return {
        text: t.gameStatus.draw,
        color: 'text-yellow-600',
        emoji: GAME_EMOJIS.DRAW
      };
      
    default:
      return null;
  }
}

export default function GameStatus({
  gameState,
  currentPlayer,
  gameResult,
  gameMode,
  playerSymbol,
  opponentSymbol,
  isAIThinking = false,
  aiDifficulty,
  playerName,
  opponentName,
  tournamentName,
  currentRound,
  totalRounds,
  showDetails = true,
  showEmojis = true,
  variant = 'default',
  className = ''
}: GameStatusProps) {

  const { t, language } = useTranslation();
  const gameLabels = getGameLabels(language);
  
  const statusInfo = getGameStatusText(
    gameState, 
    currentPlayer, 
    isAIThinking, 
    playerSymbol, 
    gameMode,
    t as typeof translations['uk'],
    gameLabels 
  );
  
  const resultInfo = getGameResultText(gameResult, gameMode, t as typeof translations['uk']);
  
  // Компактний варіант
  if (variant === 'compact') {
    return (
      <div className={`
        flex items-center space-x-2 px-3 py-2 
        bg-white/50 backdrop-blur-sm rounded-lg
        border border-gray-200/50
        ${className}
      `}>
        {showEmojis && statusInfo.emoji && (
          <span className="text-lg">{statusInfo.emoji}</span>
        )}
        
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {resultInfo ? resultInfo.text : statusInfo.text}
          </p>
          
          {statusInfo.subtext && !resultInfo && (
            <p className="text-xs text-gray-500 truncate">
              {statusInfo.subtext}
            </p>
          )}
        </div>
        
        {isAIThinking && (
          <div className="flex items-center">
            <Brain className="w-4 h-4 text-purple-500 animate-pulse" />
          </div>
        )}
      </div>
    );
  }
  
  // Детальний варіант
  if (variant === 'detailed') {
    return (
      <div className={`
        p-6 bg-gradient-to-br from-white to-gray-50
        rounded-xl shadow-lg border border-gray-200/50
        ${className}
      `}>
        {/* Заголовок */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {GAME_LABELS.MODES[gameMode]}
          </h3>
          
          {gameState === 'playing' && (
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm text-green-600">Активна</span>
            </div>
          )}
        </div>
        
        {/* Основний статус */}
        <div className="flex items-center space-x-3 mb-4">
          {showEmojis && statusInfo.emoji && (
            <span className="text-2xl">{statusInfo.emoji}</span>
          )}
          
          <div className="flex-1">
            <h4 className={`text-xl font-bold ${
              resultInfo ? resultInfo.color : 'text-gray-900'
            }`}>
              {resultInfo ? resultInfo.text : statusInfo.text}
            </h4>
            
            {statusInfo.subtext && !resultInfo && (
              <p className="text-sm text-gray-600 mt-1">
                {statusInfo.subtext}
              </p>
            )}
          </div>
          
          {isAIThinking && (
            <div className="flex flex-col items-center">
              <Brain className="w-6 h-6 text-purple-500 animate-pulse mb-1" />
              <span className="text-xs text-purple-600">Думає</span>
            </div>
          )}
        </div>
        
        {/* Детальна інформація */}
        {showDetails && (
          <div className="space-y-3 pt-4 border-t border-gray-200">
            {/* Гравці */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                {getPlayerIcon(playerSymbol, false)}
                <span className="text-sm font-medium">
                  {playerName || 'Ви'} ({GAME_LABELS.SYMBOLS[playerSymbol]})
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                {getPlayerIcon(opponentSymbol || 'O', gameMode === 'ai')}
                <span className="text-sm font-medium">
                  {gameMode === 'ai' ? 
                    `ШІ (${aiDifficulty})` : 
                    (opponentName || 'Опонент')
                  } ({GAME_LABELS.SYMBOLS[opponentSymbol || 'O']})
                </span>
              </div>
            </div>
            
            {/* Турнірна інформація */}
            {gameMode === 'tournament' && tournamentName && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Trophy className="w-4 h-4" />
                <span>{tournamentName}</span>
                {currentRound && totalRounds && (
                  <span className="ml-auto">
                    Раунд {currentRound}/{totalRounds}
                  </span>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
  
  // Стандартний варіант
  return (
    <div className={`
      flex items-center justify-between p-4
      bg-white/80 backdrop-blur-sm rounded-lg
      border border-gray-200/50 shadow-sm
      transition-all duration-300
      ${className}
    `}>
      {/* Компактний макет */}
      <div className="flex items-center justify-between gap-3 w-full">
        {/* Лівий блок - основна інформація */}
        <div className="flex items-center gap-2 flex-1">
          {showEmojis && statusInfo.emoji && (
            <span className="text-base">{statusInfo.emoji}</span>
          )}
          
          <div className="flex-1 min-w-0">
            <p className="text-base font-medium text-gray-900 truncate">
              {resultInfo ? resultInfo.text : statusInfo.text}
            </p>
          </div>
        </div>
        
        {/* Правий блок - символ гравця + стан гри */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Індикатор поточного гравця - ПЕРЕМІСТИЛИ ВПРАВО */}
          {gameState === 'playing' && !resultInfo && (
            <>
              <div className={`
                w-3 h-3 rounded-full 
                ${currentPlayer === 'X' ? 'bg-blue-500' : 'bg-red-500'}
                animate-pulse
              `} />
              <span className="text-sm font-medium text-gray-900">
                {gameLabels.SYMBOLS[currentPlayer]}
              </span>
            </>
          )}
          
          {/* AI індикатор */}
          {isAIThinking && (
            <Brain className="w-4 h-4 text-purple-500 animate-pulse" />
          )}
          
          {/* Стан гри */}
          <div className="flex items-center space-x-1">
            {gameState === 'playing' && <Play className="w-4 h-4 text-green-500" />}
            {gameState === 'paused' && <Pause className="w-4 h-4 text-yellow-500" />}
            {gameState === 'waiting' && <Clock className="w-4 h-4 text-blue-500 animate-spin" />}
            {gameState === 'finished' && <Trophy className="w-4 h-4 text-purple-500" />}
          </div>
        </div>
      </div>
    </div>
  );
}

// Компонент швидкого статусу для мобільних пристроїв
export function GameStatusMobile({
  currentPlayer,
  gameResult,
  isAIThinking = false,
  className = ''
}: Pick<GameStatusProps, 'currentPlayer' | 'gameResult' | 'isAIThinking' | 'className'>) {
  
  const { t } = useTranslation();
  const resultInfo = getGameResultText(gameResult, 'ai', t as typeof translations['uk']);
  
  return (
    <div className={`
      flex items-center justify-center space-x-2 py-2 px-4
      bg-white/90 backdrop-blur-sm rounded-full
      border border-gray-200/50 shadow-sm
      ${className}
    `}>
      {resultInfo ? (
        <>
          <span className="text-sm">{resultInfo.emoji}</span>
          <span className={`text-sm font-semibold ${resultInfo.color}`}>
            {resultInfo.text}
          </span>
        </>
      ) : (
        <>
          {isAIThinking ? (
            <>
              <Brain className="w-4 h-4 text-purple-500 animate-pulse" />
              <span className="text-sm font-medium text-purple-600">ШІ думає</span>
            </>
          ) : (
            <>
              <div className={`
                w-2 h-2 rounded-full 
                ${currentPlayer === 'X' ? 'bg-blue-500' : 'bg-red-500'}
                animate-pulse
              `} />
              <span className="text-sm font-medium">
                Хід: {GAME_LABELS.SYMBOLS[currentPlayer]}
              </span>
            </>
          )}
        </>
      )}
    </div>
  );
}
