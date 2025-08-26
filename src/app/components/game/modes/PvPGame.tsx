'use client';

import { useState, useEffect, useCallback } from 'react';
import GameCell from '../GameCell';
import GameModal from '../GameModal';

type Player = 'X' | 'O';
type FirstMove = 'random' | 'creator' | 'opponent';
type GameAccess = 'public' | 'private';
type GameState = 'setup' | 'waiting' | 'playing' | 'finished';
type PvPTab = 'create' | 'available';

interface Room {
  id: number;
  size: number;
  stake: number;
  firstMove: FirstMove;
  access: GameAccess;
  availableSymbol: Player;
  creator: string;
}

interface PvPGameProps {
  onBack?: () => void;
}

// Мок дані для доступних ігор
const mockRooms: Room[] = [
  {
    id: 128,
    size: 4,
    stake: 0,
    firstMove: 'random',
    availableSymbol: 'O',
    access: 'public',
    creator: 'Player123'
  },
  {
    id: 129,
    size: 4,
    stake: 10,
    firstMove: 'creator',
    availableSymbol: 'O',
    access: 'public',
    creator: 'ProGamer'
  },
  {
    id: 130,
    size: 3,
    stake: 0,
    firstMove: 'opponent',
    availableSymbol: 'X',
    access: 'public',
    creator: 'CasualPlayer'
  }
];

