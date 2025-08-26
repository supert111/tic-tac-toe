// // public/ai-worker.js
// // Web Worker для AI обчислень - не блокує UI

// // Допоміжні функції (адаптовані з gameUtils.ts)
// function generateWinningConditions(size) {
//     const conditions = [];
    
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
  
//   function checkWinner(board, winningConditions) {
//     for (const [a, b, c] of winningConditions) {
//       if (board[a] && board[a] === board[b] && board[a] === board[c]) {
//         return {
//           winner: board[a],
//           winningLine: [a, b, c]
//         };
//       }
//     }
    
//     return { winner: null, winningLine: [] };
//   }
  
//   function isBoardFull(board) {
//     return !board.includes('');
//   }
  
//   function isGameFinished(board, winningConditions) {
//     const { winner, winningLine } = checkWinner(board, winningConditions);
    
//     if (winner) {
//       return { finished: true, winner, isDraw: false, winningLine };
//     }
    
//     if (isBoardFull(board)) {
//       return { finished: true, winner: null, isDraw: true, winningLine: [] };
//     }
    
//     return { finished: false, winner: null, isDraw: false, winningLine: [] };
//   }
  
//   function getOppositePlayer(player) {
//     return player === 'X' ? 'O' : 'X';
//   }
  
//   function getAvailableMoves(board) {
//     return board
//       .map((cell, index) => cell === '' ? index : -1)
//       .filter(index => index !== -1);
//   }
  
//   function makeMove(board, index, player) {
//     if (board[index] !== '') {
//       return board;
//     }
    
//     const newBoard = [...board];
//     newBoard[index] = player;
//     return newBoard;
//   }
  
//   function getCornerCells(size) {
//     return [
//       0,                           // верхній лівий
//       size - 1,                    // верхній правий
//       size * (size - 1),           // нижній лівий
//       size * size - 1              // нижній правий
//     ];
//   }
  
//   function getEdgeCells(size) {
//     const edges = [];
    
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
  
//   // Додайте після існуючих функцій, перед evaluatePosition

// function getRestrictedCells(board, boardSize, currentPlayer, firstPlayer) {
//   if (boardSize !== 4) return [];
  
//   const moveCount = board.filter(cell => cell !== '').length;
  
//   // Обмеження тільки на другому ході
//   if (moveCount !== 1) return [];
  
//   // Знаходимо перший хід
//   const firstMoveIndex = board.findIndex(cell => cell !== '');
//   if (firstMoveIndex === -1) return [];
  
//   const row = Math.floor(firstMoveIndex / 4);
//   const col = firstMoveIndex % 4;
  
//   const restricted = [];
  
//   // Сусідні клітинки (8 напрямків)
//   for (let dr = -1; dr <= 1; dr++) {
//     for (let dc = -1; dc <= 1; dc++) {
//       if (dr === 0 && dc === 0) continue;
      
//       const newRow = row + dr;
//       const newCol = col + dc;
      
//       if (newRow >= 0 && newRow < 4 && newCol >= 0 && newCol < 4) {
//         restricted.push(newRow * 4 + newCol);
//       }
//     }
//   }
  
//   return restricted;
// }

// function getAvailableMovesWithRestrictions(board, boardSize, currentPlayer, firstPlayer) {
//   const restrictedCells = getRestrictedCells(board, boardSize, currentPlayer, firstPlayer);
  
//   return board
//     .map((cell, index) => {
//       if (cell !== '') return -1;
//       if (restrictedCells.includes(index)) return -1;
//       return index;
//     })
//     .filter(index => index !== -1);
// }

//   // Оцінка позиції
//   function evaluatePosition(board, boardSize, winningConditions, aiSymbol, playerSymbol) {
//     const result = isGameFinished(board, winningConditions);
  
//     // Термінальні позиції
//     if (result.winner === aiSymbol) return 1000;
//     if (result.winner === playerSymbol) return -1000;
//     if (result.isDraw) return 0;
  
//     let score = 0;
  
//     // Аналіз кожної виграшної лінії
//     for (const condition of winningConditions) {
//       let aiCount = 0;
//       let playerCount = 0;
  
//       for (const index of condition) {
//         const cell = board[index];
//         if (cell === aiSymbol) aiCount++;
//         else if (cell === playerSymbol) playerCount++;
//       }
  
//       // Оцінка лінії
//       if (playerCount === 0) {
//         // Лінія доступна для AI
//         if (aiCount === 2) score += 50;      // Два в ряд
//         else if (aiCount === 1) score += 10; // Один в ряд
//       } else if (aiCount === 0) {
//         // Лінія доступна для гравця
//         if (playerCount === 2) score -= 60;      // Блокуємо два в ряд
//         else if (playerCount === 1) score -= 10; // Блокуємо один в ряд
//       }
//     }
  
//     return score;
//   }
  
//   // Мінімакс алгоритм
//   function minimax(board, boardSize, depth, maxDepth, isMaximizing, aiSymbol, alpha, beta) {
//     const winningConditions = generateWinningConditions(boardSize);
//     const result = isGameFinished(board, winningConditions);
//     const playerSymbol = getOppositePlayer(aiSymbol);
  
//     // Термінальні випадки
//     if (result.winner === aiSymbol) {
//       return { score: 1000 - depth, move: -1 };
//     }
    
//     if (result.winner === playerSymbol) {
//       return { score: depth - 1000, move: -1 };
//     }
    
//     if (result.isDraw || depth >= maxDepth) {
//       const score = evaluatePosition(board, boardSize, winningConditions, aiSymbol, playerSymbol);
//       return { score, move: -1 };
//     }
  
//     const availableMoves = getAvailableMoves(board);
//     let bestMove = availableMoves[0] || -1;
  
//     if (isMaximizing) {
//       let maxScore = -Infinity;
      
//       for (const move of availableMoves) {
//         const newBoard = makeMove(board, move, aiSymbol);
//         const { score } = minimax(newBoard, boardSize, depth + 1, maxDepth, false, aiSymbol, alpha, beta);
        
//         if (score > maxScore) {
//           maxScore = score;
//           bestMove = move;
//         }
        
//         alpha = Math.max(alpha, score);
//         if (beta <= alpha) break;
//       }
      
//       return { score: maxScore, move: bestMove };
      
//     } else {
//       let minScore = Infinity;
      
//       for (const move of availableMoves) {
//         const newBoard = makeMove(board, move, playerSymbol);
//         const { score } = minimax(newBoard, boardSize, depth + 1, maxDepth, true, aiSymbol, alpha, beta);
        
//         if (score < minScore) {
//           minScore = score;
//           bestMove = move;
//         }
        
//         beta = Math.min(beta, score);
//         if (beta <= alpha) break;
//       }
      
//       return { score: minScore, move: bestMove };
//     }
//   }
  
//   // Стратегічний хід для середнього рівня
//   function getStrategicMove(board, boardSize, aiSymbol) {
//     const availableMoves = getAvailableMoves(board);
//     if (availableMoves.length === 0) return -1;
  
//     const winningConditions = generateWinningConditions(boardSize);
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
  
//     // 3. Взяти центр (для 3x3)
//     if (boardSize === 3) {
//       const center = 4;
//       if (availableMoves.includes(center)) {
//         return center;
//       }
//     }
  
//     // 4. Взяти вільний кут
//     const corners = getCornerCells(boardSize);
//     const availableCorners = corners.filter(corner => availableMoves.includes(corner));
//     if (availableCorners.length > 0) {
//       return availableCorners[Math.floor(Math.random() * availableCorners.length)];
//     }
  
//     // 5. Взяти край
//     const edges = getEdgeCells(boardSize);
//     const availableEdges = edges.filter(edge => availableMoves.includes(edge));
//     if (availableEdges.length > 0) {
//       return availableEdges[Math.floor(Math.random() * availableEdges.length)];
//     }
  
//     // 6. Випадковий хід
//     return availableMoves[Math.floor(Math.random() * availableMoves.length)];
//   }
  
//   // Випадковий хід
//   function getRandomMove(board) {
//     const availableMoves = getAvailableMoves(board);
//     if (availableMoves.length === 0) return -1;
    
//     return availableMoves[Math.floor(Math.random() * availableMoves.length)];
//   }
  
//   // Головна функція для отримання найкращого ходу
//   function getBestMove(board, boardSize, difficulty, aiSymbol, playerSymbol, randomness) {
//     const availableMoves = getAvailableMoves(board);
//     if (availableMoves.length === 0) return -1;
  
//     // Додати випадковість
//     if (randomness > 0 && Math.random() * 100 < randomness) {
//       return getRandomMove(board);
//     }
  
//     switch (difficulty) {
//       case 'easy':
//         return getRandomMove(board);
        
//       case 'medium':
//         return getStrategicMove(board, boardSize, aiSymbol);
        
//       case 'hard':
//         // Для дошки 4×4 з багатьма ходами використовувати стратегію + мінімакс
//         if (boardSize === 4 && availableMoves.length > 12) {
//             return getStrategicMove(board, boardSize, aiSymbol);
//         }
        
//         const maxDepth = boardSize === 3 ? 9 : 7;  // Збільшили глибину!
//         const { move } = minimax(board, boardSize, 0, maxDepth, true, aiSymbol, -Infinity, Infinity);
//         return move !== -1 ? move : getRandomMove(board);
        
//       default:
//         return getRandomMove(board);
//     }
//   }
  
//   // Обробник повідомлень від головного потоку
//   self.onmessage = function(e) {
//     const { board, boardSize, difficulty, aiSymbol, playerSymbol, randomness } = e.data;
    
//     try {
//       const move = getBestMove(board, boardSize, difficulty, aiSymbol, playerSymbol, randomness);
//       self.postMessage({ 
//         success: true, 
//         move,
//         evaluation: move !== -1 ? evaluatePosition(
//           makeMove(board, move, aiSymbol), 
//           boardSize, 
//           generateWinningConditions(boardSize),
//           aiSymbol, 
//           playerSymbol
//         ) : 0
//       });
//     } catch (error) {
//       self.postMessage({ 
//         success: false, 
//         error: error.message 
//       });
//     }
//   };



















// // public/ai-worker.js
// // Web Worker для AI обчислень - не блокує UI

// // Допоміжні функції (адаптовані з gameUtils.ts)
// function generateWinningConditions(size) {
//   const conditions = [];
  
//   // Рядки (3 в ряд)
//   for (let row = 0; row < size; row++) {
//     for (let col = 0; col <= size - 3; col++) {
//       conditions.push([
//         row * size + col,
//         row * size + col + 1,
//         row * size + col + 2
//       ]);
//     }
//   }
  
//   // Стовпці (3 в ряд)
//   for (let col = 0; col < size; col++) {
//     for (let row = 0; row <= size - 3; row++) {
//       conditions.push([
//         row * size + col,
//         (row + 1) * size + col,
//         (row + 2) * size + col
//       ]);
//     }
//   }
  
//   // Діагоналі зліва направо
//   for (let row = 0; row <= size - 3; row++) {
//     for (let col = 0; col <= size - 3; col++) {
//       conditions.push([
//         row * size + col,
//         (row + 1) * size + col + 1,
//         (row + 2) * size + col + 2
//       ]);
//     }
//   }
  
//   // Діагоналі справа наліво
//   for (let row = 0; row <= size - 3; row++) {
//     for (let col = 2; col < size; col++) {
//       conditions.push([
//         row * size + col,
//         (row + 1) * size + col - 1,
//         (row + 2) * size + col - 2
//       ]);
//     }
//   }
  
//   return conditions;
// }

// function checkWinner(board, winningConditions) {
//   for (const [a, b, c] of winningConditions) {
//     if (board[a] && board[a] === board[b] && board[a] === board[c]) {
//       return {
//         winner: board[a],
//         winningLine: [a, b, c]
//       };
//     }
//   }
  
//   return { winner: null, winningLine: [] };
// }

// function isBoardFull(board) {
//   return !board.includes('');
// }

// function isGameFinished(board, winningConditions) {
//   const { winner, winningLine } = checkWinner(board, winningConditions);
  
//   if (winner) {
//     return { finished: true, winner, isDraw: false, winningLine };
//   }
  
//   if (isBoardFull(board)) {
//     return { finished: true, winner: null, isDraw: true, winningLine: [] };
//   }
  
//   return { finished: false, winner: null, isDraw: false, winningLine: [] };
// }

// function getOppositePlayer(player) {
//   return player === 'X' ? 'O' : 'X';
// }

// function makeMove(board, index, player) {
//   if (board[index] !== '') {
//     return board;
//   }
  
//   const newBoard = [...board];
//   newBoard[index] = player;
//   return newBoard;
// }

// // Функції для роботи з обмеженнями 4×4
// // function getRestrictedCells(board, boardSize) {
// //   if (boardSize !== 4) return [];
  
// //   const moveCount = board.filter(cell => cell !== '').length;
  
// //   // Обмеження тільки на другому ході
// //   if (moveCount !== 1) return [];
  
// //   // Знаходимо перший хід
// //   const firstMoveIndex = board.findIndex(cell => cell !== '');
// //   if (firstMoveIndex === -1) return [];
  
// //   const row = Math.floor(firstMoveIndex / 4);
// //   const col = firstMoveIndex % 4;
  
// //   const restricted = [];
  
// //   // Сусідні клітинки (8 напрямків)
// //   for (let dr = -1; dr <= 1; dr++) {
// //     for (let dc = -1; dc <= 1; dc++) {
// //       if (dr === 0 && dc === 0) continue;
      
// //       const newRow = row + dr;
// //       const newCol = col + dc;
      
// //       if (newRow >= 0 && newRow < 4 && newCol >= 0 && newCol < 4) {
// //         restricted.push(newRow * 4 + newCol);
// //       }
// //     }
// //   }
  
// //   return restricted;
// // }

// // function getRestrictedCells(board, boardSize, currentPlayer, firstPlayer) {
// //   if (boardSize !== 4) return [];
// //   if (currentPlayer !== firstPlayer) return [];
  
// //   const moveCount = board.filter(cell => cell !== '').length;
// //   if (moveCount !== 1) return [];
  
// //   const firstMoveIndex = board.findIndex(cell => cell !== '');
// //   if (firstMoveIndex === -1) return [];
  
// //   const row = Math.floor(firstMoveIndex / 4);
// //   const col = firstMoveIndex % 4;
// //   const restrictedCells = [];
  
// //   // Всі 8 напрямків
// //   const directions = [
// //     [-1, -1], [-1, 0], [-1, 1],
// //     [0, -1],           [0, 1],
// //     [1, -1],  [1, 0],  [1, 1]
// //   ];
  
// //   for (const [deltaRow, deltaCol] of directions) {
// //     const adjacentRow = row + deltaRow;
// //     const adjacentCol = col + deltaCol;
    
// //     if (adjacentRow >= 0 && adjacentRow < 4 && 
// //         adjacentCol >= 0 && adjacentCol < 4) {
      
// //       const adjacentIndex = adjacentRow * 4 + adjacentCol;
      
// //       if (board[adjacentIndex] !== '') continue;
      
// //       const nextRow = adjacentRow + deltaRow;
// //       const nextCol = adjacentCol + deltaCol;
      
// //       if (nextRow >= 0 && nextRow < 4 && 
// //           nextCol >= 0 && nextCol < 4) {
        
// //         const nextIndex = nextRow * 4 + nextCol;
        
// //         if (board[nextIndex] === '') {
// //           restrictedCells.push(adjacentIndex);
// //         }
// //       }
// //     }
// //   }
  
// //   return restrictedCells;
// // }

// // function getRestrictedCells(board, boardSize, currentPlayer, firstPlayer) {
// //   if (boardSize !== 4) return [];
  
// //   const secondPlayer = getOppositePlayer(firstPlayer);
// //   const firstPlayerMoves = board.filter(cell => cell === firstPlayer).length;
// //   const secondPlayerMoves = board.filter(cell => cell === secondPlayer).length;
  
// //   // Перевіряємо чи це другий хід для будь-якого з гравців
// //   const isSecondMoveForFirst = currentPlayer === firstPlayer && firstPlayerMoves === 1;
// //   const isSecondMoveForSecond = currentPlayer === secondPlayer && secondPlayerMoves === 1;
  
// //   if (!isSecondMoveForFirst && !isSecondMoveForSecond) return [];
  
// //   const firstMoveIndex = board.findIndex(cell => cell === currentPlayer);
// //   if (firstMoveIndex === -1) return [];
  
// //   const row = Math.floor(firstMoveIndex / 4);
// //   const col = firstMoveIndex % 4;
// //   const restrictedCells = [];
  
// //   // Всі 8 напрямків
// //   const directions = [
// //     [-1, -1], [-1, 0], [-1, 1],
// //     [0, -1],           [0, 1],
// //     [1, -1],  [1, 0],  [1, 1]
// //   ];
  
// //   for (const [deltaRow, deltaCol] of directions) {
// //     const adjacentRow = row + deltaRow;
// //     const adjacentCol = col + deltaCol;
    
// //     if (adjacentRow >= 0 && adjacentRow < 4 && 
// //         adjacentCol >= 0 && adjacentCol < 4) {
      
// //       const adjacentIndex = adjacentRow * 4 + adjacentCol;
      
// //       if (board[adjacentIndex] !== '') continue;
      
// //       const nextRow = adjacentRow + deltaRow;
// //       const nextCol = adjacentCol + deltaCol;
      
// //       if (nextRow >= 0 && nextRow < 4 && 
// //           nextCol >= 0 && nextCol < 4) {
        
// //         const nextIndex = nextRow * 4 + nextCol;
        
// //         if (board[nextIndex] === '') {
// //           restrictedCells.push(adjacentIndex);
// //         }
// //       }
// //     }
// //   }
  
// //   return restrictedCells;
// // }

// // public/ai-worker.js
// function getRestrictedCells(board, boardSize, currentPlayer, firstPlayer) {
//   if (boardSize !== 4) return [];
  
//   // Визначаємо другого гравця
//   function getOppositePlayer(player) {
//     return player === 'X' ? 'O' : 'X';
//   }
//   const secondPlayer = getOppositePlayer(firstPlayer);
  
//   // Підраховуємо ходи кожного гравця
//   const firstPlayerMoves = board.filter(cell => cell === firstPlayer).length;
//   const secondPlayerMoves = board.filter(cell => cell === secondPlayer).length;
  
//   // Перевіряємо чи це другий хід для будь-якого з гравців
//   const isSecondMoveForFirst = currentPlayer === firstPlayer && firstPlayerMoves === 1;
//   const isSecondMoveForSecond = currentPlayer === secondPlayer && secondPlayerMoves === 1;
  
//   if (!isSecondMoveForFirst && !isSecondMoveForSecond) return [];
  
//   // Знаходимо позицію першого ходу відповідного гравця
//   let firstMovePosition = -1;
//   for (let i = 0; i < board.length; i++) {
//     if (board[i] === currentPlayer) {
//       firstMovePosition = i;
//       break;
//     }
//   }
//   if (firstMovePosition === -1) return [];
  
//   const row = Math.floor(firstMovePosition / 4);
//   const col = firstMovePosition % 4;
//   const restrictedCells = [];
  
//   // Всі 8 напрямків від першого ходу
//   const directions = [
//     [-1, -1], [-1, 0], [-1, 1],
//     [0, -1],           [0, 1],
//     [1, -1],  [1, 0],  [1, 1]
//   ];
  
//   for (const [deltaRow, deltaCol] of directions) {
//     const adjacentRow = row + deltaRow;
//     const adjacentCol = col + deltaCol;
    
//     if (adjacentRow >= 0 && adjacentRow < 4 && 
//         adjacentCol >= 0 && adjacentCol < 4) {
      
//       const adjacentIndex = adjacentRow * 4 + adjacentCol;
      
//       if (board[adjacentIndex] !== '') continue;
      
//       const nextRow = adjacentRow + deltaRow;
//       const nextCol = adjacentCol + deltaCol;
      
//       if (nextRow >= 0 && nextRow < 4 && 
//           nextCol >= 0 && nextCol < 4) {
        
//         const nextIndex = nextRow * 4 + nextCol;
        
//         if (board[nextIndex] === '') {
//           // 🔥 ВИКЛЮЧЕННЯ 1: перевіряємо чи лінія має дві зайняті клітинки
//           const lineCells = [firstMovePosition, adjacentIndex, nextIndex];
//           let occupiedCount = 0;
          
//           for (const cellIndex of lineCells) {
//             if (board[cellIndex] !== '') {
//               occupiedCount++;
//             }
//           }
          
//           // Якщо в лінії вже дві зайняті клітинки - дозволити хід
//           if (occupiedCount === 2) {
//             continue; // Пропускаємо додавання в заборонені
//           }
          
//           // 🔥 ВИКЛЮЧЕННЯ 2: перевіряємо чи хід блокує виграшну позицію
//           if (currentPlayer === secondPlayer && secondPlayerMoves === 1) {
//             const winningConditions = generateWinningConditions(boardSize);
            
//             let allowsBlocking = false;
            
//             for (const condition of winningConditions) {
//               if (condition.includes(adjacentIndex)) {
//                 let firstPlayerCount = 0;
//                 let emptyCount = 0;
                
//                 for (const cellIndex of condition) {
//                   if (board[cellIndex] === firstPlayer) {
//                     firstPlayerCount++;
//                   } else if (board[cellIndex] === '') {
//                     emptyCount++;
//                   }
//                 }
                
//                 // Якщо перший гравець може виграти наступним ходом
//                 if (firstPlayerCount === 2 && emptyCount === 1) {
//                   allowsBlocking = true;
//                   break;
//                 }
//               }
//             }
            
//             // Дозволяємо хід, якщо він блокує виграшну позицію
//             if (allowsBlocking) {
//               continue;
//             }
//           }
          
//           restrictedCells.push(adjacentIndex);
//         }
//       }
//     }
//   }
  
//   return restrictedCells;
// }

// // Покращена функція оцінки позиції
// function evaluatePosition(board, boardSize, winningConditions, aiSymbol, playerSymbol) {
//   const result = isGameFinished(board, winningConditions);

//   // Термінальні позиції
//   if (result.winner === aiSymbol) return 1000;
//   if (result.winner === playerSymbol) return -1000;
//   if (result.isDraw) return 0;

//   let score = 0;

//   // Аналіз кожної виграшної лінії
//   for (const condition of winningConditions) {
//     let aiCount = 0;
//     let playerCount = 0;
//     let emptyCount = 0;

//     for (const index of condition) {
//       const cell = board[index];
//       if (cell === aiSymbol) aiCount++;
//       else if (cell === playerSymbol) playerCount++;
//       else emptyCount++;
//     }

