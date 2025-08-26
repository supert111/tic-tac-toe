// 'use client';

// import { useState, useEffect } from 'react';
// import GameCell from './GameCell';
// import PlayerSetup from './PlayerSetup';
// import GameModeSelector from './GameModeSelector';
// import GameModal from './GameModal';

// type GameMode = 'classic' | 'pro';
// type Player = 'X' | 'O';

// export default function GameBoard() {
//   const [gameBoard, setGameBoard] = useState<string[]>([]);
//   const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
//   const [gameActive, setGameActive] = useState(true);
//   const [playerXName, setPlayerXName] = useState('Гравець 1');
//   const [playerOName, setPlayerOName] = useState('Гравець 2');
//   const [gameMode, setGameMode] = useState<GameMode>('classic');
//   const [boardSize, setBoardSize] = useState(3);
//   const [winningConditions, setWinningConditions] = useState<number[][]>([]);
//   const [showModal, setShowModal] = useState(false);
//   const [modalTitle, setModalTitle] = useState('');
//   const [modalMessage, setModalMessage] = useState('');
//   const [winningLine, setWinningLine] = useState<number[]>([]);

//   // Генеруємо комбінації для перемоги
//   const generateWinningConditions = (size: number): number[][] => {
//     const conditions: number[][] = [];
    
//     // Рядки
//     for (let row = 0; row < size; row++) {
//       for (let col = 0; col <= size - 3; col++) {
//         conditions.push([
//           row * size + col,
//           row * size + col + 1,
//           row * size + col + 2
//         ]);
//       }
//     }
    
//     // Стовпці
//     for (let col = 0; col < size; col++) {
//       for (let row = 0; row <= size - 3; row++) {
//         conditions.push([
//           row * size + col,
//           (row + 1) * size + col,
//           (row + 2) * size + col
//         ]);
//       }
//     }
    
//     // Діагоналі (зліва направо)
//     for (let row = 0; row <= size - 3; row++) {
//       for (let col = 0; col <= size - 3; col++) {
//         conditions.push([
//           row * size + col,
//           (row + 1) * size + col + 1,
//           (row + 2) * size + col + 2
//         ]);
//       }
//     }
    
//     // Діагоналі (справа наліво)
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
//   };

//   // Ініціалізація гри
//   useEffect(() => {
//     const totalCells = boardSize * boardSize;
//     setGameBoard(new Array(totalCells).fill(''));
//     setWinningConditions(generateWinningConditions(boardSize));
//     setWinningLine([]);
//   }, [boardSize]);

//   // Перевірка результату
//   const checkResult = (board: string[]) => {
//     let roundWon = false;
//     let winLine: number[] = [];

//     for (let i = 0; i < winningConditions.length; i++) {
//       const [a, b, c] = winningConditions[i];
//       if (board[a] && board[a] === board[b] && board[a] === board[c]) {
//         roundWon = true;
//         winLine = [a, b, c];
//         break;
//       }
//     }

//     if (roundWon) {
//       setWinningLine(winLine);
//       const winnerName = currentPlayer === 'X' ? playerXName : playerOName;
//       setGameActive(false);
//       setModalTitle('🎉 Перемога!');
//       setModalMessage(`Вітаємо ${winnerName} з перемогою в режимі ${gameMode === 'classic' ? 'Класичний' : 'Профі'}!`);
//       setShowModal(true);
//       return;
//     }

//     // Перевіряємо на нічию
//     if (!board.includes('')) {
//       setGameActive(false);
//       setModalTitle('🤝 Нічия!');
//       setModalMessage(`Гра завершилася внічию в режимі ${gameMode === 'classic' ? 'Класичний' : 'Профі'}!`);
//       setShowModal(true);
//       return;
//     }

//     // Змінюємо гравця
//     setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
//   };

//   // Обробка кліку по клітинці
//   const handleCellClick = (index: number) => {
//     if (gameBoard[index] !== '' || !gameActive) return;

//     const newBoard = [...gameBoard];
//     newBoard[index] = currentPlayer;
//     setGameBoard(newBoard);
    
//     setTimeout(() => checkResult(newBoard), 100);
//   };

//   // Скидання гри
//   const resetGame = () => {
//     const totalCells = boardSize * boardSize;
//     setGameBoard(new Array(totalCells).fill(''));
//     setCurrentPlayer('X');
//     setGameActive(true);
//     setWinningLine([]);
//     setShowModal(false);
//   };

//   // Зміна режиму гри
//   const handleGameModeChange = (mode: GameMode) => {
//     setGameMode(mode);
//     setBoardSize(mode === 'classic' ? 3 : 4);
//     resetGame();
//   };

//   const currentPlayerName = currentPlayer === 'X' ? playerXName : playerOName;

//   return (
//     // <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 shadow-2xl">
//     //   <h1 className="text-4xl font-bold mb-6 text-center">🎮 Хрестики-нулики</h1>
//     <div className="bg-white/10 backdrop-blur-md rounded-3xl p-4 shadow-2xl">
//       <h1 className="text-2xl font-bold mb-4 text-center">🎮 Хрестики-нулики</h1>

//       <GameModeSelector 
//         gameMode={gameMode} 
//         onModeChange={handleGameModeChange}
//       />
      
//       <PlayerSetup 
//         playerXName={playerXName}
//         playerOName={playerOName}
//         onPlayerXChange={setPlayerXName}
//         onPlayerOChange={setPlayerOName}
//       />
      
//       <div className="text-center mb-6">
//         <div className="text-xl">
//           Хід гравця: <span className="font-bold text-yellow-400">
//             {currentPlayer} ({currentPlayerName})
//           </span>
//         </div>
//       </div>
      
//       <div className={`
//         grid gap-2 mx-auto mb-6 bg-black/20 p-4 rounded-2xl relative
//         ${gameMode === 'classic' ? 'grid-cols-3' : 'grid-cols-4'}
//       `} style={{
//         width: gameMode === 'classic' ? '320px' : '340px'
//       }}>
//         {gameBoard.map((cell, index) => (
//           <GameCell
//             key={index}
//             value={cell}
//             onClick={() => handleCellClick(index)}
//             isWinning={winningLine.includes(index)}
//             disabled={!gameActive}
//           />
//         ))}
//       </div>
      
//       <div className="text-center">
//         <button 
//           onClick={resetGame}
//           className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 
//                      px-6 py-3 rounded-full font-bold text-white shadow-lg hover:shadow-xl 
//                      transform hover:-translate-y-1 transition-all duration-300"
//         >
//           🔄 Нова гра
//         </button>
//       </div>

//       <GameModal 
//         show={showModal}
//         title={modalTitle}
//         message={modalMessage}
//         onClose={() => setShowModal(false)}
//       />
//     </div>
//   );
// }















































// 'use client';

// import { useState, useEffect } from 'react';
// import GameCell from './GameCell';
// import PlayerSetup from './PlayerSetup';
// import GameModeSelector from './GameModeSelector';
// import GameModal from './GameModal';

// type GameMode = 'classic' | 'pro';
// type Player = 'X' | 'O';

// export default function GameBoard() {
//   const [gameBoard, setGameBoard] = useState<string[]>([]);
//   const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
//   const [gameActive, setGameActive] = useState(true);
//   const [playerXName, setPlayerXName] = useState('Гравець 1');
//   const [playerOName, setPlayerOName] = useState('Гравець 2');
//   const [gameMode, setGameMode] = useState<GameMode>('classic');
//   const [boardSize, setBoardSize] = useState(3);
//   const [winningConditions, setWinningConditions] = useState<number[][]>([]);
//   const [showModal, setShowModal] = useState(false);
//   const [modalTitle, setModalTitle] = useState('');
//   const [modalMessage, setModalMessage] = useState('');
//   const [winningLine, setWinningLine] = useState<number[]>([]);

//   // Генеруємо комбінації для перемоги
//   const generateWinningConditions = (size: number): number[][] => {
//     const conditions: number[][] = [];
    
