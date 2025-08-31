// src/utils/scoreSubmission.ts

interface SubmitScoreParams {
  playerAddress: string;
  scoreToAdd: number;
  transactionsToAdd: number;
}

export async function submitScore({ 
  playerAddress, 
  scoreToAdd, 
  transactionsToAdd 
}: Omit<SubmitScoreParams, 'walletProvider'>): Promise<boolean> {
  
  // Додайте stack trace щоб побачити звідки викликається:
  //  console.trace('submitScore викликано з:');
  

  try {
    const response = await fetch("/api/submit-score", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ playerAddress, scoreToAdd, transactionsToAdd }),
    });

    console.log("🔍 API called:", (response.body, response.status));
      
      
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