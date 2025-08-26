// utils/aiUtils.ts
// Допоміжні функції для AI системи
// ✅ Стратегічний аналіз позицій
// ✅ Оптимізації мінімакс алгоритму
// ✅ Евристики для різних рівнів складності
// ✅ Кешування для покращення продуктивності

import type { 
    BoardSize, 
    CellValue, 
    Player, 
    Difficulty
  } from '../types/game';
  
  import {
    checkWinner,
    isGameFinished,
    generateWinningConditions,
    getOppositePlayer,
    getAvailableMoves,
    makeMove,
    getCornerCells,
    getEdgeCells
  } from './gameUtils';
  
  // Кеш для мінімакс обчислень
  const minimaxCache = new Map<string, { score: number; move: number }>();
  const MAX_CACHE_SIZE = 10000;
  
  // Очистка кешу при переповненні
  function clearCacheIfNeeded(): void {
    if (minimaxCache.size > MAX_CACHE_SIZE) {
      minimaxCache.clear();
    }
  }
  
  // Генерація хешу для позиції (для кешування)
  function getBoardHash(board: CellValue[], player: Player, depth: number): string {
    return `${board.join('')}_${player}_${depth}`;
  }
  
  // Оцінка позиції для заданого гравця
  export function evaluatePosition(
    board: CellValue[],
    boardSize: BoardSize,
    aiSymbol: Player
  ): number {
    const winningConditions = generateWinningConditions(boardSize);
    const result = isGameFinished(board, winningConditions);
    const playerSymbol = getOppositePlayer(aiSymbol);
  
    // Термінальні позиції
    if (result.winner === aiSymbol) return 1000;
    if (result.winner === playerSymbol) return -1000;
    if (result.isDraw) return 0;
  
    let score = 0;
  
    // Аналіз кожної виграшної лінії
    for (const condition of winningConditions) {
      let aiCount = 0;
      let playerCount = 0;
  
      for (const index of condition) {
        const cell = board[index];
        if (cell === aiSymbol) aiCount++;
        else if (cell === playerSymbol) playerCount++;
      }
  
      // Оцінка лінії
      if (playerCount === 0) {
        // Лінія доступна для AI
        if (aiCount === 2) score += 50;      // Два в ряд
        else if (aiCount === 1) score += 10; // Один в ряд
      } else if (aiCount === 0) {
        // Лінія доступна для гравця
        if (playerCount === 2) score -= 60;      // Блокуємо два в ряд
        else if (playerCount === 1) score -= 10; // Блокуємо один в ряд
      }
    }
  
    return score;
  }
  
  // Покращений мінімакс з альфа-бета відсіканням та кешуванням
  export function minimax(
    board: CellValue[],
    boardSize: BoardSize,
    depth: number,
    maxDepth: number,
    isMaximizing: boolean,
    aiSymbol: Player,
    alpha: number = -Infinity,
    beta: number = Infinity,
    useCache: boolean = true
  ): { score: number; move: number } {
    
    // Перевірка кешу
    const boardHash = getBoardHash(board, isMaximizing ? aiSymbol : getOppositePlayer(aiSymbol), depth);
    if (useCache && minimaxCache.has(boardHash)) {
      return minimaxCache.get(boardHash)!;
    }
  
    const winningConditions = generateWinningConditions(boardSize);
    const result = isGameFinished(board, winningConditions);
    const playerSymbol = getOppositePlayer(aiSymbol);
  
    // Термінальні випадки
    if (result.winner === aiSymbol) {
      const score = 1000 - depth; // Швидший виграш краще
      const result = { score, move: -1 };
      if (useCache) minimaxCache.set(boardHash, result);
      return result;
    }
    
    if (result.winner === playerSymbol) {
      const score = depth - 1000; // Повільніша поразка краще
      const result = { score, move: -1 };
      if (useCache) minimaxCache.set(boardHash, result);
      return result;
    }
    
    if (result.isDraw || depth >= maxDepth) {
      const score = evaluatePosition(board, boardSize, aiSymbol);
      const result = { score, move: -1 };
      if (useCache) minimaxCache.set(boardHash, result);
      return result;
    }
  
    const availableMoves = getAvailableMoves(board);
    let bestMove = availableMoves[0] || -1;
  
    if (isMaximizing) {
      let maxScore = -Infinity;
      
      for (const move of availableMoves) {
        const newBoard = makeMove(board, move, aiSymbol);
        const { score } = minimax(
          newBoard, 
          boardSize, 
          depth + 1, 
          maxDepth,
          false, 
          aiSymbol, 
          alpha, 
          beta, 
          useCache
        );
        
        if (score > maxScore) {
          maxScore = score;
          bestMove = move;
        }
        
        alpha = Math.max(alpha, score);
        if (beta <= alpha) break; // Альфа-бета відсікання
      }
      
      const result = { score: maxScore, move: bestMove };
      if (useCache) {
        clearCacheIfNeeded();
        minimaxCache.set(boardHash, result);
      }
      return result;
      
    } else {
      let minScore = Infinity;
      
      for (const move of availableMoves) {
        const newBoard = makeMove(board, move, playerSymbol);
        const { score } = minimax(
          newBoard, 
          boardSize, 
          depth + 1, 
          maxDepth,
          true, 
          aiSymbol, 
          alpha, 
          beta, 
          useCache
        );
        
        if (score < minScore) {
          minScore = score;
          bestMove = move;
        }
        
        beta = Math.min(beta, score);
        if (beta <= alpha) break; // Альфа-бета відсікання
      }
      
      const result = { score: minScore, move: bestMove };
      if (useCache) {
        clearCacheIfNeeded();
        minimaxCache.set(boardHash, result);
      }
      return result;
    }
  }
  
  // Стратегічний хід для середнього рівня
  export function getStrategicMove(
    board: CellValue[],
    boardSize: BoardSize,
    aiSymbol: Player
  ): number {
    const availableMoves = getAvailableMoves(board);
    if (availableMoves.length === 0) return -1;
  
    const winningConditions = generateWinningConditions(boardSize);
    const playerSymbol = getOppositePlayer(aiSymbol);
  
    // 1. Спробувати виграти
    for (const move of availableMoves) {
      const testBoard = makeMove(board, move, aiSymbol);
      const result = checkWinner(testBoard, winningConditions);
      if (result.winner === aiSymbol) {
        return move;
      }
    }
  
    // 2. Заблокувати виграш гравця
    for (const move of availableMoves) {
      const testBoard = makeMove(board, move, playerSymbol);
      const result = checkWinner(testBoard, winningConditions);
      if (result.winner === playerSymbol) {
        return move;
      }
    }
  
    // 3. Створити вилку (два способи виграти)
    const forkMove = findForkMove(board, boardSize, aiSymbol);
    if (forkMove !== -1 && availableMoves.includes(forkMove)) {
      return forkMove;
    }
  
    // 4. Заблокувати вилку опонента
    const blockForkMove = findForkMove(board, boardSize, playerSymbol);
    if (blockForkMove !== -1 && availableMoves.includes(blockForkMove)) {
      return blockForkMove;
    }
  
    // 5. Взяти центр (для 3x3)
    if (boardSize === 3) {
      const center = 4;
      if (availableMoves.includes(center)) {
        return center;
      }
    }
  
    // 6. Взяти протилежний кут якщо опонент зайняв кут
    const oppositeCorner = findOppositeCorner(board, boardSize, playerSymbol);
    if (oppositeCorner !== -1 && availableMoves.includes(oppositeCorner)) {
      return oppositeCorner;
    }
  
    // 7. Взяти вільний кут
    const corners = getCornerCells(boardSize);
    const availableCorners = corners.filter(corner => availableMoves.includes(corner));
    if (availableCorners.length > 0) {
      return availableCorners[Math.floor(Math.random() * availableCorners.length)];
    }
  
    // 8. Взяти край
    const edges = getEdgeCells(boardSize);
    const availableEdges = edges.filter(edge => availableMoves.includes(edge));
    if (availableEdges.length > 0) {
      return availableEdges[Math.floor(Math.random() * availableEdges.length)];
    }
  
    // 9. Випадковий хід
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
  }
  
  // Знаходження ходу що створює вилку
  function findForkMove(
    board: CellValue[],
    boardSize: BoardSize,
    player: Player
  ): number {
    const availableMoves = getAvailableMoves(board);
    const winningConditions = generateWinningConditions(boardSize);
  
    for (const move of availableMoves) {
      const testBoard = makeMove(board, move, player);
      let winningMoves = 0;
  
      // Перевіряємо скільки способів виграти після цього ходу
      const remainingMoves = getAvailableMoves(testBoard);
      for (const nextMove of remainingMoves) {
        const nextTestBoard = makeMove(testBoard, nextMove, player);
        const result = checkWinner(nextTestBoard, winningConditions);
        if (result.winner === player) {
          winningMoves++;
        }
      }
  
      // Якщо є два або більше способів виграти - це вилка
      if (winningMoves >= 2) {
        return move;
      }
    }
  
    return -1;
  }
  
  // Знаходження протилежного кута
  function findOppositeCorner(
    board: CellValue[],
    boardSize: BoardSize,  
    opponentSymbol: Player
  ): number {
    const corners = getCornerCells(boardSize);
    
    for (let i = 0; i < corners.length; i += 2) {
      const corner1 = corners[i];
      const corner2 = corners[i + 1];
      
      // Якщо опонент зайняв кут і протилежний вільний
      if (board[corner1] === opponentSymbol && board[corner2] === '') {
        return corner2;
      }
      if (board[corner2] === opponentSymbol && board[corner1] === '') {
        return corner1;
      }
    }
    
    return -1;
  }
  
  // Випадковий хід для легкого рівня
  export function getRandomMove(board: CellValue[]): number {
    const availableMoves = getAvailableMoves(board);
    if (availableMoves.length === 0) return -1;
    
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
  }
  
  // Отримання найкращого ходу залежно від складності
  export function getBestMove(
    board: CellValue[],
    boardSize: BoardSize,
    difficulty: Difficulty,
    aiSymbol: Player,
    randomness: number = 0
  ): number {
    const availableMoves = getAvailableMoves(board);
    if (availableMoves.length === 0) return -1;
  
    // Додати випадковість
    if (randomness > 0 && Math.random() * 100 < randomness) {
      return getRandomMove(board);
    }
  
    switch (difficulty) {
      case 'easy':
        return getRandomMove(board);
        
      case 'medium':
        return getStrategicMove(board, boardSize, aiSymbol);
        
      case 'hard':
        // Обмежуємо глибину пошуку для продуктивності
        const maxDepth = boardSize === 3 ? 9 : 6;
        const { move } = minimax(board, boardSize, 0, maxDepth, true, aiSymbol);
        return move !== -1 ? move : getRandomMove(board);
        
      default:
        return getRandomMove(board);
    }
  }
  
  // Отримання кількох найкращих ходів з оцінками
  export function getBestMoves(
    board: CellValue[],
    boardSize: BoardSize,
    aiSymbol: Player,
    count: number = 3
  ): Array<{ move: number; evaluation: number }> {
    const availableMoves = getAvailableMoves(board);
    
    const evaluatedMoves = availableMoves.map(move => {
      const testBoard = makeMove(board, move, aiSymbol);
      const evaluation = evaluatePosition(testBoard, boardSize, aiSymbol);
      return { move, evaluation };
    });
  
    return evaluatedMoves
      .sort((a, b) => b.evaluation - a.evaluation)
      .slice(0, count);
  }
  
  // Перевірка чи позиція програшна для гравця
  export function isLosingPosition(
    board: CellValue[],
    boardSize: BoardSize,
    playerSymbol: Player
  ): boolean {
    const aiSymbol = getOppositePlayer(playerSymbol);
    const evaluation = evaluatePosition(board, boardSize, aiSymbol);
    
    // Якщо AI має значну перевагу, позиція програшна
    return evaluation > 500;
  }
  
  // Аналіз складності позиції
  export function getPositionComplexity(
    board: CellValue[],
    boardSize: BoardSize
  ): 'simple' | 'medium' | 'complex' {
    const filledCells = board.filter(cell => cell !== '').length;
    const totalCells = boardSize * boardSize;
    const fillPercentage = filledCells / totalCells;
  
    if (fillPercentage < 0.3) return 'simple';   // Початок гри
    if (fillPercentage < 0.7) return 'medium';   // Середина гри
    return 'complex';                            // Кінець гри
  }
  
  // Очищення кешу (для експорту)
  export function clearMinimaxCache(): void {
    minimaxCache.clear();
  }
  
  // Статистика кешу
  export function getCacheStats(): { size: number; maxSize: number; hitRate: number } {
    return {
      size: minimaxCache.size,
      maxSize: MAX_CACHE_SIZE,
      hitRate: 0 // Можна додати лічильник хітів для обчислення
    };
  }
  
  // Налаштування AI для різних рівнів
  export function getAIConfig(difficulty: Difficulty): {
    useCache: boolean;
    maxDepth: number;
    randomness: number;
    thinkingTime: number;
  } {
    switch (difficulty) {
      case 'easy':
        return {
          useCache: false,
          maxDepth: 1,
          randomness: 80,
          thinkingTime: 500
        };
        
      case 'medium':
        return {
          useCache: true,
          maxDepth: 4,
          randomness: 20,
          thinkingTime: 1000
        };
        
      case 'hard':
        return {
          useCache: true,
          maxDepth: 9,
          randomness: 5,
          thinkingTime: 1500
        };
        
      default:
        return {
          useCache: false,
          maxDepth: 1,
          randomness: 100,
          thinkingTime: 500
        };
    }
  }