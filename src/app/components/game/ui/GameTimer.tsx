// // components/game/ui/GameTimer.tsx
// // Компонент таймера для гри з візуальним прогресом
// // ✅ Анімований круговий прогрес-бар
// // ✅ Кольорова індикація (зелений → жовтий → червоний)
// // ✅ Форматований час та відсотки
// // ✅ Адаптивний дизайн

// 'use client';

// import React from 'react';
// import { Clock } from 'lucide-react';

// interface GameTimerProps {
//   // Основні дані таймера
//   timeLeft: number;
//   maxTime: number;
//   isRunning: boolean;
//   isPaused: boolean;
  
//   // Налаштування відображення
//   showPercentage?: boolean;
//   showIcon?: boolean;
//   size?: 'small' | 'medium' | 'large';
  
//   // Кастомні стилі
//   className?: string;
  
//   // Опціональні дії
//   onTimeUp?: () => void;
//   onClick?: () => void;
// }

// // Форматування часу
// function formatTime(seconds: number): string {
//   if (seconds <= 0) return '0:00';
  
//   const minutes = Math.floor(seconds / 60);
//   const remainingSeconds = seconds % 60;
  
//   if (minutes > 0) {
//     return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
//   }
  
//   return `0:${remainingSeconds.toString().padStart(2, '0')}`;
// }

// // Отримання кольору залежно від часу
// function getTimerColor(timeLeft: number, maxTime: number): {
//   bgColor: string;
//   textColor: string;
//   strokeColor: string;
// } {
//   const percentage = (timeLeft / maxTime) * 100;
  
//   if (percentage <= 20) {
//     return {
//       bgColor: 'bg-red-500/20',
//       textColor: 'text-red-600',
//       strokeColor: 'stroke-red-500'
//     };
//   }
  
//   if (percentage <= 50) {
//     return {
//       bgColor: 'bg-yellow-500/20',
//       textColor: 'text-yellow-600',
//       strokeColor: 'stroke-yellow-500'
//     };
//   }
  
//   return {
//     bgColor: 'bg-green-500/20',
//     textColor: 'text-green-600',
//     strokeColor: 'stroke-green-500'
//   };
// }

// // Розміри для різних варіантів
// const sizeConfig = {
//   small: {
//     container: 'w-16 h-16',
//     svg: 'w-14 h-14',
//     text: 'text-xs',
//     radius: 22,
//     strokeWidth: 3
//   },
//   medium: {
//     container: 'w-20 h-20',
//     svg: 'w-18 h-18',
//     text: 'text-sm',
//     radius: 28,
//     strokeWidth: 4
//   },
//   large: {
//     container: 'w-24 h-24',
//     svg: 'w-22 h-22',
//     text: 'text-base',
//     radius: 34,
//     strokeWidth: 5
//   }
// };

// export default function GameTimer({
//   timeLeft,
//   maxTime,
//   isRunning,
//   isPaused,
//   showPercentage = false,
//   showIcon = true,
//   size = 'medium',
//   className = '',
//   onTimeUp,
//   onClick
// }: GameTimerProps) {
  
//   // Розрахунки
//   const percentage = Math.max(0, Math.min(100, (timeLeft / maxTime) * 100));
//   const colors = getTimerColor(timeLeft, maxTime);
//   const config = sizeConfig[size];
  
//   // Розрахунки для SVG кругового прогресу
//   const circumference = 2 * Math.PI * config.radius;
//   const strokeDasharray = circumference;
//   const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
//   // Ефект закінчення часу
//   React.useEffect(() => {
//     if (timeLeft <= 0 && isRunning) {
//       onTimeUp?.();
//     }
//   }, [timeLeft, isRunning, onTimeUp]);
  
//   return (
//     <div
//       className={`
//         relative inline-flex items-center justify-center
//         ${config.container}
//         ${colors.bgColor}
//         rounded-full
//         transition-all duration-300 ease-in-out
//         ${onClick ? 'cursor-pointer hover:scale-105' : ''}
//         ${isPaused ? 'opacity-60' : ''}
//         ${className}
//       `}
//       onClick={onClick}
//       title={`${formatTime(timeLeft)} залишилось`}
//     >
//       {/* Круговий прогрес */}
//       <svg
//         className={`absolute ${config.svg} transform -rotate-90`}
//         viewBox={`0 0 ${config.radius * 2 + config.strokeWidth * 2} ${config.radius * 2 + config.strokeWidth * 2}`}
//       >
//         {/* Фоновий круг */}
//         <circle
//           cx={config.radius + config.strokeWidth}
//           cy={config.radius + config.strokeWidth}
//           r={config.radius}
//           fill="none"
//           stroke="currentColor"
//           strokeWidth={config.strokeWidth}
//           className="text-gray-300/30"
//         />
        
