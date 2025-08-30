//tic-tac-toe\src\lib\privy\cross-app-client.ts
import { createClient } from '@privy-io/cross-app-provider';

export const crossAppClient = createClient({
  appId: 'cmet7k79c003sjv0bx4otzpge', // ваш Privy App ID
  appClientId: 'cmet7k79c003sjv0bx4otzpge', // той же ID
  privyDomain: 'auth.privy.io' // або ваш кастомний домен якщо є
});