//     // Оцінка лінії
//     if (playerCount === 0) {
//       // Лінія доступна для AI
//       if (aiCount === 2 && emptyCount === 1) score += 100;  // Майже виграш
//       else if (aiCount === 2) score += 50;                 // Два в ряд
//       else if (aiCount === 1) score += 10;                 // Один в ряд
//     } else if (aiCount === 0) {
//       // Лінія доступна для гравця - блокувати
//       if (playerCount === 2 && emptyCount === 1) score -= 90;  // Блокуємо виграш
//       else if (playerCount === 2) score -= 40;                 // Блокуємо два в ряд
//       else if (playerCount === 1) score -= 5;                  // Блокуємо один в ряд
//     }
//   }

//   // 🔥 ДОДАТКОВІ БОНУСИ ДЛЯ 4×4
//   if (boardSize === 4) {
//     // Бонус за центральні позиції (5, 6, 9, 10)
//     const centerPositions = [5, 6, 9, 10];
//     for (const pos of centerPositions) {
//       if (board[pos] === aiSymbol) score += 15;
//       else if (board[pos] === playerSymbol) score -= 10;
//     }
    
//     // Бонус за контроль кутів тільки якщо є центр
//     const corners = [0, 3, 12, 15];
//     const aiCenters = centerPositions.filter(pos => board[pos] === aiSymbol).length;
//     if (aiCenters > 0) {
//       for (const corner of corners) {
//         if (board[corner] === aiSymbol) score += 8;
//       }
//     }
//   }

//   return score;
// }

// // Функції для пошуку вилок
// function findBestFork(board, symbol, availableMoves, winningConditions) {
//   const bestForks = [];
  
//   for (const move of availableMoves) {
//     const testBoard = makeMove([...board], move, symbol);
//     const winningOpportunities = countWinningOpportunities(testBoard, symbol, winningConditions);
    
//     // Вилка - це коли у нас 2+ способи виграти наступним ходом
//     if (winningOpportunities >= 2) {
//       bestForks.push({
//         move,
//         opportunities: winningOpportunities,
//         score: evaluatePositionAfterMove(testBoard, symbol, winningConditions)
//       });
//     }
//   }
  
//   if (bestForks.length === 0) return -1;
  
//   // Вибираємо найкращу вилку
//   bestForks.sort((a, b) => {
//     if (a.opportunities !== b.opportunities) {
//       return b.opportunities - a.opportunities;
//     }
//     return b.score - a.score;
//   });
  
//   return bestForks[0].move;
// }

// function countWinningOpportunities(board, symbol, winningConditions) {
//   let count = 0;
  
//   for (const condition of winningConditions) {
//     let symbolCount = 0;
//     let emptyCount = 0;
    
//     for (const index of condition) {
//       if (board[index] === symbol) symbolCount++;
//       else if (board[index] === '') emptyCount++;
//     }
    
//     // Можемо виграти в один хід якщо маємо 2 символи і 1 пусту клітинку
//     if (symbolCount === 2 && emptyCount === 1) {
//       count++;
//     }
//   }
  
//   return count;
// }

// function evaluatePositionAfterMove(board, symbol, winningConditions) {
//   const opponent = getOppositePlayer(symbol);
//   let score = 0;
  
//   for (const condition of winningConditions) {
//     let symbolCount = 0;
//     let opponentCount = 0;
    
//     for (const index of condition) {
//       if (board[index] === symbol) symbolCount++;
//       else if (board[index] === opponent) opponentCount++;
//     }
    
//     // Оцінка лінії
//     if (opponentCount === 0) {
//       if (symbolCount === 2) score += 50;
//       else if (symbolCount === 1) score += 10;
//     } else if (symbolCount === 0) {
//       if (opponentCount === 2) score -= 25;
//       else if (opponentCount === 1) score -= 5;
//     }
//   }
  
//   return score;
// }

// // Мінімакс з підтримкою обмежень
// function minimaxWithRestrictions(board, boardSize, depth, maxDepth, isMaximizing, aiSymbol, restrictedCells, alpha, beta) {
//   const winningConditions = generateWinningConditions(boardSize);
//   const result = isGameFinished(board, winningConditions);
//   const playerSymbol = getOppositePlayer(aiSymbol);

//   // Термінальні випадки
//   if (result.winner === aiSymbol) {
//     return { score: 1000 - depth, move: -1 };
//   }
  
//   if (result.winner === playerSymbol) {
//     return { score: depth - 1000, move: -1 };
//   }
  
//   if (result.isDraw || depth >= maxDepth) {
//     const score = evaluatePosition(board, boardSize, winningConditions, aiSymbol, playerSymbol);
//     return { score, move: -1 };
//   }

//   // Отримуємо доступні ходи з урахуванням обмежень
//   const availableMoves = board
//     .map((cell, index) => {
//       if (cell !== '') return -1;
//       if (restrictedCells && restrictedCells.includes(index)) return -1;
//       return index;
//     })
//     .filter(index => index !== -1);

//   let bestMove = availableMoves[0] || -1;

//   if (isMaximizing) {
//     let maxScore = -Infinity;
    
//     for (const move of availableMoves) {
//       const newBoard = makeMove([...board], move, aiSymbol);
//       const { score } = minimaxWithRestrictions(newBoard, boardSize, depth + 1, maxDepth, false, aiSymbol, [], alpha, beta);
      
//       if (score > maxScore) {
//         maxScore = score;
//         bestMove = move;
//       }
      
//       alpha = Math.max(alpha, score);
//       if (beta <= alpha) break;
//     }
    
//     return { score: maxScore, move: bestMove };
    
//   } else {
//     let minScore = Infinity;
    
//     for (const move of availableMoves) {
//       const newBoard = makeMove([...board], move, playerSymbol);
//       const { score } = minimaxWithRestrictions(newBoard, boardSize, depth + 1, maxDepth, true, aiSymbol, [], alpha, beta);
      
//       if (score < minScore) {
//         minScore = score;
//         bestMove = move;
//       }
      
//       beta = Math.min(beta, score);
//       if (beta <= alpha) break;
//     }
    
//     return { score: minScore, move: bestMove };
//   }
// }

// // Покращена стратегічна функція
// function getStrategicMove(board, boardSize, aiSymbol, restrictedCells = []) {
//   const availableMoves = board
//     .map((cell, index) => {
//       if (cell !== '') return -1;
//       if (restrictedCells.includes(index)) return -1;
//       return index;
//     })
//     .filter(index => index !== -1);
    
//   if (availableMoves.length === 0) return -1;

//   const winningConditions = generateWinningConditions(boardSize);
//   const playerSymbol = getOppositePlayer(aiSymbol);

//   // 1. Спробувати виграти
//   for (const move of availableMoves) {
//     const testBoard = makeMove([...board], move, aiSymbol);
//     const result = checkWinner(testBoard, winningConditions);
//     if (result.winner === aiSymbol) {
//       return move;
//     }
//   }

//   // 2. Заблокувати виграш гравця
//   for (const move of availableMoves) {
//     const testBoard = makeMove([...board], move, playerSymbol);
//     const result = checkWinner(testBoard, winningConditions);
//     if (result.winner === playerSymbol) {
//       return move;
//     }
//   }

//   // 3. 🔥 ПОКРАЩЕНА ЛОГІКА ДЛЯ 4×4: Шукати вилки
//   if (boardSize === 4) {
//     const forkMove = findBestFork(board, aiSymbol, availableMoves, winningConditions);
//     if (forkMove !== -1) return forkMove;
    
//     // Блокувати вилки противника
//     const blockForkMove = findBestFork(board, playerSymbol, availableMoves, winningConditions);
//     if (blockForkMove !== -1) return blockForkMove;
//   }

//   // 4. 🔥 ПОКРАЩЕНІ стратегічні позиції для 4×4
//   if (boardSize === 4) {
//     // Пріоритет центральним позиціям: індекси 5, 6, 9, 10
//     const centerPositions = [5, 6, 9, 10];
//     const availableCenters = centerPositions.filter(pos => availableMoves.includes(pos));
    
//     // Вибираємо найкращий центр базуючись на потенціалі
//     if (availableCenters.length > 0) {
//       let bestCenter = availableCenters[0];
//       let bestScore = -Infinity;
      
//       for (const center of availableCenters) {
//         const testBoard = makeMove([...board], center, aiSymbol);
//         const score = evaluatePosition(testBoard, boardSize, winningConditions, aiSymbol, playerSymbol);
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
//         const score = evaluatePosition(testBoard, boardSize, winningConditions, aiSymbol, playerSymbol);
//         if (score > bestScore) {
//           bestScore = score;
//           bestStrategic = pos;
//         }
//       }
//     }
    
//     if (bestStrategic !== -1) return bestStrategic;
//   }

//   // 5. Для 3×3 - центр, потім кути
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

//   // 6. Найкращий доступний хід базуючись на оцінці
//   let bestMove = availableMoves[0];
//   let bestScore = -Infinity;
  
//   for (const move of availableMoves) {
//     const testBoard = makeMove([...board], move, aiSymbol);
//     const score = evaluatePosition(testBoard, boardSize, winningConditions, aiSymbol, playerSymbol);
//     if (score > bestScore) {
//       bestScore = score;
//       bestMove = move;
//     }
//   }

//   return bestMove;
// }

// // Головна функція для отримання найкращого ходу
// function getBestMove(board, boardSize, difficulty, aiSymbol, playerSymbol, randomness, restrictedCells = []) {
//   const availableMoves = board
//     .map((cell, index) => {
//       if (cell !== '') return -1;
//       if (restrictedCells.includes(index)) return -1;
//       return index;
//     })
//     .filter(index => index !== -1);
    
//   if (availableMoves.length === 0) return -1;

//   // Додати випадковість
//   if (randomness > 0 && Math.random() * 100 < randomness) {
//     return availableMoves[Math.floor(Math.random() * availableMoves.length)];
//   }

//   switch (difficulty) {
//     case 'easy':
//       return availableMoves[Math.floor(Math.random() * availableMoves.length)];
      
//     case 'medium':
//       return getStrategicMove(board, boardSize, aiSymbol, restrictedCells);
      
//     case 'hard':
//       // Для 4×4 з багатьма доступними ходами використовуємо стратегію + мінімакс
//       if (boardSize === 4 && availableMoves.length > 8) {
//         return getStrategicMove(board, boardSize, aiSymbol, restrictedCells);
//       }
      
//       const maxDepth = boardSize === 3 ? 9 : 6;
//       const { move } = minimaxWithRestrictions(board, boardSize, 0, maxDepth, true, aiSymbol, restrictedCells, -Infinity, Infinity);
//       return move !== -1 ? move : getStrategicMove(board, boardSize, aiSymbol, restrictedCells);
      
//     default:
//       return availableMoves[Math.floor(Math.random() * availableMoves.length)];
//   }
// }

// // Обробник повідомлень від головного потоку
// // self.onmessage = function(e) {
// //   const { board, boardSize, difficulty, aiSymbol, playerSymbol, randomness, restrictedCells } = e.data;
  
// //   try {
// //     // Розрахуйте обмеження якщо не передані
// //     const restrictions = restrictedCells || getRestrictedCells(board, boardSize);
    
// //     const move = getBestMove(board, boardSize, difficulty, aiSymbol, playerSymbol, randomness, restrictions);
// //     self.postMessage({ 
// //       success: true, 
// //       move,
// //       evaluation: move !== -1 ? evaluatePosition(
// //         makeMove([...board], move, aiSymbol), 
// //         boardSize, 
// //         generateWinningConditions(boardSize),
// //         aiSymbol, 
// //         playerSymbol
// //       ) : 0
// //     });
// //   } catch (error) {
// //     self.postMessage({ 
// //       success: false, 
// //       error: error.message 
// //     });
// //   }
// // };

// // Обробник повідомлень від головного потоку
// self.onmessage = function(e) {
//   const { board, boardSize, difficulty, aiSymbol, playerSymbol, randomness, restrictedCells, firstPlayer } = e.data;
  
//   try {
//     // Розрахуйте обмеження якщо не передані (тепер з урахуванням firstPlayer)
//     const restrictions = restrictedCells || getRestrictedCells(board, boardSize, aiSymbol, firstPlayer);
    
//     const move = getBestMove(board, boardSize, difficulty, aiSymbol, playerSymbol, randomness, restrictions);
//     self.postMessage({ 
//       success: true, 
//       move,
//       evaluation: move !== -1 ? evaluatePosition(
//         makeMove([...board], move, aiSymbol), 
//         boardSize, 
//         generateWinningConditions(boardSize),
//         aiSymbol, 
//         playerSymbol
//       ) : 0
//     });
//   } catch (error) {
//     self.postMessage({ 
//       success: false, 
//       error: error.message 
//     });
//   }
// };














































// // public/ai-worker.js
// // Web Worker для AI обчислень - не блокує UI

// // Допоміжні функції (адаптовані з gameUtils.ts)
// function generateWinningConditions(size) {
//   const conditions = [];
  
//   // Рядки (3 в ряд)
//   for (let row = 0; row < size; row++) {
//     for (let col = 0; col <= size - 3; col++) {
//       conditions.push([
//         row * size + col,
//         row * size + col + 1,
//         row * size + col + 2
//       ]);
//     }
//   }
  
//   // Стовпці (3 в ряд)
//   for (let col = 0; col < size; col++) {
//     for (let row = 0; row <= size - 3; row++) {
//       conditions.push([
//         row * size + col,
//         (row + 1) * size + col,
//         (row + 2) * size + col
//       ]);
//     }
//   }
  
//   // Діагоналі зліва направо
//   for (let row = 0; row <= size - 3; row++) {
//     for (let col = 0; col <= size - 3; col++) {
//       conditions.push([
//         row * size + col,
//         (row + 1) * size + col + 1,
//         (row + 2) * size + col + 2
//       ]);
//     }
//   }
  
//   // Діагоналі справа наліво
//   for (let row = 0; row <= size - 3; row++) {
//     for (let col = 2; col < size; col++) {
//       conditions.push([
//         row * size + col,
//         (row + 1) * size + col - 1,
//         (row + 2) * size + col - 2
//       ]);
//     }
//   }
  
//   return conditions;
// }

// function checkWinner(board, winningConditions) {
//   for (const [a, b, c] of winningConditions) {
//     if (board[a] && board[a] === board[b] && board[a] === board[c]) {
//       return {
//         winner: board[a],
//         winningLine: [a, b, c]
//       };
//     }
//   }
  
//   return { winner: null, winningLine: [] };
// }

// function isBoardFull(board) {
//   return !board.includes('');
// }

// function isGameFinished(board, winningConditions) {
//   const { winner, winningLine } = checkWinner(board, winningConditions);
  
//   if (winner) {
//     return { finished: true, winner, isDraw: false, winningLine };
//   }
  
//   if (isBoardFull(board)) {
//     return { finished: true, winner: null, isDraw: true, winningLine: [] };
//   }
  
//   return { finished: false, winner: null, isDraw: false, winningLine: [] };
// }

// function getOppositePlayer(player) {
//   return player === 'X' ? 'O' : 'X';
// }

// function makeMove(board, index, player) {
//   if (board[index] !== '') {
//     return board;
//   }
  
//   const newBoard = [...board];
//   newBoard[index] = player;
//   return newBoard;
// }

// // Функції для роботи з обмеженнями 4×4
// // function getRestrictedCells(board, boardSize) {
// //   if (boardSize !== 4) return [];
  
// //   const moveCount = board.filter(cell => cell !== '').length;
  
// //   // Обмеження тільки на другому ході
// //   if (moveCount !== 1) return [];
  
// //   // Знаходимо перший хід
// //   const firstMoveIndex = board.findIndex(cell => cell !== '');
// //   if (firstMoveIndex === -1) return [];
  
// //   const row = Math.floor(firstMoveIndex / 4);
// //   const col = firstMoveIndex % 4;
  
// //   const restricted = [];
  
// //   // Сусідні клітинки (8 напрямків)
// //   for (let dr = -1; dr <= 1; dr++) {
// //     for (let dc = -1; dc <= 1; dc++) {
// //       if (dr === 0 && dc === 0) continue;
      
// //       const newRow = row + dr;
// //       const newCol = col + dc;
      
// //       if (newRow >= 0 && newRow < 4 && newCol >= 0 && newCol < 4) {
// //         restricted.push(newRow * 4 + newCol);
// //       }
// //     }
// //   }
  
// //   return restricted;
// // }

// // function getRestrictedCells(board, boardSize, currentPlayer, firstPlayer) {
// //   if (boardSize !== 4) return [];
// //   if (currentPlayer !== firstPlayer) return [];
  
// //   const moveCount = board.filter(cell => cell !== '').length;
// //   if (moveCount !== 1) return [];
  
// //   const firstMoveIndex = board.findIndex(cell => cell !== '');
// //   if (firstMoveIndex === -1) return [];
  
// //   const row = Math.floor(firstMoveIndex / 4);
// //   const col = firstMoveIndex % 4;
// //   const restrictedCells = [];
  
// //   // Всі 8 напрямків
// //   const directions = [
// //     [-1, -1], [-1, 0], [-1, 1],
// //     [0, -1],           [0, 1],
// //     [1, -1],  [1, 0],  [1, 1]
// //   ];
  
// //   for (const [deltaRow, deltaCol] of directions) {
// //     const adjacentRow = row + deltaRow;
// //     const adjacentCol = col + deltaCol;
    
// //     if (adjacentRow >= 0 && adjacentRow < 4 && 
// //         adjacentCol >= 0 && adjacentCol < 4) {
      
// //       const adjacentIndex = adjacentRow * 4 + adjacentCol;
      
// //       if (board[adjacentIndex] !== '') continue;
      
// //       const nextRow = adjacentRow + deltaRow;
// //       const nextCol = adjacentCol + deltaCol;
      
// //       if (nextRow >= 0 && nextRow < 4 && 
// //           nextCol >= 0 && nextCol < 4) {
        
// //         const nextIndex = nextRow * 4 + nextCol;
        
// //         if (board[nextIndex] === '') {
// //           restrictedCells.push(adjacentIndex);
// //         }
// //       }
// //     }
// //   }
  
// //   return restrictedCells;
// // }

// // function getRestrictedCells(board, boardSize, currentPlayer, firstPlayer) {
// //   if (boardSize !== 4) return [];
  
// //   const secondPlayer = getOppositePlayer(firstPlayer);
// //   const firstPlayerMoves = board.filter(cell => cell === firstPlayer).length;
// //   const secondPlayerMoves = board.filter(cell => cell === secondPlayer).length;
  
// //   // Перевіряємо чи це другий хід для будь-якого з гравців
// //   const isSecondMoveForFirst = currentPlayer === firstPlayer && firstPlayerMoves === 1;
// //   const isSecondMoveForSecond = currentPlayer === secondPlayer && secondPlayerMoves === 1;
  
// //   if (!isSecondMoveForFirst && !isSecondMoveForSecond) return [];
  
// //   const firstMoveIndex = board.findIndex(cell => cell === currentPlayer);
// //   if (firstMoveIndex === -1) return [];
  
// //   const row = Math.floor(firstMoveIndex / 4);
// //   const col = firstMoveIndex % 4;
// //   const restrictedCells = [];
  
// //   // Всі 8 напрямків
// //   const directions = [
// //     [-1, -1], [-1, 0], [-1, 1],
// //     [0, -1],           [0, 1],
// //     [1, -1],  [1, 0],  [1, 1]
// //   ];
  
// //   for (const [deltaRow, deltaCol] of directions) {
// //     const adjacentRow = row + deltaRow;
// //     const adjacentCol = col + deltaCol;
    
// //     if (adjacentRow >= 0 && adjacentRow < 4 && 
// //         adjacentCol >= 0 && adjacentCol < 4) {
      
// //       const adjacentIndex = adjacentRow * 4 + adjacentCol;
      
// //       if (board[adjacentIndex] !== '') continue;
      
// //       const nextRow = adjacentRow + deltaRow;
// //       const nextCol = adjacentCol + deltaCol;
      
// //       if (nextRow >= 0 && nextRow < 4 && 
// //           nextCol >= 0 && nextCol < 4) {
        
// //         const nextIndex = nextRow * 4 + nextCol;
        
// //         if (board[nextIndex] === '') {
// //           restrictedCells.push(adjacentIndex);
// //         }
// //       }
// //     }
// //   }
  
// //   return restrictedCells;
// // }

// // public/ai-worker.js
// function getRestrictedCells(board, boardSize, currentPlayer, firstPlayer) {
//   if (boardSize !== 4) return [];
  
//   // Визначаємо другого гравця
//   function getOppositePlayer(player) {
//     return player === 'X' ? 'O' : 'X';
//   }
//   const secondPlayer = getOppositePlayer(firstPlayer);
  
//   // Підраховуємо ходи кожного гравця
//   const firstPlayerMoves = board.filter(cell => cell === firstPlayer).length;
//   const secondPlayerMoves = board.filter(cell => cell === secondPlayer).length;
  
//   // Перевіряємо чи це другий хід для будь-якого з гравців
//   const isSecondMoveForFirst = currentPlayer === firstPlayer && firstPlayerMoves === 1;
//   const isSecondMoveForSecond = currentPlayer === secondPlayer && secondPlayerMoves === 1;
  
//   if (!isSecondMoveForFirst && !isSecondMoveForSecond) return [];
  
//   // Знаходимо позицію першого ходу відповідного гравця
//   let firstMovePosition = -1;
//   for (let i = 0; i < board.length; i++) {
//     if (board[i] === currentPlayer) {
//       firstMovePosition = i;
//       break;
//     }
//   }
//   if (firstMovePosition === -1) return [];
  
//   const row = Math.floor(firstMovePosition / 4);
//   const col = firstMovePosition % 4;
//   const restrictedCells = [];
  
//   // Всі 8 напрямків від першого ходу
//   const directions = [
//     [-1, -1], [-1, 0], [-1, 1],
//     [0, -1],           [0, 1],
//     [1, -1],  [1, 0],  [1, 1]
//   ];
  
//   for (const [deltaRow, deltaCol] of directions) {
//     const adjacentRow = row + deltaRow;
//     const adjacentCol = col + deltaCol;
    
//     if (adjacentRow >= 0 && adjacentRow < 4 && 
//         adjacentCol >= 0 && adjacentCol < 4) {
      
//       const adjacentIndex = adjacentRow * 4 + adjacentCol;
      
//       if (board[adjacentIndex] !== '') continue;
      
//       const nextRow = adjacentRow + deltaRow;
//       const nextCol = adjacentCol + deltaCol;
      
//       if (nextRow >= 0 && nextRow < 4 && 
//           nextCol >= 0 && nextCol < 4) {
        
//         const nextIndex = nextRow * 4 + nextCol;
        
//         if (board[nextIndex] === '') {
//           // 🔥 ВИКЛЮЧЕННЯ 1: перевіряємо чи лінія має дві зайняті клітинки
//           const lineCells = [firstMovePosition, adjacentIndex, nextIndex];
//           let occupiedCount = 0;
          
//           for (const cellIndex of lineCells) {
//             if (board[cellIndex] !== '') {
//               occupiedCount++;
//             }
//           }
          
