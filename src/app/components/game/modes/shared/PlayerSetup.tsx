// interface PlayerSetupProps {
//     playerXName: string;
//     playerOName: string;
//     onPlayerXChange: (name: string) => void;
//     onPlayerOChange: (name: string) => void;
//   }
  
//   export default function PlayerSetup({ 
//     playerXName, 
//     playerOName, 
//     onPlayerXChange, 
//     onPlayerOChange 
//   }: PlayerSetupProps) {
//     return (
//       <div className="mb-6">
//         <h3 className="text-lg font-semibold mb-4 text-center">👥 Налаштування гравців</h3>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
//             <label className="block text-sm font-medium mb-2 text-blue-300">
//               🔵 Гравець X
//             </label>
//             <input
//               type="text"
//               value={playerXName}
//               onChange={(e) => onPlayerXChange(e.target.value)}
//               className="w-full px-4 py-2 rounded-xl bg-white/20 border border-white/30 
//                          text-white placeholder-white/50 focus:outline-none focus:ring-2 
//                          focus:ring-blue-400 focus:border-transparent transition-all duration-300"
//               placeholder="Введіть ім'я гравця X"
//               maxLength={20}
//             />
//           </div>
          
//           <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
//             <label className="block text-sm font-medium mb-2 text-red-300">
//               🔴 Гравець O
//             </label>
//             <input
//               type="text"
//               value={playerOName}
//               onChange={(e) => onPlayerOChange(e.target.value)}
//               className="w-full px-4 py-2 rounded-xl bg-white/20 border border-white/30 
//                          text-white placeholder-white/50 focus:outline-none focus:ring-2 
//                          focus:ring-red-400 focus:border-transparent transition-all duration-300"
//               placeholder="Введіть ім'я гравця O"
//               maxLength={20}
//             />
//           </div>
//         </div>
//       </div>
//     );
//   }










interface PlayerSetupProps {
  playerXName: string;
  playerOName: string;
  onPlayerXChange: (name: string) => void;
  onPlayerOChange: (name: string) => void;
}

export default function PlayerSetup({ 
  playerXName, 
  playerOName, 
  onPlayerXChange, 
  onPlayerOChange 
}: PlayerSetupProps) {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-4 text-center text-purple-200">👥 Налаштування гравців</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-gray-700/40 via-purple-700/30 to-gray-700/40 backdrop-blur-sm rounded-2xl p-4 border border-purple-500/20">
          <label className="block text-sm font-medium mb-2 text-purple-300">
            🔵 Гравець X
          </label>
          <input
            type="text"
            value={playerXName}
            onChange={(e) => onPlayerXChange(e.target.value)}
            className="w-full px-4 py-2 rounded-xl bg-gray-800/60 border border-purple-400/30 
                       text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 
                       focus:ring-purple-500 focus:border-transparent transition-all duration-300"
            placeholder="Введіть ім'я гравця X"
            maxLength={20}
          />
        </div>
        
        <div className="bg-gradient-to-br from-gray-700/40 via-purple-700/30 to-gray-700/40 backdrop-blur-sm rounded-2xl p-4 border border-purple-500/20">
          <label className="block text-sm font-medium mb-2 text-pink-300">
            🔴 Гравець O
          </label>
          <input
            type="text"
            value={playerOName}
            onChange={(e) => onPlayerOChange(e.target.value)}
            className="w-full px-4 py-2 rounded-xl bg-gray-800/60 border border-purple-400/30 
                       text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 
                       focus:ring-pink-500 focus:border-transparent transition-all duration-300"
            placeholder="Введіть ім'я гравця O"
            maxLength={20}
          />
        </div>
      </div>
    </div>
  );
}