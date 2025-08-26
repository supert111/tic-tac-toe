// interface GameModalProps {
//     show: boolean;
//     title: string;
//     message: string;
//     onClose: () => void;
//   }
  
//   export default function GameModal({ show, title, message, onClose }: GameModalProps) {
//     if (!show) return null;
  
//     return (
//       <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
//         <div className="bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/20 max-w-md w-full mx-4 transform animate-pulse">
//           <div className="text-center">
//             <h2 className="text-3xl font-bold mb-4 text-white">
//               {title}
//             </h2>
            
//             <p className="text-lg text-white/90 mb-6 leading-relaxed">
//               {message}
//             </p>
            
//             <div className="flex justify-center gap-4">
//               <button
//                 onClick={onClose}
//                 className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 
//                            px-6 py-3 rounded-full font-bold text-white shadow-lg hover:shadow-xl 
//                            transform hover:-translate-y-1 transition-all duration-300"
//               >
//                 ✨ Продовжити
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }









interface GameModalProps {
  show: boolean;
  title: string;
  message: string;
  onClose: () => void;
}

export default function GameModal({ show, title, message, onClose }: GameModalProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-gray-800/90 via-purple-800/90 to-gray-800/90 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-purple-400/30 max-w-md w-full mx-4 transform animate-pulse">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4 text-white">
            {title}
          </h2>
          
          <p className="text-lg text-purple-100 mb-6 leading-relaxed">
            {message}
          </p>
          
          <div className="flex justify-center gap-4">
            <button
              onClick={onClose}
              className="bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 
                         px-6 py-3 rounded-full font-bold text-white shadow-lg hover:shadow-xl 
                         transform hover:-translate-y-1 transition-all duration-300 border border-purple-400/30"
            >
              ✨ Продовжити
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}