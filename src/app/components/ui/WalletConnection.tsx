// 'use client'

// import { useState, useEffect } from 'react'

// declare global {
//   interface Window {
//     ethereum?: any
//     okxwallet?: any
//     trustwallet?: any
//     coinbasewallet?: any
//   }
// }

// export default function WalletConnection() {
//   const [userAccount, setUserAccount] = useState('')
//   const [walletConnected, setWalletConnected] = useState(false)
//   const [isLoading, setIsLoading] = useState(false)
//   const [selectedWallet, setSelectedWallet] = useState<'metamask' | 'okx' | 'trust' | 'coinbase'>('metamask')

//   const getProvider = () => {
//     switch (selectedWallet) {
//       case 'metamask':
//         return window.ethereum
//       case 'okx':
//         return window.okxwallet
//       case 'trust':
//         return window.trustwallet
//       case 'coinbase':
//         return window.coinbasewallet
//       default:
//         return null
//     }
//   }

//   const checkWalletConnection = async () => {
//     const provider = getProvider()
//     if (provider) {
//       try {
//         const accounts = (await provider.request({
//           method: 'eth_accounts'
//         })) as string[]
//         if (accounts.length > 0) {
//           setUserAccount(accounts[0])
//           setWalletConnected(true)
//         }
//       } catch (error) {
//         console.error('Помилка перевірки підключення:', error)
//       }
//     }
//   }

