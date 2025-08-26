// // hooks/useAI.ts
// // ШІ для гри в хрестики-нулики з різними рівнями складності
// // ✅ Легкий рівень - випадкові ходи
// // ✅ Середній рівень - базова стратегія
// // ✅ Важкий рівень - мінімакс алгоритм
// // ✅ Налаштовувана затримка для реалістичності

// import { useCallback, useState, useRef } from 'react';
// import type { CellValue, Player, BoardSize } from '../types/game';
// import { 
//   makeMove, 
//   checkWinner, 
//   isGameFinished,
//   generateWinningConditions,
//   getOppositePlayer 
// } from '../utils/gameUtils';

// export type AIDifficulty = 'easy' | 'medium' | 'hard';

// export interface AIConfig {
//   difficulty: AIDifficulty;
//   thinkingTime: number; // мс затримки перед ходом
//   aiSymbol: Player;
//   randomness: number; // 0-100, відсоток випадковості навіть на важкому рівні
// }

// export interface UseAIReturn {
//   // Стан ШІ
//   isThinking: boolean;
//   difficulty: AIDifficulty;
//   lastMove: number | null;
  
//   // Дії
//   makeAIMove: (board: CellValue[], boardSize: BoardSize) => Promise<number>;
//   cancelAIMove: () => void;
//   updateConfig: (config: Partial<AIConfig>) => void;
  
//   // Аналіз
//   evaluatePosition: (board: CellValue[], boardSize: BoardSize) => number;
//   getBestMoves: (board: CellValue[], boardSize: BoardSize, count?: number) => number[];
// }

// interface UseAIOptions {
//   config: AIConfig;
//   onMoveCalculated?: (moveIndex: number, evaluation: number) => void;
// }

// export function useAI({
//   config: initialConfig,
//   onMoveCalculated
// }: UseAIOptions): UseAIReturn {
  
//   const [config, setConfig] = useState<AIConfig>(initialConfig);
//   const [isThinking, setIsThinking] = useState(false);
//   const [lastMove, setLastMove] = useState<number | null>(null);
  
//   const thinkingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
//   const cancelledRef = useRef(false);

//   // Очищення таймауту при демонтажі
//   const cleanup = useCallback(() => {
//     if (thinkingTimeoutRef.current) {
//       clearTimeout(thinkingTimeoutRef.current);
//       thinkingTimeoutRef.current = null;
//     }
//   }, []);

//   // Оновлення конфігурації
//   const updateConfig = useCallback((newConfig: Partial<AIConfig>) => {
//     setConfig(prev => ({ ...prev, ...newConfig }));
//   }, []);

//   // Скасування розрахунку ходу
//   const cancelAIMove = useCallback(() => {
//     cancelledRef.current = true;
//     setIsThinking(false);
//     cleanup();
//   }, [cleanup]);

//   // Отримання доступних ходів
//   const getAvailableMoves = useCallback((board: CellValue[]): number[] => {
//     return board
//       .map((cell, index) => cell === '' ? index : -1)
//       .filter(index => index !== -1);
//   }, []);

//   // Випадковий хід (легкий рівень)
//   const getRandomMove = useCallback((board: CellValue[]): number => {
//     const availableMoves = getAvailableMoves(board);
//     if (availableMoves.length === 0) return -1;
    
//     return availableMoves[Math.floor(Math.random() * availableMoves.length)];
//   }, [getAvailableMoves]);

//   // Стратегічний хід (середній рівень)
//   const getStrategicMove = useCallback((
//     board: CellValue[], 
//     boardSize: BoardSize
//   ): number => {
//     const availableMoves = getAvailableMoves(board);
//     if (availableMoves.length === 0) return -1;

//     const winningConditions = generateWinningConditions(boardSize);
//     const aiSymbol = config.aiSymbol;
//     const playerSymbol = getOppositePlayer(aiSymbol);

//     // 1. Спробувати виграти
//     for (const move of availableMoves) {
//       const testBoard = makeMove(board, move, aiSymbol);
//       const result = checkWinner(testBoard, winningConditions);
//       if (result.winner === aiSymbol) {
//         return move;
//       }
//     }

//     // 2. Заблокувати виграш гравця
//     for (const move of availableMoves) {
//       const testBoard = makeMove(board, move, playerSymbol);
//       const result = checkWinner(testBoard, winningConditions);
//       if (result.winner === playerSymbol) {
//         return move;
//       }
//     }

//     // 3. Взяти центр (для дошки 3x3)
//     if (boardSize === 3) {
//       const center = 4;
//       if (availableMoves.includes(center)) {
//         return center;
//       }
//     }

//     // 4. Взяти кут
//     const corners = boardSize === 3 ? [0, 2, 6, 8] : 
//                    boardSize === 4 ? [0, 3, 12, 15] :
//                    [0, boardSize - 1, (boardSize - 1) * boardSize, boardSize * boardSize - 1];
    
//     const availableCorners = corners.filter(corner => availableMoves.includes(corner));
//     if (availableCorners.length > 0) {
//       return availableCorners[Math.floor(Math.random() * availableCorners.length)];
//     }

//     // 5. Випадковий хід
//     return getRandomMove(board);
//   }, [getAvailableMoves, getRandomMove, config.aiSymbol]);



//   const evaluatePosition = useCallback((
//     board: CellValue[], 
//     boardSize: BoardSize
//   ): number => {
//     const winningConditions = generateWinningConditions(boardSize);
//     const result = isGameFinished(board, winningConditions);
//     const aiSymbol = config.aiSymbol;
//     const playerSymbol = getOppositePlayer(aiSymbol);

//     if (result.winner === aiSymbol) return 100;
//     if (result.winner === playerSymbol) return -100;
//     if (result.isDraw) return 0;

//     // Оцінити потенційні виграшні лінії
//     let score = 0;
    
//     for (const condition of winningConditions) {
//       let aiCount = 0;
//       let playerCount = 0;

//       for (const index of condition) {
//         if (board[index] === aiSymbol) aiCount++;
//         else if (board[index] === playerSymbol) playerCount++;
//       }

//       // Якщо лінія може бути виграшною для ШІ
//       if (playerCount === 0) {
//         score += aiCount * aiCount;
//       }
//       // Якщо лінія може бути виграшною для гравця
//       else if (aiCount === 0) {
//         score -= playerCount * playerCount;
//       }
//     }

//     return score;
//   }, [config.aiSymbol]);
//   // Мінімакс алгоритм (важкий рівень)
//  // Замініть вашу функцію minimax на цю виправлену версію:

// // Виправлена версія з обмеженням глибини та кешуванням
// const minimax = useCallback((
//   board: CellValue[],
//   boardSize: BoardSize,
//   depth: number,
//   isMaximizing: boolean,
//   alpha: number = -Infinity,
//   beta: number = Infinity,
//   maxDepth: number = 6 // 🔥 ДОДАЙТЕ ЦЕЙ ПАРАМЕТР
// ): { score: number; move: number } => {
//   const winningConditions = generateWinningConditions(boardSize);
//   const result = isGameFinished(board, winningConditions);
//   const aiSymbol = config.aiSymbol;
//   const playerSymbol = getOppositePlayer(aiSymbol);

//   // 🔥 ДОДАЙТЕ ЦЮ ПЕРЕВІРКУ ГЛИБИНИ
//   if (depth >= maxDepth) {
//     const score = evaluatePosition(board, boardSize);
//     console.log('⚠️ Досягнуто максимальної глибини:', depth, 'Оцінка:', score);
//     return { score, move: -1 };
//   }

//   // Базові випадки
//   if (result.winner === aiSymbol) return { score: 10 - depth, move: -1 };
//   if (result.winner === playerSymbol) return { score: depth - 10, move: -1 };
//   if (result.isDraw) return { score: 0, move: -1 };

//   const availableMoves = getAvailableMoves(board);
//   let bestMove = availableMoves[0] || -1;

//   if (isMaximizing) {
//     let maxScore = -Infinity;
    
//     for (const move of availableMoves) {
//       const boardCopy = [...board];
//       const newBoard = makeMove(boardCopy, move, aiSymbol);
//       const { score } = minimax(newBoard, boardSize, depth + 1, false, alpha, beta, maxDepth); // 🔥 ПЕРЕДАЙТЕ maxDepth
      
//       if (score > maxScore) {
//         maxScore = score;
//         bestMove = move;
//       }
      
//       alpha = Math.max(alpha, score);
//       if (beta <= alpha) break; // Alpha-beta відсікання
//     }
    
//     return { score: maxScore, move: bestMove };
//   } else {
//     let minScore = Infinity;
    
//     for (const move of availableMoves) {
//       const boardCopy = [...board];
//       const newBoard = makeMove(boardCopy, move, playerSymbol);
//       const { score } = minimax(newBoard, boardSize, depth + 1, true, alpha, beta, maxDepth); // 🔥 ПЕРЕДАЙТЕ maxDepth
      
//       if (score < minScore) {
//         minScore = score;
//         bestMove = move;
//       }
      
//       beta = Math.min(beta, score);
//       if (beta <= alpha) break; // Alpha-beta відсікання
//     }
    
//     return { score: minScore, move: bestMove };
//   }
// }, [getAvailableMoves, config.aiSymbol, evaluatePosition]); // 🔥 ДОДАЙТЕ evaluatePosition в залежності

//   // Отримання найкращого ходу залежно від рівня складності
//  //////////////////////////////////////////////////////////////////////////////////////////
//   // const getBestMove = useCallback((
//   //   board: CellValue[], 
//   //   boardSize: BoardSize
//   // ): number => {
//   //   const availableMoves = getAvailableMoves(board);
//   //   if (availableMoves.length === 0) return -1;

//   //   // Додати випадковість навіть на важкому рівні
//   //   const shouldUseRandom = Math.random() * 100 < config.randomness;
//   //   if (shouldUseRandom) {
//   //     return getRandomMove(board);
//   //   }

//   //   switch (config.difficulty) {
//   //     case 'easy':
//   //       return getRandomMove(board);
        
//   //     case 'medium':
//   //       return getStrategicMove(board, boardSize);
        
//   //     case 'hard':
//   //       const { move } = minimax(board, boardSize, 0, true);
//   //       return move !== -1 ? move : getRandomMove(board);
        
//   //     default:
//   //       return getRandomMove(board);
//   //   }
//   // }, [
//   //   getAvailableMoves, 
//   //   getRandomMove, 
//   //   getStrategicMove, 
//   //   minimax, 
//   //   config.difficulty, 
//   //   config.randomness
//   // ]);

//   // Оцінка позиції
 
//   // const getBestMove = useCallback((
//   //   board: CellValue[], 
//   //   boardSize: BoardSize
//   // ): number => {
//   //   const availableMoves = getAvailableMoves(board);
//   //   console.log('🎯 getBestMove. Доступні ходи:', availableMoves);
    
