// 'use client'

// import { useState } from 'react'
// import WalletConnection from './components/WalletConnection'

// export default function Home() {
//   const [gameBoard, setGameBoard] = useState(Array(9).fill(null))
//   const [currentPlayer, setCurrentPlayer] = useState('X')
//   const [gameActive, setGameActive] = useState(true)
//   const [connectedAccount, setConnectedAccount] = useState('')

//   // Перевірка переможця
//   const checkWinner = (board: (string | null)[]): boolean => {
//     const winningConditions = [
//       [0, 1, 2], [3, 4, 5], [6, 7, 8], // горизонталі
//       [0, 3, 6], [1, 4, 7], [2, 5, 8], // вертикалі
//       [0, 4, 8], [2, 4, 6] // діагоналі
//     ]
    
//     return winningConditions.some(condition => {
//       const [a, b, c] = condition
//       return board[a] && board[a] === board[b] && board[a] === board[c]
//     })
//   }

//   // Перезапуск гри
//   const resetGame = () => {
//     setGameBoard(Array(9).fill(null))
//     setCurrentPlayer('X')
//     setGameActive(true)
//   }

//   // Обробник підключення гаманця
//   const handleWalletConnect = (account: string) => {
//     setConnectedAccount(account)
//     console.log('Гаманець підключено в головному компоненті:', account)
//   }

//   // Обробник кліку по клітинці
//   const handleCellClick = (index: number) => {
//     if (gameBoard[index] || !gameActive) return

//     const newBoard = [...gameBoard]
//     newBoard[index] = currentPlayer
//     setGameBoard(newBoard)

//     if (checkWinner(newBoard)) {
//       setGameActive(false)
//       alert(`Гравець ${currentPlayer} переміг!`)
//     } else if (newBoard.every(cell => cell !== null)) {
//       setGameActive(false)
//       alert('Нічия!')
//     } else {
//       setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X')
//     }
//   }

//   return (
//     <div className="min-h-screen bg-gray-900 text-white p-8">
//       <div className="max-w-md mx-auto">
//         <h1 className="text-4xl font-bold text-center mb-8">Хрестики-Нулики</h1>
        
//         {/* Підключення гаманця */}
//         <div className="mb-6">
//           <WalletConnection onWalletConnect={handleWalletConnect} />
//         </div>

//         {/* Ігрове поле */}
//         <div className="grid grid-cols-3 gap-2 mb-6">
//           {gameBoard.map((cell, index) => (
//             <button
//               key={index}
//               onClick={() => handleCellClick(index)}
//               className="w-20 h-20 bg-gray-700 hover:bg-gray-600 border border-gray-500 text-2xl font-bold"
//             >
//               {cell}
//             </button>
//           ))}
//         </div>

//         {/* Інформація про поточного гравця */}
//         <div className="text-center mb-4">
//           {gameActive ? (
//             <p className="text-xl">Хід гравця: <span className="font-bold">{currentPlayer}</span></p>
//           ) : (
//             <p className="text-xl text-red-400">Гра завершена</p>
//           )}
//         </div>

//         {/* Кнопка перезапуску */}
//         <div className="text-center">
//           <button 
//             onClick={resetGame}
//             className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded font-bold"
//           >
//             Нова гра
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }

















// import GameBoard from './components/game/GameBoard';
// import TournamentSection from './components/ui/TournamentSection';
// import Leaderboard from './components/ui/Leaderboard';
// import WalletConnection from './components/ui/WalletConnection';


// export default function Home() {
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-600 to-purple-800 text-white p-5">
//       <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
//         {/* Ігрова секція */}
//         <div className="lg:col-span-1">
//           <GameBoard />
//         </div>
        
//         <div>
//           <h1>Головна сторінка</h1>
//           <WalletConnection />
//         </div>
        
//         {/* Секція турнірів */}
//         <div className="lg:col-span-1">
//           <TournamentSection />
//         </div>
        
//         {/* Лідерборд */}
//         <div className="lg:col-span-1">
//           <Leaderboard />
//         </div>
//       </div>
//     </div>
//   );
// }





// import GameBoard from './components/game/GameBoard';
// import TournamentSection from './components/ui/TournamentSection';
// import Leaderboard from './components/ui/Leaderboard';
// import WalletConnection from './components/ui/WalletConnection';


// export default function Home() {
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-600 to-purple-800 text-white p-4">
//       <div className="max-w-7xl mx-auto">
//         {/* Десктопна версія */}
//         <div className="hidden lg:grid lg:grid-cols-3 gap-4 items-start">
//           {/* Лідерборд зліва */}
//           <div className="lg:col-span-1">
//             <Leaderboard />
//           </div>

