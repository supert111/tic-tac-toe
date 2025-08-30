// type GameMode = 'classic' | 'pro';

// interface GameModeSelectorProps {
//   gameMode: GameMode;
//   onModeChange: (mode: GameMode) => void;
// }

// export default function GameModeSelector({ gameMode, onModeChange }: GameModeSelectorProps) {
//   return (
//     <div className="mb-6">
//       <h3 className="text-lg font-semibold mb-4 text-center">🎯 Режим гри</h3>
//       <div className="flex justify-center gap-4">
//         <button
//           onClick={() => onModeChange('classic')}
//           className={`
//             px-6 py-3 rounded-2xl font-medium transition-all duration-300 transform
//             ${gameMode === 'classic'
//               ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg scale-105'
//               : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
//             }
//           `}
//         >
//           🎲 Класичний (3×3)
//         </button>
        
//         <button
//           onClick={() => onModeChange('pro')}
//           className={`
//             px-6 py-3 rounded-2xl font-medium transition-all duration-300 transform
//             ${gameMode === 'pro'
//               ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg scale-105'
//               : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
//             }
//           `}
//         >
//           🏆 Профі (4×4)
//         </button>
//       </div>
      
//       <div className="text-center mt-3 text-sm text-white/60">
//         {gameMode === 'classic' 
//           ? 'Збери 3 в ряд на полі 3×3' 
//           : 'Збери 3 в ряд на полі 4×4'
//         }
//       </div>
//     </div>
//   );
// }




type GameMode = 'classic' | 'pro';

interface GameModeSelectorProps {
  gameMode: GameMode;
  onModeChange: (mode: GameMode) => void;
}

export default function GameModeSelector({ gameMode, onModeChange }: GameModeSelectorProps) {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-4 text-center text-purple-200">🎯 Режим гри</h3>
      <div className="flex justify-center gap-4">
        <button
          onClick={() => onModeChange('classic')}
          className={`
            px-6 py-3 rounded-2xl font-medium transition-all duration-300 transform border
            ${gameMode === 'classic'
              ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg scale-105 border-purple-400'
              : 'bg-gradient-to-r from-gray-700/60 via-purple-700/40 to-gray-700/60 text-purple-200 hover:from-gray-600/70 hover:via-purple-600/50 hover:to-gray-600/70 hover:text-white border-purple-500/30'
            }
          `}
        >
          🎲 Класичний (3×3)
        </button>
        
        <button
          onClick={() => onModeChange('pro')}
          className={`
            px-6 py-3 rounded-2xl font-medium transition-all duration-300 transform border
            ${gameMode === 'pro'
              ? 'bg-gradient-to-r from-pink-600 to-pink-700 text-white shadow-lg scale-105 border-pink-400'
              : 'bg-gradient-to-r from-gray-700/60 via-purple-700/40 to-gray-700/60 text-purple-200 hover:from-gray-600/70 hover:via-purple-600/50 hover:to-gray-600/70 hover:text-white border-purple-500/30'
            }
          `}
        >
          🏆 Профі (4×4)
        </button>
      </div>
      
      <div className="text-center mt-3 text-sm text-purple-300">
        {gameMode === 'classic' 
          ? 'Збери 3 в ряд на полі 3×3' 
          : 'Збери 3 в ряд на полі 4×4'
        }
      </div>
    </div>
  );
}