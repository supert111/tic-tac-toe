// components/game/ui/ProgressBar.tsx
// Компонент прогрес-бару для різних цілей у грі
// ✅ Прогрес часу, здоров'я, досвіду
// ✅ Анімовані переходи та ефекти
// ✅ Кольорові теми та розміри
// ✅ Додаткові індикатори та лейбли

'use client';

import React from 'react';
import { Zap, Clock, Trophy, Target, TrendingUp } from 'lucide-react';

interface ProgressBarProps {
  // Основні дані
  value: number;
  maxValue: number;
  
  // Відображення
  label?: string;
  showPercentage?: boolean;
  showValues?: boolean;
  showIcon?: boolean;
  
  // Стилізація
  variant?: 'default' | 'timer' | 'health' | 'experience' | 'achievement';
  size?: 'small' | 'medium' | 'large';
  rounded?: boolean;
  animated?: boolean;
  
  // Кольори
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'orange' | 'gray';
  
  // Додаткові можливості
  segments?: number;
  showGlow?: boolean;
  pulse?: boolean;
  
  // Стилі
  className?: string;
  
  // События
  onComplete?: () => void;
}

// Конфігурація розмірів
const sizeConfig = {
  small: {
    height: 'h-2',
    textSize: 'text-xs',
    iconSize: 'w-3 h-3',
    padding: 'px-2 py-1'
  },
  medium: {
    height: 'h-3',
    textSize: 'text-sm',
    iconSize: 'w-4 h-4',
    padding: 'px-3 py-2'
  },
  large: {
    height: 'h-4',
    textSize: 'text-base',
    iconSize: 'w-5 h-5',
    padding: 'px-4 py-3'
  }
};

// Конфігурація варіантів
const variantConfig = {
  default: {
    icon: Target,
    bgColor: 'bg-gray-200',
    fillColor: 'bg-blue-500'
  },
  timer: {
    icon: Clock,
    bgColor: 'bg-gray-200',
    fillColor: 'bg-green-500'
  },
  health: {
    icon: Zap,
    bgColor: 'bg-red-100',
    fillColor: 'bg-red-500'
  },
  experience: {
    icon: TrendingUp,
    bgColor: 'bg-purple-100',
    fillColor: 'bg-purple-500'
  },
  achievement: {
    icon: Trophy,
    bgColor: 'bg-yellow-100',
    fillColor: 'bg-yellow-500'
  }
};

// Конфігурація кольорів
const colorConfig = {
  blue: 'bg-blue-500',
  green: 'bg-green-500',
  red: 'bg-red-500',
  yellow: 'bg-yellow-500',
  purple: 'bg-purple-500',
  orange: 'bg-orange-500',
  gray: 'bg-gray-500'
};