//   //   if (availableMoves.length === 0) return -1;
  
//   //   // Додати випадковість навіть на важкому рівні
//   //   const shouldUseRandom = Math.random() * 100 < config.randomness;
//   //   if (shouldUseRandom) {
//   //     const randomMove = getRandomMove(board);
//   //     console.log('🎲 Випадковий хід:', randomMove);
//   //     return randomMove;
//   //   }
  
//   //   switch (config.difficulty) {
//   //     case 'easy':
//   //       const easyMove = getRandomMove(board);
//   //       console.log('😊 Легкий хід:', easyMove);
//   //       return easyMove;
        
//   //     case 'medium':
//   //       const mediumMove = getStrategicMove(board, boardSize);
//   //       console.log('🧠 Середній хід:', mediumMove);
//   //       return mediumMove;
        
//   //     case 'hard':
//   //       console.log('🤖 Розрахунок важкого ходу...');
//   //       const { move } = minimax(board, boardSize, 0, true);
//   //       const hardMove = move !== -1 ? move : getRandomMove(board);
//   //       console.log('🎯 Важкий хід:', hardMove);
//   //       return hardMove;
        
//   //     default:
//   //       return getRandomMove(board);
//   //   }
//   // }, [
//   //   getAvailableMoves, 
//   //   getRandomMove, 
//   //   getStrategicMove, 
//   //   minimax, 
//   //   config.difficulty, 
//   //   config.randomness
//   // ]);

//   // У функції getBestMove додайте лог і таймаут:
//   // const getBestMove = useCallback((
//   //   board: CellValue[], 
//   //   boardSize: BoardSize
//   // ): number => {
//   //   const availableMoves = getAvailableMoves(board);
//   //   console.log('🎯 getBestMove. Доступні ходи:', availableMoves);
    
//   //   if (availableMoves.length === 0) return -1;

//   //   const shouldUseRandom = Math.random() * 100 < config.randomness;
//   //   if (shouldUseRandom) {
//   //     const randomMove = getRandomMove(board);
//   //     console.log('🎲 Випадковий хід:', randomMove);
//   //     return randomMove;
//   //   }

//   //   switch (config.difficulty) {
//   //     case 'easy':
//   //       const easyMove = getRandomMove(board);
//   //       console.log('😊 Легкий хід:', easyMove);
//   //       return easyMove;
        
//   //     case 'medium':
//   //       const mediumMove = getStrategicMove(board, boardSize);
//   //       console.log('🧠 Середній хід:', mediumMove);
//   //       return mediumMove;
        
//   //     case 'hard':
//   //       console.log('🤖 Розрахунок важкого ходу...');
        
//   //       // 🔥 ДОДАЙТЕ ТАЙМАУТ ДЛЯ MINIMAX
//   //       const maxDepth = boardSize === 3 ? 9 : 6; // Для 3×3 - до кінця, для 4×4 - обмежено
//   //       const startTime = Date.now();
//   //       const { move } = minimax(board, boardSize, 0, true, -Infinity, Infinity, maxDepth);
//   //       const endTime = Date.now();
        
//   //       console.log(`⏱️ Minimax зайняв ${endTime - startTime}мс`);
        
//   //       if (endTime - startTime > 5000) { // Якщо більше 5 секунд
//   //         console.log('⚠️ Minimax занадто повільний, використовуємо стратегічний хід');
//   //         return getStrategicMove(board, boardSize);
//   //       }
        
//   //       const hardMove = move !== -1 ? move : getRandomMove(board);
//   //       console.log('🎯 Важкий хід:', hardMove);
//   //       return hardMove;
        
//   //     default:
//   //       return getRandomMove(board);
//   //   }
//   // }, [
//   //   getAvailableMoves, 
//   //   getRandomMove, 
//   //   getStrategicMove, 
//   //   minimax, 
//   //   config.difficulty, 
//   //   config.randomness
//   // ]);

//   const getBestMove = useCallback(async (
//     board: CellValue[], 
//     boardSize: BoardSize
//   ): Promise<number> => {
//     const availableMoves = getAvailableMoves(board);
//     console.log('🎯 getBestMove. Доступні ходи:', availableMoves);
    
//     if (availableMoves.length === 0) return -1;
  
//     const shouldUseRandom = Math.random() * 100 < config.randomness;
//     if (shouldUseRandom) {
//       return getRandomMove(board);
//     }
  
//     switch (config.difficulty) {
//       case 'easy':
//         return getRandomMove(board);
        
//       case 'medium':
//         return getStrategicMove(board, boardSize);
        
//       case 'hard':
//         console.log('🤖 Розрахунок важкого ходу...');
        
//         // 🔥 АСИНХРОННИЙ РОЗРАХУНОК
//         return new Promise((resolve) => {
//           setTimeout(() => {
//             const maxDepth = boardSize === 3 ? 6 : 4;
//             const { move } = minimax(board, boardSize, 0, true, -Infinity, Infinity, maxDepth);
//             const hardMove = move !== -1 ? move : getRandomMove(board);
//             resolve(hardMove);
//           }, 0); // 🔥 Змініть з 50 на 0 для швидшого відгуку
//         });
        
//       default:
//         return getRandomMove(board);
//     }
//   }, [getAvailableMoves, getRandomMove, getStrategicMove, minimax, config]);
//   //////////////////////////////////////////////////////////////////////////////////////////////

 
//   // const evaluatePosition = useCallback((
//   //   board: CellValue[], 
//   //   boardSize: BoardSize
//   // ): number => {
//   //   const winningConditions = generateWinningConditions(boardSize);
//   //   const result = isGameFinished(board, winningConditions);
//   //   const aiSymbol = config.aiSymbol;
//   //   const playerSymbol = getOppositePlayer(aiSymbol);

//   //   if (result.winner === aiSymbol) return 100;
//   //   if (result.winner === playerSymbol) return -100;
//   //   if (result.isDraw) return 0;

//   //   // Оцінити потенційні виграшні лінії
//   //   let score = 0;
    
//   //   for (const condition of winningConditions) {
//   //     let aiCount = 0;
//   //     let playerCount = 0;

//   //     for (const index of condition) {
//   //       if (board[index] === aiSymbol) aiCount++;
//   //       else if (board[index] === playerSymbol) playerCount++;
//   //     }

//   //     // Якщо лінія може бути виграшною для ШІ
//   //     if (playerCount === 0) {
//   //       score += aiCount * aiCount;
//   //     }
//   //     // Якщо лінія може бути виграшною для гравця
//   //     else if (aiCount === 0) {
//   //       score -= playerCount * playerCount;
//   //     }
//   //   }

//   //   return score;
//   // }, [config.aiSymbol]);

//   // Отримання кількох найкращих ходів
//   const getBestMoves = useCallback((
//     board: CellValue[], 
//     boardSize: BoardSize, 
//     count: number = 3
//   ): number[] => {
//     const availableMoves = getAvailableMoves(board);
    
//     const evaluatedMoves = availableMoves.map(move => {
//       const testBoard = makeMove([...board], move, config.aiSymbol);
//       const evaluation = evaluatePosition(testBoard, boardSize);
//       return { move, evaluation };
//     });

//     return evaluatedMoves
//       .sort((a, b) => b.evaluation - a.evaluation)
//       .slice(0, count)
//       .map(item => item.move);
//   }, [getAvailableMoves, evaluatePosition, config.aiSymbol]);

//   // Основна функція для розрахунку ходу ШІ
//   // const makeAIMove = useCallback(async (
//   //   board: CellValue[], 
//   //   boardSize: BoardSize
//   // ): Promise<number> => {
//   //   console.log('🧠 AI makeAIMove викликано:', { isThinking, board, boardSize });

//   //   if (isThinking) {
//   //   console.log('🤔 AI вже думає, повертаємо -1');
//   //   return -1;
//   // }

//   //   setIsThinking(true);
//   //   cancelledRef.current = false;

//   //   console.log('⏳ AI почав думати...');

//   //   return new Promise((resolve) => {
//   //     thinkingTimeoutRef.current = setTimeout(() => {
//   //       if (cancelledRef.current) {
//   //         console.log('🚫 AI хід скасовано');
//   //         setIsThinking(false);
//   //         resolve(-1);
//   //         return;
//   //       }

//   //       console.log('🎯 AI розраховує найкращий хід');
//   //       const move = getBestMove(board, boardSize);
//   //       console.log('🎲 AI вибрав хід:', move);
//   //       const evaluation = move !== -1 ? evaluatePosition(
//   //         makeMove([...board], move, config.aiSymbol), 
//   //         boardSize
//   //       ) : 0;

//   //       setLastMove(move);
//   //       setIsThinking(false);
        
//   //       onMoveCalculated?.(move, evaluation);
//   //       resolve(move);
//   //     }, config.thinkingTime);
//   //   });
//   // }, [
//   //   isThinking, 
//   //   getBestMove, 
//   //   evaluatePosition, 
//   //   config.aiSymbol, 
//   //   config.thinkingTime,
//   //   onMoveCalculated
//   // ]);
//   const makeAIMove = useCallback(async (
//     board: CellValue[], 
//     boardSize: BoardSize
//   ): Promise<number> => {
//     if (isThinking) return -1;
  
//     setIsThinking(true);
//     cancelledRef.current = false;
  
//     console.log('⏳ AI почав думати...');
  
//     // 🔥 ПРИБРАЛИ setTimeout, тепер getBestMove сам асинхронний
//     try {
//       const move = await getBestMove(board, boardSize);
      
//       if (cancelledRef.current) {
//         setIsThinking(false);
//         return -1;
//       }
  
//       const evaluation = move !== -1 ? evaluatePosition(
//         makeMove([...board], move, config.aiSymbol), 
//         boardSize
//       ) : 0;
  
//       setLastMove(move);
//       setIsThinking(false);
      
//       onMoveCalculated?.(move, evaluation);
//       return move;
//     } catch (error) {
//       console.error('AI помилка:', error);
//       setIsThinking(false);
//       return -1;
//     }
//   }, [isThinking, getBestMove, evaluatePosition, config.aiSymbol, onMoveCalculated]);

//   return {
//     // Стан ШІ
//     isThinking,
//     difficulty: config.difficulty,
//     lastMove,
    
//     // Дії
//     makeAIMove,
//     cancelAIMove,
//     updateConfig,
    
//     // Аналіз
//     evaluatePosition,
//     getBestMoves
//   };
// }
































// // hooks/useAI.ts
// // ШІ для гри в хрестики-нулики з різними рівнями складності
// // ✅ Легкий рівень - випадкові ходи
// // ✅ Середній рівень - базова стратегія
// // ✅ Важкий рівень - мінімакс алгоритм
// // ✅ Налаштовувана затримка для реалістичності