//           // Якщо в лінії вже дві зайняті клітинки - дозволити хід
//           if (occupiedCount === 2) {
//             continue; // Пропускаємо додавання в заборонені
//           }
          
//           // 🔥 ВИКЛЮЧЕННЯ 2: перевіряємо чи хід блокує виграшну позицію
//           if (currentPlayer === secondPlayer && secondPlayerMoves === 1) {
//             const winningConditions = generateWinningConditions(boardSize);
            
//             let allowsBlocking = false;
            
//             for (const condition of winningConditions) {
//               if (condition.includes(adjacentIndex)) {
//                 let firstPlayerCount = 0;
//                 let emptyCount = 0;
                
//                 for (const cellIndex of condition) {
//                   if (board[cellIndex] === firstPlayer) {
//                     firstPlayerCount++;
//                   } else if (board[cellIndex] === '') {
//                     emptyCount++;
//                   }
//                 }
                
//                 // Якщо перший гравець може виграти наступним ходом
//                 if (firstPlayerCount === 2 && emptyCount === 1) {
//                   allowsBlocking = true;
//                   break;
//                 }
//               }
//             }
            
//             // Дозволяємо хід, якщо він блокує виграшну позицію
//             if (allowsBlocking) {
//               continue;
//             }
//           }
          
//           restrictedCells.push(adjacentIndex);
//         }
//       }
//     }
//   }
  
//   return restrictedCells;
// }

// // Покращена функція оцінки позиції
// function evaluatePosition(board, boardSize, winningConditions, aiSymbol, playerSymbol) {
//   const result = isGameFinished(board, winningConditions);

//   // Термінальні позиції
//   if (result.winner === aiSymbol) return 1000;
//   if (result.winner === playerSymbol) return -1000;
//   if (result.isDraw) return 0;

//   let score = 0;

//   // Аналіз кожної виграшної лінії
//   for (const condition of winningConditions) {
//     let aiCount = 0;
//     let playerCount = 0;
//     let emptyCount = 0;

//     for (const index of condition) {
//       const cell = board[index];
//       if (cell === aiSymbol) aiCount++;
//       else if (cell === playerSymbol) playerCount++;
//       else emptyCount++;
//     }

//     // Оцінка лінії
//     if (playerCount === 0) {
//       // Лінія доступна для AI
//       if (aiCount === 2 && emptyCount === 1) score += 100;  // Майже виграш
//       else if (aiCount === 2) score += 50;                 // Два в ряд
//       else if (aiCount === 1) score += 10;                 // Один в ряд
//     } else if (aiCount === 0) {
//       // Лінія доступна для гравця - блокувати
//       if (playerCount === 2 && emptyCount === 1) score -= 90;  // Блокуємо виграш
//       else if (playerCount === 2) score -= 40;                 // Блокуємо два в ряд
//       else if (playerCount === 1) score -= 5;                  // Блокуємо один в ряд
//     }
//   }

//   // 🔥 ДОДАТКОВІ БОНУСИ ДЛЯ 4×4
//   if (boardSize === 4) {
//     // Бонус за центральні позиції (5, 6, 9, 10)
//     const centerPositions = [5, 6, 9, 10];
//     for (const pos of centerPositions) {
//       if (board[pos] === aiSymbol) score += 15;
//       else if (board[pos] === playerSymbol) score -= 10;
//     }
    
//     // Бонус за контроль кутів тільки якщо є центр
//     const corners = [0, 3, 12, 15];
//     const aiCenters = centerPositions.filter(pos => board[pos] === aiSymbol).length;
//     if (aiCenters > 0) {
//       for (const corner of corners) {
//         if (board[corner] === aiSymbol) score += 8;
//       }
//     }
//   }

//   return score;
// }

// // Функції для пошуку вилок
// function findBestFork(board, symbol, availableMoves, winningConditions) {
//   const bestForks = [];
  
//   for (const move of availableMoves) {
//     const testBoard = makeMove([...board], move, symbol);
//     const winningOpportunities = countWinningOpportunities(testBoard, symbol, winningConditions);
    
//     // Вилка - це коли у нас 2+ способи виграти наступним ходом
//     if (winningOpportunities >= 2) {
//       bestForks.push({
//         move,
//         opportunities: winningOpportunities,
//         score: evaluatePositionAfterMove(testBoard, symbol, winningConditions)
//       });
//     }
//   }
  
//   if (bestForks.length === 0) return -1;
  
//   // Вибираємо найкращу вилку
//   bestForks.sort((a, b) => {
//     if (a.opportunities !== b.opportunities) {
//       return b.opportunities - a.opportunities;
//     }
//     return b.score - a.score;
//   });
  
//   return bestForks[0].move;
// }

// function countWinningOpportunities(board, symbol, winningConditions) {
//   let count = 0;
  
//   for (const condition of winningConditions) {
//     let symbolCount = 0;
//     let emptyCount = 0;
    
//     for (const index of condition) {
//       if (board[index] === symbol) symbolCount++;
//       else if (board[index] === '') emptyCount++;
//     }
    
//     // Можемо виграти в один хід якщо маємо 2 символи і 1 пусту клітинку
//     if (symbolCount === 2 && emptyCount === 1) {
//       count++;
//     }
//   }
  
//   return count;
// }

// function evaluatePosition(board, boardSize, winningConditions, aiSymbol, playerSymbol) {
//   const result = isGameFinished(board, winningConditions);

//   // Термінальні позиції з урахуванням відстані до кінця гри
//   const moveCount = board.filter(cell => cell !== '').length;
//   if (result.winner === aiSymbol) return 1000 - moveCount; // Швидший виграш краще
//   if (result.winner === playerSymbol) return -1000 + moveCount; // Пізніший програш краще
//   if (result.isDraw) return 0;

//   let score = 0;

//   // 🔥 ПОКРАЩЕНИЙ АНАЛІЗ ЛІНІЙ
//   for (const condition of winningConditions) {
//     let aiCount = 0;
//     let playerCount = 0;
//     let emptyCount = 0;
//     const emptyCells = [];

//     for (const index of condition) {
//       const cell = board[index];
//       if (cell === aiSymbol) aiCount++;
//       else if (cell === playerSymbol) playerCount++;
//       else {
//         emptyCount++;
//         emptyCells.push(index);
//       }
//     }

//     // Покращена оцінка ліній
//     if (playerCount === 0) {
//       // Лінія доступна для AI
//       if (aiCount === 2 && emptyCount === 1) {
//         score += 200; // Майже виграш - дуже важливо
//       } else if (aiCount === 2) {
//         score += 80; // Два в ряд
//       } else if (aiCount === 1 && emptyCount === 2) {
//         // 🔥 НОВЕ: Бонус за відкриті лінії
//         score += 20;
//       } else if (aiCount === 1) {
//         score += 10;
//       }
//     } else if (aiCount === 0) {
//       // Лінія доступна для гравця - блокувати
//       if (playerCount === 2 && emptyCount === 1) {
//         score -= 180; // Блокуємо виграш (трохи менше ніж наш виграш)
//       } else if (playerCount === 2) {
//         score -= 60;
//       } else if (playerCount === 1 && emptyCount === 2) {
//         score -= 15;
//       } else if (playerCount === 1) {
//         score -= 5;
//       }
//     }
//   }

//   // 🔥 ПОКРАЩЕНІ ПОЗИЦІЙНІ БОНУСИ
//   if (boardSize === 4) {
//     // Центральні позиції з градацією
//     const centerCore = [5, 6, 9, 10]; // Основний центр
//     const centerExtended = [1, 2, 4, 7, 8, 11, 13, 14]; // Розширений центр
    
//     for (const pos of centerCore) {
//       if (board[pos] === aiSymbol) score += 20;
//       else if (board[pos] === playerSymbol) score -= 15;
//     }
    
//     for (const pos of centerExtended) {
//       if (board[pos] === aiSymbol) score += 8;
//       else if (board[pos] === playerSymbol) score -= 6;
//     }
    
//     // 🔥 НОВЕ: Контроль діагоналей
//     const mainDiagonals = [[0, 5, 10, 15], [3, 6, 9, 12]];
//     for (const diagonal of mainDiagonals) {
//       let aiControl = 0;
//       let playerControl = 0;
      
//       for (const pos of diagonal) {
//         if (board[pos] === aiSymbol) aiControl++;
//         else if (board[pos] === playerSymbol) playerControl++;
//       }
      
//       if (playerControl === 0) score += aiControl * aiControl * 5; // Квадратичний бонус
//       if (aiControl === 0) score -= playerControl * playerControl * 4;
//     }
//   }

//   return score;
// }


// // Мінімакс з підтримкою обмежень
// function minimaxWithRestrictions(board, boardSize, depth, maxDepth, isMaximizing, aiSymbol, restrictedCells, alpha, beta) {
//   const winningConditions = generateWinningConditions(boardSize);
//   const result = isGameFinished(board, winningConditions);
//   const playerSymbol = getOppositePlayer(aiSymbol);

//   // Термінальні випадки
//   if (result.winner === aiSymbol) {
//     return { score: 1000 - depth, move: -1 };
//   }
  
//   if (result.winner === playerSymbol) {
//     return { score: depth - 1000, move: -1 };
//   }
  
//   if (result.isDraw || depth >= maxDepth) {
//     const score = evaluatePosition(board, boardSize, winningConditions, aiSymbol, playerSymbol);
//     return { score, move: -1 };
//   }

//   // Отримуємо доступні ходи з урахуванням обмежень
//   const availableMoves = board
//     .map((cell, index) => {
//       if (cell !== '') return -1;
//       if (restrictedCells && restrictedCells.includes(index)) return -1;
//       return index;
//     })
//     .filter(index => index !== -1);

//   let bestMove = availableMoves[0] || -1;

//   if (isMaximizing) {
//     let maxScore = -Infinity;
    
//     for (const move of availableMoves) {
//       const newBoard = makeMove([...board], move, aiSymbol);
//       const { score } = minimaxWithRestrictions(newBoard, boardSize, depth + 1, maxDepth, false, aiSymbol, [], alpha, beta);
      
//       if (score > maxScore) {
//         maxScore = score;
//         bestMove = move;
//       }
      
//       alpha = Math.max(alpha, score);
//       if (beta <= alpha) break;
//     }
    
//     return { score: maxScore, move: bestMove };
    
//   } else {
//     let minScore = Infinity;
    
//     for (const move of availableMoves) {
//       const newBoard = makeMove([...board], move, playerSymbol);
//       const { score } = minimaxWithRestrictions(newBoard, boardSize, depth + 1, maxDepth, true, aiSymbol, [], alpha, beta);
      
//       if (score < minScore) {
//         minScore = score;
//         bestMove = move;
//       }
      
//       beta = Math.min(beta, score);
//       if (beta <= alpha) break;
//     }
    
//     return { score: minScore, move: bestMove };
//   }
// }

// // Покращена стратегічна функція
// function getStrategicMove(board, boardSize, aiSymbol, restrictedCells = []) {
//   const availableMoves = board
//     .map((cell, index) => {
//       if (cell !== '') return -1;
//       if (restrictedCells.includes(index)) return -1;
//       return index;
//     })
//     .filter(index => index !== -1);
    
//   if (availableMoves.length === 0) return -1;

//   const winningConditions = generateWinningConditions(boardSize);
//   const playerSymbol = getOppositePlayer(aiSymbol);

//   // 1. Спробувати виграти
//   for (const move of availableMoves) {
//     const testBoard = makeMove([...board], move, aiSymbol);
//     const result = checkWinner(testBoard, winningConditions);
//     if (result.winner === aiSymbol) {
//       return move;
//     }
//   }

//   // 2. Заблокувати виграш гравця
//   for (const move of availableMoves) {
//     const testBoard = makeMove([...board], move, playerSymbol);
//     const result = checkWinner(testBoard, winningConditions);
//     if (result.winner === playerSymbol) {
//       return move;
//     }
//   }

//   // 3. 🔥 ПОКРАЩЕНА ЛОГІКА ДЛЯ 4×4: Шукати вилки
//   if (boardSize === 4) {
//     const forkMove = findBestFork(board, aiSymbol, availableMoves, winningConditions);
//     if (forkMove !== -1) return forkMove;
    
//     // Блокувати вилки противника
//     const blockForkMove = findBestFork(board, playerSymbol, availableMoves, winningConditions);
//     if (blockForkMove !== -1) return blockForkMove;
//   }

//   // 4. 🔥 ПОКРАЩЕНІ стратегічні позиції для 4×4
//   if (boardSize === 4) {
//     // Пріоритет центральним позиціям: індекси 5, 6, 9, 10
//     const centerPositions = [5, 6, 9, 10];
//     const availableCenters = centerPositions.filter(pos => availableMoves.includes(pos));
    
//     // Вибираємо найкращий центр базуючись на потенціалі
//     if (availableCenters.length > 0) {
//       let bestCenter = availableCenters[0];
//       let bestScore = -Infinity;
      
//       for (const center of availableCenters) {
//         const testBoard = makeMove([...board], center, aiSymbol);
//         const score = evaluatePosition(testBoard, boardSize, winningConditions, aiSymbol, playerSymbol);
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
//         const score = evaluatePosition(testBoard, boardSize, winningConditions, aiSymbol, playerSymbol);
//         if (score > bestScore) {
//           bestScore = score;
//           bestStrategic = pos;
//         }
//       }
//     }
    
//     if (bestStrategic !== -1) return bestStrategic;
//   }

//   // 5. Для 3×3 - центр, потім кути
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

//   // 6. Найкращий доступний хід базуючись на оцінці
//   let bestMove = availableMoves[0];
//   let bestScore = -Infinity;
  
//   for (const move of availableMoves) {
//     const testBoard = makeMove([...board], move, aiSymbol);
//     const score = evaluatePosition(testBoard, boardSize, winningConditions, aiSymbol, playerSymbol);
//     if (score > bestScore) {
//       bestScore = score;
//       bestMove = move;
//     }
//   }

//   return bestMove;
// }

// // Головна функція для отримання найкращого ходу
// function getBestMove(board, boardSize, difficulty, aiSymbol, playerSymbol, randomness, restrictedCells = []) {
//   const availableMoves = board
//     .map((cell, index) => {
//       if (cell !== '') return -1;
//       if (restrictedCells.includes(index)) return -1;
//       return index;
//     })
//     .filter(index => index !== -1);
    
//   if (availableMoves.length === 0) return -1;

//   // Додати випадковість
//   if (randomness > 0 && Math.random() * 100 < randomness) {
//     return availableMoves[Math.floor(Math.random() * availableMoves.length)];
//   }

//   switch (difficulty) {
//     case 'easy':
//       return availableMoves[Math.floor(Math.random() * availableMoves.length)];
      
//     case 'medium':
//       return getStrategicMove(board, boardSize, aiSymbol, restrictedCells);
      
//     case 'hard':
//       // 🔥 ПОКРАЩЕНА ЛОГІКА ВАЖКОГО РІВНЯ
      
//       // 1. Спробувати знайти форсований виграш за 2-3 ходи
//       const forcedWin = findForcedWin(board, boardSize, aiSymbol, restrictedCells, 3);
//       if (forcedWin !== -1) return forcedWin;
      
//       // 2. Заблокувати форсований виграш противника
//       const blockForcedWin = findForcedWin(board, boardSize, playerSymbol, restrictedCells, 2);
//       if (blockForcedWin !== -1) return blockForcedWin;
      
//       // 3. Використати покращений мінімакс
//       const maxDepth = boardSize === 3 ? 
//         (availableMoves.length > 7 ? 7 : 9) : // Адаптивна глибина для 3x3
//         (availableMoves.length > 10 ? 5 : availableMoves.length > 6 ? 7 : 8); // Для 4x4
      
//       const { move } = minimaxWithRestrictions(board, boardSize, 0, maxDepth, true, aiSymbol, restrictedCells, -Infinity, Infinity);
      
//       // 4. Якщо мінімакс не знайшов хід - використовуємо стратегічний
//       return move !== -1 ? move : getStrategicMove(board, boardSize, aiSymbol, restrictedCells);
      
//     default:
//       return availableMoves[Math.floor(Math.random() * availableMoves.length)];
//   }
// }

// // 🔥 НОВА ФУНКЦІЯ: Пошук форсованого виграшу
// function findForcedWin(board, boardSize, symbol, restrictedCells, maxDepth) {
//   const winningConditions = generateWinningConditions(boardSize);
//   const availableMoves = board
//     .map((cell, index) => {
//       if (cell !== '') return -1;
//       if (restrictedCells.includes(index)) return -1;
//       return index;
//     })
//     .filter(index => index !== -1);

//   for (const move of availableMoves) {
//     if (canForceWin(board, boardSize, move, symbol, winningConditions, maxDepth, 0)) {
//       return move;
//     }
//   }
  
//   return -1;
// }

// // Перевірка чи може форсувати виграш
// function canForceWin(board, boardSize, move, symbol, winningConditions, maxDepth, currentDepth) {
//   if (currentDepth >= maxDepth) return false;
  
//   const testBoard = makeMove([...board], move, symbol);
//   const result = checkWinner(testBoard, winningConditions);
  
//   // Якщо це виграш - повертаємо true
//   if (result.winner === symbol) return true;
  
//   // Якщо це нічия або програш - повертаємо false
//   if (result.winner || isBoardFull(testBoard)) return false;
  
//   const opponent = getOppositePlayer(symbol);
//   const opponentMoves = testBoard
//     .map((cell, index) => cell === '' ? index : -1)
//     .filter(index => index !== -1);
  
//   // Перевіряємо всі можливі відповіді противника
//   for (const opponentMove of opponentMoves) {
//     const responseBoard = makeMove([...testBoard], opponentMove, opponent);
    
//     // Знаходимо наші наступні ходи
//     const ourNextMoves = responseBoard
//       .map((cell, index) => cell === '' ? index : -1)
//       .filter(index => index !== -1);
    
//     let canWinFromAnyMove = false;
    
//     // Перевіряємо чи можемо виграти з будь-якого наступного ходу
//     for (const nextMove of ourNextMoves) {
//       if (canForceWin(responseBoard, boardSize, nextMove, symbol, winningConditions, maxDepth, currentDepth + 1)) {
//         canWinFromAnyMove = true;
//         break;
//       }
//     }
    
//     // Якщо не можемо виграти після цього ходу противника - форсований виграш неможливий
//     if (!canWinFromAnyMove) return false;
//   }
  
//   return true;
// }

// // Обробник повідомлень від головного потоку
// // self.onmessage = function(e) {
// //   const { board, boardSize, difficulty, aiSymbol, playerSymbol, randomness, restrictedCells } = e.data;
  
// //   try {
// //     // Розрахуйте обмеження якщо не передані
// //     const restrictions = restrictedCells || getRestrictedCells(board, boardSize);
    
// //     const move = getBestMove(board, boardSize, difficulty, aiSymbol, playerSymbol, randomness, restrictions);
// //     self.postMessage({ 
// //       success: true, 
// //       move,
// //       evaluation: move !== -1 ? evaluatePosition(
// //         makeMove([...board], move, aiSymbol), 
// //         boardSize, 
// //         generateWinningConditions(boardSize),
// //         aiSymbol, 
// //         playerSymbol
// //       ) : 0
// //     });
// //   } catch (error) {
// //     self.postMessage({ 
// //       success: false, 
// //       error: error.message 
// //     });
// //   }
// // };

// // Обробник повідомлень від головного потоку
// self.onmessage = function(e) {
//   const { board, boardSize, difficulty, aiSymbol, playerSymbol, randomness, restrictedCells, firstPlayer } = e.data;
  
//   try {
//     // Розрахуйте обмеження якщо не передані (тепер з урахуванням firstPlayer)
//     const restrictions = restrictedCells || getRestrictedCells(board, boardSize, aiSymbol, firstPlayer);
    
//     const move = getBestMove(board, boardSize, difficulty, aiSymbol, playerSymbol, randomness, restrictions);
//     self.postMessage({ 
//       success: true, 
//       move,
//       evaluation: move !== -1 ? evaluatePosition(
//         makeMove([...board], move, aiSymbol), 
//         boardSize, 
//         generateWinningConditions(boardSize),
//         aiSymbol, 
//         playerSymbol
//       ) : 0
//     });
//   } catch (error) {
//     self.postMessage({ 
//       success: false, 
//       error: error.message 
//     });
//   }
// };











// // public/ai-worker.js
// // Web Worker для AI обчислень - покращена версія з максимальною складністю

// // Допоміжні функції (адаптовані з gameUtils.ts)
// function generateWinningConditions(size) {
//   const conditions = [];
  
//   // Рядки (3 в ряд)
//   for (let row = 0; row < size; row++) {
//     for (let col = 0; col <= size - 3; col++) {
//       conditions.push([
//         row * size + col,
//         row * size + col + 1,
//         row * size + col + 2
//       ]);
//     }
//   }
  
//   // Стовпці (3 в ряд)
//   for (let col = 0; col < size; col++) {
//     for (let row = 0; row <= size - 3; row++) {
//       conditions.push([
//         row * size + col,
//         (row + 1) * size + col,
//         (row + 2) * size + col
//       ]);
//     }
//   }
  
//   // Діагоналі зліва направо
//   for (let row = 0; row <= size - 3; row++) {
//     for (let col = 0; col <= size - 3; col++) {
//       conditions.push([
//         row * size + col,
//         (row + 1) * size + col + 1,
//         (row + 2) * size + col + 2
//       ]);
//     }
//   }
  
//   // Діагоналі справа наліво
//   for (let row = 0; row <= size - 3; row++) {
//     for (let col = 2; col < size; col++) {
//       conditions.push([
//         row * size + col,
//         (row + 1) * size + col - 1,
//         (row + 2) * size + col - 2
//       ]);
//     }
//   }
  
//   return conditions;
// }

// function checkWinner(board, winningConditions) {
//   for (const [a, b, c] of winningConditions) {
//     if (board[a] && board[a] === board[b] && board[a] === board[c]) {
//       return {
//         winner: board[a],
//         winningLine: [a, b, c]
//       };
//     }
//   }
  
//   return { winner: null, winningLine: [] };
// }

// function isBoardFull(board) {
//   return !board.includes('');
// }

// function isGameFinished(board, winningConditions) {
//   const { winner, winningLine } = checkWinner(board, winningConditions);
  
//   if (winner) {
//     return { finished: true, winner, isDraw: false, winningLine };
//   }
  
//   if (isBoardFull(board)) {
//     return { finished: true, winner: null, isDraw: true, winningLine: [] };
//   }
  
//   return { finished: false, winner: null, isDraw: false, winningLine: [] };
// }

// function getOppositePlayer(player) {
//   return player === 'X' ? 'O' : 'X';
// }

// function makeMove(board, index, player) {
//   if (board[index] !== '') {
//     return board;
//   }
  
//   const newBoard = [...board];
//   newBoard[index] = player;
//   return newBoard;
// }

// // Функції для роботи з обмеженнями 4×4
// function getRestrictedCells(board, boardSize, currentPlayer, firstPlayer) {
//   if (boardSize !== 4) return [];
  
