//tic-tac-toe\src\lib\contract\monadGamesContract.ts
export const MONAD_GAMES_CONTRACT_ADDRESS = '0xceCBFF203C8B6044F52CE23D914A1bfD997541A4';

export const MONAD_GAMES_ABI = [
  {
    "inputs": [
      {"name": "player", "type": "address"},
      {"name": "scoreAmount", "type": "uint256"},
      {"name": "transactionAmount", "type": "uint256"}
    ],
    "name": "updatePlayerData",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];