// import { useCallback, useState, useRef, useEffect } from 'react';
// import type { CellValue, Player, BoardSize } from '../types/game';
// import { 
//   makeMove, 
//   checkWinner, 
//   isGameFinished,
//   generateWinningConditions,
//   getOppositePlayer 
// } from '../utils/gameUtils';

// export type AIDifficulty = 'easy' | 'medium' | 'hard';

// export interface AIConfig {
//   difficulty: AIDifficulty;
//   thinkingTime: number; // мс затримки перед ходом
//   aiSymbol: Player;
//   randomness: number; // 0-100, відсоток випадковості навіть на важкому рівні
// }

// export interface UseAIReturn {
//   // Стан ШІ
//   isThinking: boolean;
//   difficulty: AIDifficulty;
//   lastMove: number | null;
  
//   // Дії
//   makeAIMove: (board: CellValue[], boardSize: BoardSize) => Promise<number>;
//   cancelAIMove: () => void;
//   updateConfig: (config: Partial<AIConfig>) => void;
  
//   // Аналіз
//   evaluatePosition: (board: CellValue[], boardSize: BoardSize) => number;
//   getBestMoves: (board: CellValue[], boardSize: BoardSize, count?: number) => number[];
// }

// interface UseAIOptions {
//   config: AIConfig;
//   onMoveCalculated?: (moveIndex: number, evaluation: number) => void;
// }

// export function useAI({
//   config: initialConfig,
//   onMoveCalculated
// }: UseAIOptions): UseAIReturn {
  
//   const [config, setConfig] = useState<AIConfig>(initialConfig);
//   const [isThinking, setIsThinking] = useState(false);
//   const [lastMove, setLastMove] = useState<number | null>(null);
  
//   const thinkingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
//   const cancelledRef = useRef(false);
//   const workerRef = useRef<Worker | null>(null);

//   // Очищення таймауту при демонтажі
//   const cleanup = useCallback(() => {
//     if (thinkingTimeoutRef.current) {
//       clearTimeout(thinkingTimeoutRef.current);
//       thinkingTimeoutRef.current = null;
//     }
//   }, []);

//   // Оновлення конфігурації
//   const updateConfig = useCallback((newConfig: Partial<AIConfig>) => {
//     setConfig(prev => ({ ...prev, ...newConfig }));
//   }, []);

//   // Скасування розрахунку ходу
//   const cancelAIMove = useCallback(() => {
//     cancelledRef.current = true;
//     setIsThinking(false);
//     cleanup();
//   }, [cleanup]);

//   // Отримання доступних ходів
//   const getAvailableMoves = useCallback((board: CellValue[]): number[] => {
//     return board
//       .map((cell, index) => cell === '' ? index : -1)
//       .filter(index => index !== -1);
//   }, []);

//   // Випадковий хід (легкий рівень)
//   const getRandomMove = useCallback((board: CellValue[]): number => {
//     const availableMoves = getAvailableMoves(board);
//     if (availableMoves.length === 0) return -1;
    
//     return availableMoves[Math.floor(Math.random() * availableMoves.length)];
//   }, [getAvailableMoves]);

//   // Стратегічний хід (середній рівень)
//   const getStrategicMove = useCallback((
//     board: CellValue[], 
//     boardSize: BoardSize
//   ): number => {
//     const availableMoves = getAvailableMoves(board);
//     if (availableMoves.length === 0) return -1;

//     const winningConditions = generateWinningConditions(boardSize);
//     const aiSymbol = config.aiSymbol;
//     const playerSymbol = getOppositePlayer(aiSymbol);

//     // 1. Спробувати виграти
//     for (const move of availableMoves) {
//       const testBoard = makeMove(board, move, aiSymbol);
//       const result = checkWinner(testBoard, winningConditions);
//       if (result.winner === aiSymbol) {
//         return move;
//       }
//     }

//     // 2. Заблокувати виграш гравця
//     for (const move of availableMoves) {
//       const testBoard = makeMove(board, move, playerSymbol);
//       const result = checkWinner(testBoard, winningConditions);
//       if (result.winner === playerSymbol) {
//         return move;
//       }
//     }

//     // 3. Взяти центр (для дошки 3x3)
//     if (boardSize === 3) {
//       const center = 4;
//       if (availableMoves.includes(center)) {
//         return center;
//       }
//     }

//     // 4. Взяти кут
//     const corners = boardSize === 3 ? [0, 2, 6, 8] : 
//                    boardSize === 4 ? [0, 3, 12, 15] :
//                    [0, boardSize - 1, (boardSize - 1) * boardSize, boardSize * boardSize - 1];
    
//     const availableCorners = corners.filter(corner => availableMoves.includes(corner));
//     if (availableCorners.length > 0) {
//       return availableCorners[Math.floor(Math.random() * availableCorners.length)];
//     }

//     // 5. Випадковий хід
//     return getRandomMove(board);
//   }, [getAvailableMoves, getRandomMove, config.aiSymbol]);



//   const evaluatePosition = useCallback((
//     board: CellValue[], 
//     boardSize: BoardSize
//   ): number => {
//     const winningConditions = generateWinningConditions(boardSize);
//     const result = isGameFinished(board, winningConditions);
//     const aiSymbol = config.aiSymbol;
//     const playerSymbol = getOppositePlayer(aiSymbol);

//     if (result.winner === aiSymbol) return 100;
//     if (result.winner === playerSymbol) return -100;
//     if (result.isDraw) return 0;

//     // Оцінити потенційні виграшні лінії
//     let score = 0;
    
//     for (const condition of winningConditions) {
//       let aiCount = 0;
//       let playerCount = 0;

//       for (const index of condition) {
//         if (board[index] === aiSymbol) aiCount++;
//         else if (board[index] === playerSymbol) playerCount++;
//       }

//       // Якщо лінія може бути виграшною для ШІ
//       if (playerCount === 0) {
//         score += aiCount * aiCount;
//       }
//       // Якщо лінія може бути виграшною для гравця
//       else if (aiCount === 0) {
//         score -= playerCount * playerCount;
//       }
//     }

//     return score;
//   }, [config.aiSymbol]);
//   // Мінімакс алгоритм (важкий рівень)
//  // Замініть вашу функцію minimax на цю виправлену версію:

// // Виправлена версія з обмеженням глибини та кешуванням
// const minimax = useCallback((
//   board: CellValue[],
//   boardSize: BoardSize,
//   depth: number,
//   isMaximizing: boolean,
//   alpha: number = -Infinity,
//   beta: number = Infinity,
//   maxDepth: number = 6 // 🔥 ДОДАЙТЕ ЦЕЙ ПАРАМЕТР
// ): { score: number; move: number } => {
//   const winningConditions = generateWinningConditions(boardSize);
//   const result = isGameFinished(board, winningConditions);
//   const aiSymbol = config.aiSymbol;
//   const playerSymbol = getOppositePlayer(aiSymbol);

//   // 🔥 ДОДАЙТЕ ЦЮ ПЕРЕВІРКУ ГЛИБИНИ
//   if (depth >= maxDepth) {
//     const score = evaluatePosition(board, boardSize);
//     console.log('⚠️ Досягнуто максимальної глибини:', depth, 'Оцінка:', score);
//     return { score, move: -1 };
//   }

//   // Базові випадки
//   if (result.winner === aiSymbol) return { score: 10 - depth, move: -1 };
//   if (result.winner === playerSymbol) return { score: depth - 10, move: -1 };
//   if (result.isDraw) return { score: 0, move: -1 };

//   const availableMoves = getAvailableMoves(board);
//   let bestMove = availableMoves[0] || -1;

//   if (isMaximizing) {
//     let maxScore = -Infinity;
    
//     for (const move of availableMoves) {
//       const boardCopy = [...board];
//       const newBoard = makeMove(boardCopy, move, aiSymbol);
//       const { score } = minimax(newBoard, boardSize, depth + 1, false, alpha, beta, maxDepth); // 🔥 ПЕРЕДАЙТЕ maxDepth
      
//       if (score > maxScore) {
//         maxScore = score;
//         bestMove = move;
//       }
      
//       alpha = Math.max(alpha, score);
//       if (beta <= alpha) break; // Alpha-beta відсікання
//     }
    
//     return { score: maxScore, move: bestMove };
//   } else {
//     let minScore = Infinity;
    
//     for (const move of availableMoves) {
//       const boardCopy = [...board];
//       const newBoard = makeMove(boardCopy, move, playerSymbol);
//       const { score } = minimax(newBoard, boardSize, depth + 1, true, alpha, beta, maxDepth); // 🔥 ПЕРЕДАЙТЕ maxDepth
      
//       if (score < minScore) {
//         minScore = score;
//         bestMove = move;
//       }
      
//       beta = Math.min(beta, score);
//       if (beta <= alpha) break; // Alpha-beta відсікання
//     }
    
//     return { score: minScore, move: bestMove };
//   }
// }, [getAvailableMoves, config.aiSymbol, evaluatePosition]); // 🔥 ДОДАЙТЕ evaluatePosition в залежності

//   // Отримання найкращого ходу залежно від рівня складності
//  //////////////////////////////////////////////////////////////////////////////////////////
//   // const getBestMove = useCallback((
//   //   board: CellValue[], 
//   //   boardSize: BoardSize
//   // ): number => {
//   //   const availableMoves = getAvailableMoves(board);
//   //   if (availableMoves.length === 0) return -1;

//   //   // Додати випадковість навіть на важкому рівні
//   //   const shouldUseRandom = Math.random() * 100 < config.randomness;
//   //   if (shouldUseRandom) {
//   //     return getRandomMove(board);
//   //   }

//   //   switch (config.difficulty) {
//   //     case 'easy':
//   //       return getRandomMove(board);
        
//   //     case 'medium':
//   //       return getStrategicMove(board, boardSize);
        
//   //     case 'hard':
//   //       const { move } = minimax(board, boardSize, 0, true);
//   //       return move !== -1 ? move : getRandomMove(board);
        
//   //     default:
//   //       return getRandomMove(board);
//   //   }
//   // }, [
//   //   getAvailableMoves, 
//   //   getRandomMove, 
//   //   getStrategicMove, 
//   //   minimax, 
//   //   config.difficulty, 
//   //   config.randomness
//   // ]);

//   // Оцінка позиції
 
//   // const getBestMove = useCallback((
//   //   board: CellValue[], 
//   //   boardSize: BoardSize
//   // ): number => {
//   //   const availableMoves = getAvailableMoves(board);
//   //   console.log('🎯 getBestMove. Доступні ходи:', availableMoves);
    
//   //   if (availableMoves.length === 0) return -1;
  
//   //   // Додати випадковість навіть на важкому рівні
//   //   const shouldUseRandom = Math.random() * 100 < config.randomness;
//   //   if (shouldUseRandom) {
//   //     const randomMove = getRandomMove(board);
//   //     console.log('🎲 Випадковий хід:', randomMove);
//   //     return randomMove;
//   //   }
  
