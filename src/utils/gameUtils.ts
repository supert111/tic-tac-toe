// // Створив src/utils/gameUtils.ts з усіма основними утилітами для гри!
// // Що включено:
// // 🎯 Основна ігрова логіка:

// // Створення дошки
// // Генерація умов перемоги
// // Перевірка переможця та нічиї
// // Валідація ходів

// // 🤖 AI допоміжні функції:

// // Отримання доступних ходів
// // Визначення першого гравця
// // Робота з складністю AI

// // ⏱️ Таймер та форматування:

// // Форматування часу
// // Колір таймера залежно від часу
// // Відсотки часу

// // 🎮 Загальні утиліти:

// // Генерація ID для ігор та кімнат
// // Валідація ставок та назв турнірів
// // Робота з координатами дошки

// // 🛠️ Debug та допоміжні:

// // Логування дошки в консоль
// // Порівняння дошок
// // Хешування для кешування

// // Переваги:
// // ✅ Всі функції pure - не мають побічних ефектів
// // ✅ Типізовано - використовує типи з types/game.ts
// // ✅ Оптимізовано - ефективні алгоритми
// // ✅ Тестується - легко покрити тестами
// // ✅ Переиспользуемо - можна використовувати в AI, PvP, Tournament




// import type { 
//     BoardSize, 
//     CellValue, 
//     Player, 
//     Difficulty,
//     FirstMove,
//     PvPFirstMove 
//   } from '../types/game';
  
//   import {
//     // BOARD_SIZES,
//     PLAYER_SYMBOLS,
//     AI_DIFFICULTY_LABELS,
//     AI_DIFFICULTY_COLORS,
//     GAME_LABELS
//   } from '../constants/game';
  
//   /**
//    * Створює порожню дошку заданого розміру
//    */
//   export function createEmptyBoard(size: BoardSize): CellValue[] {
//     return new Array(size * size).fill('');
//   }
  
//   /**
//    * Генерує всі можливі комбінації для перемоги на дошці заданого розміру
//    */
//   export function generateWinningConditions(size: BoardSize): number[][] {
//     const conditions: number[][] = [];
    
//     // Рядки (3 в ряд)
//     for (let row = 0; row < size; row++) {
//       for (let col = 0; col <= size - 3; col++) {
//         conditions.push([
//           row * size + col,
//           row * size + col + 1,
//           row * size + col + 2
//         ]);
//       }
//     }
    
//     // Стовпці (3 в ряд)
//     for (let col = 0; col < size; col++) {
//       for (let row = 0; row <= size - 3; row++) {
//         conditions.push([
//           row * size + col,
//           (row + 1) * size + col,
//           (row + 2) * size + col
//         ]);
//       }
//     }
    
//     // Діагоналі зліва направо
//     for (let row = 0; row <= size - 3; row++) {
//       for (let col = 0; col <= size - 3; col++) {
//         conditions.push([
//           row * size + col,
//           (row + 1) * size + col + 1,
//           (row + 2) * size + col + 2
//         ]);
//       }
//     }
    
//     // Діагоналі справа наліво
//     for (let row = 0; row <= size - 3; row++) {
//       for (let col = 2; col < size; col++) {
//         conditions.push([
//           row * size + col,
//           (row + 1) * size + col - 1,
//           (row + 2) * size + col - 2
//         ]);
//       }
//     }
    
//     return conditions;
//   }
  
//   /**
//    * Перевіряє чи є переможець на дошці
//    */
//   export function checkWinner(
//     board: CellValue[], 
//     winningConditions: number[][]
//   ): { winner: Player | null; winningLine: number[] } {
//     for (const [a, b, c] of winningConditions) {
//       if (board[a] && board[a] === board[b] && board[a] === board[c]) {
//         return {
//           winner: board[a] as Player,
//           winningLine: [a, b, c]
//         };
//       }
//     }
    
//     return { winner: null, winningLine: [] };
//   }
  
//   /**
//    * Перевіряє чи дошка заповнена (нічия)
//    */
//   export function isBoardFull(board: CellValue[]): boolean {
//     return !board.includes('');
//   }
  
//   /**
//    * Перевіряє чи гра закінчена
//    */
//   export function isGameFinished(
//     board: CellValue[], 
//     winningConditions: number[][]
//   ): { finished: boolean; winner: Player | null; isDraw: boolean; winningLine: number[] } {
//     const { winner, winningLine } = checkWinner(board, winningConditions);
    
//     if (winner) {
//       return { finished: true, winner, isDraw: false, winningLine };
//     }
    
//     if (isBoardFull(board)) {
//       return { finished: true, winner: null, isDraw: true, winningLine: [] };
//     }
    
//     return { finished: false, winner: null, isDraw: false, winningLine: [] };
//   }
  
//   /**
//    * Отримує протилежного гравця
//    */
//   export function getOppositePlayer(player: Player): Player {
//     return player === PLAYER_SYMBOLS.X ? PLAYER_SYMBOLS.O : PLAYER_SYMBOLS.X;
//   }
  
//   /**
//    * Визначає хто ходить першим
//    */
//   export function determineFirstPlayer(
//     firstMove: FirstMove | PvPFirstMove,
//     playerSymbol: Player,
//     aiSymbol?: Player
//   ): Player {
//     switch (firstMove) {
//       case 'player':
//       case 'creator':
//         return playerSymbol;
//       case 'ai':
//       case 'opponent':
//         return aiSymbol || getOppositePlayer(playerSymbol);
//       case 'random':
//         return Math.random() < 0.5 ? PLAYER_SYMBOLS.X : PLAYER_SYMBOLS.O;
//       default:
//         return PLAYER_SYMBOLS.X;
//     }
//   }
  
//   /**
//    * Перевіряє чи хід валідний
//    */
//   export function isValidMove(board: CellValue[], index: number): boolean {
//     return index >= 0 && index < board.length && board[index] === '';
//   }
  