//   const secondPlayer = getOppositePlayer(firstPlayer);
//   const firstPlayerMoves = board.filter(cell => cell === firstPlayer).length;
//   const secondPlayerMoves = board.filter(cell => cell === secondPlayer).length;
  
//   const isSecondMoveForFirst = currentPlayer === firstPlayer && firstPlayerMoves === 1;
//   const isSecondMoveForSecond = currentPlayer === secondPlayer && secondPlayerMoves === 1;
  
//   if (!isSecondMoveForFirst && !isSecondMoveForSecond) return [];
  
//   let firstMovePosition = -1;
//   for (let i = 0; i < board.length; i++) {
//     if (board[i] === currentPlayer) {
//       firstMovePosition = i;
//       break;
//     }
//   }
//   if (firstMovePosition === -1) return [];
  
//   const row = Math.floor(firstMovePosition / 4);
//   const col = firstMovePosition % 4;
//   const restrictedCells = [];
  
//   const directions = [
//     [-1, -1], [-1, 0], [-1, 1],
//     [0, -1],           [0, 1],
//     [1, -1],  [1, 0],  [1, 1]
//   ];
  
//   for (const [deltaRow, deltaCol] of directions) {
//     const adjacentRow = row + deltaRow;
//     const adjacentCol = col + deltaCol;
    
//     if (adjacentRow >= 0 && adjacentRow < 4 && 
//         adjacentCol >= 0 && adjacentCol < 4) {
      
//       const adjacentIndex = adjacentRow * 4 + adjacentCol;
      
//       if (board[adjacentIndex] !== '') continue;
      
//       const nextRow = adjacentRow + deltaRow;
//       const nextCol = adjacentCol + deltaCol;
      
//       if (nextRow >= 0 && nextRow < 4 && 
//           nextCol >= 0 && nextCol < 4) {
        
//         const nextIndex = nextRow * 4 + nextCol;
        
//         if (board[nextIndex] === '') {
//           const lineCells = [firstMovePosition, adjacentIndex, nextIndex];
//           let occupiedCount = 0;
          
//           for (const cellIndex of lineCells) {
//             if (board[cellIndex] !== '') {
//               occupiedCount++;
//             }
//           }
          
//           if (occupiedCount === 2) {
//             continue;
//           }
          
//           if (currentPlayer === secondPlayer && secondPlayerMoves === 1) {
//             const winningConditions = generateWinningConditions(boardSize);
            
//             let allowsBlocking = false;
            
//             for (const condition of winningConditions) {
//               if (condition.includes(adjacentIndex)) {
//                 let firstPlayerCount = 0;
//                 let emptyCount = 0;
                
//                 for (const cellIndex of condition) {
//                   if (board[cellIndex] === firstPlayer) {
//                     firstPlayerCount++;
//                   } else if (board[cellIndex] === '') {
//                     emptyCount++;
//                   }
//                 }
                
//                 if (firstPlayerCount === 2 && emptyCount === 1) {
//                   allowsBlocking = true;
//                   break;
//                 }
//               }
//             }
            
//             if (allowsBlocking) {
//               continue;
//             }
//           }
          
//           restrictedCells.push(adjacentIndex);
//         }
//       }
//     }
//   }
  
//   return restrictedCells;
// }

// // 🔥 МАКСИМАЛЬНО ПОКРАЩЕНА ОЦІНЮВАЛЬНА ФУНКЦІЯ
// function evaluatePosition(board, boardSize, winningConditions, aiSymbol, playerSymbol) {
//   const result = isGameFinished(board, winningConditions);
//   const moveCount = board.filter(cell => cell !== '').length;

//   // Термінальні позиції з урахуванням швидкості
//   if (result.winner === aiSymbol) return 1000 - moveCount; // Швидший виграш краще
//   if (result.winner === playerSymbol) return -1000 + moveCount; // Пізніший програш краще
//   if (result.isDraw) return 0;

//   let score = 0;

//   // 🔥 ПОКРАЩЕНИЙ АНАЛІЗ ЛІНІЙ
//   for (const condition of winningConditions) {
//     let aiCount = 0;
//     let playerCount = 0;
//     let emptyCount = 0;

//     for (const index of condition) {
//       const cell = board[index];
//       if (cell === aiSymbol) aiCount++;
//       else if (cell === playerSymbol) playerCount++;
//       else emptyCount++;
//     }

//     // Експоненціальна оцінка ліній
//     if (playerCount === 0) {
//       if (aiCount === 2 && emptyCount === 1) {
//         score += 950; // Майже виграш - критично важливо
//       } else if (aiCount === 2) {
//         score += 150; // Два в ряд
//       } else if (aiCount === 1 && emptyCount === 2) {
//         score += 30; // Відкрита лінія
//       } else if (aiCount === 1) {
//         score += 15;
//       }
//     } else if (aiCount === 0) {
//       if (playerCount === 2 && emptyCount === 1) {
//         score -= 900; // Блокуємо виграш (трохи менше ніж наш виграш)
//       } else if (playerCount === 2) {
//         score -= 120;
//       } else if (playerCount === 1 && emptyCount === 2) {
//         score -= 25;
//       } else if (playerCount === 1) {
//         score -= 10;
//       }
//     }
//   }

//   // 🔥 ПОКРАЩЕНІ ПОЗИЦІЙНІ БОНУСИ
//   if (boardSize === 4) {
//     // Центральні позиції з градацією
//     const centerCore = [5, 6, 9, 10];
//     const centerExtended = [1, 2, 4, 7, 8, 11, 13, 14];
    
//     for (const pos of centerCore) {
//       if (board[pos] === aiSymbol) score += 40;
//       else if (board[pos] === playerSymbol) score -= 30;
//     }
    
//     for (const pos of centerExtended) {
//       if (board[pos] === aiSymbol) score += 15;
//       else if (board[pos] === playerSymbol) score -= 12;
//     }

//     // Контроль діагоналей
//     const mainDiagonals = [[0, 5, 10, 15], [3, 6, 9, 12]];
//     for (const diagonal of mainDiagonals) {
//       let aiControl = 0;
//       let playerControl = 0;
      
//       for (const pos of diagonal) {
//         if (board[pos] === aiSymbol) aiControl++;
//         else if (board[pos] === playerSymbol) playerControl++;
//       }
      
//       if (playerControl === 0) score += aiControl * aiControl * 8;
//       if (aiControl === 0) score -= playerControl * playerControl * 6;
//     }
//   } else if (boardSize === 3) {
//     // Для 3x3 - центр дуже важливий
//     if (board[4] === aiSymbol) score += 50;
//     else if (board[4] === playerSymbol) score -= 40;
    
//     // Кути важливі
//     const corners = [0, 2, 6, 8];
//     for (const corner of corners) {
//       if (board[corner] === aiSymbol) score += 20;
//       else if (board[corner] === playerSymbol) score -= 15;
//     }
//   }

//   // 🔥 НОВІ СТРАТЕГІЧНІ БОНУСИ
  
//   // Бонус за контроль багатьох ліній одночасно
//   let controlledLines = 0;
//   for (const condition of winningConditions) {
//     let aiInLine = 0;
//     let playerInLine = 0;
    
//     for (const index of condition) {
//       if (board[index] === aiSymbol) aiInLine++;
//       else if (board[index] === playerSymbol) playerInLine++;
//     }
    
//     if (aiInLine > 0 && playerInLine === 0) controlledLines++;
//   }
//   score += controlledLines * controlledLines * 3; // Квадратичний бонус

//   // Штраф за дозвіл вилок противника
//   const playerForks = countForks(board, playerSymbol, winningConditions);
//   score -= playerForks * 100;

//   // Бонус за створення власних вилок
//   const aiForks = countForks(board, aiSymbol, winningConditions);
//   score += aiForks * 120;

//   return score;
// }

// // 🔥 НОВА ФУНКЦІЯ: Підрахунок вилок
// function countForks(board, symbol, winningConditions) {
//   let forkCount = 0;
//   const availableMoves = board
//     .map((cell, index) => cell === '' ? index : -1)
//     .filter(index => index !== -1);

//   for (const move of availableMoves) {
//     const testBoard = makeMove([...board], move, symbol);
//     let winningOpportunities = 0;

//     for (const condition of winningConditions) {
//       let symbolCount = 0;
//       let emptyCount = 0;

//       for (const index of condition) {
//         if (testBoard[index] === symbol) symbolCount++;
//         else if (testBoard[index] === '') emptyCount++;
//       }

//       if (symbolCount === 2 && emptyCount === 1) {
//         winningOpportunities++;
//       }
//     }

//     if (winningOpportunities >= 2) {
//       forkCount++;
//     }
//   }

//   return forkCount;
// }

// // 🔥 ПОКРАЩЕНИЙ ПОШУК ФОРСОВАНОГО ВИГРАШУ
// function findForcedWin(board, boardSize, symbol, restrictedCells, maxDepth) {
//   const winningConditions = generateWinningConditions(boardSize);
//   const availableMoves = board
//     .map((cell, index) => {
//       if (cell !== '') return -1;
//       if (restrictedCells.includes(index)) return -1;
//       return index;
//     })
//     .filter(index => index !== -1);

//   // Сортуємо ходи за пріоритетом
//   const scoredMoves = availableMoves.map(move => {
//     const testBoard = makeMove([...board], move, symbol);
//     const score = evaluatePosition(testBoard, boardSize, winningConditions, symbol, getOppositePlayer(symbol));
//     return { move, score };
//   }).sort((a, b) => b.score - a.score);

//   for (const { move } of scoredMoves) {
//     if (canForceWin(board, boardSize, move, symbol, winningConditions, maxDepth, 0, restrictedCells)) {
//       return move;
//     }
//   }
  
//   return -1;
// }

// // Покращена перевірка форсованого виграшу
// function canForceWin(board, boardSize, move, symbol, winningConditions, maxDepth, currentDepth, restrictedCells) {
//   if (currentDepth >= maxDepth) return false;
  
//   const testBoard = makeMove([...board], move, symbol);
//   const result = checkWinner(testBoard, winningConditions);
  
//   if (result.winner === symbol) return true;
//   if (result.winner || isBoardFull(testBoard)) return false;
  
//   const opponent = getOppositePlayer(symbol);
//   let opponentMoves = testBoard
//     .map((cell, index) => cell === '' ? index : -1)
//     .filter(index => index !== -1);

//   // Враховуємо обмеження для 4x4
//   if (boardSize === 4) {
//     const currentRestricted = getRestrictedCells(testBoard, boardSize, opponent, symbol);
//     opponentMoves = opponentMoves.filter(move => !currentRestricted.includes(move));
//   }

//   // Перевіряємо всі відповіді противника
//   for (const opponentMove of opponentMoves) {
//     const responseBoard = makeMove([...testBoard], opponentMove, opponent);
    
//     let ourNextMoves = responseBoard
//       .map((cell, index) => cell === '' ? index : -1)
//       .filter(index => index !== -1);

//     // Враховуємо обмеження для наших ходів
//     if (boardSize === 4) {
//       const nextRestricted = getRestrictedCells(responseBoard, boardSize, symbol, opponent);
//       ourNextMoves = ourNextMoves.filter(move => !nextRestricted.includes(move));
//     }
    
//     let canWinFromAnyMove = false;
    
//     for (const nextMove of ourNextMoves) {
//       if (canForceWin(responseBoard, boardSize, nextMove, symbol, winningConditions, maxDepth, currentDepth + 1, restrictedCells)) {
//         canWinFromAnyMove = true;
//         break;
//       }
//     }
    
//     if (!canWinFromAnyMove) return false;
//   }
  
//   return true;
// }

// // 🔥 МАКСИМАЛЬНО ПОКРАЩЕНИЙ МІНІМАКС З АЛЬФА-БЕТА
// function minimaxWithRestrictions(board, boardSize, depth, maxDepth, isMaximizing, aiSymbol, restrictedCells, alpha, beta) {
//   const winningConditions = generateWinningConditions(boardSize);
//   const result = isGameFinished(board, winningConditions);
//   const playerSymbol = getOppositePlayer(aiSymbol);

//   // Термінальні випадки з бонусом за швидкість
//   if (result.winner === aiSymbol) {
//     return { score: 10000 - depth, move: -1 };
//   }
  
//   if (result.winner === playerSymbol) {
//     return { score: depth - 10000, move: -1 };
//   }
  
//   if (result.isDraw || depth >= maxDepth) {
//     const score = evaluatePosition(board, boardSize, winningConditions, aiSymbol, playerSymbol);
//     return { score, move: -1 };
//   }

//   let availableMoves = board
//     .map((cell, index) => {
//       if (cell !== '') return -1;
//       if (restrictedCells && restrictedCells.includes(index)) return -1;
//       return index;
//     })
//     .filter(index => index !== -1);

//   // 🔥 СОРТУВАННЯ ХОДІВ ДЛЯ КРАЩОГО ОБРІЗАННЯ
//   const currentPlayer = isMaximizing ? aiSymbol : playerSymbol;
//   const scoredMoves = availableMoves.map(move => {
//     const testBoard = makeMove([...board], move, currentPlayer);
//     const score = evaluatePosition(testBoard, boardSize, winningConditions, aiSymbol, playerSymbol);
//     return { move, score };
//   });

//   if (isMaximizing) {
//     scoredMoves.sort((a, b) => b.score - a.score); // Сортуємо за спаданням для максимізуючого
//   } else {
//     scoredMoves.sort((a, b) => a.score - b.score); // Сортуємо за зростанням для мінімізуючого
//   }

//   availableMoves = scoredMoves.map(sm => sm.move);
//   let bestMove = availableMoves[0] || -1;

//   if (isMaximizing) {
//     let maxScore = -Infinity;
    
//     for (const move of availableMoves) {
//       const newBoard = makeMove([...board], move, aiSymbol);
      
//       // Динамічно розраховуємо обмеження
//       const newRestricted = boardSize === 4 ? 
//         getRestrictedCells(newBoard, boardSize, playerSymbol, aiSymbol) : [];
      
//       const { score } = minimaxWithRestrictions(newBoard, boardSize, depth + 1, maxDepth, false, aiSymbol, newRestricted, alpha, beta);
      
//       if (score > maxScore) {
//         maxScore = score;
//         bestMove = move;
//       }
      
//       alpha = Math.max(alpha, score);
//       if (beta <= alpha) break; // Альфа-бета обрізання
//     }
    
//     return { score: maxScore, move: bestMove };
    
//   } else {
//     let minScore = Infinity;
    
//     for (const move of availableMoves) {
//       const newBoard = makeMove([...board], move, playerSymbol);
      
//       const newRestricted = boardSize === 4 ? 
//         getRestrictedCells(newBoard, boardSize, aiSymbol, playerSymbol) : [];
      
//       const { score } = minimaxWithRestrictions(newBoard, boardSize, depth + 1, maxDepth, true, aiSymbol, newRestricted, alpha, beta);
      
//       if (score < minScore) {
//         minScore = score;
//         bestMove = move;
//       }
      
//       beta = Math.min(beta, score);
//       if (beta <= alpha) break; // Альфа-бета обрізання
//     }
    
//     return { score: minScore, move: bestMove };
//   }
// }

// // 🔥 МАКСИМАЛЬНО ПОКРАЩЕНА СТРАТЕГІЧНА ФУНКЦІЯ
// function getStrategicMove(board, boardSize, aiSymbol, restrictedCells = []) {
//   const availableMoves = board
//     .map((cell, index) => {
//       if (cell !== '') return -1;
//       if (restrictedCells.includes(index)) return -1;
//       return index;
//     })
//     .filter(index => index !== -1);
    
//   if (availableMoves.length === 0) return -1;

//   const winningConditions = generateWinningConditions(boardSize);
//   const playerSymbol = getOppositePlayer(aiSymbol);

//   // 1. Спробувати виграти
//   for (const move of availableMoves) {
//     const testBoard = makeMove([...board], move, aiSymbol);
//     const result = checkWinner(testBoard, winningConditions);
//     if (result.winner === aiSymbol) {
//       return move;
//     }
//   }

//   // 2. Заблокувати виграш гравця
//   for (const move of availableMoves) {
//     const testBoard = makeMove([...board], move, playerSymbol);
//     const result = checkWinner(testBoard, winningConditions);
//     if (result.winner === playerSymbol) {
//       return move;
//     }
//   }

//   // 3. Шукати найкращі вилки
//   const forkMoves = [];
//   for (const move of availableMoves) {
//     const testBoard = makeMove([...board], move, aiSymbol);
//     const forkCount = countForks(testBoard, aiSymbol, winningConditions);
//     if (forkCount > 0) {
//       const score = evaluatePosition(testBoard, boardSize, winningConditions, aiSymbol, playerSymbol);
//       forkMoves.push({ move, forkCount, score });
//     }
//   }

//   if (forkMoves.length > 0) {
//     forkMoves.sort((a, b) => {
//       if (a.forkCount !== b.forkCount) return b.forkCount - a.forkCount;
//       return b.score - a.score;
//     });
//     return forkMoves[0].move;
//   }

//   // 4. Блокувати вилки противника
//   for (const move of availableMoves) {
//     const testBoard = makeMove([...board], move, playerSymbol);
//     const forkCount = countForks(testBoard, playerSymbol, winningConditions);
//     if (forkCount > 0) {
//       return move;
//     }
//   }

//     // 🔥 ДОДАЄМО: Блокування "майже виграшних" позицій
//     for (const move of availableMoves) {
//       const testBoard = makeMove([...board], move, playerSymbol);
//       let threatCount = 0;
      
//       for (const condition of winningConditions) {
//         let playerInLine = 0;
//         let emptyInLine = 0;
        
//         for (const index of condition) {
//           if (testBoard[index] === playerSymbol) playerInLine++;
//           else if (testBoard[index] === '') emptyInLine++;
//         }
        
//         if (playerInLine === 2 && emptyInLine === 1) threatCount++;
//       }
      
//       if (threatCount >= 2) return move; // Блокуємо створення вилки
//     }

//   // 5. Найкращий позиційний хід
//   let bestMove = availableMoves[0];
//   let bestScore = -Infinity;
  
//   for (const move of availableMoves) {
//     const testBoard = makeMove([...board], move, aiSymbol);
//     const score = evaluatePosition(testBoard, boardSize, winningConditions, aiSymbol, playerSymbol);
//     if (score > bestScore) {
//       bestScore = score;
//       bestMove = move;
//     }
//   }

//   return bestMove;
// }

// // 🔥 МАКСИМАЛЬНО ПОКРАЩЕНА ГОЛОВНА ФУНКЦІЯ
// function getBestMove(board, boardSize, difficulty, aiSymbol, playerSymbol, randomness, restrictedCells = []) {
//   const availableMoves = board
//     .map((cell, index) => {
//       if (cell !== '') return -1;
//       if (restrictedCells.includes(index)) return -1;
//       return index;
//     })
//     .filter(index => index !== -1);
    
//   if (availableMoves.length === 0) return -1;

//   // Випадковість тільки для легкого рівня
//   if (difficulty === 'easy' && randomness > 0 && Math.random() * 100 < randomness) {
//     return availableMoves[Math.floor(Math.random() * availableMoves.length)];
//   }

//   switch (difficulty) {
//     case 'easy': { 
//       // 50% випадкових ходів, 50% базової стратегії
//       if (Math.random() < 0.5) {
//         return availableMoves[Math.floor(Math.random() * availableMoves.length)];
//       } 
//       // Блокуємо виграшні ходи навіть на легкому
//       for (const move of availableMoves) {
//         const testBoard = makeMove([...board], move, playerSymbol);
//         const result = checkWinner(testBoard, generateWinningConditions(boardSize));
//         if (result.winner === playerSymbol) return move;
//       }
//       return getStrategicMove(board, boardSize, aiSymbol, restrictedCells);
//     }
//       case 'medium': { 
//         // 🔥 ЗМІНЕНО: Повний мінімакс з глибиною 6-7 замість 4-5
//         const forcedWinMedium = findForcedWin(board, boardSize, aiSymbol, restrictedCells, 3);
//         if (forcedWinMedium !== -1) return forcedWinMedium;
        
//         const blockForcedWinMedium = findForcedWin(board, boardSize, playerSymbol, restrictedCells, 3);
//         if (blockForcedWinMedium !== -1) return blockForcedWinMedium;
        
//         // 🔥 ЗМІНЕНО: Завжди використовуємо мінімакс (не тільки при <=6 ходів)
//         const mediumDepth = boardSize === 3 ? 7 : 5; // Збільшили глибину
//         const { move } = minimaxWithRestrictions(board, boardSize, 0, mediumDepth, true, aiSymbol, restrictedCells, -Infinity, Infinity);
//         return move !== -1 ? move : getStrategicMove(board, boardSize, aiSymbol, restrictedCells);
//       }
//         case 'hard': {
//           // 🔥 ЗМІНЕНО: Максимальна глибина + кращі евристики
//           const forcedWinHard = findForcedWin(board, boardSize, aiSymbol, restrictedCells, 6); // Була 5
//           if (forcedWinHard !== -1) return forcedWinHard;
          
//           const blockForcedWinHard = findForcedWin(board, boardSize, playerSymbol, restrictedCells, 5); // Була 4
//           if (blockForcedWinHard !== -1) return blockForcedWinHard;
          
//           // 🔥 ЗМІНЕНО: Ще більша глибина пошуку
//           let maxDepth;
//           if (boardSize === 3) {
//             maxDepth = availableMoves.length > 5 ? 8 : 9; // Завжди максимум
//           } else {
//             if (availableMoves.length > 10) maxDepth = 6; // Була 4
//             else if (availableMoves.length > 6) maxDepth = 8; // Була 6  
//             else maxDepth = 12; // Була 10
//           }
          
//           const { move } = minimaxWithRestrictions(board, boardSize, 0, maxDepth, true, aiSymbol, restrictedCells, -Infinity, Infinity);
//           return move !== -1 ? move : getStrategicMove(board, boardSize, aiSymbol, restrictedCells);
//         }
//     default:
//       return availableMoves[Math.floor(Math.random() * availableMoves.length)];
//   }
// }

// // Обробник повідомлень від головного потоку
// self.onmessage = function(e) {
//   const { board, boardSize, difficulty, aiSymbol, playerSymbol, randomness, restrictedCells, firstPlayer } = e.data;
  
//   try {
//     console.log('🤖 AI Worker розпочав обчислення:', { difficulty, boardSize, availableMoves: board.filter(cell => cell === '').length });
    
//     const startTime = Date.now();
    
//     // Розрахуйте обмеження якщо не передані
//     const restrictions = restrictedCells || getRestrictedCells(board, boardSize, aiSymbol, firstPlayer);
    
//     const move = getBestMove(board, boardSize, difficulty, aiSymbol, playerSymbol, randomness, restrictions);
    