export default function ProgressBar({
  value,
  maxValue,
  label,
  showPercentage = false,
  showValues = false,
  showIcon = false,
  variant = 'default',
  size = 'medium',
  rounded = true,
  animated = true,
  color,
  segments,
  showGlow = false,
  pulse = false,
  className = '',
  onComplete
}: ProgressBarProps) {
  
  // Розрахунки
  const percentage = Math.max(0, Math.min(100, (value / maxValue) * 100));
  const isComplete = percentage >= 100;
  
  // Конфігурації
  const sizeConf = sizeConfig[size];
  const variantConf = variantConfig[variant];
  const IconComponent = variantConf.icon;
  
  // Динамічний колір
  const getFillColor = () => {
    if (color) return colorConfig[color];
    
    // Автоматичний колір на основі відсотка
    if (variant === 'timer') {
      if (percentage <= 20) return 'bg-red-500';
      if (percentage <= 50) return 'bg-yellow-500';
      return 'bg-green-500';
    }
    
    if (variant === 'health') {
      if (percentage <= 25) return 'bg-red-600';
      if (percentage <= 50) return 'bg-orange-500';
      return 'bg-green-500';
    }
    
    return variantConf.fillColor;
  };
  
  const fillColor = getFillColor();
  
  // Ефект завершення
  React.useEffect(() => {
    if (isComplete && onComplete) {
      onComplete();
    }
  }, [isComplete, onComplete]);
  
  // Рендеринг сегментів
  const renderSegments = () => {
    if (!segments || segments <= 1) return null;
    
    const completedSegments = Math.floor((percentage / 100) * segments);
    
    return (
      <div className="absolute inset-0 flex">
        {Array.from({ length: segments }, (_, index) => (
          <div
            key={index}
            className={`
              flex-1 mx-px first:ml-0 last:mr-0
              ${index < completedSegments ? fillColor : 'bg-transparent'}
              ${rounded ? 'first:rounded-l last:rounded-r' : ''}
              transition-all duration-300
            `}
          />
        ))}
      </div>
    );
  };
  
  return (
    <div className={`w-full ${className}`}>
      {/* Лейбл та значення */}
      {(label || showPercentage || showValues) && (
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center space-x-2">
            {showIcon && (
              <IconComponent className={`${sizeConf.iconSize} text-gray-600`} />
            )}
            {label && (
              <span className={`font-medium text-gray-700 ${sizeConf.textSize}`}>
                {label}
              </span>
            )}
          </div>
          
          <div className={`${sizeConf.textSize} text-gray-600`}>
            {showPercentage && (
              <span className="font-semibold">
                {Math.round(percentage)}%
              </span>
            )}
            {showValues && (
              <span className={showPercentage ? 'ml-2' : ''}>
                {value}/{maxValue}
              </span>
            )}
          </div>
        </div>
      )}
      
      {/* Прогрес-бар */}
      <div className={`
        relative w-full ${sizeConf.height}
        ${variantConf.bgColor}
        ${rounded ? 'rounded-full' : 'rounded'}
        overflow-hidden
        ${showGlow && isComplete ? 'shadow-lg' : ''}
      `}>
        {/* Фоновий ефект свічення */}
        {showGlow && percentage > 0 && (
          <div 
            className={`
              absolute inset-0 ${fillColor} opacity-20 blur-sm
              ${pulse ? 'animate-pulse' : ''}
            `}
            style={{ width: `${percentage}%` }}
          />
        )}
        
        {/* Основний прогрес */}
        {segments ? renderSegments() : (
          <div
            className={`
              ${sizeConf.height} ${fillColor}
              ${rounded ? 'rounded-full' : 'rounded'}
              ${animated ? 'transition-all duration-500 ease-out' : ''}
              ${pulse && percentage > 0 ? 'animate-pulse' : ''}
              relative
            `}
            style={{ width: `${percentage}%` }}
          >
            {/* Блиск для анімації */}
            {animated && percentage > 0 && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
            )}
          </div>
        )}
        
        {/* Маркери сегментів */}
        {segments && segments > 1 && (
          <div className="absolute inset-0 flex">
            {Array.from({ length: segments - 1 }, (_, index) => (
              <div
                key={index}
                className="flex-1 border-r border-white/50"
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Додаткова інформація під баром */}
      {isComplete && (
        <div className="flex items-center justify-center mt-1">
          <Trophy className="w-3 h-3 text-yellow-500 mr-1" />
          <span className="text-xs text-yellow-600 font-medium">
            Завершено!
          </span>
        </div>
      )}
    </div>
  );
}

// Круговий прогрес-бар
interface CircularProgressProps {
  value: number;
  maxValue: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
  showPercentage?: boolean;
  className?: string;
}

export function CircularProgressBar({
  value,
  maxValue,
  size = 80,
  strokeWidth = 8,
  color = '#3b82f6',
  backgroundColor = '#e5e7eb',
  showPercentage = true,
  className = ''
}: CircularProgressProps) {
  
  const percentage = Math.max(0, Math.min(100, (value / maxValue) * 100));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Фоновий круг */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
        />
        
        {/* Прогрес круг */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-out"
        />
      </svg>
      
      {/* Відсоток у центрі */}
      {showPercentage && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-semibold text-gray-700">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
    </div>
  );
}

// Міні прогрес-бар для інлайн використання
export function ProgressBarMini({
  value,
  maxValue,
  color = 'blue',
  className = ''
}: Pick<ProgressBarProps, 'value' | 'maxValue' | 'color' | 'className'>) {
  
  const percentage = Math.max(0, Math.min(100, (value / maxValue) * 100));
  const fillColor = colorConfig[color || 'blue'];
  
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`h-full ${fillColor} transition-all duration-300 rounded-full`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-xs text-gray-600 font-medium min-w-0">
        {Math.round(percentage)}%
      </span>
    </div>
  );
}

// Багатовимірний прогрес-бар
interface MultiProgressBarProps {
  segments: Array<{
    value: number;
    maxValue: number;
    label: string;
    color: string;
  }>;
  showLegend?: boolean;
  className?: string;
}

export function MultiProgressBar({
  segments,
  showLegend = true,
  className = ''
}: MultiProgressBarProps) {
  
  const totalMaxValue = segments.reduce((sum, segment) => sum + segment.maxValue, 0);
  
  return (
    <div className={`w-full ${className}`}>
      {/* Основний бар */}
      <div className="h-3 bg-gray-200 rounded-full overflow-hidden flex">
        {segments.map((segment, index) => {
          const segmentPercentage = (segment.maxValue / totalMaxValue) * 100;
          const fillPercentage = (segment.value / segment.maxValue) * 100;
          
          return (
            <div
              key={index}
              className="relative flex"
              style={{ width: `${segmentPercentage}%` }}
            >
              <div 
                className={`h-full ${segment.color} transition-all duration-500`}
                style={{ width: `${fillPercentage}%` }}
              />
              <div className="flex-1 bg-gray-300/50" />
            </div>
          );
        })}
      </div>
      
      {/* Легенда */}
      {showLegend && (
        <div className="flex flex-wrap gap-2 mt-2">
          {segments.map((segment, index) => (
            <div key={index} className="flex items-center space-x-1">
              <div className={`w-2 h-2 rounded-full ${segment.color}`} />
              <span className="text-xs text-gray-600">
                {segment.label}: {segment.value}/{segment.maxValue}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Прогрес-бар з анімацією завантаження
interface LoadingProgressProps {
  isLoading: boolean;
  progress?: number;
  label?: string;
  className?: string;
}

export function LoadingProgress({
  isLoading,
  progress,
  label = 'Завантаження...',
  className = ''
}: LoadingProgressProps) {
  
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          {progress !== undefined && (
            <span className="text-sm text-gray-600">
              {Math.round(progress)}%
            </span>
          )}
        </div>
      )}
      
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        {isLoading ? (
          progress !== undefined ? (
            // Детермінований прогрес
            <div 
              className="h-full bg-blue-500 transition-all duration-300 rounded-full"
              style={{ width: `${progress}%` }}
            />
          ) : (
            // Недетермінований прогрес (анімація)
            <div className="h-full bg-blue-500 rounded-full animate-pulse">
              <div className="h-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
            </div>
          )
        ) : (
          <div className="h-full bg-green-500 rounded-full" />
        )}
      </div>
    </div>
  );
}

// Кастомні стилі для анімації shimmer
const shimmerKeyframes = `
  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
`;

// Додаємо стилі до документа
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = shimmerKeyframes;
  document.head.appendChild(style);
}