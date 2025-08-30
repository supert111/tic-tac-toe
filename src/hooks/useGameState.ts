// // hooks/useGameState.ts
// // Центральний координатор стану гри - адаптований під існуючі типи
// // ✅ Використовує ваші типи з types/game.ts
// // ✅ Використовує ваші константи з constants/game.ts
// // ✅ Спрощена версія без зайвих залежностей
// // ✅ Готовий до розширення в майбутньому

// import { useState, useCallback, useMemo } from 'react';
// import { useGameLogic } from './useGameLogic';
// import { useAI } from './useAI';
// import { useTimer } from './useTimer';

// import type { 
//   Player,
//   GameMode,
//   BoardSize,
//   GameState,
//   GameResult,
//   CurrentGame,
//   AIGameSettings,
//   PvPGameSettings,
//   GameSettings,
//   Difficulty
// } from '../types/game';

// import { 
//   PLAYER_SYMBOLS,
//   GAME_MODES,
//   GAME_STATES,
//   AI_DIFFICULTY,
//   BOARD_SIZES,
//   DEFAULT_AI_SETTINGS,
//   DEFAULT_PVP_SETTINGS,
//   TIMER
// } from '../constants/game';

// // Додаткові типи для хука
// type AppState = 'menu' | 'game' | 'settings';

// // Спрощена статистика
// interface PlayerStats {
//   gamesPlayed: number;
//   wins: number;
//   losses: number;
//   draws: number;
//   winStreak: number;
//   bestWinStreak: number;
// }

// // Поточна сесія
// interface GameSession {
//   startTime: number;
//   gamesCount: number;
//   wins: number;
//   losses: number;
//   draws: number;
//   mode: GameMode;
// }

// // Конфігурація хука
// interface GameStateConfig {
//   enableSounds: boolean;
//   enableAnimations: boolean;
//   persistStats: boolean;
// }

// // Повернення хука
// export interface UseGameStateReturn {
//   // === ЗАГАЛЬНИЙ СТАН ===
//   appState: AppState;
//   gameMode: GameMode;
//   settings: AIGameSettings | PvPGameSettings;
//   isGameActive: boolean;
  
//   // === СТАН ГРИ ===
//   board: string[];
//   currentPlayer: Player;
//   gameState: GameState;
//   gameResult: GameResult;
//   winningLine: number[];
//   canUndo: boolean;
  
//   // === AI СТАН ===
//   isAIThinking: boolean;
//   aiDifficulty: Difficulty;
  
//   // === ТАЙМЕР СТАН ===
//   timeLeft: number;
//   isTimerRunning: boolean;
//   isTimeWarning: boolean;
  
//   // === СТАТИСТИКА ===
//   playerStats: PlayerStats;
//   currentSession: GameSession;
  
//   // === ОСНОВНІ ДІЇ ===
//   startNewGame: (mode: GameMode) => void;
//   returnToMenu: () => void;
//   openSettings: () => void;
//   closeSettings: () => void;
//   makeMove: (index: number) => void;
//   undoMove: () => void;
//   restartGame: () => void;
//   pauseGame: () => void;
//   resumeGame: () => void;
//   updateSettings: (newSettings: Partial<AIGameSettings | PvPGameSettings>) => void;
//   updateAIDifficulty: (difficulty: Difficulty) => void;
//   resetStats: () => void;
// }

// // Опції для хука
// interface UseGameStateOptions {
//   config?: Partial<GameStateConfig>;
//   onGameEnd?: (result: GameResult, mode: GameMode) => void;
//   onModeChange?: (mode: GameMode) => void;
//   onError?: (error: string) => void;
// }

// export function useGameState({
//   config = {},
//   onGameEnd,
//   onModeChange,
//   onError
// }: UseGameStateOptions = {}): UseGameStateReturn {

//   // Конфігурація з дефолтами
//   const fullConfig: GameStateConfig = useMemo(() => ({
//     enableSounds: true,
//     enableAnimations: true,
//     persistStats: true,
//     ...config
//   }), [config]);

//   // === ОСНОВНИЙ СТАН ===
//   const [appState, setAppState] = useState<AppState>('menu');
//   const [gameMode, setGameMode] = useState<GameMode>(GAME_MODES.AI);
//   const [settings, setSettings] = useState<AIGameSettings | PvPGameSettings>(DEFAULT_AI_SETTINGS);
//   const [currentGame, setCurrentGame] = useState<CurrentGame>({
//     id: null,
//     board: { cells: Array(9).fill(''), size: BOARD_SIZES.SMALL },
//     currentPlayer: PLAYER_SYMBOLS.X,
//     gameActive: false,
//     gameState: GAME_STATES.SETUP,
//     winningConditions: [],
//     winningLine: [],
//     result: null,
//     startTime: null,
//     endTime: null
//   });

//   // === СТАТИСТИКА ===
//   const [playerStats, setPlayerStats] = useState<PlayerStats>({
//     gamesPlayed: 0,
//     wins: 0,
//     losses: 0,
//     draws: 0,
//     winStreak: 0,
//     bestWinStreak: 0
//   });

//   const [currentSession, setCurrentSession] = useState<GameSession>({
//     startTime: Date.now(),
//     gamesCount: 0,
//     wins: 0,
//     losses: 0,
//     draws: 0,
//     mode: gameMode
//   });

//   // === AI СТАН ===
//   const [isAIThinking, setIsAIThinking] = useState(false);

//   // === ТАЙМЕР СТАН ===
//   const [timeLeft, setTimeLeft] = useState(TIMER.DEFAULT_TIME);
//   const [isTimerRunning, setIsTimerRunning] = useState(false);
//   const isTimeWarning = timeLeft <= TIMER.WARNING_TIME;

//   // === ІНІЦІАЛІЗАЦІЯ ХУКІВ (заглушки) ===
//   // Тут будуть справжні хуки коли вони будуть готові
//   const gameLogic = {
//     board: currentGame.board.cells,
//     currentPlayer: currentGame.currentPlayer,
//     gameResult: currentGame.result,
//     winningLine: currentGame.winningLine,
//     gameActive: currentGame.gameActive,
//     moveCount: 0,
//     canMakeMove: (index: number) => currentGame.board.cells[index] === '' && currentGame.gameActive,
//     makePlayerMove: (index: number) => {
//       if (!gameLogic.canMakeMove(index)) return false;
      
//       const newCells = [...currentGame.board.cells];
//       newCells[index] = currentGame.currentPlayer;
      
//       setCurrentGame(prev => ({
//         ...prev,
//         board: { ...prev.board, cells: newCells },
//         currentPlayer: prev.currentPlayer === PLAYER_SYMBOLS.X ? PLAYER_SYMBOLS.O : PLAYER_SYMBOLS.X
//       }));
      
//       // Перевірка на перемогу (спрощена)
//       if (checkWin(newCells)) {
//         handleGameEnd('win');
//       } else if (newCells.every(cell => cell !== '')) {
//         handleGameEnd('draw');
//       }
      
//       return true;
//     },
//     initializeGame: (firstPlayer?: Player) => {
//       const boardSize = settings.boardSize === BOARD_SIZES.LARGE ? 16 : 9;
//       setCurrentGame(prev => ({
//         ...prev,
//         board: { cells: Array(boardSize).fill(''), size: settings.boardSize },
//         currentPlayer: firstPlayer || PLAYER_SYMBOLS.X,
//         gameActive: true,
//         gameState: GAME_STATES.PLAYING,
//         result: null,
//         startTime: Date.now(),
//         endTime: null
//       }));
//     },
//     resetGame: () => {
//       gameLogic.initializeGame();
//     },
//     undoLastMove: () => {
//       // Спрощена реалізація
//       return false;
//     },
//     pauseGame: () => {
//       setCurrentGame(prev => ({ ...prev, gameState: GAME_STATES.PAUSED }));
//     },
//     resumeGame: () => {
//       setCurrentGame(prev => ({ ...prev, gameState: GAME_STATES.PLAYING }));
//     }
//   };

//   // Спрощена перевірка перемоги для 3x3
//   const checkWin = (board: string[]): boolean => {
//     const winPatterns = [
//       [0, 1, 2], [3, 4, 5], [6, 7, 8], // рядки
//       [0, 3, 6], [1, 4, 7], [2, 5, 8], // стовпці
//       [0, 4, 8], [2, 4, 6] // діагоналі
//     ];
    
//     return winPatterns.some(pattern => {
//       const [a, b, c] = pattern;
//       return board[a] && board[a] === board[b] && board[a] === board[c];
//     });
//   };

//   // === ОБРОБКА ЗАВЕРШЕННЯ ГРИ ===
//   const handleGameEnd = useCallback((result: GameResult) => {
//     setCurrentGame(prev => ({
//       ...prev,
//       gameActive: false,
//       gameState: GAME_STATES.FINISHED,
//       result,
//       endTime: Date.now()
//     }));

//     // Оновлення статистики
//     setPlayerStats(prev => {
//       const newStats = { ...prev };
//       newStats.gamesPlayed++;
      
//       if (result === 'win') {
//         newStats.wins++;
//         newStats.winStreak++;
//         newStats.bestWinStreak = Math.max(newStats.bestWinStreak, newStats.winStreak);
//       } else {
//         newStats.winStreak = 0;
//         if (result === 'lose') newStats.losses++;
//         if (result === 'draw') newStats.draws++;
//       }
      
//       return newStats;
//     });

//     // Оновлення сесії
//     setCurrentSession(prev => ({
//       ...prev,
//       gamesCount: prev.gamesCount + 1,
//       wins: prev.wins + (result === 'win' ? 1 : 0),
//       losses: prev.losses + (result === 'lose' ? 1 : 0),
//       draws: prev.draws + (result === 'draw' ? 1 : 0)
//     }));

//     onGameEnd?.(result, gameMode);
//   }, [gameMode, onGameEnd]);

//   // === AI ЛОГІКА (спрощена) ===
//   const handleAIMove = useCallback(async () => {
//     if (gameMode !== GAME_MODES.AI || !currentGame.gameActive) return;
    
//     setIsAIThinking(true);
    
//     // Імітація думання AI
//     setTimeout(() => {
//       const availableMoves = currentGame.board.cells
//         .map((cell, index) => cell === '' ? index : -1)
//         .filter(index => index !== -1);
      
//       if (availableMoves.length > 0) {
//         const randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
//         gameLogic.makePlayerMove(randomMove);
//       }
      
//       setIsAIThinking(false);
//     }, Math.random() * 1000 + 500);
//   }, [gameMode, currentGame, gameLogic]);

//   // === ОСНОВНІ ДІЇ ===

//   const startNewGame = useCallback((mode: GameMode) => {
//     setGameMode(mode);
//     setAppState('game');
    
//     // Встановлюємо правильні налаштування для режиму
//     if (mode === GAME_MODES.AI && settings.gameMode !== GAME_MODES.AI) {
//       setSettings(DEFAULT_AI_SETTINGS);
//     } else if (mode === GAME_MODES.PVP && settings.gameMode !== GAME_MODES.PVP) {
//       setSettings(DEFAULT_PVP_SETTINGS);
//     }
    
//     // Визначаємо хто ходить першим
//     let firstPlayer: Player = PLAYER_SYMBOLS.X;
//     if (mode === GAME_MODES.AI && 'firstMove' in settings) {
//       if (settings.firstMove === 'ai') {
//         firstPlayer = settings.playerSymbol === PLAYER_SYMBOLS.X ? PLAYER_SYMBOLS.O : PLAYER_SYMBOLS.X;
//       } else if (settings.firstMove === 'random') {
//         firstPlayer = Math.random() < 0.5 ? PLAYER_SYMBOLS.X : PLAYER_SYMBOLS.O;
//       }
//     }
    
//     gameLogic.initializeGame(firstPlayer);
    
//     // Запускаємо таймер
//     setTimeLeft(TIMER.DEFAULT_TIME);
//     setIsTimerRunning(true);
    
//     // Оновлюємо сесію
//     setCurrentSession(prev => ({
//       ...prev,
//       mode,
//       startTime: prev.gamesCount === 0 ? Date.now() : prev.startTime
//     }));
    
//     onModeChange?.(mode);
//   }, [settings, gameLogic, onModeChange]);

//   const makeMove = useCallback((index: number) => {
//     if (!gameLogic.canMakeMove(index)) return;
    
//     const success = gameLogic.makePlayerMove(index);
//     if (success) {
//       // Скидаємо таймер
//       setTimeLeft(TIMER.DEFAULT_TIME);
      
//       // Якщо це AI режим і зараз хід AI
//       if (gameMode === GAME_MODES.AI && currentGame.currentPlayer !== settings.playerSymbol) {
//         handleAIMove();
//       }
//     }
//   }, [gameLogic, gameMode, currentGame.currentPlayer, settings.playerSymbol, handleAIMove]);

//   const undoMove = useCallback(() => {
//     if (gameMode === GAME_MODES.PVP) {
//       gameLogic.undoLastMove();
//     }
//   }, [gameMode, gameLogic]);

//   const restartGame = useCallback(() => {
//     gameLogic.resetGame();
//     setTimeLeft(TIMER.DEFAULT_TIME);
//     setIsTimerRunning(true);
//   }, [gameLogic]);

//   const returnToMenu = useCallback(() => {
//     setAppState('menu');
//     setIsTimerRunning(false);
//     setCurrentGame(prev => ({ ...prev, gameActive: false, gameState: GAME_STATES.SETUP }));
//   }, []);

//   const openSettings = useCallback(() => {
//     if (appState === 'game' && currentGame.gameActive) {
//       gameLogic.pauseGame();
//       setIsTimerRunning(false);
//     }
//     setAppState('settings');
//   }, [appState, currentGame.gameActive, gameLogic]);

//   const closeSettings = useCallback(() => {
//     const previousState = currentGame.gameActive ? 'game' : 'menu';
//     setAppState(previousState);
    
//     if (previousState === 'game') {
//       gameLogic.resumeGame();
//       setIsTimerRunning(true);
//     }
//   }, [currentGame.gameActive, gameLogic]);

//   const pauseGame = useCallback(() => {
//     gameLogic.pauseGame();
//     setIsTimerRunning(false);
//   }, [gameLogic]);

//   const resumeGame = useCallback(() => {
//     gameLogic.resumeGame();
//     setIsTimerRunning(true);
//   }, [gameLogic]);

//   const updateSettings = useCallback((newSettings: Partial<AIGameSettings | PvPGameSettings>) => {
//     setSettings(prev => ({ ...prev, ...newSettings }));
//   }, []);

//   const updateAIDifficulty = useCallback((difficulty: Difficulty) => {
//     if (settings.gameMode === GAME_MODES.AI) {
//       setSettings(prev => ({ ...prev, difficulty }));
//     }
//   }, [settings.gameMode]);

//   const resetStats = useCallback(() => {
//     setPlayerStats({
//       gamesPlayed: 0,
//       wins: 0,
//       losses: 0,
//       draws: 0,
//       winStreak: 0,
//       bestWinStreak: 0
//     });
//     setCurrentSession({
//       startTime: Date.now(),
//       gamesCount: 0,
//       wins: 0,
//       losses: 0,
//       draws: 0,
//       mode: gameMode
//     });
//   }, [gameMode]);

//   // === ОБЧИСЛЮВАНІ ЗНАЧЕННЯ ===
//   const isGameActive = currentGame.gameActive;
//   const canUndo = gameMode === GAME_MODES.PVP && isGameActive;
//   const aiDifficulty = settings.gameMode === GAME_MODES.AI ? settings.difficulty : AI_DIFFICULTY.MEDIUM;

//   return {
//     // === ЗАГАЛЬНИЙ СТАН ===
//     appState,
//     gameMode,
//     settings,
//     isGameActive,
    
//     // === СТАН ГРИ ===
//     board: currentGame.board.cells,
//     currentPlayer: currentGame.currentPlayer,
//     gameState: currentGame.gameState,
//     gameResult: currentGame.result,
//     winningLine: currentGame.winningLine,
//     canUndo,
    
//     // === AI СТАН ===
//     isAIThinking,
//     aiDifficulty,
    
//     // === ТАЙМЕР СТАН ===
//     timeLeft,
//     isTimerRunning,
//     isTimeWarning,
    
//     // === СТАТИСТИКА ===
//     playerStats,
//     currentSession,
    
//     // === ДІЇ ===
//     startNewGame,
//     returnToMenu,
//     openSettings,
//     closeSettings,
//     makeMove,
//     undoMove,
//     restartGame,
//     pauseGame,
//     resumeGame,
//     updateSettings,
//     updateAIDifficulty,
//     resetStats
//   };
// }




































// //last// hooks/useGameState.ts
// // Головний хук для управління станом гри
// // ✅ Використовує справжні хуки: useGameLogic, useAI, useTimer
// // ✅ Об'єднує всю логіку гри в одному місці
// // ✅ Підтримує AI, PvP та майбутні режими

// import { useState, useCallback, useEffect, useRef } from 'react';
// import { useGameLogic } from './useGameLogic';
// import { useAI, type AIDifficulty, type AIConfig } from './useAI';
// import { useTimer, type TimerConfig } from './useTimer';

// import type { 
//   GameMode, 
//   Player, 
//   BoardSize, 
//   GameResult,
//   GameState as GameStateType,
//   CellValue
// } from '../types/game';

// import { PLAYER_SYMBOLS, GAME_MODES } from '../constants/game';
// import { getOppositePlayer } from '../utils/gameUtils'; 