//     // Рядки
//     for (let row = 0; row < size; row++) {
//       for (let col = 0; col <= size - 3; col++) {
//         conditions.push([
//           row * size + col,
//           row * size + col + 1,
//           row * size + col + 2
//         ]);
//       }
//     }
    
//     // Стовпці
//     for (let col = 0; col < size; col++) {
//       for (let row = 0; row <= size - 3; row++) {
//         conditions.push([
//           row * size + col,
//           (row + 1) * size + col,
//           (row + 2) * size + col
//         ]);
//       }
//     }
    
//     // Діагоналі (зліва направо)
//     for (let row = 0; row <= size - 3; row++) {
//       for (let col = 0; col <= size - 3; col++) {
//         conditions.push([
//           row * size + col,
//           (row + 1) * size + col + 1,
//           (row + 2) * size + col + 2
//         ]);
//       }
//     }
    
//     // Діагоналі (справа наліво)
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
//   };

//   // Ініціалізація гри
//   useEffect(() => {
//     const totalCells = boardSize * boardSize;
//     setGameBoard(new Array(totalCells).fill(''));
//     setWinningConditions(generateWinningConditions(boardSize));
//     setWinningLine([]);
//   }, [boardSize]);

//   // Перевірка результату
//   const checkResult = (board: string[]) => {
//     let roundWon = false;
//     let winLine: number[] = [];

//     for (let i = 0; i < winningConditions.length; i++) {
//       const [a, b, c] = winningConditions[i];
//       if (board[a] && board[a] === board[b] && board[a] === board[c]) {
//         roundWon = true;
//         winLine = [a, b, c];
//         break;
//       }
//     }

//     if (roundWon) {
//       setWinningLine(winLine);
//       const winnerName = currentPlayer === 'X' ? playerXName : playerOName;
//       setGameActive(false);
//       setModalTitle('🎉 Перемога!');
//       setModalMessage(`Вітаємо ${winnerName} з перемогою в режимі ${gameMode === 'classic' ? 'Класичний' : 'Профі'}!`);
//       setShowModal(true);
//       return;
//     }

//     // Перевіряємо на нічию
//     if (!board.includes('')) {
//       setGameActive(false);
//       setModalTitle('🤝 Нічия!');
//       setModalMessage(`Гра завершилася внічию в режимі ${gameMode === 'classic' ? 'Класичний' : 'Профі'}!`);
//       setShowModal(true);
//       return;
//     }

//     // Змінюємо гравця
//     setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
//   };

//   // Обробка кліку по клітинці
//   const handleCellClick = (index: number) => {
//     if (gameBoard[index] !== '' || !gameActive) return;

//     const newBoard = [...gameBoard];
//     newBoard[index] = currentPlayer;
//     setGameBoard(newBoard);
    
//     setTimeout(() => checkResult(newBoard), 100);
//   };

//   // Скидання гри
//   const resetGame = () => {
//     const totalCells = boardSize * boardSize;
//     setGameBoard(new Array(totalCells).fill(''));
//     setCurrentPlayer('X');
//     setGameActive(true);
//     setWinningLine([]);
//     setShowModal(false);
//   };

//   // Зміна режиму гри
//   const handleGameModeChange = (mode: GameMode) => {
//     setGameMode(mode);
//     setBoardSize(mode === 'classic' ? 3 : 4);
//     resetGame();
//   };

//   const currentPlayerName = currentPlayer === 'X' ? playerXName : playerOName;

//   return (
//     <div className="bg-white/10 backdrop-blur-md rounded-3xl p-4 lg:p-6 shadow-2xl">
//       <h1 className="text-2xl lg:text-3xl font-bold mb-4 text-center">🎮 Хрестики-нулики</h1>
      
//       <GameModeSelector 
//         gameMode={gameMode} 
//         onModeChange={handleGameModeChange}
//       />
      
//       <PlayerSetup 
//         playerXName={playerXName}
//         playerOName={playerOName}
//         onPlayerXChange={setPlayerXName}
//         onPlayerOChange={setPlayerOName}
//       />
      
//       <div className="text-center mb-4">
//         <div className="text-lg lg:text-xl">
//           Хід гравця: <span className="font-bold text-yellow-400">
//             {currentPlayer} ({currentPlayerName})
//           </span>
//         </div>
//       </div>
      
//       <div className={`
//         grid gap-2 mx-auto mb-4 bg-black/20 p-3 rounded-2xl relative
//         ${gameMode === 'classic' ? 'grid-cols-3' : 'grid-cols-4'}
//       `} style={{
//         width: gameMode === 'classic' ? '220px' : '280px'
//       }}>
//         {gameBoard.map((cell, index) => (
//           <GameCell
//             key={index}
//             value={cell}
//             onClick={() => handleCellClick(index)}
//             isWinning={winningLine.includes(index)}
//             disabled={!gameActive}
//           />
//         ))}
//       </div>
      
//       <div className="text-center">
//         <button 
//           onClick={resetGame}
//           className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 
//                      px-4 py-2 lg:px-6 lg:py-3 rounded-full font-bold text-white shadow-lg hover:shadow-xl 
//                      transform hover:-translate-y-1 transition-all duration-300"
//         >
//           🔄 Нова гра
//         </button>
//       </div>

//       <GameModal 
//         show={showModal}
//         title={modalTitle}
//         message={modalMessage}
//         onClose={() => setShowModal(false)}
//       />
//     </div>
//   );
// }















//перехід на таби АІ та ПВП

// 'use client';

// import { useState, useEffect } from 'react';
// import GameCell from './GameCell';
// import PlayerSetup from './modes/shared/PlayerSetup';
// import GameModeSelector from './GameModeSelector';
// import GameModal from './GameModal';

// type GameMode = 'classic' | 'pro';
// type Player = 'X' | 'O';

// export default function GameBoard() {
//   const [gameBoard, setGameBoard] = useState<string[]>([]);
//   const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
//   const [gameActive, setGameActive] = useState(true);
//   const [playerXName, setPlayerXName] = useState('Гравець 1');
//   const [playerOName, setPlayerOName] = useState('Гравець 2');
//   const [gameMode, setGameMode] = useState<GameMode>('classic');
//   const [boardSize, setBoardSize] = useState(3);
//   const [winningConditions, setWinningConditions] = useState<number[][]>([]);
//   const [showModal, setShowModal] = useState(false);
//   const [modalTitle, setModalTitle] = useState('');
//   const [modalMessage, setModalMessage] = useState('');
//   const [winningLine, setWinningLine] = useState<number[]>([]);

//   // Генеруємо комбінації для перемоги
//   const generateWinningConditions = (size: number): number[][] => {
//     const conditions: number[][] = [];
    
//     // Рядки
//     for (let row = 0; row < size; row++) {
//       for (let col = 0; col <= size - 3; col++) {
//         conditions.push([
//           row * size + col,
//           row * size + col + 1,
//           row * size + col + 2
//         ]);
//       }
//     }
    
//     // Стовпці
//     for (let col = 0; col < size; col++) {
//       for (let row = 0; row <= size - 3; row++) {
//         conditions.push([
//           row * size + col,
//           (row + 1) * size + col,
//           (row + 2) * size + col
//         ]);
//       }
//     }
    
//     // Діагоналі (зліва направо)
//     for (let row = 0; row <= size - 3; row++) {
//       for (let col = 0; col <= size - 3; col++) {
//         conditions.push([
//           row * size + col,
//           (row + 1) * size + col + 1,
//           (row + 2) * size + col + 2
//         ]);
//       }
//     }
    
//     // Діагоналі (справа наліво)
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
//   };

//   // Ініціалізація гри
//   useEffect(() => {
//     const totalCells = boardSize * boardSize;
//     setGameBoard(new Array(totalCells).fill(''));
//     setWinningConditions(generateWinningConditions(boardSize));
//     setWinningLine([]);
//   }, [boardSize]);

