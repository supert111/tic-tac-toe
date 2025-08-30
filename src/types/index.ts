// types/index.ts
export interface Player {
    id: number;
    name: string;
    wins: number;
    losses: number;
    draws: number;
    points: number;
    winRate: number;
    streak: number;
    rank: number;
    lastActive: string;
    wallet: string;
  }