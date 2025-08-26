// // Ключові особливості цього хука:
// // ✅ Повністю незалежний - не порушує існуючий код
// // ✅ Універсальний - працює для AI, PvP та майбутніх режимів
// // ✅ Оптимізований - використовує useCallback для продуктивності
// // ✅ Типобезпечний - повна TypeScript підтримка
// // Функціонал:

// // Основна логіка гри - ходи, перевірка перемоги, стан дошки
// // Історія ходів - можливість відміни останнього ходу
// // Пауза/продовження - для майбутніх функцій
// // Статистика гри - тривалість, кількість ходів
// // AI підтримка - симуляція ходів без зміни стану
// // Коллбеки - для реакції на події гри


// import { useState, useCallback, useEffect } from 'react';
// import type { 
//   BoardSize, 
//   CellValue, 
//   Player, 
//   GameState,
//   GameResult, 
//   CurrentGame,
//   GameBoard
// } from '../types/game';

// import {
//   createEmptyBoard,
//   generateWinningConditions,
//   isGameFinished,
//   getOppositePlayer,
//   isValidMove,
//   makeMove,
//   generateGameId,
//   cloneBoard
// } from '../utils/gameUtils';

// import { PLAYER_SYMBOLS, GAME_STATES, GAME_RESULTS } from '../constants/game';

// interface UseGameLogicOptions {
//   boardSize: BoardSize;
//   playerSymbol: Player;
//   onGameEnd?: (result: GameResult, winner?: Player) => void;
//   onMoveComplete?: (board: CellValue[], currentPlayer: Player) => void;
// }

// interface UseGameLogicReturn {
//   // Стан гри
//   gameState: GameState;
//   board: CellValue[];
//   currentPlayer: Player;
//   gameActive: boolean;
//   winningLine: number[];
//   gameResult: GameResult;
//   gameId: string | null;
  
//   // Геттери
//   isEmpty: boolean;
//   isFull: boolean;
//   moveCount: number;
//   opponentSymbol: Player;
  
//   // Дії
//   initializeGame: (firstPlayer?: Player) => void;
//   makePlayerMove: (index: number) => boolean;
//   resetGame: () => void;
//   pauseGame: () => void;
//   resumeGame: () => void;
//   endGame: (result: GameResult, winner?: Player) => void;
  
//   // Утилітарні функції
//   canMakeMove: (index: number) => boolean;
//   getAvailableMoves: () => number[];
//   getBoardState: () => GameBoard;
  
//   // AI підтримка
//   simulateMove: (index: number, player: Player) => CellValue[];
//   undoLastMove: () => boolean;
  
//   // Статистика поточної гри
//   getGameStats: () => {
//     duration: number;
//     moves: number;
//     playerMoves: number;
//     opponentMoves: number;
//   };
// }

// export function useGameLogic({
//   boardSize,
//   playerSymbol,
//   onGameEnd,
//   onMoveComplete
// }: UseGameLogicOptions): UseGameLogicReturn {
  
//   // Основний стан гри
//   const [currentGame, setCurrentGame] = useState<CurrentGame>({
//     id: null,
//     board: { cells: createEmptyBoard(boardSize), size: boardSize },
//     currentPlayer: PLAYER_SYMBOLS.X,
//     gameActive: false,
//     gameState: GAME_STATES.SETUP,
//     winningConditions: generateWinningConditions(boardSize),
//     winningLine: [],
//     result: null,
//     startTime: null,
//     endTime: null
//   });

//   // История ходов для отмены
//   const [moveHistory, setMoveHistory] = useState<{
//     board: CellValue[];
//     player: Player;
//     moveIndex: number;
//     timestamp: number;
//   }[]>([]);

//   // Обновляем размер доски при изменении
//   useEffect(() => {
//     if (currentGame.board.size !== boardSize) {
//       const newBoard = createEmptyBoard(boardSize);
//       const newConditions = generateWinningConditions(boardSize);
      
//       setCurrentGame(prev => ({
//         ...prev,
//         board: { cells: newBoard, size: boardSize },
//         winningConditions: newConditions,
//         winningLine: []
//       }));
//     }
//   }, [boardSize, currentGame.board.size]);

//   // Геттеры
//   const opponentSymbol = getOppositePlayer(playerSymbol);
//   const isEmpty = currentGame.board.cells.every(cell => cell === '');
//   const isFull = !currentGame.board.cells.includes('');
//   const moveCount = currentGame.board.cells.filter(cell => cell !== '').length;

//   // Инициализация новой игры
//   const initializeGame = useCallback((firstPlayer: Player = PLAYER_SYMBOLS.X) => {
//     const newBoard = createEmptyBoard(boardSize);
//     const newConditions = generateWinningConditions(boardSize);
//     const gameId = generateGameId();

//     setCurrentGame({
//       id: gameId,
//       board: { cells: newBoard, size: boardSize },
//       currentPlayer: firstPlayer,
//       gameActive: true,
//       gameState: GAME_STATES.PLAYING,
//       winningConditions: newConditions,
//       winningLine: [],
//       result: null,
//       startTime: Date.now(),
//       endTime: null
//     });

//     setMoveHistory([]);
//   }, [boardSize]);

//   // Проверка возможности хода
//   const canMakeMove = useCallback((index: number): boolean => {
//     return currentGame.gameActive && 
//            isValidMove(currentGame.board.cells, index);
//   }, [currentGame.gameActive, currentGame.board.cells]);

//   // Получение доступных ходов
//   const getAvailableMoves = useCallback((): number[] => {
//     return currentGame.board.cells
//       .map((cell, index) => cell === '' ? index : -1)
//       .filter(index => index !== -1);
//   }, [currentGame.board.cells]);

//   // Симуляция хода (не изменяет состояние)
//   const simulateMove = useCallback((index: number, player: Player): CellValue[] => {
//     if (!isValidMove(currentGame.board.cells, index)) {
//       return currentGame.board.cells;
//     }
//     return makeMove(currentGame.board.cells, index, player);
//   }, [currentGame.board.cells]);

//   // Выполнение хода игрока
//   const makePlayerMove = useCallback((index: number): boolean => {
//     if (!canMakeMove(index)) {
//       return false;
//     }

//     try {
//       const newBoard = makeMove(currentGame.board.cells, index, currentGame.currentPlayer);
      
//       // Добавляем в историю
//       setMoveHistory(prev => [...prev, {
//         board: cloneBoard(currentGame.board.cells),
//         player: currentGame.currentPlayer,
//         moveIndex: index,
//         timestamp: Date.now()
//       }]);

//       // Проверяем результат игры
//       const gameStatus = isGameFinished(newBoard, currentGame.winningConditions);
      
//       if (gameStatus.finished) {
//         // Игра закончена
//         const result: GameResult = gameStatus.isDraw ? 
//           GAME_RESULTS.DRAW : 
//           (gameStatus.winner === playerSymbol ? GAME_RESULTS.WIN : GAME_RESULTS.LOSE);

//         setCurrentGame(prev => ({
//           ...prev,
//           board: { ...prev.board, cells: newBoard },
//           gameActive: false,
//           gameState: GAME_STATES.FINISHED,
//           winningLine: gameStatus.winningLine,
//           result,
//           endTime: Date.now()
//         }));

//         // Вызываем callback окончания игры
//         onGameEnd?.(result, gameStatus.winner || undefined);
//       } else {
//         // Игра продолжается
//         const nextPlayer = getOppositePlayer(currentGame.currentPlayer);
        