//   // Перевірка результату
//   const checkResult = (board: string[]) => {
//     let roundWon = false;
//     let winLine: number[] = [];

//     for (let i = 0; i < winningConditions.length; i++) {
//       const [a, b, c] = winningConditions[i];
//       if (board[a] && board[a] === board[b] && board[a] === board[c]) {
//         roundWon = true;
//         winLine = [a, b, c];
//         break;
//       }
//     }

//     if (roundWon) {
//       setWinningLine(winLine);
//       const winnerName = currentPlayer === 'X' ? playerXName : playerOName;
//       setGameActive(false);
//       setModalTitle('🎉 Перемога!');
//       setModalMessage(`Вітаємо ${winnerName} з перемогою в режимі ${gameMode === 'classic' ? 'Класичний' : 'Профі'}!`);
//       setShowModal(true);
//       return;
//     }

//     // Перевіряємо на нічию
//     if (!board.includes('')) {
//       setGameActive(false);
//       setModalTitle('🤝 Нічия!');
//       setModalMessage(`Гра завершилася внічию в режимі ${gameMode === 'classic' ? 'Класичний' : 'Профі'}!`);
//       setShowModal(true);
//       return;
//     }

//     // Змінюємо гравця
//     setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
//   };

//   // Обробка кліку по клітинці
//   const handleCellClick = (index: number) => {
//     if (gameBoard[index] !== '' || !gameActive) return;

//     const newBoard = [...gameBoard];
//     newBoard[index] = currentPlayer;
//     setGameBoard(newBoard);
    
//     setTimeout(() => checkResult(newBoard), 100);
//   };

//   // Скидання гри
//   const resetGame = () => {
//     const totalCells = boardSize * boardSize;
//     setGameBoard(new Array(totalCells).fill(''));
//     setCurrentPlayer('X');
//     setGameActive(true);
//     setWinningLine([]);
//     setShowModal(false);
//   };

//   // Зміна режиму гри
//   const handleGameModeChange = (mode: GameMode) => {
//     setGameMode(mode);
//     setBoardSize(mode === 'classic' ? 3 : 4);
//     resetGame();
//   };

//   const currentPlayerName = currentPlayer === 'X' ? playerXName : playerOName;

//   return (
//     <div className="bg-gradient-to-br from-gray-800/50 via-purple-800/50 to-gray-800/50 backdrop-blur-md rounded-3xl p-4 lg:p-6 shadow-2xl border border-purple-500/20">
//       <h1 className="text-2xl lg:text-3xl font-bold mb-4 text-center text-purple-100">🎮 Хрестики-нулики</h1>
      
//       <GameModeSelector 
//         gameMode={gameMode} 
//         onModeChange={handleGameModeChange}
//       />
      
//       <PlayerSetup 
//         playerXName={playerXName}
//         playerOName={playerOName}
//         onPlayerXChange={setPlayerXName}
//         onPlayerOChange={setPlayerOName}
//       />
      
//       <div className="text-center mb-4">
//         <div className="text-lg lg:text-xl text-purple-200">
//           Хід гравця: <span className="font-bold text-purple-300">
//             {currentPlayer} ({currentPlayerName})
//           </span>
//         </div>
//       </div>
      
//       <div className={`
//         grid gap-2 mx-auto mb-4 bg-gray-900/40 p-3 rounded-2xl relative border border-purple-400/20
//         ${gameMode === 'classic' ? 'grid-cols-3' : 'grid-cols-4'}
//       `} style={{
//         width: gameMode === 'classic' ? '220px' : '280px'
//       }}>
//         {gameBoard.map((cell, index) => (
//           <GameCell
//             key={index}
//             value={cell}
//             onClick={() => handleCellClick(index)}
//             isWinning={winningLine.includes(index)}
//             disabled={!gameActive}
//           />
//         ))}
//       </div>
      
//       <div className="text-center">
//         <button 
//           onClick={resetGame}
//           className="bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 
//                      px-4 py-2 lg:px-6 lg:py-3 rounded-full font-bold text-white shadow-lg hover:shadow-xl 
//                      transform hover:-translate-y-1 transition-all duration-300 border border-purple-400/30"
//         >
//           🔄 Нова гра
//         </button>
//       </div>

//       <GameModal 
//         show={showModal}
//         title={modalTitle}
//         message={modalMessage}
//         onClose={() => setShowModal(false)}
//       />
//     </div>
//   );
// }



































// 'use client';

// import { useState } from 'react';

// type GameTab = 'ai' | 'pvp';
// type PvPTab = 'create' | 'available';

// export default function GameBoard() {
//   const [activeTab, setActiveTab] = useState<GameTab>('ai');
//   const [pvpTab, setPvpTab] = useState<PvPTab>('create');

//   // Тимчасові компоненти-заглушки
//   const AIGameComponent = () => (
//     <div className="space-y-4">
//       <h3 className="text-xl font-bold text-purple-200 mb-4">🤖 Гра проти ШІ</h3>
      
//       {/* Вибір розміру дошки */}
//       <div className="bg-white/10 rounded-2xl p-4">
//         <h4 className="font-semibold mb-3 text-purple-200">📐 Розмір поля</h4>
//         <div className="flex gap-2">
//           <button className="flex-1 py-2 px-3 bg-purple-500/50 hover:bg-purple-500/70 rounded-xl transition-all">
//             3×3
//           </button>
//           <button className="flex-1 py-2 px-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all">
//             4×4
//           </button>
//         </div>
//       </div>

//       {/* Вибір фігури */}
//       <div className="bg-white/10 rounded-2xl p-4">
//         <h4 className="font-semibold mb-3 text-purple-200">⭕ Ваша фігура</h4>
//         <div className="flex gap-2">
//           <button className="flex-1 py-2 px-3 bg-purple-500/50 hover:bg-purple-500/70 rounded-xl transition-all">
//             X (хрестик)
//           </button>
//           <button className="flex-1 py-2 px-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all">
//             O (нулик)
//           </button>
//         </div>
//       </div>

//       {/* Перший хід */}
//       <div className="bg-white/10 rounded-2xl p-4">
//         <h4 className="font-semibold mb-3 text-purple-200">🎯 Перший хід</h4>
//         <div className="space-y-2">
//           <label className="flex items-center gap-2 cursor-pointer">
//             <input type="radio" name="firstMove" value="player" className="text-purple-500" defaultChecked />
//             <span>🙋‍♂️ Гравець</span>
//           </label>
//           <label className="flex items-center gap-2 cursor-pointer">
//             <input type="radio" name="firstMove" value="ai" className="text-purple-500" />
//             <span>🤖 Комп'ютер</span>
//           </label>
//           <label className="flex items-center gap-2 cursor-pointer">
//             <input type="radio" name="firstMove" value="random" className="text-purple-500" />
//             <span>🎲 Випадково</span>
//           </label>
//         </div>
//       </div>

//       {/* Складність */}
//       <div className="bg-white/10 rounded-2xl p-4">
//         <h4 className="font-semibold mb-3 text-purple-200">⚡ Складність</h4>
//         <div className="flex gap-2">
//           <button className="flex-1 py-2 px-3 bg-green-500/50 hover:bg-green-500/70 rounded-xl transition-all text-sm">
//             😊 Легка
//           </button>
//           <button className="flex-1 py-2 px-3 bg-yellow-500/50 hover:bg-yellow-500/70 rounded-xl transition-all text-sm">
//             😐 Середня
//           </button>
//           <button className="flex-1 py-2 px-3 bg-red-500/50 hover:bg-red-500/70 rounded-xl transition-all text-sm">
//             😤 Важка
//           </button>
//         </div>
//       </div>

//       {/* Кнопка початку гри */}
//       <button className="w-full bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 py-3 px-6 rounded-2xl font-bold text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
//         🎮 ПОЧАТИ ГРУ
//       </button>
//     </div>
//   );