//     const calculationTime = Date.now() - startTime;
//     console.log(`🤖 AI Worker завершив обчислення за ${calculationTime}мс, хід: ${move}`);
    
//     self.postMessage({ 
//       success: true, 
//       move,
//       calculationTime,
//       evaluation: move !== -1 ? evaluatePosition(
//         makeMove([...board], move, aiSymbol), 
//         boardSize, 
//         generateWinningConditions(boardSize),
//         aiSymbol, 
//         playerSymbol
//       ) : 0
//     });
//   } catch (error) {
//     console.error('🔥 AI Worker помилка:', error);
//     self.postMessage({ 
//       success: false, 
//       error: error.message 
//     });
//   }
// };


























































// // public/ai-worker.js
// // Web Worker для AI обчислень - МАКСИМАЛЬНО ПОКРАЩЕНА ВЕРСІЯ 3.0

// // 🔥 ПОКРАЩЕНА КОНФІГУРАЦІЯ СКЛАДНОСТІ AI
// const AI_DIFFICULTY_CONFIG = {
//   easy: {
//     randomnessPercent: 35,          
//     useMinimaxDepth: 3,             
//     useForcedWinSearch: false,      
//     useForkBlocking: true,          
//     usePositionalPlay: false,       
//     useRestrictionHandling: false,  // НЕ враховувати обмеження 4×4
//   },
//   medium: {
//     randomnessPercent: 5,           
//     useMinimaxDepth: {
//       boardSize3: 8,                
//       boardSize4: 6                 
//     },
//     useForcedWinSearch: true,
//     forcedWinDepth: 5,              
//     useForkBlocking: true,
//     useAdvancedBlocking: true,      
//     usePositionalPlay: true,
//     useRestrictionHandling: true,   // Враховувати обмеження
//     useMultipleThreatDetection: true, // 🔥 ДОДАЙТЕ
//   },
//   hard: {
//     randomnessPercent: 0,           
//     useMinimaxDepth: {
//       boardSize3: 12,               
//       boardSize4: {
//         earlyGame: 10,    
//         midGame: 16,      
//         endGame: 20       
//       }
//     },
//     useForcedWinSearch: true,
//     forcedWinDepth: 12,              
//     useForkBlocking: true,
//     useAdvancedBlocking: true,
//     usePositionalOptimization: true, 
//     useThreatAnalysis: true,        
//     useEndgameOptimization: true,   
//     useRestrictionHandling: true,   // ОБОВ'ЯЗКОВО враховувати
//     useSmartRestrictionOverride: true, // Розумне ігнорування обмежень
//     useOpeningBook: true,           // 🔥 НОВА ОПЦІЯ
//     useMultipleThreatDetection: true, // 🔥 НОВА ОПЦІЯ
//   }
// };

// // 🔥 ПОКРАЩЕНИЙ КЕШ
// const positionCache = new Map();
// const restrictionCache = new Map(); // Новий кеш для обмежень
// const MAX_CACHE_SIZE = 15000;

// function getAIConfig(difficulty) {
//   return AI_DIFFICULTY_CONFIG[difficulty] || AI_DIFFICULTY_CONFIG.medium;
// }

// // 🔥 ДОДАЙТЕ ЦЮ ФУНКЦІЮ ПІСЛЯ getAIConfig
// function getOpeningMove(board, boardSize) {
//   if (boardSize !== 4) return -1;
  
//   const moveCount = board.filter(cell => cell !== '').length;
  
//   // Перший хід AI (після гравця)
//   if (moveCount === 1) {
//     const playerMove = board.findIndex(cell => cell !== '');
    
//     // Якщо гравець взяв центр - беремо кут
//     if ([5, 6, 9, 10].includes(playerMove)) {
//       return [0, 3, 12, 15][Math.floor(Math.random() * 4)];
//     }
    
//     // Якщо гравець взяв кут - беремо центр
//     if ([0, 3, 12, 15].includes(playerMove)) {
//       return [5, 6, 9, 10][Math.floor(Math.random() * 4)];
//     }
    
//     // Інакше - завжди центр
//     return 5;
//   }
  
//   // Другий хід AI (після 2 ходів загалом)
//   if (moveCount === 2) {
//     const centers = [5, 6, 9, 10].filter(pos => board[pos] === '');
//     if (centers.length > 0) {
//       return centers[Math.floor(Math.random() * centers.length)];
//     }
//   }
  
//   return -1; // Немає дебютного ходу
// }

// // 🔥 ДОДАЙТЕ ЦЮ ФУНКЦІЮ
// function detectMultipleThreats(board, boardSize, playerSymbol, winningConditions) {
//   const threats = [];
  
//   // Знайти всі лінії з 2 символами противника + 1 пуста
//   for (const condition of winningConditions) {
//     let playerCount = 0;
//     let emptyCount = 0;
//     let emptyPos = -1;

//     for (const index of condition) {
//       if (board[index] === playerSymbol) playerCount++;
//       else if (board[index] === '') {
//         emptyCount++;
//         emptyPos = index;
//       }
//     }

//     if (playerCount === 2 && emptyCount === 1) {
//       threats.push({
//         position: emptyPos,
//         line: condition,
//         priority: 1000 + (condition.includes(5) || condition.includes(6) || 
//                          condition.includes(9) || condition.includes(10) ? 100 : 0)
//       });
//     }
//   }
  
//   // Сортуємо за пріоритетом
//   threats.sort((a, b) => b.priority - a.priority);
//   // 🔥 Фільтруємо тільки найкритичніші загрози
//   if (threats.length > 2) {
//     const criticalThreats = threats.filter(t => t.priority >= threats[0].priority - 50);
//     return criticalThreats.length > 0 ? criticalThreats : threats.slice(0, 2);
//   }
  
//   return threats;
// }

// function createCacheKey(board, depth, isMaximizing, aiSymbol) {
//   return `${board.join('')}-${depth}-${isMaximizing}-${aiSymbol}`;
// }

// // Допоміжні функції
// function generateWinningConditions(size) {
//   const conditions = [];
  
//   for (let row = 0; row < size; row++) {
//     for (let col = 0; col <= size - 3; col++) {
//       conditions.push([
//         row * size + col,
//         row * size + col + 1,
//         row * size + col + 2
//       ]);
//     }
//   }
  
//   for (let col = 0; col < size; col++) {
//     for (let row = 0; row <= size - 3; row++) {
//       conditions.push([
//         row * size + col,
//         (row + 1) * size + col,
//         (row + 2) * size + col
//       ]);
//     }
//   }
  
//   for (let row = 0; row <= size - 3; row++) {
//     for (let col = 0; col <= size - 3; col++) {
//       conditions.push([
//         row * size + col,
//         (row + 1) * size + col + 1,
//         (row + 2) * size + col + 2
//       ]);
//     }
//   }
  
//   for (let row = 0; row <= size - 3; row++) {
//     for (let col = 2; col < size; col++) {
//       conditions.push([
//         row * size + col,
//         (row + 1) * size + col - 1,
//         (row + 2) * size + col - 2
//       ]);
//     }
//   }
  
//   return conditions;
// }

// function checkWinner(board, winningConditions) {
//   for (const [a, b, c] of winningConditions) {
//     if (board[a] && board[a] === board[b] && board[a] === board[c]) {
//       return {
//         winner: board[a],
//         winningLine: [a, b, c]
//       };
//     }
//   }
  
//   return { winner: null, winningLine: [] };
// }

// function isBoardFull(board) {
//   return !board.includes('');
// }

// function isGameFinished(board, winningConditions) {
//   const { winner, winningLine } = checkWinner(board, winningConditions);
  
//   if (winner) {
//     return { finished: true, winner, isDraw: false, winningLine };
//   }
  
//   if (isBoardFull(board)) {
//     return { finished: true, winner: null, isDraw: true, winningLine: [] };
//   }
  
//   return { finished: false, winner: null, isDraw: false, winningLine: [] };
// }

// function getOppositePlayer(player) {
//   return player === 'X' ? 'O' : 'X';
// }

// function makeMove(board, index, player) {
//   if (board[index] !== '') {
//     return board;
//   }
  
//   const newBoard = [...board];
//   newBoard[index] = player;
//   return newBoard;
// }

// // 🔥 ВИПРАВЛЕНА ФУНКЦІЯ ОБМЕЖЕНЬ ДЛЯ 4×4
// function getRestrictedCells(board, boardSize, currentPlayer, firstPlayer) {
//   if (boardSize !== 4) return [];
  
//   // Кешування обмежень
//   const cacheKey = `${board.join('')}-${currentPlayer}-${firstPlayer}`;
//   if (restrictionCache.has(cacheKey)) {
//     return restrictionCache.get(cacheKey);
//   }
  
//   const secondPlayer = getOppositePlayer(firstPlayer);
//   const firstPlayerMoves = board.filter(cell => cell === firstPlayer).length;
//   const secondPlayerMoves = board.filter(cell => cell === secondPlayer).length;
  
//   const isSecondMoveForFirst = currentPlayer === firstPlayer && firstPlayerMoves === 1;
//   const isSecondMoveForSecond = currentPlayer === secondPlayer && secondPlayerMoves === 1;
  
//   if (!isSecondMoveForFirst && !isSecondMoveForSecond) {
//     restrictionCache.set(cacheKey, []);
//     return [];
//   }
  
//   // Знайти позицію першого ходу поточного гравця
//   let firstMovePosition = -1;
//   for (let i = 0; i < board.length; i++) {
//     if (board[i] === currentPlayer) {
//       firstMovePosition = i;
//       break;
//     }
//   }
  
//   if (firstMovePosition === -1) {
//     restrictionCache.set(cacheKey, []);
//     return [];
//   }
  
//   const row = Math.floor(firstMovePosition / 4);
//   const col = firstMovePosition % 4;
//   const restrictedCells = [];
  
//   const directions = [
//     [-1, -1], [-1, 0], [-1, 1],
//     [0, -1],           [0, 1],
//     [1, -1],  [1, 0],  [1, 1]
//   ];
  
//   for (const [deltaRow, deltaCol] of directions) {
//     const adjacentRow = row + deltaRow;
//     const adjacentCol = col + deltaCol;
    
//     if (adjacentRow >= 0 && adjacentRow < 4 && 
//         adjacentCol >= 0 && adjacentCol < 4) {
      
//       const adjacentIndex = adjacentRow * 4 + adjacentCol;
      
//       if (board[adjacentIndex] !== '') continue;
      
//       const nextRow = adjacentRow + deltaRow;
//       const nextCol = adjacentCol + deltaCol;
      
//       if (nextRow >= 0 && nextRow < 4 && 
//           nextCol >= 0 && nextCol < 4) {
        
//         const nextIndex = nextRow * 4 + nextCol;
        
//         if (board[nextIndex] === '') {
//           restrictedCells.push(adjacentIndex);
//         }
//       }
//     }
//   }
  
//   // Кешуємо результат
//   if (restrictionCache.size < MAX_CACHE_SIZE) {
//     restrictionCache.set(cacheKey, restrictedCells);
//   }
  
//   return restrictedCells;
// }

// // 🔥 НОВА ФУНКЦІЯ: Розумна перевірка чи можна ігнорувати обмеження
// function canOverrideRestriction(board, move, playerSymbol, winningConditions) {
//   // Завжди дозволяємо блокувати виграш
//   const testBoard = makeMove([...board], move, playerSymbol);
//   const result = checkWinner(testBoard, winningConditions);
//   if (result.winner === playerSymbol) {
//     return true; // Це блокування виграшу - можна ігнорувати обмеження
//   }
  
//   // Перевіряємо чи це створює виграшну загрозу
//   let threatCount = 0;
//   for (const condition of winningConditions) {
//     if (condition.includes(move)) {
//       let playerCount = 0;
//       let emptyCount = 0;
      
//       for (const index of condition) {
//         if (testBoard[index] === playerSymbol) playerCount++;
//         else if (testBoard[index] === '') emptyCount++;
//       }
      
//       if (playerCount === 2 && emptyCount === 1) {
//         threatCount++;
//       }
//     }
//   }
  
//   return threatCount >= 2; // Вилка - можна ігнорувати обмеження
// }

// // 🔥 МАКСИМАЛЬНО ПОКРАЩЕНА ОЦІНЮВАЛЬНА ФУНКЦІЯ
// function evaluatePosition(board, boardSize, winningConditions, aiSymbol, playerSymbol, config) {
//   const result = isGameFinished(board, winningConditions);
//   const moveCount = board.filter(cell => cell !== '').length;

//   if (result.winner === aiSymbol) return 15000 - moveCount;
//   if (result.winner === playerSymbol) return -15000 + moveCount;
//   if (result.isDraw) return 0;

//   let score = 0; // 🔥 ДОДАЄМО ЦЮ ЛІНІЮ НА ПОЧАТОК!

//   // 🔥 КРИТИЧНІ БОНУСИ ДЛЯ РАННЬОЇ ГРИ (перші 5 ходів)
//   if (moveCount <= 5 && boardSize === 4) {
//     console.log(`🎯 Рання гра: хід ${moveCount}, оцінка позиції...`);
    
//     // СУПЕР контроль центру - критично важливий!
//     const superCenters = [5, 6, 9, 10];
//     let centerControl = 0;
    
//     for (const pos of superCenters) {
//       if (board[pos] === aiSymbol) {
//         centerControl += 350; // 🔥 ЗБІЛЬШЕНО з 200!
//         console.log(`💎 AI контролює центр ${pos}: +350`);
//       } else if (board[pos] === playerSymbol) {
//         centerControl -= 280; // Штраф за втрату центру
//         console.log(`⚠️ Гравець контролює центр ${pos}: -280`);
//       }
//     }
    
//     score += centerControl;
    
//     // 🔥 МЕГА-БОНУС за контроль довгих діагоналей в ранній грі
//     const longDiagonals = [
//       [0, 5, 10, 15],  // Головна діагональ
//       [3, 6, 9, 12]    // Анти-діагональ
//     ];
    
//     for (const diagonal of longDiagonals) {
//       let aiOnDiag = 0;
//       let playerOnDiag = 0;
//       let emptyOnDiag = 0;
      
//       for (const pos of diagonal) {
//         if (board[pos] === aiSymbol) aiOnDiag++;
//         else if (board[pos] === playerSymbol) playerOnDiag++;
//         else emptyOnDiag++;
//       }
      
//       // Чиста діагональ AI = золото!
//       if (aiOnDiag > 0 && playerOnDiag === 0) {
//         const diagonalBonus = aiOnDiag * aiOnDiag * 180; // Квадратичний бонус
//         score += diagonalBonus;
//         console.log(`🏆 AI контролює діагональ ${diagonal}: +${diagonalBonus}`);
//       }
      
//       // Гравець контролює діагональ = небезпека
//       if (playerOnDiag > 0 && aiOnDiag === 0) {
//         const diagonalPenalty = playerOnDiag * playerOnDiag * 150;
//         score -= diagonalPenalty;
//         console.log(`🚨 Гравець контролює діагональ ${diagonal}: -${diagonalPenalty}`);
//       }
      
//       // 🔥 НОВИЙ БОНУС: потенціал діагоналі
//       if (aiOnDiag === 1 && playerOnDiag === 0 && emptyOnDiag === 3) {
//         score += 120; // Бонус за початок контролю діагоналі
//         console.log(`⭐ Потенціал діагоналі: +120`);
//       }
//     }
    
//     // 🔥 БОНУС за контроль кутів у ранній грі
//     const corners = [0, 3, 12, 15];
//     let cornerControl = 0;
    
//     for (const corner of corners) {
//       if (board[corner] === aiSymbol) cornerControl += 90;
//       else if (board[corner] === playerSymbol) cornerControl -= 70;
//     }
    
//     score += cornerControl;
    
//   //   // 🔥 ШТРАФ за розкидані ходи в ранній грі
//   //   if (aiOnDiag === 0 && centerControl < 100) {
//   //     score -= 200; // Штраф за відсутність стратегії
//   //     console.log(`📉 Штраф за відсутність стратегії: -200`);
//   //   }
//   // }
//     // 🔥 ШТРАФ за розкидані ходи в ранній грі (виправляємо змінну)
//     let hasStrategy = false;
    
//     // Перевіряємо чи є AI на діагоналях
//     for (const diagonal of longDiagonals) {
//       for (const pos of diagonal) {
//         if (board[pos] === aiSymbol) {
//           hasStrategy = true;
//           break;
//         }
//       }
//       if (hasStrategy) break;
//     }
    
//     // Або чи контролює центр
//     if (centerControl >= 100) {
//       hasStrategy = true;
//     }
    
//     if (!hasStrategy) {
//       score -= 200; // Штраф за відсутність стратегії
//       console.log(`📉 Штраф за відсутність стратегії: -200`);
//     }
//   }
  

//   // 🔥 ПОКРАЩЕНИЙ АНАЛІЗ ЛІНІЙ з експоненціальними бонусами
//   for (const condition of winningConditions) {
//     let aiCount = 0;
//     let playerCount = 0;
//     let emptyCount = 0;

//     for (const index of condition) {
//       const cell = board[index];
//       if (cell === aiSymbol) aiCount++;
//       else if (cell === playerSymbol) playerCount++;
//       else emptyCount++;
//     }

//     if (playerCount === 0) {
//       if (aiCount === 2 && emptyCount === 1) {
//         score += 2500; // Майже виграш
//       } else if (aiCount === 2) {
//         score += 350;
//       } else if (aiCount === 1 && emptyCount === 2) {
//         score += 80;
//       } else if (aiCount === 1) {
//         score += 35;
//       }
//     } else if (aiCount === 0) {
//       if (playerCount === 2 && emptyCount === 1) {
//         score -= 2300; // Критично заблокувати
//       } else if (playerCount === 2) {
//         score -= 300;
//       } else if (playerCount === 1 && emptyCount === 2) {
//         score -= 60;
//       } else if (playerCount === 1) {
//         score -= 25;
//       }
//     }
//   }

//   // 🔥 ПОКРАЩЕНІ ПОЗИЦІЙНІ БОНУСИ
//   if (config.usePositionalPlay || config.usePositionalOptimization) {
//     if (boardSize === 4) {
//       // Градація позицій від центру
//       const positionValues = {
//         5: 80, 6: 80, 9: 80, 10: 80,     // Супер-центр
//         1: 40, 2: 40, 4: 40, 7: 40,      // Центральні
//         8: 40, 11: 40, 13: 40, 14: 40,
//         0: 25, 3: 25, 12: 25, 15: 25     // Кути
//       };
      
//       for (const [pos, value] of Object.entries(positionValues)) {
//         const position = parseInt(pos);
//         if (board[position] === aiSymbol) score += value;
//         else if (board[position] === playerSymbol) score -= Math.floor(value * 0.7);
//       }

//       // Контроль довгих діагоналей
//       const longDiagonals = [
//         [0, 5, 10, 15],
//         [3, 6, 9, 12]
//       ];
      
//       for (const diagonal of longDiagonals) {
//         let aiControl = 0;
//         let playerControl = 0;
        
//         for (const pos of diagonal) {
//           if (board[pos] === aiSymbol) aiControl++;
//           else if (board[pos] === playerSymbol) playerControl++;
//         }
        
//         if (playerControl === 0 && aiControl > 0) {
//           score += aiControl * aiControl * 20;
//         }
//         if (aiControl === 0 && playerControl > 0) {
//           score -= playerControl * playerControl * 15;
//         }
//       }
//     } else if (boardSize === 3) {
//       // Для 3×3 центр критично важливий
//       if (board[4] === aiSymbol) score += 120;
//       else if (board[4] === playerSymbol) score -= 100;
      
//       const corners = [0, 2, 6, 8];
//       for (const corner of corners) {
//         if (board[corner] === aiSymbol) score += 45;
//         else if (board[corner] === playerSymbol) score -= 35;
//       }
//     }
//   }

//   // 🔥 ПОКРАЩЕНИЙ АНАЛІЗ ЗАГРОЗ
//   if (config.useThreatAnalysis) {
//     const playerForks = countForks(board, playerSymbol, winningConditions);
//     const aiForks = countForks(board, aiSymbol, winningConditions);
    
//     score -= playerForks * 250;
//     score += aiForks * 300;
    
//     // Бонус за контроль центральних ліній
//     const centralLines = getCentralLines(boardSize);
//     let controlledCentralLines = 0;
    
//     for (const line of centralLines) {
//       let aiInLine = 0;
//       let playerInLine = 0;
      
//       for (const index of line) {
//         if (board[index] === aiSymbol) aiInLine++;
//         else if (board[index] === playerSymbol) playerInLine++;
//       }
      
//       if (aiInLine > 0 && playerInLine === 0) {
//         controlledCentralLines++;
//       }
//     }
    
//     score += controlledCentralLines * 15;
//   }

//   return score;
// }

// // 🔥 НОВА ФУНКЦІЯ: Отримати центральні лінії
// function getCentralLines(boardSize) {
//   if (boardSize === 4) {
//     return [
//       [5, 6, 9],      // Центральний горизонтальний
//       [1, 5, 9],      // Центральний вертикальний  
//       [5, 10, 15],    // Центральна діагональ
//     ];
//   } else {
//     return [
//       [3, 4, 5],      // Центральний рядок
//       [1, 4, 7],      // Центральний стовпець
//       [0, 4, 8],      // Головна діагональ
//       [2, 4, 6],      // Антидіагональ
//     ];
//   }
// }

// function countForks(board, symbol, winningConditions) {
//   let forkCount = 0;
//   const availableMoves = board
//     .map((cell, index) => cell === '' ? index : -1)
//     .filter(index => index !== -1);

//   for (const move of availableMoves) {
//     const testBoard = makeMove([...board], move, symbol);
//     let winningOpportunities = 0;

//     for (const condition of winningConditions) {
//       let symbolCount = 0;
//       let emptyCount = 0;

//       for (const index of condition) {
//         if (testBoard[index] === symbol) symbolCount++;
//         else if (testBoard[index] === '') emptyCount++;
//       }

//       if (symbolCount === 2 && emptyCount === 1) {
//         winningOpportunities++;
//       }
//     }

//     if (winningOpportunities >= 2) {
//       forkCount++;
//     }
//   }

//   return forkCount;
// }

// // 🔥 ПОКРАЩЕНИЙ ПОШУК ФОРСОВАНОГО ВИГРАШУ
// function findForcedWin(board, boardSize, symbol, restrictedCells, maxDepth, config) {
//   const winningConditions = generateWinningConditions(boardSize);
//   let availableMoves = board
//     .map((cell, index) => {
//       if (cell !== '') return -1;
//       return index;
//     })
//     .filter(index => index !== -1);

//   // Застосовуємо обмеження тільки якщо конфігурація дозволяє
//   if (config.useRestrictionHandling && restrictedCells) {
//     availableMoves = availableMoves.filter(move => {
//       if (!restrictedCells.includes(move)) return true;
      
//       // Перевіряємо чи можна ігнорувати обмеження
//       if (config.useSmartRestrictionOverride) {
//         return canOverrideRestriction(board, move, symbol, winningConditions);
//       }
      