//   //   switch (config.difficulty) {
//   //     case 'easy':
//   //       const easyMove = getRandomMove(board);
//   //       console.log('😊 Легкий хід:', easyMove);
//   //       return easyMove;
        
//   //     case 'medium':
//   //       const mediumMove = getStrategicMove(board, boardSize);
//   //       console.log('🧠 Середній хід:', mediumMove);
//   //       return mediumMove;
        
//   //     case 'hard':
//   //       console.log('🤖 Розрахунок важкого ходу...');
//   //       const { move } = minimax(board, boardSize, 0, true);
//   //       const hardMove = move !== -1 ? move : getRandomMove(board);
//   //       console.log('🎯 Важкий хід:', hardMove);
//   //       return hardMove;
        
//   //     default:
//   //       return getRandomMove(board);
//   //   }
//   // }, [
//   //   getAvailableMoves, 
//   //   getRandomMove, 
//   //   getStrategicMove, 
//   //   minimax, 
//   //   config.difficulty, 
//   //   config.randomness
//   // ]);

//   // У функції getBestMove додайте лог і таймаут:
//   // const getBestMove = useCallback((
//   //   board: CellValue[], 
//   //   boardSize: BoardSize
//   // ): number => {
//   //   const availableMoves = getAvailableMoves(board);
//   //   console.log('🎯 getBestMove. Доступні ходи:', availableMoves);
    
//   //   if (availableMoves.length === 0) return -1;

//   //   const shouldUseRandom = Math.random() * 100 < config.randomness;
//   //   if (shouldUseRandom) {
//   //     const randomMove = getRandomMove(board);
//   //     console.log('🎲 Випадковий хід:', randomMove);
//   //     return randomMove;
//   //   }

//   //   switch (config.difficulty) {
//   //     case 'easy':
//   //       const easyMove = getRandomMove(board);
//   //       console.log('😊 Легкий хід:', easyMove);
//   //       return easyMove;
        
//   //     case 'medium':
//   //       const mediumMove = getStrategicMove(board, boardSize);
//   //       console.log('🧠 Середній хід:', mediumMove);
//   //       return mediumMove;
        
//   //     case 'hard':
//   //       console.log('🤖 Розрахунок важкого ходу...');
        
//   //       // 🔥 ДОДАЙТЕ ТАЙМАУТ ДЛЯ MINIMAX
//   //       const maxDepth = boardSize === 3 ? 9 : 6; // Для 3×3 - до кінця, для 4×4 - обмежено
//   //       const startTime = Date.now();
//   //       const { move } = minimax(board, boardSize, 0, true, -Infinity, Infinity, maxDepth);
//   //       const endTime = Date.now();
        
//   //       console.log(`⏱️ Minimax зайняв ${endTime - startTime}мс`);
        
//   //       if (endTime - startTime > 5000) { // Якщо більше 5 секунд
//   //         console.log('⚠️ Minimax занадто повільний, використовуємо стратегічний хід');
//   //         return getStrategicMove(board, boardSize);
//   //       }
        
//   //       const hardMove = move !== -1 ? move : getRandomMove(board);
//   //       console.log('🎯 Важкий хід:', hardMove);
//   //       return hardMove;
        
//   //     default:
//   //       return getRandomMove(board);
//   //   }
//   // }, [
//   //   getAvailableMoves, 
//   //   getRandomMove, 
//   //   getStrategicMove, 
//   //   minimax, 
//   //   config.difficulty, 
//   //   config.randomness
//   // ]);

//   // const getBestMove = useCallback(async (
//   //   board: CellValue[], 
//   //   boardSize: BoardSize
//   // ): Promise<number> => {
//   //   const availableMoves = getAvailableMoves(board);
//   //   console.log('🎯 getBestMove. Доступні ходи:', availableMoves);
    
//   //   if (availableMoves.length === 0) return -1;
  
//   //   const shouldUseRandom = Math.random() * 100 < config.randomness;
//   //   if (shouldUseRandom) {
//   //     return getRandomMove(board);
//   //   }
  
//   //   switch (config.difficulty) {
//   //     case 'easy':
//   //       return getRandomMove(board);
        
//   //     case 'medium':
//   //       return getStrategicMove(board, boardSize);
        
//   //     case 'hard':
//   //       console.log('🤖 Розрахунок важкого ходу...');
        
//   //       // 🔥 АСИНХРОННИЙ РОЗРАХУНОК
//   //       return new Promise((resolve) => {
//   //         setTimeout(() => {
//   //           const maxDepth = boardSize === 3 ? 6 : 4;
//   //           const { move } = minimax(board, boardSize, 0, true, -Infinity, Infinity, maxDepth);
//   //           const hardMove = move !== -1 ? move : getRandomMove(board);
//   //           resolve(hardMove);
//   //         }, 0); // 🔥 Змініть з 50 на 0 для швидшого відгуку
//   //       });
        
//   //     default:
//   //       return getRandomMove(board);
//   //   }
//   // }, [getAvailableMoves, getRandomMove, getStrategicMove, minimax, config]);

//   const getBestMove = useCallback(async (
//     board: CellValue[], 
//     boardSize: BoardSize
//   ): Promise<number> => {
//     const availableMoves = getAvailableMoves(board);
//     console.log('🎯 getBestMove. Доступні ходи:', availableMoves);
    
//     if (availableMoves.length === 0) return -1;
  
//     const shouldUseRandom = Math.random() * 100 < config.randomness;
//     if (shouldUseRandom) {
//       return getRandomMove(board);
//     }
  
//     switch (config.difficulty) {
//       case 'easy':
//         return getRandomMove(board);
        
//       case 'medium':
//         return getStrategicMove(board, boardSize);
        
//       case 'hard':
//         console.log('🤖 Використовуємо Web Worker для розрахунку...');
        
//         return new Promise((resolve) => {
//           // Створюємо worker якщо не існує
//           if (!workerRef.current) {
//             workerRef.current = new Worker('/ai-worker.js');
//           }
  
//           const worker = workerRef.current;
//           const playerSymbol = getOppositePlayer(config.aiSymbol);
  
//           worker.onmessage = (e) => {
//             const { success, move, error } = e.data;
//             if (success) {
//               console.log('🎯 Worker повернув хід:', move);
//               resolve(move);
//             } else {
//               console.error('❌ Worker помилка:', error);
//               resolve(getStrategicMove(board, boardSize)); // Fallback
//             }
//           };
  
//           worker.onerror = () => {
//             console.error('❌ Worker критична помилка');
//             resolve(getStrategicMove(board, boardSize)); // Fallback
//           };
  
//           // Відправляємо дані до worker
//           worker.postMessage({
//             board,
//             boardSize,
//             difficulty: config.difficulty,
//             aiSymbol: config.aiSymbol,
//             playerSymbol,
//             randomness: config.randomness
//           });
//         });
        
//       default:
//         return getRandomMove(board);
//     }
//   }, [getAvailableMoves, getRandomMove, getStrategicMove, config]);
//   //////////////////////////////////////////////////////////////////////////////////////////////

 
//   // const evaluatePosition = useCallback((
//   //   board: CellValue[], 
//   //   boardSize: BoardSize
//   // ): number => {
//   //   const winningConditions = generateWinningConditions(boardSize);
//   //   const result = isGameFinished(board, winningConditions);
//   //   const aiSymbol = config.aiSymbol;
//   //   const playerSymbol = getOppositePlayer(aiSymbol);

//   //   if (result.winner === aiSymbol) return 100;
//   //   if (result.winner === playerSymbol) return -100;
//   //   if (result.isDraw) return 0;

//   //   // Оцінити потенційні виграшні лінії
//   //   let score = 0;
    
//   //   for (const condition of winningConditions) {
//   //     let aiCount = 0;
//   //     let playerCount = 0;

//   //     for (const index of condition) {
//   //       if (board[index] === aiSymbol) aiCount++;
//   //       else if (board[index] === playerSymbol) playerCount++;
//   //     }

//   //     // Якщо лінія може бути виграшною для ШІ
//   //     if (playerCount === 0) {
//   //       score += aiCount * aiCount;
//   //     }
//   //     // Якщо лінія може бути виграшною для гравця
//   //     else if (aiCount === 0) {
//   //       score -= playerCount * playerCount;
//   //     }
//   //   }

//   //   return score;
//   // }, [config.aiSymbol]);

//   // Отримання кількох найкращих ходів
//   const getBestMoves = useCallback((
//     board: CellValue[], 
//     boardSize: BoardSize, 
//     count: number = 3
//   ): number[] => {
//     const availableMoves = getAvailableMoves(board);
    
//     const evaluatedMoves = availableMoves.map(move => {
//       const testBoard = makeMove([...board], move, config.aiSymbol);
//       const evaluation = evaluatePosition(testBoard, boardSize);
//       return { move, evaluation };
//     });

//     return evaluatedMoves
//       .sort((a, b) => b.evaluation - a.evaluation)
//       .slice(0, count)
//       .map(item => item.move);
//   }, [getAvailableMoves, evaluatePosition, config.aiSymbol]);

//   // Основна функція для розрахунку ходу ШІ
//   // const makeAIMove = useCallback(async (
//   //   board: CellValue[], 
//   //   boardSize: BoardSize
//   // ): Promise<number> => {
//   //   console.log('🧠 AI makeAIMove викликано:', { isThinking, board, boardSize });

//   //   if (isThinking) {
//   //   console.log('🤔 AI вже думає, повертаємо -1');
//   //   return -1;
//   // }

//   //   setIsThinking(true);
//   //   cancelledRef.current = false;

//   //   console.log('⏳ AI почав думати...');

//   //   return new Promise((resolve) => {
//   //     thinkingTimeoutRef.current = setTimeout(() => {
//   //       if (cancelledRef.current) {
//   //         console.log('🚫 AI хід скасовано');
//   //         setIsThinking(false);
//   //         resolve(-1);
//   //         return;
//   //       }

//   //       console.log('🎯 AI розраховує найкращий хід');
//   //       const move = getBestMove(board, boardSize);
//   //       console.log('🎲 AI вибрав хід:', move);
//   //       const evaluation = move !== -1 ? evaluatePosition(
//   //         makeMove([...board], move, config.aiSymbol), 
//   //         boardSize
//   //       ) : 0;

//   //       setLastMove(move);
//   //       setIsThinking(false);
        
//   //       onMoveCalculated?.(move, evaluation);
//   //       resolve(move);
//   //     }, config.thinkingTime);
//   //   });
//   // }, [
//   //   isThinking, 
//   //   getBestMove, 
//   //   evaluatePosition, 
//   //   config.aiSymbol, 
//   //   config.thinkingTime,
//   //   onMoveCalculated
//   // ]);
//   const makeAIMove = useCallback(async (
//     board: CellValue[], 
//     boardSize: BoardSize
//   ): Promise<number> => {
//     if (isThinking) return -1;
  