// // Налаштування гри
// export interface GameSettings {
//   boardSize: BoardSize;
//   gameMode: GameMode;
//   playerSymbol: Player;
//   aiDifficulty: AIDifficulty;
//   timerEnabled: boolean;
//   timePerMove: number;
//   aiThinkingTime: number;
// }

// // Статистика поточної сесії
// export interface SessionStats {
//   gamesPlayed: number;
//   wins: number;
//   losses: number;
//   draws: number;
//   winRate: number;
//   averageGameTime: number;
//   longestGame: number;
//   shortestGame: number;
// }

// // Повертаємий інтерфейс
// export interface UseGameStateReturn {
//   // Стан гри (з useGameLogic)
//   gameState: GameStateType;
//   board: CellValue[];
//   currentPlayer: Player;
//   gameActive: boolean;
//   winningLine: number[];
//   gameResult: GameResult;
  
//   // AI стан (з useAI)
//   isAIThinking: boolean;
//   aiDifficulty: AIDifficulty;
  
//   // Таймер стан (з useTimer)
//   timeLeft: number;
//   isTimerRunning: boolean;
//   isTimeWarning: boolean;
//   isTimeUp: boolean;
  
//   // Налаштування
//   settings: GameSettings;
  
//   // Статистика
//   sessionStats: SessionStats;
//   gameStats: {
//     duration: number;
//     moves: number;
//     playerMoves: number;
//     opponentMoves: number;
//   };
  
//   // Основні дії
//   startNewGame: (firstPlayer?: Player) => void; 
//   makeMove: (index: number) => Promise<boolean>;
//   pauseGame: () => void;
//   resumeGame: () => void;
//   resetGame: () => void;
  
//   // Налаштування
//   updateSettings: (newSettings: Partial<GameSettings>) => void;
  
//   // Утіліти
//   canMakeMove: (index: number) => boolean;
//   getAvailableMoves: () => number[];
//   formatTime: (seconds: number) => string;
//   getTimePercentage: () => number;
  
//   // Розширені дії
//   undoLastMove: () => boolean;
//   surrenderGame: () => void;
  
//   // Аналіз позиції (для AI режиму)
//   evaluatePosition: () => number;
//   getBestMoves: (count?: number) => number[];
// }

// // Опції хука
// interface UseGameStateOptions {
//   initialSettings?: Partial<GameSettings>;
//   onGameEnd?: (result: GameResult, winner?: Player) => void;
//   onStatisticsUpdate?: (stats: SessionStats) => void;
//   persistStats?: boolean;
// }

// // Дефолтні налаштування
// const DEFAULT_SETTINGS: GameSettings = {
//   boardSize: 3,
//   gameMode: GAME_MODES.AI,
//   playerSymbol: PLAYER_SYMBOLS.X,
//   aiDifficulty: 'medium',
//   timerEnabled: false,
//   timePerMove: 30,
//   aiThinkingTime: 1000
// };

// const DEFAULT_STATS: SessionStats = {
//   gamesPlayed: 0,
//   wins: 0,
//   losses: 0,
//   draws: 0,
//   winRate: 0,
//   averageGameTime: 0,
//   longestGame: 0,
//   shortestGame: 0
// };

// export function useGameState({
//   initialSettings = {},
//   onGameEnd,
//   onStatisticsUpdate,
// }: UseGameStateOptions = {}): UseGameStateReturn {

//   // Об'єднуємо дефолтні та початкові налаштування
//   const [settings, setSettings] = useState<GameSettings>({
//     ...DEFAULT_SETTINGS,
//     ...initialSettings
//   });

//   // Статистика сесії
//   const [sessionStats, setSessionStats] = useState<SessionStats>(DEFAULT_STATS);
//   const gameTimesRef = useRef<number[]>([]);

//   // AI конфігурація
//   const aiConfig: AIConfig = {
//     difficulty: settings.aiDifficulty,
//     thinkingTime: settings.aiThinkingTime,
//     aiSymbol: settings.playerSymbol === PLAYER_SYMBOLS.X ? PLAYER_SYMBOLS.O : PLAYER_SYMBOLS.X,
//     randomness: settings.aiDifficulty === 'easy' ? 80 : settings.aiDifficulty === 'medium' ? 20 : 5
//   };

//   // Таймер конфігурація
//   const timerConfig: TimerConfig = {
//     timePerMove: settings.timePerMove,
//     warningThreshold: Math.max(5, Math.floor(settings.timePerMove * 0.2)),
//     autoEndMove: true
//   };

//   // Ініціалізуємо хуки
//   const gameLogic = useGameLogic({
//     boardSize: settings.boardSize,
//     playerSymbol: settings.playerSymbol,
//     onGameEnd: handleGameEnd,
//     onMoveComplete: handleMoveComplete
//   });

//   const ai = useAI({
//     config: aiConfig,
//     onMoveCalculated: (moveIndex, evaluation) => {
//       console.log(`AI обрав хід ${moveIndex} з оцінкою ${evaluation}`);
//     }
//   });

//   const timer = useTimer({
//     config: timerConfig,
//     onTimeUp: handleTimeUp,
//     onWarning: () => {
//       console.log('Попередження: час майже закінчився!');
//     }
//   });

//   // Обробники подій
//   function handleGameEnd(result: GameResult, winner?: Player) {
//     // Оновлюємо статистику
//     updateSessionStats(result);
    
//     // Зупиняємо таймер
//     if (settings.timerEnabled) {
//       timer.pauseTimer();
//     }
    
//     // Зупиняємо AI якщо думає
//     if (ai.isThinking) {
//       ai.cancelAIMove();
//     }

//     // Викликаємо зовнішній callback
//     onGameEnd?.(result, winner);
//   }

//   function handleMoveComplete(board: CellValue[], nextPlayer: Player) {
//     console.log('🔄 handleMoveComplete викликано:', { nextPlayer, gameMode: settings.gameMode });
//     // Скидаємо таймер для наступного ходу
//     if (settings.timerEnabled) {
//       timer.resetMoveTimer();
//     }

//     // Не викликаємо AI тут, тому що useEffect буде обробляти це
//   }

//   function handleTimeUp() {
//     console.log('⏰ Час на хід закінчився! Завершуємо гру');
    
//     // Зупиняємо таймер
//     timer.pauseTimer();
    
//     // Завершуємо гру з результатом "програш по часу"
//     if (settings.gameMode === GAME_MODES.AI) {
//       // Якщо час гравця закінчився - гравець програв
//       const result: GameResult = gameLogic.currentPlayer === settings.playerSymbol ? 'lose' : 'win';
//       const winner = gameLogic.currentPlayer === settings.playerSymbol ? 
//         (settings.playerSymbol === PLAYER_SYMBOLS.X ? PLAYER_SYMBOLS.O : PLAYER_SYMBOLS.X) :
//         settings.playerSymbol;
      
//       gameLogic.endGame(result, winner);
//     } else if (settings.gameMode === GAME_MODES.PVP) {
//       // В PvP режимі поточний гравець програє
//       gameLogic.endGame('lose', getOppositePlayer(gameLogic.currentPlayer));
//     }
//   }

//   // Оновлення статистики
//   const updateSessionStats = useCallback((result: GameResult) => {
//     const gameTime = gameLogic.getGameStats().duration;
//     gameTimesRef.current.push(gameTime);
    
//     setSessionStats(prev => {
//       const newStats = {
//         ...prev,
//         gamesPlayed: prev.gamesPlayed + 1,
//         wins: result === 'win' ? prev.wins + 1 : prev.wins,
//         losses: result === 'lose' ? prev.losses + 1 : prev.losses,
//         draws: result === 'draw' ? prev.draws + 1 : prev.draws
//       };

//       // Обчислюємо додаткову статистику
//       newStats.winRate = newStats.gamesPlayed > 0 ? 
//         (newStats.wins / newStats.gamesPlayed) * 100 : 0;
      
//       const times = gameTimesRef.current;
//       newStats.averageGameTime = times.length > 0 ? 
//         times.reduce((sum, time) => sum + time, 0) / times.length : 0;
      
//       newStats.longestGame = times.length > 0 ? Math.max(...times) : 0;
//       newStats.shortestGame = times.length > 0 ? Math.min(...times) : 0;

//       // Викликаємо callback оновлення статистики
//       onStatisticsUpdate?.(newStats);
      
//       return newStats;
//     });
//   }, [gameLogic, onStatisticsUpdate]);

//   // AI хід з конкретним гравцем (нова функція)
//   const makeAIMoveForPlayer = useCallback(async (player: Player) => {
//     const aiSymbol = settings.playerSymbol === PLAYER_SYMBOLS.X ? PLAYER_SYMBOLS.O : PLAYER_SYMBOLS.X;
    
//     console.log('🤖 makeAIMoveForPlayer ДЕТАЛЬНИЙ ЛОГ:', {
//       gameActive: gameLogic.gameActive,
//       requestedPlayer: player,
//       currentPlayer: gameLogic.currentPlayer,
//       playerSymbol: settings.playerSymbol,
//       calculatedAISymbol: aiSymbol,
//       playersMatch: player === aiSymbol,
//       currentMatch: player === gameLogic.currentPlayer,
//       shouldAIMove: player === aiSymbol && player === gameLogic.currentPlayer && gameLogic.gameActive
//     });
    
//     if (!gameLogic.gameActive || player !== aiSymbol || player !== gameLogic.currentPlayer) {
//       console.log('❌ AI не може зробити хід - умови не виконані:', {
//         gameActive: gameLogic.gameActive,
//         playerMatch: player === aiSymbol,
//         currentMatch: player === gameLogic.currentPlayer
//       });
//       return;
//     }

//     console.log('🎯 AI починає розрахунок ходу');
//     try {
//       const moveIndex = await ai.makeAIMove(gameLogic.board, settings.boardSize);
//       console.log('🎲 AI розрахував хід:', moveIndex);
//       console.log('🎲 Стан дошки перед AI ходом:', gameLogic.board);
      
//       if (moveIndex !== -1 && gameLogic.canMakeMove(moveIndex)) {
//         console.log('✅ Виконуємо AI хід');
//         const success = gameLogic.makePlayerMoveWithSymbol(moveIndex, aiSymbol);
//         if (!success) {
//           console.error('❌ AI хід не вдався, спробуємо знайти альтернативу');
//           // Знаходимо перший доступний хід як запасний варіант
//           const availableMoves = gameLogic.getAvailableMoves();
//           if (availableMoves.length > 0) {
//             gameLogic.makePlayerMoveWithSymbol(availableMoves[0], aiSymbol);
//           }
//         }
//       } else {
//         console.log('❌ AI хід недійсний або неможливий:', moveIndex);
//         // Знаходимо перший доступний хід
//         const availableMoves = gameLogic.getAvailableMoves();
//         if (availableMoves.length > 0) {
//           console.log('🔄 Використовуємо запасний хід:', availableMoves[0]);
//           gameLogic.makePlayerMoveWithSymbol(availableMoves[0], aiSymbol);
//         }
//       }
//     } catch (error) {
//       console.error('🔥 Помилка AI ходу:', error);
//     }
//   }, [gameLogic, ai, settings.playerSymbol, settings.boardSize]);

//   // Початок нової гри
//   const startNewGame = useCallback((firstPlayer?: Player) => {
//     console.log('🚀 startNewGame викликано з firstPlayer:', firstPlayer);
  
//     // Визначаємо хто ходить першим
//     const startingPlayer = firstPlayer || settings.playerSymbol;

//     // Скидаємо логіку гри
//     gameLogic.initializeGame(startingPlayer); 
    
//     // Скидаємо таймер
//     if (settings.timerEnabled) {
//       timer.resetTimer();
//       timer.startTimer();
//     }
    
//     // Скасовуємо AI якщо думає
//     if (ai.isThinking) {
//       ai.cancelAIMove();
//     }

//     // Не викликаємо AI тут - useEffect буде обробляти це
//   }, [gameLogic, timer, ai, settings]);

//   // Виконання ходу
//   const makeMove = useCallback(async (index: number): Promise<boolean> => {
//     if (!gameLogic.canMakeMove(index)) {
//       return false;
//     }

//     // В режимі AI перевіряємо, що зараз хід гравця
//     if (settings.gameMode === GAME_MODES.AI && gameLogic.currentPlayer !== settings.playerSymbol) {
//       return false;
//     }

//     // Виконуємо хід
//     const success = gameLogic.makePlayerMove(index);
    
//     if (success && settings.timerEnabled) {
//       timer.resetMoveTimer();
//     }

//     return success;
//   }, [gameLogic, timer, settings]);

//   // Пауза гри
//   const pauseGame = useCallback(() => {
//     gameLogic.pauseGame();
    
//     if (settings.timerEnabled) {
//       timer.pauseTimer();
//     }
    
//     if (ai.isThinking) {
//       ai.cancelAIMove();
//     }
//   }, [gameLogic, timer, ai, settings.timerEnabled]);

//   // Відновлення гри
//   const resumeGame = useCallback(() => {
//     gameLogic.resumeGame();
    
//     if (settings.timerEnabled) {
//       timer.resumeTimer();
//     }

//     // useEffect буде обробляти AI хід при відновленні
//   }, [gameLogic, timer, settings]);

//   // Скидання гри
//   const resetGame = useCallback(() => {
//     gameLogic.resetGame();
    
//     if (settings.timerEnabled) {
//       timer.resetTimer();
//     }
    
//     if (ai.isThinking) {
//       ai.cancelAIMove();
//     }
//   }, [gameLogic, timer, ai, settings.timerEnabled]);

//   // Оновлення налаштувань
//   const updateSettings = useCallback((newSettings: Partial<GameSettings>) => {
//     setSettings(prev => {
//       const updated = { ...prev, ...newSettings };
      
//       // Оновлюємо AI конфігурацію якщо потрібно
//       if (newSettings.aiDifficulty || newSettings.aiThinkingTime || newSettings.playerSymbol) {
//         const newAIConfig: Partial<AIConfig> = {};
        
//         if (newSettings.aiDifficulty) newAIConfig.difficulty = newSettings.aiDifficulty;
//         if (newSettings.aiThinkingTime) newAIConfig.thinkingTime = newSettings.aiThinkingTime;
//         if (newSettings.playerSymbol) {
//           newAIConfig.aiSymbol = newSettings.playerSymbol === PLAYER_SYMBOLS.X ? 
//             PLAYER_SYMBOLS.O : PLAYER_SYMBOLS.X;
//         }
        
//         ai.updateConfig(newAIConfig);
//       }
      
//       return updated;
//     });
//   }, [ai]);

//   // Здача гри
//   const surrenderGame = useCallback(() => {
//     const result: GameResult = settings.gameMode === GAME_MODES.AI ? 'lose' : 'lose';
//     gameLogic.endGame(result, settings.playerSymbol === PLAYER_SYMBOLS.X ? PLAYER_SYMBOLS.O : PLAYER_SYMBOLS.X);
//   }, [gameLogic, settings]);

//   // Аналіз позиції
//   const evaluatePosition = useCallback(() => {
//     return ai.evaluatePosition(gameLogic.board, settings.boardSize);
//   }, [ai, gameLogic.board, settings.boardSize]);

//   // Отримання найкращих ходів
//   const getBestMoves = useCallback((count = 3) => {
//     return ai.getBestMoves(gameLogic.board, settings.boardSize, count);
//   }, [ai, gameLogic.board, settings.boardSize]);

//   // Ефект для автоматичного запуску таймера при зміні гравця
//   useEffect(() => {
//     if (settings.timerEnabled && gameLogic.gameActive) {
//       timer.startTimer();
//     }
//   }, [gameLogic.currentPlayer, gameLogic.gameActive, settings.timerEnabled, timer]);

//   // Ефект для автоматичного AI ходу
//   useEffect(() => {
//     const aiSymbol = settings.playerSymbol === PLAYER_SYMBOLS.X ? PLAYER_SYMBOLS.O : PLAYER_SYMBOLS.X;
    
//     console.log('🔍 useEffect AI ДЕТАЛЬНА перевірка:', {
//       gameMode: settings.gameMode,
//       gameActive: gameLogic.gameActive,
//       currentPlayer: gameLogic.currentPlayer,
//       playerSymbol: settings.playerSymbol,
//       calculatedAISymbol: aiSymbol,
//       isAIThinking: ai.isThinking,
//       shouldMakeAIMove: settings.gameMode === GAME_MODES.AI && 
//                        gameLogic.gameActive && 
//                        gameLogic.currentPlayer === aiSymbol &&
//                        !ai.isThinking
//     });

//     if (settings.gameMode === GAME_MODES.AI && 
//         gameLogic.gameActive && 
//         gameLogic.currentPlayer === aiSymbol &&
//         !ai.isThinking) {
      
//       console.log('🤖 useEffect запускає AI хід');
//       console.log('🤖 Стан дошки перед AI ходом:', gameLogic.board);
//       // Невелика затримка для UI
//       const timeoutId = setTimeout(() => {
//         makeAIMoveForPlayer(aiSymbol);
//       }, 300);
      
//       return () => clearTimeout(timeoutId);
//     }
//   }, [gameLogic.gameActive, gameLogic.currentPlayer, settings.gameMode, settings.playerSymbol, ai.isThinking, makeAIMoveForPlayer, gameLogic.board]); //gameLogic.board

//   return {
//     // Стан гри
//     gameState: gameLogic.gameState,
//     board: gameLogic.board,
//     currentPlayer: gameLogic.currentPlayer,
//     gameActive: gameLogic.gameActive,
//     winningLine: gameLogic.winningLine,
//     gameResult: gameLogic.gameResult,
    