//         setCurrentGame(prev => ({
//           ...prev,
//           board: { ...prev.board, cells: newBoard },
//           currentPlayer: nextPlayer
//         }));

//         // Вызываем callback хода
//         onMoveComplete?.(newBoard, nextPlayer);
//       }

//       return true;
//     } catch (error) {
//       console.error('Error making move:', error);
//       return false;
//     }
//   }, [
//     canMakeMove, 
//     currentGame.board.cells, 
//     currentGame.currentPlayer, 
//     currentGame.winningConditions,
//     playerSymbol,
//     onGameEnd,
//     onMoveComplete
//   ]);

//   // Отмена последнего хода
//   const undoLastMove = useCallback((): boolean => {
//     if (moveHistory.length === 0 || !currentGame.gameActive) {
//       return false;
//     }

//     const lastMove = moveHistory[moveHistory.length - 1];
//     const previousPlayer = getOppositePlayer(lastMove.player);

//     setCurrentGame(prev => ({
//       ...prev,
//       board: { ...prev.board, cells: cloneBoard(lastMove.board) },
//       currentPlayer: previousPlayer,
//       winningLine: [],
//       result: null
//     }));

//     setMoveHistory(prev => prev.slice(0, -1));
//     return true;
//   }, [moveHistory, currentGame.gameActive]);

//   // Сброс игры
//   const resetGame = useCallback(() => {
//     initializeGame(currentGame.currentPlayer);
//   }, [initializeGame, currentGame.currentPlayer]);

//   // Пауза игры
//   const pauseGame = useCallback(() => {
//     if (currentGame.gameState === GAME_STATES.PLAYING) {
//       setCurrentGame(prev => ({
//         ...prev,
//         gameState: GAME_STATES.PAUSED,
//         gameActive: false
//       }));
//     }
//   }, [currentGame.gameState]);

//   // Возобновление игры
//   const resumeGame = useCallback(() => {
//     if (currentGame.gameState === GAME_STATES.PAUSED) {
//       setCurrentGame(prev => ({
//         ...prev,
//         gameState: GAME_STATES.PLAYING,
//         gameActive: true
//       }));
//     }
//   }, [currentGame.gameState]);

//   // Принудительное завершение игры
//   const endGame = useCallback((result: GameResult, winner?: Player) => {
//     setCurrentGame(prev => ({
//       ...prev,
//       gameActive: false,
//       gameState: GAME_STATES.FINISHED,
//       result,
//       endTime: Date.now()
//     }));

//     onGameEnd?.(result, winner);
//   }, [onGameEnd]);

//   // Получение состояния доски
//   const getBoardState = useCallback((): GameBoard => {
//     return {
//       cells: cloneBoard(currentGame.board.cells),
//       size: currentGame.board.size
//     };
//   }, [currentGame.board]);

//   // Статистика текущей игры
//   const getGameStats = useCallback(() => {
//     const duration = currentGame.startTime ? 
//       (currentGame.endTime || Date.now()) - currentGame.startTime : 0;
    
//     const playerMoves = currentGame.board.cells.filter(cell => cell === playerSymbol).length;
//     const opponentMoves = currentGame.board.cells.filter(cell => cell === opponentSymbol).length;
    
//     return {
//       duration: Math.floor(duration / 1000), // в секундах
//       moves: moveCount,
//       playerMoves,
//       opponentMoves
//     };
//   }, [
//     currentGame.startTime, 
//     currentGame.endTime, 
//     currentGame.board.cells, 
//     playerSymbol, 
//     opponentSymbol, 
//     moveCount
//   ]);

//   return {
//     // Состояние игры
//     gameState: currentGame.gameState,
//     board: currentGame.board.cells,
//     currentPlayer: currentGame.currentPlayer,
//     gameActive: currentGame.gameActive,
//     winningLine: currentGame.winningLine,
//     gameResult: currentGame.result,
//     gameId: currentGame.id,
    
//     // Геттеры
//     isEmpty,
//     isFull,
//     moveCount,
//     opponentSymbol,
    
//     // Действия
//     initializeGame,
//     makePlayerMove,
//     resetGame,
//     pauseGame,
//     resumeGame,
//     endGame,
    
//     // Утилитарные функции
//     canMakeMove,
//     getAvailableMoves,
//     getBoardState,
    
//     // AI поддержка
//     simulateMove,
//     undoLastMove,
    
//     // Статистика
//     getGameStats
//   };
// }






// // Ключові особливості цього хука:
// // ✅ Повністю незалежний - не порушує існуючий код
// // ✅ Універсальний - працює для AI, PvP та майбутніх режимів
// // ✅ Оптимізований - використовує useCallback для продуктивності
// // ✅ Типобезпечний - повна TypeScript підтримка
// // Функціонал:

// // Основна логіка гри - ходи, перевірка перемоги, стан дошки
// // Історія ходів - можливість відміни останнього ходу
// // Пауза/продовження - для майбутніх функцій
// // Статистика гри - тривалість, кількість ходів
// // AI підтримка - симуляція ходів без зміни стану
// // Коллбеки - для реакції на події гри


// import { useState, useCallback, useEffect } from 'react';
// import type { 
//   BoardSize, 
//   CellValue, 
//   Player, 
//   GameState,
//   GameResult, 
//   CurrentGame,
//   GameBoard
// } from '../types/game';

// import {
//   createEmptyBoard,
//   generateWinningConditions,
//   isGameFinished,
//   getOppositePlayer,
//   isValidMove,
//   makeMove,
//   generateGameId,
//   cloneBoard
// } from '../utils/gameUtils';

// import { PLAYER_SYMBOLS, GAME_STATES, GAME_RESULTS } from '../constants/game';

// interface UseGameLogicOptions {
//   boardSize: BoardSize;
//   playerSymbol: Player;
//   onGameEnd?: (result: GameResult, winner?: Player) => void;
//   onMoveComplete?: (board: CellValue[], currentPlayer: Player) => void;
// }

// interface UseGameLogicReturn {
//   // Стан гри
//   gameState: GameState;
//   board: CellValue[];
//   currentPlayer: Player;
//   gameActive: boolean;
//   winningLine: number[];
//   gameResult: GameResult;
//   gameId: string | null;
  
//   // Геттери
//   isEmpty: boolean;
//   isFull: boolean;
//   moveCount: number;
//   opponentSymbol: Player;
  
//   // Дії
//   initializeGame: (firstPlayer?: Player) => void;
//   makePlayerMove: (index: number) => boolean;
//   makePlayerMoveWithSymbol: (index: number, symbol: Player) => boolean; // 🔥 ДОДАЙТЕ ЦЮ ЛІНІЮ
//   resetGame: () => void;
//   pauseGame: () => void;
//   resumeGame: () => void;
//   endGame: (result: GameResult, winner?: Player) => void;
//   restoreGame: (savedState: {
//     gameId: string;
//     board: CellValue[];
//     currentPlayer: Player;
//     gameActive: boolean;
//     gameState: GameState;
//     winningLine: number[];
//     startTime?: number;
//   }) => void;
  
//   // Утилітарні функції
//   canMakeMove: (index: number) => boolean;
//   getAvailableMoves: () => number[];
//   getBoardState: () => GameBoard;
  
//   // AI підтримка
//   simulateMove: (index: number, player: Player) => CellValue[];
//   undoLastMove: () => boolean;
  