//   const PvPCreateComponent = () => (
//     <div className="space-y-4">
//       <h3 className="text-xl font-bold text-purple-200 mb-4">🆚 Створити гру</h3>
      
//       {/* Вибір розміру дошки */}
//       <div className="bg-white/10 rounded-2xl p-4">
//         <h4 className="font-semibold mb-3 text-purple-200">📐 Розмір поля</h4>
//         <div className="flex gap-2">
//           <button className="flex-1 py-2 px-3 bg-purple-500/50 hover:bg-purple-500/70 rounded-xl transition-all">
//             3×3
//           </button>
//           <button className="flex-1 py-2 px-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all">
//             4×4
//           </button>
//         </div>
//       </div>

//       {/* Вибір фігури */}
//       <div className="bg-white/10 rounded-2xl p-4">
//         <h4 className="font-semibold mb-3 text-purple-200">⭕ Ваша фігура</h4>
//         <div className="flex gap-2">
//           <button className="flex-1 py-2 px-3 bg-purple-500/50 hover:bg-purple-500/70 rounded-xl transition-all">
//             X (хрестик)
//           </button>
//           <button className="flex-1 py-2 px-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all">
//             O (нулик)
//           </button>
//         </div>
//       </div>

//       {/* Перший хід */}
//       <div className="bg-white/10 rounded-2xl p-4">
//         <h4 className="font-semibold mb-3 text-purple-200">🎯 Перший хід</h4>
//         <div className="space-y-2">
//           <label className="flex items-center gap-2 cursor-pointer">
//             <input type="checkbox" className="text-purple-500" defaultChecked />
//             <span>🎲 Випадково</span>
//           </label>
//           <label className="flex items-center gap-2 cursor-pointer">
//             <input type="checkbox" className="text-purple-500" />
//             <span>🙋‍♂️ Я перший</span>
//           </label>
//           <label className="flex items-center gap-2 cursor-pointer">
//             <input type="checkbox" className="text-purple-500" />
//             <span>👤 Опонент перший</span>
//           </label>
//         </div>
//       </div>

//       {/* Ставка */}
//       <div className="bg-white/10 rounded-2xl p-4">
//         <h4 className="font-semibold mb-3 text-purple-200">💰 Ставка</h4>
//         <div className="space-y-2">
//           <label className="flex items-center gap-2 cursor-pointer">
//             <input type="checkbox" className="text-purple-500" defaultChecked />
//             <span>🆓 Без ставки</span>
//           </label>
//           <div className="flex items-center gap-2">
//             <input type="checkbox" className="text-purple-500" />
//             <input 
//               type="number" 
//               placeholder="Введіть суму" 
//               className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50"
//             />
//             <span className="text-sm text-white/70">XTZ</span>
//           </div>
//         </div>
//       </div>

//       {/* Доступ */}
//       <div className="bg-white/10 rounded-2xl p-4">
//         <h4 className="font-semibold mb-3 text-purple-200">🔒 Доступ</h4>
//         <div className="space-y-2">
//           <label className="flex items-center gap-2 cursor-pointer">
//             <input type="checkbox" className="text-purple-500" defaultChecked />
//             <span>🌐 Публічна</span>
//           </label>
//           <label className="flex items-center gap-2 cursor-pointer">
//             <input type="checkbox" className="text-purple-500" />
//             <span>🔐 Приватна</span>
//           </label>
//         </div>
//       </div>

//       {/* Кнопка створення */}
//       <button className="w-full bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 py-3 px-6 rounded-2xl font-bold text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
//         🔄 СТВОРИТИ ГРУ
//       </button>

//       {/* Поточна гра */}
//       <div className="bg-white/10 rounded-2xl p-4 border-l-4 border-purple-500">
//         <h4 className="font-semibold mb-2 text-purple-200">🎮 Поточна гра</h4>
//         <p className="text-sm text-white/70 mb-3">Хід гравця: <span className="font-bold text-purple-300">X (Ваше ім'я)</span></p>
        
