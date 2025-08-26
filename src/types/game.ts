// Що включено:
// ✅ Базові типи - Player, GameMode, BoardSize тощо
// ✅ Специфічні налаштування - для AI, PvP, Tournament
// ✅ Стани гри - від setup до finished
// ✅ Інтерфейси компонентів - GameBoard, GameTimer, GameModal
// ✅ PvP функціональність - Room, фільтри, події
// ✅ Майбутні фічі - Tournament, GameStats, WebSocket події
// ✅ Утилітарні типи - для type-safe роботи з різними режимами



// Базові типи гри
export type Player = 'X' | 'O';
export type GameMode = 'ai' | 'pvp' | 'tournament';
export type BoardSize = 3 | 4;
export type CellValue = Player | '';

// AI типи
export type Difficulty = 'easy' | 'medium' | 'hard';
export type FirstMove = 'player' | 'ai' | 'random';

// PvP типи
export type PvPFirstMove = 'creator' | 'opponent' | 'random';

// Стани гри
export type GameState = 'setup' | 'waiting' | 'playing' | 'paused' | 'finished';
export type GameResult = 'win' | 'lose' | 'draw' | null;

// Таби
export type GameTab = 'create-game' | 'create-tournament' | 'available-games';
export type PvPTab = 'create' | 'available';

// Основні інтерфейси
export interface GameBoard {
  cells: CellValue[];
  size: BoardSize;
}

export interface GameSettings {
  boardSize: BoardSize;
  playerSymbol: Player;
  gameMode: GameMode;
}

export interface AIGameSettings extends GameSettings {
  difficulty: Difficulty;
  firstMove: FirstMove;
}

export interface PvPGameSettings extends GameSettings {
  firstMove: PvPFirstMove;
  hasStake: boolean;
  stakeAmount: string;
}

export interface TournamentSettings extends GameSettings {
  name: string;
  participants: number;
  prizePool: string;
}

// Стан поточної гри
export interface CurrentGame {
  id: string | null;
  board: GameBoard;
  currentPlayer: Player;
  gameActive: boolean;
  gameState: GameState;
  winningConditions: number[][];
  winningLine: number[];
  result: GameResult;
  startTime: number | null;
  endTime: number | null;
}

// AI специфічні типи
export interface AIGame extends CurrentGame {
  settings: AIGameSettings;
  aiThinking: boolean;
  aiSymbol: Player;
}

// PvP специфічні типи
export interface PvPRoom {
  id: number;
  size: BoardSize;
  stake: number;
  firstMove: PvPFirstMove;
  availableSymbol: Player;
  creator: string;
  createdAt: number;
}

export interface PvPGame extends CurrentGame {
  settings: PvPGameSettings;
  roomId: number | null;
  opponentName: string;
  waitingForOpponent: boolean;
  opponentSymbol: Player;
}

// Турнір типи
export interface Tournament {
  id: number;
  name: string;
  participants: number;
  maxParticipants: number;
  prizePool: number;
  status: 'waiting' | 'active' | 'finished';
  startTime: number;
  endTime: number | null;
  settings: TournamentSettings;
}

// Таймер
export interface GameTimer {
  timeLeft: number;
  maxTime: number;
  isActive: boolean;
  isPaused: boolean;
}

// Модальне вікно
export interface GameModalData {
  show: boolean;
  title: string;
  message: string;
  type: 'info' | 'success' | 'error' | 'warning';
  actions?: GameModalAction[];
}

export interface GameModalAction {
  label: string;
  action: () => void;
  variant: 'primary' | 'secondary' | 'danger';
}

// Статистика (для майбутнього)
export interface GameStats {
  totalGames: number;
  wins: number;
  losses: number;
  draws: number;
  winRate: number;
  currentStreak: number;
  bestStreak: number;
}

// Фільтри для PvP ігор
export interface PvPGameFilters {
  size: BoardSize | null;
  stake: 'free' | 'paid' | null;
  firstMove: PvPFirstMove | null;
}

// Події гри (для WebSocket в майбутньому)
export type GameEvent = 
  | { type: 'MOVE'; payload: { index: number; player: Player } }
  | { type: 'GAME_START'; payload: { gameId: string; settings: GameSettings } }
  | { type: 'GAME_END'; payload: { result: GameResult; winner?: Player } }
  | { type: 'PLAYER_JOIN'; payload: { playerId: string; playerName: string } }
  | { type: 'PLAYER_LEAVE'; payload: { playerId: string } }
  | { type: 'TIMER_UPDATE'; payload: { timeLeft: number } };