//   // Статистика поточної гри
//   getGameStats: () => {
//     duration: number;
//     moves: number;
//     playerMoves: number;
//     opponentMoves: number;
//   };
// }

// export function useGameLogic({
//   boardSize,
//   playerSymbol,
//   onGameEnd,
//   onMoveComplete
// }: UseGameLogicOptions): UseGameLogicReturn {
  
//   // Основний стан гри
//   const [currentGame, setCurrentGame] = useState<CurrentGame>({
//     id: null,
//     board: { cells: createEmptyBoard(boardSize), size: boardSize },
//     currentPlayer: PLAYER_SYMBOLS.X,
//     gameActive: false,
//     gameState: GAME_STATES.SETUP,
//     winningConditions: generateWinningConditions(boardSize),
//     winningLine: [],
//     result: null,
//     startTime: null,
//     endTime: null
//   });

//   // История ходов для отмены
//   const [moveHistory, setMoveHistory] = useState<{
//     board: CellValue[];
//     player: Player;
//     moveIndex: number;
//     timestamp: number;
//   }[]>([]);

// //  Обновляем размер доски при изменении ВАЖЛИВИЙ КОД
//   useEffect(() => {
//     if (currentGame.board.size !== boardSize) {
//       const newBoard = createEmptyBoard(boardSize);
//       const newConditions = generateWinningConditions(boardSize);
      
//       setCurrentGame(prev => ({
//         ...prev,
//         board: { cells: newBoard, size: boardSize },
//         winningConditions: newConditions,
//         winningLine: []
//       }));
//     }
//   }, [boardSize, currentGame.board.size]);

//   // // Обновляем размер доски при изменении (ТІЛЬКИ коли гра НЕ активна)
//   // useEffect(() => {
//   //   if (currentGame.board.size !== boardSize && !currentGame.gameActive) {
//   //     console.log('🔧 Оновлення розміру дошки:', { 
//   //       oldSize: currentGame.board.size, 
//   //       newSize: boardSize, 
//   //       gameActive: currentGame.gameActive 
//   //     });
      
//   //     const newBoard = createEmptyBoard(boardSize);
//   //     const newConditions = generateWinningConditions(boardSize);
      
//   //     setCurrentGame(prev => ({
//   //       ...prev,
//   //       board: { cells: newBoard, size: boardSize },
//   //       winningConditions: newConditions,
//   //       winningLine: []
//   //     }));
//   //   }
//   // }, [boardSize, currentGame.board.size, currentGame.gameActive]); // Додали currentGame.gameActive

//   // Геттеры
//   const opponentSymbol = getOppositePlayer(playerSymbol);
//   const isEmpty = currentGame.board.cells.every(cell => cell === '');
//   const isFull = !currentGame.board.cells.includes('');
//   const moveCount = currentGame.board.cells.filter(cell => cell !== '').length;

//   // Инициализация новой игры
//   // const initializeGame = useCallback((firstPlayer: Player = PLAYER_SYMBOLS.X) => {
    
//   //   const newBoard = createEmptyBoard(boardSize);
//   //   const newConditions = generateWinningConditions(boardSize);
//   //   const gameId = generateGameId();

//   //   setCurrentGame({
//   //     id: gameId,
//   //     board: { cells: newBoard, size: boardSize },
//   //     currentPlayer: firstPlayer,
//   //     gameActive: true,
//   //     gameState: GAME_STATES.PLAYING,
//   //     winningConditions: newConditions,
//   //     winningLine: [],
//   //     result: null,
//   //     startTime: Date.now(),
//   //     endTime: null
//   //   });

//   //   setMoveHistory([]);
//   // }, [boardSize]);

//   const initializeGame = useCallback((firstPlayer?: Player) => {
//     const startingPlayer = firstPlayer || PLAYER_SYMBOLS.X; // Використовуємо переданий параметр
    
//     const newBoard = createEmptyBoard(boardSize);
//     const newConditions = generateWinningConditions(boardSize);
//     const gameId = generateGameId();
  
//     console.log('Ініціалізація гри з першим гравцем:', startingPlayer);
//     console.log('🔧 Створення нового стану гри:', {
//       firstPlayer: startingPlayer,
//       gameActive: true,
//       gameState: GAME_STATES.PLAYING
//     });
  
//     setCurrentGame({
//       id: gameId,
//       board: { cells: newBoard, size: boardSize },
//       currentPlayer: startingPlayer, // ⭐ Ключова зміна
//       gameActive: true,
//       gameState: GAME_STATES.PLAYING,
//       winningConditions: newConditions,
//       winningLine: [],
//       result: null,
//       startTime: Date.now(),
//       endTime: null
//     });

//     console.log('✅ Стан гри оновлено:', {
//       currentPlayer: startingPlayer,
//       gameActive: true
//     });
  
//     setMoveHistory([]);
//   }, [boardSize]);

//   // Проверка возможности хода
//   const canMakeMove = useCallback((index: number): boolean => {
//     return currentGame.gameActive && 
//            isValidMove(currentGame.board.cells, index);
//   }, [currentGame.gameActive, currentGame.board.cells]);

//   // Получение доступных ходов
//   const getAvailableMoves = useCallback((): number[] => {
//     return currentGame.board.cells
//       .map((cell, index) => cell === '' ? index : -1)
//       .filter(index => index !== -1);
//   }, [currentGame.board.cells]);

//   // Симуляция хода (не изменяет состояние)
//   const simulateMove = useCallback((index: number, player: Player): CellValue[] => {
//     if (!isValidMove(currentGame.board.cells, index)) {
//       return currentGame.board.cells;
//     }
//     return makeMove(currentGame.board.cells, index, player);
//   }, [currentGame.board.cells]);

//   // Выполнение хода игрока (останніВИПРАВЛЕННЯ)
//   // const makePlayerMove = useCallback((index: number): boolean => {
//   //   console.log('Початок makePlayerMove. Поточний гравець:', currentGame.currentPlayer); // Додано
//   //   if (!canMakeMove(index)) {
//   //     console.log('Хід неможливий'); // Додано
//   //     return false;
//   //   }

//   //   try {
//   //     const newBoard = makeMove(currentGame.board.cells, index, currentGame.currentPlayer);
//   //     console.log('Після makeMove. Нова дошка:', newBoard, 'Символ який поставили:', currentGame.currentPlayer); // Змініть цей лог
      
//   //     // Добавляем в историю
//   //     setMoveHistory(prev => [...prev, {
//   //       board: cloneBoard(currentGame.board.cells),
//   //       player: currentGame.currentPlayer,
//   //       moveIndex: index,
//   //       timestamp: Date.now()
//   //     }]);

//   //     // Проверяем результат игры
//   //     const gameStatus = isGameFinished(newBoard, currentGame.winningConditions);
      
//   //     if (gameStatus.finished) {
//   //       // Игра закончена
//   //       const result: GameResult = gameStatus.isDraw ? 
//   //         GAME_RESULTS.DRAW : 
//   //         (gameStatus.winner === playerSymbol ? GAME_RESULTS.WIN : GAME_RESULTS.LOSE);

//   //       setCurrentGame(prev => ({
//   //         ...prev,
//   //         board: { ...prev.board, cells: newBoard },
//   //         gameActive: false,
//   //         gameState: GAME_STATES.FINISHED,
//   //         winningLine: gameStatus.winningLine,
//   //         result,
//   //         endTime: Date.now()
//   //       }));