//     setIsThinking(true);
//     cancelledRef.current = false;
  
//     console.log('⏳ AI почав думати...');
  
//     // 🔥 ПРИБРАЛИ setTimeout, тепер getBestMove сам асинхронний
//     try {
//       const move = await getBestMove(board, boardSize);
      
//       if (cancelledRef.current) {
//         setIsThinking(false);
//         return -1;
//       }
  
//       const evaluation = move !== -1 ? evaluatePosition(
//         makeMove([...board], move, config.aiSymbol), 
//         boardSize
//       ) : 0;
  
//       setLastMove(move);
//       setIsThinking(false);
      
//       onMoveCalculated?.(move, evaluation);
//       return move;
//     } catch (error) {
//       console.error('AI помилка:', error);
//       setIsThinking(false);
//       return -1;
//     }
//   }, [isThinking, getBestMove, evaluatePosition, config.aiSymbol, onMoveCalculated]);

//   useEffect(() => {
//     return () => {
//       if (workerRef.current) {
//         workerRef.current.terminate();
//       }
//     };
//   }, []);

//   return {
//     // Стан ШІ
//     isThinking,
//     difficulty: config.difficulty,
//     lastMove,
    
//     // Дії
//     makeAIMove,
//     cancelAIMove,
//     updateConfig,
    
//     // Аналіз
//     evaluatePosition,
//     getBestMoves
//   };
// }



















































// // hooks/useAI.ts
// // ШІ для гри в хрестики-нулики з різними рівнями складності
// // ✅ Легкий рівень - випадкові ходи
// // ✅ Середній рівень - базова стратегія
// // ✅ Важкий рівень - мінімакс алгоритм
// // ✅ Налаштовувана затримка для реалістичності

// import { useCallback, useState, useRef, useEffect } from 'react';
// import type { CellValue, Player, BoardSize, RestrictedCells } from '../types/game';
// import { 
//   makeMove, 
//   checkWinner, 
//   isGameFinished,
//   generateWinningConditions,
//   getOppositePlayer 
// } from '../utils/gameUtils';

// export type AIDifficulty = 'easy' | 'medium' | 'hard';

// export interface AIConfig {
//   difficulty: AIDifficulty;
//   thinkingTime: number; // мс затримки перед ходом
//   aiSymbol: Player;
//   randomness: number; // 0-100, відсоток випадковості навіть на важкому рівні
// }

// export interface UseAIReturn {
//   // Стан ШІ
//   isThinking: boolean;
//   difficulty: AIDifficulty;
//   lastMove: number | null;
  
//   // Дії
//   makeAIMove: (board: CellValue[], boardSize: BoardSize, restrictedCells?: RestrictedCells) => Promise<number>; // ← ЗМІНИТИ
//   cancelAIMove: () => void;
//   updateConfig: (config: Partial<AIConfig>) => void;
  
//   // Аналіз
//   evaluatePosition: (board: CellValue[], boardSize: BoardSize) => number;
//   getBestMoves: (board: CellValue[], boardSize: BoardSize, count?: number) => number[];
// }

// interface UseAIOptions {
//   config: AIConfig;
//   onMoveCalculated?: (moveIndex: number, evaluation: number) => void;
// }

// export function useAI({
//   config: initialConfig,
//   onMoveCalculated
// }: UseAIOptions): UseAIReturn {
  
//   const [config, setConfig] = useState<AIConfig>(initialConfig);
//   const [isThinking, setIsThinking] = useState(false);
//   const [lastMove, setLastMove] = useState<number | null>(null);
  
//   const thinkingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
//   const cancelledRef = useRef(false);
//   const workerRef = useRef<Worker | null>(null);

//   // Очищення таймауту при демонтажі
//   const cleanup = useCallback(() => {
//     if (thinkingTimeoutRef.current) {
//       clearTimeout(thinkingTimeoutRef.current);
//       thinkingTimeoutRef.current = null;
//     }
//   }, []);

//   // Оновлення конфігурації
//   const updateConfig = useCallback((newConfig: Partial<AIConfig>) => {
//     setConfig(prev => ({ ...prev, ...newConfig }));
//   }, []);

//   // Скасування розрахунку ходу
//   const cancelAIMove = useCallback(() => {
//     cancelledRef.current = true;
//     setIsThinking(false);
//     cleanup();
//   }, [cleanup]);

//   // Отримання доступних ходів
//   const getAvailableMoves = useCallback((
//     board: CellValue[], 
//     restrictedCells?: RestrictedCells
//   ): number[] => {
//     return board
//       .map((cell, index) => {
//         // Перевіряємо чи клітинка вільна
//         if (cell !== '') return -1;
        
//         // Перевіряємо чи клітинка не обмежена (для 4×4)
//         if (restrictedCells && restrictedCells.includes(index)) return -1;
        
//         return index;
//       })
//       .filter(index => index !== -1);
//   }, []);

//   // Випадковий хід (легкий рівень)
//   const getRandomMove = useCallback((
//     board: CellValue[], 
//     restrictedCells?: RestrictedCells
//   ): number => {
//     const availableMoves = getAvailableMoves(board, restrictedCells);
//     if (availableMoves.length === 0) return -1;
    
//     return availableMoves[Math.floor(Math.random() * availableMoves.length)];
//   }, [getAvailableMoves]);

//   const evaluatePosition = useCallback((
//     board: CellValue[], 
//     boardSize: BoardSize
//   ): number => {
//     const winningConditions = generateWinningConditions(boardSize);
//     const result = isGameFinished(board, winningConditions);
//     const aiSymbol = config.aiSymbol;
//     const playerSymbol = getOppositePlayer(aiSymbol);

//     if (result.winner === aiSymbol) return 100;
//     if (result.winner === playerSymbol) return -100;
//     if (result.isDraw) return 0;

//     // Оцінити потенційні виграшні лінії
//     let score = 0;
    
//     for (const condition of winningConditions) {
//       let aiCount = 0;
//       let playerCount = 0;

//       for (const index of condition) {
//         if (board[index] === aiSymbol) aiCount++;
//         else if (board[index] === playerSymbol) playerCount++;
//       }

//       // Якщо лінія може бути виграшною для ШІ
//       if (playerCount === 0) {
//         score += aiCount * aiCount;
//       }
//       // Якщо лінія може бути виграшною для гравця
//       else if (aiCount === 0) {
//         score -= playerCount * playerCount;
//       }
//     }

//     return score;
//   }, [config.aiSymbol]);

//   // Стратегічний хід (середній рівень)
// // Замініть існуючу функцію getStrategicMove на цю:
// const getStrategicMove = useCallback((
//   board: CellValue[], 
//   boardSize: BoardSize,
//   restrictedCells?: RestrictedCells
// ): number => {
//   const availableMoves = getAvailableMoves(board, restrictedCells);
//   if (availableMoves.length === 0) return -1;

//   const winningConditions = generateWinningConditions(boardSize);
//   const aiSymbol = config.aiSymbol;
//   const playerSymbol = getOppositePlayer(aiSymbol);

//   // 1. Спробувати виграти
//   for (const move of availableMoves) {
//     const testBoard = makeMove(board, move, aiSymbol);
//     const result = checkWinner(testBoard, winningConditions);
//     if (result.winner === aiSymbol) {
//       return move;
//     }
//   }

//   // 2. Заблокувати виграш гравця
//   for (const move of availableMoves) {
//     const testBoard = makeMove(board, move, playerSymbol);
//     const result = checkWinner(testBoard, winningConditions);
//     if (result.winner === playerSymbol) {
//       return move;
//     }
//   }

//   // 3. 🔥 ПОКРАЩЕНА СТРАТЕГІЯ ДЛЯ 4×4
//   if (boardSize === 4) {
//     // Пріоритет центральним позиціям: індекси 5, 6, 9, 10
//     const centerPositions = [5, 6, 9, 10];
//     const availableCenters = centerPositions.filter(pos => availableMoves.includes(pos));
    
//     if (availableCenters.length > 0) {
//       // Вибираємо найкращий центр базуючись на потенціалі
//       let bestCenter = availableCenters[0];
//       let bestScore = -Infinity;
      
//       for (const center of availableCenters) {
//         const testBoard = makeMove([...board], center, aiSymbol);
//         const score = evaluatePosition(testBoard, boardSize);
//         if (score > bestScore) {
//           bestScore = score;
//           bestCenter = center;
//         }
//       }
//       return bestCenter;
//     }
    
//     // Потім позиції що контролюють лінії через центр
//     const strategicPositions = [1, 2, 4, 7, 8, 11, 13, 14];
//     let bestStrategic = -1;
//     let bestScore = -Infinity;
    
//     for (const pos of strategicPositions) {
//       if (availableMoves.includes(pos)) {
//         const testBoard = makeMove([...board], pos, aiSymbol);
//         const score = evaluatePosition(testBoard, boardSize);
//         if (score > bestScore) {
//           bestScore = score;
//           bestStrategic = pos;
//         }
//       }
//     }
    
//     if (bestStrategic !== -1) return bestStrategic;
//   }

//   // 4. Для 3×3 - центр, потім кути
//   if (boardSize === 3) {
//     const center = 4;
//     if (availableMoves.includes(center)) {
//       return center;
//     }
    
//     const corners = [0, 2, 6, 8];
//     const availableCorners = corners.filter(corner => availableMoves.includes(corner));
//     if (availableCorners.length > 0) {
//       return availableCorners[Math.floor(Math.random() * availableCorners.length)];
//     }
//   }

//   // 5. Найкращий доступний хід
//   let bestMove = availableMoves[0];
//   let bestScore = -Infinity;
  
//   for (const move of availableMoves) {
//     const testBoard = makeMove([...board], move, aiSymbol);
//     const score = evaluatePosition(testBoard, boardSize);
//     if (score > bestScore) {
//       bestScore = score;
//       bestMove = move;
//     }
//   }

//   return bestMove;
// }, [getAvailableMoves, getRandomMove, config.aiSymbol, evaluatePosition]);

//   // Мінімакс алгоритм (важкий рівень)
//  // Замініть вашу функцію minimax на цю виправлену версію:

// // Виправлена версія з обмеженням глибини та кешуванням
// const minimax = useCallback((
//   board: CellValue[],
//   boardSize: BoardSize,
//   depth: number,
//   isMaximizing: boolean,
//   alpha: number = -Infinity,
//   beta: number = Infinity,
//   maxDepth: number = 6 // 🔥 ДОДАЙТЕ ЦЕЙ ПАРАМЕТР
// ): { score: number; move: number } => {
//   const winningConditions = generateWinningConditions(boardSize);
//   const result = isGameFinished(board, winningConditions);
//   const aiSymbol = config.aiSymbol;
//   const playerSymbol = getOppositePlayer(aiSymbol);