//     // AI стан
//     isAIThinking: ai.isThinking,
//     aiDifficulty: ai.difficulty,
    
//     // Таймер стан
//     timeLeft: timer.timeLeft,
//     isTimerRunning: timer.isRunning,
//     isTimeWarning: timer.isWarning,
//     isTimeUp: timer.isTimeUp,
    
//     // Налаштування
//     settings,
    
//     // Статистика
//     sessionStats,
//     gameStats: gameLogic.getGameStats(),
    
//     // Основні дії
//     startNewGame,
//     makeMove,
//     pauseGame,
//     resumeGame,
//     resetGame,
    
//     // Налаштування
//     updateSettings,
    
//     // Утіліти
//     canMakeMove: gameLogic.canMakeMove,
//     getAvailableMoves: gameLogic.getAvailableMoves,
//     formatTime: timer.formatTime,
//     getTimePercentage: timer.getTimePercentage,
    
//     // Розширені дії
//     undoLastMove: gameLogic.undoLastMove,
//     surrenderGame,
    
//     // Аналіз позиції
//     evaluatePosition,
//     getBestMoves
//   };
// }

































// // hooks/useGameState.ts
// // Головний хук для управління станом гри
// // ✅ Використовує справжні хуки: useGameLogic, useAI, useTimer
// // ✅ Об'єднує всю логіку гри в одному місці
// // ✅ Підтримує AI, PvP та майбутні режими
// // ✅ Збереження поточної гри в localStorage

// import { useState, useCallback, useEffect, useRef } from 'react';
// import { useGameLogic } from './useGameLogic';
// import { useAI, type AIDifficulty, type AIConfig } from './useAI';
// import { useTimer, type TimerConfig } from './useTimer';

// import type { 
//   GameMode, 
//   Player, 
//   BoardSize, 
//   GameResult,
//   GameState as GameStateType,
//   CellValue
// } from '../types/game';

// import { PLAYER_SYMBOLS, GAME_MODES } from '../constants/game';

// // Налаштування гри
// export interface GameSettings {
//   boardSize: BoardSize;
//   gameMode: GameMode;
//   playerSymbol: Player;
//   aiDifficulty: AIDifficulty;
//   timerEnabled: boolean;
//   timePerMove: number;
//   aiThinkingTime: number;
// }

// // Статистика поточної сесії
// export interface SessionStats {
//   gamesPlayed: number;
//   wins: number;
//   losses: number;
//   draws: number;
//   winRate: number;
//   averageGameTime: number;
//   longestGame: number;
//   shortestGame: number;
// }

// // Збережена гра
// interface PersistedGameState {
//   // Стан гри
//   gameId: string | null;
//   board: CellValue[];
//   currentPlayer: Player;
//   gameActive: boolean;
//   gameState: GameStateType;
//   winningLine: number[];
  
//   // Налаштування
//   settings: GameSettings;
  
//   // Таймер (якщо активний)
//   timeLeft?: number;
//   isTimerRunning?: boolean;
  
//   // Статистика сесії
//   sessionStats: SessionStats;
  
//   // Мета-дані
//   lastSaveTime: number;
//   version: string;
// }

// // Повертаємый інтерфейс
// export interface UseGameStateReturn {
//   // Стан гри (з useGameLogic)
//   gameState: GameStateType;
//   board: CellValue[];
//   currentPlayer: Player;
//   gameActive: boolean;
//   winningLine: number[];
//   gameResult: GameResult;
  
//   // AI стан (з useAI)
//   isAIThinking: boolean;
//   aiDifficulty: AIDifficulty;
  
//   // Таймер стан (з useTimer)
//   timeLeft: number;
//   isTimerRunning: boolean;
//   isTimeWarning: boolean;
//   isTimeUp: boolean;
  
//   // Налаштування
//   settings: GameSettings;
  
//   // Статистика
//   sessionStats: SessionStats;
//   gameStats: {
//     duration: number;
//     moves: number;
//     playerMoves: number;
//     opponentMoves: number;
//   };
  
//   // Основні дії
//   startNewGame: (firstPlayer?: Player) => void;
//   makeMove: (index: number) => Promise<boolean>;
//   pauseGame: () => void;
//   resumeGame: () => void;
//   resetGame: () => void;
  
//   // Налаштування
//   updateSettings: (newSettings: Partial<GameSettings>) => void;
  
//   // Утіліти
//   canMakeMove: (index: number) => boolean;
//   getAvailableMoves: () => number[];
//   formatTime: (seconds: number) => string;
//   getTimePercentage: () => number;
  
//   // Розширені дії
//   undoLastMove: () => boolean;
//   surrenderGame: () => void;
  
//   // Аналіз позиції (для AI режиму)
//   evaluatePosition: () => number;
//   getBestMoves: (count?: number) => number[];
  
//   // Збереження гри
//   hasSavedGame: () => boolean;
//   clearSavedGame: () => void;
// }

// // Опції хука
// interface UseGameStateOptions {
//   initialSettings?: Partial<GameSettings>;
//   onGameEnd?: (result: GameResult, winner?: Player) => void;
//   onStatisticsUpdate?: (stats: SessionStats) => void;
//   persistGame?: boolean;
//   storageKey?: string;
// }

// // Дефолтні налаштування
// const DEFAULT_SETTINGS: GameSettings = {
//   boardSize: 3,
//   gameMode: GAME_MODES.AI,
//   playerSymbol: PLAYER_SYMBOLS.X,
//   aiDifficulty: 'medium',
//   timerEnabled: false,
//   timePerMove: 30,
//   aiThinkingTime: 1000
// };

// const DEFAULT_STATS: SessionStats = {
//   gamesPlayed: 0,
//   wins: 0,
//   losses: 0,
//   draws: 0,
//   winRate: 0,
//   averageGameTime: 0,
//   longestGame: 0,
//   shortestGame: 0
// };

// export function useGameState({
//   initialSettings = {},
//   onGameEnd,
//   onStatisticsUpdate,
//   persistGame = false,
//   storageKey = 'tic-tac-toe-game'
// }: UseGameStateOptions = {}): UseGameStateReturn {

//   // Об'єднуємо дефолтні та початкові налаштування
//   const [settings, setSettings] = useState<GameSettings>({
//     ...DEFAULT_SETTINGS,
//     ...initialSettings
//   });

//   // Статистика сесії
//   const [sessionStats, setSessionStats] = useState<SessionStats>(DEFAULT_STATS);
//   const gameTimesRef = useRef<number[]>([]);

//   // AI конфігурація
//   const aiConfig: AIConfig = {
//     difficulty: settings.aiDifficulty,
//     thinkingTime: settings.aiThinkingTime,
//     aiSymbol: settings.playerSymbol === PLAYER_SYMBOLS.X ? PLAYER_SYMBOLS.O : PLAYER_SYMBOLS.X,
//     randomness: settings.aiDifficulty === 'easy' ? 80 : settings.aiDifficulty === 'medium' ? 10 : 0
//   };

//   // Таймер конфігурація
//   const timerConfig: TimerConfig = {
//     timePerMove: settings.timePerMove,
//     warningThreshold: Math.max(5, Math.floor(settings.timePerMove * 0.2)),
//     autoEndMove: true
//   };

//   // Ініціалізуємо хуки (ПЕРЕНЕСЕНО ВИЩЕ)
//   const gameLogic = useGameLogic({
//     boardSize: settings.boardSize,
//     playerSymbol: settings.playerSymbol,
//     onGameEnd: (result: GameResult, winner?: Player) => {
//       // Оновлюємо статистику
//       const gameTime = gameLogic.getGameStats().duration;
//       gameTimesRef.current.push(gameTime);
      
//       setSessionStats(prev => {
//         const newStats = {
//           ...prev,
//           gamesPlayed: prev.gamesPlayed + 1,
//           wins: result === 'win' ? prev.wins + 1 : prev.wins,
//           losses: result === 'lose' ? prev.losses + 1 : prev.losses,
//           draws: result === 'draw' ? prev.draws + 1 : prev.draws
//         };

//         // Обчислюємо додаткову статистику
//         newStats.winRate = newStats.gamesPlayed > 0 ? 
//           (newStats.wins / newStats.gamesPlayed) * 100 : 0;
        
//         const times = gameTimesRef.current;
//         newStats.averageGameTime = times.length > 0 ? 
//           times.reduce((sum, time) => sum + time, 0) / times.length : 0;
        
//         newStats.longestGame = times.length > 0 ? Math.max(...times) : 0;
//         newStats.shortestGame = times.length > 0 ? Math.min(...times) : 0;

//         // Викликаємо callback оновлення статистики
//         onStatisticsUpdate?.(newStats);
        
//         return newStats;
//       });
      
//       // Зупиняємо таймер
//       if (settings.timerEnabled) {
//         timer.pauseTimer();
//       }

//       // Викликаємо зовнішній callback
//       onGameEnd?.(result, winner);
//     },
//     // onMoveComplete: (board: CellValue[], nextPlayer: Player) => {
//     //   // Скидаємо таймер для наступного ходу
//     //   if (settings.timerEnabled) {
//     //     timer.resetMoveTimer();
//     //   }

//     //   // Якщо наступний хід AI в режимі AI
//     //   const aiSymbol = settings.playerSymbol === PLAYER_SYMBOLS.X ? PLAYER_SYMBOLS.O : PLAYER_SYMBOLS.X;
//     //   if (settings.gameMode === GAME_MODES.AI && nextPlayer === aiSymbol) {
//     //     // Невелика затримка перед ходом AI
//     //     setTimeout(() => {
//     //       makeAIMove();
//     //     }, 100);
//     //   }
//     // }



// //////////////////////////// Ось тут треба код памятати

//     // onMoveComplete: (board: CellValue[], nextPlayer: Player) => {
//     //   // Якщо наступний хід AI в режимі AI
//     //   const aiSymbol = settings.playerSymbol === PLAYER_SYMBOLS.X ? PLAYER_SYMBOLS.O : PLAYER_SYMBOLS.X;
      
//     //   if (settings.gameMode === GAME_MODES.AI && nextPlayer === aiSymbol) {
//     //     console.log('🎯 AI має ходити наступним! nextPlayer:', nextPlayer); // 🔍 ДОДАЙ ЛОГ
//     //     // Для AI - скидаємо таймер ПЕРЕД початком ходу
//     //     if (settings.timerEnabled) {
//     //       timer.resetMoveTimer();
//     //       timer.startTimer(); // Запускаємо таймер для AI
//     //     }
        
//     //     setTimeout(() => {
//     //       makeAIMove();
//     //     }, 200);
//     //   } else {
//     //     // Для гравця - скидаємо таймер після ходу
//     //     if (settings.timerEnabled) {
//     //       timer.resetMoveTimer();
//     //     }
//     //   }
//     // }


//     // onMoveComplete: (board: CellValue[], nextPlayer: Player) => {
//     //   console.log('🎯 onMoveComplete викликано! nextPlayer:', nextPlayer); // 🔍 ДОДАЙ ЛОГ
      
//     //   const aiSymbol = settings.playerSymbol === PLAYER_SYMBOLS.X ? PLAYER_SYMBOLS.O : PLAYER_SYMBOLS.X;
      
//     //   if (settings.gameMode === GAME_MODES.AI && nextPlayer === aiSymbol) {
//     //     console.log('🎯 AI має ходити наступним!');
        
//     //     // Для AI - скидаємо таймер
//     //     if (settings.timerEnabled) {
//     //       timer.resetMoveTimer();
//     //       timer.startTimer();
//     //     }
        
//     //     setTimeout(() => {
//     //       ai.makeAIMove(board, settings.boardSize).then(moveIndex => {
//     //         console.log('🎯 AI обрав хід:', moveIndex);
//     //         if (moveIndex !== -1) {
//     //           gameLogic.makePlayerMove(moveIndex);
//     //         }
//     //       });
//     //     }, 200);
//     //   } else {
//     //     // Для гравця - скидаємо таймер
//     //     if (settings.timerEnabled) {
//     //       timer.resetMoveTimer();
//     //     }
//     //   }
//     // }

//     onMoveComplete: (board: CellValue[], nextPlayer: Player) => {
//   console.log('🎯 onMoveComplete викликано! nextPlayer:', nextPlayer);
  
//   const aiSymbol = settings.playerSymbol === PLAYER_SYMBOLS.X ? PLAYER_SYMBOLS.O : PLAYER_SYMBOLS.X;
  
//   if (settings.gameMode === GAME_MODES.AI && nextPlayer === aiSymbol && !ai.isThinking) { // ДОДАНА ПЕРЕВІРКА !ai.isThinking
//     console.log('🎯 AI має ходити наступним!');
    
//     if (settings.timerEnabled) {
//       timer.resetMoveTimer();
//       timer.startTimer();
//     }
    
//     setTimeout(() => {
//       // Додаткова перевірка перед викликом AI
//       if (!ai.isThinking && gameLogic.currentPlayer === aiSymbol) {
//         ai.makeAIMove(board, settings.boardSize).then(moveIndex => {
//           console.log('🎯 AI обрав хід:', moveIndex);
//           if (moveIndex !== -1) {
//             gameLogic.makePlayerMove(moveIndex);
//           }
//         });
//       }
//     }, 200);
//   } else {
//     if (settings.timerEnabled) {
//       timer.resetMoveTimer();
//     }
//   }
// }


//   });

//   const ai = useAI({
//     config: aiConfig,
//     onMoveCalculated: (moveIndex, evaluation) => {
//       console.log(`AI обрав хід ${moveIndex} з оцінкою ${evaluation}`);
//     }
//   });

//   const timer = useTimer({
//     config: timerConfig,
//     onTimeUp: () => {
//       if (!gameLogic.gameActive || gameLogic.gameState !== 'playing') return;
//       console.log('Час на хід закінчився!');
//       timer.pauseTimer();

//       // Додай це щоб уникнути повторних викликів:
//       if (timer.timeLeft <= 0) return;
      
//       if (settings.gameMode === GAME_MODES.AI && gameLogic.currentPlayer === settings.playerSymbol) {
//         // Гравець не встиг зробити хід - автоматичний хід AI
//         makeAIMove();
//       } else if (settings.gameMode === GAME_MODES.PVP) {
//         // В PvP режимі передаємо хід іншому гравцю
//       }
//     },
//     onWarning: () => {
//       console.log('Попередження: час майже закінчився!');
//     }
//   });

//   // Функції збереження/завантаження гри
//   const loadGameState = useCallback((): PersistedGameState | null => {
//     if (!persistGame) return null;
    
//     try {
//       const saved = localStorage.getItem(storageKey);
//       if (!saved) return null;
      
//       const parsedState = JSON.parse(saved) as PersistedGameState;
      
//       // Перевірити версію
//       if (!parsedState.version || parsedState.version !== '1.0.0') {
//         console.warn('Несумісна версія збереженої гри');
//         return null;
//       }
      
//       // Перевірити чи не застара гра (24 години)
//       const maxAge = 24 * 60 * 60 * 1000;
//       if (Date.now() - parsedState.lastSaveTime > maxAge) {
//         console.info('Збережена гра застаріла');
//         localStorage.removeItem(storageKey);
//         return null;
//       }
      
//       return parsedState;
//     } catch (error) {
//       console.error('Помилка завантаження гри:', error);
//       return null;
//     }
//   }, [persistGame, storageKey]);

//   const clearSavedGame = useCallback(() => {
//     if (persistGame) {
//       localStorage.removeItem(storageKey);
//     }
//   }, [persistGame, storageKey]);

//   // AI хід
//   const makeAIMove = useCallback(async () => {
//     console.log('makeAIMove викликано!');
//     console.log('Поточний стан:', {
//       gameActive: gameLogic.gameActive,
//       gameState: gameLogic.gameState,
//       currentPlayer: gameLogic.currentPlayer,
//       isAIThinking: ai.isThinking
//     });
  
//     const aiSymbol = settings.playerSymbol === PLAYER_SYMBOLS.X ? PLAYER_SYMBOLS.O : PLAYER_SYMBOLS.X;
    
//     // Перевірка 1: Гра активна і в правильному стані?
//     if (!gameLogic.gameActive || gameLogic.gameState !== 'playing') {
//       console.log('❌ Гра не готова:', { 
//         gameActive: gameLogic.gameActive, 
//         gameState: gameLogic.gameState 
//       });
//       return;
//     }
    
//     // Перевірка 2: Чий хід?
//     if (gameLogic.currentPlayer !== aiSymbol) {
//       console.log('❌ Зараз не хід AI. Поточний гравець:', gameLogic.currentPlayer, 'AI символ:', aiSymbol);
//       return;
//     }
  
//     console.log('✅ Запускаємо AI хід...');

//       // 🔍 ДОДАЙ ЦІ ЛОГИ:
//     console.log('🔥 Стан таймера ПЕРЕД AI ходом:', {
//       timeLeft: timer.timeLeft,
//       isRunning: timer.isRunning,
//       timerEnabled: settings.timerEnabled
//     });
  
//     try {
//       const moveIndex = await ai.makeAIMove(gameLogic.board, settings.boardSize);

//        // 🔍 ДОДАЙ ЦЕЙ ЛОГ:
//       console.log('🔥 Стан таймера ПІСЛЯ AI ходу:', {
//         timeLeft: timer.timeLeft,
//         isRunning: timer.isRunning
//       });
      