//   //       // Вызываем callback окончания игры
//   //       onGameEnd?.(result, gameStatus.winner || undefined);
//   //     } else {
//   //       // Игра продолжается
//   //       const nextPlayer = getOppositePlayer(currentGame.currentPlayer);
//   //       console.log('Наступний гравець буде:', nextPlayer); // Додано
        
//   //       // setCurrentGame(prev => ({
//   //       //   ...prev,
//   //       //   board: { ...prev.board, cells: newBoard },
//   //       //   currentPlayer: nextPlayer
//   //       // }));

//   //       setCurrentGame(prev => {
//   //         console.log('Оновлення стану. Новий гравець:', nextPlayer); // Додано
//   //         return {
//   //           ...prev,
//   //           board: { ...prev.board, cells: newBoard },
//   //           currentPlayer: nextPlayer
//   //         };
//   //       });

//   //       // Вызываем callback хода
//   //       onMoveComplete?.(newBoard, nextPlayer);
//   //     }

//   //     return true;
//   //   } catch (error) {
//   //     console.error('Error making move:', error);
//   //     return false;
//   //   }
//   // }, [
//   //   canMakeMove, 
//   //   currentGame.board.cells, 
//   //   currentGame.currentPlayer, 
//   //   currentGame.winningConditions,
//   //   playerSymbol,
//   //   onGameEnd,
//   //   onMoveComplete
//   // ]);


//   ////////////////////////////////////////////////////////////////////////////

//   // Додайте нову функцію для ходу з конкретним символом
// const makePlayerMoveWithSymbol = useCallback((index: number, symbol: Player): boolean => {
//   console.log('Початок makePlayerMoveWithSymbol. Символ:', symbol, 'Індекс:', index);
  
//   if (!currentGame.gameActive || !isValidMove(currentGame.board.cells, index)) {
//     console.log('Хід неможливий');
//     return false;
//   }

//   try {
//     // const newBoard = makeMove(currentGame.board.cells, index, symbol);
//     // console.log('Після makeMove. Нова дошка:', newBoard, 'Символ який поставили:', symbol);
//     // На:
//     const newBoard = [...currentGame.board.cells]; // Клонуємо дошку
//     if (newBoard[index] !== '') {
//       console.error('❌ Спроба ходу в зайняту клітинку:', index, 'Поточне значення:', newBoard[index]);
//       console.error('❌ Поточний стан дошки:', newBoard);
//       return false;
//     }
//     newBoard[index] = symbol; // Ставимо символ
//     console.log('🎯 Безпечний makeMove. Нова дошка:', [...newBoard]);
    
//     // Добавляем в историю
//     setMoveHistory(prev => [...prev, {
//       board: cloneBoard(currentGame.board.cells),
//       player: symbol,
//       moveIndex: index,
//       timestamp: Date.now()
//     }]);

//     // Проверяем результат игры
//     const gameStatus = isGameFinished(newBoard, currentGame.winningConditions);
    
//     if (gameStatus.finished) {
//       // Игра закончена
//       const result: GameResult = gameStatus.isDraw ? 
//         GAME_RESULTS.DRAW : 
//         (gameStatus.winner === playerSymbol ? GAME_RESULTS.WIN : GAME_RESULTS.LOSE);

//       setCurrentGame(prev => ({
//         ...prev,
//         board: { ...prev.board, cells: newBoard },
//         currentPlayer: symbol, // Оновлюємо поточного гравця
//         gameActive: false,
//         gameState: GAME_STATES.FINISHED,
//         winningLine: gameStatus.winningLine,
//         result,
//         endTime: Date.now()
//       }));

//       // Вызываем callback окончания игры
//       onGameEnd?.(result, gameStatus.winner || undefined);
//     } else {
//       // Игра продолжается
//       const nextPlayer = getOppositePlayer(symbol);
//       console.log('Наступний гравець буде:', nextPlayer);
      
//       setCurrentGame(prev => ({
//         ...prev,
//         board: { ...prev.board, cells: newBoard },
//         currentPlayer: nextPlayer,
//         isPlayerTurn: nextPlayer// === playerSymbol // Добавляем обновление isPlayerTurn
//       }));

//       // Вызываем callback хода
//       onMoveComplete?.(newBoard, nextPlayer);
//     }

//     return true;
//   } catch (error) {
//     console.error('Error making move:', error);
//     return false;
//   }
// }, [
//   currentGame.gameActive,
//   currentGame.board.cells, 
//   currentGame.winningConditions,
//   playerSymbol,
//   onGameEnd,
//   onMoveComplete
// ]);

// // Оригінальна функція тепер використовує поточного гравця
// const makePlayerMove = useCallback((index: number): boolean => {
//   return makePlayerMoveWithSymbol(index, currentGame.currentPlayer);
// }, [makePlayerMoveWithSymbol, currentGame.currentPlayer]);

// ////////////////////////////////////////////////////////////////////////////

//   // Отмена последнего хода
//   const undoLastMove = useCallback((): boolean => {
//     if (moveHistory.length === 0 || !currentGame.gameActive) {
//       return false;
//     }

//     const lastMove = moveHistory[moveHistory.length - 1];
//     const previousPlayer = getOppositePlayer(lastMove.player);

//     setCurrentGame(prev => ({
//       ...prev,
//       board: { ...prev.board, cells: cloneBoard(lastMove.board) },
//       currentPlayer: previousPlayer,
//       winningLine: [],
//       result: null
//     }));

//     setMoveHistory(prev => prev.slice(0, -1));
//     return true;
//   }, [moveHistory, currentGame.gameActive]);

//   // Сброс игры
//   // const resetGame = useCallback(() => {
//   //   initializeGame(currentGame.currentPlayer);
//   // }, [initializeGame, currentGame.currentPlayer]);

//   const resetGame = useCallback(() => {
//     initializeGame(); // Видалили аргумент
//   }, [initializeGame]);

//   // Пауза игры
//   const pauseGame = useCallback(() => {
//     if (currentGame.gameState === GAME_STATES.PLAYING) {
//       setCurrentGame(prev => ({
//         ...prev,
//         gameState: GAME_STATES.PAUSED,
//         gameActive: false
//       }));
//     }
//   }, [currentGame.gameState]);

//   // Возобновление игры
//   const resumeGame = useCallback(() => {
//     if (currentGame.gameState === GAME_STATES.PAUSED) {
//       setCurrentGame(prev => ({
//         ...prev,
//         gameState: GAME_STATES.PLAYING,
//         gameActive: true
//       }));
//     }
//   }, [currentGame.gameState]);

//   // Принудительное завершение игры
//   const endGame = useCallback((result: GameResult, winner?: Player) => {
//     setCurrentGame(prev => ({
//       ...prev,
//       gameActive: false,
//       gameState: GAME_STATES.FINISHED,
//       result,
//       endTime: Date.now()
//     }));

//     onGameEnd?.(result, winner);
//   }, [onGameEnd]);

