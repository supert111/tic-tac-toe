// interface GameCellProps {
//     value: string;
//     onClick: () => void;
//     isWinning: boolean;
//     disabled: boolean;
//   }
  
//   export default function GameCell({ value, onClick, isWinning, disabled }: GameCellProps) {
//     return (
//       <button
//         onClick={onClick}
//         disabled={disabled}
//         className={`
//           w-20 h-20 rounded-xl font-bold text-2xl transition-all duration-300
//           ${isWinning 
//             ? 'bg-gradient-to-br from-yellow-400 to-yellow-500 text-black shadow-lg animate-pulse' 
//             : 'bg-white/20 hover:bg-white/30 text-white shadow-md'
//           }
//           ${!disabled && !value ? 'hover:scale-105 hover:shadow-lg' : ''}
//           ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
//           flex items-center justify-center
//         `}
//       >
//         {value && (
//           <span className={`
//             ${value === 'X' ? 'text-blue-400' : 'text-red-400'}
//             ${isWinning ? 'text-black' : ''}
//             drop-shadow-lg
//           `}>
//             {value}
//           </span>
//         )}
//       </button>
//     );
//   }




// interface GameCellProps {
//   value: string;
//   onClick: () => void;
//   isWinning: boolean;
//   disabled: boolean;
// }

// export default function GameCell({ value, onClick, isWinning, disabled }: GameCellProps) {
//   return (
//     <button
//       onClick={onClick}
//       disabled={disabled}
//       className={`
//         w-16 h-16 lg:w-20 lg:h-20 rounded-xl font-bold text-xl lg:text-2xl transition-all duration-300
//         ${isWinning 
//           ? 'bg-gradient-to-br from-yellow-400 to-yellow-500 text-black shadow-lg animate-pulse' 
//           : 'bg-white/20 hover:bg-white/30 text-white shadow-md'
//         }
//         ${!disabled && !value ? 'hover:scale-105 hover:shadow-lg' : ''}
//         ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
//         flex items-center justify-center
//       `}
//     >
//       {value && (
//         <span className={`
//           ${value === 'X' ? 'text-blue-400' : 'text-red-400'}
//           ${isWinning ? 'text-black' : ''}
//           drop-shadow-lg
//         `}>
//           {value}
//         </span>
//       )}
//     </button>
//   );
// }





//src\app\components\game\GameCell.tsx

interface GameCellProps {
  value: string;
  onClick: () => void;
  isWinning: boolean;
  disabled: boolean;
}

export default function GameCell({ value, onClick, isWinning, disabled }: GameCellProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-16 h-16 lg:w-20 lg:h-20 rounded-xl font-bold text-xl lg:text-2xl transition-all duration-300
        ${isWinning 
          ? 'bg-gradient-to-br from-purple-400 to-purple-600 text-white shadow-lg animate-pulse border-2 border-purple-300' 
          : 'bg-gradient-to-br from-gray-700/60 via-purple-700/40 to-gray-700/60 hover:from-gray-600/70 hover:via-purple-600/50 hover:to-gray-600/70 text-white shadow-md border border-purple-400/20'
        }
        ${!disabled && !value ? 'hover:scale-105 hover:shadow-lg hover:border-purple-400/40' : ''}
        ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
        flex items-center justify-center
      `}
    >
      {value && (
        <span className={`
          ${value === 'X' ? 'text-purple-300' : 'text-pink-300'}
          ${isWinning ? 'text-white' : ''}
          drop-shadow-lg
        `}>
          {value}
        </span>
      )}
    </button>
  );
}