//       return false;
//     });
//   }

//   // Сортуємо ходи за пріоритетом
//   const scoredMoves = availableMoves.map(move => {
//     const testBoard = makeMove([...board], move, symbol);
//     const score = evaluatePosition(testBoard, boardSize, winningConditions, symbol, getOppositePlayer(symbol), config);
//     return { move, score };
//   }).sort((a, b) => b.score - a.score);

//   const maxMovesToCheck = Math.min(scoredMoves.length, 15);
  
//   for (let i = 0; i < maxMovesToCheck; i++) {
//     const { move } = scoredMoves[i];
//     if (canForceWin(board, boardSize, move, symbol, winningConditions, maxDepth, 0, restrictedCells, config)) {
//       return move;
//     }
//   }
  
//   return -1;
// }

// // 🔥 ПОКРАЩЕНА canForceWin
// function canForceWin(board, boardSize, move, symbol, winningConditions, maxDepth, currentDepth, restrictedCells, config) {
//   if (currentDepth >= maxDepth) return false;
  
//   const testBoard = makeMove([...board], move, symbol);
//   const result = checkWinner(testBoard, winningConditions);
  
//   if (result.winner === symbol) return true;
//   if (result.winner || isBoardFull(testBoard)) return false;
  
//   const opponent = getOppositePlayer(symbol);
//   let opponentMoves = testBoard
//     .map((cell, index) => cell === '' ? index : -1)
//     .filter(index => index !== -1);

//   // Застосовуємо обмеження для противника
//   if (config.useRestrictionHandling && boardSize === 4) {
//     const currentRestricted = getRestrictedCells(testBoard, boardSize, opponent, 
//       symbol === 'X' ? 'X' : 'O'); // firstPlayer logic
//     opponentMoves = opponentMoves.filter(move => {
//       if (!currentRestricted.includes(move)) return true;
//       return canOverrideRestriction(testBoard, move, opponent, winningConditions);
//     });
//   }

//   const scoredOpponentMoves = opponentMoves.map(move => {
//     const testOpponentBoard = makeMove([...testBoard], move, opponent);
//     const score = evaluatePosition(testOpponentBoard, boardSize, winningConditions, opponent, symbol, config);
//     return { move, score };
//   }).sort((a, b) => b.score - a.score);

//   const maxOpponentMoves = Math.min(scoredOpponentMoves.length, currentDepth === 0 ? 8 : 4);

//   for (let i = 0; i < maxOpponentMoves; i++) {
//     const { move: opponentMove } = scoredOpponentMoves[i];
//     const responseBoard = makeMove([...testBoard], opponentMove, opponent);
    
//     let ourNextMoves = responseBoard
//       .map((cell, index) => cell === '' ? index : -1)
//       .filter(index => index !== -1);

//     if (config.useRestrictionHandling && boardSize === 4) {
//       const nextRestricted = getRestrictedCells(responseBoard, boardSize, symbol, 
//         opponent === 'X' ? 'X' : 'O');
//       ourNextMoves = ourNextMoves.filter(move => {
//         if (!nextRestricted.includes(move)) return true;
//         return canOverrideRestriction(responseBoard, move, symbol, winningConditions);
//       });
//     }
    
//     const scoredOurMoves = ourNextMoves.map(move => {
//       const testOurBoard = makeMove([...responseBoard], move, symbol);
//       const score = evaluatePosition(testOurBoard, boardSize, winningConditions, symbol, opponent, config);
//       return { move, score };
//     }).sort((a, b) => b.score - a.score);
    
//     let canWinFromAnyMove = false;
//     const maxOurMoves = Math.min(scoredOurMoves.length, 6);
    
//     for (let j = 0; j < maxOurMoves; j++) {
//       const { move: nextMove } = scoredOurMoves[j];
//       if (canForceWin(responseBoard, boardSize, nextMove, symbol, winningConditions, maxDepth, currentDepth + 1, restrictedCells, config)) {
//         canWinFromAnyMove = true;
//         break;
//       }
//     }
    
//     if (!canWinFromAnyMove) return false;
//   }
  
//   return true;
// }

// // 🔥 ПОКРАЩЕНИЙ МІНІМАКС
// function minimaxWithRestrictions(board, boardSize, depth, maxDepth, isMaximizing, aiSymbol, restrictedCells, alpha, beta, config, firstPlayer) {
//   const cacheKey = createCacheKey(board, depth, isMaximizing, aiSymbol);
//   if (positionCache.has(cacheKey)) {
//     return positionCache.get(cacheKey);
//   }

//   const winningConditions = generateWinningConditions(boardSize);
//   const result = isGameFinished(board, winningConditions);
//   const playerSymbol = getOppositePlayer(aiSymbol);

//   if (result.winner === aiSymbol) {
//     const resultValue = { score: 15000 - depth, move: -1 };
//     positionCache.set(cacheKey, resultValue);
//     return resultValue;
//   }
  
//   if (result.winner === playerSymbol) {
//     const resultValue = { score: depth - 15000, move: -1 };
//     positionCache.set(cacheKey, resultValue);
//     return resultValue;
//   }
  
//   if (result.isDraw || depth >= maxDepth) {
//     const score = evaluatePosition(board, boardSize, winningConditions, aiSymbol, playerSymbol, config);
//     const resultValue = { score, move: -1 };
//     positionCache.set(cacheKey, resultValue);
//     return resultValue;
//   }

//   const currentPlayer = isMaximizing ? aiSymbol : playerSymbol;
//   let availableMoves = board
//     .map((cell, index) => {
//       if (cell !== '') return -1;
//       return index;
//     })
//     .filter(index => index !== -1);

//   // 🔥 РОЗУМНЕ ЗАСТОСУВАННЯ ОБМЕЖЕНЬ
//   if (config.useRestrictionHandling && restrictedCells && boardSize === 4) {
//     const currentRestricted = getRestrictedCells(board, boardSize, currentPlayer, firstPlayer);
    
//     availableMoves = availableMoves.filter(move => {
//       if (!currentRestricted.includes(move)) return true;
      
//       if (config.useSmartRestrictionOverride) {
//         return canOverrideRestriction(board, move, currentPlayer, winningConditions);
//       }
      
//       return false;
//     });
//   }

//   // Сортування ходів для кращого обрізання
//   const scoredMoves = availableMoves.map(move => {
//     const testBoard = makeMove([...board], move, currentPlayer);
//     const score = evaluatePosition(testBoard, boardSize, winningConditions, aiSymbol, playerSymbol, config);
//     return { move, score };
//   });

//   if (isMaximizing) {
//     scoredMoves.sort((a, b) => b.score - a.score);
//   } else {
//     scoredMoves.sort((a, b) => a.score - b.score);
//   }

//   availableMoves = scoredMoves.map(sm => sm.move);
//   let bestMove = availableMoves[0] || -1;
//   let resultValue;

//   if (isMaximizing) {
//     let maxScore = -Infinity;
    
//     for (const move of availableMoves) {
//       const newBoard = makeMove([...board], move, aiSymbol);
      
//       const { score } = minimaxWithRestrictions(newBoard, boardSize, depth + 1, maxDepth, false, aiSymbol, restrictedCells, alpha, beta, config, firstPlayer);
      
//       if (score > maxScore) {
//         maxScore = score;
//         bestMove = move;
//       }
      
//       alpha = Math.max(alpha, score);
//       if (beta <= alpha) break;
//     }
    
//     resultValue = { score: maxScore, move: bestMove };
    
//   } else {
//     let minScore = Infinity;
    
//     for (const move of availableMoves) {
//       const newBoard = makeMove([...board], move, playerSymbol);
      
//       const { score } = minimaxWithRestrictions(newBoard, boardSize, depth + 1, maxDepth, true, aiSymbol, restrictedCells, alpha, beta, config, firstPlayer);
      
//       if (score < minScore) {
//         minScore = score;
//         bestMove = move;
//       }
      
//       beta = Math.min(beta, score);
//       if (beta <= alpha) break;
//     }
    
//     resultValue = { score: minScore, move: bestMove };
//   }

//   if (positionCache.size < MAX_CACHE_SIZE) {
//     positionCache.set(cacheKey, resultValue);
//   }

//   return resultValue;
// }

// // 🔥 ПОКРАЩЕНА СТРАТЕГІЧНА ФУНКЦІЯ
// function getStrategicMove(board, boardSize, aiSymbol, restrictedCells, config, firstPlayer) {
//   let availableMoves = board
//     .map((cell, index) => {
//       if (cell !== '') return -1;
//       return index;
//     })
//     .filter(index => index !== -1);

//   // Застосовуємо обмеження
//   if (config.useRestrictionHandling && restrictedCells && boardSize === 4) {
//     const currentRestricted = getRestrictedCells(board, boardSize, aiSymbol, firstPlayer);
    
//     availableMoves = availableMoves.filter(move => {
//       if (!currentRestricted.includes(move)) return true;
      
//       if (config.useSmartRestrictionOverride) {
//         return canOverrideRestriction(board, move, aiSymbol, generateWinningConditions(boardSize));
//       }
      
//       return false;
//     });
//   }
    
//   if (availableMoves.length === 0) return -1;

//   const winningConditions = generateWinningConditions(boardSize);
//   const playerSymbol = getOppositePlayer(aiSymbol);

//   // 1. Спробувати виграти
//   for (const move of availableMoves) {
//     const testBoard = makeMove([...board], move, aiSymbol);
//     const result = checkWinner(testBoard, winningConditions);
//     if (result.winner === aiSymbol) {
//       return move;
//     }
//   }

//   // 2. Заблокувати виграш (перевіряємо ВСІ можливі ходи, навіть обмежені)
//   const allMoves = board
//     .map((cell, index) => cell === '' ? index : -1)
//     .filter(index => index !== -1);

//   for (const move of allMoves) {
//     const testBoard = makeMove([...board], move, playerSymbol);
//     const result = checkWinner(testBoard, winningConditions);
//     if (result.winner === playerSymbol) {
//       // Це критичне блокування - ігноруємо обмеження
//       return move;
//     }
//   }

//   // 3. Створити вилку
//   if (config.useForkBlocking) {
//     const forkMoves = [];
//     for (const move of availableMoves) {
//       const testBoard = makeMove([...board], move, aiSymbol);
//       const forkCount = countForks(testBoard, aiSymbol, winningConditions);
//       if (forkCount > 0) {
//         const score = evaluatePosition(testBoard, boardSize, winningConditions, aiSymbol, playerSymbol, config);
//         forkMoves.push({ move, forkCount, score });
//       }
//     }

//     if (forkMoves.length > 0) {
//       forkMoves.sort((a, b) => {
//         if (a.forkCount !== b.forkCount) return b.forkCount - a.forkCount;
//         return b.score - a.score;
//       });
//       return forkMoves[0].move;
//     }

//     // 4. Блокувати вилки противника (перевіряємо всі ходи)
//     for (const move of allMoves) {
//       const testBoard = makeMove([...board], move, playerSymbol);
//       const forkCount = countForks(testBoard, playerSymbol, winningConditions);
//       if (forkCount > 0) {
//         return move; // Критичне блокування вилки
//       }
//     }
//   }

//   // 5. Найкращий позиційний хід з доступних
//   let bestMove = availableMoves[0];
//   let bestScore = -Infinity;
  
//   for (const move of availableMoves) {
//     const testBoard = makeMove([...board], move, aiSymbol);
//     const score = evaluatePosition(testBoard, boardSize, winningConditions, aiSymbol, playerSymbol, config);
//     if (score > bestScore) {
//       bestScore = score;
//       bestMove = move;
//     }
//   }

//   return bestMove;
// }

// // 🔥 ГОЛОВНА ФУНКЦІЯ З ПОКРАЩЕНОЮ ЛОГІКОЮ
// function getBestMove(board, boardSize, difficulty, aiSymbol, playerSymbol, randomness, restrictedCells = [], firstPlayer) {
//   const config = getAIConfig(difficulty);
//   const winningConditions = generateWinningConditions(boardSize);
  
//   // Всі доступні ходи (без обмежень)
//   const allAvailableMoves = board
//     .map((cell, index) => cell === '' ? index : -1)
//     .filter(index => index !== -1);
    
//   if (allAvailableMoves.length === 0) return -1;

//   // Доступні ходи з врахуванням обмежень
//   let legalMoves = [...allAvailableMoves];
  
//   if (config.useRestrictionHandling && boardSize === 4 && restrictedCells) {
//     const currentRestricted = getRestrictedCells(board, boardSize, aiSymbol, firstPlayer);
    
//     legalMoves = allAvailableMoves.filter(move => {
//       if (!currentRestricted.includes(move)) return true;
      
//       // Розумне ігнорування обмежень для критичних ходів
//       if (config.useSmartRestrictionOverride) {
//         return canOverrideRestriction(board, move, aiSymbol, winningConditions);
//       }
      
//       return false;
//     });
//   }

//   console.log(`🤖 AI [${difficulty}] аналіз:`, {
//     boardSize,
//     totalMoves: allAvailableMoves.length,
//     legalMoves: legalMoves.length,
//     restrictions: restrictedCells?.length || 0,
//     useRestrictions: config.useRestrictionHandling
//   });

//   // Випадковість тільки для легких рівнів
//   if (config.randomnessPercent > 0 && Math.random() * 100 < config.randomnessPercent) {
//     const randomMove = legalMoves.length > 0 ? legalMoves[Math.floor(Math.random() * legalMoves.length)] : allAvailableMoves[Math.floor(Math.random() * allAvailableMoves.length)];
//     console.log(`🎲 Випадковий хід: ${randomMove}`);
//     return randomMove;
//   }

//   // 🔥 ПРІОРИТЕТ 1: ЗАВЖДИ виграти
//   for (const move of allAvailableMoves) {
//     const testBoard = makeMove([...board], move, aiSymbol);
//     const result = checkWinner(testBoard, winningConditions);
//     if (result.winner === aiSymbol) {
//       console.log(`🏆 Виграшний хід: ${move}`);
//       return move;
//     }
//   }

//   // В функції getBestMove, після пріоритету 1 (виграш), додайте:

// // 🔥 ПРІОРИТЕТ 1.5: ДЕБЮТНА КНИГА
// if (config.useOpeningBook) {
//   const openingMove = getOpeningMove(board, boardSize);
//   if (openingMove !== -1 && (legalMoves.includes(openingMove) || allAvailableMoves.includes(openingMove))) {
//     console.log(`📖 Дебютний хід: ${openingMove}`);
//     return openingMove;
//   }
// }

// // 🔥 ПРІОРИТЕТ 2: МНОЖИННЕ БЛОКУВАННЯ ЗАГРОЗ
// if (config.useMultipleThreatDetection) {
//   const threats = detectMultipleThreats(board, boardSize, playerSymbol, winningConditions);
//   console.log(`🚨 Знайдено загроз: ${threats.length}`);
  
//   if (threats.length > 0) {
//     // Блокуємо найвищий пріоритет
//     const topThreat = threats[0];
//     console.log(`🛡️ БЛОКУВАННЯ МНОЖИННОЇ ЗАГРОЗИ: ${topThreat.position}`);
//     return topThreat.position;
//   }
// }

// // Решта існуючого коду...

//   // 🔥 ПРІОРИТЕТ 2: ЗАВЖДИ заблокувати виграш (ігнорує обмеження)
//   for (const move of allAvailableMoves) {
//     const testBoard = makeMove([...board], move, playerSymbol);
//     const result = checkWinner(testBoard, winningConditions);
//     if (result.winner === playerSymbol) {
//       console.log(`🛡️ Блокування виграшу: ${move} ${restrictedCells && restrictedCells.includes(move) ? '(ігнорує обмеження!)' : ''}`);
//       return move;
//     }
//   }

//   // 🔥 ПРІОРИТЕТ 3: Пошук форсованого виграшу
//   if (config.useForcedWinSearch) {
//     const forcedWin = findForcedWin(board, boardSize, aiSymbol, restrictedCells, config.forcedWinDepth, config);
//     if (forcedWin !== -1) {
//       console.log(`⚡ Форсований виграш: ${forcedWin}`);
//       return forcedWin;
//     }
//   }

//   // 🔥 ПРІОРИТЕТ 4: Мінімакс з адаптивною глибиною
//   let maxDepth;
  
//   if (typeof config.useMinimaxDepth === 'number') {
//     maxDepth = config.useMinimaxDepth;
//   } else if (boardSize === 3) {
//     maxDepth = config.useMinimaxDepth.boardSize3;
//   } else {
//     const depthConfig = config.useMinimaxDepth.boardSize4;
//     if (typeof depthConfig === 'number') {
//       maxDepth = depthConfig;
//     } else {
//       const movesLeft = legalMoves.length;
//       if (movesLeft >= 12) maxDepth = depthConfig.earlyGame;
//       else if (movesLeft >= 6) maxDepth = depthConfig.midGame;
//       else maxDepth = depthConfig.endGame;
//     }
//   }

//   console.log(`🎯 Мінімакс глибина ${maxDepth} для ${difficulty} (ходів: ${legalMoves.length})`);
  
//   // Очищення кешу
//   if (positionCache.size > MAX_CACHE_SIZE * 0.9) {
//     positionCache.clear();
//     restrictionCache.clear();
//     console.log('🧹 Очищено кеш');
//   }
  
//   const { move: minimaxMove } = minimaxWithRestrictions(
//     board, boardSize, 0, maxDepth, true, aiSymbol, 
//     restrictedCells, -Infinity, Infinity, config, firstPlayer
//   );

//   if (minimaxMove !== -1) {
//     console.log(`🧠 Мінімакс хід: ${minimaxMove}`);
//     return minimaxMove;
//   }

//   // 🔥 ПРІОРИТЕТ 5: Стратегічний резервний хід
//   const strategicMove = getStrategicMove(board, boardSize, aiSymbol, restrictedCells, config, firstPlayer);
//   console.log(`📋 Стратегічний хід: ${strategicMove}`);
  
//   return strategicMove;
// }

// // 🔥 ПОКРАЩЕНИЙ ОБРОБНИК ПОВІДОМЛЕНЬ
// self.onmessage = function(e) {
//   const { board, boardSize, difficulty, aiSymbol, playerSymbol, randomness, restrictedCells, firstPlayer } = e.data;
  
//   try {
//     const moveCount = board.filter(cell => cell !== '').length;
//     console.log(`🤖 AI Worker [${difficulty.toUpperCase()}] START:`, { 
//       boardSize, 
//       moveCount,
//       aiSymbol,
//       playerSymbol,
//       firstPlayer,
//       availableMoves: board.filter(cell => cell === '').length,
//       restrictedCells: restrictedCells?.length || 0
//     });
    
//     const startTime = Date.now();
    
//     const move = getBestMove(board, boardSize, difficulty, aiSymbol, playerSymbol, randomness, restrictedCells, firstPlayer);
    
//     const calculationTime = Date.now() - startTime;
    
//     // Розрахунок оцінки позиції
//     let evaluation = 0;
//     if (move !== -1) {
//       const winningConditions = generateWinningConditions(boardSize);
//       const testBoard = makeMove([...board], move, aiSymbol);
//       const config = getAIConfig(difficulty);
//       evaluation = evaluatePosition(testBoard, boardSize, winningConditions, aiSymbol, playerSymbol, config);
//     }
    
//     console.log(`🤖 AI Worker [${difficulty.toUpperCase()}] FINISH:`, {
//       calculationTime: `${calculationTime}мс`,
//       move,
//       evaluation: Math.round(evaluation),
//       positionCache: positionCache.size,
//       restrictionCache: restrictionCache.size
//     });
    
//     // Перевірка на валідність ходу
//     if (move === -1 || board[move] !== '') {
//       console.error(`🔥 ПОМИЛКА: Невалідний хід ${move}`, {
//         boardState: board,
//         restrictedCells,
//         difficulty
//       });
//     }
    
//     self.postMessage({ 
//       success: true, 
//       move,
//       calculationTime,
//       evaluation: Math.round(evaluation),
//       difficulty,
//       cacheHits: positionCache.size + restrictionCache.size,
//       debug: {
//         boardSize,
//         moveCount,
//         restrictions: restrictedCells?.length || 0
//       }
//     });
    
//   } catch (error) {
//     console.error(`🔥 AI Worker [${difficulty?.toUpperCase() || 'UNKNOWN'}] ERROR:`, error);
    
//     // Резервний простий хід
//     const fallbackMove = board.findIndex(cell => cell === '');
    
//     self.postMessage({ 
//       success: false, 
//       error: error.message,
//       difficulty,
//       fallbackMove: fallbackMove >= 0 ? fallbackMove : -1
//     });
//   }
// };


















































// public/ai-worker.js
// Web Worker для AI обчислень - МАКСИМАЛЬНО ПОКРАЩЕНА ВЕРСІЯ 4.0
// 🔥 З РІЗНОМАНІТНИМИ СТИЛЯМИ ГРИ

// 🔥 ПОКРАЩЕНА КОНФІГУРАЦІЯ СКЛАДНОСТІ AI
const AI_DIFFICULTY_CONFIG = {
  easy: {
    randomnessPercent: 35,          
    useMinimaxDepth: 3,             
    useForcedWinSearch: false,      
    useForkBlocking: true,          
    usePositionalPlay: false,       
    useRestrictionHandling: false,  // НЕ враховувати обмеження 4×4
  },
  medium: {
    randomnessPercent: 5,           
    useMinimaxDepth: {
      boardSize3: 8,                
      boardSize4: 6                 
    },
    useForcedWinSearch: true,
    forcedWinDepth: 5,              
    useForkBlocking: true,
    useAdvancedBlocking: true,      
    usePositionalPlay: true,
    useRestrictionHandling: true,   // Враховувати обмеження
    useMultipleThreatDetection: true,
  },
  hard: {
    randomnessPercent: 0,           
    useMinimaxDepth: {
      boardSize3: 12,               
      boardSize4: {
        earlyGame: 10,    
        midGame: 16,      
        endGame: 20       
      }
    },
    useForcedWinSearch: true,
    forcedWinDepth: 12,              
    useForkBlocking: true,
    useAdvancedBlocking: true,
    usePositionalOptimization: true, 
    useThreatAnalysis: true,        
    useEndgameOptimization: true,   
    useRestrictionHandling: true,   // ОБОВ'ЯЗКОВО враховувати
    useSmartRestrictionOverride: true, // Розумне ігнорування обмежень
    useOpeningBook: true,           // 🔥 НОВА ОПЦІЯ
    useMultipleThreatDetection: true, // 🔥 НОВА ОПЦІЯ
    usePlayStyleVariation: true,    // 🔥 НОВИЙ ПАРАМЕТР
    playStyleChangeChance: 0.15,    // 15% шансу змінити стиль
    moveVariationTolerance: 0.1,    // Толерантність до субоптимальних ходів
    useAdaptiveDepth: true          // Адаптивна глибина
  }
};