//   // Відновлення збереженої гри
//   const restoreGame = useCallback((savedState: {
//     gameId: string;
//     board: CellValue[];
//     currentPlayer: Player;
//     gameActive: boolean;
//     gameState: GameState;
//     winningLine: number[];
//     startTime?: number;
//   }) => {
//     setCurrentGame(prev => ({
//       ...prev,
//       id: savedState.gameId,
//       board: { cells: [...savedState.board], size: boardSize },
//       currentPlayer: savedState.currentPlayer,
//       gameActive: savedState.gameActive,
//       gameState: savedState.gameState,
//       winningLine: [...savedState.winningLine],
//       winningConditions: generateWinningConditions(boardSize),
//       result: null,
//       startTime: savedState.startTime || Date.now(),
//       endTime: null
//     }));

//     // Очистити історію ходів при відновленні
//     setMoveHistory([]);
//   }, [boardSize]);

//   // Получение состояния доски
//   const getBoardState = useCallback((): GameBoard => {
//     return {
//       cells: cloneBoard(currentGame.board.cells),
//       size: currentGame.board.size
//     };
//   }, [currentGame.board]);

//   // Статистика текущей игры
//   const getGameStats = useCallback(() => {
//     const duration = currentGame.startTime ? 
//       (currentGame.endTime || Date.now()) - currentGame.startTime : 0;
    
//     const playerMoves = currentGame.board.cells.filter(cell => cell === playerSymbol).length;
//     const opponentMoves = currentGame.board.cells.filter(cell => cell === opponentSymbol).length;
    
//     return {
//       duration: Math.floor(duration / 1000), // в секундах
//       moves: moveCount,
//       playerMoves,
//       opponentMoves
//     };
//   }, [
//     currentGame.startTime, 
//     currentGame.endTime, 
//     currentGame.board.cells, 
//     playerSymbol, 
//     opponentSymbol, 
//     moveCount
//   ]);

//   return {
//     // Состояние игры
//     gameState: currentGame.gameState,
//     board: currentGame.board.cells,
//     currentPlayer: currentGame.currentPlayer,
//     gameActive: currentGame.gameActive,
//     winningLine: currentGame.winningLine,
//     gameResult: currentGame.result,
//     gameId: currentGame.id,
    
//     // Геттеры
//     isEmpty,
//     isFull,
//     moveCount,
//     opponentSymbol,
    
//     // Действия
//     initializeGame,
//     makePlayerMove,
//     makePlayerMoveWithSymbol, // 🔥 ДОДАЙТЕ ЦЕ
//     resetGame,
//     pauseGame,
//     resumeGame,
//     endGame,
//     restoreGame,
    
//     // Утилитарные функции
//     canMakeMove,
//     getAvailableMoves,
//     getBoardState,
    
//     // AI поддержка
//     simulateMove,
//     undoLastMove,
    
//     // Статистика
//     getGameStats
//   };
// }













































// Ключові особливості цього хука:
// ✅ Повністю незалежний - не порушує існуючий код
// ✅ Універсальний - працює для AI, PvP та майбутніх режимів
// ✅ Оптимізований - використовує useCallback для продуктивності
// ✅ Типобезпечний - повна TypeScript підтримка
// Функціонал:

// Основна логіка гри - ходи, перевірка перемоги, стан дошки
// Історія ходів - можливість відміни останнього ходу
// Пауза/продовження - для майбутніх функцій
// Статистика гри - тривалість, кількість ходів
// AI підтримка - симуляція ходів без зміни стану
// Коллбеки - для реакції на події гри


import { useState, useCallback, useEffect, useMemo } from 'react';
import type { 
  BoardSize, 
  CellValue, 
  Player, 
  GameState,
  GameResult, 
  CurrentGame,
  GameBoard,
  // НОВІ ТИПИ:
  RestrictedCells,
  RestrictionInfo
} from '../types/game';

import {
  createEmptyBoard,
  generateWinningConditions,
  isGameFinished,
  getOppositePlayer,
  isValidMove,
  makeMove,
  generateGameId,
  cloneBoard,
  // НОВІ ІМПОРТИ для 4×4:
  getRestrictedCells,
  validateMove,
  getRestrictionInfo,
  getAvailableMovesWithRestrictions,
  isValidMoveWithRestrictions
} from '../utils/gameUtils';

import { PLAYER_SYMBOLS, GAME_STATES, GAME_RESULTS } from '../constants/game';

interface UseGameLogicOptions {
  boardSize: BoardSize;
  playerSymbol: Player;
  firstPlayer?: Player; // НОВИЙ ПАРАМЕТР
  language?: 'uk' | 'en';
  onGameEnd?: (result: GameResult, winner?: Player) => void;
  onMoveComplete?: (board: CellValue[], currentPlayer: Player) => void;
}

interface UseGameLogicReturn {
  // Стан гри
  gameState: GameState;
  board: CellValue[];
  currentPlayer: Player;
  gameActive: boolean;
  winningLine: number[];
  gameResult: GameResult;
  gameId: string | null;

  // НОВІ ПОЛЯ для 4×4:
  restrictedCells: RestrictedCells;
  restrictionInfo: RestrictionInfo;
  firstPlayer: Player;
  
  // Геттери
  isEmpty: boolean;
  isFull: boolean;
  moveCount: number;
  opponentSymbol: Player;
  
  // Дії
  initializeGame: (firstPlayer?: Player) => void;
  makePlayerMove: (index: number) => boolean;
  makePlayerMoveWithSymbol: (index: number, symbol: Player) => boolean; // 🔥 ДОДАЙТЕ ЦЮ ЛІНІЮ
  resetGame: () => void;
  setupGame: () => void; // ⭐ ДОДАТИ ЦЮ ЛІНІЮ
  pauseGame: () => void;
  resumeGame: () => void;
  endGame: (result: GameResult, winner?: Player) => void;
  restoreGame: (savedState: {
    gameId: string;
    board: CellValue[];
    currentPlayer: Player;
    gameActive: boolean;
    gameState: GameState;
    winningLine: number[];
    startTime?: number;
    firstPlayer?: Player; // НОВИЙ ПАРАМЕТР
  }) => void;
  
  // Утилітарні функції
  canMakeMove: (index: number) => boolean;
  getAvailableMoves: () => number[];
  getBoardState: () => GameBoard;

  // НОВІ ФУНКЦІЇ для 4×4:
  canMakeMoveWithRestrictions: (index: number) => boolean;
  getAvailableMovesWithRestrictions: () => number[];
  
  // AI підтримка
  simulateMove: (index: number, player: Player) => CellValue[];
  undoLastMove: () => boolean;
  
  // Статистика поточної гри
  getGameStats: () => {
    duration: number;
    moves: number;
    playerMoves: number;
    opponentMoves: number;
  };
}