//         {/* Тут буде ігрове поле */}
//         <div className="bg-gray-900/40 p-3 rounded-xl">
//           <div className="grid grid-cols-3 gap-2 w-48 mx-auto">
//             {Array.from({length: 9}).map((_, i) => (
//               <button 
//                 key={i} 
//                 className="aspect-square bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center text-2xl font-bold transition-all"
//               >
//                 {/* Тимчасово пусті клітинки */}
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   const PvPAvailableComponent = () => (
//     <div className="text-center py-8">
//       <div className="text-4xl mb-4">🔗</div>
//       <h3 className="text-xl font-bold text-purple-200 mb-2">Доступні ігри</h3>
//       <p className="text-white/60 mb-4">Цей розділ буде в лівій панелі</p>
//       <div className="text-sm text-white/40">
//         Тут буде посилання на ліву панель<br/>
//         з фільтром та списком доступних ігор
//       </div>
//     </div>
//   );

//   return (
//     <div className="bg-gradient-to-br from-gray-800/50 via-purple-800/50 to-gray-800/50 backdrop-blur-md rounded-3xl p-4 lg:p-6 shadow-2xl border border-purple-500/20">
//       <h1 className="text-2xl lg:text-3xl font-bold mb-6 text-center text-purple-100">🎮 Хрестики-нулики</h1>
      
//       {/* Головні таби AI/PvP */}
//       <div className="flex gap-2 mb-6 bg-white/10 rounded-2xl p-2">
//         <button
//           onClick={() => setActiveTab('ai')}
//           className={`
//             flex-1 py-3 px-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2
//             ${activeTab === 'ai'
//               ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg'
//               : 'text-white/70 hover:text-white hover:bg-white/10'
//             }
//           `}
//         >
//           🤖 AI
//         </button>
//         <button
//           onClick={() => setActiveTab('pvp')}
//           className={`
//             flex-1 py-3 px-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2
//             ${activeTab === 'pvp'
//               ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
//               : 'text-white/70 hover:text-white hover:bg-white/10'
//             }
//           `}
//         >
//           🆚 PvP
//         </button>
//       </div>

//       {/* PvP підтаби */}
//       {activeTab === 'pvp' && (
//         <div className="flex gap-2 mb-6 bg-white/5 rounded-xl p-1">
//           <button
//             onClick={() => setPvpTab('create')}
//             className={`
//               flex-1 py-2 px-3 rounded-lg font-medium transition-all duration-300 text-sm
//               ${pvpTab === 'create'
//                 ? 'bg-white/20 text-white'
//                 : 'text-white/60 hover:text-white hover:bg-white/10'
//               }
//             `}
//           >
//             ▌ Створити нову гру ▌
//           </button>
//           <button
//             onClick={() => setPvpTab('available')}
//             className={`
//               flex-1 py-2 px-3 rounded-lg font-medium transition-all duration-300 text-sm
//               ${pvpTab === 'available'
//                 ? 'bg-white/20 text-white'
//                 : 'text-white/60 hover:text-white hover:bg-white/10'
//               }
//             `}
//           >
//             ▌ Доступні ігри (3) ▌
//           </button>
//         </div>
//       )}

//       {/* Контент залежно від активного табу */}
//       <div className="min-h-[400px]">
//         {activeTab === 'ai' && <AIGameComponent />}
//         {activeTab === 'pvp' && pvpTab === 'create' && <PvPCreateComponent />}
//         {activeTab === 'pvp' && pvpTab === 'available' && <PvPAvailableComponent />}
//       </div>
//     </div>
//   );
// }






////////////////////////////////////////////////////////змінюю центральний блок з табами

// 'use client';

// import { useState, useEffect } from 'react';

// type GameTab = 'create-game' | 'create-tournament' | 'available-games';
// type GameMode = 'ai' | 'pvp';
// type BoardSize = '3x3' | '4x4';
// type PlayerSymbol = 'X' | 'O';
// type FirstMove = 'player' | 'ai' | 'random';
// type Difficulty = 'easy' | 'medium' | 'hard';
// type GameAccess = 'public' | 'private';

// interface GameState {
//   board: string[];
//   currentPlayer: string;
//   gameActive: boolean;
// }

// export default function GameBoard() {
//   const [activeTab, setActiveTab] = useState<GameTab>('create-game');
//   const [gameMode, setGameMode] = useState<GameMode>('ai');
  
//   // Налаштування гри
//   const [boardSize, setBoardSize] = useState<BoardSize>('3x3');
//   const [playerSymbol, setPlayerSymbol] = useState<PlayerSymbol>('X');
//   const [firstMove, setFirstMove] = useState<FirstMove>('random');
//   const [difficulty, setDifficulty] = useState<Difficulty>('medium');
//   const [hasStake, setHasStake] = useState(false);
//   const [stakeAmount, setStakeAmount] = useState('');
//   const [gameAccess, setGameAccess] = useState<GameAccess>('public');
  
//   // Стан гри
//   const [gameState, setGameState] = useState<GameState>({
//     board: Array(9).fill(''),
//     currentPlayer: 'X',
//     gameActive: true
//   });
  
//   // Таймер ходу
//   const [timeLeft, setTimeLeft] = useState(15);
//   const [timerActive, setTimerActive] = useState(true);

//   // Таймер
//   useEffect(() => {
//     if (!timerActive || timeLeft === 0) return;
    
//     const timer = setInterval(() => {
//       setTimeLeft(prev => {
//         if (prev <= 1) {
//           setTimerActive(false);
//           return 15;
//         }
//         return prev - 1;
//       });
//     }, 1000);
    
//     return () => clearInterval(timer);
//   }, [timerActive, timeLeft]);

//   // Функції для роботи з ігровим полем
//   const handleCellClick = (index: number) => {
//     if (gameState.board[index] || !gameState.gameActive) return;
    
//     const newBoard = [...gameState.board];
//     newBoard[index] = gameState.currentPlayer;
    
//     setGameState({
//       ...gameState,
//       board: newBoard,
//       currentPlayer: gameState.currentPlayer === 'X' ? 'O' : 'X'
//     });
    
//     setTimeLeft(15);
//   };

//   const resetGame = () => {
//     setGameState({
//       board: Array(9).fill(''),
//       currentPlayer: 'X',
//       gameActive: true
//     });
//     setTimeLeft(15);
//     setTimerActive(true);
//   };

//   // Компоненти табів
//   const CreateGameTab = () => (
//     <div className="space-y-4">
//       {/* Режим AI/PvP */}
//       <div className="flex gap-2 mb-4">
//         <button
//           onClick={() => setGameMode('ai')}
//           className={`flex-1 py-2 px-3 rounded-lg font-medium text-sm transition-all ${
//             gameMode === 'ai'
//               ? 'bg-purple-600 text-white'
//               : 'bg-white/20 text-white/70 hover:bg-white/30'
//           }`}
//         >
//           🤖 AI
//         </button>
//         <button
//           onClick={() => setGameMode('pvp')}
//           className={`flex-1 py-2 px-3 rounded-lg font-medium text-sm transition-all ${
//             gameMode === 'pvp'
//               ? 'bg-purple-600 text-white'
//               : 'bg-white/20 text-white/70 hover:bg-white/30'
//           }`}
//         >
//           ⚔️ PvP
//         </button>
//       </div>

//       {/* Назва гри */}
//       <div className="text-center text-lg font-semibold mb-4 flex items-center justify-center gap-2">
//         🎮 Хрестики-нулики
//       </div>

//       {/* Ігрове поле */}
//       <div className="bg-white/10 rounded-xl p-2 mb-4">
//         <div className="grid grid-cols-3 gap-1 w-48 mx-auto">
//           {gameState.board.map((cell, index) => (
//             <button
//               key={index}
//               onClick={() => handleCellClick(index)}
//               className="aspect-square bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center text-xl font-bold transition-all"
//             >
//               {cell}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Таймер ходу */}
//       <div className="flex items-center gap-3 bg-white/10 rounded-lg p-2 mb-4">
//         <span className="text-sm font-medium">Ваш хід:</span>
//         <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
//           <div 
//             className={`h-full rounded-full transition-all duration-1000 ${
//               timeLeft <= 5 ? 'bg-red-500' : timeLeft <= 10 ? 'bg-yellow-500' : 'bg-green-500'
//             }`}
//             style={{ width: `${(timeLeft / 15) * 100}%` }}
//           />
//         </div>
//         <span className="text-sm font-semibold min-w-[25px] text-center">{timeLeft}</span>
//       </div>

//       {/* Компактні налаштування */}
//       <div className="space-y-3">
//         {/* Розмір поля */}
//         <div className="flex justify-between items-center">
//           <span className="text-sm font-medium opacity-90">Розмір:</span>
//           <div className="flex gap-1">
//             <button
//               onClick={() => setBoardSize('3x3')}
//               className={`px-3 py-1 text-sm rounded-md font-medium transition-all ${
//                 boardSize === '3x3'
//                   ? 'bg-purple-600 text-white'
//                   : 'bg-white/20 text-white/70 hover:bg-white/30'
//               }`}
//             >
//               3×3
//             </button>
//             <button
//               onClick={() => setBoardSize('4x4')}
//               className={`px-3 py-1 text-sm rounded-md font-medium transition-all ${
//                 boardSize === '4x4'
//                   ? 'bg-purple-600 text-white'
//                   : 'bg-white/20 text-white/70 hover:bg-white/30'
//               }`}
//             >
//               4×4
//             </button>
//           </div>
//         </div>

//         {/* Фігура */}
//         <div className="flex justify-between items-center">
//           <span className="text-sm font-medium opacity-90">Фігура:</span>
//           <div className="flex gap-1">
//             <button
//               onClick={() => setPlayerSymbol('X')}
//               className={`px-3 py-1 text-sm rounded-md font-medium transition-all ${
//                 playerSymbol === 'X'
//                   ? 'bg-purple-600 text-white'
//                   : 'bg-white/20 text-white/70 hover:bg-white/30'
//               }`}
//             >
//               X
//             </button>
//             <button
//               onClick={() => setPlayerSymbol('O')}
//               className={`px-3 py-1 text-sm rounded-md font-medium transition-all ${
//                 playerSymbol === 'O'
//                   ? 'bg-purple-600 text-white'
//                   : 'bg-white/20 text-white/70 hover:bg-white/30'
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
//               <span className="text-sm font-medium opacity-90">Перший хід:</span>
//               <div className="flex gap-1">
//                 <button
//                   onClick={() => setFirstMove('player')}
//                   className={`px-2 py-1 text-xs rounded-md font-medium transition-all ${
//                     firstMove === 'player'
//                       ? 'bg-purple-600 text-white'
//                       : 'bg-white/20 text-white/70 hover:bg-white/30'
//                   }`}
//                 >
//                   Я
//                 </button>
//                 <button
//                   onClick={() => setFirstMove('ai')}
//                   className={`px-2 py-1 text-xs rounded-md font-medium transition-all ${
//                     firstMove === 'ai'
//                       ? 'bg-purple-600 text-white'
//                       : 'bg-white/20 text-white/70 hover:bg-white/30'
//                   }`}
//                 >
//                   AI
//                 </button>
//                 <button
//                   onClick={() => setFirstMove('random')}
//                   className={`px-2 py-1 text-xs rounded-md font-medium transition-all ${
//                     firstMove === 'random'
//                       ? 'bg-purple-600 text-white'
//                       : 'bg-white/20 text-white/70 hover:bg-white/30'
//                   }`}
//                 >
//                   Випадково
//                 </button>
//               </div>
//             </div>

//             <div className="flex justify-between items-center">
//               <span className="text-sm font-medium opacity-90">Складність:</span>
//               <div className="flex gap-1">
//                 <button
//                   onClick={() => setDifficulty('easy')}
//                   className={`px-2 py-1 text-xs rounded-md font-medium transition-all ${
//                     difficulty === 'easy'
//                       ? 'bg-green-600 text-white'
//                       : 'bg-white/20 text-white/70 hover:bg-white/30'
//                   }`}
//                 >
//                   Легка
//                 </button>
//                 <button
//                   onClick={() => setDifficulty('medium')}
//                   className={`px-2 py-1 text-xs rounded-md font-medium transition-all ${
//                     difficulty === 'medium'
//                       ? 'bg-yellow-600 text-white'
//                       : 'bg-white/20 text-white/70 hover:bg-white/30'
//                   }`}
//                 >
//                   Середня
//                 </button>
//                 <button
//                   onClick={() => setDifficulty('hard')}
//                   className={`px-2 py-1 text-xs rounded-md font-medium transition-all ${
//                     difficulty === 'hard'
//                       ? 'bg-red-600 text-white'
//                       : 'bg-white/20 text-white/70 hover:bg-white/30'
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
//               <span className="text-sm font-medium opacity-90">Перший хід:</span>
//               <div className="flex gap-1">
//                 <button
//                   onClick={() => setFirstMove('player')}
//                   className={`px-2 py-1 text-xs rounded-md font-medium transition-all ${
//                     firstMove === 'player'
//                       ? 'bg-purple-600 text-white'
//                       : 'bg-white/20 text-white/70 hover:bg-white/30'
//                   }`}
//                 >
//                   Я перший
//                 </button>
//                 <button
//                   onClick={() => setFirstMove('random')}
//                   className={`px-2 py-1 text-xs rounded-md font-medium transition-all ${
//                     firstMove === 'random'
//                       ? 'bg-purple-600 text-white'
//                       : 'bg-white/20 text-white/70 hover:bg-white/30'
//                   }`}
//                 >
//                   Випадково
//                 </button>
//               </div>
//             </div>

//             {/* Ставка */}
//             <div className="flex justify-between items-center">
//               <span className="text-sm font-medium opacity-90">Ставка:</span>
//               <div className="flex gap-2 items-center">
//                 <label className="flex items-center gap-1 cursor-pointer text-xs">
//                   <input
//                     type="radio"
//                     name="stake"
//                     checked={!hasStake}
//                     onChange={() => setHasStake(false)}
//                     className="w-3 h-3"
//                   />
//                   <span>Без ставки</span>
//                 </label>
//                 <label className="flex items-center gap-1 cursor-pointer text-xs">
//                   <input
//                     type="radio"
//                     name="stake"
//                     checked={hasStake}
//                     onChange={() => setHasStake(true)}
//                     className="w-3 h-3"
//                   />
//                   <span>Зі ставкою</span>
//                 </label>
//               </div>
//             </div>

//             {hasStake && (
//               <div className="flex justify-between items-center">
//                 <span className="text-sm font-medium opacity-90">Сума:</span>
//                 <input
//                   type="number"
//                   value={stakeAmount}
//                   onChange={(e) => setStakeAmount(e.target.value)}
//                   placeholder="0.01"
//                   step="0.01"
//                   min="0.01"
//                   className="w-20 px-2 py-1 text-xs bg-white/10 border border-white/20 rounded-md text-white placeholder-white/50"
//                 />
//               </div>
//             )}

//             {/* Доступ */}
//             <div className="flex justify-between items-center">
//               <span className="text-sm font-medium opacity-90">Доступ:</span>
//               <div className="flex gap-2 items-center">
//                 <label className="flex items-center gap-1 cursor-pointer text-xs">
//                   <input
//                     type="radio"
//                     name="access"
//                     checked={gameAccess === 'public'}
//                     onChange={() => setGameAccess('public')}
//                     className="w-3 h-3"
//                   />
//                   <span>Публічна</span>
//                 </label>
//                 <label className="flex items-center gap-1 cursor-pointer text-xs">
//                   <input
//                     type="radio"
//                     name="access"
//                     checked={gameAccess === 'private'}
//                     onChange={() => setGameAccess('private')}
//                     className="w-3 h-3"
//                   />
//                   <span>Приватна</span>
//                 </label>
//               </div>
//             </div>
//           </>
//         )}
//       </div>

//       {/* Кнопка старту */}
//       <button
//         onClick={resetGame}
//         className="w-full bg-purple-600 hover:bg-purple-700 py-3 px-4 rounded-xl font-semibold text-white transition-all duration-300 hover:-translate-y-0.5"
//       >
//         🎮 ПОЧАТИ ГРУ
//       </button>
//     </div>
//   );

//   const CreateTournamentTab = () => (
//     <div className="space-y-4">
//       <div className="text-center text-lg font-semibold mb-4 flex items-center justify-center gap-2">
//         🏆 Новий турнір
//       </div>

//       <div className="space-y-3">
//         <div>
//           <label className="block text-sm font-medium opacity-90 mb-1">Назва турніру</label>
//           <input
//             type="text"
//             placeholder="Введіть назву турніру"
//             className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 text-sm"
//           />
//         </div>

//         <div className="flex justify-between items-center">
//           <span className="text-sm font-medium opacity-90">Учасники:</span>
//           <div className="flex gap-1">
//             {['4', '8', '16'].map((count) => (
//               <button
//                 key={count}
//                 className="px-3 py-1 text-sm rounded-md font-medium bg-purple-600 text-white first:bg-purple-600 bg-white/20 text-white/70 hover:bg-white/30 transition-all"
//               >
//                 {count}
//               </button>
//             ))}
//           </div>
//         </div>

//         <div>
//           <label className="block text-sm font-medium opacity-90 mb-1">Призовий фонд (XTZ)</label>
//           <input
//             type="number"
//             placeholder="0.00"
//             step="0.01"
//             min="0"
//             className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 text-sm"
//           />
//         </div>

//         <div className="flex justify-between items-center">
//           <span className="text-sm font-medium opacity-90">Розмір:</span>
//           <div className="flex gap-1">
//             <button className="px-3 py-1 text-sm rounded-md font-medium bg-purple-600 text-white transition-all">
//               3×3
//             </button>
//             <button className="px-3 py-1 text-sm rounded-md font-medium bg-white/20 text-white/70 hover:bg-white/30 transition-all">
//               4×4
//             </button>
//           </div>
//         </div>
//       </div>

//       <button className="w-full bg-purple-600 hover:bg-purple-700 py-3 px-4 rounded-xl font-semibold text-white transition-all duration-300 hover:-translate-y-0.5">
//         🏆 СТВОРИТИ ТУРНІР
//       </button>
//     </div>
//   );

//   const AvailableGamesTab = () => (
//     <div className="space-y-4">
//       <div className="text-center text-lg font-semibold mb-4 flex items-center justify-center gap-2">
//         📋 Доступні ігри
//       </div>

//       <div className="space-y-3 max-h-96 overflow-y-auto">
//         {/* Гра проти AI */}
//         <div className="bg-white/10 rounded-xl p-3 hover:bg-white/15 transition-all">
//           <div className="flex justify-between items-center mb-2">
//             <span className="font-semibold text-sm">Гра проти AI</span>
//             <span className="bg-green-600 text-white px-2 py-0.5 rounded text-xs font-medium">
//               Активна
//             </span>
//           </div>
//           <div className="text-xs text-white/70 mb-3">
//             3×3 • Важка складність • Ваш хід
//           </div>
//           <button className="w-full bg-purple-600 hover:bg-purple-700 py-2 px-3 rounded-lg font-medium text-white text-sm transition-all hover:-translate-y-0.5">
//             Продовжити
//           </button>
//         </div>

//         {/* PvP зі ставкою */}
//         <div className="bg-white/10 rounded-xl p-3 hover:bg-white/15 transition-all">
//           <div className="flex justify-between items-center mb-2">
//             <span className="font-semibold text-sm">Гравець123</span>
//             <span className="bg-yellow-600 text-white px-2 py-0.5 rounded text-xs font-medium">
//               5.0 XTZ
//             </span>
//           </div>
//           <div className="text-xs text-white/70 mb-3">
//             3×3 • PvP • Зі ставкою
//           </div>
//           <button className="w-full bg-purple-600 hover:bg-purple-700 py-2 px-3 rounded-lg font-medium text-white text-sm transition-all hover:-translate-y-0.5">
//             Приєднатися
//           </button>
//         </div>

//         {/* Турнір */}
//         <div className="bg-white/10 rounded-xl p-3 hover:bg-white/15 transition-all">
//           <div className="flex justify-between items-center mb-2">
//             <span className="font-semibold text-sm">Весняний турнір</span>
//             <span className="bg-purple-600 text-white px-2 py-0.5 rounded text-xs font-medium">
//               12/16
//             </span>
//           </div>
//           <div className="text-xs text-white/70 mb-3">
//             Турнір • Призовий фонд: 100 XTZ
//           </div>
//           <button className="w-full bg-purple-600 hover:bg-purple-700 py-2 px-3 rounded-lg font-medium text-white text-sm transition-all hover:-translate-y-0.5">
//             Приєднатися
//           </button>
//         </div>

//         {/* Швидка гра */}
//         <div className="bg-white/10 rounded-xl p-3 hover:bg-white/15 transition-all">
//           <div className="flex justify-between items-center mb-2">
//             <span className="font-semibold text-sm">Швидка гра</span>
//             <span className="bg-blue-600 text-white px-2 py-0.5 rounded text-xs font-medium">
//               Очікує
//             </span>
//           </div>
//           <div className="text-xs text-white/70 mb-3">
//             4×4 • AI • Легка складність
//           </div>
//           <button className="w-full bg-purple-600 hover:bg-purple-700 py-2 px-3 rounded-lg font-medium text-white text-sm transition-all hover:-translate-y-0.5">
//             Приєднатися
//           </button>
//         </div>
//       </div>
//     </div>
//   );

//   return (
//     <div className="bg-gradient-to-br from-gray-800/50 via-purple-800/50 to-gray-800/50 backdrop-blur-md rounded-3xl p-4 lg:p-6 shadow-2xl border border-purple-500/20">
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








//збільшив шрифт
//src\app\components\game\GameBoard.tsx
'use client';

import { useState, useEffect } from 'react';

type GameTab = 'create-game' | 'create-tournament' | 'available-games';
type GameMode = 'ai' | 'pvp';
type BoardSize = '3x3' | '4x4';
type PlayerSymbol = 'X' | 'O';
type FirstMove = 'player' | 'ai' | 'random';
type Difficulty = 'easy' | 'medium' | 'hard';
type GameAccess = 'public' | 'private';

interface GameState {
  board: string[];
  currentPlayer: string;
  gameActive: boolean;
}

export default function GameBoard() {
  const [activeTab, setActiveTab] = useState<GameTab>('create-game');
  const [gameMode, setGameMode] = useState<GameMode>('ai');
  
  // Налаштування гри
  const [boardSize, setBoardSize] = useState<BoardSize>('3x3');
  const [playerSymbol, setPlayerSymbol] = useState<PlayerSymbol>('X');
  const [firstMove, setFirstMove] = useState<FirstMove>('random');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [hasStake, setHasStake] = useState(false);
  const [stakeAmount, setStakeAmount] = useState('');
  const [gameAccess, setGameAccess] = useState<GameAccess>('public');
  
  // Стан гри
  const [gameState, setGameState] = useState<GameState>({
    board: Array(9).fill(''),
    currentPlayer: 'X',
    gameActive: true
  });
  
  // Таймер ходу
  const [timeLeft, setTimeLeft] = useState(22);
  const [timerActive, setTimerActive] = useState(true);

  // Таймер
  useEffect(() => {
    if (!timerActive || timeLeft === 0) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setTimerActive(false);
          return 22;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [timerActive, timeLeft]);

  // Функції для роботи з ігровим полем
  const handleCellClick = (index: number) => {
    if (gameState.board[index] || !gameState.gameActive) return;
    
    const newBoard = [...gameState.board];
    newBoard[index] = gameState.currentPlayer;
    
    setGameState({
      ...gameState,
      board: newBoard,
      currentPlayer: gameState.currentPlayer === 'X' ? 'O' : 'X'
    });
    
    setTimeLeft(22);
  };

  const resetGame = () => {
    setGameState({
      board: Array(9).fill(''),
      currentPlayer: 'X',
      gameActive: true
    });
    setTimeLeft(22);
    setTimerActive(true);
  };

  // Компоненти табів
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
          🤖 AI
        </button>
        <button
          onClick={() => setGameMode('pvp')}
          className={`flex-1 py-3 px-4 rounded-xl font-semibold text-base transition-all ${
            gameMode === 'pvp'
              ? 'bg-purple-600 text-white shadow-lg'
              : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
          }`}
        >
          ⚔️ PvP
        </button>
      </div>

      {/* Назва гри */}
      <div className="text-center text-xl font-semibold mb-6 flex items-center justify-center gap-2">
        🎮 Хрестики-нулики
      </div>

      {/* Ігрове поле */}
      <div className="bg-white/10 rounded-xl p-4 mb-6">
        <div className="grid grid-cols-3 gap-2 w-64 mx-auto">
          {gameState.board.map((cell, index) => (
            <button
              key={index}
              onClick={() => handleCellClick(index)}
              className="aspect-square bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center text-2xl font-bold transition-all hover:scale-105"
            >
              {cell}
            </button>
          ))}
        </div>
      </div>

      {/* Таймер ходу */}
      <div className="flex items-center gap-3 bg-white/10 rounded-xl p-3 mb-6">
        <span className="text-base font-medium">Ваш хід:</span>
        <div className="flex-1 h-3 bg-white/20 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-1000 ${
              timeLeft <= 7 ? 'bg-red-500' : timeLeft <= 15 ? 'bg-yellow-500' : 'bg-green-500'
            }`}
            style={{ width: `${(timeLeft / 22) * 100}%` }}
          />
        </div>
        <span className="text-base font-semibold min-w-[30px] text-center">{timeLeft}</span>
      </div>

      {/* Компактні налаштування */}
      <div className="space-y-4">
        {/* Розмір поля */}
        <div className="flex justify-between items-center">
          <span className="text-base font-medium opacity-90">Розмір:</span>
          <div className="flex gap-2">
            <button
              onClick={() => setBoardSize('3x3')}
              className={`px-4 py-2 text-base rounded-lg font-medium transition-all ${
                boardSize === '3x3'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
              }`}
            >
              3×3
            </button>
            <button
              onClick={() => setBoardSize('4x4')}
              className={`px-4 py-2 text-base rounded-lg font-medium transition-all ${
                boardSize === '4x4'
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
          <span className="text-base font-medium opacity-90">Фігура:</span>
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
              <span className="text-base font-medium opacity-90">Перший хід:</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setFirstMove('player')}
                  className={`px-3 py-2 text-sm rounded-lg font-medium transition-all ${
                    firstMove === 'player'
                      ? 'bg-purple-600 text-white shadow-lg'
                      : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
                  }`}
                >
                  Я
                </button>
                <button
                  onClick={() => setFirstMove('ai')}
                  className={`px-3 py-2 text-sm rounded-lg font-medium transition-all ${
                    firstMove === 'ai'
                      ? 'bg-purple-600 text-white shadow-lg'
                      : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
                  }`}
                >
                  AI
                </button>
                <button
                  onClick={() => setFirstMove('random')}
                  className={`px-3 py-2 text-sm rounded-lg font-medium transition-all ${
                    firstMove === 'random'
                      ? 'bg-purple-600 text-white shadow-lg'
                      : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
                  }`}
                >
                  Випадково
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-base font-medium opacity-90">Складність:</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setDifficulty('easy')}
                  className={`px-3 py-2 text-sm rounded-lg font-medium transition-all ${
                    difficulty === 'easy'
                      ? 'bg-green-600 text-white shadow-lg'
                      : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
                  }`}
                >
                  Легка
                </button>
                <button
                  onClick={() => setDifficulty('medium')}
                  className={`px-3 py-2 text-sm rounded-lg font-medium transition-all ${
                    difficulty === 'medium'
                      ? 'bg-yellow-600 text-white shadow-lg'
                      : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
                  }`}
                >
                  Середня
                </button>
                <button
                  onClick={() => setDifficulty('hard')}
                  className={`px-3 py-2 text-sm rounded-lg font-medium transition-all ${
                    difficulty === 'hard'
                      ? 'bg-red-600 text-white shadow-lg'
                      : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
                  }`}
                >
                  Важка
                </button>
              </div>
            </div>
          </>
        )}

        {/* PvP налаштування */}
        {gameMode === 'pvp' && (
          <>
            <div className="flex justify-between items-center">
              <span className="text-base font-medium opacity-90">Перший хід:</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setFirstMove('player')}
                  className={`px-3 py-2 text-sm rounded-lg font-medium transition-all ${
                    firstMove === 'player'
                      ? 'bg-purple-600 text-white shadow-lg'
                      : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
                  }`}
                >
                  Я перший
                </button>
                <button
                  onClick={() => setFirstMove('random')}
                  className={`px-3 py-2 text-sm rounded-lg font-medium transition-all ${
                    firstMove === 'random'
                      ? 'bg-purple-600 text-white shadow-lg'
                      : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
                  }`}
                >
                  Випадково
                </button>
              </div>
            </div>

            {/* Ставка */}
            <div className="flex justify-between items-center">
              <span className="text-base font-medium opacity-90">Ставка:</span>
              <div className="flex gap-4 items-center">
                <label className="flex items-center gap-2 cursor-pointer text-sm">
                  <input
                    type="radio"
                    name="stake"
                    checked={!hasStake}
                    onChange={() => setHasStake(false)}
                    className="w-4 h-4"
                  />
                  <span>Без ставки</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-sm">
                  <input
                    type="radio"
                    name="stake"
                    checked={hasStake}
                    onChange={() => setHasStake(true)}
                    className="w-4 h-4"
                  />
                  <span>Зі ставкою</span>
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

            {/* Доступ */}
            <div className="flex justify-between items-center">
              <span className="text-base font-medium opacity-90">Доступ:</span>
              <div className="flex gap-4 items-center">
                <label className="flex items-center gap-2 cursor-pointer text-sm">
                  <input
                    type="radio"
                    name="access"
                    checked={gameAccess === 'public'}
                    onChange={() => setGameAccess('public')}
                    className="w-4 h-4"
                  />
                  <span>Публічна</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-sm">
                  <input
                    type="radio"
                    name="access"
                    checked={gameAccess === 'private'}
                    onChange={() => setGameAccess('private')}
                    className="w-4 h-4"
                  />
                  <span>Приватна</span>
                </label>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Кнопка старту */}
      <button
        onClick={resetGame}
        className="w-full bg-purple-600 hover:bg-purple-700 py-4 px-6 rounded-xl font-bold text-lg text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
      >
        🎮 ПОЧАТИ ГРУ
      </button>
    </div>
  );

  const CreateTournamentTab = () => (
    <div className="space-y-4">
      <div className="text-center text-lg font-semibold mb-4 flex items-center justify-center gap-2">
        🏆 Новий турнір
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium opacity-90 mb-1">Назва турніру</label>
          <input
            type="text"
            placeholder="Введіть назву турніру"
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 text-sm"
          />
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm font-medium opacity-90">Учасники:</span>
          <div className="flex gap-1">
            {['4', '8', '16'].map((count) => (
              <button
                key={count}
                className="px-3 py-1 text-sm rounded-md font-medium bg-purple-600 text-white first:bg-purple-600 bg-white/20 text-white/70 hover:bg-white/30 transition-all"
              >
                {count}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium opacity-90 mb-1">Призовий фонд (XTZ)</label>
          <input
            type="number"
            placeholder="0.00"
            step="0.01"
            min="0"
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 text-sm"
          />
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm font-medium opacity-90">Розмір:</span>
          <div className="flex gap-1">
            <button className="px-3 py-1 text-sm rounded-md font-medium bg-purple-600 text-white transition-all">
              3×3
            </button>
            <button className="px-3 py-1 text-sm rounded-md font-medium bg-white/20 text-white/70 hover:bg-white/30 transition-all">
              4×4
            </button>
          </div>
        </div>
      </div>

      <button className="w-full bg-purple-600 hover:bg-purple-700 py-3 px-4 rounded-xl font-semibold text-white transition-all duration-300 hover:-translate-y-0.5">
        🏆 СТВОРИТИ ТУРНІР
      </button>
    </div>
  );

  const AvailableGamesTab = () => (
    <div className="space-y-4">
      <div className="text-center text-lg font-semibold mb-4 flex items-center justify-center gap-2">
        📋 Доступні ігри
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {/* Гра проти AI */}
        <div className="bg-white/10 rounded-xl p-3 hover:bg-white/15 transition-all">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold text-sm">Гра проти AI</span>
            <span className="bg-green-600 text-white px-2 py-0.5 rounded text-xs font-medium">
              Активна
            </span>
          </div>
          <div className="text-xs text-white/70 mb-3">
            3×3 • Важка складність • Ваш хід
          </div>
          <button className="w-full bg-purple-600 hover:bg-purple-700 py-2 px-3 rounded-lg font-medium text-white text-sm transition-all hover:-translate-y-0.5">
            Продовжити
          </button>
        </div>

        {/* PvP зі ставкою */}
        <div className="bg-white/10 rounded-xl p-3 hover:bg-white/15 transition-all">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold text-sm">Гравець123</span>
            <span className="bg-yellow-600 text-white px-2 py-0.5 rounded text-xs font-medium">
              5.0 XTZ
            </span>
          </div>
          <div className="text-xs text-white/70 mb-3">
            3×3 • PvP • Зі ставкою
          </div>
          <button className="w-full bg-purple-600 hover:bg-purple-700 py-2 px-3 rounded-lg font-medium text-white text-sm transition-all hover:-translate-y-0.5">
            Приєднатися
          </button>
        </div>

        {/* Турнір */}
        <div className="bg-white/10 rounded-xl p-3 hover:bg-white/15 transition-all">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold text-sm">Весняний турнір</span>
            <span className="bg-purple-600 text-white px-2 py-0.5 rounded text-xs font-medium">
              12/16
            </span>
          </div>
          <div className="text-xs text-white/70 mb-3">
            Турнір • Призовий фонд: 100 XTZ
          </div>
          <button className="w-full bg-purple-600 hover:bg-purple-700 py-2 px-3 rounded-lg font-medium text-white text-sm transition-all hover:-translate-y-0.5">
            Приєднатися
          </button>
        </div>

        {/* Швидка гра */}
        <div className="bg-white/10 rounded-xl p-3 hover:bg-white/15 transition-all">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold text-sm">Швидка гра</span>
            <span className="bg-blue-600 text-white px-2 py-0.5 rounded text-xs font-medium">
              Очікує
            </span>
          </div>
          <div className="text-xs text-white/70 mb-3">
            4×4 • AI • Легка складність
          </div>
          <button className="w-full bg-purple-600 hover:bg-purple-700 py-2 px-3 rounded-lg font-medium text-white text-sm transition-all hover:-translate-y-0.5">
            Приєднатися
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-gradient-to-br from-gray-800/50 via-purple-800/50 to-gray-800/50 backdrop-blur-md rounded-3xl p-4 lg:p-6 shadow-2xl border border-purple-500/20">
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
          <span className="font-medium leading-tight text-center">Створити гру</span>
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
          <span className="font-medium leading-tight text-center">Створити турнір</span>
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
          <span className="font-medium leading-tight text-center">Доступні ігри</span>
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