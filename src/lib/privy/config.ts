// // src/lib/privy/config.ts
// import { PrivyClientConfig } from '@privy-io/react-auth';

// const MONAD_TESTNET_CHAIN_ID = 10143;

// export const MONAD_TESTNET_CONFIG = {
//   chainId: `0x${MONAD_TESTNET_CHAIN_ID.toString(16)}`,
//   chainName: 'Monad Testnet',
//   nativeCurrency: {
//     name: 'MON',
//     symbol: 'MON', // В зображенні показано $MON, але MON це правильно
//     decimals: 18,
//   },
//   // ВИПРАВЛЕНО: RPC URL з офіційної документації
//   rpcUrls: ['https://testnet-rpc.monad.xyz/'],
//   // ВИПРАВЛЕНО: Block Explorer URL з офіційної документації
//   blockExplorerUrls: ['https://testnet.monadexplorer.com/'],
// };

// export const MONAD_GAMES_ID_CROSS_APP_ID = 'cmd8euall0037le0my79qpz42';

// export const privyConfig: PrivyClientConfig = {
//   // Замініть на ваш appId з Privy Dashboard
//   appId: 'cmet7k79c003sjv0bx4otzpge',
  
//   config: {
//     // Налаштування входу
//     loginMethods: ['wallet', 'cross_app'],
//     loginMethodsAndOrder: {
//       primary: ['cross_app'],
//       overflow: ['wallet']
//     },
    
//     // Налаштування для Cross App (Monad Games ID)
//     crossAppWallets: {
//       [MONAD_GAMES_ID_CROSS_APP_ID]: {
//         name: 'Monad Games ID',
//         iconUrl: 'https://monad-games-id-site.vercel.app/logo.png' // або ваш логотип
//       }
//     },
    
//     // Налаштування мереж
//     supportedChains: [
//       {
//         id: MONAD_TESTNET_CHAIN_ID,
//         name: 'Monad Testnet',
//         network: 'monad-testnet',
//         nativeCurrency: {
//           name: 'MON',
//           symbol: 'MON',
//           decimals: 18,
//         },
//         rpcUrls: {
//           default: {
//             // ВИПРАВЛЕНО: Використовуємо правильний RPC URL
//             http: ['https://testnet-rpc.monad.xyz/'],
//           },
//           public: {
//             // ВИПРАВЛЕНО: Використовуємо правильний RPC URL
//             http: ['https://testnet-rpc.monad.xyz/'],
//           },
//         },
//         blockExplorers: {
//           default: {
//             name: 'Monad Explorer',
//             // ВИПРАВЛЕНО: Використовуємо правильний URL експлорера
//             url: 'https://testnet.monadexplorer.com/',
//           },
//         },
//       },
//     ],
    
//     // Налаштування зовнішнього вигляду
//     appearance: {
//       theme: 'dark',
//       accentColor: '#8B5CF6', // фіолетовий під вашу тему
//     },
//   },
// };



// src/lib/privy/config.ts
import { PrivyClientConfig } from '@privy-io/react-auth';

const MONAD_TESTNET_CHAIN_ID = 10143;

export const MONAD_TESTNET_CONFIG = {
  chainId: `0x${MONAD_TESTNET_CHAIN_ID.toString(16)}`,
  chainName: 'Monad Testnet',
  nativeCurrency: {
    name: 'MON',
    symbol: 'MON', // В зображенні показано $MON, але MON це правильно
    decimals: 18,
  },
  // ВИПРАВЛЕНО: RPC URL з офіційної документації
  rpcUrls: ['https://testnet-rpc.monad.xyz/'],
  // ВИПРАВЛЕНО: Block Explorer URL з офіційної документації
  blockExplorerUrls: ['https://testnet.monadexplorer.com/'],
};

export const MONAD_GAMES_ID_CROSS_APP_ID = 'cmd8euall0037le0my79qpz42';

// App ID для Privy (винесений окремо)
export const PRIVY_APP_ID = 'cmet7k79c003sjv0bx4otzpge';

export const privyConfig: PrivyClientConfig = {
  // Налаштування входу
  loginMethods: ['wallet'],
  
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
          // ВИПРАВЛЕНО: Використовуємо правильний RPC URL
          http: ['https://testnet-rpc.monad.xyz/'],
        },
        public: {
          // ВИПРАВЛЕНО: Використовуємо правильний RPC URL
          http: ['https://testnet-rpc.monad.xyz/'],
        },
      },
      blockExplorers: {
        default: {
          name: 'Monad Explorer',
          // ВИПРАВЛЕНО: Використовуємо правильний URL експлорера
          url: 'https://testnet.monadexplorer.com/',
        },
      },
    },
  ],
  
  // Налаштування зовнішнього вигляду
  appearance: {
    theme: 'dark',
    accentColor: '#8B5CF6', // фіолетовий під вашу тему
  },
};