//       // if (moveIndex !== -1) {
//       //   gameLogic.makePlayerMove(moveIndex);
//       // }
//       if (moveIndex !== -1) {
//         console.log('🎯 AI робить хід на позицію:', moveIndex);
//         const success = gameLogic.makePlayerMove(moveIndex);
//         console.log('🎯 Хід AI успішний:', success, 'Новий currentPlayer:', gameLogic.currentPlayer);
//       }

//     } catch (error) {
//       console.error('Помилка AI ходу:', error);
//     }
//   }, [gameLogic, ai, settings.playerSymbol, settings.boardSize]);

//   // Функція збереження стану
//   const saveGameState = useCallback(() => {
//     if (!persistGame || !gameLogic.gameActive) return;
    
//     const gameStateToSave: PersistedGameState = {
//       gameId: gameLogic.gameId,
//       board: gameLogic.board,
//       currentPlayer: gameLogic.currentPlayer,
//       gameActive: gameLogic.gameActive,
//       gameState: gameLogic.gameState,
//       winningLine: gameLogic.winningLine,
      
//       settings,
      
//       timeLeft: timer.timeLeft,
//       isTimerRunning: timer.isRunning,
      
//       sessionStats,
      
//       lastSaveTime: Date.now(),
//       version: '1.0.0'
//     };
    
//     try {
//       localStorage.setItem(storageKey, JSON.stringify(gameStateToSave));
//     } catch (error) {
//       console.error('Помилка збереження гри:', error);
//     }
//   }, [persistGame, gameLogic.gameActive, gameLogic.gameId, gameLogic.board, gameLogic.currentPlayer, gameLogic.gameState, gameLogic.winningLine, settings, timer.timeLeft, timer.isRunning, sessionStats, storageKey]);

//   // Початок нової гри
//   const startNewGame = useCallback((firstPlayer?: Player) => {
//     // Скидаємо логіку гри
//     gameLogic.initializeGame(firstPlayer);
    
//     // Скидаємо таймер
//     if (settings.timerEnabled) {
//       timer.resetTimer();
//   //  timer.startTimer();
//     }
    
//     // Скасовуємо AI якщо думає
//     if (ai.isThinking) {
//       ai.cancelAIMove();
//     }

//     // // Якщо AI починає першим
//     // if (settings.gameMode === GAME_MODES.AI && settings.playerSymbol === PLAYER_SYMBOLS.O) {
//     //   console.log('AI має ходити першим!'); // 🔍 Діагностика
//     //   setTimeout(() => {
//     //     console.log('Викликаємо makeAIMove...'); // 🔍 Діагностика
//     //     makeAIMove();
//     //   }, 500);
//     // } else {
//     //   // ДОДАЙ ЦЮ ЧАСТИНУ - якщо гравець ходить першим, запускаємо таймер
//     //   if (settings.timerEnabled) {
//     //     console.log('🕒 Запускаємо таймер для гравця (перший хід)');
//     //     timer.startTimer();
//     //   }
//     // }

//     // Визначаємо хто має ходити першим РЕАЛЬНО
//     const actualFirstPlayer = firstPlayer || gameLogic.currentPlayer;
//     const aiSymbol = settings.playerSymbol === PLAYER_SYMBOLS.X ? PLAYER_SYMBOLS.O : PLAYER_SYMBOLS.X;

//     console.log('🎯 Перший хід:', { actualFirstPlayer, aiSymbol, playerSymbol: settings.playerSymbol });

//     // Якщо AI має ходити першим
//     if (settings.gameMode === GAME_MODES.AI && actualFirstPlayer === aiSymbol) {
//       console.log('🎯 AI має ходити першим!');
//       setTimeout(() => {
//         console.log('🎯 Викликаємо makeAIMove...');
//         makeAIMove();
//       }, 500);
//     } else {
//       // Якщо гравець ходить першим, запускаємо таймер
//       if (settings.timerEnabled) {
//         console.log('🕒 Запускаємо таймер для гравця (перший хід)');
//         timer.startTimer();
//       }
//     }
//   }, [gameLogic, timer, ai, settings, makeAIMove]);

//   // // Автоматичний AI хід після ходу гравця
//   // useEffect(() => {
//   //   if (gameLogic.gameActive && 
//   //       gameLogic.gameState === 'playing' && 
//   //       settings.gameMode === GAME_MODES.AI) {
      
//   //     const aiSymbol = settings.playerSymbol === PLAYER_SYMBOLS.X ? PLAYER_SYMBOLS.O : PLAYER_SYMBOLS.X;
      
//   //     if (gameLogic.currentPlayer === aiSymbol && !ai.isThinking) {
//   //       console.log('Автоматичний AI хід після ходу гравця');
        
//   //       // Додаткова затримка щоб уникнути подвійних викликів
//   //       const timeoutId = setTimeout(() => {
//   //         if (gameLogic.currentPlayer === aiSymbol && !ai.isThinking) {
//   //           makeAIMove();
//   //         }
//   //       }, 100); // Зменшив затримку з 500 до 100ms
        
//   //       return () => clearTimeout(timeoutId);
//   //     }
//   //   }
//   // }, [gameLogic.currentPlayer, gameLogic.gameActive, gameLogic.gameState, settings.gameMode, settings.playerSymbol, ai.isThinking, makeAIMove]);

//   // Виконання ходу
//   const makeMove = useCallback(async (index: number): Promise<boolean> => {
//     if (!gameLogic.canMakeMove(index)) {
//       return false;
//     }

//     // В режимі AI перевіряємо, що зараз хід гравця
//     if (settings.gameMode === GAME_MODES.AI && gameLogic.currentPlayer !== settings.playerSymbol) {
//       return false;
//     }

//     // Виконуємо хід
//     const success = gameLogic.makePlayerMove(index);
    
//     if (success && settings.timerEnabled) {
//       timer.resetMoveTimer();
//     }

//     return success;
//   }, [gameLogic, timer, settings]);

//   // Пауза гри
//   const pauseGame = useCallback(() => {
//     gameLogic.pauseGame();
    
//     if (settings.timerEnabled) {
//       timer.pauseTimer();
//     }
    
//     if (ai.isThinking) {
//       ai.cancelAIMove();
//     }
//   }, [gameLogic, timer, ai, settings.timerEnabled]);

//   // Відновлення гри
//   const resumeGame = useCallback(() => {
//     gameLogic.resumeGame();
    
//     if (settings.timerEnabled) {
//       timer.resumeTimer();
//     }

//     // Якщо зараз хід AI, продовжуємо
//     const aiSymbol = settings.playerSymbol === PLAYER_SYMBOLS.X ? PLAYER_SYMBOLS.O : PLAYER_SYMBOLS.X;
//     if (settings.gameMode === GAME_MODES.AI && gameLogic.currentPlayer === aiSymbol) {
//       makeAIMove();
//     }
//   }, [gameLogic, timer, settings, makeAIMove]);

//   // Скидання гри
//   const resetGame = useCallback(() => {
//     gameLogic.resetGame();
    
//     if (settings.timerEnabled) {
//       timer.resetTimer();
//     }
    
//     if (ai.isThinking) {
//       ai.cancelAIMove();
//     }
//   }, [gameLogic, timer, ai, settings.timerEnabled]);

//   // Оновлення налаштувань
//   const updateSettings = useCallback((newSettings: Partial<GameSettings>) => {
//     setSettings(prev => {
//       const updated = { ...prev, ...newSettings };
      
//       // Оновлюємо AI конфігурацію якщо потрібно
//       if (newSettings.aiDifficulty || newSettings.aiThinkingTime || newSettings.playerSymbol) {
//         const newAIConfig: Partial<AIConfig> = {};
        
//         if (newSettings.aiDifficulty) newAIConfig.difficulty = newSettings.aiDifficulty;
//         if (newSettings.aiThinkingTime) newAIConfig.thinkingTime = newSettings.aiThinkingTime;
//         if (newSettings.playerSymbol) {
//           newAIConfig.aiSymbol = newSettings.playerSymbol === PLAYER_SYMBOLS.X ? 
//             PLAYER_SYMBOLS.O : PLAYER_SYMBOLS.X;
//         }
        
//         ai.updateConfig(newAIConfig);
//       }
      
//       return updated;
//     });
//   }, [ai]);

//   // Здача гри
//   const surrenderGame = useCallback(() => {
//     const result: GameResult = settings.gameMode === GAME_MODES.AI ? 'lose' : 'lose';
//     gameLogic.endGame(result, settings.playerSymbol === PLAYER_SYMBOLS.X ? PLAYER_SYMBOLS.O : PLAYER_SYMBOLS.X);
//   }, [gameLogic, settings]);

//   // Аналіз позиції
//   const evaluatePosition = useCallback(() => {
//     return ai.evaluatePosition(gameLogic.board, settings.boardSize);
//   }, [ai, gameLogic.board, settings.boardSize]);

//   // Отримання найкращих ходів
//   const getBestMoves = useCallback((count = 3) => {
//     return ai.getBestMoves(gameLogic.board, settings.boardSize, count);
//   }, [ai, gameLogic.board, settings.boardSize]);

//   // Автозбереження при зміні стану гри
//   useEffect(() => {
//     saveGameState();
//   }, [
//     gameLogic.board,
//     gameLogic.currentPlayer,
//     gameLogic.gameState,
//     timer.timeLeft,
//     saveGameState
//   ]);

//   // Завантаження збереженої гри при монтуванні
// // useEffect(() => {
// //   const savedGame = loadGameState();
  
// //   if (savedGame && savedGame.gameActive) {
// //     console.log('Знайдено збережену гру, відновлюємо...');
    
// //     // Відновити налаштування
// //     setSettings(savedGame.settings);
// //     setSessionStats(savedGame.sessionStats);
    
// //     // Відновити стан гри
// //     // TODO: Додати метод restoreGame в useGameLogic
// //     console.log('Гру відновлено:', savedGame);
    
// //     // ДОДАТИ ЦЮ ЧАСТИНУ:
// //     // Перевірити чи потрібно зробити AI хід після відновлення
// //     const aiSymbol = savedGame.settings.playerSymbol === PLAYER_SYMBOLS.X ? PLAYER_SYMBOLS.O : PLAYER_SYMBOLS.X;
// //     if (savedGame.settings.gameMode === GAME_MODES.AI && 
// //         savedGame.currentPlayer === aiSymbol && 
// //         savedGame.gameState === 'playing') {
// //       // Затримка щоб дати час хукам ініціалізуватися
// //       setTimeout(() => {
// //         console.log('Після відновлення - робимо AI хід');
// //         makeAIMove();
// //       }, 1000);
// //     }
// //   }
// // }, [loadGameState, makeAIMove]); // тільки при монтуванні

//   // Очищення збереження при завершенні гри
//   useEffect(() => {
//     if (gameLogic.gameResult) {
//       // Через 3 секунди після завершення очистити збереження
//       const timeout = setTimeout(() => {
//         clearSavedGame();
//       }, 3000);
      
//       return () => clearTimeout(timeout);
//     }
//   }, [gameLogic.gameResult, clearSavedGame]);

//   // // Ефект для автоматичного запуску таймера при зміні гравця
//   // useEffect(() => {
//   //   if (settings.timerEnabled && gameLogic.gameActive) {
//   //     timer.startTimer();
//   //   }
//   // }, [gameLogic.currentPlayer, gameLogic.gameActive, settings.timerEnabled, timer]);

//   // Ефект для автоматичного запуску таймера при зміні гравця
//   useEffect(() => {
//     if (settings.timerEnabled && gameLogic.gameActive && gameLogic.gameState === 'playing') {
//       // Запускаємо таймер тільки для ходів гравця (не AI)
//       const isPlayerTurn = gameLogic.currentPlayer === settings.playerSymbol;
      
//     //   if (isPlayerTurn) {
//     //     timer.startTimer();
//     //   } else {
//     //     timer.pauseTimer(); // Зупинити таймер для AI ходу
//     //   }
//     // }
//     console.log('🕒 Таймер useEffect:', { 
//       currentPlayer: gameLogic.currentPlayer, 
//       playerSymbol: settings.playerSymbol,
//       isPlayerTurn 
//     });
    
//     if (isPlayerTurn && !timer.isRunning) {
//       console.log('🕒 Запускаємо таймер для гравця');
//       timer.startTimer();
//     } else if (!isPlayerTurn && timer.isRunning) {
//       console.log('🕒 Зупиняємо таймер для AI');
//       timer.pauseTimer();
//     }
//   }
//   }, [gameLogic.currentPlayer, gameLogic.gameActive, gameLogic.gameState, settings.timerEnabled, settings.playerSymbol]);

  

//   return {
//     // Стан гри
//     gameState: gameLogic.gameState,
//     board: gameLogic.board,
//     currentPlayer: gameLogic.currentPlayer,
//     gameActive: gameLogic.gameActive,
//     winningLine: gameLogic.winningLine,
//     gameResult: gameLogic.gameResult,
    
//     // AI стан
//     isAIThinking: ai.isThinking,
//     aiDifficulty: ai.difficulty,
    
//     // Таймер стан
//     timeLeft: timer.timeLeft,
//     isTimerRunning: timer.isRunning,
//     isTimeWarning: timer.isWarning,
//     isTimeUp: timer.isTimeUp,
    
//     // Налаштування
//     settings,
    
//     // Статистика
//     sessionStats,
//     gameStats: gameLogic.getGameStats(),
    
//     // Основні дії
//     startNewGame,
//     makeMove,
//     pauseGame,
//     resumeGame,
//     resetGame,
    
//     // Налаштування
//     updateSettings,
    
//     // Утіліти
//     canMakeMove: gameLogic.canMakeMove,
//     getAvailableMoves: gameLogic.getAvailableMoves,
//     formatTime: timer.formatTime,
//     getTimePercentage: timer.getTimePercentage,
    
//     // Розширені дії
//     undoLastMove: gameLogic.undoLastMove,
//     surrenderGame,
    
//     // Аналіз позиції
//     evaluatePosition,
//     getBestMoves,
    
//     // Збереження гри
//     hasSavedGame: () => {
//       const saved = loadGameState();
//       return saved !== null && saved.gameActive;
//     },
//     clearSavedGame
//   };
// }








































// // hooks/useGameState.ts
// // Виправлена версія з правильним управлінням станом гри
// // ✅ Правильна синхронізація між useGameLogic та useGameState
// // ✅ AI починає хід тільки коли гра дійсно готова
// // ✅ Таймер запускається в правильний момент

// import { useState, useCallback, useEffect, useRef } from 'react';
// import { useGameLogic } from './useGameLogic';
// import { useAI, type AIDifficulty, type AIConfig } from './useAI';
// import { useTimer, type TimerConfig } from './useTimer';

// import type { 
//   GameMode, 
//   Player, 
//   BoardSize, 
//   GameResult,
//   GameState as GameStateType,
//   CellValue
// } from '../types/game';

// import { PLAYER_SYMBOLS, GAME_MODES } from '../constants/game';

// // Налаштування гри
// export interface GameSettings {
//   boardSize: BoardSize;
//   gameMode: GameMode;
//   playerSymbol: Player;
//   aiDifficulty: AIDifficulty;
//   timerEnabled: boolean;
//   timePerMove: number;
//   aiThinkingTime: number;
// }

// // Статистика поточної сесії
// export interface SessionStats {
//   gamesPlayed: number;
//   wins: number;
//   losses: number;
//   draws: number;
//   winRate: number;
//   averageGameTime: number;
//   longestGame: number;
//   shortestGame: number;
// }

// // Збережена гра
// interface PersistedGameState {
//   // Стан гри
//   gameId: string | null;
//   board: CellValue[];
//   currentPlayer: Player;
//   gameActive: boolean;
//   gameState: GameStateType;
//   winningLine: number[];
  
//   // Налаштування
//   settings: GameSettings;
  
//   // Таймер (якщо активний)
//   timeLeft?: number;
//   isTimerRunning?: boolean;
  
//   // Статистика сесії
//   sessionStats: SessionStats;
  
//   // Мета-дані
//   lastSaveTime: number;
//   version: string;
// }

// // Повертаємый інтерфейс
// export interface UseGameStateReturn {
//   // Стан гри (з useGameLogic)
//   gameState: GameStateType;
//   board: CellValue[];
//   currentPlayer: Player;
//   gameActive: boolean;
//   winningLine: number[];
//   gameResult: GameResult;
  
//   // AI стан (з useAI)
//   isAIThinking: boolean;
//   aiDifficulty: AIDifficulty;
  
//   // Таймер стан (з useTimer)
//   timeLeft: number;
//   isTimerRunning: boolean;
//   isTimeWarning: boolean;
//   isTimeUp: boolean;
  
//   // Налаштування
//   settings: GameSettings;
  
//   // Статистика
//   sessionStats: SessionStats;
//   gameStats: {
//     duration: number;
//     moves: number;
//     playerMoves: number;
//     opponentMoves: number;
//   };
  
//   // Основні дії
//   startNewGame: (firstPlayer?: Player) => void;
//   makeMove: (index: number) => Promise<boolean>;
//   pauseGame: () => void;
//   resumeGame: () => void;
//   resetGame: () => void;
  
//   // Налаштування
//   updateSettings: (newSettings: Partial<GameSettings>) => void;
  
//   // Утіліти
//   canMakeMove: (index: number) => boolean;
//   getAvailableMoves: () => number[];
//   formatTime: (seconds: number) => string;
//   getTimePercentage: () => number;
  
//   // Розширені дії
//   undoLastMove: () => boolean;
//   surrenderGame: () => void;
  
