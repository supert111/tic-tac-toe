'use client';

import { useState, useCallback } from 'react';
import GameCell from '../NotUseGameCell';
import GameModal from '../NotUseGameModal';

type Player = 'X' | 'O';
type Difficulty = 'easy' | 'medium' | 'hard';
type FirstMove = 'player' | 'ai' | 'random';
type GameState = 'setup' | 'playing' | 'finished';

interface AIGameProps {
  onBack?: () => void;
}

export default function AIGame({ onBack }: AIGameProps) {
  // Налаштування гри
  const [boardSize, setBoardSize] = useState(3);
  const [playerSymbol, setPlayerSymbol] = useState<Player>('X');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [firstMove, setFirstMove] = useState<FirstMove>('player');
  
  // Стан гри
  const [gameState, setGameState] = useState<GameState>('setup');
  const [gameBoard, setGameBoard] = useState<string[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
  const [gameActive, setGameActive] = useState(true);
  const [winningConditions, setWinningConditions] = useState<number[][]>([]);
  const [winningLine, setWinningLine] = useState<number[]>([]);
  const [aiThinking, setAiThinking] = useState(false);
  
  // Модальне вікно
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');

  const aiSymbol: Player = playerSymbol === 'X' ? 'O' : 'X';

  // Генеруємо комбінації для перемоги
  const generateWinningConditions = useCallback((size: number): number[][] => {
    const conditions: number[][] = [];
    
    // Рядки
    for (let row = 0; row < size; row++) {
      for (let col = 0; col <= size - 3; col++) {
        conditions.push([
          row * size + col,
          row * size + col + 1,
          row * size + col + 2
        ]);
      }
    }
    
    // Стовпці
    for (let col = 0; col < size; col++) {
      for (let row = 0; row <= size - 3; row++) {
        conditions.push([
          row * size + col,
          (row + 1) * size + col,
          (row + 2) * size + col
        ]);
      }
    }
    
    // Діагоналі (зліва направо)
    for (let row = 0; row <= size - 3; row++) {
      for (let col = 0; col <= size - 3; col++) {
        conditions.push([
          row * size + col,
          (row + 1) * size + col + 1,
          (row + 2) * size + col + 2
        ]);
      }
    }
    
    // Діагоналі (справа наліво)
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
  }, []);

  // Ініціалізація гри
  const initializeGame = useCallback(() => {
    const totalCells = boardSize * boardSize;
    const newBoard = new Array(totalCells).fill('');
    const conditions = generateWinningConditions(boardSize);
    
    setGameBoard(newBoard);
    setWinningConditions(conditions);
    setWinningLine([]);
    setGameActive(true);
    setShowModal(false);
    
    // Визначаємо хто ходить першим
    let firstPlayer: Player;
    if (firstMove === 'random') {
      firstPlayer = Math.random() < 0.5 ? 'X' : 'O';
    } else if (firstMove === 'player') {
      firstPlayer = playerSymbol;
    } else {
      firstPlayer = aiSymbol;
    }
    
    setCurrentPlayer(firstPlayer);
    
    // Якщо AI ходить першим
    if (firstPlayer === aiSymbol) {
      setTimeout(() => makeAIMove(newBoard, conditions), 1000);
    }
  }, [boardSize, playerSymbol, aiSymbol, firstMove, generateWinningConditions]);

  // Перевірка результату
  const checkResult = useCallback((board: string[], conditions: number[][]) => {
    let roundWon = false;
    let winLine: number[] = [];

    for (let i = 0; i < conditions.length; i++) {
      const [a, b, c] = conditions[i];
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        roundWon = true;
        winLine = [a, b, c];
        break;
      }
    }

    if (roundWon) {
      setWinningLine(winLine);
      setGameActive(false);
      const winner = board[winLine[0]];
      const isPlayerWin = winner === playerSymbol;
      
      setModalTitle(isPlayerWin ? '🎉 Перемога!' : '😔 Поразка');
      setModalMessage(isPlayerWin 
        ? `Вітаємо! Ви перемогли ШІ на рівні "${getDifficultyName(difficulty)}"!`
        : `ШІ переміг на рівні "${getDifficultyName(difficulty)}". Спробуйте ще раз!`
      );
      setShowModal(true);
      return true;
    }

    // Перевіряємо на нічию
    if (!board.includes('')) {
      setGameActive(false);
      setModalTitle('🤝 Нічия!');
      setModalMessage('Гра завершилася внічию. Ніхто не переміг!');
      setShowModal(true);
      return true;
    }

    return false;
  }, [playerSymbol, difficulty]);

  // AI алгоритми
  const makeAIMove = useCallback((board: string[], conditions: number[][]) => {
    if (!gameActive) return;
    
    setAiThinking(true);
    
    setTimeout(() => {
      let move: number;
      
      switch (difficulty) {
        case 'easy':
          move = getRandomMove(board);
          break;
        case 'medium':
          move = getMediumMove(board, conditions);
          break;
        case 'hard':
          move = getHardMove(board, conditions);
          break;
        default:
          move = getRandomMove(board);
      }
      
      if (move !== -1) {
        const newBoard = [...board];
        newBoard[move] = aiSymbol;
        setGameBoard(newBoard);
        
        if (!checkResult(newBoard, conditions)) {
          setCurrentPlayer(playerSymbol);
        }
      }
      
      setAiThinking(false);
    }, Math.random() * 1000 + 500); // 0.5-1.5 секунди на роздуми
  }, [gameActive, aiSymbol, playerSymbol, difficulty, checkResult]);

  // Легкий рівень - випадковий хід
  const getRandomMove = (board: string[]): number => {
    const availableMoves = board.map((cell, index) => cell === '' ? index : -1).filter(index => index !== -1);
    return availableMoves.length > 0 ? availableMoves[Math.floor(Math.random() * availableMoves.length)] : -1;
  };

  // Середній рівень - блокує гравця або виграє
  const getMediumMove = (board: string[], conditions: number[][]): number => {
    // Спробуємо виграти
    const winMove = findWinningMove(board, conditions, aiSymbol);
    if (winMove !== -1) return winMove;
    
    // Спробуємо заблокувати гравця
    const blockMove = findWinningMove(board, conditions, playerSymbol);
    if (blockMove !== -1) return blockMove;
    
    // Інакше випадковий хід
    return getRandomMove(board);
  };

  // Важкий рівень - мініmax алгоритм (спрощений)
  const getHardMove = (board: string[], conditions: number[][]): number => {
    // Спробуємо виграти
    const winMove = findWinningMove(board, conditions, aiSymbol);
    if (winMove !== -1) return winMove;
    
    // Спробуємо заблокувати гравця
    const blockMove = findWinningMove(board, conditions, playerSymbol);
    if (blockMove !== -1) return blockMove;
    
    // Займемо центр якщо доступний
    const center = Math.floor(boardSize / 2) * boardSize + Math.floor(boardSize / 2);
    if (board[center] === '') return center;
    
    // Займемо кути
    const corners = [0, boardSize - 1, boardSize * (boardSize - 1), boardSize * boardSize - 1];
    const availableCorners = corners.filter(corner => board[corner] === '');
    if (availableCorners.length > 0) {
      return availableCorners[Math.floor(Math.random() * availableCorners.length)];
    }
    
    // Інакше випадковий хід
    return getRandomMove(board);
  };

  // Знаходимо виграшний хід або хід для блокування
  const findWinningMove = (board: string[], conditions: number[][], symbol: Player): number => {
    for (const [a, b, c] of conditions) {
      const line = [board[a], board[b], board[c]];
      const symbolCount = line.filter(cell => cell === symbol).length;
      const emptyCount = line.filter(cell => cell === '').length;
      
      if (symbolCount === 2 && emptyCount === 1) {
        if (board[a] === '') return a;
        if (board[b] === '') return b;
        if (board[c] === '') return c;
      }
    }
    return -1;
  };

  // Обробка кліку гравця
  const handleCellClick = (index: number) => {
    if (gameBoard[index] !== '' || !gameActive || currentPlayer !== playerSymbol || aiThinking) return;

    const newBoard = [...gameBoard];
    newBoard[index] = playerSymbol;
    setGameBoard(newBoard);
    
    if (!checkResult(newBoard, winningConditions)) {
      setCurrentPlayer(aiSymbol);
      makeAIMove(newBoard, winningConditions);
    }
  };

  // Допоміжні функції
  const getDifficultyName = (diff: Difficulty): string => {
    switch (diff) {
      case 'easy': return 'Легка';
      case 'medium': return 'Середня';
      case 'hard': return 'Важка';
      default: return 'Невідома';
    }
  };

  const getDifficultyColor = (diff: Difficulty): string => {
    switch (diff) {
      case 'easy': return 'from-green-500 to-green-600';
      case 'medium': return 'from-yellow-500 to-yellow-600';
      case 'hard': return 'from-red-500 to-red-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  // Початок гри
  const startGame = () => {
    setGameState('playing');
    initializeGame();
  };

  // Нова гра
  const newGame = () => {
    setGameState('setup');
  };

  if (gameState === 'setup') {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-purple-200">🤖 Гра проти ШІ</h3>
          {onBack && (
            <button 
              onClick={onBack}
              className="text-white/60 hover:text-white transition-colors"
            >
              ← Назад
            </button>
          )}
        </div>
        
        {/* Вибір розміру дошки */}
        <div className="bg-white/10 rounded-2xl p-4">
          <h4 className="font-semibold mb-3 text-purple-200">📐 Розмір поля</h4>
          <div className="flex gap-2">
            <button 
              onClick={() => setBoardSize(3)}
              className={`flex-1 py-2 px-3 rounded-xl transition-all ${
                boardSize === 3 ? 'bg-purple-500/70' : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              3×3
            </button>
            <button 
              onClick={() => setBoardSize(4)}
              className={`flex-1 py-2 px-3 rounded-xl transition-all ${
                boardSize === 4 ? 'bg-purple-500/70' : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              4×4
            </button>
          </div>
        </div>

        {/* Вибір фігури */}
        <div className="bg-white/10 rounded-2xl p-4">
          <h4 className="font-semibold mb-3 text-purple-200">⭕ Ваша фігура</h4>
          <div className="flex gap-2">
            <button 
              onClick={() => setPlayerSymbol('X')}
              className={`flex-1 py-2 px-3 rounded-xl transition-all ${
                playerSymbol === 'X' ? 'bg-purple-500/70' : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              X (хрестик)
            </button>
            <button 
              onClick={() => setPlayerSymbol('O')}
              className={`flex-1 py-2 px-3 rounded-xl transition-all ${
                playerSymbol === 'O' ? 'bg-purple-500/70' : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              O (нулик)
            </button>
          </div>
        </div>

        {/* Перший хід */}
        <div className="bg-white/10 rounded-2xl p-4">
          <h4 className="font-semibold mb-3 text-purple-200">🎯 Перший хід</h4>
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                name="firstMove" 
                value="player" 
                checked={firstMove === 'player'}
                onChange={(e) => setFirstMove(e.target.value as FirstMove)}
                className="text-purple-500" 
              />
              <span>🙋‍♂️ Гравець</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                name="firstMove" 
                value="ai" 
                checked={firstMove === 'ai'}
                onChange={(e) => setFirstMove(e.target.value as FirstMove)}
                className="text-purple-500" 
              />
              <span>🤖 Комп'ютер</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                name="firstMove" 
                value="random" 
                checked={firstMove === 'random'}
                onChange={(e) => setFirstMove(e.target.value as FirstMove)}
                className="text-purple-500" 
              />
              <span>🎲 Випадково</span>
            </label>
          </div>
        </div>

        {/* Складність */}
        <div className="bg-white/10 rounded-2xl p-4">
          <h4 className="font-semibold mb-3 text-purple-200">⚡ Складність</h4>
          <div className="flex gap-2">
            <button 
              onClick={() => setDifficulty('easy')}
              className={`flex-1 py-2 px-3 rounded-xl transition-all text-sm ${
                difficulty === 'easy' ? 'bg-green-500/70' : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              😊 Легка
            </button>
            <button 
              onClick={() => setDifficulty('medium')}
              className={`flex-1 py-2 px-3 rounded-xl transition-all text-sm ${
                difficulty === 'medium' ? 'bg-yellow-500/70' : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              😐 Середня
            </button>
            <button 
              onClick={() => setDifficulty('hard')}
              className={`flex-1 py-2 px-3 rounded-xl transition-all text-sm ${
                difficulty === 'hard' ? 'bg-red-500/70' : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              😤 Важка
            </button>
          </div>
        </div>

        {/* Кнопка початку гри */}
        <button 
          onClick={startGame}
          className="w-full bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 py-3 px-6 rounded-2xl font-bold text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
        >
          🎮 ПОЧАТИ ГРУ
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Заголовок гри */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-purple-200">🤖 Гра проти ШІ</h3>
          <div className="text-sm text-white/60">
            Рівень: <span className={`font-semibold bg-gradient-to-r ${getDifficultyColor(difficulty)} bg-clip-text text-transparent`}>
              {getDifficultyName(difficulty)}
            </span>
          </div>
        </div>
        <button 
          onClick={newGame}
          className="text-white/60 hover:text-white transition-colors"
        >
          ⚙️ Налаштування
        </button>
      </div>

      {/* Статус гри */}
      <div className="bg-white/10 rounded-2xl p-4 text-center">
        {aiThinking ? (
          <div className="flex items-center justify-center gap-2">
            <div className="animate-spin w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full"></div>
            <span className="text-purple-200">ШІ обдумує хід...</span>
          </div>
        ) : gameActive ? (
          <div className="text-lg text-purple-200">
            Хід: <span className="font-bold text-purple-300">
              {currentPlayer} ({currentPlayer === playerSymbol ? 'Ви' : 'ШІ'})
            </span>
          </div>
        ) : (
          <div className="text-lg text-white/60">
            Гра завершена
          </div>
        )}
      </div>
      
      {/* Ігрове поле */}
      <div className={`
        grid gap-2 mx-auto bg-gray-900/40 p-3 rounded-2xl relative border border-purple-400/20
        ${boardSize === 3 ? 'grid-cols-3' : 'grid-cols-4'}
      `} style={{
        width: boardSize === 3 ? '220px' : '280px'
      }}>
        {gameBoard.map((cell, index) => (
          <GameCell
            key={index}
            value={cell}
            onClick={() => handleCellClick(index)}
            isWinning={winningLine.includes(index)}
            disabled={!gameActive || currentPlayer !== playerSymbol || aiThinking}
          />
        ))}
      </div>
      
      {/* Кнопки управління */}
      <div className="flex gap-2">
        <button 
          onClick={initializeGame}
          className="flex-1 bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 px-4 py-2 rounded-2xl font-bold text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
        >
          🔄 Нова гра
        </button>
        <button 
          onClick={newGame}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-2xl font-medium text-white transition-all duration-300"
        >
          ⚙️
        </button>
      </div>

      <GameModal 
        show={showModal}
        title={modalTitle}
        message={modalMessage}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
}