//   // 🔥 ДОДАЙТЕ ЦЮ ПЕРЕВІРКУ ГЛИБИНИ
//   if (depth >= maxDepth) {
//     const score = evaluatePosition(board, boardSize);
//     console.log('⚠️ Досягнуто максимальної глибини:', depth, 'Оцінка:', score);
//     return { score, move: -1 };
//   }

//   // Базові випадки
//   if (result.winner === aiSymbol) return { score: 10 - depth, move: -1 };
//   if (result.winner === playerSymbol) return { score: depth - 10, move: -1 };
//   if (result.isDraw) return { score: 0, move: -1 };

//   const availableMoves = getAvailableMoves(board);
//   let bestMove = availableMoves[0] || -1;

//   if (isMaximizing) {
//     let maxScore = -Infinity;
    
//     for (const move of availableMoves) {
//       const boardCopy = [...board];
//       const newBoard = makeMove(boardCopy, move, aiSymbol);
//       const { score } = minimax(newBoard, boardSize, depth + 1, false, alpha, beta, maxDepth); // 🔥 ПЕРЕДАЙТЕ maxDepth
      
//       if (score > maxScore) {
//         maxScore = score;
//         bestMove = move;
//       }
      
//       alpha = Math.max(alpha, score);
//       if (beta <= alpha) break; // Alpha-beta відсікання
//     }
    
//     return { score: maxScore, move: bestMove };
//   } else {
//     let minScore = Infinity;
    
//     for (const move of availableMoves) {
//       const boardCopy = [...board];
//       const newBoard = makeMove(boardCopy, move, playerSymbol);
//       const { score } = minimax(newBoard, boardSize, depth + 1, true, alpha, beta, maxDepth); // 🔥 ПЕРЕДАЙТЕ maxDepth
      
//       if (score < minScore) {
//         minScore = score;
//         bestMove = move;
//       }
      
//       beta = Math.min(beta, score);
//       if (beta <= alpha) break; // Alpha-beta відсікання
//     }
    
//     return { score: minScore, move: bestMove };
//   }
// }, [getAvailableMoves, config.aiSymbol, evaluatePosition]); // 🔥 ДОДАЙТЕ evaluatePosition в залежності

//   // Отримання найкращого ходу залежно від рівня складності
//  //////////////////////////////////////////////////////////////////////////////////////////
//   // const getBestMove = useCallback((
//   //   board: CellValue[], 
//   //   boardSize: BoardSize
//   // ): number => {
//   //   const availableMoves = getAvailableMoves(board);
//   //   if (availableMoves.length === 0) return -1;

//   //   // Додати випадковість навіть на важкому рівні
//   //   const shouldUseRandom = Math.random() * 100 < config.randomness;
//   //   if (shouldUseRandom) {
//   //     return getRandomMove(board);
//   //   }

//   //   switch (config.difficulty) {
//   //     case 'easy':
//   //       return getRandomMove(board);
        
//   //     case 'medium':
//   //       return getStrategicMove(board, boardSize);
        
//   //     case 'hard':
//   //       const { move } = minimax(board, boardSize, 0, true);
//   //       return move !== -1 ? move : getRandomMove(board);
        
//   //     default:
//   //       return getRandomMove(board);
//   //   }
//   // }, [
//   //   getAvailableMoves, 
//   //   getRandomMove, 
//   //   getStrategicMove, 
//   //   minimax, 
//   //   config.difficulty, 
//   //   config.randomness
//   // ]);

//   // Оцінка позиції
 
//   // const getBestMove = useCallback((
//   //   board: CellValue[], 
//   //   boardSize: BoardSize
//   // ): number => {
//   //   const availableMoves = getAvailableMoves(board);
//   //   console.log('🎯 getBestMove. Доступні ходи:', availableMoves);
    
//   //   if (availableMoves.length === 0) return -1;
  
//   //   // Додати випадковість навіть на важкому рівні
//   //   const shouldUseRandom = Math.random() * 100 < config.randomness;
//   //   if (shouldUseRandom) {
//   //     const randomMove = getRandomMove(board);
//   //     console.log('🎲 Випадковий хід:', randomMove);
//   //     return randomMove;
//   //   }
  
//   //   switch (config.difficulty) {
//   //     case 'easy':
//   //       const easyMove = getRandomMove(board);
//   //       console.log('😊 Легкий хід:', easyMove);
//   //       return easyMove;
        
//   //     case 'medium':
//   //       const mediumMove = getStrategicMove(board, boardSize);
//   //       console.log('🧠 Середній хід:', mediumMove);
//   //       return mediumMove;
        
//   //     case 'hard':
//   //       console.log('🤖 Розрахунок важкого ходу...');
//   //       const { move } = minimax(board, boardSize, 0, true);
//   //       const hardMove = move !== -1 ? move : getRandomMove(board);
//   //       console.log('🎯 Важкий хід:', hardMove);
//   //       return hardMove;
        
//   //     default:
//   //       return getRandomMove(board);
//   //   }
//   // }, [
//   //   getAvailableMoves, 
//   //   getRandomMove, 
//   //   getStrategicMove, 
//   //   minimax, 
//   //   config.difficulty, 
//   //   config.randomness
//   // ]);

//   // У функції getBestMove додайте лог і таймаут:
//   // const getBestMove = useCallback((
//   //   board: CellValue[], 
//   //   boardSize: BoardSize
//   // ): number => {
//   //   const availableMoves = getAvailableMoves(board);
//   //   console.log('🎯 getBestMove. Доступні ходи:', availableMoves);
    
//   //   if (availableMoves.length === 0) return -1;

//   //   const shouldUseRandom = Math.random() * 100 < config.randomness;
//   //   if (shouldUseRandom) {
//   //     const randomMove = getRandomMove(board);
//   //     console.log('🎲 Випадковий хід:', randomMove);
//   //     return randomMove;
//   //   }

//   //   switch (config.difficulty) {
//   //     case 'easy':
//   //       const easyMove = getRandomMove(board);
//   //       console.log('😊 Легкий хід:', easyMove);
//   //       return easyMove;
        
//   //     case 'medium':
//   //       const mediumMove = getStrategicMove(board, boardSize);
//   //       console.log('🧠 Середній хід:', mediumMove);
//   //       return mediumMove;
        
//   //     case 'hard':
//   //       console.log('🤖 Розрахунок важкого ходу...');
        
//   //       // 🔥 ДОДАЙТЕ ТАЙМАУТ ДЛЯ MINIMAX
//   //       const maxDepth = boardSize === 3 ? 9 : 6; // Для 3×3 - до кінця, для 4×4 - обмежено
//   //       const startTime = Date.now();
//   //       const { move } = minimax(board, boardSize, 0, true, -Infinity, Infinity, maxDepth);
//   //       const endTime = Date.now();
        
//   //       console.log(`⏱️ Minimax зайняв ${endTime - startTime}мс`);
        
//   //       if (endTime - startTime > 5000) { // Якщо більше 5 секунд
//   //         console.log('⚠️ Minimax занадто повільний, використовуємо стратегічний хід');
//   //         return getStrategicMove(board, boardSize);
//   //       }
        
//   //       const hardMove = move !== -1 ? move : getRandomMove(board);
//   //       console.log('🎯 Важкий хід:', hardMove);
//   //       return hardMove;
        
//   //     default:
//   //       return getRandomMove(board);
//   //   }
//   // }, [
//   //   getAvailableMoves, 
//   //   getRandomMove, 
//   //   getStrategicMove, 
//   //   minimax, 
//   //   config.difficulty, 
//   //   config.randomness
//   // ]);

//   // const getBestMove = useCallback(async (
//   //   board: CellValue[], 
//   //   boardSize: BoardSize
//   // ): Promise<number> => {
//   //   const availableMoves = getAvailableMoves(board);
//   //   console.log('🎯 getBestMove. Доступні ходи:', availableMoves);
    
//   //   if (availableMoves.length === 0) return -1;
  
//   //   const shouldUseRandom = Math.random() * 100 < config.randomness;
//   //   if (shouldUseRandom) {
//   //     return getRandomMove(board);
//   //   }
  
//   //   switch (config.difficulty) {
//   //     case 'easy':
//   //       return getRandomMove(board);
        
//   //     case 'medium':
//   //       return getStrategicMove(board, boardSize);
        
//   //     case 'hard':
//   //       console.log('🤖 Розрахунок важкого ходу...');
        
//   //       // 🔥 АСИНХРОННИЙ РОЗРАХУНОК
//   //       return new Promise((resolve) => {
//   //         setTimeout(() => {
//   //           const maxDepth = boardSize === 3 ? 6 : 4;
//   //           const { move } = minimax(board, boardSize, 0, true, -Infinity, Infinity, maxDepth);
//   //           const hardMove = move !== -1 ? move : getRandomMove(board);
//   //           resolve(hardMove);
//   //         }, 0); // 🔥 Змініть з 50 на 0 для швидшого відгуку
//   //       });
        
//   //     default:
//   //       return getRandomMove(board);
//   //   }
//   // }, [getAvailableMoves, getRandomMove, getStrategicMove, minimax, config]);

//   const getBestMove = useCallback(async (
//     board: CellValue[], 
//     boardSize: BoardSize,
//     restrictedCells?: RestrictedCells  // ← ДОДАТИ ПАРАМЕТР
//   ): Promise<number> => {
//     const availableMoves = getAvailableMoves(board, restrictedCells);
//     console.log('🎯 getBestMove. Доступні ходи:', availableMoves);
    
//     if (availableMoves.length === 0) return -1;
  
//     const shouldUseRandom = Math.random() * 100 < config.randomness;
//     if (shouldUseRandom) {
//       return getRandomMove(board);
//     }
  
//     switch (config.difficulty) {
//       case 'easy':
//         return getRandomMove(board);
        
//       case 'medium':
//         return getStrategicMove(board, boardSize);
        
//       case 'hard':
//         console.log('🤖 Використовуємо Web Worker для розрахунку...');
        
//         return new Promise((resolve) => {
//           // Створюємо worker якщо не існує
//           if (!workerRef.current) {
//             workerRef.current = new Worker('/ai-worker.js');
//           }
  
//           const worker = workerRef.current;
//           const playerSymbol = getOppositePlayer(config.aiSymbol);
  
//           worker.onmessage = (e) => {
//             const { success, move, error } = e.data;
//             if (success) {
//               console.log('🎯 Worker повернув хід:', move);
//               resolve(move);
//             } else {
//               console.error('❌ Worker помилка:', error);
//               resolve(getStrategicMove(board, boardSize)); // Fallback
//             }
//           };
  
//           worker.onerror = () => {
//             console.error('❌ Worker критична помилка');
//             resolve(getStrategicMove(board, boardSize)); // Fallback
//           };
  