//   const connectWallet = async () => {
//     setIsLoading(true)
//     try {
//       const provider = getProvider()
//       if (provider) {
//         const accounts = (await provider.request({
//           method: 'eth_requestAccounts'
//         })) as string[]
//         setUserAccount(accounts[0])
//         setWalletConnected(true)
//       } else {
//         alert(`Гаманець ${selectedWallet} не знайдено!`)
//       }
//     } catch (error) {
//       console.error('Помилка підключення гаманця:', error)
//       alert('Помилка підключення гаманця!')
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const disconnectWallet = () => {
//     setUserAccount('')
//     setWalletConnected(false)
//   }

//   useEffect(() => {
//     checkWalletConnection()

//     const provider = getProvider()
//     if (provider) {
//       const handleAccountsChanged = (accounts: string[]) => {
//         if (accounts.length > 0) {
//           setUserAccount(accounts[0])
//           setWalletConnected(true)
//         } else {
//           disconnectWallet()
//         }
//       }

//       const handleChainChanged = () => {
//         checkWalletConnection()
//       }

//       provider.on('accountsChanged', handleAccountsChanged)
//       provider.on('chainChanged', handleChainChanged)

//       return () => {
//         provider.removeListener('accountsChanged', handleAccountsChanged)
//         provider.removeListener('chainChanged', handleChainChanged)
//       }
//     }
//   }, [selectedWallet])

//   return (
//     <div className="text-center">
//       <div className="mb-4">
//         <label className="block text-sm font-medium mb-2 text-white/70">Виберіть гаманець:</label>
//         <select
//           value={selectedWallet}
//           onChange={(e) => setSelectedWallet(e.target.value as 'metamask' | 'okx' | 'trust' | 'coinbase')}
//           className="w-full px-4 py-2 rounded-xl bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
//         >
//           <option value="metamask">MetaMask</option>
//           <option value="okx">OKX Wallet</option>
//           <option value="trust">Trust Wallet</option>
//           <option value="coinbase">Coinbase Wallet</option>
//         </select>
//       </div>

//       {walletConnected ? (
//         <div className="bg-green-600 p-3 rounded">
//           <p className="font-bold">Гаманець підключено ✅</p>
//           <p className="text-sm font-mono">
//             {userAccount.slice(0, 6)}...{userAccount.slice(-4)}
//           </p>
//           <button
//             onClick={disconnectWallet}
//             className="mt-2 bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm"
//           >
//             Відключити
//           </button>
//         </div>
//       ) : (
//         <button
//           onClick={connectWallet}
//           disabled={isLoading}
//           className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 px-6 py-3 rounded font-bold transition-colors"
//         >
//           {isLoading ? 'Підключення...' : 'Підключити гаманець'}
//         </button>
//       )}
//     </div>
//   )
// }

// 'use client'

// import { useState, useEffect } from 'react'
// import { BrowserProvider } from "ethers"

// declare global {
//   interface Window {
//     ethereum?: BrowserProvider.ExternalProvider; // Типізація для MetaMask
//     okxwallet?: BrowserProvider.ExternalProvider; // Типізація для OKX Wallet
//     coinbaseWalletExtension?: BrowserProvider.ExternalProvider; // Типізація для Coinbase Wallet
//     trustWallet?: BrowserProvider.ExternalProvider; // Типізація для Trust Wallet
//   }
// }

// export default function WalletConnection() {
//   const [userAccount, setUserAccount] = useState('')
//   const [walletConnected, setWalletConnected] = useState(false)
//   const [isLoading, setIsLoading] = useState(false)
//   const [selectedWallet, setSelectedWallet] = useState<'metamask' | 'okx' | 'trust' | 'coinbase'>('metamask')

//   // ID мережі для Monad Testnet (уточніть актуальний chainId)
//   const MONAD_TESTNET_CHAIN_ID = 10143 // Приклад, перевірте документацію Monad Testnet

//   const getProvider = () => {
//     if (selectedWallet === 'metamask' && window.ethereum) {
//       return new BrowserProvider (window.ethereum)
//     } else if (selectedWallet === 'okx' && window.okxwallet) {
//       return new BrowserProvider (window.okxwallet)
//     } else if (selectedWallet === 'coinbase' && window.coinbaseWalletExtension) {
//       return new BrowserProvider (window.coinbaseWalletExtension)
//     } else if (selectedWallet === 'trust' && window.trustWallet) {
//       return new BrowserProvider (window.trustWallet)
//     } else {
//       return null
//     }
//   }

//   const connectWallet = async () => {
//     setIsLoading(true)
//     try {
//       const provider = getProvider()
//       if (!provider) {
//         alert(`Гаманець ${selectedWallet} не знайдено! Переконайтеся, що він встановлений.`)
//         return
//       }

//       // Запит підключення акаунта
//       await provider.send('eth_requestAccounts', [])

//       // Перевірка мережі
//       const network = await provider.getNetwork()
//       if (network.chainId !== MONAD_TESTNET_CHAIN_ID) {
//         try {
//           // Спроба перемкнути мережу на Monad Testnet
//           await provider.send('wallet_switchEthereumChain', [{ chainId: `0x${MONAD_TESTNET_CHAIN_ID.toString(16)}` }])
//         } catch (switchError: unknown) {
//           if (switchError instanceof Error && (switchError as any).code === 4902) {
//             alert('Мережу Monad Testnet не знайдено. Додайте її в гаманець.')
//           } else {
//             alert('Не вдалося перемкнути мережу.')
//           }
//           setUserAccount('')
//           setWalletConnected(false)
//           return
//         }
//       }

//       const signer = provider.getSigner()
//       const account = await signer.getAddress()

//       setUserAccount(account)
//       setWalletConnected(true)
//     } catch (error: unknown) {
//       if (error instanceof Error) {
//         console.error('Помилка підключення гаманця:', error.message)
//         if ((error as any).code === 4001) {
//           alert('Користувач відхилив підключення гаманця.')
//         } else {
//           alert(`Помилка підключення гаманця: ${error.message || 'Невідома помилка'}`)
//         }
//       }
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const disconnectWallet = async () => {
//     try {
//       const provider = getProvider()
//       if (provider) {
//         // Скидаємо підключення (деякі гаманці підтримують відключення через API)
//         await provider.send('wallet_requestPermissions', [{ eth_accounts: {} }])
//       }
//     } catch (error) {
//       console.error('Помилка відключення гаманця:', error)
//     }
//     setUserAccount('')
//     setWalletConnected(false)
//   }

//   useEffect(() => {
//     const checkWalletConnection = async () => {
//       try {
//         const provider = getProvider()
//         if (provider) {
//           const accounts = await provider.listAccounts()
//           const network = await provider.getNetwork()
//           if (accounts.length > 0 && network.chainId === MONAD_TESTNET_CHAIN_ID) {
//             setUserAccount(accounts[0])
//             setWalletConnected(true)
//           }
//         }
//       } catch (error) {
//         console.error('Помилка перевірки підключення:', error)
//       }
//     }

//     checkWalletConnection()

//     // Відстеження зміни акаунта або мережі
//     const handleAccountsChanged = (accounts: string[]) => {
//       if (accounts.length > 0) {
//         setUserAccount(accounts[0])
//         setWalletConnected(true)
//       } else {
//         setUserAccount('')
//         setWalletConnected(false)
//       }
//     }

//     const handleChainChanged = () => {
//       checkWalletConnection() // Перевіряємо мережу при зміні
//     }

//     if (window.ethereum) {
//       window.ethereum.on('accountsChanged', handleAccountsChanged)
//       window.ethereum.on('chainChanged', handleChainChanged)
//     }

//     return () => {
//       if (window.ethereum) {
//         window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
//         window.ethereum.removeListener('chainChanged', handleChainChanged)
//       }
//     }
//   }, [selectedWallet])

//   return (
//     <div className="text-center">
//       <div className="mb-4">
//         <label className="block text-sm font-medium mb-2 text-white/70">Виберіть гаманець:</label>
//         <select
//           value={selectedWallet}
//           onChange={(e) => setSelectedWallet(e.target.value as 'metamask' | 'okx' | 'trust' | 'coinbase')}
//           className="w-full px-4 py-2 rounded-xl bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
//         >
//           <option value="metamask">MetaMask</option>
//           <option value="okx">OKX Wallet</option>
//           <option value="trust">Trust Wallet</option>
//           <option value="coinbase">Coinbase Wallet</option>
//         </select>
//       </div>

//       {walletConnected ? (
//         <div className="bg-green-600 p-3 rounded">
//           <p className="font-bold">Гаманець підключено ✅</p>
//           <p className="text-sm font-mono">
//             {userAccount.slice(0, 6)}...{userAccount.slice(-4)}
//           </p>
//           <button
//             onClick={disconnectWallet}
//             className="mt-2 bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm"
//           >
//             Відключити
//           </button>
//         </div>
//       ) : (
//         <button
//           onClick={connectWallet}
//           disabled={isLoading}
//           className="bg-blue-tech hover:bg-blue-700 disabled:bg-blue-400 px-6 py-3 rounded font-bold transition-colors"
//         >
//           {isLoading ? 'Підключення...' : 'Підключити гаманець'}
//         </button>
//       )}
//     </div>
//   )
// }





// 'use client'

// import { useState, useEffect, useCallback } from 'react'
// import { BrowserProvider } from "ethers"

// // Строга типізація для різних гаманців
// interface EthereumProvider {
//   request: (args: { method: string; params?: (string | object)[] }) => Promise<string[] | string | object>
//   on: (event: string, handler: (data: string[] | string) => void) => void
//   removeListener: (event: string, handler: (data: string[] | string) => void) => void
//   send: (method: string, params: (string | object)[]) => Promise<string[] | string | object>
// }

// declare global {
//   interface Window {
//     ethereum?: EthereumProvider
//     okxwallet?: EthereumProvider  
//     coinbaseWalletExtension?: EthereumProvider
//     trustWallet?: EthereumProvider
//   }
// }

// export default function WalletConnection() {
//   const [userAccount, setUserAccount] = useState('')
//   const [walletConnected, setWalletConnected] = useState(false)
//   const [isLoading, setIsLoading] = useState(false)
//   const [selectedWallet, setSelectedWallet] = useState<'metamask' | 'okx' | 'trust' | 'coinbase'>('metamask')

//   // ID мережі для Monad Testnet
//   const MONAD_TESTNET_CHAIN_ID = 10143 // Актуальний chainId для Monad Testnet

//   const getProvider = useCallback((): BrowserProvider | null => {
//     if (selectedWallet === 'metamask' && window.ethereum) {
//       return new BrowserProvider(window.ethereum)
//     } 
//     if (selectedWallet === 'okx' && window.okxwallet) {
//       return new BrowserProvider(window.okxwallet)
//     } 
//     if (selectedWallet === 'coinbase' && window.coinbaseWalletExtension) {
//       return new BrowserProvider(window.coinbaseWalletExtension)
//     } 
//     if (selectedWallet === 'trust' && window.trustWallet) {
//       return new BrowserProvider(window.trustWallet)
//     }
//     return null
//   }, [selectedWallet])

//   const connectWallet = async (): Promise<void> => {
//     setIsLoading(true)
//     try {
//       const provider = getProvider()
//       if (!provider) {
//         alert(`Гаманець ${selectedWallet} не знайдено! Переконайтеся, що він встановлений.`)
//         setIsLoading(false)
//         return
//       }

//       // Запит підключення акаунта
//       await provider.send('eth_requestAccounts', [])

//       // Перевірка мережі
//       const network = await provider.getNetwork()
//       if (Number(network.chainId) !== MONAD_TESTNET_CHAIN_ID) {
//         try {
//           // Спроба перемкнути мережу на Monad Testnet
//           await provider.send('wallet_switchEthereumChain', [{ 
//             chainId: `0x${MONAD_TESTNET_CHAIN_ID.toString(16)}` 
//           }])
//         } catch (switchError: unknown) {
//           const error = switchError as { code?: number }
//           if (error.code === 4902) {
//             // Мережу не знайдено, спробуємо додати її
//             try {
//               await provider.send('wallet_addEthereumChain', [{
//                 chainId: `0x${MONAD_TESTNET_CHAIN_ID.toString(16)}`,
//                 chainName: 'Monad Testnet',
//                 rpcUrls: ['https://rpc.monad.testnet'], // Замініть на актуальний RPC URL
//                 nativeCurrency: {
//                   name: 'MON',
//                   symbol: 'MON',
//                   decimals: 18
//                 },
//                 blockExplorerUrls: ['https://explorer.monad.testnet'] // Замініть на актуальний explorer
//               }])
//             } catch (addError) {
//               console.error('Не вдалося додати мережу:', addError)
//               alert('Не вдалося додати мережу Monad Testnet. Додайте її вручну в налаштуваннях гаманця.')
//               setIsLoading(false)
//               return
//             }
//           } else {
//             console.error('Помилка перемикання мережі:', switchError)
//             alert('Не вдалося перемкнути мережу.')
//             setIsLoading(false)
//             return
//           }
//         }
//       }

//       // Отримуємо підписувача після успішного підключення та перемикання мережі
//       const signer = await provider.getSigner()
//       const account = await signer.getAddress()

//       setUserAccount(account)
//       setWalletConnected(true)
//     } catch (error: unknown) {
//       const err = error as { code?: number; message?: string }
//       console.error('Помилка підключення гаманця:', error)
//       if (err.code === 4001) {
//         alert('Користувач відхилив підключення гаманця.')
//       } else {
//         alert(`Помилка підключення гаманця: ${err.message || 'Невідома помилка'}`)
//       }
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const disconnectWallet = (): void => {
//     // Браузерні гаманці не мають методу програмного відключення
//     // Можемо тільки очистити локальний стан
//     setUserAccount('')
//     setWalletConnected(false)
//     alert('Для повного відключення перейдіть в налаштування гаманця і відключіть сайт вручну.')
//   }

//   useEffect(() => {
//     const checkWalletConnection = async (): Promise<void> => {
//       try {
//         const provider = getProvider()
//         if (provider) {
//           const accounts = await provider.send('eth_accounts', [])
//           const accountsArray = Array.isArray(accounts) ? accounts : []
//           if (accountsArray.length > 0) {
//             const network = await provider.getNetwork()
//             if (Number(network.chainId) === MONAD_TESTNET_CHAIN_ID) {
//               setUserAccount(accountsArray[0])
//               setWalletConnected(true)
//             }
//           }
//         }
//       } catch (error) {
//         console.error('Помилка перевірки підключення:', error)
//       }
//     }

//     void checkWalletConnection()

//     // Відстеження зміни акаунта або мережі
//     const handleAccountsChanged = (accounts: string[] | string): void => {
//       const accountsArray = Array.isArray(accounts) ? accounts : [accounts]
//       if (accountsArray.length > 0 && accountsArray[0]) {
//         setUserAccount(accountsArray[0])
//         setWalletConnected(true)
//       } else {
//         setUserAccount('')
//         setWalletConnected(false)
//       }
//     }

//     const handleChainChanged = (): void => {
//       void checkWalletConnection() // Перевіряємо мережу при зміні
//     }

//     // Отримуємо провайдер для поточного гаманця
//     const getCurrentProvider = (): EthereumProvider | null => {
//       if (selectedWallet === 'metamask') return window.ethereum || null
//       if (selectedWallet === 'okx') return window.okxwallet || null
//       if (selectedWallet === 'coinbase') return window.coinbaseWalletExtension || null
//       if (selectedWallet === 'trust') return window.trustWallet || null
//       return null
//     }

//     const currentProvider = getCurrentProvider()

//     if (currentProvider && currentProvider.on) {
//       currentProvider.on('accountsChanged', handleAccountsChanged)
//       currentProvider.on('chainChanged', handleChainChanged)
//     }

//     return () => {
//       if (currentProvider && currentProvider.removeListener) {
//         currentProvider.removeListener('accountsChanged', handleAccountsChanged)
//         currentProvider.removeListener('chainChanged', handleChainChanged)
//       }
//     }
//   }, [selectedWallet, getProvider])

//   return (
//     <div className="text-center">
//       <div className="mb-4">
//         <label className="block text-sm font-medium mb-2 text-white/70">Виберіть гаманець:</label>
//         <select
//           value={selectedWallet}
//           onChange={(e) => setSelectedWallet(e.target.value as 'metamask' | 'okx' | 'trust' | 'coinbase')}
//           className="w-full px-4 py-2 rounded-xl bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
//         >
//           <option value="metamask">MetaMask</option>
//           <option value="okx">OKX Wallet</option>
//           <option value="trust">Trust Wallet</option>
//           <option value="coinbase">Coinbase Wallet</option>
//         </select>
//       </div>

//       {walletConnected ? (
//         <div className="bg-green-600 p-3 rounded">
//           <p className="font-bold">Гаманець підключено ✅</p>
//           <p className="text-sm font-mono">
//             {userAccount.slice(0, 6)}...{userAccount.slice(-4)}
//           </p>
//           <button
//             onClick={disconnectWallet}
//             className="mt-2 bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm"
//           >
//             Відключити
//           </button>
//         </div>
//       ) : (
//         <button
//           onClick={() => void connectWallet()}
//           disabled={isLoading}
//           className="bg-blue-500 hover:bg-blue-700 disabled:bg-blue-400 px-6 py-3 rounded font-bold transition-colors"
//         >
//           {isLoading ? 'Підключення...' : 'Підключити гаманець'}
//         </button>
//       )}
//     </div>
//   )
// }


















































































// 'use client'

// import { useState, useEffect } from 'react'

// declare global {
//   interface EthereumProvider {
//     request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
//     on: (event: string, callback: (...args: unknown[]) => void) => void;
//   }

//   interface Window {
//     ethereum?: EthereumProvider; // Типізація для MetaMask
//     okxwallet?: EthereumProvider; // Типізація для OKX Wallet
//     coinbaseWalletExtension?: EthereumProvider; // Типізація для Coinbase Wallet
//     trustWallet?: EthereumProvider; // Типізація для Trust Wallet
//   }
// }

// export default function WalletConnection() {
//   const [userAccount, setUserAccount] = useState('')
//   const [walletConnected, setWalletConnected] = useState(false)
//   const [isLoading, setIsLoading] = useState(false)
//   const [selectedWallet, setSelectedWallet] = useState<'metamask' | 'okx' | 'trust' | 'coinbase'>('metamask')

//   const MONAD_TESTNET_CHAIN_ID = 10143 // Замініть на реальний Chain ID тестової мережі Monad

//   const getCurrentProvider = (): EthereumProvider | null => {
//     if (selectedWallet === 'metamask') return window.ethereum || null
//     if (selectedWallet === 'okx') return window.okxwallet || null
//     if (selectedWallet === 'coinbase') return window.coinbaseWalletExtension || null
//     if (selectedWallet === 'trust') return window.trustWallet || null
//     return null
//   }

//   const currentProvider = getCurrentProvider()

//   if (currentProvider && currentProvider.on) {
//     currentProvider.on('accountsChanged', (accounts: unknown) => {
//       if (Array.isArray(accounts) && accounts.every((account) => typeof account === 'string')) {
//         const accountsArray = accounts as string[]; // Приведення типу після перевірки
//         if (accountsArray.length > 0 && accountsArray[0]) {
//           setUserAccount(accountsArray[0])
//           setWalletConnected(true)
//         } else {
//           setUserAccount('')
//           setWalletConnected(false)
//         }
//       } else {
//         console.error('Неправильний формат accounts:', accounts)
//       }
//     })
  
//     currentProvider.on('chainChanged', (chainId: unknown) => {
//       if (typeof chainId === 'string') {
//         void checkWalletConnection() // Перевіряємо мережу при зміні
//       } else {
//         console.error('Неправильний формат chainId:', chainId)
//       }
//     })
//   }

//   const connectWallet = async () => {
//     setIsLoading(true)
//     try {
//       const provider = getCurrentProvider()
//       if (!provider) {
//         alert(`Гаманець ${selectedWallet} не знайдено! Переконайтеся, що він встановлений.`)
//         setIsLoading(false)
//         return
//       }
  
//       // Запит підключення акаунта
//       const accounts = await provider.request({ method: 'eth_requestAccounts' })
//       if (!Array.isArray(accounts) || accounts.length === 0 || typeof accounts[0] !== 'string') {
//         alert('Не вдалося отримати акаунти. Переконайтеся, що гаманець підключений.')
//         setIsLoading(false)
//         return
//       }

//     // Перевірка мережі
//     const network = await provider.request({ method: 'eth_chainId' })
//     if (typeof network !== 'string' || parseInt(network, 16) !== MONAD_TESTNET_CHAIN_ID) {
//       try {
//         await provider.request({
//           method: 'wallet_switchEthereumChain',
//           params: [{ chainId: `0x${MONAD_TESTNET_CHAIN_ID.toString(16)}` }],
//         })
//       } catch (switchError: unknown) {
//         if (switchError instanceof Error && (switchError as any).code === 4902) {
//           alert('Мережу Monad Testnet не знайдено. Додайте її в гаманець.')
//         } else {
//           alert('Не вдалося перемкнути мережу.')
//         }
//         setUserAccount('')
//         setWalletConnected(false)
//         setIsLoading(false)
//         return
//       }
//     }

//     // Установка акаунта
//     setUserAccount(accounts[0])
//     setWalletConnected(true)
//   } catch (error: unknown) {
//     if (error instanceof Error) {
//       console.error('Помилка підключення гаманця:', error.message)
//       if ((error as any).code === 4001) {
//         alert('Користувач відхилив підключення гаманця.')
//       } else {
//         alert(`Помилка підключення гаманця: ${error.message || 'Невідома помилка'}`)
//       }
//     } else {
//       console.error('Невідома помилка:', error)
//     }
//   } finally {
//     setIsLoading(false)
//   }
    
//     const disconnectWallet = () => {
//       setUserAccount('')
//       setWalletConnected(false)
//     }

//     const checkWalletConnection = async () => {
//       try {
//         const provider = getCurrentProvider()
//         if (!provider) return
    
//         const accounts = await provider.request({ method: 'eth_accounts' })
//         if (!Array.isArray(accounts) || accounts.some((account) => typeof account !== 'string')) {
//           console.error('Неправильний формат accounts:', accounts)
//           return
//         }
    
//         const network = await provider.request({ method: 'eth_chainId' })
//         if (typeof network !== 'string') {
//           console.error('Неправильний формат chainId:', network)
//           return
//         }
    
//         if (accounts.length > 0 && parseInt(network, 16) === MONAD_TESTNET_CHAIN_ID) {
//           setUserAccount(accounts[0])
//           setWalletConnected(true)
//         } else {
//           setUserAccount('')
//           setWalletConnected(false)
//         }
//       } catch (error: unknown) {
//         if (error instanceof Error) {
//           console.error('Помилка перевірки підключення:', error.message)
//         } else {
//           console.error('Невідома помилка:', error)
//         }
//       }
//     }

//   useEffect(() => {
//     void checkWalletConnection()
//   }, [selectedWallet])

//   return (
//     <div className="text-center">
//       <div className="mb-4">
//         <label className="block text-sm font-medium mb-2 text-white/70">Виберіть гаманець:</label>
//         <select
//           value={selectedWallet}
//           onChange={(e) => setSelectedWallet(e.target.value as 'metamask' | 'okx' | 'trust' | 'coinbase')}
//           className="w-full px-4 py-2 rounded-xl bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
//         >
//           <option value="metamask">MetaMask</option>
//           <option value="okx">OKX Wallet</option>
//           <option value="trust">Trust Wallet</option>
//           <option value="coinbase">Coinbase Wallet</option>
//         </select>
//       </div>

//       {walletConnected ? (
//         <div className="bg-green-600 p-3 rounded">
//           <p className="font-bold">Гаманець підключено ✅</p>
//           <p className="text-sm font-mono">
//             {userAccount.slice(0, 6)}...{userAccount.slice(-4)}
//           </p>
//           <button
//             onClick={disconnectWallet}
//             className="mt-2 bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm"
//           >
//             Відключити
//           </button>
//         </div>
//       ) : (
//         <button
//           onClick={connectWallet}
//           disabled={isLoading}
//           className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 px-6 py-3 rounded font-bold transition-colors"
//         >
//           {isLoading ? 'Підключення...' : 'Підключити гаманець'}
//         </button>
//       )}
//     </div>
//   )
// }





































// //Валет через селект

// 'use client'

// import { useState, useEffect, useCallback, useMemo } from 'react'
// import { BrowserProvider, JsonRpcSigner, Network } from 'ethers'


// // Типізація для EIP-1193 провайдерів
// interface EthereumProvider {
//   request(args: { method: string; params?: unknown[] }): Promise<unknown>
//   on?(event: 'accountsChanged' | 'chainChanged', listener: (...args: unknown[]) => void): void
//   removeListener?(event: 'accountsChanged' | 'chainChanged', listener: (...args: unknown[]) => void): void
// }

// declare global {
//   interface Window {
//     ethereum?: EthereumProvider
//     okxwallet?: EthereumProvider
//     coinbaseWalletExtension?: EthereumProvider
//     trustWallet?: EthereumProvider
//   }
// }

// type WalletType = 'metamask' | 'okx' | 'trust' | 'coinbase'

// const WALLETS: { id: WalletType; name: string }[] = [
//   { id: 'metamask', name: 'MetaMask' },
//   { id: 'okx', name: 'OKX Wallet' },
//   { id: 'trust', name: 'Trust Wallet' },
//   { id: 'coinbase', name: 'Coinbase Wallet' },
// ]

// const MONAD_TESTNET_CHAIN_ID = 10143
// const MONAD_TESTNET_CONFIG = {
//   chainId: `0x${MONAD_TESTNET_CHAIN_ID.toString(16)}`,
//   chainName: 'Monad Testnet',
//   nativeCurrency: {
//     name: 'MON',
//     symbol: 'MON',
//     decimals: 18,
//   },
//   rpcUrls: ['https://rpc.monad.testnet'],
//   blockExplorerUrls: ['https://explorer.monad.testnet'],
// }

// export default function WalletConnection() {
//   const [isMounted, setIsMounted] = useState<boolean>(false)
//   const [userAccount, setUserAccount] = useState<string>('')
//   const [isLoading, setIsLoading] = useState<boolean>(false)
//   const [selectedWallet, setSelectedWallet] = useState<WalletType>('metamask')
//   const [provider, setProvider] = useState<BrowserProvider | null>(null)
//   const [signer, setSigner] = useState<JsonRpcSigner | null>(null)
//   const [network, setNetwork] = useState<Network | null>(null)

//   useEffect(() => {
//     setIsMounted(true)
//     return () => setIsMounted(false)
//   }, [])

//   const getEthereumProvider = useCallback((): EthereumProvider | null => {
//     if (!isMounted || typeof window === 'undefined') return null
//     try {
//       switch (selectedWallet) {
//         case 'metamask': return window.ethereum || null
//         case 'okx': return window.okxwallet || null
//         case 'coinbase': return window.coinbaseWalletExtension || null
//         case 'trust': return window.trustWallet || null
//         default: return null
//       }
//     } catch (error) {
//       console.error('Error getting ethereum provider:', error)
//       return null
//     }  
//   }, [selectedWallet, isMounted])

//   // Ініціалізація ethers.js провайдера
//   useEffect(() => {
//     if (!isMounted) return

//     const ethProvider = getEthereumProvider()
//     if (ethProvider) {
//       try {
//         const newProvider = new BrowserProvider(ethProvider)
//         setProvider(newProvider)

//         // Отримуємо мережу при ініціалізації
//         newProvider.getNetwork().then(net => {
//           setNetwork(net)
//         }).catch(console.error)
//       } catch (error) {
//         console.error('Error creating provider:', error)
//         setProvider(null)
//         setNetwork(null)
//       }
//     } else {
//       setProvider(null)
//       setNetwork(null)
//     }
//   }, [getEthereumProvider, isMounted])

//   const handleAccountsChanged = useCallback((accounts: unknown) => {
//     try {
//       if (Array.isArray(accounts) && accounts.length > 0) {
//         setUserAccount(accounts[0] as string)
//       } else if (typeof accounts === 'string') {
//         setUserAccount(accounts)
//       } else {
//         setUserAccount('')
//         setSigner(null)
//       }
//     } catch (error) {
//       console.error('Error handling accounts changed:', error)
//       setUserAccount('')
//       setSigner(null)
//     }
//   }, [])

//   const checkNetwork = useCallback(async (): Promise<boolean> => {
//     if (!provider) return false
    
//     try {
//       const currentNetwork = await provider.getNetwork()
//       setNetwork(currentNetwork)
//       return currentNetwork.chainId === BigInt(MONAD_TESTNET_CHAIN_ID)
//     } catch (error) {
//       console.error('Network check failed:', error)
//       return false
//     }
//   }, [provider])

//   const switchToMonadNetwork = useCallback(async (): Promise<boolean> => {
//     if (!provider || !isMounted) return false

//     try {
//       await provider.send('wallet_switchEthereumChain', [{ 
//         chainId: MONAD_TESTNET_CONFIG.chainId 
//       }])
//       return true
//     } catch (switchError: any) {
//       if (switchError.code === 4902) {
//         try {
//           await provider.send('wallet_addEthereumChain', [MONAD_TESTNET_CONFIG])
//           return true
//         } catch (addError) {
//           console.error('Failed to add network:', addError)
//           return false
//         }
//       }
//       console.error('Failed to switch network:', switchError)
//       return false
//     }
//   }, [provider, isMounted])

//   const connectWallet = useCallback(async () => {
//     if (!isMounted || !provider) return

//     setIsLoading(true)
//     try {
//       // Отримуємо підписувача
//       const newSigner = await provider.getSigner()
//       setSigner(newSigner)

//       // Отримуємо адресу
//       const address = await newSigner.getAddress()
//       setUserAccount(address)

//       // Перевіряємо мережу
//       const isCorrectNetwork = await checkNetwork()
//       if (!isCorrectNetwork) {
//         const switched = await switchToMonadNetwork()
//         if (!switched) {
//           throw new Error('Failed to switch to Monad Testnet')
//         }
//       }
//     } catch (error: any) {
//       console.error('Wallet connection error:', error)
//       if (error.code === 4001) {
//         alert('User rejected the connection request')
//       } else {
//         alert(`Connection error: ${error.message || 'Unknown error'}`)
//       }
//     } finally {
//       if (isMounted) {
//         setIsLoading(false)
//       }
//     }
//   }, [provider, isMounted, checkNetwork, switchToMonadNetwork])

//   const disconnectWallet = useCallback(() => {
//     setUserAccount('')
//     setSigner(null)
//     alert('Please disconnect manually in your wallet settings')
//   }, [])

//   // Перевірка підключеного гаманця при завантаженні
//   useEffect(() => {
//     if (!isMounted || !provider) return

//     const checkConnection = async () => {
//       try {
//         const accounts = await provider.send('eth_accounts', []) as string[]
//         if (accounts.length > 0 && (await checkNetwork())) {
//           const newSigner = await provider.getSigner()
//           setSigner(newSigner)
//           setUserAccount(accounts[0])
//         }
//       } catch (error) {
//         console.error('Connection check failed:', error)
//       }
//     }

//     checkConnection()
//   }, [provider, isMounted, checkNetwork])

//   // Підписка на події гаманця
//   useEffect(() => {
//     if (!isMounted || !provider || !userAccount) return

//     const ethProvider = getEthereumProvider()
//     if (!ethProvider?.on) return

//     const handleChainChanged = () => {
//       window.location.reload()
//     }

//     try {
//       ethProvider.on('accountsChanged', handleAccountsChanged)
//       ethProvider.on('chainChanged', handleChainChanged)

//       return () => {
//         if (ethProvider.removeListener) {
//           ethProvider.removeListener('accountsChanged', handleAccountsChanged)
//           ethProvider.removeListener('chainChanged', handleChainChanged)
//         }
//       }
//     } catch (error) {
//       console.error('Error setting up event listeners:', error)
//     }
//   }, [getEthereumProvider, isMounted, userAccount, handleAccountsChanged])

//   const shortAddress = useMemo(() => {
//     if (!userAccount) return ''
//     return `${userAccount.slice(0, 6)}...${userAccount.slice(-4)}`
//   }, [userAccount])

//   const networkStatus = useMemo(() => {
//     if (!network) return 'Not connected'
//     return network.chainId === BigInt(MONAD_TESTNET_CHAIN_ID) 
//       ? 'Correct network' 
//       : 'Wrong network'
//   }, [network])

//   if (!isMounted) return null

//   return (
//     <div className="text-center">
//       <div className="mb-4">
//         <label className="block text-sm font-medium mb-2 text-white/70">
//           Select wallet:
//         </label>
//         <select
//           value={selectedWallet}
//           onChange={(e) => setSelectedWallet(e.target.value as WalletType)}
//           className="w-full px-4 py-2 rounded-xl bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
//         >
//           {WALLETS.map((wallet) => (
//             <option key={wallet.id} value={wallet.id}>
//               {wallet.name}
//             </option>
//           ))}
//         </select>
//       </div>

//       {userAccount ? (
//         <div className="bg-green-600 p-3 rounded">
//           <p className="font-bold">Wallet connected ✅</p>
//           <p className="text-sm font-mono">{shortAddress}</p>
//           <p className="text-xs mt-1">Network: {networkStatus}</p>
//           <button
//             onClick={disconnectWallet}
//             className="mt-2 bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm"
//           >
//             Disconnect
//           </button>
//         </div>
//       ) : (
//         <button
//           onClick={connectWallet}
//           disabled={isLoading}
//           className="bg-blue-500 hover:bg-blue-700 disabled:bg-blue-400 px-6 py-3 rounded font-bold transition-colors"
//         >
//           {isLoading ? 'Connecting...' : 'Connect Wallet'}
//         </button>
//       )}
//     </div>
//   )
// }






























// // валет через модалку

// 'use client'

// import { useState, useEffect, useCallback, useMemo } from 'react'
// import { BrowserProvider, JsonRpcSigner, Network } from 'ethers'

// // Типізація для EIP-1193 провайдерів
// interface EthereumProvider {
//   request(args: { method: string; params?: unknown[] }): Promise<unknown>
//   on?(event: 'accountsChanged' | 'chainChanged', listener: (...args: unknown[]) => void): void
//   removeListener?(event: 'accountsChanged' | 'chainChanged', listener: (...args: unknown[]) => void): void
// }

// declare global {
//   interface Window {
//     ethereum?: EthereumProvider
//     okxwallet?: EthereumProvider
//     coinbaseWalletExtension?: EthereumProvider
//     trustWallet?: EthereumProvider
//   }
// }

// type WalletType = 'metamask' | 'okx' | 'trust' | 'coinbase'

// const WALLETS: { id: WalletType; name: string; icon: string }[] = [
//   { id: 'metamask', name: 'MetaMask', icon: '🦊' },
//   { id: 'okx', name: 'OKX Wallet', icon: '⚡' },
//   { id: 'trust', name: 'Trust Wallet', icon: '🛡️' },
//   { id: 'coinbase', name: 'Coinbase Wallet', icon: '🔵' },
// ]

// const MONAD_TESTNET_CHAIN_ID = 10143
// const MONAD_TESTNET_CONFIG = {
//   chainId: `0x${MONAD_TESTNET_CHAIN_ID.toString(16)}`,
//   chainName: 'Monad Testnet',
//   nativeCurrency: {
//     name: 'MON',
//     symbol: 'MON',
//     decimals: 18,
//   },
//   rpcUrls: ['https://rpc.monad.testnet'],
//   blockExplorerUrls: ['https://explorer.monad.testnet'],
// }

// export default function WalletConnection() {
//   const [isMounted, setIsMounted] = useState<boolean>(false)
//   const [userAccount, setUserAccount] = useState<string>('')
//   const [isLoading, setIsLoading] = useState<boolean>(false)
//   const [selectedWallet, setSelectedWallet] = useState<WalletType>('metamask')
//   const [provider, setProvider] = useState<BrowserProvider | null>(null)
//   const [signer, setSigner] = useState<JsonRpcSigner | null>(null)
//   const [network, setNetwork] = useState<Network | null>(null)
//   const [showModal, setShowModal] = useState<boolean>(false)

//   useEffect(() => {
//     setIsMounted(true)
//     return () => setIsMounted(false)
//   }, [])

//   const getEthereumProvider = useCallback((): EthereumProvider | null => {
//     if (!isMounted || typeof window === 'undefined') return null
//     try {
//       switch (selectedWallet) {
//         case 'metamask': return window.ethereum || null
//         case 'okx': return window.okxwallet || null
//         case 'coinbase': return window.coinbaseWalletExtension || null
//         case 'trust': return window.trustWallet || null
//         default: return null
//       }
//     } catch (error) {
//       console.error('Error getting ethereum provider:', error)
//       return null
//     }  
//   }, [selectedWallet, isMounted])

//   // Ініціалізація ethers.js провайдера
//   useEffect(() => {
//     if (!isMounted) return

//     const ethProvider = getEthereumProvider()
//     if (ethProvider) {
//       try {
//         const newProvider = new BrowserProvider(ethProvider)
//         setProvider(newProvider)

//         newProvider.getNetwork().then(net => {
//           setNetwork(net)
//         }).catch(console.error)
//       } catch (error) {
//         console.error('Error creating provider:', error)
//         setProvider(null)
//         setNetwork(null)
//       }
//     } else {
//       setProvider(null)
//       setNetwork(null)
//     }
//   }, [getEthereumProvider, isMounted])

//   const handleAccountsChanged = useCallback((accounts: unknown) => {
//     try {
//       if (Array.isArray(accounts) && accounts.length > 0) {
//         setUserAccount(accounts[0] as string)
//       } else if (typeof accounts === 'string') {
//         setUserAccount(accounts)
//       } else {
//         setUserAccount('')
//         setSigner(null)
//       }
//     } catch (error) {
//       console.error('Error handling accounts changed:', error)
//       setUserAccount('')
//       setSigner(null)
//     }
//   }, [])

//   const checkNetwork = useCallback(async (): Promise<boolean> => {
//     if (!provider) return false
    
//     try {
//       const currentNetwork = await provider.getNetwork()
//       setNetwork(currentNetwork)
//       return currentNetwork.chainId === BigInt(MONAD_TESTNET_CHAIN_ID)
//     } catch (error) {
//       console.error('Network check failed:', error)
//       return false
//     }
//   }, [provider])

//   const switchToMonadNetwork = useCallback(async (): Promise<boolean> => {
//     if (!provider || !isMounted) return false

//     try {
//       await provider.send('wallet_switchEthereumChain', [{ 
//         chainId: MONAD_TESTNET_CONFIG.chainId 
//       }])
//       return true
//     } catch (switchError: any) {
//       if (switchError.code === 4902) {
//         try {
//           await provider.send('wallet_addEthereumChain', [MONAD_TESTNET_CONFIG])
//           return true
//         } catch (addError) {
//           console.error('Failed to add network:', addError)
//           return false
//         }
//       }
//       console.error('Failed to switch network:', switchError)
//       return false
//     }
//   }, [provider, isMounted])

//   const connectWallet = useCallback(async (walletType: WalletType) => {
//     if (!isMounted) return

//     setSelectedWallet(walletType)
//     setIsLoading(true)
//     setShowModal(false)

//     try {
//       const ethProvider = getEthereumProvider()
//       if (!ethProvider) {
//         throw new Error(`${WALLETS.find(w => w.id === walletType)?.name} is not installed`)
//       }

//       const newProvider = new BrowserProvider(ethProvider)
//       setProvider(newProvider)

//       // Отримуємо підписувача та адресу
//       const newSigner = await newProvider.getSigner()
//       setSigner(newSigner)
//       const address = await newSigner.getAddress()
//       setUserAccount(address)

//       // Перевіряємо мережу
//       const isCorrectNetwork = await checkNetwork()
//       if (!isCorrectNetwork) {
//         const switched = await switchToMonadNetwork()
//         if (!switched) {
//           throw new Error('Failed to switch to Monad Testnet')
//         }
//       }
//     } catch (error: any) {
//       console.error('Wallet connection error:', error)
//       if (error.code === 4001) {
//         alert('User rejected the connection request')
//       } else {
//         alert(`Connection error: ${error.message || 'Unknown error'}`)
//       }
//     } finally {
//       if (isMounted) {
//         setIsLoading(false)
//       }
//     }
//   }, [isMounted, getEthereumProvider, checkNetwork, switchToMonadNetwork])

//   const disconnectWallet = useCallback(() => {
//     setUserAccount('')
//     setSigner(null)
//     setProvider(null)
//     setNetwork(null)
//   }, [])

//   // Перевірка підключеного гаманця при завантаженні
//   useEffect(() => {
//     if (!isMounted || !provider) return

//     const checkConnection = async () => {
//       try {
//         const accounts = await provider.send('eth_accounts', []) as string[]
//         if (accounts.length > 0 && (await checkNetwork())) {
//           const newSigner = await provider.getSigner()
//           setSigner(newSigner)
//           setUserAccount(accounts[0])
//         }
//       } catch (error) {
//         console.error('Connection check failed:', error)
//       }
//     }

//     checkConnection()
//   }, [provider, isMounted, checkNetwork])

//   // Підписка на події гаманця
//   useEffect(() => {
//     if (!isMounted || !provider || !userAccount) return

//     const ethProvider = getEthereumProvider()
//     if (!ethProvider?.on) return

//     const handleChainChanged = () => {
//       window.location.reload()
//     }

//     try {
//       ethProvider.on('accountsChanged', handleAccountsChanged)
//       ethProvider.on('chainChanged', handleChainChanged)

//       return () => {
//         if (ethProvider.removeListener) {
//           ethProvider.removeListener('accountsChanged', handleAccountsChanged)
//           ethProvider.removeListener('chainChanged', handleChainChanged)
//         }
//       }
//     } catch (error) {
//       console.error('Error setting up event listeners:', error)
//     }
//   }, [getEthereumProvider, isMounted, userAccount, handleAccountsChanged])

//   const shortAddress = useMemo(() => {
//     if (!userAccount) return ''
//     return `${userAccount.slice(0, 6)}...${userAccount.slice(-4)}`
//   }, [userAccount])

//   const networkStatus = useMemo(() => {
//     if (!network) return 'Not connected'
//     return network.chainId === BigInt(MONAD_TESTNET_CHAIN_ID) 
//       ? 'Monad Testnet' 
//       : 'Wrong network'
//   }, [network])

//   if (!isMounted) return null

//   return (
//     <div className="text-center">
//       {userAccount ? (
//         <div className="space-y-3">
//           <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-4">
//             <div className="flex items-center justify-center gap-2 mb-2">
//               <div className="w-2 h-2 bg-green-400 rounded-full"></div>
//               <span className="text-green-300 font-semibold">Connected</span>
//             </div>
//             <p className="text-white font-mono text-sm">{shortAddress}</p>
//             <p className="text-white/60 text-xs mt-1">{networkStatus}</p>
//           </div>
          
//           <button
//             onClick={disconnectWallet}
//             className="w-full bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 hover:border-red-500/50 text-red-300 hover:text-red-200 px-4 py-2 rounded-xl transition-all duration-200 text-sm font-medium"
//           >
//             Disconnect
//           </button>
//         </div>
//       ) : (
//         <button
//           onClick={() => setShowModal(true)}
//           disabled={isLoading}
//           className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-500 disabled:to-gray-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 disabled:scale-100 shadow-lg"
//         >
//           {isLoading ? (
//             <div className="flex items-center justify-center gap-2">
//               <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
//               Connecting...
//             </div>
//           ) : (
//             'Connect Wallet'
//           )}
//         </button>
//       )}

//       {/* Modal для вибору гаманця */}
//       {showModal && (
//         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//           <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl border border-white/20">
//             <div className="flex items-center justify-between mb-6">
//               <h3 className="text-xl font-bold text-white">Choose Wallet</h3>
//               <button
//                 onClick={() => setShowModal(false)}
//                 className="text-white/60 hover:text-white transition-colors"
//               >
//                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//               </button>
//             </div>

//             <div className="space-y-3">
//               {WALLETS.map((wallet) => (
//                 <button
//                   key={wallet.id}
//                   onClick={() => connectWallet(wallet.id)}
//                   disabled={isLoading}
//                   className="w-full flex items-center gap-3 bg-white/10 hover:bg-white/20 disabled:bg-white/5 border border-white/20 hover:border-white/30 rounded-xl p-4 transition-all duration-200 group"
//                 >
//                   <span className="text-2xl">{wallet.icon}</span>
//                   <span className="text-white font-medium group-hover:text-white/90">
//                     {wallet.name}
//                   </span>
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

































// /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////КОМЕНТУЄМО ВАЛЕТ...БУДЕМО ВИКОРИСТОВУВАТИ ІНШИЙ ФАЙЛ

// 'use client'

// import { useState, useEffect, useCallback, useMemo } from 'react'
// import { BrowserProvider, JsonRpcSigner, Network } from 'ethers'

// // Типізація для EIP-1193 провайдерів
// interface EthereumProvider {
//   request(args: { method: string; params?: unknown[] }): Promise<unknown>
//   on?(event: 'accountsChanged' | 'chainChanged', listener: (...args: unknown[]) => void): void
//   removeListener?(event: 'accountsChanged' | 'chainChanged', listener: (...args: unknown[]) => void): void
// }

// declare global {
//   interface Window {
//     ethereum?: EthereumProvider
//     okxwallet?: EthereumProvider
//     coinbaseWalletExtension?: EthereumProvider
//     trustWallet?: EthereumProvider
//   }
// }

// type WalletType = 'metamask' | 'okx' | 'trust' | 'coinbase'

// const WALLETS: { id: WalletType; name: string; icon: string }[] = [
//   { id: 'metamask', name: 'MetaMask', icon: '🦊' },
//   { id: 'okx', name: 'OKX Wallet', icon: '⚡' },
//   { id: 'trust', name: 'Trust Wallet', icon: '🛡️' },
//   { id: 'coinbase', name: 'Coinbase Wallet', icon: '🔵' },
// ]

// const MONAD_TESTNET_CHAIN_ID = 10143
// const MONAD_TESTNET_CONFIG = {
//   chainId: `0x${MONAD_TESTNET_CHAIN_ID.toString(16)}`,
//   chainName: 'Monad Testnet',
//   nativeCurrency: {
//     name: 'MON',
//     symbol: 'MON',
//     decimals: 18,
//   },
//   rpcUrls: ['https://rpc.monad.testnet'],
//   blockExplorerUrls: ['https://explorer.monad.testnet'],
// }

// export default function WalletConnection() {
//   const [isMounted, setIsMounted] = useState<boolean>(false)
//   const [userAccount, setUserAccount] = useState<string>('')
//   const [isLoading, setIsLoading] = useState<boolean>(false)
//   const [selectedWallet, setSelectedWallet] = useState<WalletType>('metamask')
//   const [provider, setProvider] = useState<BrowserProvider | null>(null)
//   const [signer, setSigner] = useState<JsonRpcSigner | null>(null)
//   const [network, setNetwork] = useState<Network | null>(null)
//   const [showModal, setShowModal] = useState<boolean>(false)

//   useEffect(() => {
//     setIsMounted(true)
//     return () => setIsMounted(false)
//   }, [])

//   const getEthereumProvider = useCallback((): EthereumProvider | null => {
//     if (!isMounted || typeof window === 'undefined') return null
//     try {
//       switch (selectedWallet) {
//         case 'metamask': return window.ethereum || null
//         case 'okx': return window.okxwallet || null
//         case 'coinbase': return window.coinbaseWalletExtension || null
//         case 'trust': return window.trustWallet || null
//         default: return null
//       }
//     } catch (error) {
//       console.error('Error getting ethereum provider:', error)
//       return null
//     }  
//   }, [selectedWallet, isMounted])

//   // Ініціалізація ethers.js провайдера
//   useEffect(() => {
//     if (!isMounted) return

//     const ethProvider = getEthereumProvider()
//     if (ethProvider) {
//       try {
//         const newProvider = new BrowserProvider(ethProvider)
//         setProvider(newProvider)

//         newProvider.getNetwork().then(net => {
//           setNetwork(net)
//         }).catch(console.error)
//       } catch (error) {
//         console.error('Error creating provider:', error)
//         setProvider(null)
//         setNetwork(null)
//       }
//     } else {
//       setProvider(null)
//       setNetwork(null)
//     }
//   }, [getEthereumProvider, isMounted])

//   const handleAccountsChanged = useCallback((accounts: unknown) => {
//     try {
//       if (Array.isArray(accounts) && accounts.length > 0) {
//         setUserAccount(accounts[0] as string)
//       } else if (typeof accounts === 'string') {
//         setUserAccount(accounts)
//       } else {
//         setUserAccount('')
//         setSigner(null)
//       }
//     } catch (error) {
//       console.error('Error handling accounts changed:', error)
//       setUserAccount('')
//       setSigner(null)
//     }
//   }, [])

//   const checkNetwork = useCallback(async (): Promise<boolean> => {
//     if (!provider) return false
    
//     try {
//       const currentNetwork = await provider.getNetwork()
//       setNetwork(currentNetwork)
//       return currentNetwork.chainId === BigInt(MONAD_TESTNET_CHAIN_ID)
//     } catch (error) {
//       console.error('Network check failed:', error)
//       return false
//     }
//   }, [provider])

//   const switchToMonadNetwork = useCallback(async (): Promise<boolean> => {
//     if (!provider || !isMounted) return false

//     try {
//       await provider.send('wallet_switchEthereumChain', [{ 
//         chainId: MONAD_TESTNET_CONFIG.chainId 
//       }])
//       return true
//     } catch (switchError: any) {
//       if (switchError.code === 4902) {
//         try {
//           await provider.send('wallet_addEthereumChain', [MONAD_TESTNET_CONFIG])
//           return true
//         } catch (addError) {
//           console.error('Failed to add network:', addError)
//           return false
//         }
//       }
//       console.error('Failed to switch network:', switchError)
//       return false
//     }
//   }, [provider, isMounted])

//   const connectWallet = useCallback(async (walletType: WalletType) => {
//     if (!isMounted) return

//     setSelectedWallet(walletType)
//     setIsLoading(true)
//     setShowModal(false)

//     try {
//       const ethProvider = getEthereumProvider()
//       if (!ethProvider) {
//         throw new Error(`${WALLETS.find(w => w.id === walletType)?.name} is not installed`)
//       }

//       const newProvider = new BrowserProvider(ethProvider)
//       setProvider(newProvider)

//       // Отримуємо підписувача та адресу
//       const newSigner = await newProvider.getSigner()
//       setSigner(newSigner)
//       const address = await newSigner.getAddress()
//       setUserAccount(address)

//       // Перевіряємо мережу
//       const isCorrectNetwork = await checkNetwork()
//       if (!isCorrectNetwork) {
//         const switched = await switchToMonadNetwork()
//         if (!switched) {
//           throw new Error('Failed to switch to Monad Testnet')
//         }
//       }
//     } catch (error: any) {
//       console.error('Wallet connection error:', error)
//       if (error.code === 4001) {
//         alert('User rejected the connection request')
//       } else {
//         alert(`Connection error: ${error.message || 'Unknown error'}`)
//       }
//     } finally {
//       if (isMounted) {
//         setIsLoading(false)
//       }
//     }
//   }, [isMounted, getEthereumProvider, checkNetwork, switchToMonadNetwork])

//   const disconnectWallet = useCallback(() => {
//     setUserAccount('')
//     setSigner(null)
//     setProvider(null)
//     setNetwork(null)
//   }, [])

//   // Перевірка підключеного гаманця при завантаженні
//   useEffect(() => {
//     if (!isMounted || !provider) return

//     const checkConnection = async () => {
//       try {
//         const accounts = await provider.send('eth_accounts', []) as string[]
//         if (accounts.length > 0 && (await checkNetwork())) {
//           const newSigner = await provider.getSigner()
//           setSigner(newSigner)
//           setUserAccount(accounts[0])
//         }
//       } catch (error) {
//         console.error('Connection check failed:', error)
//       }
//     }

//     checkConnection()
//   }, [provider, isMounted, checkNetwork])

//   // Підписка на події гаманця
//   useEffect(() => {
//     if (!isMounted || !provider || !userAccount) return

//     const ethProvider = getEthereumProvider()
//     if (!ethProvider?.on) return

//     const handleChainChanged = () => {
//       window.location.reload()
//     }

//     try {
//       ethProvider.on('accountsChanged', handleAccountsChanged)
//       ethProvider.on('chainChanged', handleChainChanged)

//       return () => {
//         if (ethProvider.removeListener) {
//           ethProvider.removeListener('accountsChanged', handleAccountsChanged)
//           ethProvider.removeListener('chainChanged', handleChainChanged)
//         }
//       }
//     } catch (error) {
//       console.error('Error setting up event listeners:', error)
//     }
//   }, [getEthereumProvider, isMounted, userAccount, handleAccountsChanged])

//   const shortAddress = useMemo(() => {
//     if (!userAccount) return ''
//     return `${userAccount.slice(0, 6)}...${userAccount.slice(-4)}`
//   }, [userAccount])

//   const networkStatus = useMemo(() => {
//     if (!network) return 'Not connected'
//     return network.chainId === BigInt(MONAD_TESTNET_CHAIN_ID) 
//       ? 'Monad Testnet' 
//       : 'Wrong network'
//   }, [network])

//   if (!isMounted) return null


//   return (
//     <div className="text-center">
//       {userAccount ? (
//         <div className="space-y-3">
//           <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-4">
//             <div className="flex items-center justify-center gap-2 mb-2">
//               <div className="w-2 h-2 bg-green-400 rounded-full"></div>
//               <span className="text-green-300 font-semibold">Connected</span>
//             </div>
//             <p className="text-white font-mono text-sm">{shortAddress}</p>
//             <p className="text-white/60 text-xs mt-1">{networkStatus}</p>
//           </div>
          
//           <button
//             onClick={disconnectWallet}
//             className="w-full bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 hover:border-red-500/50 text-red-300 hover:text-red-200 px-4 py-2 rounded-xl transition-all duration-200 text-sm font-medium"
//           >
//             Disconnect
//           </button>
//         </div>
//       ) : (
//         <button
//           onClick={() => setShowModal(true)}
//           disabled={isLoading}
//           className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-500 disabled:to-gray-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 disabled:scale-100 shadow-lg"
//         >
//           {isLoading ? (
//             <div className="flex items-center justify-center gap-2">
//               <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
//               Connecting...
//             </div>
//           ) : (
//             'Connect Wallet'
//           )}
//         </button>
//       )}

//       {/* Modal для вибору гаманця */}
//       {showModal && (
//         <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-center z-[9999] p-4">
//           <div className="bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900/90 backdrop-blur-md rounded-2xl p-6 w-full h-auto shadow-2xl border border-white/20">
//             <div className="flex items-center justify-between mb-6">
//               <h3 className="text-xl font-bold text-white">Choose Wallet</h3>
//               <button
//                 onClick={() => setShowModal(false)}
//                 className="text-white/60 hover:text-white transition-colors flex-shrink-0"
//                 aria-label="Close modal"
//               >
//                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//               </button>
//             </div>

//             <div className="space-y-3">
//               {WALLETS.map((wallet) => (
//                 <button
//                   key={wallet.id}
//                   onClick={() => connectWallet(wallet.id)}
//                   disabled={isLoading}
//                   className="w-full flex items-center gap-3 bg-white/10 hover:bg-white/20 disabled:bg-white/5 border border-white/20 hover:border-white/30 rounded-xl p-4 transition-all duration-200 group"
//                 >
//                   <span className="text-2xl flex-shrink-0">{wallet.icon}</span>
//                   <span className="text-white font-medium group-hover:text-white/90 truncate">
//                     {wallet.name}
//                   </span>
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }








































































// TEMPORARILY DISABLED - REPLACING WITH MONAD GAMES ID
/*
'use client'
... весь ваш код ...
*/

// Тимчасовий заглушка для інтерфейсу
// export default function WalletConnection() {
//   return (
//     <div className="text-center">
//       <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold">
//         Sign in with Monad Games ID
//       </button>
//     </div>
//   )
// }


























'use client';

import { useMonadAuth } from '../../../hooks/useMonadAuth';

export default function WalletConnection() {
  const { isConnected, user, isLoading, error, login, logout } = useMonadAuth();

  if (isLoading) {
    return (
      <div className="text-center">
        <div className="w-full bg-gray-600 px-6 py-3 rounded-xl font-semibold opacity-50">
          Loading...
        </div>
      </div>
    );
  }

  if (isConnected && user) {
    return (
      <div className="space-y-3">
        <div className="text-center">
          <div className="text-lg font-semibold text-green-400">
            {user.username ? `@${user.username}` : 'Anonymous Player'}
          </div>
          <div className="text-xs text-gray-400 truncate mt-1">
            {user.address.slice(0, 6)}...{user.address.slice(-4)}
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={logout}
            className="flex-1 bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-sm transition-colors"
          >
            Disconnect
          </button>
          
          <button
            className="flex-1 bg-purple-500 hover:bg-purple-600 px-4 py-2 rounded-lg text-sm transition-colors"
            onClick={() => window.open(`https://testnet.monadexplorer.com/address/${user.address}`, '_blank')}
          >
            View Profile
          </button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-3">
        <div className="text-red-400 text-sm text-center">{error}</div>
        <button
          onClick={login}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="text-center">
      <button
        onClick={login}
        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity"
      >
        Sign in with Monad Games ID
      </button>
    </div>
  );
}