// 🔥 СТИЛІ ГРИ AI
const AI_PLAY_STYLES = {
  aggressive: {
    positionWeight: 1.2,    // Більше фокусу на атаці
    defensiveWeight: 0.8,   // Менше захисту
    riskTolerance: 0.3,     // Ризикованіші ходи
    name: 'Агресивний'
  },
  defensive: {
    positionWeight: 0.8,    // Менше атаки
    defensiveWeight: 1.3,   // Більше захисту
    riskTolerance: 0.1,     // Обережніші ходи
    name: 'Оборонний'
  },
  balanced: {
    positionWeight: 1.0,    
    defensiveWeight: 1.0,   
    riskTolerance: 0.2,
    name: 'Збалансований'
  },
  tactical: {
    positionWeight: 1.1,    
    defensiveWeight: 1.1,   
    riskTolerance: 0.25,
    name: 'Тактичний'
  }
};

// 🔥 ПОКРАЩЕНИЙ КЕШ
const positionCache = new Map();
const restrictionCache = new Map();
const MAX_CACHE_SIZE = 15000;

// Змінна для поточного стилю (зберігається між ходами)
let currentGameStyle = 'balanced';
let styleChangeCounter = 0;

function getAIConfig(difficulty) {
  return AI_DIFFICULTY_CONFIG[difficulty] || AI_DIFFICULTY_CONFIG.medium;
}

// 🔥 ФУНКЦІЯ ВИБОРУ СТИЛЮ ГРИ
function getRandomPlayStyle() {
  const styles = ['aggressive', 'defensive', 'balanced', 'tactical'];
  return styles[Math.floor(Math.random() * styles.length)];
}

// 🔥 РОЗШИРЕНА ДЕБЮТНА КНИГА
function getOpeningMove(board, boardSize) {
  if (boardSize !== 4) return -1;
  
  const moveCount = board.filter(cell => cell !== '').length;
  
  // Перший хід AI - РОЗШИРЮЄМО ВАРІАНТИ
  if (moveCount === 1) {
    const playerMove = board.findIndex(cell => cell !== '');
    
    // Якщо гравець взяв центр - більше варіантів кутів
    if ([5, 6, 9, 10].includes(playerMove)) {
      const cornerStrategies = [
        [0, 3],     // Верхні кути
        [12, 15],   // Нижні кути  
        [0, 15],    // Діагональ
        [3, 12]     // Анти-діагональ
      ];
      const strategy = cornerStrategies[Math.floor(Math.random() * cornerStrategies.length)];
      return strategy[Math.floor(Math.random() * strategy.length)];
    }
    
    // Якщо гравець взяв кут - варіанти центру
    if ([0, 3, 12, 15].includes(playerMove)) {
      const centerStrategies = [
        [5, 6],     // Верхній центр
        [9, 10],    // Нижній центр
        [5, 10],    // Діагональний центр
        [6, 9]      // Анти-діагональний центр
      ];
      const strategy = centerStrategies[Math.floor(Math.random() * centerStrategies.length)];
      return strategy[Math.floor(Math.random() * strategy.length)];
    }
    
    // Для інших позицій - різні стратегії
    const fallbackStrategies = [
      [5, 6, 9, 10], // Центральна стратегія
      [0, 3, 12, 15], // Кутова стратегія  
      [1, 2, 4, 7]    // Крайова стратегія
    ];
    const chosenStrategy = fallbackStrategies[Math.floor(Math.random() * fallbackStrategies.length)];
    const available = chosenStrategy.filter(pos => board[pos] === '');
    return available[Math.floor(Math.random() * available.length)] || 5;
  }
  
  // Другий хід AI (після 2 ходів загалом)
  if (moveCount === 2) {
    const centers = [5, 6, 9, 10].filter(pos => board[pos] === '');
    if (centers.length > 0) {
      return centers[Math.floor(Math.random() * centers.length)];
    }
  }
  
  return -1;
}

// 🔥 ВИБІР СЕРЕД ОДНАКОВИХ ХОДІВ З ВАРІАЦІЄЮ
function selectBestMoveWithVariety(scoredMoves, playStyle, config) {
  if (scoredMoves.length === 0) return -1;
  
  // Знаходимо найкращий результат
  const bestScore = scoredMoves[0].score;
  
  // Толерантність до "майже найкращих" ходів
  const tolerance = Math.abs(bestScore) * (config.moveVariationTolerance || 0.1);
  
  const goodMoves = scoredMoves.filter(move => 
    Math.abs(move.score - bestScore) <= tolerance
  );
  
  if (goodMoves.length <= 1) {
    return scoredMoves[0].move;
  }
  
  // Для агресивного стилю - більше ваги центральним позиціям
  if (playStyle === 'aggressive') {
    const centerPositions = [5, 6, 9, 10];
    const aggressiveMoves = goodMoves.filter(move => 
      centerPositions.includes(move.move)
    );
    if (aggressiveMoves.length > 0) {
      console.log(`⚔️ Агресивний вибір серед центральних позицій`);
      return aggressiveMoves[Math.floor(Math.random() * aggressiveMoves.length)].move;
    }
  }
  
  // Для оборонного стилю - кути та краї
  if (playStyle === 'defensive') {
    const defensivePositions = [0, 3, 12, 15, 1, 2, 4, 7, 8, 11, 13, 14];
    const defensiveMoves = goodMoves.filter(move => 
      defensivePositions.includes(move.move)
    );
    if (defensiveMoves.length > 0) {
      console.log(`🛡️ Оборонний вибір`);
      return defensiveMoves[Math.floor(Math.random() * defensiveMoves.length)].move;
    }
  }
  
  // Випадковий вибір серед хороших ходів
  console.log(`🎲 Випадковий вибір серед ${goodMoves.length} хороших ходів`);
  return goodMoves[Math.floor(Math.random() * goodMoves.length)].move;
}

// 🔥 ДОДАЙТЕ ЦЮ ФУНКЦІЮ
function detectMultipleThreats(board, boardSize, playerSymbol, winningConditions) {
  const threats = [];
  
  // Знайти всі лінії з 2 символами противника + 1 пуста
  for (const condition of winningConditions) {
    let playerCount = 0;
    let emptyCount = 0;
    let emptyPos = -1;

    for (const index of condition) {
      if (board[index] === playerSymbol) playerCount++;
      else if (board[index] === '') {
        emptyCount++;
        emptyPos = index;
      }
    }

    if (playerCount === 2 && emptyCount === 1) {
      threats.push({
        position: emptyPos,
        line: condition,
        priority: 1000 + (condition.includes(5) || condition.includes(6) || 
                         condition.includes(9) || condition.includes(10) ? 100 : 0)
      });
    }
  }
  
  // Сортуємо за пріоритетом
  threats.sort((a, b) => b.priority - a.priority);
  // 🔥 Фільтруємо тільки найкритичніші загрози
  if (threats.length > 2) {
    const criticalThreats = threats.filter(t => t.priority >= threats[0].priority - 50);
    return criticalThreats.length > 0 ? criticalThreats : threats.slice(0, 2);
  }
  
  return threats;
}

function createCacheKey(board, depth, isMaximizing, aiSymbol) {
  return `${board.join('')}-${depth}-${isMaximizing}-${aiSymbol}`;
}

// Допоміжні функції
function generateWinningConditions(size) {
  const conditions = [];
  
  for (let row = 0; row < size; row++) {
    for (let col = 0; col <= size - 3; col++) {
      conditions.push([
        row * size + col,
        row * size + col + 1,
        row * size + col + 2
      ]);
    }
  }
  
  for (let col = 0; col < size; col++) {
    for (let row = 0; row <= size - 3; row++) {
      conditions.push([
        row * size + col,
        (row + 1) * size + col,
        (row + 2) * size + col
      ]);
    }
  }
  
  for (let row = 0; row <= size - 3; row++) {
    for (let col = 0; col <= size - 3; col++) {
      conditions.push([
        row * size + col,
        (row + 1) * size + col + 1,
        (row + 2) * size + col + 2
      ]);
    }
  }
  
  for (let row = 0; row <= size - 3; row++) {
    for (let col = 2; col < size; col++) {
      conditions.push([
        row * size + col,
        (row + 1) * size + col - 1,
        (row + 2) * size + col - 2
      ]);
    }
  }
  
  return conditions;
}

function checkWinner(board, winningConditions) {
  for (const [a, b, c] of winningConditions) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return {
        winner: board[a],
        winningLine: [a, b, c]
      };
    }
  }
  
  return { winner: null, winningLine: [] };
}

function isBoardFull(board) {
  return !board.includes('');
}

function isGameFinished(board, winningConditions) {
  const { winner, winningLine } = checkWinner(board, winningConditions);
  
  if (winner) {
    return { finished: true, winner, isDraw: false, winningLine };
  }
  
  if (isBoardFull(board)) {
    return { finished: true, winner: null, isDraw: true, winningLine: [] };
  }
  
  return { finished: false, winner: null, isDraw: false, winningLine: [] };
}

function getOppositePlayer(player) {
  return player === 'X' ? 'O' : 'X';
}

function makeMove(board, index, player) {
  if (board[index] !== '') {
    return board;
  }
  
  const newBoard = [...board];
  newBoard[index] = player;
  return newBoard;
}

// 🔥 ВИПРАВЛЕНА ФУНКЦІЯ ОБМЕЖЕНЬ ДЛЯ 4×4
function getRestrictedCells(board, boardSize, currentPlayer, firstPlayer) {
  if (boardSize !== 4) return [];
  
  // Кешування обмежень
  const cacheKey = `${board.join('')}-${currentPlayer}-${firstPlayer}`;
  if (restrictionCache.has(cacheKey)) {
    return restrictionCache.get(cacheKey);
  }
  
  const secondPlayer = getOppositePlayer(firstPlayer);
  const firstPlayerMoves = board.filter(cell => cell === firstPlayer).length;
  const secondPlayerMoves = board.filter(cell => cell === secondPlayer).length;
  
  const isSecondMoveForFirst = currentPlayer === firstPlayer && firstPlayerMoves === 1;
  const isSecondMoveForSecond = currentPlayer === secondPlayer && secondPlayerMoves === 1;
  
  if (!isSecondMoveForFirst && !isSecondMoveForSecond) {
    restrictionCache.set(cacheKey, []);
    return [];
  }
  
  // Знайти позицію першого ходу поточного гравця
  let firstMovePosition = -1;
  for (let i = 0; i < board.length; i++) {
    if (board[i] === currentPlayer) {
      firstMovePosition = i;
      break;
    }
  }
  
  if (firstMovePosition === -1) {
    restrictionCache.set(cacheKey, []);
    return [];
  }
  
  const row = Math.floor(firstMovePosition / 4);
  const col = firstMovePosition % 4;
  const restrictedCells = [];
  
  const directions = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1],           [0, 1],
    [1, -1],  [1, 0],  [1, 1]
  ];
  
  for (const [deltaRow, deltaCol] of directions) {
    const adjacentRow = row + deltaRow;
    const adjacentCol = col + deltaCol;
    
    if (adjacentRow >= 0 && adjacentRow < 4 && 
        adjacentCol >= 0 && adjacentCol < 4) {
      
      const adjacentIndex = adjacentRow * 4 + adjacentCol;
      
      if (board[adjacentIndex] !== '') continue;
      
      const nextRow = adjacentRow + deltaRow;
      const nextCol = adjacentCol + deltaCol;
      
      if (nextRow >= 0 && nextRow < 4 && 
          nextCol >= 0 && nextCol < 4) {
        
        const nextIndex = nextRow * 4 + nextCol;
        
        if (board[nextIndex] === '') {
          restrictedCells.push(adjacentIndex);
        }
      }
    }
  }
  
  // Кешуємо результат
  if (restrictionCache.size < MAX_CACHE_SIZE) {
    restrictionCache.set(cacheKey, restrictedCells);
  }
  
  return restrictedCells;
}

// 🔥 НОВА ФУНКЦІЯ: Розумна перевірка чи можна ігнорувати обмеження
function canOverrideRestriction(board, move, playerSymbol, winningConditions) {
  // Завжди дозволяємо блокувати виграш
  const testBoard = makeMove([...board], move, playerSymbol);
  const result = checkWinner(testBoard, winningConditions);
  if (result.winner === playerSymbol) {
    return true; // Це блокування виграшу - можна ігнорувати обмеження
  }
  
  // Перевіряємо чи це створює виграшну загрозу
  let threatCount = 0;
  for (const condition of winningConditions) {
    if (condition.includes(move)) {
      let playerCount = 0;
      let emptyCount = 0;
      
      for (const index of condition) {
        if (testBoard[index] === playerSymbol) playerCount++;
        else if (testBoard[index] === '') emptyCount++;
      }
      
      if (playerCount === 2 && emptyCount === 1) {
        threatCount++;
      }
    }
  }
  
  return threatCount >= 2; // Вилка - можна ігнорувати обмеження
}

// 🔥 ПОКРАЩЕНА ОЦІНЮВАЛЬНА ФУНКЦІЯ З СТИЛЯМИ
function evaluatePosition(board, boardSize, winningConditions, aiSymbol, playerSymbol, config, playStyle = 'balanced') {
  const result = isGameFinished(board, winningConditions);
  const moveCount = board.filter(cell => cell !== '').length;

  if (result.winner === aiSymbol) return 15000 - moveCount;
  if (result.winner === playerSymbol) return -15000 + moveCount;
  if (result.isDraw) return 0;

  let score = 0;

  // 🔥 КРИТИЧНІ БОНУСИ ДЛЯ РАННЬОЇ ГРИ (перші 5 ходів)
  if (moveCount <= 5 && boardSize === 4) {
    console.log(`🎯 Рання гра: хід ${moveCount}, стиль: ${AI_PLAY_STYLES[playStyle]?.name || playStyle}`);
    
    // СУПЕР контроль центру - критично важливий!
    const superCenters = [5, 6, 9, 10];
    let centerControl = 0;
    
    for (const pos of superCenters) {
      if (board[pos] === aiSymbol) {
        centerControl += 350; // 🔥 ЗБІЛЬШЕНО з 200!
        console.log(`💎 AI контролює центр ${pos}: +350`);
      } else if (board[pos] === playerSymbol) {
        centerControl -= 280; // Штраф за втрату центру
        console.log(`⚠️ Гравець контролює центр ${pos}: -280`);
      }
    }
    
    score += centerControl;
    
    // 🔥 МЕГА-БОНУС за контроль довгих діагоналей в ранній грі
    const longDiagonals = [
      [0, 5, 10, 15],  // Головна діагональ
      [3, 6, 9, 12]    // Анти-діагональ
    ];
    
    for (const diagonal of longDiagonals) {
      let aiOnDiag = 0;
      let playerOnDiag = 0;
      let emptyOnDiag = 0;
      
      for (const pos of diagonal) {
        if (board[pos] === aiSymbol) aiOnDiag++;
        else if (board[pos] === playerSymbol) playerOnDiag++;
        else emptyOnDiag++;
      }
      
      // Чиста діагональ AI = золото!
      if (aiOnDiag > 0 && playerOnDiag === 0) {
        const diagonalBonus = aiOnDiag * aiOnDiag * 180; // Квадратичний бонус
        score += diagonalBonus;
        console.log(`🏆 AI контролює діагональ ${diagonal}: +${diagonalBonus}`);
      }
      
      // Гравець контролює діагональ = небезпека
      if (playerOnDiag > 0 && aiOnDiag === 0) {
        const diagonalPenalty = playerOnDiag * playerOnDiag * 150;
        score -= diagonalPenalty;
        console.log(`🚨 Гравець контролює діагональ ${diagonal}: -${diagonalPenalty}`);
      }
      
      // 🔥 НОВИЙ БОНУС: потенціал діагоналі
      if (aiOnDiag === 1 && playerOnDiag === 0 && emptyOnDiag === 3) {
        score += 120; // Бонус за початок контролю діагоналі
        console.log(`⭐ Потенціал діагоналі: +120`);
      }
    }
    
    // 🔥 БОНУС за контроль кутів у ранній грі
    const corners = [0, 3, 12, 15];
    let cornerControl = 0;
    
    for (const corner of corners) {
      if (board[corner] === aiSymbol) cornerControl += 90;
      else if (board[corner] === playerSymbol) cornerControl -= 70;
    }
    
    score += cornerControl;
    
    // 🔥 ШТРАФ за розкидані ходи в ранній грі
    let hasStrategy = false;
    
    // Перевіряємо чи є AI на діагоналях
    for (const diagonal of longDiagonals) {
      for (const pos of diagonal) {
        if (board[pos] === aiSymbol) {
          hasStrategy = true;
          break;
        }
      }
      if (hasStrategy) break;
    }
    
    // Або чи контролює центр
    if (centerControl >= 100) {
      hasStrategy = true;
    }
    
    if (!hasStrategy) {
      score -= 200; // Штраф за відсутність стратегії
      console.log(`📉 Штраф за відсутність стратегії: -200`);
    }
  }

  // 🔥 ПОКРАЩЕНИЙ АНАЛІЗ ЛІНІЙ з експоненціальними бонусами
  for (const condition of winningConditions) {
    let aiCount = 0;
    let playerCount = 0;
    let emptyCount = 0;

    for (const index of condition) {
      const cell = board[index];
      if (cell === aiSymbol) aiCount++;
      else if (cell === playerSymbol) playerCount++;
      else emptyCount++;
    }

    if (playerCount === 0) {
      if (aiCount === 2 && emptyCount === 1) {
        score += 2500; // Майже виграш
      } else if (aiCount === 2) {
        score += 350;
      } else if (aiCount === 1 && emptyCount === 2) {
        score += 80;
      } else if (aiCount === 1) {
        score += 35;
      }
    } else if (aiCount === 0) {
      if (playerCount === 2 && emptyCount === 1) {
        score -= 2300; // Критично заблокувати
      } else if (playerCount === 2) {
        score -= 300;
      } else if (playerCount === 1 && emptyCount === 2) {
        score -= 60;
      } else if (playerCount === 1) {
        score -= 25;
      }
    }
  }

  // 🔥 ЗАСТОСУВАННЯ СТИЛЮ ГРИ
  if (playStyle && AI_PLAY_STYLES[playStyle]) {
    const styleModifier = AI_PLAY_STYLES[playStyle];
    
    // Модифікуємо позиційні бонуси залежно від стилю
    if (config.usePositionalPlay || config.usePositionalOptimization) {
      if (boardSize === 4) {
        // Градація позицій від центру
        const positionValues = {
          5: 80, 6: 80, 9: 80, 10: 80,     // Супер-центр
          1: 40, 2: 40, 4: 40, 7: 40,      // Центральні
          8: 40, 11: 40, 13: 40, 14: 40,
          0: 25, 3: 25, 12: 25, 15: 25     // Кути
        };
        
        for (const [pos, value] of Object.entries(positionValues)) {
          const position = parseInt(pos);
          if (board[position] === aiSymbol) {
            score += Math.floor(value * styleModifier.positionWeight);
          } else if (board[position] === playerSymbol) {
            score -= Math.floor(value * 0.7 * styleModifier.defensiveWeight);
          }
        }

        // Контроль довгих діагоналей
        const longDiagonals = [
          [0, 5, 10, 15],
          [3, 6, 9, 12]
        ];
        
        for (const diagonal of longDiagonals) {
          let aiControl = 0;
          let playerControl = 0;
          
          for (const pos of diagonal) {
            if (board[pos] === aiSymbol) aiControl++;
            else if (board[pos] === playerSymbol) playerControl++;
          }
          
          if (playerControl === 0 && aiControl > 0) {
            score += Math.floor(aiControl * aiControl * 20 * styleModifier.positionWeight);
          }
          if (aiControl === 0 && playerControl > 0) {
            score -= Math.floor(playerControl * playerControl * 15 * styleModifier.defensiveWeight);
          }
        }
      } else if (boardSize === 3) {
        // Для 3×3 центр критично важливий
        if (board[4] === aiSymbol) score += Math.floor(120 * styleModifier.positionWeight);
        else if (board[4] === playerSymbol) score -= Math.floor(100 * styleModifier.defensiveWeight);
        
        const corners = [0, 2, 6, 8];
        for (const corner of corners) {
          if (board[corner] === aiSymbol) score += Math.floor(45 * styleModifier.positionWeight);
          else if (board[corner] === playerSymbol) score -= Math.floor(35 * styleModifier.defensiveWeight);
        }
      }
    }
  }

  // 🔥 ПОКРАЩЕНИЙ АНАЛІЗ ЗАГРОЗ
  if (config.useThreatAnalysis) {
    const playerForks = countForks(board, playerSymbol, winningConditions);
    const aiForks = countForks(board, aiSymbol, winningConditions);
    
    //const style = AI_PLAY_STYLES[playStyle] || AI_PLAY_STYLES.balanced;
    
    const currentStyle = AI_PLAY_STYLES[playStyle] || AI_PLAY_STYLES.balanced;
    score -= Math.floor(playerForks * 250 * currentStyle.defensiveWeight);
    score += Math.floor(aiForks * 300 * currentStyle.positionWeight);
    
    // Бонус за контроль центральних ліній
    const centralLines = getCentralLines(boardSize);
    let controlledCentralLines = 0;
    
    for (const line of centralLines) {
      let aiInLine = 0;
      let playerInLine = 0;
      
      for (const index of line) {
        if (board[index] === aiSymbol) aiInLine++;
        else if (board[index] === playerSymbol) playerInLine++;
      }
      
      if (aiInLine > 0 && playerInLine === 0) {
        controlledCentralLines++;
      }
    }
    
    score += controlledCentralLines * 15;
  }

  return score;
}

// 🔥 НОВА ФУНКЦІЯ: Отримати центральні лінії
function getCentralLines(boardSize) {
  if (boardSize === 4) {
    return [
      [5, 6, 9],      // Центральний горизонтальний
      [1, 5, 9],      // Центральний вертикальний  
      [5, 10, 15],    // Центральна діагональ
    ];
  } else {
    return [
      [3, 4, 5],      // Центральний рядок
      [1, 4, 7],      // Центральний стовпець
      [0, 4, 8],      // Головна діагональ
      [2, 4, 6],      // Антидіагональ
    ];
  }
}

function countForks(board, symbol, winningConditions) {
  let forkCount = 0;
  const availableMoves = board
    .map((cell, index) => cell === '' ? index : -1)
    .filter(index => index !== -1);

  for (const move of availableMoves) {
    const testBoard = makeMove([...board], move, symbol);
    let winningOpportunities = 0;

    for (const condition of winningConditions) {
      let symbolCount = 0;
      let emptyCount = 0;

      for (const index of condition) {
        if (testBoard[index] === symbol) symbolCount++;
        else if (testBoard[index] === '') emptyCount++;
      }

      if (symbolCount === 2 && emptyCount === 1) {
        winningOpportunities++;
      }
    }

    if (winningOpportunities >= 2) {
      forkCount++;
    }
  }

  return forkCount;
}