//         {/* Прогрес круг */}
//         <circle
//           cx={config.radius + config.strokeWidth}
//           cy={config.radius + config.strokeWidth}
//           r={config.radius}
//           fill="none"
//           strokeWidth={config.strokeWidth}
//           strokeDasharray={strokeDasharray}
//           strokeDashoffset={strokeDashoffset}
//           strokeLinecap="round"
//           className={`
//             ${colors.strokeColor}
//             transition-all duration-1000 ease-out
//             ${isRunning ? 'animate-pulse' : ''}
//           `}
//           style={{
//             filter: timeLeft <= maxTime * 0.2 ? 'drop-shadow(0 0 4px currentColor)' : 'none'
//           }}
//         />
//       </svg>
      
//       {/* Контент */}
//       <div className={`
//         relative flex flex-col items-center justify-center
//         ${colors.textColor}
//         ${config.text}
//         font-semibold
//       `}>
//         {showIcon && (
//           <Clock 
//             className={`
//               w-3 h-3 mb-0.5
//               ${isRunning && !isPaused ? 'animate-spin' : ''}
//             `}
//             style={{ animationDuration: '2s' }} 
//           />
//         )}
        
//         <span className="leading-none">
//           {showPercentage ? `${Math.round(percentage)}%` : formatTime(timeLeft)}
//         </span>
        
//         {/* Статус індикатор */}
//         {isPaused && (
//           <div className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
//         )}
        
//         {!isRunning && !isPaused && timeLeft > 0 && (
//           <div className="absolute -top-1 -right-1 w-2 h-2 bg-gray-400 rounded-full" />
//         )}
//       </div>
      
//       {/* Ефект мигання при критичному часі */}
//       {timeLeft <= 3 && timeLeft > 0 && isRunning && (
//         <div className={`
//           absolute inset-0 rounded-full
//           ${colors.bgColor}
//           animate-ping
//         `} />
//       )}
//     </div>
//   );
// }

// // Компонент з додатковою інформацією
// interface GameTimerExtendedProps extends GameTimerProps {
//   label?: string;
//   totalTime?: number;
//   showProgress?: boolean;
// }

// export function GameTimerExtended({
//   label = 'Час на хід',
//   totalTime,
//   showProgress = true,
//   ...timerProps
// }: GameTimerExtendedProps) {
//   const percentage = (timerProps.timeLeft / timerProps.maxTime) * 100;
  
//   return (
//     <div className="flex flex-col items-center space-y-2">
//       {/* Лейбл */}
//       <span className="text-sm font-medium text-gray-600">
//         {label}
//       </span>
      
//       {/* Основний таймер */}
//       <GameTimer {...timerProps} />
      
//       {/* Додаткова інформація */}
//       <div className="flex flex-col items-center space-y-1 text-xs text-gray-500">
//         {showProgress && (
//           <div className="flex items-center space-x-2">
//             <span>Прогрес:</span>
//             <div className="w-16 h-1 bg-gray-200 rounded-full overflow-hidden">
//               <div 
//                 className={`h-full transition-all duration-300 ${
//                   percentage <= 20 ? 'bg-red-500' :
//                   percentage <= 50 ? 'bg-yellow-500' : 'bg-green-500'
//                 }`}
//                 style={{ width: `${percentage}%` }}
//               />
//             </div>
//             <span>{Math.round(percentage)}%</span>
//           </div>
//         )}
        
//         {totalTime && (
//           <span>
//             Загальний час: {formatTime(totalTime)}
//           </span>
//         )}
//       </div>
//     </div>
//   );
// }

// // Міні версія таймера для статус барів
// export function GameTimerMini({
//   timeLeft,
//   maxTime,
//   className = ''
// }: Pick<GameTimerProps, 'timeLeft' | 'maxTime' | 'className'>) {
//   const percentage = (timeLeft / maxTime) * 100;
//   const colors = getTimerColor(timeLeft, maxTime);
  