//   // Аналіз позиції (для AI режиму)
//   evaluatePosition: () => number;
//   getBestMoves: (count?: number) => number[];
  
//   // Збереження гри
//   hasSavedGame: () => boolean;
//   clearSavedGame: () => void;
// }

// // Опції хука
// interface UseGameStateOptions {
//   initialSettings?: Partial<GameSettings>;
//   onGameEnd?: (result: GameResult, winner?: Player) => void;
//   onStatisticsUpdate?: (stats: SessionStats) => void;
//   persistGame?: boolean;
//   storageKey?: string;
// }

// // Дефолтні налаштування
// const DEFAULT_SETTINGS: GameSettings = {
//   boardSize: 3,
//   gameMode: GAME_MODES.AI,
//   playerSymbol: PLAYER_SYMBOLS.X,
//   aiDifficulty: 'medium',
//   timerEnabled: false,
//   timePerMove: 30,
//   aiThinkingTime: 1000
// };

// const DEFAULT_STATS: SessionStats = {
//   gamesPlayed: 0,
//   wins: 0,
//   losses: 0,
//   draws: 0,
//   winRate: 0,
//   averageGameTime: 0,
//   longestGame: 0,
//   shortestGame: 0
// };

// export function useGameState({
//   initialSettings = {},
//   onGameEnd,
//   onStatisticsUpdate,
//   persistGame = false,
//   storageKey = 'tic-tac-toe-game'
// }: UseGameStateOptions = {}): UseGameStateReturn {

//   // Об'єднуємо дефолтні та початкові налаштування
//   const [settings, setSettings] = useState<GameSettings>({
//     ...DEFAULT_SETTINGS,
//     ...initialSettings
//   });

//   // Статистика сесії
//   const [sessionStats, setSessionStats] = useState<SessionStats>(DEFAULT_STATS);
//   const gameTimesRef = useRef<number[]>([]);

//   // AI конфігурація
//   const aiConfig: AIConfig = {
//     difficulty: settings.aiDifficulty,
//     thinkingTime: settings.aiThinkingTime,
//     aiSymbol: settings.playerSymbol === PLAYER_SYMBOLS.X ? PLAYER_SYMBOLS.O : PLAYER_SYMBOLS.X,
//     randomness: settings.aiDifficulty === 'easy' ? 80 : settings.aiDifficulty === 'medium' ? 10 : 0
//   };

//   // Таймер конфігурація
//   const timerConfig: TimerConfig = {
//     timePerMove: settings.timePerMove,
//     warningThreshold: Math.max(5, Math.floor(settings.timePerMove * 0.2)),
//     autoEndMove: true
//   };

//   // AI хід
//   const makeAIMove = useCallback(async () => {
//     console.log('🎯 makeAIMove викликано!');
    
//     const aiSymbol = settings.playerSymbol === PLAYER_SYMBOLS.X ? PLAYER_SYMBOLS.O : PLAYER_SYMBOLS.X;
    
//     // Додайте затримку для стабілізації стану React
//     await new Promise(resolve => setTimeout(resolve, 50));
    
//     console.log('🎯 Поточний стан (після затримки):', {
//       gameActive: gameLogic.gameActive,
//       gameState: gameLogic.gameState,
//       currentPlayer: gameLogic.currentPlayer,
//       aiSymbol,
//       isAIThinking: ai.isThinking
//     });
    
//     // Перевірка 1: Гра активна і в правільному стані?
//     if (!gameLogic.gameActive || gameLogic.gameState !== 'playing') {
//       console.log('❌ Гра не готова:', { 
//         gameActive: gameLogic.gameActive, 
//         gameState: gameLogic.gameState 
//       });
//       return;
//     }
    
//     // Перевірка 2: Чий хід?
//     if (gameLogic.currentPlayer !== aiSymbol) {
//       console.log('❌ Зараз не хід AI. Поточний гравець:', gameLogic.currentPlayer, 'AI символ:', aiSymbol);
//       return;
//     }

//     // Перевірка 3: AI вже думає?
//     if (ai.isThinking) {
//       console.log('❌ AI вже думає');
//       return;
//     }
  
//     console.log('✅ Запускаємо AI хід...');
  
//     try {
//       const moveIndex = await ai.makeAIMove(gameLogic.board, settings.boardSize);
      
//       if (moveIndex !== -1) {
//         console.log('🎯 AI робить хід на позицію:', moveIndex);
//         const success = gameLogic.makePlayerMove(moveIndex);
//         console.log('🎯 Хід AI успішний:', success, 'Новий currentPlayer:', gameLogic.currentPlayer);
//       }

//     } catch (error) {
//       console.error('Помилка AI ходу:', error);
//     }
//   }, [settings.playerSymbol, settings.boardSize]);

//   // Ініціалізуємо хуки
//   const gameLogic = useGameLogic({
//     boardSize: settings.boardSize,
//     playerSymbol: settings.playerSymbol,
//     onGameEnd: (result: GameResult, winner?: Player) => {
//       console.log('🏁 Гра закінчена:', result, winner);
      
//       // Оновлюємо статистику
//       const gameTime = gameLogic.getGameStats().duration;
//       gameTimesRef.current.push(gameTime);
      
//       setSessionStats(prev => {
//         const newStats = {
//           ...prev,
//           gamesPlayed: prev.gamesPlayed + 1,
//           wins: result === 'win' ? prev.wins + 1 : prev.wins,
//           losses: result === 'lose' ? prev.losses + 1 : prev.losses,
//           draws: result === 'draw' ? prev.draws + 1 : prev.draws
//         };

//         // Обчислюємо додаткову статистику
//         newStats.winRate = newStats.gamesPlayed > 0 ? 
//           (newStats.wins / newStats.gamesPlayed) * 100 : 0;
        
//         const times = gameTimesRef.current;
//         newStats.averageGameTime = times.length > 0 ? 
//           times.reduce((sum, time) => sum + time, 0) / times.length : 0;
        
//         newStats.longestGame = times.length > 0 ? Math.max(...times) : 0;
//         newStats.shortestGame = times.length > 0 ? Math.min(...times) : 0;

//         // Викликаємо callback оновлення статистики
//         onStatisticsUpdate?.(newStats);
        
//         return newStats;
//       });
      
//       // Зупиняємо таймер
//       if (settings.timerEnabled) {
//         timer.pauseTimer();
//       }

//       // Викликаємо зовнішній callback
//       onGameEnd?.(result, winner);
//     },
//     onMoveComplete: (board: CellValue[], nextPlayer: Player) => {
//       console.log('🎯 onMoveComplete викликано! nextPlayer:', nextPlayer);
      
//       // Скидаємо таймер для наступного ходу
//       if (settings.timerEnabled) {
//         timer.resetMoveTimer();
//       }
//     }
//   });

//   const ai = useAI({
//     config: aiConfig,
//     onMoveCalculated: (moveIndex, evaluation) => {
//       console.log(`🎯 AI обрав хід ${moveIndex} з оцінкою ${evaluation}`);
//     }
//   });

//   const timer = useTimer({
//     config: timerConfig,
//     onTimeUp: () => {
//       if (!gameLogic.gameActive || gameLogic.gameState !== 'playing') return;
//       console.log('⏰ Час на хід закінчився!');
      
//       timer.pauseTimer();

//       // Уникаємо повторних викликів
//       if (timer.timeLeft <= 0) return;
      
//       if (settings.gameMode === GAME_MODES.AI && gameLogic.currentPlayer === settings.playerSymbol) {
//         // Гравець не встиг зробити хід - автоматично передаємо хід AI
//         // AI хід буде запущено через useEffect
//       } else if (settings.gameMode === GAME_MODES.PVP) {
//         // В PvP режимі передаємо хід іншому гравцю
//       }
//     },
//     onWarning: () => {
//       console.log('⚠️ Попередження: час майже закінчився!');
//     }
//   });

//   // Функції збереження/завантаження гри
//   const loadGameState = useCallback((): PersistedGameState | null => {
//     if (!persistGame) return null;
    
//     try {
//       const saved = localStorage.getItem(storageKey);
//       if (!saved) return null;
      
//       const parsedState = JSON.parse(saved) as PersistedGameState;
      
//       // Перевірити версію
//       if (!parsedState.version || parsedState.version !== '1.0.0') {
//         console.warn('Несумісна версія збереженої гри');
//         return null;
//       }
      
//       // Перевірити чи не застара гра (24 години)
//       const maxAge = 24 * 60 * 60 * 1000;
//       if (Date.now() - parsedState.lastSaveTime > maxAge) {
//         console.info('Збережена гра застаріла');
//         localStorage.removeItem(storageKey);
//         return null;
//       }
      
//       return parsedState;
//     } catch (error) {
//       console.error('Помилка завантаження гри:', error);
//       return null;
//     }
//   }, [persistGame, storageKey]);

//   const clearSavedGame = useCallback(() => {
//     if (persistGame) {
//       localStorage.removeItem(storageKey);
//     }
//   }, [persistGame, storageKey]);

//   // Функція збереження стану
//   const saveGameState = useCallback(() => {
//     if (!persistGame || !gameLogic.gameActive) return;
    
//     const gameStateToSave: PersistedGameState = {
//       gameId: gameLogic.gameId,
//       board: gameLogic.board,
//       currentPlayer: gameLogic.currentPlayer,
//       gameActive: gameLogic.gameActive,
//       gameState: gameLogic.gameState,
//       winningLine: gameLogic.winningLine,
      
//       settings,
      
//       timeLeft: timer.timeLeft,
//       isTimerRunning: timer.isRunning,
      
//       sessionStats,
      
//       lastSaveTime: Date.now(),
//       version: '1.0.0'
//     };
    
//     try {
//       localStorage.setItem(storageKey, JSON.stringify(gameStateToSave));
//     } catch (error) {
//       console.error('Помилка збереження гри:', error);
//     }
//   }, [persistGame, gameLogic.gameActive, gameLogic.gameId, gameLogic.board, gameLogic.currentPlayer, gameLogic.gameState, gameLogic.winningLine, settings, timer.timeLeft, timer.isRunning, sessionStats, storageKey]);

//   // Початок нової гри
//   const startNewGame = useCallback((firstPlayer?: Player) => {
//     console.log('🎯 Початок нової гри з firstPlayer:', firstPlayer);
    
//     // Скидаємо логіку гри
//     gameLogic.initializeGame(firstPlayer);
    
//     // Скидаємо таймер
//     if (settings.timerEnabled) {
//       timer.resetTimer();
//     }
    
//     // Скасовуємо AI якщо думає
//     if (ai.isThinking) {
//       ai.cancelAIMove();
//     }
//   }, [gameLogic, timer, ai, settings]);

//   // Виконання ходу
//   const makeMove = useCallback(async (index: number): Promise<boolean> => {
//     if (!gameLogic.canMakeMove(index)) {
//       return false;
//     }

//     // В режимі AI перевіряємо, що зараз хід гравця
//     if (settings.gameMode === GAME_MODES.AI && gameLogic.currentPlayer !== settings.playerSymbol) {
//       return false;
//     }

//     // Виконуємо хід
//     const success = gameLogic.makePlayerMove(index);
    
//     if (success && settings.timerEnabled) {
//       timer.resetMoveTimer();
//     }

//     return success;
//   }, [gameLogic, timer, settings]);

//   // Пауза гри
//   const pauseGame = useCallback(() => {
//     gameLogic.pauseGame();
    
//     if (settings.timerEnabled) {
//       timer.pauseTimer();
//     }
    
//     if (ai.isThinking) {
//       ai.cancelAIMove();
//     }
//   }, [gameLogic, timer, ai, settings.timerEnabled]);

//   // Відновлення гри
//   const resumeGame = useCallback(() => {
//     gameLogic.resumeGame();
    
//     if (settings.timerEnabled) {
//       timer.resumeTimer();
//     }
//   }, [gameLogic, timer, settings]);

//   // Скидання гри
//   const resetGame = useCallback(() => {
//     gameLogic.resetGame();
    
//     if (settings.timerEnabled) {
//       timer.resetTimer();
//     }
    
//     if (ai.isThinking) {
//       ai.cancelAIMove();
//     }
//   }, [gameLogic, timer, ai, settings.timerEnabled]);

//   // Оновлення налаштувань
//   const updateSettings = useCallback((newSettings: Partial<GameSettings>) => {
//     setSettings(prev => {
//       const updated = { ...prev, ...newSettings };
      
//       // Оновлюємо AI конфігурацію якщо потрібно
//       if (newSettings.aiDifficulty || newSettings.aiThinkingTime || newSettings.playerSymbol) {
//         const newAIConfig: Partial<AIConfig> = {};
        
//         if (newSettings.aiDifficulty) newAIConfig.difficulty = newSettings.aiDifficulty;
//         if (newSettings.aiThinkingTime) newAIConfig.thinkingTime = newSettings.aiThinkingTime;
//         if (newSettings.playerSymbol) {
//           newAIConfig.aiSymbol = newSettings.playerSymbol === PLAYER_SYMBOLS.X ? 
//             PLAYER_SYMBOLS.O : PLAYER_SYMBOLS.X;
//         }
        
//         ai.updateConfig(newAIConfig);
//       }
      
//       return updated;
//     });
//   }, [ai]);

//   // Здача гри
//   const surrenderGame = useCallback(() => {
//     const result: GameResult = settings.gameMode === GAME_MODES.AI ? 'lose' : 'lose';
//     gameLogic.endGame(result, settings.playerSymbol === PLAYER_SYMBOLS.X ? PLAYER_SYMBOLS.O : PLAYER_SYMBOLS.X);
//   }, [gameLogic, settings]);

//   // Аналіз позиції
//   const evaluatePosition = useCallback(() => {
//     return ai.evaluatePosition(gameLogic.board, settings.boardSize);
//   }, [ai, gameLogic.board, settings.boardSize]);

//   // Отримання найкращих ходів
//   const getBestMoves = useCallback((count = 3) => {
//     return ai.getBestMoves(gameLogic.board, settings.boardSize, count);
//   }, [ai, gameLogic.board, settings.boardSize]);

//   // Автоматичний AI хід після ходу гравця
//   useEffect(() => {
//     console.log('🤖 AI useEffect перевірка:', {
//       gameActive: gameLogic.gameActive,
//       gameState: gameLogic.gameState,
//       gameMode: settings.gameMode,
//       currentPlayer: gameLogic.currentPlayer,
//       playerSymbol: settings.playerSymbol,
//       aiSymbol: settings.playerSymbol === PLAYER_SYMBOLS.X ? PLAYER_SYMBOLS.O : PLAYER_SYMBOLS.X,
//       aiIsThinking: ai.isThinking
//     });

//     if (gameLogic.gameActive && 
//         gameLogic.gameState === 'playing' && 
//         settings.gameMode === GAME_MODES.AI) {
      
//       const aiSymbol = settings.playerSymbol === PLAYER_SYMBOLS.X ? PLAYER_SYMBOLS.O : PLAYER_SYMBOLS.X;
      
//       console.log('🤖 AI умови виконані, перевіряємо чи хід AI:', {
//         currentPlayer: gameLogic.currentPlayer,
//         aiSymbol,
//         isAITurn: gameLogic.currentPlayer === aiSymbol,
//         aiIsThinking: ai.isThinking
//       });
      
//       if (gameLogic.currentPlayer === aiSymbol && !ai.isThinking) {
//         console.log('✅ Запускаємо автоматичний AI хід');
        
//         // Додаткова затримка щоб уникнути подвійних викликів
//         const timeoutId = setTimeout(() => {
//           console.log('🤖 Timeout спрацював, перевіряємо ще раз:', {
//             currentPlayer: gameLogic.currentPlayer,
//             aiSymbol,
//             aiIsThinking: ai.isThinking
//           });
//           if (gameLogic.currentPlayer === aiSymbol && !ai.isThinking) {
//             makeAIMove();
//           }
//         }, 100);
        
//         return () => clearTimeout(timeoutId);
//       }
//     }
//   }, [gameLogic.currentPlayer, gameLogic.gameActive, gameLogic.gameState, settings.gameMode, settings.playerSymbol, ai.isThinking, makeAIMove]);

//   // Ефект для автоматичного управління таймером
//   useEffect(() => {
//     if (settings.timerEnabled && 
//         gameLogic.gameActive && 
//         gameLogic.gameState === 'playing') {
      
//       const isPlayerTurn = gameLogic.currentPlayer === settings.playerSymbol;
      
//       console.log('🕒 Таймер useEffect:', { 
//         currentPlayer: gameLogic.currentPlayer, 
//         playerSymbol: settings.playerSymbol,
//         isPlayerTurn
//       });
      
//       if (isPlayerTurn && !timer.isRunning) {
//         console.log('🕒 Запускаємо таймер для гравця');
//         timer.startTimer();
//       } else if (!isPlayerTurn && timer.isRunning) {
//         console.log('🕒 Зупиняємо таймер для AI');
//         timer.pauseTimer();
//       }
//     }
//   }, [
//     gameLogic.currentPlayer, 
//     gameLogic.gameActive, 
//     gameLogic.gameState, 
//     settings.timerEnabled, 
//     settings.playerSymbol,
//     timer
//   ]);

//   // Автозбереження при зміні стану гри
//   useEffect(() => {
//     saveGameState();
//   }, [
//     gameLogic.board,
//     gameLogic.currentPlayer,
//     gameLogic.gameState,
//     timer.timeLeft,
//     saveGameState
//   ]);