export function useGameLogic({
  boardSize,
  playerSymbol,
  firstPlayer: initialFirstPlayer, // НОВИЙ ПАРАМЕТР
  language = 'uk',
  onGameEnd,
  onMoveComplete
}: UseGameLogicOptions): UseGameLogicReturn {

  // ДОДАТИ СТАН ДЛЯ ПЕРШОГО ГРАВЦЯ:
  const [firstPlayer, setFirstPlayer] = useState<Player>(
    initialFirstPlayer || PLAYER_SYMBOLS.X
  );
  
  // Основний стан гри
  const [currentGame, setCurrentGame] = useState<CurrentGame>({
    id: null,
    board: { cells: createEmptyBoard(boardSize), size: boardSize },
    currentPlayer: PLAYER_SYMBOLS.X,
    gameActive: false,
    gameState: GAME_STATES.SETUP,
    winningConditions: generateWinningConditions(boardSize),
    winningLine: [],
    result: null,
    startTime: null,
    endTime: null
  });

  // ДОДАТИ ОБЧИСЛЕННЯ ОБМЕЖЕНИХ КЛІТИНОК:
  const restrictedCells = useMemo((): RestrictedCells => {
    // Для 3×3 завжди повертаємо порожній масив
    if (boardSize === 3) {
      return [];
    }

    return getRestrictedCells(
      currentGame.board.cells, 
      boardSize, 
      currentGame.currentPlayer,
      firstPlayer
    );
  }, [currentGame.board.cells, boardSize, currentGame.currentPlayer, firstPlayer]);

  // ДОДАТИ ІНФОРМАЦІЮ ПРО ОБМЕЖЕННЯ:
  const restrictionInfo = useMemo((): RestrictionInfo => {
    // Для 3×3 повертаємо "немає обмежень"
    if (boardSize === 3) {
      return {
        hasRestrictions: false,
        restrictedCells: [],
        reasonDescription: '',
        affectedPlayer: null
      };
    }

    console.log('🌐 Передаємо мову в getRestrictionInfo:', language); // DEBUG

    return getRestrictionInfo(
      currentGame.board.cells, 
      boardSize, 
      currentGame.currentPlayer,
      firstPlayer,
      language
    );
  }, [currentGame.board.cells, boardSize, currentGame.currentPlayer, firstPlayer, language]);

  // История ходов для отмены
  const [moveHistory, setMoveHistory] = useState<{
    board: CellValue[];
    player: Player;
    moveIndex: number;
    timestamp: number;
  }[]>([]);

//  Обновляем размер доски при изменении ВАЖЛИВИЙ КОД
  useEffect(() => {
    if (currentGame.board.size !== boardSize) {
      const newBoard = createEmptyBoard(boardSize);
      const newConditions = generateWinningConditions(boardSize);
      
      setCurrentGame(prev => ({
        ...prev,
        board: { cells: newBoard, size: boardSize },
        winningConditions: newConditions,
        winningLine: []
      }));
    }
  }, [boardSize, currentGame.board.size]);

  // // Обновляем размер доски при изменении (ТІЛЬКИ коли гра НЕ активна)
  // useEffect(() => {
  //   if (currentGame.board.size !== boardSize && !currentGame.gameActive) {
  //     console.log('🔧 Оновлення розміру дошки:', { 
  //       oldSize: currentGame.board.size, 
  //       newSize: boardSize, 
  //       gameActive: currentGame.gameActive 
  //     });
      
  //     const newBoard = createEmptyBoard(boardSize);
  //     const newConditions = generateWinningConditions(boardSize);
      
  //     setCurrentGame(prev => ({
  //       ...prev,
  //       board: { cells: newBoard, size: boardSize },
  //       winningConditions: newConditions,
  //       winningLine: []
  //     }));
  //   }
  // }, [boardSize, currentGame.board.size, currentGame.gameActive]); // Додали currentGame.gameActive

  // Геттеры
  const opponentSymbol = getOppositePlayer(playerSymbol);
  const isEmpty = currentGame.board.cells.every(cell => cell === '');
  const isFull = !currentGame.board.cells.includes('');
  const moveCount = currentGame.board.cells.filter(cell => cell !== '').length;

  // Инициализация новой игры
  // const initializeGame = useCallback((firstPlayer: Player = PLAYER_SYMBOLS.X) => {
    
  //   const newBoard = createEmptyBoard(boardSize);
  //   const newConditions = generateWinningConditions(boardSize);
  //   const gameId = generateGameId();

  //   setCurrentGame({
  //     id: gameId,
  //     board: { cells: newBoard, size: boardSize },
  //     currentPlayer: firstPlayer,
  //     gameActive: true,
  //     gameState: GAME_STATES.PLAYING,
  //     winningConditions: newConditions,
  //     winningLine: [],
  //     result: null,
  //     startTime: Date.now(),
  //     endTime: null
  //   });

  //   setMoveHistory([]);
  // }, [boardSize]);

  const initializeGame = useCallback((firstPlayer?: Player) => {
    const startingPlayer = firstPlayer || PLAYER_SYMBOLS.X; // Використовуємо переданий параметр
    setFirstPlayer(startingPlayer); // ЗБЕРЕГТИ ПЕРШОГО ГРАВЦЯ
    
    const newBoard = createEmptyBoard(boardSize);
    const newConditions = generateWinningConditions(boardSize);
    const gameId = generateGameId();
  
    console.log('Ініціалізація гри з першим гравцем:', startingPlayer);
    console.log('🔧 Створення нового стану гри:', {
      firstPlayer: startingPlayer,
      gameActive: true,
      gameState: GAME_STATES.PLAYING
    });
  
    setCurrentGame({
      id: gameId,
      board: { cells: newBoard, size: boardSize },
      currentPlayer: startingPlayer, // ⭐ Ключова зміна
      gameActive: true,
      gameState: GAME_STATES.PLAYING,
      winningConditions: newConditions,
      winningLine: [],
      result: null,
      startTime: Date.now(),
      endTime: null
    });

    console.log('✅ Стан гри оновлено:', {
      currentPlayer: startingPlayer,
      gameActive: true
    });
  
    setMoveHistory([]);
  }, [boardSize]);

  // ДОДАТИ НОВУ ФУНКЦІЮ ПЕРЕВІРКИ З ОБМЕЖЕННЯМИ:
  const canMakeMoveWithRestrictions = useCallback((index: number): boolean => {
    if (!currentGame.gameActive) return false;
    
    // Для 3×3 використовуємо звичайну перевірку
    if (boardSize === 3) {
      return isValidMove(currentGame.board.cells, index);
    }
    
    // Для 4×4 використовуємо перевірку з обмеженнями
    return isValidMoveWithRestrictions(
      currentGame.board.cells, 
      index, 
      currentGame.currentPlayer,
      boardSize,
      firstPlayer
    );
  }, [currentGame.gameActive, currentGame.board.cells, currentGame.currentPlayer, boardSize, firstPlayer]);

  // ДОДАТИ ФУНКЦІЮ ОТРИМАННЯ ДОСТУПНИХ ХОДІВ З ОБМЕЖЕННЯМИ:
  const getAvailableMovesWithRestrictionsFunc = useCallback((): number[] => {
    // Для 3×3 використовуємо звичайний метод
    if (boardSize === 3) {
      return currentGame.board.cells
        .map((cell, index) => cell === '' ? index : -1)
        .filter(index => index !== -1);
    }

    return getAvailableMovesWithRestrictions(
      currentGame.board.cells,
      boardSize,
      currentGame.currentPlayer,
      firstPlayer
    );
  }, [currentGame.board.cells, boardSize, currentGame.currentPlayer, firstPlayer]);

  // Проверка возможности хода
  const canMakeMove = useCallback((index: number): boolean => {
    return currentGame.gameActive && 
           isValidMove(currentGame.board.cells, index);
  }, [currentGame.gameActive, currentGame.board.cells]);

  // Получение доступных ходов
  const getAvailableMoves = useCallback((): number[] => {
    return currentGame.board.cells
      .map((cell, index) => cell === '' ? index : -1)
      .filter(index => index !== -1);
  }, [currentGame.board.cells]);

  // Симуляция хода (не изменяет состояние)
  const simulateMove = useCallback((index: number, player: Player): CellValue[] => {
    if (!isValidMove(currentGame.board.cells, index)) {
      return currentGame.board.cells;
    }
    return makeMove(currentGame.board.cells, index, player);
  }, [currentGame.board.cells]);

  // Выполнение хода игрока (останніВИПРАВЛЕННЯ)
  // const makePlayerMove = useCallback((index: number): boolean => {
  //   console.log('Початок makePlayerMove. Поточний гравець:', currentGame.currentPlayer); // Додано
  //   if (!canMakeMove(index)) {
  //     console.log('Хід неможливий'); // Додано
  //     return false;
  //   }

  //   try {
  //     const newBoard = makeMove(currentGame.board.cells, index, currentGame.currentPlayer);
  //     console.log('Після makeMove. Нова дошка:', newBoard, 'Символ який поставили:', currentGame.currentPlayer); // Змініть цей лог
      
  //     // Добавляем в историю
  //     setMoveHistory(prev => [...prev, {
  //       board: cloneBoard(currentGame.board.cells),
  //       player: currentGame.currentPlayer,
  //       moveIndex: index,
  //       timestamp: Date.now()
  //     }]);

  //     // Проверяем результат игры
  //     const gameStatus = isGameFinished(newBoard, currentGame.winningConditions);
      
  //     if (gameStatus.finished) {
  //       // Игра закончена
  //       const result: GameResult = gameStatus.isDraw ? 
  //         GAME_RESULTS.DRAW : 
  //         (gameStatus.winner === playerSymbol ? GAME_RESULTS.WIN : GAME_RESULTS.LOSE);

  //       setCurrentGame(prev => ({
  //         ...prev,
  //         board: { ...prev.board, cells: newBoard },
  //         gameActive: false,
  //         gameState: GAME_STATES.FINISHED,
  //         winningLine: gameStatus.winningLine,
  //         result,
  //         endTime: Date.now()
  //       }));

  //       // Вызываем callback окончания игры
  //       onGameEnd?.(result, gameStatus.winner || undefined);
  //     } else {
  //       // Игра продолжается
  //       const nextPlayer = getOppositePlayer(currentGame.currentPlayer);
  //       console.log('Наступний гравець буде:', nextPlayer); // Додано
        
  //       // setCurrentGame(prev => ({
  //       //   ...prev,
  //       //   board: { ...prev.board, cells: newBoard },
  //       //   currentPlayer: nextPlayer
  //       // }));

  //       setCurrentGame(prev => {
  //         console.log('Оновлення стану. Новий гравець:', nextPlayer); // Додано
  //         return {
  //           ...prev,
  //           board: { ...prev.board, cells: newBoard },
  //           currentPlayer: nextPlayer
  //         };
  //       });

  //       // Вызываем callback хода
  //       onMoveComplete?.(newBoard, nextPlayer);
  //     }

  //     return true;
  //   } catch (error) {
  //     console.error('Error making move:', error);
  //     return false;
  //   }
  // }, [
  //   canMakeMove, 
  //   currentGame.board.cells, 
  //   currentGame.currentPlayer, 
  //   currentGame.winningConditions,
  //   playerSymbol,
  //   onGameEnd,
  //   onMoveComplete
  // ]);


  ////////////////////////////////////////////////////////////////////////////

  // Додайте нову функцію для ходу з конкретним символом
  const makePlayerMoveWithSymbol = useCallback((index: number, symbol: Player): boolean => {
    console.log('Початок makePlayerMoveWithSymbol. Символ:', symbol, 'Індекс:', index);
    
    if (!currentGame.gameActive) {
      console.log('Гра не активна');
      return false;
    }
  
    // ВИПРАВЛЕНА ПЕРЕВІРКА - залежить від розміру дошки:
    let isValidMoveCheck: boolean;
    
    if (boardSize === 3) {
      // Для 3×3 - звичайна перевірка
      isValidMoveCheck = isValidMove(currentGame.board.cells, index);
    } else {
      // Для 4×4 - перевірка з обмеженнями
      isValidMoveCheck = isValidMoveWithRestrictions(
        currentGame.board.cells, 
        index, 
        symbol,
        boardSize,
        firstPlayer
      );
    }
  
    if (!isValidMoveCheck) {
      console.log('Хід неможливий');
      
      // Додаткова інформація для 4×4
      if (boardSize === 4) {
        const validation = validateMove(currentGame.board.cells, index, symbol, boardSize, firstPlayer);
        if (!validation.isValid && validation.reason === 'restricted') {
          console.log('Хід заборонений через обмеження 4×4:', validation.restrictedCells);
        }
      }
      return false;
    }

  try {
    // const newBoard = makeMove(currentGame.board.cells, index, symbol);
    // console.log('Після makeMove. Нова дошка:', newBoard, 'Символ який поставили:', symbol);
    // На:
    const newBoard = [...currentGame.board.cells]; // Клонуємо дошку
    if (newBoard[index] !== '') {
      console.error('❌ Спроба ходу в зайняту клітинку:', index, 'Поточне значення:', newBoard[index]);
      console.error('❌ Поточний стан дошки:', newBoard);
      return false;
    }
    newBoard[index] = symbol; // Ставимо символ
    console.log('🎯 Безпечний makeMove. Нова дошка:', [...newBoard]);
    
    // Добавляем в историю
    setMoveHistory(prev => [...prev, {
      board: cloneBoard(currentGame.board.cells),
      player: symbol,
      moveIndex: index,
      timestamp: Date.now()
    }]);

    // Проверяем результат игры
    const gameStatus = isGameFinished(newBoard, currentGame.winningConditions);

    ///////////////////////////////////////////////////
    // ДОДАТИ ЦЕЙ DEBUG КОД:
if (gameStatus.finished && !gameStatus.isDraw) {
  console.log('🏆 ДЕТАЛЬНИЙ АНАЛІЗ ПЕРЕМОГИ:');
  console.log('Переможець:', gameStatus.winner);
  console.log('Переможна лінія:', gameStatus.winningLine);
  console.log('Стан дошки після ходу:', newBoard);
  
  // Показуємо які символи в переможній лінії
  const winningCells = gameStatus.winningLine.map(index => ({
    index,
    symbol: newBoard[index]
  }));
  console.log('Клітинки переможної лінії:', winningCells);
  
  // Візуалізація дошки 4×4
  if (boardSize === 4) {
    console.log('📋 ВІЗУАЛІЗАЦІЯ 4×4:');
    for (let row = 0; row < 4; row++) {
      const rowData = [];
      for (let col = 0; col < 4; col++) {
        const index = row * 4 + col;
        const cell = newBoard[index] || '·';
        const isWinning = gameStatus.winningLine.includes(index) ? '🟢' : '';
        rowData.push(`${cell}${isWinning}`);
      }
      console.log(`Рядок ${row}:`, rowData.join(' | '));
    }
  }
}
    /////////////////////////////////////////////////////
    
    if (gameStatus.finished) {
      // Игра закончена
      const result: GameResult = gameStatus.isDraw ? 
        GAME_RESULTS.DRAW : 
        (gameStatus.winner === playerSymbol ? GAME_RESULTS.WIN : GAME_RESULTS.LOSE);

      setCurrentGame(prev => ({
        ...prev,
        board: { ...prev.board, cells: newBoard },
        currentPlayer: symbol, // Оновлюємо поточного гравця
        gameActive: false,
        gameState: GAME_STATES.FINISHED,
        winningLine: gameStatus.winningLine,
        result,
        endTime: Date.now()
      }));

      // Вызываем callback окончания игры
      onGameEnd?.(result, gameStatus.winner || undefined);
    } else {
      // Игра продолжается
      const nextPlayer = getOppositePlayer(symbol);
      console.log('Наступний гравець буде:', nextPlayer);
      
      setCurrentGame(prev => ({
        ...prev,
        board: { ...prev.board, cells: newBoard },
        currentPlayer: nextPlayer,
        isPlayerTurn: nextPlayer// === playerSymbol // Добавляем обновление isPlayerTurn
      }));

      // Вызываем callback хода
      // ОНОВЛЕНИЙ CALLBACK З ОБМЕЖЕННЯМИ:
      onMoveComplete?.(newBoard, nextPlayer);
    }

    return true;
  } catch (error) {
    console.error('Error making move:', error);
    return false;
  }
}, [
  currentGame.gameActive,
  currentGame.board.cells, 
  currentGame.winningConditions,
  playerSymbol,
  boardSize, // ДОДАНО
  firstPlayer, // ДОДАНО
  onGameEnd,
  onMoveComplete
]);

// Оригінальна функція тепер використовує поточного гравця
const makePlayerMove = useCallback((index: number): boolean => {
  return makePlayerMoveWithSymbol(index, currentGame.currentPlayer);
}, [makePlayerMoveWithSymbol, currentGame.currentPlayer]);

////////////////////////////////////////////////////////////////////////////

  // Отмена последнего хода
  const undoLastMove = useCallback((): boolean => {
    if (moveHistory.length === 0 || !currentGame.gameActive) {
      return false;
    }

    const lastMove = moveHistory[moveHistory.length - 1];
    const previousPlayer = getOppositePlayer(lastMove.player);

    setCurrentGame(prev => ({
      ...prev,
      board: { ...prev.board, cells: cloneBoard(lastMove.board) },
      currentPlayer: previousPlayer,
      winningLine: [],
      result: null
    }));

    setMoveHistory(prev => prev.slice(0, -1));
    return true;
  }, [moveHistory, currentGame.gameActive]);

  // Сброс игры
  // const resetGame = useCallback(() => {
  //   initializeGame(currentGame.currentPlayer);
  // }, [initializeGame, currentGame.currentPlayer]);

  const resetGame = useCallback(() => {
    initializeGame(); // Видалили аргумент
  }, [initializeGame]);

  // Повернення до стану налаштувань (без запуску гри)
  const setupGame = useCallback(() => {
    const newBoard = createEmptyBoard(boardSize);
    const newConditions = generateWinningConditions(boardSize);
    
    setCurrentGame(prev => ({
      ...prev,
      board: { cells: newBoard, size: boardSize },
      currentPlayer: PLAYER_SYMBOLS.X,
      gameActive: false, // ⭐ КЛЮЧОВА ВІДМІННІСТЬ від initializeGame
      gameState: GAME_STATES.SETUP, // ⭐ Стан налаштувань
      winningConditions: newConditions,
      winningLine: [],
      result: null, // ⭐ Очищаємо результат
      startTime: null,
      endTime: null
    }));

    setMoveHistory([]);
  }, [boardSize]);

  // Пауза игры
  const pauseGame = useCallback(() => {
    if (currentGame.gameState === GAME_STATES.PLAYING) {
      setCurrentGame(prev => ({
        ...prev,
        gameState: GAME_STATES.PAUSED,
        gameActive: false
      }));
    }
  }, [currentGame.gameState]);

  // Возобновление игры
  const resumeGame = useCallback(() => {
    if (currentGame.gameState === GAME_STATES.PAUSED) {
      setCurrentGame(prev => ({
        ...prev,
        gameState: GAME_STATES.PLAYING,
        gameActive: true
      }));
    }
  }, [currentGame.gameState]);

  // Принудительное завершение игры
  const endGame = useCallback((result: GameResult, winner?: Player) => {
    setCurrentGame(prev => ({
      ...prev,
      gameActive: false,
      gameState: GAME_STATES.FINISHED,
      result,
      endTime: Date.now()
    }));

    onGameEnd?.(result, winner);
  }, [onGameEnd]);

  // Відновлення збереженої гри
  const restoreGame = useCallback((savedState: {
    gameId: string;
    board: CellValue[];
    currentPlayer: Player;
    gameActive: boolean;
    gameState: GameState;
    winningLine: number[];
    startTime?: number;
    firstPlayer?: Player; // НОВИЙ ПАРАМЕТР
  }) => {
    // ВІДНОВИТИ ПЕРШОГО ГРАВЦЯ:
    if (savedState.firstPlayer) {
      setFirstPlayer(savedState.firstPlayer);
    }

    setCurrentGame(prev => ({
      ...prev,
      id: savedState.gameId,
      board: { cells: [...savedState.board], size: boardSize },
      currentPlayer: savedState.currentPlayer,
      gameActive: savedState.gameActive,
      gameState: savedState.gameState,
      winningLine: [...savedState.winningLine],
      winningConditions: generateWinningConditions(boardSize),
      result: null,
      startTime: savedState.startTime || Date.now(),
      endTime: null
    }));

    // Очистити історію ходів при відновленні
    setMoveHistory([]);
  }, [boardSize]);

  // Получение состояния доски
  const getBoardState = useCallback((): GameBoard => {
    return {
      cells: cloneBoard(currentGame.board.cells),
      size: currentGame.board.size
    };
  }, [currentGame.board]);

  // Статистика текущей игры
  const getGameStats = useCallback(() => {
    const duration = currentGame.startTime ? 
      (currentGame.endTime || Date.now()) - currentGame.startTime : 0;
    
    const playerMoves = currentGame.board.cells.filter(cell => cell === playerSymbol).length;
    const opponentMoves = currentGame.board.cells.filter(cell => cell === opponentSymbol).length;
    
    return {
      duration: Math.floor(duration / 1000), // в секундах
      moves: moveCount,
      playerMoves,
      opponentMoves
    };
  }, [
    currentGame.startTime, 
    currentGame.endTime, 
    currentGame.board.cells, 
    playerSymbol, 
    opponentSymbol, 
    moveCount
  ]);

  return {
    // Состояние игры
    gameState: currentGame.gameState,
    board: currentGame.board.cells,
    currentPlayer: currentGame.currentPlayer,
    gameActive: currentGame.gameActive,
    winningLine: currentGame.winningLine,
    gameResult: currentGame.result,
    gameId: currentGame.id,

    // НОВІ ПОЛЯ:
    restrictedCells,
    restrictionInfo,
    firstPlayer,
    
    // Геттеры
    isEmpty,
    isFull,
    moveCount,
    opponentSymbol,
    
    // Действия
    initializeGame,
    makePlayerMove,
    makePlayerMoveWithSymbol, // 🔥 ДОДАЙТЕ ЦЕ
    resetGame,
    setupGame, // ⭐ ДОДАТИ ЦЮ ЛІНІЮ
    pauseGame,
    resumeGame,
    endGame,
    restoreGame,
    
    // Утилитарные функции
    canMakeMove,
    getAvailableMoves,
    getBoardState,

    // НОВІ ФУНКЦІЇ:
    canMakeMoveWithRestrictions,
    getAvailableMovesWithRestrictions: getAvailableMovesWithRestrictionsFunc,
    
    // AI поддержка
    simulateMove,
    undoLastMove,
    
    // Статистика
    getGameStats
  };
}