//   return (
//     <div className={`flex items-center space-x-2 ${className}`}>
//       <Clock className={`w-4 h-4 ${colors.textColor}`} />
//       <span className={`text-sm font-medium ${colors.textColor}`}>
//         {formatTime(timeLeft)}
//       </span>
//       <div className="w-8 h-1 bg-gray-200 rounded-full overflow-hidden">
//         <div 
//           className={`h-full transition-all duration-300 ${
//             percentage <= 20 ? 'bg-red-500' :
//             percentage <= 50 ? 'bg-yellow-500' : 'bg-green-500'
//           }`}
//           style={{ width: `${percentage}%` }}
//         />
//       </div>
//     </div>
//   );
// }






































// components/game/ui/GameTimer.tsx
// Компонент таймера для гри з візуальним прогресом
// ✅ Анімований круговий прогрес-бар
// ✅ Кольорова індикація (зелений → жовтий → червоний)
// ✅ Форматований час та відсотки
// ✅ Адаптивний дизайн

'use client';

import React from 'react';
import { Clock } from 'lucide-react';

interface GameTimerProps {
  // Основні дані таймера
  timeLeft: number;
  maxTime: number;
  isRunning: boolean;
  isPaused: boolean;
  
  // Налаштування відображення
  showPercentage?: boolean;
  showIcon?: boolean;
  size?: 'small' | 'medium' | 'large';
  
  // Кастомні стилі
  className?: string;
  
  // Опціональні дії
  onTimeUp?: () => void;
  onClick?: () => void;
}

