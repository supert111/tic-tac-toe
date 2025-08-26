// Основні блоки констант:
// ✅ Базові налаштування - розміри дошки, таймер, символи
// ✅ AI конфігурація - складність, кольори, лейбли
// ✅ PvP налаштування - доступ, ставки, фільтри
// ✅ Стани та результати - всі можливі стани гри
// ✅ UI елементи - емодзі, стилі, кольори
// ✅ Локалізація - всі українські назви
// ✅ Валідація - мінімальні/максимальні значення
// ✅ Налаштування за замовчуванням - для всіх режимів
// Переваги:

// 🔒 Type-safe - всі константи типізовані
// 🌍 Локалізація - легко змінити мову
// 🎨 Консистентність - однакові стилі всюди
// ⚡ Продуктивність - не створюються нові об'єкти
// 🔧 Налаштування - легко змінити будь-які значення


import { translations } from '../lib/i18n/translations';

// Розміри дошки
export const BOARD_SIZES = {
    SMALL: 3,
    LARGE: 4
  } as const;
  
  // Таймер
  export const TIMER = {
    DEFAULT_TIME: 22,
    MAX_TIME: 22,
    WARNING_TIME: 7,  // червоний колір після 7 секунд
    CAUTION_TIME: 15  // жовтий колір після 15 секунд
  } as const;
  
  // Символи гравців
  export const PLAYER_SYMBOLS = {
    X: 'X',
    O: 'O'
  } as const;
  
  // Режими гри
  export const GAME_MODES = {
    AI: 'ai',
    PVP: 'pvp',
    TOURNAMENT: 'tournament'
  } as const;
  
  // Складність AI
  export const AI_DIFFICULTY = {
    EASY: 'easy',
    MEDIUM: 'medium',
    HARD: 'hard'
  } as const;
  
  // Складність AI з локалізацією
  export const AI_DIFFICULTY_LABELS = {
    [AI_DIFFICULTY.EASY]: 'Легка',
    [AI_DIFFICULTY.MEDIUM]: 'Середня',
    [AI_DIFFICULTY.HARD]: 'Важка'
  } as const;
  
  // Кольори складності AI
  export const AI_DIFFICULTY_COLORS = {
    [AI_DIFFICULTY.EASY]: 'from-green-500 to-green-600',
    [AI_DIFFICULTY.MEDIUM]: 'from-yellow-500 to-yellow-600',
    [AI_DIFFICULTY.HARD]: 'from-red-500 to-red-600'
  } as const;
  
  // Перший хід в AI грі
  export const AI_FIRST_MOVE = {
    PLAYER: 'player',
    AI: 'ai',
    RANDOM: 'random'
  } as const;
  
  // Перший хід в PvP грі
  export const PVP_FIRST_MOVE = {
    CREATOR: 'creator',
    OPPONENT: 'opponent',
    RANDOM: 'random'
  } as const;
  
  // Доступ до гри
  export const GAME_ACCESS = {
    PUBLIC: 'public',
    PRIVATE: 'private'
  } as const;
  
  // Стани гри
  export const GAME_STATES = {
    SETUP: 'setup',
    WAITING: 'waiting',
    PLAYING: 'playing',
    PAUSED: 'paused',
    FINISHED: 'finished'
  } as const;
  
  // Результати гри
  export const GAME_RESULTS = {
    WIN: 'win',
    LOSE: 'lose',
    DRAW: 'draw'
  } as const;
  
  // Таби головного меню
  export const GAME_TABS = {
    CREATE_GAME: 'create-game',
    CREATE_TOURNAMENT: 'create-tournament',
    AVAILABLE_GAMES: 'available-games'
  } as const;
  
  // Таби PvP
  export const PVP_TABS = {
    CREATE: 'create',
    AVAILABLE: 'available'
  } as const;
  
  // Типи модальних вікон
  export const MODAL_TYPES = {
    INFO: 'info',
    SUCCESS: 'success',
    ERROR: 'error',
    WARNING: 'warning'
  } as const;
  
  // Варіанти кнопок модального вікна
  export const MODAL_BUTTON_VARIANTS = {
    PRIMARY: 'primary',
    SECONDARY: 'secondary',
    DANGER: 'danger'
  } as const;
  
  // AI налаштування за замовчуванням
  export const DEFAULT_AI_SETTINGS = {
    boardSize: BOARD_SIZES.SMALL,
    playerSymbol: PLAYER_SYMBOLS.X,
    difficulty: AI_DIFFICULTY.MEDIUM,
    firstMove: AI_FIRST_MOVE.RANDOM,
    gameMode: GAME_MODES.AI
  } as const;
  
  // PvP налаштування за замовчуванням
  export const DEFAULT_PVP_SETTINGS = {
    boardSize: BOARD_SIZES.SMALL,
    playerSymbol: PLAYER_SYMBOLS.X,
    firstMove: PVP_FIRST_MOVE.RANDOM,
    hasStake: false,
    stakeAmount: '',
    gameAccess: GAME_ACCESS.PUBLIC,
    gameMode: GAME_MODES.PVP
  } as const;
  
  // Турнір налаштування за замовчуванням
  export const DEFAULT_TOURNAMENT_SETTINGS = {
    name: '',
    participants: 4,
    prizePool: '',
    boardSize: BOARD_SIZES.SMALL,
    playerSymbol: PLAYER_SYMBOLS.X,
    gameMode: GAME_MODES.TOURNAMENT
  } as const;
  
  // Кількість учасників турніру
  export const TOURNAMENT_PARTICIPANTS = [4, 8, 16] as const;
  
  // Час затримки для AI (мілісекунди)
  export const AI_THINKING_TIME = {
    MIN: 500,
    MAX: 1500
  } as const;
  
  // Фільтри для PvP ігор
  export const PVP_FILTERS = {
    STAKE: {
      FREE: 'free',
      PAID: 'paid'
    }
  } as const;
  
  // Розміри ігрового поля (для адаптивності)
  export const GAME_BOARD_SIZES = {
    MOBILE: {
      WIDTH_3X3: '220px',
      WIDTH_4X4: '280px'
    },
    DESKTOP: {
      WIDTH_3X3: '260px',
      WIDTH_4X4: '320px'
    }
  } as const;
  
  // Емодзі для UI
  export const GAME_EMOJIS = {
    ROBOT: '🤖',
    VERSUS: '🆚',
    TROPHY: '🏆',
    GAME: '🎮',
    FIRE: '🔥',
    TARGET: '🎯',
    SETTINGS: '⚙️',
    TIMER: '⏱️',
    WIN: '🎉',
    LOSE: '😔',
    DRAW: '🤝',
    THINKING: '🤔',
    RANDOM: '🎲',
    LOCK: '🔒',
    UNLOCK: '🔓',
    REFRESH: '🔄',
    SEARCH: '🔍',
    FILTER: '🔍',
    INFO: 'ℹ️',
    WARNING: '⚠️',
    ERROR: '❌',
    SUCCESS: '✅'
  } as const;
  
  // Стилі для різних станів
  export const GAME_STYLES = {
    COLORS: {
      PRIMARY: 'from-purple-500 to-purple-700',
      SUCCESS: 'from-green-500 to-green-700',
      DANGER: 'from-red-500 to-red-700',
      WARNING: 'from-yellow-500 to-yellow-700',
      INFO: 'from-blue-500 to-blue-700',
      GRAY: 'from-gray-500 to-gray-700'
    },
    TIMER: {
      NORMAL: 'bg-green-500',
      WARNING: 'bg-yellow-500',
      DANGER: 'bg-red-500'
    }
  } as const;
  
  // Мережеві події (для майбутнього WebSocket)
  export const NETWORK_EVENTS = {
    GAME_MOVE: 'MOVE',
    GAME_START: 'GAME_START',
    GAME_END: 'GAME_END',
    PLAYER_JOIN: 'PLAYER_JOIN',
    PLAYER_LEAVE: 'PLAYER_LEAVE',
    TIMER_UPDATE: 'TIMER_UPDATE',
    ROOM_CREATED: 'ROOM_CREATED',
    ROOM_JOINED: 'ROOM_JOINED'
  } as const;
  
  // Локалізація
  // Статичні лейбли (fallback для української мови)
  export const GAME_LABELS = {
    MODES: {
      [GAME_MODES.AI]: 'Гра проти ШІ',
      [GAME_MODES.PVP]: 'Гра проти гравця',
      [GAME_MODES.TOURNAMENT]: 'Турнір'
    },
    SYMBOLS: {
      [PLAYER_SYMBOLS.X]: 'Хрестик',
      [PLAYER_SYMBOLS.O]: 'Нулик'
    },
    FIRST_MOVE: {
      [AI_FIRST_MOVE.PLAYER]: 'Гравець',
      [AI_FIRST_MOVE.AI]: 'Комп\'ютер',
      [AI_FIRST_MOVE.RANDOM]: 'Випадково',
      [PVP_FIRST_MOVE.CREATOR]: 'Створювач',
      [PVP_FIRST_MOVE.OPPONENT]: 'Опонент'
    },
    ACCESS: {
      [GAME_ACCESS.PUBLIC]: 'Публічна',
      [GAME_ACCESS.PRIVATE]: 'Приватна'
    },
    RESULTS: {
      [GAME_RESULTS.WIN]: 'Перемога',
      [GAME_RESULTS.LOSE]: 'Поразка',
      [GAME_RESULTS.DRAW]: 'Нічия'
    }
  } as const;
  
  // Валідація
  export const VALIDATION = {
    STAKE: {
      MIN: 0.01,
      MAX: 1000
    },
    TOURNAMENT_NAME: {
      MIN_LENGTH: 3,
      MAX_LENGTH: 50
    },
    PRIZE_POOL: {
      MIN: 0,
      MAX: 10000
    }
  } as const;


  // Динамічні лейбли з використанням translations
export const getGameLabels = (language: 'uk' | 'en') => ({
  SYMBOLS: {
    [PLAYER_SYMBOLS.X]: translations[language].gameLabels.symbols.X,
    [PLAYER_SYMBOLS.O]: translations[language].gameLabels.symbols.O
  },
  MODES: {
    [GAME_MODES.AI]: translations[language].gameMode.ai,
    [GAME_MODES.PVP]: translations[language].gameMode.pvp,
    [GAME_MODES.TOURNAMENT]: translations[language].tournaments.title.replace('🏆 ', '')
  }
  // При потребі додавати інші лейбли
});