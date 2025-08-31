// //tic-tac-toe\src\app\api\submit-score\route.ts
// import { NextRequest, NextResponse } from 'next/server';
// import { ethers } from 'ethers';
// import { MONAD_GAMES_CONTRACT_ADDRESS, MONAD_GAMES_ABI } from '@/lib/contract/monadGamesContract';

// export async function POST(request: NextRequest) {
//   try {
//     const { playerAddress, scoreToAdd, transactionsToAdd } = await request.json();

//     // Валідація
//     if (!playerAddress || typeof scoreToAdd !== 'number' || typeof transactionsToAdd !== 'number') {
//       return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
//     }

//     // ✅ Додати перевірку на негативні значення:
//     if (scoreToAdd < 0 || transactionsToAdd < 0) {
//       return NextResponse.json({ error: 'Values must be positive' }, { status: 400 });
//     }
//     // ДОДАТИ ЦЕ - Серверна валідація очок
//     // if (scoreToAdd !== 10 && scoreToAdd !== 0) {
//     //   return NextResponse.json({ error: 'Invalid score amount' }, { status: 400 });
//     // }

//     if (!process.env.SERVER_WALLET_PRIVATE_KEY) {
//       throw new Error('SERVER_WALLET_PRIVATE_KEY not found in environment variables');
//     }

//     // Server wallet (потрібно додати в .env.local)
//     const privateKey = process.env.SERVER_WALLET_PRIVATE_KEY;
//     if (!privateKey) {
//       throw new Error('Server wallet not configured');
//     }

//     // Підключення до Monad testnet
//     const provider = new ethers.JsonRpcProvider('https://testnet-rpc.monad.xyz/');
//     const wallet = new ethers.Wallet(privateKey, provider);

//     // Контракт
//     const contract = new ethers.Contract(MONAD_GAMES_CONTRACT_ADDRESS, MONAD_GAMES_ABI, wallet);

//     // Відправка транзакції
//     const tx = await contract.updatePlayerData(playerAddress, scoreToAdd, transactionsToAdd);

//     await tx.wait();

//     return NextResponse.json({ success: true, txHash: tx.hash });

//   } catch (error) {
//     console.error('❌ Error submitting score:', error);
//     return NextResponse.json({ error: 'Failed to submit score' }, { status: 500 });
//   }
// }




//tic-tac-toe\src\app\api\submit-score\route.ts
import { NextRequest, NextResponse } from 'next/server';
import { ethers } from 'ethers';
import { MONAD_GAMES_CONTRACT_ADDRESS, MONAD_GAMES_ABI } from '@/lib/contract/monadGamesContract';

export async function POST(request: NextRequest) {
  try {
    const { playerAddress, scoreToAdd, transactionsToAdd } = await request.json();

    // Валідація
    if (!playerAddress || typeof scoreToAdd !== 'number' || typeof transactionsToAdd !== 'number') {
      return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
    }

    // ✅ Додати перевірку на негативні значення:
    if (scoreToAdd < 0 || transactionsToAdd < 0) {
      return NextResponse.json({ error: 'Values must be positive' }, { status: 400 });
    }
    // ДОДАТИ ЦЕ - Серверна валідація очок
    // if (scoreToAdd !== 10 && scoreToAdd !== 0) {
    //   return NextResponse.json({ error: 'Invalid score amount' }, { status: 400 });
    // }

    if (!process.env.SERVER_WALLET_PRIVATE_KEY) {
      console.log("⚠️ SERVER_WALLET_PRIVATE_KEY not found - fallback mode");
      console.log("📊 Would submit to blockchain:", {
        playerAddress,
        scoreToAdd,
        transactionsToAdd,
      });

      return NextResponse.json({
        success: true,
        message: "Score logged (add SERVER_WALLET_PRIVATE_KEY for blockchain)",
        fallback: true,
      });
        //throw new Error('SERVER_WALLET_PRIVATE_KEY not found in environment variables');
    }

    // Server wallet (потрібно додати в .env.local)
    const privateKey = process.env.SERVER_WALLET_PRIVATE_KEY;
    if (!privateKey) {
      throw new Error('Server wallet not configured');
    }

    // Підключення до Monad testnet
    const provider = new ethers.JsonRpcProvider('https://testnet-rpc.monad.xyz/');
    const wallet = new ethers.Wallet(privateKey, provider);

    // Контракт
    const contract = new ethers.Contract(MONAD_GAMES_CONTRACT_ADDRESS, MONAD_GAMES_ABI, wallet);

    // Відправка транзакції
    const tx = await contract.updatePlayerData(playerAddress, scoreToAdd, transactionsToAdd);

    await tx.wait();

    return NextResponse.json({ success: true, txHash: tx.hash });

  } catch (error) {
    console.error('❌ Error submitting score:', error);
    return NextResponse.json({ error: 'Failed to submit score' }, { status: 500 });
  }
}