//   // Очищення збереження при завершенні гри
//   useEffect(() => {
//     if (gameLogic.gameResult) {
//       // Через 3 секунди після завершення очистити збереження
//       const timeout = setTimeout(() => {
//         clearSavedGame();
//       }, 3000);
      
//       return () => clearTimeout(timeout);
//     }
//   }, [gameLogic.gameResult, clearSavedGame]);

//   return {
//     // Стан гри
//     gameState: gameLogic.gameState,
//     board: gameLogic.board,
//     currentPlayer: gameLogic.currentPlayer,
//     gameActive: gameLogic.gameActive,
//     winningLine: gameLogic.winningLine,
//     gameResult: gameLogic.gameResult,
    
//     // AI стан
//     isAIThinking: ai.isThinking,
//     aiDifficulty: ai.difficulty,
    
//     // Таймер стан
//     timeLeft: timer.timeLeft,
//     isTimerRunning: timer.isRunning,
//     isTimeWarning: timer.isWarning,
//     isTimeUp: timer.isTimeUp,
    
//     // Налаштування
//     settings,
    
//     // Статистика
//     sessionStats,
//     gameStats: gameLogic.getGameStats(),
    
//     // Основні дії
//     startNewGame,
//     makeMove,
//     pauseGame,
//     resumeGame,
//     resetGame,
    
//     // Налаштування
//     updateSettings,
    
//     // Утіліти
//     canMakeMove: gameLogic.canMakeMove,
//     getAvailableMoves: gameLogic.getAvailableMoves,
//     formatTime: timer.formatTime,
//     getTimePercentage: timer.getTimePercentage,
    
//     // Розширені дії
//     undoLastMove: gameLogic.undoLastMove,
//     surrenderGame,
    
//     // Аналіз позиції
//     evaluatePosition,
//     getBestMoves,
    
//     // Збереження гри
//     hasSavedGame: () => {
//       const saved = loadGameState();
//       return saved !== null && saved.gameActive;
//     },
//     clearSavedGame
//   };
// }









// //last1// hooks/useGameState.ts
// // Головний хук для управління станом гри
// // ✅ Використовує справжні хуки: useGameLogic, useAI, useTimer
// // ✅ Об'єднує всю логіку гри в одному місці
// // ✅ Підтримує AI, PvP та майбутні режими

// import { useState, useCallback, useEffect, useRef } from 'react';
// import { useGameLogic } from './useGameLogic';
// import { useAI, type AIDifficulty, type AIConfig } from './useAI';
// import { useTimer, type TimerConfig } from './useTimer';

// import type { 
//   GameMode, 
//   Player, 
//   BoardSize, 
//   GameResult,
//   GameState as GameStateType,
//   CellValue
// } from '../types/game';

// import { PLAYER_SYMBOLS, GAME_MODES } from '../constants/game';
// import { getOppositePlayer } from '../utils/gameUtils'; 

// // Налаштування гри
// export interface GameSettings {
//   boardSize: BoardSize;
//   gameMode: GameMode;
//   playerSymbol: Player;
//   aiDifficulty: AIDifficulty;
//   timerEnabled: boolean;
//   timePerMove: number;
//   aiThinkingTime: number;
// }

// // Статистика поточної сесії
// export interface SessionStats {
//   gamesPlayed: number;
//   wins: number;
//   losses: number;
//   draws: number;
//   winRate: number;
//   averageGameTime: number;
//   longestGame: number;
//   shortestGame: number;
// }

// // Повертаємий інтерфейс
// export interface UseGameStateReturn {
//   // Стан гри (з useGameLogic)
//   gameState: GameStateType;
//   board: CellValue[];
//   currentPlayer: Player;
//   gameActive: boolean;
//   winningLine: number[];
//   gameResult: GameResult;
  
//   // AI стан (з useAI)
//   isAIThinking: boolean;
//   aiDifficulty: AIDifficulty;
  
//   // Таймер стан (з useTimer)
//   timeLeft: number;
//   isTimerRunning: boolean;
//   isTimeWarning: boolean;
//   isTimeUp: boolean;
  
//   // Налаштування
//   settings: GameSettings;
  
//   // Статистика
//   sessionStats: SessionStats;
//   gameStats: {
//     duration: number;
//     moves: number;
//     playerMoves: number;
//     opponentMoves: number;
//   };
  
//   // Основні дії
//   startNewGame: (firstPlayer?: Player) => void; 
//   makeMove: (index: number) => Promise<boolean>;
//   pauseGame: () => void;
//   resumeGame: () => void;
//   resetGame: () => void;
  
//   // Налаштування
//   updateSettings: (newSettings: Partial<GameSettings>) => void;
  
//   // Утіліти
//   canMakeMove: (index: number) => boolean;
//   getAvailableMoves: () => number[];
//   formatTime: (seconds: number) => string;
//   getTimePercentage: () => number;
  
//   // Розширені дії
//   undoLastMove: () => boolean;
//   surrenderGame: () => void;
  
//   // Аналіз позиції (для AI режиму)
//   evaluatePosition: () => number;
//   getBestMoves: (count?: number) => number[];
// }

// // Опції хука
// interface UseGameStateOptions {
//   initialSettings?: Partial<GameSettings>;
//   onGameEnd?: (result: GameResult, winner?: Player) => void;
//   onStatisticsUpdate?: (stats: SessionStats) => void;
//   persistStats?: boolean;
// }

// // Дефолтні налаштування
// const DEFAULT_SETTINGS: GameSettings = {
//   boardSize: 3,
//   gameMode: GAME_MODES.AI,
//   playerSymbol: PLAYER_SYMBOLS.X,
//   aiDifficulty: 'medium',
//   timerEnabled: false,
//   timePerMove: 30,
//   aiThinkingTime: 1000
// };

// const DEFAULT_STATS: SessionStats = {
//   gamesPlayed: 0,
//   wins: 0,
//   losses: 0,
//   draws: 0,
//   winRate: 0,
//   averageGameTime: 0,
//   longestGame: 0,
//   shortestGame: 0
// };

// export function useGameState({
//   initialSettings = {},
//   onGameEnd,
//   onStatisticsUpdate,
// }: UseGameStateOptions = {}): UseGameStateReturn {

//   // Об'єднуємо дефолтні та початкові налаштування
//   const [settings, setSettings] = useState<GameSettings>({
//     ...DEFAULT_SETTINGS,
//     ...initialSettings
//   });

//   // Статистика сесії
//   const [sessionStats, setSessionStats] = useState<SessionStats>(DEFAULT_STATS);
//   const gameTimesRef = useRef<number[]>([]);

//   // AI конфігурація
//   const aiConfig: AIConfig = {
//     difficulty: settings.aiDifficulty,
//     thinkingTime: settings.aiThinkingTime,
//     aiSymbol: settings.playerSymbol === PLAYER_SYMBOLS.X ? PLAYER_SYMBOLS.O : PLAYER_SYMBOLS.X,
//     randomness: settings.aiDifficulty === 'easy' ? 80 : settings.aiDifficulty === 'medium' ? 20 : 5
//   };

//   // Таймер конфігурація
//   const timerConfig: TimerConfig = {
//     timePerMove: settings.timePerMove,
//     warningThreshold: Math.max(5, Math.floor(settings.timePerMove * 0.2)),
//     autoEndMove: true
//   };

//   // Ініціалізуємо хуки
//   const gameLogic = useGameLogic({
//     boardSize: settings.boardSize,
//     playerSymbol: settings.playerSymbol,
//     onGameEnd: handleGameEnd,
//     onMoveComplete: handleMoveComplete
//   });

//   const ai = useAI({
//     config: aiConfig,
//     onMoveCalculated: (moveIndex, evaluation) => {
//       console.log(`AI обрав хід ${moveIndex} з оцінкою ${evaluation}`);
//     }
//   });

//   const timer = useTimer({
//     config: timerConfig,
//     onTimeUp: handleTimeUp,
//     onWarning: () => {
//       console.log('Попередження: час майже закінчився!');
//     }
//   });

//   // Обробники подій
//   function handleGameEnd(result: GameResult, winner?: Player) {
//     // Оновлюємо статистику
//     updateSessionStats(result);
    
//     // Зупиняємо таймер
//     if (settings.timerEnabled) {
//       timer.pauseTimer();
//     }
    
//     // Зупиняємо AI якщо думає
//     if (ai.isThinking) {
//       ai.cancelAIMove();
//     }

//     // Викликаємо зовнішній callback
//     onGameEnd?.(result, winner);
//   }

//   function handleMoveComplete(board: CellValue[], nextPlayer: Player) {
//     console.log('🔄 handleMoveComplete викликано:', { nextPlayer, gameMode: settings.gameMode });
//     // Скидаємо таймер для наступного ходу
//     if (settings.timerEnabled) {
//       timer.resetMoveTimer();
//     }

//     // Не викликаємо AI тут, тому що useEffect буде обробляти це
//   }

//   function handleTimeUp() {
//     console.log('⏰ Час на хід закінчився! Завершуємо гру');
    
//     // Зупиняємо таймер
//     timer.pauseTimer();
    
//     // Завершуємо гру з результатом "програш по часу"
//     if (settings.gameMode === GAME_MODES.AI) {
//       // Якщо час гравця закінчився - гравець програв
//       const result: GameResult = gameLogic.currentPlayer === settings.playerSymbol ? 'lose' : 'win';
//       const winner = gameLogic.currentPlayer === settings.playerSymbol ? 
//         (settings.playerSymbol === PLAYER_SYMBOLS.X ? PLAYER_SYMBOLS.O : PLAYER_SYMBOLS.X) :
//         settings.playerSymbol;
      
//       gameLogic.endGame(result, winner);
//     } else if (settings.gameMode === GAME_MODES.PVP) {
//       // В PvP режимі поточний гравець програє
//       gameLogic.endGame('lose', getOppositePlayer(gameLogic.currentPlayer));
//     }
//   }

//   // Оновлення статистики
//   const updateSessionStats = useCallback((result: GameResult) => {
//     const gameTime = gameLogic.getGameStats().duration;
//     gameTimesRef.current.push(gameTime);
    
//     setSessionStats(prev => {
//       const newStats = {
//         ...prev,
//         gamesPlayed: prev.gamesPlayed + 1,
//         wins: result === 'win' ? prev.wins + 1 : prev.wins,
//         losses: result === 'lose' ? prev.losses + 1 : prev.losses,
//         draws: result === 'draw' ? prev.draws + 1 : prev.draws
//       };

//       // Обчислюємо додаткову статистику
//       newStats.winRate = newStats.gamesPlayed > 0 ? 
//         (newStats.wins / newStats.gamesPlayed) * 100 : 0;
      
//       const times = gameTimesRef.current;
//       newStats.averageGameTime = times.length > 0 ? 
//         times.reduce((sum, time) => sum + time, 0) / times.length : 0;
      
//       newStats.longestGame = times.length > 0 ? Math.max(...times) : 0;
//       newStats.shortestGame = times.length > 0 ? Math.min(...times) : 0;

//       // Викликаємо callback оновлення статистики
//       onStatisticsUpdate?.(newStats);
      
//       return newStats;
//     });
//   }, [gameLogic, onStatisticsUpdate]);

//   // AI хід з конкретним гравцем (нова функція)
//   const makeAIMoveForPlayer = useCallback(async (player: Player) => {
//     const aiSymbol = settings.playerSymbol === PLAYER_SYMBOLS.X ? PLAYER_SYMBOLS.O : PLAYER_SYMBOLS.X;
    
//     console.log('🤖 makeAIMoveForPlayer ДЕТАЛЬНИЙ ЛОГ:', {
//       gameActive: gameLogic.gameActive,
//       requestedPlayer: player,
//       currentPlayer: gameLogic.currentPlayer,
//       playerSymbol: settings.playerSymbol,
//       calculatedAISymbol: aiSymbol,
//       playersMatch: player === aiSymbol,
//       currentMatch: player === gameLogic.currentPlayer,
//       shouldAIMove: player === aiSymbol && player === gameLogic.currentPlayer && gameLogic.gameActive
//     });
    
//     if (!gameLogic.gameActive || player !== aiSymbol || player !== gameLogic.currentPlayer) {
//       console.log('❌ AI не може зробити хід - умови не виконані:', {
//         gameActive: gameLogic.gameActive,
//         playerMatch: player === aiSymbol,
//         currentMatch: player === gameLogic.currentPlayer
//       });
//       return;
//     }

//     console.log('🎯 AI починає розрахунок ходу');
//     try {
//       const moveIndex = await ai.makeAIMove(gameLogic.board, settings.boardSize);
//       console.log('🎲 AI розрахував хід:', moveIndex);
//       console.log('🎲 Стан дошки перед AI ходом:', gameLogic.board);
      
//       if (moveIndex !== -1 && gameLogic.canMakeMove(moveIndex)) {
//         console.log('✅ Виконуємо AI хід');
//         const success = gameLogic.makePlayerMoveWithSymbol(moveIndex, aiSymbol);
//         if (!success) {
//           console.error('❌ AI хід не вдався, спробуємо знайти альтернативу');
//           // Знаходимо перший доступний хід як запасний варіант
//           const availableMoves = gameLogic.getAvailableMoves();
//           if (availableMoves.length > 0) {
//             gameLogic.makePlayerMoveWithSymbol(availableMoves[0], aiSymbol);
//           }
//         }
//       } else {
//         console.log('❌ AI хід недійсний або неможливий:', moveIndex);
//         // Знаходимо перший доступний хід
//         const availableMoves = gameLogic.getAvailableMoves();
//         if (availableMoves.length > 0) {
//           console.log('🔄 Використовуємо запасний хід:', availableMoves[0]);
//           gameLogic.makePlayerMoveWithSymbol(availableMoves[0], aiSymbol);
//         }
//       }
//     } catch (error) {
//       console.error('🔥 Помилка AI ходу:', error);
//     }
//   }, [gameLogic, ai, settings.playerSymbol, settings.boardSize]);

//   // Початок нової гри
//   const startNewGame = useCallback((firstPlayer?: Player) => {
//     console.log('🚀 startNewGame викликано з firstPlayer:', firstPlayer);
  
//     // Визначаємо хто ходить першим
//     const startingPlayer = firstPlayer || settings.playerSymbol;

//     // Скидаємо логіку гри
//     gameLogic.initializeGame(startingPlayer); 
    
//     // Скидаємо таймер
//     if (settings.timerEnabled) {
//       timer.resetTimer();
//       timer.startTimer();
//     }
    
//     // Скасовуємо AI якщо думає
//     if (ai.isThinking) {
//       ai.cancelAIMove();
//     }

//     // Не викликаємо AI тут - useEffect буде обробляти це
//   }, [gameLogic, timer, ai, settings]);

//   // Виконання ходу
//   const makeMove = useCallback(async (index: number): Promise<boolean> => {
//     if (!gameLogic.canMakeMove(index)) {
//       return false;
//     }

//     // В режимі AI перевіряємо, що зараз хід гравця
//     if (settings.gameMode === GAME_MODES.AI && gameLogic.currentPlayer !== settings.playerSymbol) {
//       return false;
//     }

//     // Виконуємо хід
//     const success = gameLogic.makePlayerMove(index);
    
//     if (success && settings.timerEnabled) {
//       timer.resetMoveTimer();
//     }

//     return success;
//   }, [gameLogic, timer, settings]);

//   // Пауза гри
//   const pauseGame = useCallback(() => {
//     gameLogic.pauseGame();
    
//     if (settings.timerEnabled) {
//       timer.pauseTimer();
//     }
    
//     if (ai.isThinking) {
//       ai.cancelAIMove();
//     }
//   }, [gameLogic, timer, ai, settings.timerEnabled]);

//   // Відновлення гри
//   const resumeGame = useCallback(() => {
//     gameLogic.resumeGame();
    
//     if (settings.timerEnabled) {
//       timer.resumeTimer();
//     }

//     // useEffect буде обробляти AI хід при відновленні
//   }, [gameLogic, timer, settings]);

//   // Скидання гри
//   const resetGame = useCallback(() => {
//     gameLogic.resetGame();
    
//     if (settings.timerEnabled) {
//       timer.resetTimer();
//     }
    
//     if (ai.isThinking) {
//       ai.cancelAIMove();
//     }
//   }, [gameLogic, timer, ai, settings.timerEnabled]);

//   // Оновлення налаштувань
//   const updateSettings = useCallback((newSettings: Partial<GameSettings>) => {
//     setSettings(prev => {
//       const updated = { ...prev, ...newSettings };
      
//       // Оновлюємо AI конфігурацію якщо потрібно
//       if (newSettings.aiDifficulty || newSettings.aiThinkingTime || newSettings.playerSymbol) {
//         const newAIConfig: Partial<AIConfig> = {};
        
//         if (newSettings.aiDifficulty) newAIConfig.difficulty = newSettings.aiDifficulty;
//         if (newSettings.aiThinkingTime) newAIConfig.thinkingTime = newSettings.aiThinkingTime;
//         if (newSettings.playerSymbol) {
//           newAIConfig.aiSymbol = newSettings.playerSymbol === PLAYER_SYMBOLS.X ? 
//             PLAYER_SYMBOLS.O : PLAYER_SYMBOLS.X;
//         }
        
//         ai.updateConfig(newAIConfig);
//       }
      
//       return updated;
//     });
//   }, [ai]);

//   // Здача гри
//   const surrenderGame = useCallback(() => {
//     const result: GameResult = settings.gameMode === GAME_MODES.AI ? 'lose' : 'lose';
//     gameLogic.endGame(result, settings.playerSymbol === PLAYER_SYMBOLS.X ? PLAYER_SYMBOLS.O : PLAYER_SYMBOLS.X);
//   }, [gameLogic, settings]);