//           // Відправляємо дані до worker
//           worker.postMessage({
//             board,
//             boardSize,
//             difficulty: config.difficulty,
//             aiSymbol: config.aiSymbol,
//             playerSymbol,
//             randomness: config.randomness,
//             restrictedCells, // ← ДОДАЛИ
//             firstPlayer: config.aiSymbol === 'X' ? 'X' : 'O' // ← Простий fallback
//           });
//         });
        
//       default:
//         return getRandomMove(board);
//     }
//   }, [getAvailableMoves, getRandomMove, getStrategicMove, config]);
//   //////////////////////////////////////////////////////////////////////////////////////////////

 
//   // const evaluatePosition = useCallback((
//   //   board: CellValue[], 
//   //   boardSize: BoardSize
//   // ): number => {
//   //   const winningConditions = generateWinningConditions(boardSize);
//   //   const result = isGameFinished(board, winningConditions);
//   //   const aiSymbol = config.aiSymbol;
//   //   const playerSymbol = getOppositePlayer(aiSymbol);

//   //   if (result.winner === aiSymbol) return 100;
//   //   if (result.winner === playerSymbol) return -100;
//   //   if (result.isDraw) return 0;

//   //   // Оцінити потенційні виграшні лінії
//   //   let score = 0;
    
//   //   for (const condition of winningConditions) {
//   //     let aiCount = 0;
//   //     let playerCount = 0;

//   //     for (const index of condition) {
//   //       if (board[index] === aiSymbol) aiCount++;
//   //       else if (board[index] === playerSymbol) playerCount++;
//   //     }

//   //     // Якщо лінія може бути виграшною для ШІ
//   //     if (playerCount === 0) {
//   //       score += aiCount * aiCount;
//   //     }
//   //     // Якщо лінія може бути виграшною для гравця
//   //     else if (aiCount === 0) {
//   //       score -= playerCount * playerCount;
//   //     }
//   //   }

//   //   return score;
//   // }, [config.aiSymbol]);

//   // Отримання кількох найкращих ходів
//   const getBestMoves = useCallback((
//     board: CellValue[], 
//     boardSize: BoardSize, 
//     count: number = 3
//   ): number[] => {
//     const availableMoves = getAvailableMoves(board);
    
//     const evaluatedMoves = availableMoves.map(move => {
//       const testBoard = makeMove([...board], move, config.aiSymbol);
//       const evaluation = evaluatePosition(testBoard, boardSize);
//       return { move, evaluation };
//     });

//     return evaluatedMoves
//       .sort((a, b) => b.evaluation - a.evaluation)
//       .slice(0, count)
//       .map(item => item.move);
//   }, [getAvailableMoves, evaluatePosition, config.aiSymbol]);

//   // Основна функція для розрахунку ходу ШІ
//   // const makeAIMove = useCallback(async (
//   //   board: CellValue[], 
//   //   boardSize: BoardSize
//   // ): Promise<number> => {
//   //   console.log('🧠 AI makeAIMove викликано:', { isThinking, board, boardSize });

//   //   if (isThinking) {
//   //   console.log('🤔 AI вже думає, повертаємо -1');
//   //   return -1;
//   // }

//   //   setIsThinking(true);
//   //   cancelledRef.current = false;

//   //   console.log('⏳ AI почав думати...');

//   //   return new Promise((resolve) => {
//   //     thinkingTimeoutRef.current = setTimeout(() => {
//   //       if (cancelledRef.current) {
//   //         console.log('🚫 AI хід скасовано');
//   //         setIsThinking(false);
//   //         resolve(-1);
//   //         return;
//   //       }

//   //       console.log('🎯 AI розраховує найкращий хід');
//   //       const move = getBestMove(board, boardSize);
//   //       console.log('🎲 AI вибрав хід:', move);
//   //       const evaluation = move !== -1 ? evaluatePosition(
//   //         makeMove([...board], move, config.aiSymbol), 
//   //         boardSize
//   //       ) : 0;

//   //       setLastMove(move);
//   //       setIsThinking(false);
        
//   //       onMoveCalculated?.(move, evaluation);
//   //       resolve(move);
//   //     }, config.thinkingTime);
//   //   });
//   // }, [
//   //   isThinking, 
//   //   getBestMove, 
//   //   evaluatePosition, 
//   //   config.aiSymbol, 
//   //   config.thinkingTime,
//   //   onMoveCalculated
//   // ]);
//   const makeAIMove = useCallback(async (
//     board: CellValue[], 
//     boardSize: BoardSize,
//     restrictedCells?: RestrictedCells,  // ← ДОДАТИ ПАРАМЕТР
//   ): Promise<number> => {
//     if (isThinking) return -1;
  
//     setIsThinking(true);
//     cancelledRef.current = false;
  
//     console.log('⏳ AI почав думати...', restrictedCells);
  
//     // 🔥 ПРИБРАЛИ setTimeout, тепер getBestMove сам асинхронний
//     try {
//       const startTime = Date.now();
//       await new Promise(resolve => setTimeout(resolve, config.thinkingTime));
//       const actualDelay = Date.now() - startTime;
//       console.log('✅ AI закінчив думати, реальна затримка:', actualDelay, 'мс');   
      
//       // Перевіряємо чи не скасовано
//       if (cancelledRef.current) {
//         setIsThinking(false);
//         return -1;
//       }
//       const move = await getBestMove(board, boardSize, restrictedCells);
      
//       if (cancelledRef.current) {
//         setIsThinking(false);
//         return -1;
//       }
  
//       const evaluation = move !== -1 ? evaluatePosition(
//         makeMove([...board], move, config.aiSymbol), 
//         boardSize
//       ) : 0;
  
//       setLastMove(move);
//       setIsThinking(false);
      
//       onMoveCalculated?.(move, evaluation);
//       return move;
//     } catch (error) {
//       console.error('AI помилка:', error);
//       setIsThinking(false);
//       return -1;
//     }
//   }, [isThinking, getBestMove, evaluatePosition, config.aiSymbol, config.thinkingTime, onMoveCalculated]);

//   useEffect(() => {
//     return () => {
//       if (workerRef.current) {
//         workerRef.current.terminate();
//       }
//     };
//   }, []);

//   return {
//     // Стан ШІ
//     isThinking,
//     difficulty: config.difficulty,
//     lastMove,
    
//     // Дії
//     makeAIMove,
//     cancelAIMove,
//     updateConfig,
    
//     // Аналіз
//     evaluatePosition,
//     getBestMoves
//   };
// }


































// hooks/useAI.ts
// ШІ для гри в хрестики-нулики з різними рівнями складності
// ✅ Легкий рівень - випадкові ходи
// ✅ Середній рівень - базова стратегія
// ✅ Важкий рівень - мінімакс алгоритм через Web Worker
// ✅ Налаштовувана затримка для реалістичності

import { useCallback, useState, useRef, useEffect } from 'react';
import type { CellValue, Player, BoardSize, RestrictedCells } from '../types/game';
import { 
  makeMove, 
  checkWinner, 
  isGameFinished,
  generateWinningConditions,
  getOppositePlayer 
} from '../utils/gameUtils';

export type AIDifficulty = 'easy' | 'medium' | 'hard';

export interface AIConfig {
  difficulty: AIDifficulty;
  thinkingTime: number; // мс затримки перед ходом
  aiSymbol: Player;
  randomness: number; // 0-100, відсоток випадковості навіть на важкому рівні
}

export interface UseAIReturn {
  // Стан ШІ
  isThinking: boolean;
  difficulty: AIDifficulty;
  lastMove: number | null;
  
  // Дії
  makeAIMove: (board: CellValue[], boardSize: BoardSize, restrictedCells?: RestrictedCells, firstPlayer?: Player) => Promise<number>; // ← ЗМІНЕНО
  cancelAIMove: () => void;
  updateConfig: (config: Partial<AIConfig>) => void;
  
  // Аналіз
  evaluatePosition: (board: CellValue[], boardSize: BoardSize) => number;
  getBestMoves: (board: CellValue[], boardSize: BoardSize, count?: number) => number[];
}

interface UseAIOptions {
  config: AIConfig;
  onMoveCalculated?: (moveIndex: number, evaluation: number) => void;
}