export default function PvPGame({ onBack }: PvPGameProps) {
  const [activeTab, setActiveTab] = useState<PvPTab>('create');
  
  // Налаштування створення гри
  const [boardSize, setBoardSize] = useState(3);
  const [playerSymbol, setPlayerSymbol] = useState<Player>('X');
  const [firstMove, setFirstMove] = useState<FirstMove>('random');
  const [hasStake, setHasStake] = useState(false);
  const [stakeAmount, setStakeAmount] = useState('');
  const [gameAccess, setGameAccess] = useState<GameAccess>('public');
  
  // Стан гри
  const [gameState, setGameState] = useState<GameState>('setup');
  const [gameBoard, setGameBoard] = useState<string[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
  const [gameActive, setGameActive] = useState(true);
  const [winningConditions, setWinningConditions] = useState<number[][]>([]);
  const [winningLine, setWinningLine] = useState<number[]>([]);
  const [roomId, setRoomId] = useState<number | null>(null);
  const [opponentName, setOpponentName] = useState('');
  const [waitingForOpponent, setWaitingForOpponent] = useState(false);
  
  // Фільтри для доступних ігор
  const [filterSize, setFilterSize] = useState<number | null>(null);
  const [filterStake, setFilterStake] = useState<'free' | 'paid' | null>(null);
  const [filterFirstMove, setFilterFirstMove] = useState<FirstMove | null>(null);
  
  // Модальне вікно
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');

  const opponentSymbol: Player = playerSymbol === 'X' ? 'O' : 'X';

  // Генеруємо комбінації для перемоги
  const generateWinningConditions = useCallback((size: number): number[][] => {
    const conditions: number[][] = [];
    
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
    } else if (firstMove === 'creator') {
      firstPlayer = playerSymbol;
    } else {
      firstPlayer = opponentSymbol;
    }
    
    setCurrentPlayer(firstPlayer);
  }, [boardSize, playerSymbol, opponentSymbol, firstMove, generateWinningConditions]);

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
        ? `Вітаємо! Ви перемогли ${opponentName || 'опонента'}!`
        : `${opponentName || 'Опонент'} переміг. Спробуйте ще раз!`
      );
      setShowModal(true);
      return true;
    }

    if (!board.includes('')) {
      setGameActive(false);
      setModalTitle('🤝 Нічия!');
      setModalMessage('Гра завершилася внічию. Ніхто не переміг!');
      setShowModal(true);
      return true;
    }

    return false;
  }, [playerSymbol, opponentName]);

  // Обробка кліку по клітинці
  const handleCellClick = (index: number) => {
    if (gameBoard[index] !== '' || !gameActive || currentPlayer !== playerSymbol) return;

    const newBoard = [...gameBoard];
    newBoard[index] = playerSymbol;
    setGameBoard(newBoard);
    
    if (!checkResult(newBoard, winningConditions)) {
      setCurrentPlayer(opponentSymbol);
      // Тут буде відправка ходу через WebSocket
    }
  };

  // Створення нової гри
  const createGame = () => {
    const newRoomId = Math.floor(Math.random() * 1000) + 100;
    setRoomId(newRoomId);
    setGameState('waiting');
    setWaitingForOpponent(true);
    initializeGame();
    
    // Симуляція підключення опонента через 3-5 секунд
    setTimeout(() => {
      setOpponentName('RandomPlayer');
      setWaitingForOpponent(false);
      setGameState('playing');
    }, Math.random() * 2000 + 3000);
  };

  // Приєднання до гри
  const joinGame = (room: Room) => {
    setRoomId(room.id);
    setBoardSize(room.size);
    setPlayerSymbol(room.availableSymbol);
    setFirstMove(room.firstMove);
    setOpponentName(room.creator);
    setGameState('playing');
    initializeGame();
  };

  // Повернення до налаштувань
  const backToSetup = () => {
    setGameState('setup');
    setActiveTab('create');
    setRoomId(null);
    setOpponentName('');
    setWaitingForOpponent(false);
  };

  // Фільтрація доступних ігор
  const filteredRooms = mockRooms.filter(room => {
    if (filterSize && room.size !== filterSize) return false;
    if (filterStake === 'free' && room.stake > 0) return false;
    if (filterStake === 'paid' && room.stake === 0) return false;
    if (filterFirstMove && room.firstMove !== filterFirstMove) return false;
    return true;
  });

  // Компонент створення гри
  const CreateGameComponent = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-purple-200">🆚 Створити гру</h3>
      
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
              type="checkbox" 
              checked={firstMove === 'random'}
              onChange={() => setFirstMove('random')}
              className="text-purple-500" 
            />
            <span>🎲 Випадково</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="checkbox" 
              checked={firstMove === 'creator'}
              onChange={() => setFirstMove('creator')}
              className="text-purple-500" 
            />
            <span>🙋‍♂️ Я перший</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="checkbox" 
              checked={firstMove === 'opponent'}
              onChange={() => setFirstMove('opponent')}
              className="text-purple-500" 
            />
            <span>👤 Опонент перший</span>
          </label>
        </div>
      </div>

      {/* Ставка */}
      <div className="bg-white/10 rounded-2xl p-4">
        <h4 className="font-semibold mb-3 text-purple-200">💰 Ставка</h4>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="checkbox" 
              checked={!hasStake}
              onChange={() => setHasStake(false)}
              className="text-purple-500" 
            />
            <span>🆓 Без ставки</span>
          </label>
          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              checked={hasStake}
              onChange={() => setHasStake(true)}
              className="text-purple-500" 
            />
            <input 
              type="number" 
              placeholder="Введіть суму" 
              value={stakeAmount}
              onChange={(e) => setStakeAmount(e.target.value)}
              disabled={!hasStake}
              className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 disabled:opacity-50"
            />
            <span className="text-sm text-white/70">XTZ</span>
          </div>
        </div>
      </div>

      {/* Доступ */}
      <div className="bg-white/10 rounded-2xl p-4">
        <h4 className="font-semibold mb-3 text-purple-200">🔒 Доступ</h4>
        <div className="flex gap-2">
          <button 
            onClick={() => setGameAccess('public')}
            className={`flex-1 py-2 px-3 rounded-xl transition-all ${
              gameAccess === 'public' ? 'bg-green-500/70' : 'bg-white/10 hover:bg-white/20'
            }`}
          >
            🌐 Публічна
          </button>
          <button 
            onClick={() => setGameAccess('private')}
            className={`flex-1 py-2 px-3 rounded-xl transition-all ${
              gameAccess === 'private' ? 'bg-red-500/70' : 'bg-white/10 hover:bg-white/20'
            }`}
          >
            🔐 Приватна
          </button>
        </div>
      </div>

      {/* Кнопка створення */}
      <button 
        onClick={createGame}
        className="w-full bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 py-3 px-6 rounded-2xl font-bold text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
      >
        🔄 СТВОРИТИ ГРУ
      </button>
    </div>
  );

  // Компонент доступних ігор
  const AvailableGamesComponent = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-purple-200">🔍 Доступні ігри ({filteredRooms.length})</h3>
      
      {/* Фільтри */}
      <div className="bg-white/10 rounded-2xl p-4">
        <h4 className="font-semibold mb-3 text-purple-200">🔍 Фільтр</h4>
        <div className="space-y-3">
          {/* Розмір */}
          <div>
            <span className="text-sm text-white/70 block mb-1">Розмір:</span>
            <div className="flex gap-2">
              <button 
                onClick={() => setFilterSize(filterSize === 3 ? null : 3)}
                className={`px-3 py-1 rounded-lg text-sm transition-all ${
                  filterSize === 3 ? 'bg-purple-500/70' : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                3x3
              </button>
              <button 
                onClick={() => setFilterSize(filterSize === 4 ? null : 4)}
                className={`px-3 py-1 rounded-lg text-sm transition-all ${
                  filterSize === 4 ? 'bg-purple-500/70' : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                4x4
              </button>
            </div>
          </div>
          
          {/* Ставка */}
          <div>
            <span className="text-sm text-white/70 block mb-1">Ставка:</span>
            <div className="flex gap-2">
              <button 
                onClick={() => setFilterStake(filterStake === 'free' ? null : 'free')}
                className={`px-3 py-1 rounded-lg text-sm transition-all ${
                  filterStake === 'free' ? 'bg-green-500/70' : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                Безкоштовні
              </button>
              <button 
                onClick={() => setFilterStake(filterStake === 'paid' ? null : 'paid')}
                className={`px-3 py-1 rounded-lg text-sm transition-all ${
                  filterStake === 'paid' ? 'bg-yellow-500/70' : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                Платні
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Список ігор */}
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {filteredRooms.map((room) => (
          <div key={room.id} className="bg-white/10 rounded-2xl p-4 border border-white/20">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-bold text-lg">🏠 Кімната #{room.id}</h4>
                <div className="text-sm text-white/70">Створив: {room.creator}</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-white/70">Ставка</div>
                <div className="font-bold text-yellow-400">
                  {room.stake === 0 ? 'Безкоштовно' : `${room.stake} XTZ`}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
              <div>
                <div className="text-white/70">Розмір:</div>
                <div className="font-medium">{room.size}×{room.size}</div>
              </div>
              <div>
                <div className="text-white/70">Доступна фігура:</div>
                <div className="font-medium">{room.availableSymbol} ({room.availableSymbol === 'X' ? 'хрестик' : 'нулик'})</div>
              </div>
              <div className="col-span-2">
                <div className="text-white/70">Ходить першим:</div>
                <div className="font-medium">
                  {room.firstMove === 'random' && '🎲 Випадково'}
                  {room.firstMove === 'creator' && '👤 Створювач'}
                  {room.firstMove === 'opponent' && '🙋‍♂️ Ви'}
                </div>
              </div>
            </div>

            <button
              onClick={() => joinGame(room)}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 py-2 px-4 rounded-xl font-medium text-white transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5"
            >
              🎯 ПРИЄДНАТИСЯ
            </button>
          </div>
        ))}
      </div>

      {filteredRooms.length === 0 && (
        <div className="text-center py-8 text-white/60">
          <div className="text-4xl mb-2">🔍</div>
          <div>Немає ігор за вашими фільтрами</div>
        </div>
      )}

      {/* Кнопка оновлення */}
      <button className="w-full bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 py-2 px-4 rounded-xl font-medium text-white transition-all duration-300">
        🔄 ОНОВИТИ СПИСОК
      </button>
    </div>
  );

  if (gameState === 'setup') {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-purple-200">🆚 PvP Гра</h3>
          {onBack && (
            <button 
              onClick={onBack}
              className="text-white/60 hover:text-white transition-colors"
            >
              ← Назад
            </button>
          )}
        </div>

        {/* PvP підтаби */}
        <div className="flex gap-2 mb-6 bg-white/5 rounded-xl p-1">
          <button
            onClick={() => setActiveTab('create')}
            className={`
              flex-1 py-2 px-3 rounded-lg font-medium transition-all duration-300 text-sm
              ${activeTab === 'create'
                ? 'bg-white/20 text-white'
                : 'text-white/60 hover:text-white hover:bg-white/10'
              }
            `}
          >
            ▌ Створити нову гру ▌
          </button>
          <button
            onClick={() => setActiveTab('available')}
            className={`
              flex-1 py-2 px-3 rounded-lg font-medium transition-all duration-300 text-sm
              ${activeTab === 'available'
                ? 'bg-white/20 text-white'
                : 'text-white/60 hover:text-white hover:bg-white/10'
              }
            `}
          >
            ▌ Доступні ігри ({filteredRooms.length}) ▌
          </button>
        </div>

        {/* Контент підтабів */}
        {activeTab === 'create' && <CreateGameComponent />}
        {activeTab === 'available' && <AvailableGamesComponent />}
      </div>
    );
  }

  if (gameState === 'waiting') {
    return (
      <div className="space-y-4 text-center">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-purple-200">⏳ Очікування опонента</h3>
          <button 
            onClick={backToSetup}
            className="text-white/60 hover:text-white transition-colors"
          >
            ← Назад
          </button>
        </div>

        <div className="bg-white/10 rounded-2xl p-6">
          <div className="animate-spin w-12 h-12 border-4 border-purple-400 border-t-transparent rounded-full mx-auto mb-4"></div>
          <h4 className="font-bold text-lg mb-2">🏠 Кімната #{roomId}</h4>
          <p className="text-white/70 mb-4">Чекаємо на приєднання опонента...</p>
          
          <div className="bg-white/10 rounded-xl p-3 text-sm">
            <div className="grid grid-cols-2 gap-2">
              <div>Розмір: {boardSize}×{boardSize}</div>
              <div>Ваша фігура: {playerSymbol}</div>
              <div>Ставка: {hasStake ? `${stakeAmount} XTZ` : 'Безкоштовно'}</div>
              <div>Доступ: {gameAccess === 'public' ? '🌐 Публічна' : '🔐 Приватна'}</div>
            </div>
          </div>
        </div>

        <button 
          onClick={backToSetup}
          className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 py-2 px-6 rounded-xl font-medium text-white transition-all duration-300"
        >
          ❌ Скасувати гру
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Заголовок гри */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-purple-200">🆚 PvP Гра</h3>
          <div className="text-sm text-white/60">
            Кімната #{roomId} • Опонент: {opponentName}
          </div>
        </div>
        <button 
          onClick={backToSetup}
          className="text-white/60 hover:text-white transition-colors"
        >
          🚪 Вийти
        </button>
      </div>

      {/* Статус гри */}
      <div className="bg-white/10 rounded-2xl p-4 text-center">
        {gameActive ? (
          <div className="text-lg text-purple-200">
            Хід: <span className="font-bold text-purple-300">
              {currentPlayer} ({currentPlayer === playerSymbol ? 'Ви' : opponentName})
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
            disabled={!gameActive || currentPlayer !== playerSymbol}
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
          onClick={backToSetup}
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