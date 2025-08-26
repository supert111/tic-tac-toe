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
  rpcUrls: ['https://rpc.monad.testnet'],
  blockExplorerUrls: ['https://explorer.monad.testnet'],
};

export const MONAD_GAMES_ID_CROSS_APP_ID = 'cmd8euall0037le0my79qpz42';

export const privyConfig: PrivyClientConfig = {
  // Замініть на ваш appId з Privy Dashboard
  appId: 'YOUR_PRIVY_APP_ID', // Потрібно отримати з dashboard.privy.io
  
  config: {
    // Налаштування входу
    loginMethods: ['wallet', 'cross_app'],
    loginMethodsAndOrder: {
      primary: ['cross_app'],
      overflow: ['wallet']
    },
    
    // Налаштування для Cross App (Monad Games ID)
    crossAppWallets: {
      [MONAD_GAMES_ID_CROSS_APP_ID]: {
        name: 'Monad Games ID',
        iconUrl: 'https://monad-games-id-site.vercel.app/logo.png' // або ваш логотип
      }
    },
    
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
            http: ['https://rpc.monad.testnet'],
          },
          public: {
            http: ['https://rpc.monad.testnet'],
          },
        },
        blockExplorers: {
          default: {
            name: 'Monad Explorer',
            url: 'https://explorer.monad.testnet',
          },
        },
      },
    ],
    
    // Налаштування зовнішнього вигляду
    appearance: {
      theme: 'dark',
      accentColor: '#8B5CF6', // фіолетовий під вашу тему
    },
  },
};