// 🔥 ПОКРАЩЕНИЙ ПОШУК ФОРСОВАНОГО ВИГРАШУ
function findForcedWin(board, boardSize, symbol, restrictedCells, maxDepth, config) {
  const winningConditions = generateWinningConditions(boardSize);
  let availableMoves = board
    .map((cell, index) => {
      if (cell !== '') return -1;
      return index;
    })
    .filter(index => index !== -1);

  // Застосовуємо обмеження тільки якщо конфігурація дозволяє
  if (config.useRestrictionHandling && restrictedCells) {
    availableMoves = availableMoves.filter(move => {
      if (!restrictedCells.includes(move)) return true;
      
      // Перевіряємо чи можна ігнорувати обмеження
      if (config.useSmartRestrictionOverride) {
        return canOverrideRestriction(board, move, symbol, winningConditions);
      }
      
      return false;
    });
  }

  // Сортуємо ходи за пріоритетом
  const scoredMoves = availableMoves.map(move => {
    const testBoard = makeMove([...board], move, symbol);
    const score = evaluatePosition(testBoard, boardSize, winningConditions, symbol, getOppositePlayer(symbol), config, currentGameStyle);
    return { move, score };
  }).sort((a, b) => b.score - a.score);

  const maxMovesToCheck = Math.min(scoredMoves.length, 15);
  
  for (let i = 0; i < maxMovesToCheck; i++) {
    const { move } = scoredMoves[i];
    if (canForceWin(board, boardSize, move, symbol, winningConditions, maxDepth, 0, restrictedCells, config)) {
      return move;
    }
  }
  
  return -1;
}

// 🔥 ПОКРАЩЕНА canForceWin
function canForceWin(board, boardSize, move, symbol, winningConditions, maxDepth, currentDepth, restrictedCells, config) {
  if (currentDepth >= maxDepth) return false;
  
  const testBoard = makeMove([...board], move, symbol);
  const result = checkWinner(testBoard, winningConditions);
  
  if (result.winner === symbol) return true;
  if (result.winner || isBoardFull(testBoard)) return false;
  
  const opponent = getOppositePlayer(symbol);
  let opponentMoves = testBoard
    .map((cell, index) => cell === '' ? index : -1)
    .filter(index => index !== -1);

  // Застосовуємо обмеження для противника
  if (config.useRestrictionHandling && boardSize === 4) {
    const currentRestricted = getRestrictedCells(testBoard, boardSize, opponent, 
      symbol === 'X' ? 'X' : 'O'); // firstPlayer logic
    opponentMoves = opponentMoves.filter(move => {
      if (!currentRestricted.includes(move)) return true;
      return canOverrideRestriction(testBoard, move, opponent, winningConditions);
    });
  }

  const scoredOpponentMoves = opponentMoves.map(move => {
    const testOpponentBoard = makeMove([...testBoard], move, opponent);
    const score = evaluatePosition(testOpponentBoard, boardSize, winningConditions, opponent, symbol, config, currentGameStyle);
    return { move, score };
  }).sort((a, b) => b.score - a.score);

  const maxOpponentMoves = Math.min(scoredOpponentMoves.length, currentDepth === 0 ? 8 : 4);

  for (let i = 0; i < maxOpponentMoves; i++) {
    const { move: opponentMove } = scoredOpponentMoves[i];
    const responseBoard = makeMove([...testBoard], opponentMove, opponent);
    
    let ourNextMoves = responseBoard
      .map((cell, index) => cell === '' ? index : -1)
      .filter(index => index !== -1);

    if (config.useRestrictionHandling && boardSize === 4) {
      const nextRestricted = getRestrictedCells(responseBoard, boardSize, symbol, 
        opponent === 'X' ? 'X' : 'O');
      ourNextMoves = ourNextMoves.filter(move => {
        if (!nextRestricted.includes(move)) return true;
        return canOverrideRestriction(responseBoard, move, symbol, winningConditions);
      });
    }
    
    const scoredOurMoves = ourNextMoves.map(move => {
      const testOurBoard = makeMove([...responseBoard], move, symbol);
      const score = evaluatePosition(testOurBoard, boardSize, winningConditions, symbol, opponent, config, currentGameStyle);
      return { move, score };
    }).sort((a, b) => b.score - a.score);
    
    let canWinFromAnyMove = false;
    const maxOurMoves = Math.min(scoredOurMoves.length, 6);
    
    for (let j = 0; j < maxOurMoves; j++) {
      const { move: nextMove } = scoredOurMoves[j];
      if (canForceWin(responseBoard, boardSize, nextMove, symbol, winningConditions, maxDepth, currentDepth + 1, restrictedCells, config)) {
        canWinFromAnyMove = true;
        break;
      }
    }
    
    if (!canWinFromAnyMove) return false;
  }
  
  return true;
}

// 🔥 ПОКРАЩЕНИЙ МІНІМАКС
function minimaxWithRestrictions(board, boardSize, depth, maxDepth, isMaximizing, aiSymbol, restrictedCells, alpha, beta, config, firstPlayer) {
  const cacheKey = createCacheKey(board, depth, isMaximizing, aiSymbol);
  if (positionCache.has(cacheKey)) {
    return positionCache.get(cacheKey);
  }

  const winningConditions = generateWinningConditions(boardSize);
  const result = isGameFinished(board, winningConditions);
  const playerSymbol = getOppositePlayer(aiSymbol);

  if (result.winner === aiSymbol) {
    const resultValue = { score: 15000 - depth, move: -1 };
    positionCache.set(cacheKey, resultValue);
    return resultValue;
  }
  
  if (result.winner === playerSymbol) {
    const resultValue = { score: depth - 15000, move: -1 };
    positionCache.set(cacheKey, resultValue);
    return resultValue;
  }
  
  if (result.isDraw || depth >= maxDepth) {
    const score = evaluatePosition(board, boardSize, winningConditions, aiSymbol, playerSymbol, config, currentGameStyle);
    const resultValue = { score, move: -1 };
    positionCache.set(cacheKey, resultValue);
    return resultValue;
  }

  const currentPlayer = isMaximizing ? aiSymbol : playerSymbol;
  let availableMoves = board
    .map((cell, index) => {
      if (cell !== '') return -1;
      return index;
    })
    .filter(index => index !== -1);

  // 🔥 РОЗУМНЕ ЗАСТОСУВАННЯ ОБМЕЖЕНЬ
  if (config.useRestrictionHandling && restrictedCells && boardSize === 4) {
    const currentRestricted = getRestrictedCells(board, boardSize, currentPlayer, firstPlayer);
    
    availableMoves = availableMoves.filter(move => {
      if (!currentRestricted.includes(move)) return true;
      
      if (config.useSmartRestrictionOverride) {
        return canOverrideRestriction(board, move, currentPlayer, winningConditions);
      }
      
      return false;
    });
  }

  // Сортування ходів для кращого обрізання
  const scoredMoves = availableMoves.map(move => {
    const testBoard = makeMove([...board], move, currentPlayer);
    const score = evaluatePosition(testBoard, boardSize, winningConditions, aiSymbol, playerSymbol, config, currentGameStyle);
    return { move, score };
  });

  if (isMaximizing) {
    scoredMoves.sort((a, b) => b.score - a.score);
  } else {
    scoredMoves.sort((a, b) => a.score - b.score);
  }

  // 🔥 ВИКОРИСТАННЯ ВАРІАЦІЇ ДЛЯ AI
  if (isMaximizing && config.usePlayStyleVariation) {
    const selectedMove = selectBestMoveWithVariety(scoredMoves, currentGameStyle, config);
    if (selectedMove !== -1) {
      // Якщо знайшли варіацію, повертаємо її з оцінкою
      const selectedScore = scoredMoves.find(sm => sm.move === selectedMove)?.score || scoredMoves[0]?.score || 0;
      const resultValue = { score: selectedScore, move: selectedMove };
      
      if (positionCache.size < MAX_CACHE_SIZE) {
        positionCache.set(cacheKey, resultValue);
      }
      
      return resultValue;
    }
  }

  availableMoves = scoredMoves.map(sm => sm.move);
  let bestMove = availableMoves[0] || -1;
  let resultValue;

  if (isMaximizing) {
    let maxScore = -Infinity;
    
    for (const move of availableMoves) {
      const newBoard = makeMove([...board], move, aiSymbol);
      
      const { score } = minimaxWithRestrictions(newBoard, boardSize, depth + 1, maxDepth, false, aiSymbol, restrictedCells, alpha, beta, config, firstPlayer);
      
      if (score > maxScore) {
        maxScore = score;
        bestMove = move;
      }
      
      alpha = Math.max(alpha, score);
      if (beta <= alpha) break;
    }
    
    resultValue = { score: maxScore, move: bestMove };
    
  } else {
    let minScore = Infinity;
    
    for (const move of availableMoves) {
      const newBoard = makeMove([...board], move, playerSymbol);
      
      const { score } = minimaxWithRestrictions(newBoard, boardSize, depth + 1, maxDepth, true, aiSymbol, restrictedCells, alpha, beta, config, firstPlayer);
      
      if (score < minScore) {
        minScore = score;
        bestMove = move;
      }
      
      beta = Math.min(beta, score);
      if (beta <= alpha) break;
    }
    
    resultValue = { score: minScore, move: bestMove };
  }

  if (positionCache.size < MAX_CACHE_SIZE) {
    positionCache.set(cacheKey, resultValue);
  }

  return resultValue;
}

// 🔥 ПОКРАЩЕНА СТРАТЕГІЧНА ФУНКЦІЯ
function getStrategicMove(board, boardSize, aiSymbol, restrictedCells, config, firstPlayer) {
  let availableMoves = board
    .map((cell, index) => {
      if (cell !== '') return -1;
      return index;
    })
    .filter(index => index !== -1);

  // Застосовуємо обмеження
  if (config.useRestrictionHandling && restrictedCells && boardSize === 4) {
    const currentRestricted = getRestrictedCells(board, boardSize, aiSymbol, firstPlayer);
    
    availableMoves = availableMoves.filter(move => {
      if (!currentRestricted.includes(move)) return true;
      
      if (config.useSmartRestrictionOverride) {
        return canOverrideRestriction(board, move, aiSymbol, generateWinningConditions(boardSize));
      }
      
      return false;
    });
  }
    
  if (availableMoves.length === 0) return -1;

  const winningConditions = generateWinningConditions(boardSize);
  const playerSymbol = getOppositePlayer(aiSymbol);

  // 1. Спробувати виграти
  for (const move of availableMoves) {
    const testBoard = makeMove([...board], move, aiSymbol);
    const result = checkWinner(testBoard, winningConditions);
    if (result.winner === aiSymbol) {
      return move;
    }
  }

  // 2. Заблокувати виграш (перевіряємо ВСІ можливі ходи, навіть обмежені)
  const allMoves = board
    .map((cell, index) => cell === '' ? index : -1)
    .filter(index => index !== -1);

  for (const move of allMoves) {
    const testBoard = makeMove([...board], move, playerSymbol);
    const result = checkWinner(testBoard, winningConditions);
    if (result.winner === playerSymbol) {
      // Це критичне блокування - ігноруємо обмеження
      return move;
    }
  }

  // 3. Створити вилку
  if (config.useForkBlocking) {
    const forkMoves = [];
    for (const move of availableMoves) {
      const testBoard = makeMove([...board], move, aiSymbol);
      const forkCount = countForks(testBoard, aiSymbol, winningConditions);
      if (forkCount > 0) {
        const score = evaluatePosition(testBoard, boardSize, winningConditions, aiSymbol, playerSymbol, config, currentGameStyle);
        forkMoves.push({ move, forkCount, score });
      }
    }

    if (forkMoves.length > 0) {
      forkMoves.sort((a, b) => {
        if (a.forkCount !== b.forkCount) return b.forkCount - a.forkCount;
        return b.score - a.score;
      });
      return forkMoves[0].move;
    }

    // 4. Блокувати вилки противника (перевіряємо всі ходи)
    for (const move of allMoves) {
      const testBoard = makeMove([...board], move, playerSymbol);
      const forkCount = countForks(testBoard, playerSymbol, winningConditions);
      if (forkCount > 0) {
        return move; // Критичне блокування вилки
      }
    }
  }

  // 5. Найкращий позиційний хід з варіацією
  const scoredMoves = availableMoves.map(move => {
    const testBoard = makeMove([...board], move, aiSymbol);
    const score = evaluatePosition(testBoard, boardSize, winningConditions, aiSymbol, playerSymbol, config, currentGameStyle);
    return { move, score };
  }).sort((a, b) => b.score - a.score);

  // Використовуємо варіацію для вибору
  if (config.usePlayStyleVariation) {
    const selectedMove = selectBestMoveWithVariety(scoredMoves, currentGameStyle, config);
    if (selectedMove !== -1) return selectedMove;
  }

  return scoredMoves[0]?.move || availableMoves[0];
}

// 🔥 ГОЛОВНА ФУНКЦІЯ З ПОКРАЩЕНОЮ ЛОГІКОЮ
function getBestMove(board, boardSize, difficulty, aiSymbol, playerSymbol, randomness, restrictedCells = [], firstPlayer) {
  const config = getAIConfig(difficulty);
  const winningConditions = generateWinningConditions(boardSize);
  
  // 🔥 НОВИЙ КОД - вибір стилю гри
  if (config.usePlayStyleVariation) {
    styleChangeCounter++;
    
    // Змінюємо стиль з певною ймовірністю або на початку гри
    if (styleChangeCounter === 1 || Math.random() < config.playStyleChangeChance) {
      const oldStyle = currentGameStyle;
      currentGameStyle = getRandomPlayStyle();
      if (oldStyle !== currentGameStyle) {
        console.log(`🎨 AI змінює стиль з "${AI_PLAY_STYLES[oldStyle]?.name}" на "${AI_PLAY_STYLES[currentGameStyle]?.name}"`);
      }
    }
  }
  
  // Всі доступні ходи (без обмежень)
  const allAvailableMoves = board
    .map((cell, index) => cell === '' ? index : -1)
    .filter(index => index !== -1);
    
  if (allAvailableMoves.length === 0) return -1;

  // Доступні ходи з врахуванням обмежень
  let legalMoves = [...allAvailableMoves];
  
  if (config.useRestrictionHandling && boardSize === 4 && restrictedCells) {
    const currentRestricted = getRestrictedCells(board, boardSize, aiSymbol, firstPlayer);
    
    legalMoves = allAvailableMoves.filter(move => {
      if (!currentRestricted.includes(move)) return true;
      
      // Розумне ігнорування обмежень для критичних ходів
      if (config.useSmartRestrictionOverride) {
        return canOverrideRestriction(board, move, aiSymbol, winningConditions);
      }
      
      return false;
    });
  }

  console.log(`🤖 AI [${difficulty}] аналіз (${AI_PLAY_STYLES[currentGameStyle]?.name}):`, {
    boardSize,
    totalMoves: allAvailableMoves.length,
    legalMoves: legalMoves.length,
    restrictions: restrictedCells?.length || 0,
    useRestrictions: config.useRestrictionHandling,
    playStyle: currentGameStyle
  });

  // Випадковість тільки для легких рівнів
  if (config.randomnessPercent > 0 && Math.random() * 100 < config.randomnessPercent) {
    const randomMove = legalMoves.length > 0 ? legalMoves[Math.floor(Math.random() * legalMoves.length)] : allAvailableMoves[Math.floor(Math.random() * allAvailableMoves.length)];
    console.log(`🎲 Випадковий хід: ${randomMove}`);
    return randomMove;
  }

  // 🔥 ПРІОРИТЕТ 1: ЗАВЖДИ виграти
  for (const move of allAvailableMoves) {
    const testBoard = makeMove([...board], move, aiSymbol);
    const result = checkWinner(testBoard, winningConditions);
    if (result.winner === aiSymbol) {
      console.log(`🏆 Виграшний хід: ${move}`);
      return move;
    }
  }

  // 🔥 ПРІОРИТЕТ 1.5: ДЕБЮТНА КНИГА
  if (config.useOpeningBook) {
    const openingMove = getOpeningMove(board, boardSize, aiSymbol, firstPlayer);
    if (openingMove !== -1 && (legalMoves.includes(openingMove) || allAvailableMoves.includes(openingMove))) {
      console.log(`📖 Дебютний хід (${AI_PLAY_STYLES[currentGameStyle]?.name}): ${openingMove}`);
      return openingMove;
    }
  }

  // 🔥 ПРІОРИТЕТ 2: МНОЖИННЕ БЛОКУВАННЯ ЗАГРОЗ
  if (config.useMultipleThreatDetection) {
    const threats = detectMultipleThreats(board, boardSize, playerSymbol, winningConditions);
    console.log(`🚨 Знайдено загроз: ${threats.length}`);
    
    if (threats.length > 0) {
      // Блокуємо найвищий пріоритет
      const topThreat = threats[0];
      console.log(`🛡️ БЛОКУВАННЯ МНОЖИННОЇ ЗАГРОЗИ: ${topThreat.position}`);
      return topThreat.position;
    }
  }

  // 🔥 ПРІОРИТЕТ 2: ЗАВЖДИ заблокувати виграш (ігнорує обмеження)
  for (const move of allAvailableMoves) {
    const testBoard = makeMove([...board], move, playerSymbol);
    const result = checkWinner(testBoard, winningConditions);
    if (result.winner === playerSymbol) {
      console.log(`🛡️ Блокування виграшу: ${move} ${restrictedCells && restrictedCells.includes(move) ? '(ігнорує обмеження!)' : ''}`);
      return move;
    }
  }

  // 🔥 ПРІОРИТЕТ 3: Пошук форсованого виграшу
  if (config.useForcedWinSearch) {
    const forcedWin = findForcedWin(board, boardSize, aiSymbol, restrictedCells, config.forcedWinDepth, config);
    if (forcedWin !== -1) {
      console.log(`⚡ Форсований виграш: ${forcedWin}`);
      return forcedWin;
    }
  }

  // 🔥 ПРІОРИТЕТ 4: Мінімакс з адаптивною глибиною
  let maxDepth;
  
  if (typeof config.useMinimaxDepth === 'number') {
    maxDepth = config.useMinimaxDepth;
  } else if (boardSize === 3) {
    maxDepth = config.useMinimaxDepth.boardSize3;
  } else {
    const depthConfig = config.useMinimaxDepth.boardSize4;
    if (typeof depthConfig === 'number') {
      maxDepth = depthConfig;
    } else {
      const movesLeft = legalMoves.length;
      if (movesLeft >= 12) maxDepth = depthConfig.earlyGame;
      else if (movesLeft >= 6) maxDepth = depthConfig.midGame;
      else maxDepth = depthConfig.endGame;
    }
  }

  console.log(`🎯 Мінімакс глибина ${maxDepth} для ${difficulty} (ходів: ${legalMoves.length}, стиль: ${AI_PLAY_STYLES[currentGameStyle]?.name})`);
  
  // Очищення кешу
  if (positionCache.size > MAX_CACHE_SIZE * 0.9) {
    positionCache.clear();
    restrictionCache.clear();
    console.log('🧹 Очищено кеш');
  }
  
  const { move: minimaxMove } = minimaxWithRestrictions(
    board, boardSize, 0, maxDepth, true, aiSymbol, 
    restrictedCells, -Infinity, Infinity, config, firstPlayer
  );

  if (minimaxMove !== -1) {
    console.log(`🧠 Мінімакс хід (${AI_PLAY_STYLES[currentGameStyle]?.name}): ${minimaxMove}`);
    return minimaxMove;
  }

  // 🔥 ПРІОРИТЕТ 5: Стратегічний резервний хід
  const strategicMove = getStrategicMove(board, boardSize, aiSymbol, restrictedCells, config, firstPlayer);
  console.log(`📋 Стратегічний хід (${AI_PLAY_STYLES[currentGameStyle]?.name}): ${strategicMove}`);
  
  return strategicMove;
}

// 🔥 ПОКРАЩЕНИЙ ОБРОБНИК ПОВІДОМЛЕНЬ
self.onmessage = function(e) {
  const { board, boardSize, difficulty, aiSymbol, playerSymbol, randomness, restrictedCells, firstPlayer } = e.data;
  
  try {
    const moveCount = board.filter(cell => cell !== '').length;
    console.log(`🤖 AI Worker [${difficulty.toUpperCase()}] START:`, { 
      boardSize, 
      moveCount,
      aiSymbol,
      playerSymbol,
      firstPlayer,
      availableMoves: board.filter(cell => cell === '').length,
      restrictedCells: restrictedCells?.length || 0,
      currentStyle: AI_PLAY_STYLES[currentGameStyle]?.name || currentGameStyle
    });
    
    const startTime = Date.now();
    
    const move = getBestMove(board, boardSize, difficulty, aiSymbol, playerSymbol, randomness, restrictedCells, firstPlayer);
    
    const calculationTime = Date.now() - startTime;
    
    // Розрахунок оцінки позиції
    let evaluation = 0;
    if (move !== -1) {
      const winningConditions = generateWinningConditions(boardSize);
      const testBoard = makeMove([...board], move, aiSymbol);
      const config = getAIConfig(difficulty);
      evaluation = evaluatePosition(testBoard, boardSize, winningConditions, aiSymbol, playerSymbol, config, currentGameStyle);
    }
    
    console.log(`🤖 AI Worker [${difficulty.toUpperCase()}] FINISH:`, {
      calculationTime: `${calculationTime}мс`,
      move,
      evaluation: Math.round(evaluation),
      positionCache: positionCache.size,
      restrictionCache: restrictionCache.size,
      playStyle: AI_PLAY_STYLES[currentGameStyle]?.name || currentGameStyle
    });
    
    // Перевірка на валідність ходу
    if (move === -1 || board[move] !== '') {
      console.error(`🔥 ПОМИЛКА: Невалідний хід ${move}`, {
        boardState: board,
        restrictedCells,
        difficulty,
        playStyle: currentGameStyle
      });
    }
    
    self.postMessage({ 
      success: true, 
      move,
      calculationTime,
      evaluation: Math.round(evaluation),
      difficulty,
      playStyle: AI_PLAY_STYLES[currentGameStyle]?.name || currentGameStyle,
      cacheHits: positionCache.size + restrictionCache.size,
      debug: {
        boardSize,
        moveCount,
        restrictions: restrictedCells?.length || 0,
        style: currentGameStyle
      }
    });
    
  } catch (error) {
    console.error(`🔥 AI Worker [${difficulty?.toUpperCase() || 'UNKNOWN'}] ERROR:`, error);
    
    // Резервний простий хід
    const fallbackMove = board.findIndex(cell => cell === '');
    
    self.postMessage({ 
      success: false, 
      error: error.message,
      difficulty,
      playStyle: AI_PLAY_STYLES[currentGameStyle]?.name || currentGameStyle,
      fallbackMove: fallbackMove >= 0 ? fallbackMove : -1
    });
  }
};