// Форматування часу
function formatTime(seconds: number): string {
  if (seconds <= 0) return '0:00';
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  if (minutes > 0) {
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  
  return `0:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Отримання кольору залежно від часу
function getTimerColor(timeLeft: number, maxTime: number): {
  bgColor: string;
  textColor: string;
  strokeColor: string;
} {
  const percentage = (timeLeft / maxTime) * 100;
  
  if (percentage <= 20) {
    return {
      bgColor: 'bg-red-500/20',
      textColor: 'text-red-600',
      strokeColor: 'stroke-red-500'
    };
  }
  
  if (percentage <= 50) {
    return {
      bgColor: 'bg-yellow-500/20',
      textColor: 'text-yellow-600',
      strokeColor: 'stroke-yellow-500'
    };
  }
  
  return {
    bgColor: 'bg-green-500/20',
    textColor: 'text-green-600',
    strokeColor: 'stroke-green-500'
  };
}

// Розміри для різних варіантів
const sizeConfig = {
  small: {
    container: 'w-6 h-6',  // ← Зменшуємо для міні версії
    svg: 'w-6 h-6',
    text: 'text-[10px]',   // ← Дуже маленький шрифт
    radius: 8,             // ← Маленький радіус
    strokeWidth: 2
  },
  medium: {
    container: 'w-20 h-20',
    svg: 'w-18 h-18',
    text: 'text-sm',
    radius: 28,
    strokeWidth: 4
  },
  large: {
    container: 'w-24 h-24',
    svg: 'w-22 h-22',
    text: 'text-base',
    radius: 34,
    strokeWidth: 5
  }
};

export default function GameTimer({
  timeLeft,
  maxTime,
  isRunning,
  isPaused,
  showPercentage = false,
  showIcon = true,
  size = 'medium',
  className = '',
  onTimeUp,
  onClick
}: GameTimerProps) {
  
  // Розрахунки
  const percentage = Math.max(0, Math.min(100, (timeLeft / maxTime) * 100));
  const colors = getTimerColor(timeLeft, maxTime);
  const config = sizeConfig[size];
  
  // Розрахунки для SVG кругового прогресу
  const circumference = 2 * Math.PI * config.radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  // Ефект закінчення часу
  React.useEffect(() => {
    if (timeLeft <= 0 && isRunning) {
      onTimeUp?.();
    }
  }, [timeLeft, isRunning, onTimeUp]);
  
  return (
    <div
      className={`
        relative inline-flex items-center justify-center
        ${config.container}
        ${colors.bgColor}
        rounded-full
        transition-all duration-300 ease-in-out
        ${onClick ? 'cursor-pointer hover:scale-105' : ''}
        ${isPaused ? 'opacity-60' : ''}
        ${className}
      `}
      onClick={onClick}
      title={`${formatTime(timeLeft)} залишилось`}
    >
      {/* Круговий прогрес */}
      <svg
        className={`absolute ${config.svg} transform -rotate-90`}
        viewBox={`0 0 ${config.radius * 2 + config.strokeWidth * 2} ${config.radius * 2 + config.strokeWidth * 2}`}
      >
        {/* Фоновий круг */}
        <circle
          cx={config.radius + config.strokeWidth}
          cy={config.radius + config.strokeWidth}
          r={config.radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={config.strokeWidth}
          className="text-gray-300/30"
        />
        
        {/* Прогрес круг */}
        <circle
          cx={config.radius + config.strokeWidth}
          cy={config.radius + config.strokeWidth}
          r={config.radius}
          fill="none"
          strokeWidth={config.strokeWidth}
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={`
            ${colors.strokeColor}
            transition-all duration-1000 ease-out
            ${isRunning ? 'animate-pulse' : ''}
          `}
          style={{
            filter: timeLeft <= maxTime * 0.2 ? 'drop-shadow(0 0 4px currentColor)' : 'none'
          }}
        />
      </svg>
      
      {/* Контент */}
      <div className={`
        relative flex flex-col items-center justify-center
        ${colors.textColor}
        ${config.text}
        font-semibold
      `}>
        {showIcon && (
          <Clock 
            className={`
              w-3 h-3 mb-0.5
              ${isRunning && !isPaused ? 'animate-spin' : ''}
            `}
            style={{ animationDuration: '2s' }} 
          />
        )}
        
        <span className="leading-none">
          {showPercentage ? `${Math.round(percentage)}%` : formatTime(timeLeft)}
        </span>
        
        {/* Статус індикатор */}
        {isPaused && (
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
        )}
        
        {!isRunning && !isPaused && timeLeft > 0 && (
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-gray-400 rounded-full" />
        )}
      </div>
      
      {/* Ефект мигання при критичному часі */}
      {timeLeft <= 3 && timeLeft > 0 && isRunning && (
        <div className={`
          absolute inset-0 rounded-full
          ${colors.bgColor}
          animate-ping
        `} />
      )}
    </div>
  );
}

// Компонент з додатковою інформацією
interface GameTimerExtendedProps extends GameTimerProps {
  label?: string;
  totalTime?: number;
  showProgress?: boolean;
}

export function GameTimerExtended({
  label = 'Час на хід',
  totalTime,
  showProgress = true,
  ...timerProps
}: GameTimerExtendedProps) {
  const percentage = (timerProps.timeLeft / timerProps.maxTime) * 100;
  
  return (
    <div className="flex flex-col items-center space-y-2">
      {/* Лейбл */}
      <span className="text-sm font-medium text-gray-600">
        {label}
      </span>
      
      {/* Основний таймер */}
      <GameTimer {...timerProps} />
      
      {/* Додаткова інформація */}
      <div className="flex flex-col items-center space-y-1 text-xs text-gray-500">
        {showProgress && (
          <div className="flex items-center space-x-2">
            <span>Прогрес:</span>
            <div className="w-16 h-1 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-300 ${
                  percentage <= 20 ? 'bg-red-500' :
                  percentage <= 50 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${percentage}%` }}
              />
            </div>
            <span>{Math.round(percentage)}%</span>
          </div>
        )}
        
        {totalTime && (
          <span>
            Загальний час: {formatTime(totalTime)}
          </span>
        )}
      </div>
    </div>
  );
}

// Міні версія таймера для статус барів
export function GameTimerMini({
  timeLeft,
  maxTime,
  className = ''
}: Pick<GameTimerProps, 'timeLeft' | 'maxTime' | 'className'>) {
  const percentage = (timeLeft / maxTime) * 100;
  const colors = getTimerColor(timeLeft, maxTime);
  
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Clock className={`w-4 h-4 ${colors.textColor}`} />
      <span className={`text-sm font-medium ${colors.textColor}`}>
        {formatTime(timeLeft)}
      </span>
      <div className="w-8 h-1 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`h-full transition-all duration-300 ${
            percentage <= 20 ? 'bg-red-500' :
            percentage <= 50 ? 'bg-yellow-500' : 'bg-green-500'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}