//           {/* Центр - Хрестики-нулики */}
//           <div className="lg:col-span-1">
//             <GameBoard />
//           </div>

//           {/* Права колонка */}
//           <div className="lg:col-span-1 space-y-4">
//             {/* Гаманець вгорі */}
//             <div className="relative bg-white/10 backdrop-blur-md rounded-3xl p-6 shadow-2xl z-[30]">
//               {/* <h2 className="sr-only">💳 Гаманець</h2> */}
//               <h2 className="text-2xl font-bold mb-4 text-center">💳 Гаманець</h2>
//               <WalletConnection />
//             </div>
            
//             {/* Турніри внизу */}
//             <TournamentSection />
//           </div>
//         </div>

//         {/* Мобільна версія */}
//         <div className="lg:hidden space-y-4">
//           {/* Хрестики-нулики вгорі */}
//           <GameBoard />
          
//           {/* Гаманець */}
//           <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 shadow-2xl relative">
//             {/* <h2 className="sr-only">💳 Гаманець</h2> */}
//             <h2 className="text-2xl font-bold mb-4 text-center">💳 Гаманець</h2>
//             <WalletConnection />
//           </div>

//           {/* Турніри */}
//           <TournamentSection />

//           {/* Лідерборд */}
//           <Leaderboard />
//         </div>
//       </div>
//     </div>
//   );
// }



















// import GameBoard from './components/game/GameBoard';
// import TournamentSection from './components/ui/TournamentSection';
// import Leaderboard from './components/ui/Leaderboard';
// import WalletConnection from './components/ui/WalletConnection';

// export default function Home() {
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white p-4">
//       <div className="max-w-7xl mx-auto">
//         {/* Десктопна версія */}
//         <div className="hidden lg:grid lg:grid-cols-3 gap-4 items-start">
//           {/* Лідерборд зліва */}
//           <div className="lg:col-span-1">
//             <Leaderboard />
//           </div>

//           {/* Центр - Хрестики-нулики */}
//           <div className="lg:col-span-1">
//             <GameBoard />
//           </div>

//           {/* Права колонка */}
//           <div className="lg:col-span-1 space-y-4">
//             {/* Гаманець вгорі */}
//             <div className="relative bg-gradient-to-br from-gray-800/50 via-purple-800/50 to-gray-800/50 backdrop-blur-md rounded-3xl p-6 shadow-2xl z-[30] border border-purple-500/20">
//               <h2 className="text-2xl font-bold mb-4 text-center">💳 Гаманець</h2>
//               <WalletConnection />
//             </div>
            
//             {/* Турніри внизу */}
//             <TournamentSection />
//           </div>
//         </div>

//         {/* Мобільна версія */}
//         <div className="lg:hidden space-y-4">
//           {/* Хрестики-нулики вгорі */}
//           <GameBoard />
          
//           {/* Гаманець */}
//           <div className="bg-gradient-to-br from-gray-800/50 via-purple-800/50 to-gray-800/50 backdrop-blur-md rounded-3xl p-6 shadow-2xl relative border border-purple-500/20">
//             <h2 className="text-2xl font-bold mb-4 text-center">💳 Гаманець</h2>
//             <WalletConnection />
//           </div>

//           {/* Турніри */}
//           <TournamentSection />

//           {/* Лідерборд */}
//           <Leaderboard />
//         </div>
//       </div>
//     </div>
//   );
// }























//import GameBoard from './components/game/GameBoard';
import TournamentSection from './components/ui/TournamentSection';
//import Leaderboard from './components/ui/Leaderboard';
import RightPanel from './components/ui/RightPanel';
import GameSection from './components/game/sections/GameSection';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white p-4">
      <div className="max-w-7xl mx-auto">
        {/* Десктопна версія */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-4 items-start">
          {/* Турніри зліва (раніше був лідерборд) */}
          <div className="lg:col-span-1">
            <TournamentSection />
          </div>

          {/* Центр - Хрестики-нулики */}
          <div className="lg:col-span-1">
            {/* <GameBoard /> */}
            <GameSection />
          </div>

          {/* Права колонка з табами */}
          <div className="lg:col-span-1">
            <RightPanel />
          </div>
        </div>

        {/* Мобільна версія */}
        <div className="lg:hidden space-y-4">
          {/* Хрестики-нулики вгорі */}
          <GameSection />
          
          {/* Права панель (гаманець + таби) */}
          <RightPanel />

          {/* Турніри - ПРИХОВУЄМО на мобільній версії */}
          <div className="xl:hidden space-y-4">
            <TournamentSection />
          </div>
        </div>
      </div>
    </div>
  );
}





