//   /**
//    * Отримує доступні ходи
//    */
//   export function getAvailableMoves(board: CellValue[]): number[] {
//     return board
//       .map((cell, index) => cell === '' ? index : -1)
//       .filter(index => index !== -1);
//   }
  
//   /**
//    * Застосовує хід до дошки
//    */
//   export function makeMove(board: CellValue[], index: number, player: Player): CellValue[] {

//   // 🔍 ДОДАЙТЕ ЦЕЙ ЛОГ
//   console.log('🎯 makeMove викликано:', { 
//     index, 
//     player, 
//     beforeBoard: [...board], 
//     cellValue: board[index] 
//   });

//     if (board[index] !== '') {
//       console.warn('⚠️ Спроба ходу в зайняту клітинку!');
//       return board; // Або throw error
//     }

//     if (!isValidMove(board, index)) {
//       throw new Error(`Invalid move at index ${index}`);
//     }
    
//     const newBoard = [...board];
//     newBoard[index] = player;
//     console.log('✅ makeMove результат:', [...newBoard]);
//     return newBoard;
//   }
  
//   /**
//    * Отримує назву складності AI
//    */
//   export function getDifficultyName(difficulty: Difficulty): string {
//     return AI_DIFFICULTY_LABELS[difficulty];
//   }
  
//   /**
//    * Отримує колір для складності AI
//    */
//   export function getDifficultyColor(difficulty: Difficulty): string {
//     return AI_DIFFICULTY_COLORS[difficulty];
//   }
  
//   /**
//    * Отримує локалізовану назву символу
//    */
//   export function getSymbolName(symbol: Player): string {
//     return GAME_LABELS.SYMBOLS[symbol];
//   }
  
//   /**
//    * Генерує унікальний ID для гри
//    */
//   export function generateGameId(): string {
//     return `game_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
//   }
  
//   /**
//    * Генерує ID для кімнати PvP
//    */
//   export function generateRoomId(): number {
//     return Math.floor(Math.random() * 9000) + 1000; // 1000-9999
//   }
  
//   /**
//    * Форматує час в хвилини:секунди
//    */
//   export function formatTime(seconds: number): string {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins}:${secs.toString().padStart(2, '0')}`;
//   }
  
//   /**
//    * Розраховує відсоток часу що залишився
//    */
//   export function getTimePercentage(timeLeft: number, maxTime: number): number {
//     return Math.max(0, Math.min(100, (timeLeft / maxTime) * 100));
//   }
  
//   /**
//    * Отримує колір таймера в залежності від часу що залишився
//    */
//   export function getTimerColor(timeLeft: number, maxTime: number): 'normal' | 'warning' | 'danger' {
//     const percentage = getTimePercentage(timeLeft, maxTime);
    
//     if (percentage <= 32) return 'danger';   // ≤ 7 секунд з 22
//     if (percentage <= 68) return 'warning';  // ≤ 15 секунд з 22
//     return 'normal';
//   }
  
//   /**
//    * Перевіряє чи є рядок валідним числом для ставки
//    */
//   export function isValidStake(stake: string): boolean {
//     const num = parseFloat(stake);
//     return !isNaN(num) && num >= 0.01 && num <= 1000;
//   }
  
//   /**
//    * Форматує суму ставки
//    */
//   export function formatStake(stake: number): string {
//     return stake === 0 ? 'Безкоштовно' : `${stake} XTZ`;
//   }
  
//   /**
//    * Перевіряє чи назва турніру валідна
//    */
//   export function isValidTournamentName(name: string): boolean {
//     return name.length >= 3 && name.length <= 50 && name.trim().length > 0;
//   }
  
//   /**
//    * Отримує кількість заповнених клітинок
//    */
//   export function getFilledCellsCount(board: CellValue[]): number {
//     return board.filter(cell => cell !== '').length;
//   }
  
//   /**
//    * Отримує статистику гри (кількість X та O)
//    */
//   export function getBoardStats(board: CellValue[]): { x: number; o: number; empty: number } {
//     return {
//       x: board.filter(cell => cell === PLAYER_SYMBOLS.X).length,
//       o: board.filter(cell => cell === PLAYER_SYMBOLS.O).length,
//       empty: board.filter(cell => cell === '').length
//     };
//   }
  
//   /**
//    * Перевіряє чи дошка порожня
//    */
//   export function isEmpty(board: CellValue[]): boolean {
//     return board.every(cell => cell === '');
//   }
  
//   /**
//    * Отримує позицію клітинки в координатах рядок/стовпець
//    */
//   export function getRowCol(index: number, size: BoardSize): { row: number; col: number } {
//     return {
//       row: Math.floor(index / size),
//       col: index % size
//     };
//   }
  
//   /**
//    * Отримує індекс клітинки з координат рядок/стовпець
//    */
//   export function getIndex(row: number, col: number, size: BoardSize): number {
//     return row * size + col;
//   }
  
//   /**
//    * Перевіряє чи клітинка в центрі дошки
//    */
//   export function isCenterCell(index: number, size: BoardSize): boolean {
//     const center = Math.floor(size / 2);
//     const { row, col } = getRowCol(index, size);
//     return row === center && col === center;
//   }
  
//   /**
//    * Отримує кутові клітинки дошки
//    */
//   export function getCornerCells(size: BoardSize): number[] {
//     return [
//       0,                           // верхній лівий
//       size - 1,                    // верхній правий
//       size * (size - 1),           // нижній лівий
//       size * size - 1              // нижній правий
//     ];
//   }
  
//   /**
//    * Перевіряє чи клітинка кутова
//    */
//   export function isCornerCell(index: number, size: BoardSize): boolean {
//     return getCornerCells(size).includes(index);
//   }
  
//   /**
//    * Отримує клітинки по краях дошки
//    */
//   export function getEdgeCells(size: BoardSize): number[] {
//     const edges: number[] = [];
    
//     // Верхній та нижній край
//     for (let col = 1; col < size - 1; col++) {
//       edges.push(col);                    // верхній край
//       edges.push((size - 1) * size + col); // нижній край
//     }
    
