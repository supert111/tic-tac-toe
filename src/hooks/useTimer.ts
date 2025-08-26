// hooks/useTimer.ts
// Функціонал таймера для обмеження часу на хід
// ✅ Гнучкі налаштування часу
// ✅ Автоматичне завершення ходу при закінченні часу
// ✅ Пауза/відновлення
// ✅ Звукові та візуальні попередження

import { useState, useEffect, useCallback, useRef } from 'react';

export interface TimerConfig {
  timePerMove: number; // секунди на хід
  totalTime?: number;  // загальний час гри (опціонально)
  warningThreshold: number; // коли показувати попередження (секунди)
  autoEndMove: boolean; // автоматично завершувати хід при закінченні часу
}

export interface UseTimerReturn {
  // Стан таймера
  timeLeft: number;
  totalTimeLeft: number | null;
  isRunning: boolean;
  isWarning: boolean;
  isTimeUp: boolean;
  
  // Дії
  startTimer: () => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  resetTimer: () => void;
  resetMoveTimer: () => void;
  
  // Утиліти
  formatTime: (seconds: number) => string;
  getTimePercentage: () => number;
}

interface UseTimerOptions {
  config: TimerConfig;
  onTimeUp?: () => void;
  onWarning?: () => void;
  onTick?: (timeLeft: number) => void;
}

export function useTimer({
  config,
  onTimeUp,
  onWarning,
  onTick
}: UseTimerOptions): UseTimerReturn {
  
  const [timeLeft, setTimeLeft] = useState(config.timePerMove);
  const [totalTimeLeft, setTotalTimeLeft] = useState(config.totalTime || null);
  const [isRunning, setIsRunning] = useState(false);
  const [isTimeUp, setIsTimeUp] = useState(false);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const warningTriggeredRef = useRef(false);
  const timeUpTriggeredRef = useRef(false); // ДОДАЙТЕ ЦЮ ЛІНІЮ

  // Очищення інтервалу при демонтажі
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Основний таймер
  useEffect(() => {
    if (!isRunning) {
      console.log('⏸️ Таймер зупинений, пропускаємо інтервал');
      return;
    }
    console.log('🔥 Запускаємо інтервал таймера, поточний час:', timeLeft);

    intervalRef.current = setInterval(() => {
      console.log('⏰ Тік таймера'); // 🔍 ДОДАЙ ЦЕЙ ЛОГ
      setTimeLeft(prev => {
        // const newTime = prev - 1;
        const newTime = Math.max(0, prev - 1); // 🔥 Захист від негативних значень
         // Логуємо тільки якщо час реально змінився
      if (newTime !== prev) {
        console.log('⏰ Новий час:', newTime);
      }

        // Викликаємо onTick
        onTick?.(newTime);
        
        // Перевіряємо попередження
        if (newTime === config.warningThreshold && !warningTriggeredRef.current) {
          warningTriggeredRef.current = true;
          onWarning?.();
        }
        
        // Перевіряємо закінчення часу
        if (newTime <= 0 && !timeUpTriggeredRef.current) {
          timeUpTriggeredRef.current = true;
          setIsTimeUp(true);
          setIsRunning(false);
          // Очищуємо інтервал щоб зупинити повтори
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          onTimeUp?.();
          return 0;
        }
        
        return newTime;
      });

      // Зменшуємо загальний час гри (якщо є)
      if (config.totalTime) {
        setTotalTimeLeft(prev => {
          if (prev === null) return null;
          const newTotalTime = prev - 1;
          return newTotalTime <= 0 ? 0 : newTotalTime;
        });
      }
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, config.warningThreshold, config.totalTime, onTimeUp, onWarning, onTick, isTimeUp]);

  // Запуск таймера
  const startTimer = useCallback(() => {
    // Додайте перевірку чи вже запущений
    if (isRunning) {
      console.log('⚠️ Таймер вже запущений, пропускаємо');
      return;
    }

    // Очистити попередній інтервал якщо є
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  
    setIsRunning(true);
    setIsTimeUp(false);
    warningTriggeredRef.current = false;
  }, [isRunning]); 

  // Пауза таймера
  const pauseTimer = useCallback(() => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Відновлення таймера
  const resumeTimer = useCallback(() => {
    if (!isTimeUp && timeLeft > 0) {
      setIsRunning(true);
    }
  }, [isTimeUp, timeLeft]);

  // Скидання таймера (весь таймер)
  const resetTimer = useCallback(() => {
    setIsRunning(false);
    setTimeLeft(config.timePerMove);
    setTotalTimeLeft(config.totalTime || null);
    setIsTimeUp(false);
    warningTriggeredRef.current = false;
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [config.timePerMove, config.totalTime]);

  // Скидання тільки таймера ходу
  const resetMoveTimer = useCallback(() => {
    console.log('🔄 resetMoveTimer викликано'); // ДОДАЙТЕ ЦЕЙ ЛОГ
    setTimeLeft(config.timePerMove);
    setIsTimeUp(false);
    warningTriggeredRef.current = false;
    timeUpTriggeredRef.current = false; // ДОДАЙТЕ ЦЮ ЛІНІЮ
  }, [config.timePerMove]);

  // Форматування часу
  const formatTime = useCallback((seconds: number): string => {
    if (seconds < 0) return '0:00';
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    if (minutes > 0) {
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    
    return `0:${remainingSeconds.toString().padStart(2, '0')}`;
  }, []);

  // Відсоток часу що залишився
  const getTimePercentage = useCallback((): number => {
    return Math.max(0, Math.min(100, (timeLeft / config.timePerMove) * 100));
  }, [timeLeft, config.timePerMove]);

  // Чи показувати попередження
  const isWarning = timeLeft <= config.warningThreshold && timeLeft > 0;

  return {
    // Стан таймера
    timeLeft,
    totalTimeLeft,
    isRunning,
    isWarning,
    isTimeUp,
    
    // Дії
    startTimer,
    pauseTimer,
    resumeTimer,
    resetTimer,
    resetMoveTimer,
    
    // Утиліти  
    formatTime,
    getTimePercentage
  };
}