// Утилітарні типи
export type GameModeConfig<T extends GameMode> = 
  T extends 'ai' ? AIGameSettings :
  T extends 'pvp' ? PvPGameSettings :
  T extends 'tournament' ? TournamentSettings :
  never;

export type GameInstance<T extends GameMode> = 
  T extends 'ai' ? AIGame :
  T extends 'pvp' ? PvPGame :
  never;




  

  // Додати ці типи до існуючого файлу lib/types/game.ts

// === НОВІ ТИПИ ДЛЯ 4×4 ПРАВИЛ ===

// Тип для індексу клітинки
export type CellIndex = number;

// Тип для обмежених клітинок (заборонені для ходу)
export type RestrictedCells = CellIndex[];

// Розширення GameBoard для підтримки обмежень
export interface ExtendedGameBoard extends GameBoard {
  restrictedCells?: RestrictedCells; // Опціонально для зворотної сумісності
}

// Розширення CurrentGame для підтримки обмежень
export interface ExtendedCurrentGame extends Omit<CurrentGame, 'board'> {
  board: ExtendedGameBoard;
  restrictedCells: RestrictedCells; // Поточні заборонені клітинки
}

// Розширення AI гри
export interface ExtendedAIGame extends Omit<AIGame, keyof CurrentGame>, ExtendedCurrentGame {
  settings: AIGameSettings;
  aiThinking: boolean;
  aiSymbol: Player;
}

// Розширення PvP гри  
export interface ExtendedPvPGame extends Omit<PvPGame, keyof CurrentGame>, ExtendedCurrentGame {
  settings: PvPGameSettings;
  roomId: number | null;
  opponentName: string;
  waitingForOpponent: boolean;
  opponentSymbol: Player;
}

// Тип для валідації ходу
export interface MoveValidation {
  isValid: boolean;
  reason?: 'occupied' | 'restricted' | 'game-inactive';
  restrictedCells?: RestrictedCells;
}

// Тип для інформації про обмеження
export interface RestrictionInfo {
  hasRestrictions: boolean;
  restrictedCells: RestrictedCells;
  reasonDescription: string;
  affectedPlayer: Player | null;
}

// Розширення для GameEvent з підтримкою обмежень
export type ExtendedGameEvent = GameEvent 
  | { type: 'RESTRICTIONS_UPDATE'; payload: { restrictedCells: RestrictedCells; player: Player } }
  | { type: 'MOVE_INVALID'; payload: { reason: string; restrictedCells: RestrictedCells } };

// Утилітарний тип для перевірки чи є обмеження активними
export type HasRestrictions<T extends BoardSize> = T extends 4 ? true : false;

// Тип для конфігурації правил гри
export interface GameRules {
  boardSize: BoardSize;
  hasFirstMoveRestriction: boolean; // true для 4×4, false для 3×3
  restrictionPlayer: Player | null; // 'X' для 4×4, null для 3×3
  restrictionMove: number | null; // 2 для 4×4 (другий хід X), null для 3×3
}

// Функціональні типи для роботи з обмеженнями
export type GetRestrictedCellsFunction = (
  board: CellValue[],
  boardSize: BoardSize,
  currentPlayer: Player
) => RestrictedCells;

export type ValidateMoveFunction = (
  board: CellValue[],
  cellIndex: CellIndex,
  player: Player,
  boardSize: BoardSize
) => MoveValidation;

export type GetAdjacentCellsFunction = (
  cellIndex: CellIndex,
  boardSize: BoardSize
) => CellIndex[];

// Розширення утилітарних типів
export type ExtendedGameModeConfig<T extends GameMode> = 
  T extends 'ai' ? AIGameSettings :
  T extends 'pvp' ? PvPGameSettings :
  T extends 'tournament' ? TournamentSettings :
  never;

export type ExtendedGameInstance<T extends GameMode> = 
  T extends 'ai' ? ExtendedAIGame :
  T extends 'pvp' ? ExtendedPvPGame :
  never;

// Тип для debug інформації (опціонально)
export interface GameDebugInfo {
  currentRestrictions: RestrictedCells;
  moveHistory: Array<{
    player: Player;
    cellIndex: CellIndex;
    moveNumber: number;
    wasRestricted: boolean;
  }>;
  ruleState: {
    isSecondMoveForX: boolean;
    firstXPosition: CellIndex | null;
  };
}