export function useAI({
  config: initialConfig,
  onMoveCalculated
}: UseAIOptions): UseAIReturn {
  
  const [config, setConfig] = useState<AIConfig>(initialConfig);
  const [isThinking, setIsThinking] = useState(false);
  const [lastMove, setLastMove] = useState<number | null>(null);
  
  const thinkingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const cancelledRef = useRef(false);
  const workerRef = useRef<Worker | null>(null);

  // Очищення таймауту при демонтажі
  const cleanup = useCallback(() => {
    if (thinkingTimeoutRef.current) {
      clearTimeout(thinkingTimeoutRef.current);
      thinkingTimeoutRef.current = null;
    }
  }, []);

  // Оновлення конфігурації
  const updateConfig = useCallback((newConfig: Partial<AIConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  }, []);

  // Скасування розрахунку ходу
  const cancelAIMove = useCallback(() => {
    cancelledRef.current = true;
    setIsThinking(false);
    cleanup();
    
    // Також скасовуємо worker
    if (workerRef.current) {
      workerRef.current.terminate();
      workerRef.current = null;
    }
  }, [cleanup]);

  // Отримання доступних ходів
  const getAvailableMoves = useCallback((
    board: CellValue[], 
    restrictedCells?: RestrictedCells
  ): number[] => {
    return board
      .map((cell, index) => {
        // Перевіряємо чи клітинка вільна
        if (cell !== '') return -1;
        
        // Перевіряємо чи клітинка не обмежена (для 4×4)
        if (restrictedCells && restrictedCells.includes(index)) return -1;
        
        return index;
      })
      .filter(index => index !== -1);
  }, []);

  // Випадковий хід (легкий рівень)
  const getRandomMove = useCallback((
    board: CellValue[], 
    restrictedCells?: RestrictedCells
  ): number => {
    const availableMoves = getAvailableMoves(board, restrictedCells);
    if (availableMoves.length === 0) return -1;
    
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
  }, [getAvailableMoves]);

  const evaluatePosition = useCallback((
    board: CellValue[], 
    boardSize: BoardSize
  ): number => {
    const winningConditions = generateWinningConditions(boardSize);
    const result = isGameFinished(board, winningConditions);
    const aiSymbol = config.aiSymbol;
    const playerSymbol = getOppositePlayer(aiSymbol);

    if (result.winner === aiSymbol) return 100;
    if (result.winner === playerSymbol) return -100;
    if (result.isDraw) return 0;

    // Оцінити потенційні виграшні лінії
    let score = 0;
    
    for (const condition of winningConditions) {
      let aiCount = 0;
      let playerCount = 0;

      for (const index of condition) {
        if (board[index] === aiSymbol) aiCount++;
        else if (board[index] === playerSymbol) playerCount++;
      }

      // Якщо лінія може бути виграшною для ШІ
      if (playerCount === 0) {
        score += aiCount * aiCount;
      }
      // Якщо лінія може бути виграшною для гравця
      else if (aiCount === 0) {
        score -= playerCount * playerCount;
      }
    }

    return score;
  }, [config.aiSymbol]);

  // 🔥 ПОКРАЩЕНА СТРАТЕГІЧНА ФУНКЦІЯ
  const getStrategicMove = useCallback((
    board: CellValue[], 
    boardSize: BoardSize,
    restrictedCells?: RestrictedCells
  ): number => {
    const availableMoves = getAvailableMoves(board, restrictedCells);
    if (availableMoves.length === 0) return -1;

    const winningConditions = generateWinningConditions(boardSize);
    const aiSymbol = config.aiSymbol;
    const playerSymbol = getOppositePlayer(aiSymbol);

    // 1. Спробувати виграти
    for (const move of availableMoves) {
      const testBoard = makeMove(board, move, aiSymbol);
      const result = checkWinner(testBoard, winningConditions);
      if (result.winner === aiSymbol) {
        return move;
      }
    }

    // 2. Заблокувати виграш гравця - перевіряємо ВСІ ходи (навіть обмежені)
    const allAvailableMoves = board
      .map((cell, index) => cell === '' ? index : -1)
      .filter(index => index !== -1);

    for (const move of allAvailableMoves) {
      const testBoard = makeMove(board, move, playerSymbol);
      const result = checkWinner(testBoard, winningConditions);
      if (result.winner === playerSymbol) {
        console.log(`🛡️ Критичне блокування в позиції ${move} ${restrictedCells && restrictedCells.includes(move) ? '(ігнорує обмеження!)' : ''}`);
        return move; // Критичне блокування - ігноруємо обмеження
      }
    }

    // 3. 🔥 ПОКРАЩЕНА СТРАТЕГІЯ ДЛЯ 4×4
    if (boardSize === 4) {
      // Пріоритет центральним позиціям: індекси 5, 6, 9, 10
      const centerPositions = [5, 6, 9, 10];
      const availableCenters = centerPositions.filter(pos => availableMoves.includes(pos));
      
      if (availableCenters.length > 0) {
        // Вибираємо найкращий центр базуючись на потенціалі
        let bestCenter = availableCenters[0];
        let bestScore = -Infinity;
        
        for (const center of availableCenters) {
          const testBoard = makeMove([...board], center, aiSymbol);
          const score = evaluatePosition(testBoard, boardSize);
          if (score > bestScore) {
            bestScore = score;
            bestCenter = center;
          }
        }
        return bestCenter;
      }
      
      // Потім позиції що контролюють лінії через центр
      const strategicPositions = [1, 2, 4, 7, 8, 11, 13, 14];
      let bestStrategic = -1;
      let bestScore = -Infinity;
      
      for (const pos of strategicPositions) {
        if (availableMoves.includes(pos)) {
          const testBoard = makeMove([...board], pos, aiSymbol);
          const score = evaluatePosition(testBoard, boardSize);
          if (score > bestScore) {
            bestScore = score;
            bestStrategic = pos;
          }
        }
      }
      
      if (bestStrategic !== -1) return bestStrategic;
    }

    // 4. Для 3×3 - центр, потім кути
    if (boardSize === 3) {
      const center = 4;
      if (availableMoves.includes(center)) {
        return center;
      }
      
      const corners = [0, 2, 6, 8];
      const availableCorners = corners.filter(corner => availableMoves.includes(corner));
      if (availableCorners.length > 0) {
        return availableCorners[Math.floor(Math.random() * availableCorners.length)];
      }
    }

    // 5. Найкращий доступний хід
    let bestMove = availableMoves[0];
    let bestScore = -Infinity;
    
    for (const move of availableMoves) {
      const testBoard = makeMove([...board], move, aiSymbol);
      const score = evaluatePosition(testBoard, boardSize);
      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }

    return bestMove;
  }, [getAvailableMoves, config.aiSymbol, evaluatePosition]);

  // 🔥 ОСНОВНА ФУНКЦІЯ З WEB WORKER ПІДТРИМКОЮ
  const getBestMove = useCallback(async (
    board: CellValue[], 
    boardSize: BoardSize,
    restrictedCells?: RestrictedCells,
    firstPlayer?: Player
  ): Promise<number> => {
    const availableMoves = getAvailableMoves(board, restrictedCells);
    console.log('🎯 getBestMove. Доступні ходи:', availableMoves, 'Обмеження:', restrictedCells);
    
    if (availableMoves.length === 0) return -1;

    const shouldUseRandom = Math.random() * 100 < config.randomness;
    if (shouldUseRandom) {
      const randomMove = getRandomMove(board, restrictedCells);
      console.log('🎲 Випадковий хід:', randomMove);
      return randomMove;
    }

    switch (config.difficulty) {
      case 'easy':
        const easyMove = getRandomMove(board, restrictedCells);
        console.log('😊 Легкий хід:', easyMove);
        return easyMove;
        
      case 'medium':
        const mediumMove = getStrategicMove(board, boardSize, restrictedCells);
        console.log('🧠 Середній хід:', mediumMove);
        return mediumMove;
        
      case 'hard':
        console.log('🤖 Використовуємо Web Worker для розрахунку...');
        
        return new Promise((resolve) => {
          // Створюємо worker якщо не існує
          if (!workerRef.current) {
            try {
              workerRef.current = new Worker('/ai-worker.js');
            } catch (error) {
              console.error('❌ Не вдалося створити Worker:', error);
              resolve(getStrategicMove(board, boardSize, restrictedCells));
              return;
            }
          }

          const worker = workerRef.current;
          const playerSymbol = getOppositePlayer(config.aiSymbol);

          // Таймаут для worker (максимум 10 секунд)
          const workerTimeout = setTimeout(() => {
            console.warn('⏱️ Worker timeout, використовуємо fallback');
            worker.terminate();
            workerRef.current = null;
            resolve(getStrategicMove(board, boardSize, restrictedCells));
          }, 10000);

          worker.onmessage = (e) => {
            clearTimeout(workerTimeout);
            const { success, move, error, calculationTime, evaluation, fallbackMove } = e.data;
            
            if (success && move !== -1 && board[move] === '') {
              console.log(`🎯 Worker повернув хід: ${move} (${calculationTime}мс, eval: ${evaluation})`);
              resolve(move);
            } else if (fallbackMove !== -1 && board[fallbackMove] === '') {
              console.warn('🔄 Використовуємо fallback хід з Worker:', fallbackMove);
              resolve(fallbackMove);
            } else {
              console.error('❌ Worker помилка:', error);
              resolve(getStrategicMove(board, boardSize, restrictedCells));
            }
          };

          worker.onerror = (error) => {
            clearTimeout(workerTimeout);
            console.error('❌ Worker критична помилка:', error);
            worker.terminate();
            workerRef.current = null;
            resolve(getStrategicMove(board, boardSize, restrictedCells));
          };

          // 🔥 ВІДПРАВЛЯЄМО ВСІ НЕОБХІДНІ ДАНІ
          const workerData = {
            board,
            boardSize,
            difficulty: config.difficulty,
            aiSymbol: config.aiSymbol,
            playerSymbol,
            randomness: config.randomness,
            restrictedCells: restrictedCells || [],
            firstPlayer: firstPlayer || 'X'// 🔥 КРИТИЧНО ВАЖЛИВО!
          };

          console.log('📤 Відправляємо до Worker:', workerData);
          worker.postMessage(workerData);
        });
        
      default:
        return getRandomMove(board, restrictedCells);
    }
  }, [getAvailableMoves, getRandomMove, getStrategicMove, config]);

  // Отримання кількох найкращих ходів
  const getBestMoves = useCallback((
    board: CellValue[], 
    boardSize: BoardSize, 
    count: number = 3
  ): number[] => {
    const availableMoves = getAvailableMoves(board);
    
    const evaluatedMoves = availableMoves.map(move => {
      const testBoard = makeMove([...board], move, config.aiSymbol);
      const evaluation = evaluatePosition(testBoard, boardSize);
      return { move, evaluation };
    });

    return evaluatedMoves
      .sort((a, b) => b.evaluation - a.evaluation)
      .slice(0, count)
      .map(item => item.move);
  }, [getAvailableMoves, evaluatePosition, config.aiSymbol]);

  // 🔥 ГОЛОВНА ФУНКЦІЯ З ПІДТРИМКОЮ firstPlayer
  const makeAIMove = useCallback(async (
    board: CellValue[], 
    boardSize: BoardSize,
    restrictedCells?: RestrictedCells,
    firstPlayer?: Player // 🔥 ДОДАЛИ ПАРАМЕТР
  ): Promise<number> => {
    if (isThinking) {
      console.log('🤔 AI вже думає, повертаємо -1');
      return -1;
    }

    setIsThinking(true);
    cancelledRef.current = false;

    console.log('⏳ AI почав думати...', { 
      restrictedCells: restrictedCells?.length || 0,
      firstPlayer,
      difficulty: config.difficulty 
    });

    try {
      // Затримка для реалістичності
      if (config.thinkingTime > 0) {
        await new Promise(resolve => setTimeout(resolve, config.thinkingTime));
      }
      
      // Перевіряємо чи не скасовано
      if (cancelledRef.current) {
        console.log('🚫 AI хід скасовано');
        setIsThinking(false);
        return -1;
      }

      // 🔥 ПЕРЕДАЄМО firstPlayer
      const move = await getBestMove(board, boardSize, restrictedCells, firstPlayer);
      
      if (cancelledRef.current) {
        console.log('🚫 AI хід скасовано після розрахунку');
        setIsThinking(false);
        return -1;
      }

      // Валідація ходу
      if (move === -1 || board[move] !== '') {
        console.error('🔥 Невалідний хід від AI:', move, 'Board:', board);
        setIsThinking(false);
        return -1;
      }

      const evaluation = evaluatePosition(
        makeMove([...board], move, config.aiSymbol), 
        boardSize
      );

      setLastMove(move);
      setIsThinking(false);
      
      console.log(`✅ AI зробив хід: ${move} (оцінка: ${evaluation})`);
      onMoveCalculated?.(move, evaluation);
      return move;
      
    } catch (error) {
      console.error('❌ AI критична помилка:', error);
      setIsThinking(false);
      return -1;
    }
  }, [isThinking, getBestMove, evaluatePosition, config.aiSymbol, config.thinkingTime, onMoveCalculated]);

  // Очищення worker при демонтажі
  useEffect(() => {
    return () => {
      cleanup();
      if (workerRef.current) {
        workerRef.current.terminate();
        workerRef.current = null;
      }
    };
  }, [cleanup]);

  return {
    // Стан ШІ
    isThinking,
    difficulty: config.difficulty,
    lastMove,
    
    // Дії
    makeAIMove,
    cancelAIMove,
    updateConfig,
    
    // Аналіз
    evaluatePosition,
    getBestMoves
  };
}