//   // Аналіз позиції
//   const evaluatePosition = useCallback(() => {
//     return ai.evaluatePosition(gameLogic.board, settings.boardSize);
//   }, [ai, gameLogic.board, settings.boardSize]);

//   // Отримання найкращих ходів
//   const getBestMoves = useCallback((count = 3) => {
//     return ai.getBestMoves(gameLogic.board, settings.boardSize, count);
//   }, [ai, gameLogic.board, settings.boardSize]);

//   // Ефект для автоматичного запуску таймера при зміні гравця
//   // useEffect(() => {
//   //   if (settings.timerEnabled && gameLogic.gameActive) {
//   //     timer.startTimer();
//   //   }
//   // }, [gameLogic.currentPlayer, gameLogic.gameActive, settings.timerEnabled, timer]);
//   // ВИПРАВЛЕНИЙ КОД
//   useEffect(() => {
//     if (settings.timerEnabled && gameLogic.gameActive && !timer.isRunning) {
//       timer.startTimer(); // ✅ Запускається тільки ОДИН раз при початку гри
//     }
//   }, [gameLogic.gameActive, settings.timerEnabled]);



//   // Ефект для автоматичного AI ходу
//   // useEffect(() => {
//   //   const aiSymbol = settings.playerSymbol === PLAYER_SYMBOLS.X ? PLAYER_SYMBOLS.O : PLAYER_SYMBOLS.X;
    
//   //   console.log('🔍 useEffect AI ДЕТАЛЬНА перевірка:', {
//   //     gameMode: settings.gameMode,
//   //     gameActive: gameLogic.gameActive,
//   //     currentPlayer: gameLogic.currentPlayer,
//   //     playerSymbol: settings.playerSymbol,
//   //     calculatedAISymbol: aiSymbol,
//   //     isAIThinking: ai.isThinking,
//   //     shouldMakeAIMove: settings.gameMode === GAME_MODES.AI && 
//   //                      gameLogic.gameActive && 
//   //                      gameLogic.currentPlayer === aiSymbol &&
//   //                      !ai.isThinking
//   //   });

//   //   if (settings.gameMode === GAME_MODES.AI && 
//   //       gameLogic.gameActive && 
//   //       gameLogic.currentPlayer === aiSymbol &&
//   //       !ai.isThinking) {
      
//   //     console.log('🤖 useEffect запускає AI хід');
//   //     console.log('🤖 Стан дошки перед AI ходом:', gameLogic.board);
//   //     // Невелика затримка для UI
//   //     const timeoutId = setTimeout(() => {
//   //       makeAIMoveForPlayer(aiSymbol);
//   //     }, 300);
      
//   //     return () => clearTimeout(timeoutId);
//   //   }
//   // }, [gameLogic.gameActive, gameLogic.currentPlayer, settings.gameMode, settings.playerSymbol, ai.isThinking, makeAIMoveForPlayer, gameLogic.board]); //gameLogic.board
//   useEffect(() => {
//     const aiSymbol = settings.playerSymbol === PLAYER_SYMBOLS.X ? PLAYER_SYMBOLS.O : PLAYER_SYMBOLS.X;
    
//     console.log('🔍 useEffect AI перевірка:', {
//       gameMode: settings.gameMode,
//       gameActive: gameLogic.gameActive,
//       currentPlayer: gameLogic.currentPlayer,
//       isAIPlayer: gameLogic.currentPlayer === aiSymbol,
//       isAIThinking: ai.isThinking
//     });
  
//     // 🔥 ВИДАЛИЛИ timer.startTimer() звідси
//     if (settings.gameMode === GAME_MODES.AI && 
//         gameLogic.gameActive && 
//         gameLogic.currentPlayer === aiSymbol &&
//         !ai.isThinking) {
      
//       console.log('🤖 Запускаємо AI хід');
//       makeAIMoveForPlayer(aiSymbol);
//     }
//   }, [gameLogic.gameActive, gameLogic.currentPlayer, settings.gameMode, settings.playerSymbol, ai.isThinking, makeAIMoveForPlayer]);

//   return {
//     // Стан гри
//     gameState: gameLogic.gameState,
//     board: gameLogic.board,
//     currentPlayer: gameLogic.currentPlayer,
//     gameActive: gameLogic.gameActive,
//     winningLine: gameLogic.winningLine,
//     gameResult: gameLogic.gameResult,
    
//     // AI стан
//     isAIThinking: ai.isThinking,
//     aiDifficulty: ai.difficulty,
    
//     // Таймер стан
//     timeLeft: timer.timeLeft,
//     isTimerRunning: timer.isRunning,
//     isTimeWarning: timer.isWarning,
//     isTimeUp: timer.isTimeUp,
    
//     // Налаштування
//     settings,
    
//     // Статистика
//     sessionStats,
//     gameStats: gameLogic.getGameStats(),
    
//     // Основні дії
//     startNewGame,
//     makeMove,
//     pauseGame,
//     resumeGame,
//     resetGame,
    
//     // Налаштування
//     updateSettings,
    
//     // Утіліти
//     canMakeMove: gameLogic.canMakeMove,
//     getAvailableMoves: gameLogic.getAvailableMoves,
//     formatTime: timer.formatTime,
//     getTimePercentage: timer.getTimePercentage,
    
//     // Розширені дії
//     undoLastMove: gameLogic.undoLastMove,
//     surrenderGame,
    
//     // Аналіз позиції
//     evaluatePosition,
//     getBestMoves
//   };
// }






































// hooks/useGameState.ts
// Головний хук для управління станом гри
// ✅ Використовує справжні хуки: useGameLogic, useAI, useTimer
// ✅ Об'єднує всю логіку гри в одному місці
// ✅ Підтримує AI, PvP та майбутні режими

import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { useGameLogic } from './useGameLogic';
import { useAI, type AIDifficulty, type AIConfig } from './useAI';
import { useTimer, type TimerConfig } from './useTimer';

import type { 
  GameMode, 
  Player, 
  BoardSize, 
  GameResult,
  GameState as GameStateType,
  CellValue,
  // НОВІ ІМПОРТИ:
  RestrictedCells,
  RestrictionInfo
} from '../types/game';

import { PLAYER_SYMBOLS, GAME_MODES } from '../constants/game';
import { getOppositePlayer } from '../utils/gameUtils'; 
import { useTranslation } from '../lib/i18n/LanguageContext';

// Налаштування гри
export interface GameSettings {
  boardSize: BoardSize;
  gameMode: GameMode;
  playerSymbol: Player;
  aiDifficulty: AIDifficulty;
  timerEnabled: boolean;
  timePerMove: number;
  aiThinkingTime: number;
}

// Статистика поточної сесії
export interface SessionStats {
  gamesPlayed: number;
  wins: number;
  losses: number;
  draws: number;
  winRate: number;
  averageGameTime: number;
  longestGame: number;
  shortestGame: number;
}

// Повертаємий інтерфейс
export interface UseGameStateReturn {
  // Стан гри (з useGameLogic)
  gameState: GameStateType;
  board: CellValue[];
  currentPlayer: Player;
  gameActive: boolean;
  winningLine: number[];
  gameResult: GameResult;

  // НОВІ ПОЛЯ ДЛЯ 4×4:
  restrictedCells: RestrictedCells;
  restrictionInfo: RestrictionInfo;
  firstPlayer: Player;
  
  // AI стан (з useAI)
  isAIThinking: boolean;
  aiDifficulty: AIDifficulty;
  
  // Таймер стан (з useTimer)
  timeLeft: number;
  isTimerRunning: boolean;
  isTimeWarning: boolean;
  isTimeUp: boolean;
  
  // Налаштування
  settings: GameSettings;
  
  // Статистика
  sessionStats: SessionStats;
  gameStats: {
    duration: number;
    moves: number;
    playerMoves: number;
    opponentMoves: number;
  };
  
  // Основні дії
  startNewGame: (firstPlayer?: Player) => void; 
  makeMove: (index: number) => Promise<boolean>;
  pauseGame: () => void;
  resumeGame: () => void;
  resetGame: () => void;
  setupGame: () => void; // ⭐ ДОДАТИ ЦЮ ЛІНІЮ
  
  // Налаштування
  updateSettings: (newSettings: Partial<GameSettings>) => void;
  
  // Утіліти
  canMakeMove: (index: number) => boolean;
  getAvailableMoves: () => number[];
  formatTime: (seconds: number) => string;
  getTimePercentage: () => number;

  // НОВІ ФУНКЦІЇ ДЛЯ 4×4:
  canMakeMoveWithRestrictions: (index: number) => boolean;
  getAvailableMovesWithRestrictions: () => number[];
  
  // Розширені дії
  undoLastMove: () => boolean;
  surrenderGame: () => void;
  
  // Аналіз позиції (для AI режиму)
  evaluatePosition: () => number;
  getBestMoves: (count?: number) => number[];
}

// Опції хука
interface UseGameStateOptions {
  initialSettings?: Partial<GameSettings>;
  onGameEnd?: (result: GameResult, winner?: Player) => void;
  onStatisticsUpdate?: (stats: SessionStats) => void;
  persistStats?: boolean;
}

// Дефолтні налаштування
const DEFAULT_SETTINGS: GameSettings = {
  boardSize: 3,
  gameMode: GAME_MODES.AI,
  playerSymbol: PLAYER_SYMBOLS.X,
  aiDifficulty: 'medium',
  timerEnabled: false,
  timePerMove: 60,
  aiThinkingTime: 1000 // 🔥 Збільшуємо до 2 секунд
};

const DEFAULT_STATS: SessionStats = {
  gamesPlayed: 0,
  wins: 0,
  losses: 0,
  draws: 0,
  winRate: 0,
  averageGameTime: 0,
  longestGame: 0,
  shortestGame: 0
};