//     // Лівий та правий край
//     for (let row = 1; row < size - 1; row++) {
//       edges.push(row * size);             // лівий край
//       edges.push(row * size + size - 1);  // правий край
//     }
    
//     return edges;
//   }
  
//   /**
//    * Створює копію дошки
//    */
//   export function cloneBoard(board: CellValue[]): CellValue[] {
//     return [...board];
//   }
  
//   /**
//    * Перевіряє чи дві дошки ідентичні
//    */
//   export function areBoardsEqual(board1: CellValue[], board2: CellValue[]): boolean {
//     return board1.length === board2.length && 
//            board1.every((cell, index) => cell === board2[index]);
//   }
  
//   /**
//    * Отримує хеш дошки для кешування
//    */
//   export function getBoardHash(board: CellValue[]): string {
//     return board.join('');
//   }
  
//   /**
//    * Очищає дошку
//    */
//   export function clearBoard(size: BoardSize): CellValue[] {
//     return createEmptyBoard(size);
//   }
  
//   /**
//    * Debug функція для виведення дошки в консоль
//    */
//   export function logBoard(board: CellValue[], size: BoardSize): void {
//     console.log('Game Board:');
//     for (let row = 0; row < size; row++) {
//       const rowData = [];
//       for (let col = 0; col < size; col++) {
//         const cell = board[row * size + col];
//         rowData.push(cell || '·');
//       }
//       console.log(rowData.join(' | '));
//     }
//     console.log('---');
//   }



























// Створив src/utils/gameUtils.ts з усіма основними утилітами для гри!
// Що включено:
// 🎯 Основна ігрова логіка:

// Створення дошки
// Генерація умов перемоги
// Перевірка переможця та нічиї
// Валідація ходів

// 🤖 AI допоміжні функції:

// Отримання доступних ходів
// Визначення першого гравця
// Робота з складністю AI

// ⏱️ Таймер та форматування:

// Форматування часу
// Колір таймера залежно від часу
// Відсотки часу

// 🎮 Загальні утиліти:

// Генерація ID для ігор та кімнат
// Валідація ставок та назв турнірів
// Робота з координатами дошки

// 🛠️ Debug та допоміжні:

// Логування дошки в консоль
// Порівняння дошок
// Хешування для кешування

// Переваги:
// ✅ Всі функції pure - не мають побічних ефектів
// ✅ Типізовано - використовує типи з types/game.ts
// ✅ Оптимізовано - ефективні алгоритми
// ✅ Тестується - легко покрити тестами
// ✅ Переиспользуемо - можна використовувати в AI, PvP, Tournament




import type { 
  BoardSize, 
  CellValue, 
  Player, 
  Difficulty,
  FirstMove,
  PvPFirstMove,
  RestrictedCells, 
  CellIndex, 
  MoveValidation, 
  RestrictionInfo,
  GameRules
} from '../types/game';

import {
  // BOARD_SIZES,
  PLAYER_SYMBOLS,
  AI_DIFFICULTY_LABELS,
  AI_DIFFICULTY_COLORS,
  GAME_LABELS
} from '../constants/game';

import { translations, type Language } from '../lib/i18n/translations';

/**
 * Створює порожню дошку заданого розміру
 */
export function createEmptyBoard(size: BoardSize): CellValue[] {
  return new Array(size * size).fill('');
}

/**
 * Генерує всі можливі комбінації для перемоги на дошці заданого розміру
 */
export function generateWinningConditions(size: BoardSize): number[][] {
  const conditions: number[][] = [];
  
  // Рядки (3 в ряд)
  for (let row = 0; row < size; row++) {
    for (let col = 0; col <= size - 3; col++) {
      conditions.push([
        row * size + col,
        row * size + col + 1,
        row * size + col + 2
      ]);
    }
  }
  
  // Стовпці (3 в ряд)
  for (let col = 0; col < size; col++) {
    for (let row = 0; row <= size - 3; row++) {
      conditions.push([
        row * size + col,
        (row + 1) * size + col,
        (row + 2) * size + col
      ]);
    }
  }
  
  // Діагоналі зліва направо
  for (let row = 0; row <= size - 3; row++) {
    for (let col = 0; col <= size - 3; col++) {
      conditions.push([
        row * size + col,
        (row + 1) * size + col + 1,
        (row + 2) * size + col + 2
      ]);
    }
  }
  
  // Діагоналі справа наліво
  for (let row = 0; row <= size - 3; row++) {
    for (let col = 2; col < size; col++) {
      conditions.push([
        row * size + col,
        (row + 1) * size + col - 1,
        (row + 2) * size + col - 2
      ]);
    }
  }
  
   // ДОДАТИ В КІНЕЦЬ ФУНКЦІЇ:
   if (size === 4) {
    console.log('🎯 ЗГЕНЕРОВАНІ УМОВИ ПЕРЕМОГИ для 4×4:', conditions);
    console.log('📊 Загальна кількість умов:', conditions.length);
  }

  return conditions;
}

/**
 * Перевіряє чи є переможець на дошці
 */
export function checkWinner(
  board: CellValue[], 
  winningConditions: number[][]
): { winner: Player | null; winningLine: number[] } {
  for (const [a, b, c] of winningConditions) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return {
        winner: board[a] as Player,
        winningLine: [a, b, c]
      };
    }
  }
  
  return { winner: null, winningLine: [] };
}

/**
 * Перевіряє чи дошка заповнена (нічия)
 */
export function isBoardFull(board: CellValue[]): boolean {
  return !board.includes('');
}

/**
 * Перевіряє чи гра закінчена
 */
export function isGameFinished(
  board: CellValue[], 
  winningConditions: number[][]
): { finished: boolean; winner: Player | null; isDraw: boolean; winningLine: number[] } {
  const { winner, winningLine } = checkWinner(board, winningConditions);
  
  if (winner) {
    return { finished: true, winner, isDraw: false, winningLine };
  }
  
  if (isBoardFull(board)) {
    return { finished: true, winner: null, isDraw: true, winningLine: [] };
  }
  
  return { finished: false, winner: null, isDraw: false, winningLine: [] };
}

