// src/utils/scoreSubmission.ts
//import { BrowserProvider } from 'ethers';
//import { MONAD_GAMES_CONTRACT_ADDRESS, MONAD_GAMES_ABI } from '../lib/contract/monadGamesContract';

interface SubmitScoreParams {
  playerAddress: string;
  scoreToAdd: number;
  transactionsToAdd: number;
}

// export async function submitScore({ 
//   playerAddress, 
//   scoreToAdd, 
//   transactionsToAdd, 
//   walletProvider 
// }: SubmitScoreParams): Promise<boolean> {
//   try {
//     console.log('🎯 submitScore викликано з параметрами:', { playerAddress, scoreToAdd, transactionsToAdd });
//     console.log('🎯 walletProvider тип:', typeof walletProvider);
//     console.log('🎯 walletProvider:', walletProvider);

//     console.log('🔄 Очікуємо walletProvider...');
//     const provider = await walletProvider;
//     console.log('✅ Отримано provider:', provider);
//     if (!provider) {
//       console.error('No wallet provider available');
//       return false;
//     }

//     const signer = await provider.getSigner();
//     const contract = new ethers.Contract(
//       MONAD_GAMES_CONTRACT_ADDRESS, 
//       MONAD_GAMES_ABI, 
//       signer
//     );

//     const tx = await contract.updatePlayerData(
//       playerAddress,
//       scoreToAdd,
//       transactionsToAdd
//     );

//     await tx.wait();
//     console.log('Score submitted successfully:', tx.hash);
//     return true;
//   } catch (error) {
//     console.error('Failed to submit score:', error);
//     return false;
//   }
// }


//tic-tac-toe\src\utils\scoreSubmission.ts
export async function submitScore({ 
  playerAddress, 
  scoreToAdd, 
  transactionsToAdd 
}: Omit<SubmitScoreParams, 'walletProvider'>): Promise<boolean> {
  
  // Додайте stack trace щоб побачити звідки викликається:
  console.trace('submitScore викликано з:');

  try {
    const response = await fetch('/api/submit-score', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ playerAddress, scoreToAdd, transactionsToAdd }),
    });

    if (!response.ok) {
      throw new Error('Failed to submit score');
    }

    const result = await response.json();
    console.log('✅ Score submitted:', result.txHash);
    return true;
    
  } catch (error) {
    console.error('❌ Failed to submit score:', error);
    return false;
  }
}