export function useGameState({
  initialSettings = {},
  onGameEnd,
  onStatisticsUpdate,
}: UseGameStateOptions = {}): UseGameStateReturn {

  // Об'єднуємо дефолтні та початкові налаштування
  const [settings, setSettings] = useState<GameSettings>({
    ...DEFAULT_SETTINGS,
    ...initialSettings
  });

  // Статистика сесії
  const [sessionStats, setSessionStats] = useState<SessionStats>(DEFAULT_STATS);
  const gameTimesRef = useRef<number[]>([]);
  const aiMoveInProgressRef = useRef(false); // 🔥 ДОДАЙТЕ ЦЕЙ РЯДОК СЮДИ

  // AI конфігурація
  const aiConfig = useMemo<AIConfig>(() => ({
    difficulty: settings.aiDifficulty,
    thinkingTime: settings.aiThinkingTime,
    aiSymbol: settings.playerSymbol === PLAYER_SYMBOLS.X ? PLAYER_SYMBOLS.O : PLAYER_SYMBOLS.X,
    randomness: settings.aiDifficulty === 'easy' ? 80 : settings.aiDifficulty === 'medium' ? 20 : 5
  }), [settings.aiDifficulty, settings.aiThinkingTime, settings.playerSymbol]);

  // Таймер конфігурація
  const timerConfig: TimerConfig = {
    timePerMove: settings.timePerMove,
    warningThreshold: Math.max(5, Math.floor(settings.timePerMove * 0.2)),
    autoEndMove: true
  };

  const { language } = useTranslation();

  // Ініціалізуємо хуки
  const gameLogic = useGameLogic({
    boardSize: settings.boardSize,
    playerSymbol: settings.playerSymbol,
    firstPlayer: settings.playerSymbol, 
    language, // ✅ ДОДАЙТЕ ЦЮ ЛІНІЮ
    onGameEnd: handleGameEnd,
    onMoveComplete: handleMoveComplete
  });

  const ai = useAI({
    config: aiConfig,
    onMoveCalculated: (moveIndex, evaluation) => {
      console.log(`AI обрав хід ${moveIndex} з оцінкою ${evaluation}`);
    }
  });

  const timer = useTimer({
    config: timerConfig,
    onTimeUp: handleTimeUp,
    onWarning: () => {
      console.log('Попередження: час майже закінчився!');
    }
  });

  // Обробники подій
  function handleGameEnd(result: GameResult, winner?: Player) {
    console.log('🎮 handleGameEnd викликано:', { 
      result, 
      winner, 
      playerSymbol: settings.playerSymbol,
      shouldSubmitScore: result === 'win'
    });
    // Оновлюємо статистику
    updateSessionStats(result);
    
    // Зупиняємо таймер
    if (settings.timerEnabled) {
      timer.pauseTimer();
    }
    
    // Зупиняємо AI якщо думає
    if (ai.isThinking) {
      ai.cancelAIMove();
    }

    // Викликаємо зовнішній callback
    onGameEnd?.(result, winner);
  }

  function handleMoveComplete(board: CellValue[], nextPlayer: Player) {
    console.log('🔄 handleMoveComplete викликано:', { 
      nextPlayer, 
      gameMode: settings.gameMode, 
      // currentPlayerInState: gameLogic.currentPlayer,
      // boardSize: settings.boardSize,
      // timestamp: Date.now()
    });
  
    // Скидаємо таймер
    if (settings.timerEnabled) {
      timer.resetMoveTimer();
    }
  
    //Коментую код
    // КРИТИЧНЕ ВИПРАВЛЕННЯ - чекаємо оновлення стану React
    // setTimeout(() => {
    //   if (settings.gameMode === 'ai' && gameLogic.gameActive) {
    //     const aiSymbol = settings.playerSymbol === PLAYER_SYMBOLS.X ? PLAYER_SYMBOLS.O : PLAYER_SYMBOLS.X;
        
    //     console.log('🔍 handleMoveComplete перевірка AI:', {
    //       nextPlayer,
    //       currentPlayerAfterTimeout: gameLogic.currentPlayer,
    //       aiSymbol,
    //       shouldMakeAIMove: nextPlayer === aiSymbol
    //     });
  
    //     // Якщо наступний гравець - AI, запускаємо AI хід
    //     if (nextPlayer === aiSymbol && !aiMoveInProgressRef.current && !ai.isThinking) {
    //       console.log('🤖 handleMoveComplete запускає AI хід');
    //       makeAIMoveForPlayer(nextPlayer); // <- використовуємо nextPlayer
    //     }
    //   }
    // }, 400); // Мала затримка для оновлення стану
  }

  function handleTimeUp() {
    console.log('⏰ Час на хід закінчився! Завершуємо гру');
    
    // Зупиняємо таймер
    timer.pauseTimer();
    
    // Завершуємо гру з результатом "програш по часу"
    if (settings.gameMode === GAME_MODES.AI) {
      // Якщо час гравця закінчився - гравець програв
      const result: GameResult = gameLogic.currentPlayer === settings.playerSymbol ? 'lose' : 'win';
      const winner = gameLogic.currentPlayer === settings.playerSymbol ? 
        (settings.playerSymbol === PLAYER_SYMBOLS.X ? PLAYER_SYMBOLS.O : PLAYER_SYMBOLS.X) :
        settings.playerSymbol;
      
      gameLogic.endGame(result, winner);
    } else if (settings.gameMode === GAME_MODES.PVP) {
      // В PvP режимі поточний гравець програє
      gameLogic.endGame('lose', getOppositePlayer(gameLogic.currentPlayer));
    }
  }

  // Оновлення статистики
  const updateSessionStats = useCallback((result: GameResult) => {
    const gameTime = gameLogic.getGameStats().duration;
    gameTimesRef.current.push(gameTime);
    
    setSessionStats(prev => {
      const newStats = {
        ...prev,
        gamesPlayed: prev.gamesPlayed + 1,
        wins: result === 'win' ? prev.wins + 1 : prev.wins,
        losses: result === 'lose' ? prev.losses + 1 : prev.losses,
        draws: result === 'draw' ? prev.draws + 1 : prev.draws
      };

      // Обчислюємо додаткову статистику
      newStats.winRate = newStats.gamesPlayed > 0 ? 
        (newStats.wins / newStats.gamesPlayed) * 100 : 0;
      
      const times = gameTimesRef.current;
      newStats.averageGameTime = times.length > 0 ? 
        times.reduce((sum, time) => sum + time, 0) / times.length : 0;
      
      newStats.longestGame = times.length > 0 ? Math.max(...times) : 0;
      newStats.shortestGame = times.length > 0 ? Math.min(...times) : 0;

      // Викликаємо callback оновлення статистики
      onStatisticsUpdate?.(newStats);
      
      return newStats;
    });
  }, [gameLogic, onStatisticsUpdate]);

  // AI хід з конкретним гравцем (нова функція)
  const makeAIMoveForPlayer = useCallback(async (player: Player) => {

    if (ai.isThinking) {
      console.log('🚫 AI вже думає');
      return;
    }

    if (aiMoveInProgressRef.current) {
      console.log('🚫 AI хід вже в процесі');
      return;
    }

    if (!gameLogic.gameActive) {
      console.log('❌ Гра не активна');
      return;
    }

    // if (ai.isThinking || aiMoveInProgressRef.current) {
    //   console.log('🚫 AI вже думає або хід в процесі');
    //   return;
    // }


    if (gameLogic.currentPlayer !== player) {
      console.log('❌ Зараз не хід AI:', {
        currentPlayer: gameLogic.currentPlayer,
        requestedPlayer: player
      });
      return;
    }

    const aiSymbol = settings.playerSymbol === PLAYER_SYMBOLS.X ? PLAYER_SYMBOLS.O : PLAYER_SYMBOLS.X;
    if (player !== aiSymbol) {
      console.log('❌ Невірний символ для AI');
      return;
    }
    aiMoveInProgressRef.current = true; // 🔥 БЛОКУЄМО
    // ВИПРАВЛЕНА перевірка - використовуємо переданий параметр
    // if (player !== aiSymbol) {
    //   console.log('❌ AI хід скасовано - неправильний гравець запитаний');
    //   aiMoveInProgressRef.current = false;
    //   return;
    // }
    //const aiSymbol = settings.playerSymbol === PLAYER_SYMBOLS.X ? PLAYER_SYMBOLS.O : PLAYER_SYMBOLS.X;
    
    // console.log('🤖 makeAIMoveForPlayer ДЕТАЛЬНИЙ ЛОГ:', {
    //   gameActive: gameLogic.gameActive,
    //   requestedPlayer: player,
    //   currentPlayer: gameLogic.currentPlayer,
    //   playerSymbol: settings.playerSymbol,
    //   calculatedAISymbol: aiSymbol,
    //   playersMatch: player === aiSymbol,
    //   currentMatch: player === gameLogic.currentPlayer,
    //   shouldAIMove: player === aiSymbol && player === gameLogic.currentPlayer && gameLogic.gameActive,
    //   boardSize: settings.boardSize,
    //   restrictedCells: gameLogic.restrictedCells // ДОДАНО
    // });
    
    // if (!gameLogic.gameActive || player !== aiSymbol) {
    //   console.log('❌ AI не може зробити хід - основні умови не виконані:', {
    //     gameActive: gameLogic.gameActive,
    //     playerMatch: player === aiSymbol
    //   });
    //   aiMoveInProgressRef.current = false;
    //   return;
    // }

    // console.log('🎯 AI починає розрахунок ходу');
try {
  await new Promise(resolve => setTimeout(resolve, settings.aiThinkingTime));
  const moveIndex = await ai.makeAIMove(gameLogic.board, settings.boardSize, gameLogic.restrictedCells, gameLogic.firstPlayer);
  
  console.log('🔧 Дані для AI:', {
    board: gameLogic.board,
    boardSize: settings.boardSize,
    restrictedCells: gameLogic.restrictedCells,
    firstPlayer: gameLogic.firstPlayer,
    aiSymbol: aiSymbol
  });
  
  let finalMoveIndex = moveIndex;
  
  // Якщо AI не знайшов хід або хід невалідний - знайти запасний
  if (moveIndex === -1 || gameLogic.board[moveIndex] !== '') {
    console.log('❌ AI хід невалідний, шукаємо запасний');
    const availableMoves = settings.boardSize === 4 ? 
      gameLogic.getAvailableMovesWithRestrictions() :
      gameLogic.getAvailableMoves();
      
    if (availableMoves.length > 0) {
      finalMoveIndex = availableMoves[0];
      console.log('🔄 Використовуємо запасний хід:', finalMoveIndex);
    } else {
      console.error('❌ Немає доступних ходів');
      return;
    }
  }
  
  // Перевірка валідності запасного ходу
  const canMove = settings.boardSize === 4 ? 
    gameLogic.canMakeMoveWithRestrictions(finalMoveIndex) :
    gameLogic.canMakeMove(finalMoveIndex);
    
  if (!canMove) {
    console.error('❌ Запасний хід також невалідний');
    return;
  }
  
  // ЄДИНИЙ виклик makePlayerMoveWithSymbol
  console.log('✅ Виконуємо AI хід на позицію:', finalMoveIndex);
  const success = gameLogic.makePlayerMoveWithSymbol(finalMoveIndex, aiSymbol);
  
  if (!success) {
    console.error('❌ AI хід не вдався навіть з валідною позицією');
  }
  
} catch (error) {
  console.error('🔥 Помилка AI ходу:', error);
} finally {
  aiMoveInProgressRef.current = false;
}
}, [gameLogic, ai, settings.playerSymbol, settings.boardSize]);

  // Початок нової гри
  const startNewGame = useCallback((firstPlayer?: Player) => {
    console.log('🚀 startNewGame викликано з firstPlayer:', firstPlayer);
  
    // Визначаємо хто ходить першим
    const startingPlayer = firstPlayer || settings.playerSymbol;

    // Скидаємо логіку гри
    gameLogic.initializeGame(startingPlayer); 
    
    // Скидаємо таймер
    if (settings.timerEnabled) {
      timer.resetTimer();
      timer.startTimer();
    }
    
    // Скасовуємо AI якщо думає
    if (ai.isThinking) {
      ai.cancelAIMove();
    }

    // Не викликаємо AI тут - useEffect буде обробляти це
  }, [gameLogic, timer, ai, settings]);

  // Виконання ходу
  const makeMove = useCallback(async (index: number): Promise<boolean> => {
    // if (!gameLogic.canMakeMove(index)) {
    //   return false;
    // }
    // ОНОВЛЕНА ПЕРЕВІРКА З УРАХУВАННЯМ ОБМЕЖЕНЬ:
  const canMove = settings.boardSize === 4 ? 
  gameLogic.canMakeMoveWithRestrictions(index) : 
  gameLogic.canMakeMove(index);

  if (!canMove) {
    console.log('❌ Хід неможливий:', {
      index,
      boardSize: settings.boardSize,
      reason: settings.boardSize === 4 ? 'restrictions or occupied' : 'occupied'
    });
    
    // Для 4×4 показуємо додаткову інформацію
    if (settings.boardSize === 4) {
      console.log('🚫 Обмежені клітинки:', gameLogic.restrictedCells);
      console.log('ℹ️ Інформація про обмеження:', gameLogic.restrictionInfo);
    }
    
    return false;
  }

    // В режимі AI перевіряємо, що зараз хід гравця
    if (settings.gameMode === GAME_MODES.AI && gameLogic.currentPlayer !== settings.playerSymbol) {
      return false;
    }

    // Виконуємо хід
    const success = gameLogic.makePlayerMove(index);
    
    if (success && settings.timerEnabled) {
      timer.resetMoveTimer();
    }

    return success;
  }, [gameLogic, timer, settings]);

  // Пауза гри
  const pauseGame = useCallback(() => {
    gameLogic.pauseGame();
    
    if (settings.timerEnabled) {
      timer.pauseTimer();
    }
    
    if (ai.isThinking) {
      ai.cancelAIMove();
    }
  }, [gameLogic, timer, ai, settings.timerEnabled]);

  // Відновлення гри
  const resumeGame = useCallback(() => {
    gameLogic.resumeGame();
    
    if (settings.timerEnabled) {
      timer.resumeTimer();
    }

    // useEffect буде обробляти AI хід при відновленні
  }, [gameLogic, timer, settings]);

  // Скидання гри
  const resetGame = useCallback(() => {
    gameLogic.resetGame();
    
    if (settings.timerEnabled) {
      timer.resetTimer();
    }
    
    if (ai.isThinking) {
      ai.cancelAIMove();
    }
  }, [gameLogic, timer, ai, settings.timerEnabled]);

  // Оновлення налаштувань
  const updateSettings = useCallback((newSettings: Partial<GameSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      
      // Оновлюємо AI конфігурацію якщо потрібно
      if (newSettings.aiDifficulty || newSettings.aiThinkingTime || newSettings.playerSymbol) {
        const newAIConfig: Partial<AIConfig> = {};
        
        if (newSettings.aiDifficulty) newAIConfig.difficulty = newSettings.aiDifficulty;
        if (newSettings.aiThinkingTime) newAIConfig.thinkingTime = newSettings.aiThinkingTime;
        if (newSettings.playerSymbol) {
          newAIConfig.aiSymbol = newSettings.playerSymbol === PLAYER_SYMBOLS.X ? 
            PLAYER_SYMBOLS.O : PLAYER_SYMBOLS.X;
        }
        
        ai.updateConfig(newAIConfig);
      }
      
      return updated;
    });
  }, [ai]);

  // Здача гри
  const surrenderGame = useCallback(() => {
    const result: GameResult = settings.gameMode === GAME_MODES.AI ? 'lose' : 'lose';
    gameLogic.endGame(result, settings.playerSymbol === PLAYER_SYMBOLS.X ? PLAYER_SYMBOLS.O : PLAYER_SYMBOLS.X);
  }, [gameLogic, settings]);

  // Аналіз позиції
  const evaluatePosition = useCallback(() => {
    return ai.evaluatePosition(gameLogic.board, settings.boardSize);
  }, [ai, gameLogic.board, settings.boardSize]);

  // Отримання найкращих ходів
  const getBestMoves = useCallback((count = 3) => {
    return ai.getBestMoves(gameLogic.board, settings.boardSize, count);
  }, [ai, gameLogic.board, settings.boardSize]);

  // Ефект для автоматичного запуску таймера при зміні гравця
  // useEffect(() => {
  //   if (settings.timerEnabled && gameLogic.gameActive) {
  //     timer.startTimer();
  //   }
  // }, [gameLogic.currentPlayer, gameLogic.gameActive, settings.timerEnabled, timer]);
  // ВИПРАВЛЕНИЙ КОД
  useEffect(() => {
    if (settings.timerEnabled && gameLogic.gameActive && !timer.isRunning) {
      timer.startTimer(); // ✅ Запускається тільки ОДИН раз при початку гри
    }
  }, [gameLogic.gameActive, settings.timerEnabled]);



  // Ефект для автоматичного AI ходу
  // useEffect(() => {
  //   const aiSymbol = settings.playerSymbol === PLAYER_SYMBOLS.X ? PLAYER_SYMBOLS.O : PLAYER_SYMBOLS.X;
    
  //   console.log('🔍 useEffect AI ДЕТАЛЬНА перевірка:', {
  //     gameMode: settings.gameMode,
  //     gameActive: gameLogic.gameActive,
  //     currentPlayer: gameLogic.currentPlayer,
  //     playerSymbol: settings.playerSymbol,
  //     calculatedAISymbol: aiSymbol,
  //     isAIThinking: ai.isThinking,
  //     shouldMakeAIMove: settings.gameMode === GAME_MODES.AI && 
  //                      gameLogic.gameActive && 
  //                      gameLogic.currentPlayer === aiSymbol &&
  //                      !ai.isThinking
  //   });

  //   if (settings.gameMode === GAME_MODES.AI && 
  //       gameLogic.gameActive && 
  //       gameLogic.currentPlayer === aiSymbol &&
  //       !ai.isThinking) {
      
  //     console.log('🤖 useEffect запускає AI хід');
  //     console.log('🤖 Стан дошки перед AI ходом:', gameLogic.board);
  //     // Невелика затримка для UI
  //     const timeoutId = setTimeout(() => {
  //       makeAIMoveForPlayer(aiSymbol);
  //     }, 300);
      
  //     return () => clearTimeout(timeoutId);
  //   }
  // }, [gameLogic.gameActive, gameLogic.currentPlayer, settings.gameMode, settings.playerSymbol, ai.isThinking, makeAIMoveForPlayer, gameLogic.board]); //gameLogic.board

  // Ефект для автоматичного AI ходу - ВИПРАВЛЕНА ВЕРСІЯ
// Ефект для автоматичного AI ходу - ВИПРАВЛЕНА ВЕРСІЯ
useEffect(() => {
  // Виходимо якщо не AI режим або гра не активна
  if (settings.gameMode !== 'ai' || !gameLogic.gameActive) {
    return;
  }

  const aiSymbol = settings.playerSymbol === PLAYER_SYMBOLS.X ? PLAYER_SYMBOLS.O : PLAYER_SYMBOLS.X;
  
  // КРИТИЧНА ПЕРЕВІРКА: AI ходить тільки коли зараз його черга
  const shouldAIMakeMove = gameLogic.currentPlayer === aiSymbol && 
                          !ai.isThinking && 
                          !aiMoveInProgressRef.current;

  console.log('🔍 useEffect AI перевірка:', {
    currentPlayer: gameLogic.currentPlayer,
    aiSymbol,
    playerSymbol: settings.playerSymbol,
    shouldAIMakeMove,
    isThinking: ai.isThinking,
    moveInProgress: aiMoveInProgressRef.current
  });

  if (shouldAIMakeMove) {
    console.log('🤖 useEffect: Запускаємо AI хід для', aiSymbol);
    
    const timeoutId = setTimeout(() => {
      // Додаткова перевірка перед викликом
      if (gameLogic.gameActive && 
          gameLogic.currentPlayer === aiSymbol && 
          !aiMoveInProgressRef.current && 
          !ai.isThinking) {
        makeAIMoveForPlayer(aiSymbol);
      } else {
        console.log('❌ AI хід скасовано - умови змінилися');
      }
    }, 500); // Збільшена затримка
    
    return () => clearTimeout(timeoutId);
  }
}, [
  settings.gameMode, 
  gameLogic.gameActive, 
  gameLogic.currentPlayer, 
  settings.playerSymbol, 
  ai.isThinking
]);


  // useEffect(() => {
  //   const aiSymbol = settings.playerSymbol === PLAYER_SYMBOLS.X ? PLAYER_SYMBOLS.O : PLAYER_SYMBOLS.X;
  
  //   // 🔥 ВИДАЛИЛИ timer.startTimer() звідси
  //   if (settings.gameMode === GAME_MODES.AI && 
  //       gameLogic.gameActive && 
  //       gameLogic.currentPlayer === aiSymbol &&
  //       !ai.isThinking) {
      
  //     console.log('🤖 Запускаємо AI хід');
  //     makeAIMoveForPlayer(aiSymbol);
  //   }
  // }, [gameLogic.gameActive, gameLogic.currentPlayer, settings.gameMode, settings.playerSymbol, ai.isThinking, makeAIMoveForPlayer]);
 
 
 
 
 
 
  // useEffect(() => {
  //   // if (settings.gameMode !== 'ai' || !gameLogic.gameActive) return;
  //   if (settings.gameMode !== 'ai' || !gameLogic.gameActive || aiMoveInProgressRef.current) return;
    
  //   const aiSymbol = settings.playerSymbol === PLAYER_SYMBOLS.X ? PLAYER_SYMBOLS.O : PLAYER_SYMBOLS.X;
  //   console.log('🔍 useEffect AI перевірка:', {
  //     currentPlayer: gameLogic.currentPlayer,
  //     aiSymbol: aiSymbol,
  //     playerSymbol: settings.playerSymbol,
  //     shouldMakeMove: gameLogic.currentPlayer === aiSymbol,
  //     whoShouldPlay: gameLogic.currentPlayer === settings.playerSymbol ? 'ГРАВЕЦЬ' : 'AI',
  //     isThinking: ai.isThinking,
  //     moveInProgress: aiMoveInProgressRef.current
  //   });
    
  //   // Тільки критичні логи
  //   // if (gameLogic.currentPlayer === aiSymbol && !ai.isThinking) {
  //     if (gameLogic.currentPlayer === aiSymbol && !ai.isThinking) {
  //       console.log('🤖 useEffect запускає AI хід для', aiSymbol);
  //     const timeoutId = setTimeout(() => {
  //       makeAIMoveForPlayer(aiSymbol);
  //     }, 150); // зменшити затримку
      
  //     return () => clearTimeout(timeoutId);
  //   } else if (gameLogic.currentPlayer === settings.playerSymbol) {
  //     console.log('👤 Чекаємо хід гравця (', settings.playerSymbol, ')');
  //   }
  // }, [settings.gameMode, gameLogic.gameActive, gameLogic.currentPlayer, ai.isThinking]);//[settings.gameMode, gameLogic.gameActive, ai.isThinking]);

  return {
    // Стан гри
    gameState: gameLogic.gameState,
    board: gameLogic.board,
    currentPlayer: gameLogic.currentPlayer,
    gameActive: gameLogic.gameActive,
    winningLine: gameLogic.winningLine,
    gameResult: gameLogic.gameResult,

    // НОВІ ПОЛЯ ДЛЯ 4×4:
    restrictedCells: gameLogic.restrictedCells,
    restrictionInfo: gameLogic.restrictionInfo,
    firstPlayer: gameLogic.firstPlayer,
    
    // AI стан
    isAIThinking: ai.isThinking,
    aiDifficulty: ai.difficulty,
    
    // Таймер стан
    timeLeft: timer.timeLeft,
    isTimerRunning: timer.isRunning,
    isTimeWarning: timer.isWarning,
    isTimeUp: timer.isTimeUp,
    
    // Налаштування
    settings,
    
    // Статистика
    sessionStats,
    gameStats: gameLogic.getGameStats(),
    
    // Основні дії
    startNewGame,
    makeMove,
    pauseGame,
    resumeGame,
    resetGame,
    setupGame: gameLogic.setupGame, // ⭐ ДОДАТИ ЦЮ ЛІНІЮ
    
    // Налаштування
    updateSettings,
    
    // Утіліти
    canMakeMove: gameLogic.canMakeMove,
    getAvailableMoves: gameLogic.getAvailableMoves,
    formatTime: timer.formatTime,
    getTimePercentage: timer.getTimePercentage,

    // НОВІ ФУНКЦІЇ ДЛЯ 4×4:
    canMakeMoveWithRestrictions: gameLogic.canMakeMoveWithRestrictions,
    getAvailableMovesWithRestrictions: gameLogic.getAvailableMovesWithRestrictions,
    
    // Розширені дії
    undoLastMove: gameLogic.undoLastMove,
    surrenderGame,
    
    // Аналіз позиції
    evaluatePosition,
    getBestMoves
  };
}