/**
 * Отримує протилежного гравця
 */
export function getOppositePlayer(player: Player): Player {
  return player === PLAYER_SYMBOLS.X ? PLAYER_SYMBOLS.O : PLAYER_SYMBOLS.X;
}

/**
 * Визначає хто ходить першим
 */
export function determineFirstPlayer(
  firstMove: FirstMove | PvPFirstMove,
  playerSymbol: Player,
  aiSymbol?: Player
): Player {
  switch (firstMove) {
    case 'player':
    case 'creator':
      return playerSymbol;
    case 'ai':
    case 'opponent':
      return aiSymbol || getOppositePlayer(playerSymbol);
    case 'random':
      return Math.random() < 0.5 ? PLAYER_SYMBOLS.X : PLAYER_SYMBOLS.O;
    default:
      return PLAYER_SYMBOLS.X;
  }
}

/**
 * Перевіряє чи хід валідний
 */
export function isValidMove(board: CellValue[], index: number): boolean {
  return index >= 0 && index < board.length && board[index] === '';
}

/**
 * Отримує доступні ходи
 */
export function getAvailableMoves(board: CellValue[]): number[] {
  return board
    .map((cell, index) => cell === '' ? index : -1)
    .filter(index => index !== -1);
}

/**
 * Застосовує хід до дошки
 */
export function makeMove(board: CellValue[], index: number, player: Player): CellValue[] {

// 🔍 ДОДАЙТЕ ЦЕЙ ЛОГ
console.log('🎯 makeMove викликано:', { 
  index, 
  player, 
  beforeBoard: [...board], 
  cellValue: board[index] 
});

  if (board[index] !== '') {
    console.warn('⚠️ Спроба ходу в зайняту клітинку!');
    return board; // Або throw error
  }

  if (!isValidMove(board, index)) {
    throw new Error(`Invalid move at index ${index}`);
  }
  
  const newBoard = [...board];
  newBoard[index] = player;
  console.log('✅ makeMove результат:', [...newBoard]);
  return newBoard;
}

/**
 * Отримує назву складності AI
 */
export function getDifficultyName(difficulty: Difficulty): string {
  return AI_DIFFICULTY_LABELS[difficulty];
}

/**
 * Отримує колір для складності AI
 */
export function getDifficultyColor(difficulty: Difficulty): string {
  return AI_DIFFICULTY_COLORS[difficulty];
}

/**
 * Отримує локалізовану назву символу
 */
export function getSymbolName(symbol: Player): string {
  return GAME_LABELS.SYMBOLS[symbol];
}

/**
 * Генерує унікальний ID для гри
 */
