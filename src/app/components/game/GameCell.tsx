'use client';

import React from 'react';
import Image from 'next/image';

interface GameCellProps {
  cell: string;
  index: number;
  isWinning: boolean;
  canClick: boolean;
  onClick: () => void;
  shouldShowIcons: boolean;
  decorativeIcon?: string;
  isRestricted: boolean;
  winIndex: number;
}

const GameCell = React.memo<GameCellProps>(({ 
  cell, 
  index, 
  isWinning, 
  canClick, 
  onClick, 
  shouldShowIcons, 
  decorativeIcon,
  isRestricted,
  winIndex 
}) => {
  // СКОПІЮВАТИ СЮДИ функцію getElectricEffects з рядків 309-332 GameSection.tsx
  const getElectricEffects = () => {
    if (!isWinning) return null;
    
    return (
      <>
        <div className="absolute top-0 left-1/2 w-1 h-1 bg-cyan-300 rounded-full animate-ping" 
             style={{ animationDelay: `${winIndex * 50}ms` }}></div>
        <div className="absolute bottom-0 right-1/2 w-1 h-1 bg-purple-400 rounded-full animate-ping" 
             style={{ animationDelay: `${winIndex * 50 + 200}ms` }}></div>
        <div className="absolute left-0 top-1/2 w-1 h-1 bg-pink-400 rounded-full animate-ping" 
             style={{ animationDelay: `${winIndex * 50 + 400}ms` }}></div>
        <div className="absolute right-0 bottom-1/2 w-1 h-1 bg-indigo-400 rounded-full animate-ping" 
             style={{ animationDelay: `${winIndex * 50 + 600}ms` }}></div>
        
        <div className="absolute top-1 right-1 w-0.5 h-0.5 bg-cyan-200 rounded-full animate-pulse" 
             style={{ animationDelay: `${winIndex * 100}ms` }}></div>
        <div className="absolute bottom-1 left-1 w-0.5 h-0.5 bg-purple-300 rounded-full animate-pulse" 
             style={{ animationDelay: `${winIndex * 100 + 300}ms` }}></div>
        <div className="absolute top-1 left-1 w-0.5 h-0.5 bg-pink-300 rounded-full animate-pulse" 
             style={{ animationDelay: `${winIndex * 100 + 500}ms` }}></div>
        <div className="absolute bottom-1 right-1 w-0.5 h-0.5 bg-indigo-300 rounded-full animate-pulse" 
             style={{ animationDelay: `${winIndex * 100 + 700}ms` }}></div>
      </>
    );
  };

  return (
    <button
      onClick={onClick}
      disabled={!canClick}
      title={isRestricted ? 'Заборонено правилами 4×4: другий хід не може бути поруч з першим' : undefined}
      style={isWinning ? { animationDelay: `${winIndex * 150}ms` } : {}}
      className={
        isWinning 
          ? 'aspect-square rounded-xl flex items-center justify-center text-2xl font-bold relative overflow-hidden animate-pulse bg-gradient-to-br from-purple-600 via-pink-500 to-indigo-800 scale-110 shadow-[0_0_30px_rgba(168,85,247,0.8)] border-2 border-purple-300'
          : `aspect-square rounded-xl flex items-center justify-center text-2xl font-bold transition-all duration-500 relative overflow-hidden
            ${shouldShowIcons ? 'bg-transparent border-2 border-white/20 hover:border-white/40' : 
              (isRestricted ? 'bg-white/20 hover:bg-white/30 cursor-not-allowed' : 'bg-white/20 hover:bg-white/30')}
            ${!canClick && !shouldShowIcons ? 'opacity-50' : ''}
            ${!canClick && !shouldShowIcons ? 'cursor-default' : ''}`
      }
    >
      {shouldShowIcons ? (
        <>
          <Image 
            src={decorativeIcon || '/game-icons/aijarvis.jpg'} 
            alt={`Декоративна іконка ${index + 1}`}
            priority
            width={64}
            height={64}
            className="absolute inset-0 w-full h-full object-cover rounded-lg
                    transition-all duration-300 hover:scale-110"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const parent = target.parentElement!;
              parent.classList.add('bg-gradient-to-br', 'from-purple-500/50', 'to-blue-500/50');
              parent.innerHTML += '<span class="absolute inset-0 flex items-center justify-center text-3xl">🎮</span>';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/10 rounded-lg"></div>
        </>
      ) : (
        <>
          <span className={`
            ${isWinning ? 'text-white font-black text-3xl drop-shadow-lg' : 'text-white/90'} 
            z-20 relative
          `}>
            {cell}
          </span>
          
          {getElectricEffects()}
        </>
      )}
    </button>
  );
});

GameCell.displayName = 'GameCell';

export default GameCell;