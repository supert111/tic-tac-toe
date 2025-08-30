// src/lib/privy/config.ts
import { PrivyClientConfig } from '@privy-io/react-auth';

const MONAD_TESTNET_CHAIN_ID = 10143;

export const MONAD_TESTNET_CONFIG = {
  chainId: `0x${MONAD_TESTNET_CHAIN_ID.toString(16)}`,
  chainName: 'Monad Testnet',
  nativeCurrency: {
    name: 'MON',
    symbol: 'MON',
    decimals: 18,
  },
  rpcUrls: ['https://testnet-rpc.monad.xyz/'],
  blockExplorerUrls: ['https://testnet.monadexplorer.com/'],
};

export const MONAD_GAMES_ID_CROSS_APP_ID = 'cmd8euall0037le0my79qpz42';
export const PRIVY_APP_ID = 'cmet7k79c003sjv0bx4otzpge';

export const privyConfig: PrivyClientConfig = {
  // Виправлена конфігурація методів входу
  loginMethods: ['wallet', 'email'],
  
  // Налаштування мереж
  supportedChains: [
    {
      id: MONAD_TESTNET_CHAIN_ID,
      name: 'Monad Testnet',
      network: 'monad-testnet',
      nativeCurrency: {
        name: 'MON',
        symbol: 'MON',
        decimals: 18,
      },
      rpcUrls: {
        default: {
          http: ['https://testnet-rpc.monad.xyz/'],
        },
        public: {
          http: ['https://testnet-rpc.monad.xyz/'],
        },
      },
      blockExplorers: {
        default: {
          name: 'Monad Explorer',
          url: 'https://testnet.monadexplorer.com/',
        },
      },
    },
  ],
  
  // Налаштування зовнішнього вигляду
  appearance: {
    theme: 'dark',
    accentColor: '#8B5CF6',
  },
};