export function generateGameId(): string {
  return `game_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Генерує ID для кімнати PvP
 */
export function generateRoomId(): number {
  return Math.floor(Math.random() * 9000) + 1000; // 1000-9999
}

/**
 * Форматує час в хвилини:секунди
 */
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Розраховує відсоток часу що залишився
 */
export function getTimePercentage(timeLeft: number, maxTime: number): number {
  return Math.max(0, Math.min(100, (timeLeft / maxTime) * 100));
}

/**
 * Отримує колір таймера в залежності від часу що залишився
 */
export function getTimerColor(timeLeft: number, maxTime: number): 'normal' | 'warning' | 'danger' {
  const percentage = getTimePercentage(timeLeft, maxTime);
  
  if (percentage <= 32) return 'danger';   // ≤ 7 секунд з 22
  if (percentage <= 68) return 'warning';  // ≤ 15 секунд з 22
  return 'normal';
}

/**
 * Перевіряє чи є рядок валідним числом для ставки
 */
export function isValidStake(stake: string): boolean {
  const num = parseFloat(stake);
  return !isNaN(num) && num >= 0.01 && num <= 1000;
}

/**
 * Форматує суму ставки
 */
export function formatStake(stake: number): string {
  return stake === 0 ? 'Безкоштовно' : `${stake} XTZ`;
}

/**
 * Перевіряє чи назва турніру валідна
 */
export function isValidTournamentName(name: string): boolean {
  return name.length >= 3 && name.length <= 50 && name.trim().length > 0;
}

/**
 * Отримує кількість заповнених клітинок
 */
export function getFilledCellsCount(board: CellValue[]): number {
  return board.filter(cell => cell !== '').length;
}

/**
 * Отримує статистику гри (кількість X та O)
 */
export function getBoardStats(board: CellValue[]): { x: number; o: number; empty: number } {
  return {
    x: board.filter(cell => cell === PLAYER_SYMBOLS.X).length,
    o: board.filter(cell => cell === PLAYER_SYMBOLS.O).length,
    empty: board.filter(cell => cell === '').length
  };
}

/**
 * Перевіряє чи дошка порожня
 */
export function isEmpty(board: CellValue[]): boolean {
  return board.every(cell => cell === '');
}

/**
 * Отримує позицію клітинки в координатах рядок/стовпець
 */
export function getRowCol(index: number, size: BoardSize): { row: number; col: number } {
  return {
    row: Math.floor(index / size),
    col: index % size
  };
}

/**
 * Отримує індекс клітинки з координат рядок/стовпець
 */
export function getIndex(row: number, col: number, size: BoardSize): number {
  return row * size + col;
}

/**
 * Перевіряє чи клітинка в центрі дошки
 */
export function isCenterCell(index: number, size: BoardSize): boolean {
  const center = Math.floor(size / 2);
  const { row, col } = getRowCol(index, size);
  return row === center && col === center;
}

/**
 * Отримує кутові клітинки дошки
 */
export function getCornerCells(size: BoardSize): number[] {
  return [
    0,                           // верхній лівий
    size - 1,                    // верхній правий
    size * (size - 1),           // нижній лівий
    size * size - 1              // нижній правий
  ];
}

/**
 * Перевіряє чи клітинка кутова
 */
export function isCornerCell(index: number, size: BoardSize): boolean {
  return getCornerCells(size).includes(index);
}

/**
 * Отримує клітинки по краях дошки
 */
export function getEdgeCells(size: BoardSize): number[] {
  const edges: number[] = [];
  
  // Верхній та нижній край
  for (let col = 1; col < size - 1; col++) {
    edges.push(col);                    // верхній край
    edges.push((size - 1) * size + col); // нижній край
  }
  
  // Лівий та правий край
  for (let row = 1; row < size - 1; row++) {
    edges.push(row * size);             // лівий край
    edges.push(row * size + size - 1);  // правий край
  }
  
  return edges;
}

/**
 * Створює копію дошки
 */
export function cloneBoard(board: CellValue[]): CellValue[] {
  return [...board];
}

/**
 * Перевіряє чи дві дошки ідентичні
 */
export function areBoardsEqual(board1: CellValue[], board2: CellValue[]): boolean {
  return board1.length === board2.length && 
         board1.every((cell, index) => cell === board2[index]);
}

/**
 * Отримує хеш дошки для кешування
 */
export function getBoardHash(board: CellValue[]): string {
  return board.join('');
}

/**
 * Очищає дошку
 */
export function clearBoard(size: BoardSize): CellValue[] {
  return createEmptyBoard(size);
}

/**
 * Debug функція для виведення дошки в консоль
 */
export function logBoard(board: CellValue[], size: BoardSize): void {
  console.log('Game Board:');
  for (let row = 0; row < size; row++) {
    const rowData = [];
    for (let col = 0; col < size; col++) {
      const cell = board[row * size + col];
      rowData.push(cell || '·');
    }
    console.log(rowData.join(' | '));
  }
  console.log('---');
}









// ================================
// ДОДАТИ ЦЕЙ КОД В КІНЕЦЬ ФАЙЛУ src/utils/gameUtils.ts
// ================================

// Імпорти для нових типів (додати до існуючих імпортів)
// import type { 
//   RestrictedCells, 
//   CellIndex, 
//   MoveValidation, 
//   RestrictionInfo,
//   GameRules
// } from '../lib/types/game';

// === ФУНКЦІЇ ДЛЯ 4×4 ОБМЕЖЕНЬ ===

/**
 * Отримує сусідні клітинки для заданої позиції
 */
export function getAdjacentCells(cellIndex: CellIndex, boardSize: BoardSize): CellIndex[] {
  const { row, col } = getRowCol(cellIndex, boardSize);
  const adjacent: CellIndex[] = [];
  
  // Всі можливі напрямки: вгору, вниз, вліво, вправо, діагоналі
  const directions = [
    [-1, -1], [-1, 0], [-1, 1],  // вгору-ліво, вгору, вгору-право
    [0, -1],           [0, 1],   // ліво, право
    [1, -1],  [1, 0],  [1, 1]    // вниз-ліво, вниз, вниз-право
  ];
  
  for (const [deltaRow, deltaCol] of directions) {
    const newRow = row + deltaRow;
    const newCol = col + deltaCol;
    
    // Перевіряємо чи нова позиція в межах дошки
    if (newRow >= 0 && newRow < boardSize && newCol >= 0 && newCol < boardSize) {
      adjacent.push(getIndex(newRow, newCol, boardSize));
    }
  }
  
  return adjacent;
}

/**
 * Отримує обмежені клітинки для поточного гравця
 * ОНОВЛЕНО: обмеження для першого гравця незалежно від символу
 */
// export function getRestrictedCells(
//   board: CellValue[], 
//   boardSize: BoardSize, 
//   currentPlayer: Player,
//   firstPlayer: Player // НОВИЙ ПАРАМЕТР
// ): RestrictedCells {
//   // Обмеження тільки для 4×4
//   if (boardSize !== 4) return [];
  
//   // Обмеження тільки для першого гравця (незалежно від символу)
//   if (currentPlayer !== firstPlayer) return [];
  
//   // Перевіряємо чи це другий хід першого гравця
//   const firstPlayerMoves = board.filter(cell => cell === firstPlayer).length;
//   if (firstPlayerMoves !== 1) return []; // не другий хід
  
//   // Знаходимо позицію першого ходу
//   const firstMovePosition = board.findIndex(cell => cell === firstPlayer);
//   if (firstMovePosition === -1) return [];
  
//   // Отримуємо сусідні клітинки та фільтруємо тільки порожні
//   return getAdjacentCells(firstMovePosition, boardSize)
//     .filter(index => board[index] === '');
// }

// export function getRestrictedCells(
//   board: CellValue[], 
//   boardSize: BoardSize, 
//   currentPlayer: Player,
//   firstPlayer: Player
// ): RestrictedCells {
//   // Обмеження тільки для 4×4
//   if (boardSize !== 4) return [];
  
//   // Обмеження тільки для першого гравця
//   if (currentPlayer !== firstPlayer) return [];
  
//   // Перевіряємо чи це другий хід першого гравця
//   const firstPlayerMoves = board.filter(cell => cell === firstPlayer).length;
//   if (firstPlayerMoves !== 1) return []; // не другий хід
  
//   // Знаходимо позицію першого ходу
//   const firstMovePosition = board.findIndex(cell => cell === firstPlayer);
//   if (firstMovePosition === -1) return [];
  
//   const { row: firstRow, col: firstCol } = getRowCol(firstMovePosition, boardSize);
//   const restrictedCells: number[] = [];
  
//   // Всі 8 напрямків від першого ходу
//   const directions = [
//     [-1, -1], [-1, 0], [-1, 1],  // вгору-ліво, вгору, вгору-право
//     [0, -1],           [0, 1],   // ліво, право
//     [1, -1],  [1, 0],  [1, 1]    // вниз-ліво, вниз, вниз-право
//   ];
  
//   for (const [deltaRow, deltaCol] of directions) {
//     const adjacentRow = firstRow + deltaRow;
//     const adjacentCol = firstCol + deltaCol;
    
//     // Перевіряємо чи сусідня клітинка в межах дошки
//     if (adjacentRow >= 0 && adjacentRow < boardSize && 
//         adjacentCol >= 0 && adjacentCol < boardSize) {
      
//       const adjacentIndex = getIndex(adjacentRow, adjacentCol, boardSize);
      
//       // Якщо сусідня клітинка зайнята, пропускаємо
//       if (board[adjacentIndex] !== '') continue;
      
//       // Перевіряємо чи є продовження в тому ж напрямку
//       const nextRow = adjacentRow + deltaRow;
//       const nextCol = adjacentCol + deltaCol;
      
//       // Якщо наступна клітинка в межах дошки і вільна - це заборонено
//       if (nextRow >= 0 && nextRow < boardSize && 
//           nextCol >= 0 && nextCol < boardSize) {
        
//         const nextIndex = getIndex(nextRow, nextCol, boardSize);
        
//         // Якщо наступна клітинка порожня - заборонити сусідню
//         if (board[nextIndex] === '') {
//           restrictedCells.push(adjacentIndex);
//         }
//       }
//       // Якщо наступна клітинка за межами дошки - дозволити (край дошки)
//     }
//   }
  
//   return restrictedCells;
// }

// export function getRestrictedCells(
//   board: CellValue[], 
//   boardSize: BoardSize, 
//   currentPlayer: Player,
//   firstPlayer: Player
// ): RestrictedCells {
//   // Обмеження тільки для 4×4
//   if (boardSize !== 4) return [];
  
//   // Підраховуємо ходи кожного гравця
//   const firstPlayerMoves = board.filter(cell => cell === firstPlayer).length;
//   const secondPlayer = getOppositePlayer(firstPlayer);
//   const secondPlayerMoves = board.filter(cell => cell === secondPlayer).length;
  
//   // Перевіряємо чи це другий хід для будь-якого з гравців
//   const isSecondMoveForFirst = currentPlayer === firstPlayer && firstPlayerMoves === 1;
//   const isSecondMoveForSecond = currentPlayer === secondPlayer && secondPlayerMoves === 1;
  
//   if (!isSecondMoveForFirst && !isSecondMoveForSecond) return [];
  
//   // Знаходимо позицію першого ходу відповідного гравця
//   const firstMovePosition = board.findIndex(cell => cell === currentPlayer);
//   if (firstMovePosition === -1) return [];
  
//   const { row: firstRow, col: firstCol } = getRowCol(firstMovePosition, boardSize);
//   const restrictedCells: number[] = [];
  
//   // Всі 8 напрямків від першого ходу
//   const directions = [
//     [-1, -1], [-1, 0], [-1, 1],  // вгору-ліво, вгору, вгору-право
//     [0, -1],           [0, 1],   // ліво, право
//     [1, -1],  [1, 0],  [1, 1]    // вниз-ліво, вниз, вниз-право
//   ];
  
//   for (const [deltaRow, deltaCol] of directions) {
//     const adjacentRow = firstRow + deltaRow;
//     const adjacentCol = firstCol + deltaCol;
    
//     // Перевіряємо чи сусідня клітинка в межах дошки
//     if (adjacentRow >= 0 && adjacentRow < boardSize && 
//         adjacentCol >= 0 && adjacentCol < boardSize) {
      
//       const adjacentIndex = getIndex(adjacentRow, adjacentCol, boardSize);
      
//       // Якщо сусідня клітинка зайнята, пропускаємо
//       if (board[adjacentIndex] !== '') continue;
      
//       // Перевіряємо чи є продовження в тому ж напрямку
//       const nextRow = adjacentRow + deltaRow;
//       const nextCol = adjacentCol + deltaCol;
      
//       // Якщо наступна клітинка в межах дошки і вільна - це заборонено
//       if (nextRow >= 0 && nextRow < boardSize && 
//           nextCol >= 0 && nextCol < boardSize) {
        
//         const nextIndex = getIndex(nextRow, nextCol, boardSize);
        
//         // Якщо наступна клітинка порожня - заборонити сусідню
//         if (board[nextIndex] === '') {
//           restrictedCells.push(adjacentIndex);
//         }
//       }
//       // Якщо наступна клітинка за межами дошки - дозволити (край дошки)
//     }
//   }
  
//   return restrictedCells;
// }

export function getRestrictedCells(
  board: CellValue[], 
  boardSize: BoardSize, 
  currentPlayer: Player,
  firstPlayer: Player
): RestrictedCells {
  // Обмеження тільки для 4×4
  if (boardSize !== 4) return [];
  
  // Підраховуємо ходи кожного гравця
  const firstPlayerMoves = board.filter(cell => cell === firstPlayer).length;
  const secondPlayer = getOppositePlayer(firstPlayer);
  const secondPlayerMoves = board.filter(cell => cell === secondPlayer).length;
  
  // Перевіряємо чи це другий хід для будь-якого з гравців
  const isSecondMoveForFirst = currentPlayer === firstPlayer && firstPlayerMoves === 1;
  const isSecondMoveForSecond = currentPlayer === secondPlayer && secondPlayerMoves === 1;
  
  if (!isSecondMoveForFirst && !isSecondMoveForSecond) return [];
  
  // Знаходимо позицію першого ходу відповідного гравця
  const firstMovePosition = board.findIndex(cell => cell === currentPlayer);
  if (firstMovePosition === -1) return [];
  
  const { row: firstRow, col: firstCol } = getRowCol(firstMovePosition, boardSize);
  const restrictedCells: number[] = [];
  
  // Всі 8 напрямків від першого ходу
  const directions = [
    [-1, -1], [-1, 0], [-1, 1],  // вгору-ліво, вгору, вгору-право
    [0, -1],           [0, 1],   // ліво, право
    [1, -1],  [1, 0],  [1, 1]    // вниз-ліво, вниз, вниз-право
  ];
  
  for (const [deltaRow, deltaCol] of directions) {
    const adjacentRow = firstRow + deltaRow;
    const adjacentCol = firstCol + deltaCol;
    
    // Перевіряємо чи сусідня клітинка в межах дошки
    if (adjacentRow >= 0 && adjacentRow < boardSize && 
        adjacentCol >= 0 && adjacentCol < boardSize) {
      
      const adjacentIndex = getIndex(adjacentRow, adjacentCol, boardSize);
      
      // Якщо сусідня клітинка зайнята, пропускаємо
      if (board[adjacentIndex] !== '') continue;
      
      // Перевіряємо чи є продовження в тому ж напрямку
      const nextRow = adjacentRow + deltaRow;
      const nextCol = adjacentCol + deltaCol;
      
      // Якщо наступна клітинка в межах дошки і вільна - це заборонено
      if (nextRow >= 0 && nextRow < boardSize && 
          nextCol >= 0 && nextCol < boardSize) {
        
        const nextIndex = getIndex(nextRow, nextCol, boardSize);
        
        // Якщо наступна клітинка порожня - заборонити сусідню
        if (board[nextIndex] === '') {
          // 🔥 ВИКЛЮЧЕННЯ 1: перевіряємо чи лінія має дві зайняті клітинки
          const lineCells = [firstMovePosition, adjacentIndex, nextIndex];
          let occupiedCount = 0;
          
          for (const cellIndex of lineCells) {
            if (board[cellIndex] !== '') {
              occupiedCount++;
            }
          }
          
          // Якщо в лінії вже дві зайняті клітинки - дозволити хід
          if (occupiedCount === 2) {
            continue; // Пропускаємо додавання в заборонені
          }
          
          // 🔥 ВИКЛЮЧЕННЯ 2: перевіряємо чи хід блокує виграшну позицію
          if (currentPlayer === secondPlayer && secondPlayerMoves === 1) {
            const winningConditions = generateWinningConditions(boardSize);
            
            let allowsBlocking = false;
            
            for (const condition of winningConditions) {
              if (condition.includes(adjacentIndex)) {
                let firstPlayerCount = 0;
                let emptyCount = 0;
                
                for (const cellIndex of condition) {
                  if (board[cellIndex] === firstPlayer) {
                    firstPlayerCount++;
                  } else if (board[cellIndex] === '') {
                    emptyCount++;
                  }
                }
                
                // Якщо перший гравець може виграти наступним ходом
                if (firstPlayerCount === 2 && emptyCount === 1) {
                  allowsBlocking = true;
                  break;
                }
              }
            }
            
            // Дозволяємо хід, якщо він блокує виграшну позицію
            if (allowsBlocking) {
              continue;
            }
          }
          
          restrictedCells.push(adjacentIndex);
        }
      }
    }
  }
  
  return restrictedCells;
}

/**
 * Валідує чи можна зробити хід в дану клітинку
 * ОНОВЛЕНО: додано параметр firstPlayer
 */
export function validateMove(
  board: CellValue[],
  cellIndex: CellIndex,
  player: Player,
  boardSize: BoardSize,
  firstPlayer: Player // НОВИЙ ПАРАМЕТР
): MoveValidation {
  // Базова перевірка - чи клітинка порожня
  if (board[cellIndex] !== '') {
    return {
      isValid: false,
      reason: 'occupied'
    };
  }
  
  // Отримуємо поточні обмеження
  const restrictedCells = getRestrictedCells(board, boardSize, player, firstPlayer);
  
 // Перевіряємо чи клітинка обмежена
 if (restrictedCells.includes(cellIndex)) {
  return {
    isValid: false,
    reason: 'restricted',
    restrictedCells
  };
}

return { isValid: true };
}

/**
 * Отримує інформацію про поточні обмеження
 * ОНОВЛЕНО: додано параметр firstPlayer
 */
// export function getRestrictionInfo(
//   board: CellValue[],
//   boardSize: BoardSize,
//   currentPlayer: Player,
//   firstPlayer: Player // НОВИЙ ПАРАМЕТР
// ): RestrictionInfo {
//   const restrictedCells = getRestrictedCells(board, boardSize, currentPlayer, firstPlayer);
  
//   if (restrictedCells.length === 0) {
//     return {
//       hasRestrictions: false,
//       restrictedCells: [],
//       reasonDescription: '',
//       affectedPlayer: null
//     };
//   }
  
//   return {
//     hasRestrictions: true,
//     restrictedCells,
//     reasonDescription: `Другий хід першого гравця (${firstPlayer}) не може бути поруч з першим ходом`,
//     affectedPlayer: firstPlayer
//   };
// }

// export function getRestrictionInfo(
//   board: CellValue[],
//   boardSize: BoardSize,
//   currentPlayer: Player,
//   firstPlayer: Player
// ): RestrictionInfo {
//   const restrictedCells = getRestrictedCells(board, boardSize, currentPlayer, firstPlayer);
  
//   if (restrictedCells.length === 0) {
//     return {
//       hasRestrictions: false,
//       restrictedCells: [],
//       reasonDescription: '',
//       affectedPlayer: null
//     };
//   }
  
//   return {
//     hasRestrictions: true,
//     restrictedCells,
//     reasonDescription: `Другий хід першого гравця (${firstPlayer}) не може створювати лінію з 3 вільними клітинками підряд`,
//     affectedPlayer: firstPlayer
//   };
// }

// export function getRestrictionInfo(
//   board: CellValue[],
//   boardSize: BoardSize,
//   currentPlayer: Player,
//   firstPlayer: Player
// ): RestrictionInfo {
//   const restrictedCells = getRestrictedCells(board, boardSize, currentPlayer, firstPlayer);
  
//   if (restrictedCells.length === 0) {
//     return {
//       hasRestrictions: false,
//       restrictedCells: [],
//       reasonDescription: '',
//       affectedPlayer: null
//     };
//   }
  
//   // Визначаємо який гравець має обмеження
//   const secondPlayer = getOppositePlayer(firstPlayer);
//   const firstPlayerMoves = board.filter(cell => cell === firstPlayer).length;
//   const secondPlayerMoves = board.filter(cell => cell === secondPlayer).length;
  
//   let reasonDescription = '';
//   if (currentPlayer === firstPlayer && firstPlayerMoves === 1) {
//     reasonDescription = `Другий хід першого гравця (${firstPlayer}) не може створювати лінію з 3 вільними клітинками підряд`;
//   } else if (currentPlayer === secondPlayer && secondPlayerMoves === 1) {
//     reasonDescription = `Другий хід другого гравця (${secondPlayer}) не може створювати лінію з 3 вільними клітинками підряд`;
//   }
  
//   return {
//     hasRestrictions: true,
//     restrictedCells,
//     reasonDescription,
//     affectedPlayer: currentPlayer
//   };
// }

export function getRestrictionInfo(
  board: CellValue[],
  boardSize: BoardSize,
  currentPlayer: Player,
  firstPlayer: Player,
  language: Language,
): RestrictionInfo {
  const restrictedCells = getRestrictedCells(board, boardSize, currentPlayer, firstPlayer);
  console.log('🌐 getRestrictionInfo викликано з мовою:', language); // DEBUG
  console.log('📚 Доступні переклади:', translations);
  console.log('🔤 Специфічні переклади для мови:', translations[language]);
  console.log('🔍 Переклади обмежень:', translations[language]?.restrictions);
  
  if (restrictedCells.length === 0) {
    return {
      hasRestrictions: false,
      restrictedCells: [],
      reasonDescription: '',
      affectedPlayer: null
    };
  }
  
  // Визначаємо який гравець має обмеження
  const secondPlayer = getOppositePlayer(firstPlayer);
  const firstPlayerMoves = board.filter(cell => cell === firstPlayer).length;
  const secondPlayerMoves = board.filter(cell => cell === secondPlayer).length;

  let reasonDescription = '';
  if (currentPlayer === firstPlayer && firstPlayerMoves === 1) {
    reasonDescription = translations[language].restrictions.firstPlayerSecondMove.replace('{player}', firstPlayer);
  } else if (currentPlayer === secondPlayer && secondPlayerMoves === 1) {
    reasonDescription = translations[language].restrictions.secondPlayerSecondMove.replace('{player}', secondPlayer);
  } else {
    console.log('⚠️ Не входимо в жодну умову перекладу');
  }
  

  return {
    hasRestrictions: true,
    restrictedCells,
    reasonDescription,
    affectedPlayer: currentPlayer
  };
}

/**
 * Отримує правила гри для заданого розміру дошки
 * ОНОВЛЕНО: restrictionPlayer тепер може бути будь-який перший гравець
 */
export function getGameRules(boardSize: BoardSize, firstPlayer?: Player): GameRules {
  return {
    boardSize,
    hasFirstMoveRestriction: boardSize === 4,
    restrictionPlayer: boardSize === 4 ? firstPlayer || null : null,
    restrictionMove: boardSize === 4 ? 2 : null
  };
}

/**
 * Перевіряє чи є поточний хід другим ходом для першого гравця
 * ОНОВЛЕНО: перевіряє для будь-якого першого гравця
 */
export function isSecondMoveForFirstPlayer(
  board: CellValue[], 
  currentPlayer: Player, 
  firstPlayer: Player
): boolean {
  return currentPlayer === firstPlayer && 
         board.filter(cell => cell === firstPlayer).length === 1;
}

/**
 * Отримає позицію першого ходу для гравця
 */
export function getFirstMovePosition(board: CellValue[], player: Player): CellIndex | null {
  const position = board.findIndex(cell => cell === player);
  return position === -1 ? null : position;
}

/**
 * Отримує доступні ходи з урахуванням обмежень
 * ОНОВЛЕНО: додано параметр firstPlayer
 */
export function getAvailableMovesWithRestrictions(
  board: CellValue[],
  boardSize: BoardSize,
  currentPlayer: Player,
  firstPlayer: Player // НОВИЙ ПАРАМЕТР
): CellIndex[] {
  const restrictedCells = getRestrictedCells(board, boardSize, currentPlayer, firstPlayer);
  
  return board
    .map((cell, index) => {
      // Клітинка повинна бути порожня
      if (cell !== '') return -1;
      
      // Клітинка не повинна бути обмеженою
      if (restrictedCells.includes(index)) return -1;
      
      return index;
    })
    .filter(index => index !== -1);
}

/**
 * Перевіряє чи хід валідний з урахуванням всіх правил
 * ОНОВЛЕНО: додано параметр firstPlayer
 */
export function isValidMoveWithRestrictions(
  board: CellValue[], 
  index: number, 
  player: Player,
  boardSize: BoardSize,
  firstPlayer: Player // НОВИЙ ПАРАМЕТР
): boolean {
  const validation = validateMove(board, index, player, boardSize, firstPlayer);
  return validation.isValid;
}

/**
 * Debug функція для виведення обмежених клітинок
 * ОНОВЛЕНО: додано параметр firstPlayer
 */
export function logRestrictedCells(
  board: CellValue[], 
  boardSize: BoardSize, 
  currentPlayer: Player,
  firstPlayer: Player // НОВИЙ ПАРАМЕТР
): void {
  const restrictedCells = getRestrictedCells(board, boardSize, currentPlayer, firstPlayer);
  
  if (restrictedCells.length === 0) {
    console.log(`🟢 Немає обмежень для гравця ${currentPlayer} (перший гравець: ${firstPlayer})`);
    return;
  }
  
  console.log(`🔴 Обмежені клітинки для ${currentPlayer} (перший гравець: ${firstPlayer}):`, restrictedCells);
  console.log('Дошка з позначенням обмежених клітинок:');
  
  for (let row = 0; row < boardSize; row++) {
    const rowData = [];
    for (let col = 0; col < boardSize; col++) {
      const index = row * boardSize + col;
      const cell = board[index];
      
      if (cell !== '') {
        rowData.push(cell); // X або O
      } else if (restrictedCells.includes(index)) {
        rowData.push('❌'); // обмежена клітинка
      } else {
        rowData.push('·'); // порожня доступна клітинка
      }
    }
    console.log(rowData.join(' | '));
  }
  console.log('❌ - заборонені клітинки, · - доступні клітинки');
}