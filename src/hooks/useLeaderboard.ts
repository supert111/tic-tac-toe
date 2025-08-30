// tic-tac-toe/src/hooks/useLeaderboard.ts

// import { useState, useEffect } from 'react';
// import { getGlobalLeaderboard, convertToPlayerFormat } from '@/lib/api/leaderboardApi';
// import { LeaderboardPlayer } from '@/types/game';

// export function useLeaderboard() {
//   const [data, setData] = useState<LeaderboardPlayer[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   //const [isFetching, setIsFetching] = useState(false); // ← Додайте цей стан

//   const fetchLeaderboard = async () => {

    
//     // try {
//     //   setLoading(true);
//     //   setError(null);
      
//     //   const apiData = await getGlobalLeaderboard();
//     //   const convertedData = convertToPlayerFormat(apiData);
//     //   setData(convertedData);
      
//     // } catch (err) {
//     //   setError(err instanceof Error ? err.message : 'Помилка завантаження');
//     //   setData([]); // Встановлюємо пустий масив при помилці
//     // } finally {
//     //   setLoading(false);
//     // }
//     try {
//         setLoading(true);
//         setError(null);
        
//         console.log('🚀 Починаємо завантаження лідерборду...');
//         const apiData = await getGlobalLeaderboard();
//         console.log('📊 Дані перед конвертацією:', apiData);
        
//         const convertedData = convertToPlayerFormat(apiData);
//         console.log('🔄 Дані після конвертації:', convertedData);
        
//         setData(convertedData);
        
//       } catch (err) {
//         console.error('💥 Помилка в хуці:', err);
//         setError(err instanceof Error ? err.message : 'Помилка завантаження');
//         setData([]);
//       } finally {
//         setLoading(false);
//         console.log('✅ Завантаження завершено');
//       }
//   };

//   useEffect(() => {
//     fetchLeaderboard();
//   }, []);

//   return { data, loading, error, refetch: fetchLeaderboard };
// }




// tic-tac-toe/src/hooks/useLeaderboard.ts
import { useState, useEffect, useCallback, useRef } from 'react';
import { getGlobalLeaderboard, convertToPlayerFormat } from '@/lib/api/leaderboardApi';
import { LeaderboardPlayer } from '@/types/game';

export function useLeaderboard() {
  const isFetchingRef = useRef(false);
  const [data, setData] = useState<LeaderboardPlayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeaderboard = useCallback(async () => {
    // Перевіряємо чи вже виконується глобальний запит
    if (isFetchingRef.current) {
      return;
    }

  try {
    isFetchingRef.current = true;
    setLoading(true);
    setError(null);
    
    const apiData = await getGlobalLeaderboard(); 
    const convertedData = convertToPlayerFormat(apiData);
    
    setData(convertedData);
    
  } catch (err) {
    console.error('💥 Помилка в хуці:', err);
    setError(err instanceof Error ? err.message : 'Помилка завантаження');
    setData([]);
  } finally {
    isFetchingRef.current = false; 
    setLoading(false);
  }
}, []);

useEffect(() => {
  fetchLeaderboard();
}, [fetchLeaderboard]);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  return { data, loading, error, refetch: fetchLeaderboard };
}