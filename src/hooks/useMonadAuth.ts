// src/hooks/useMonadAuth.ts
import { useEffect, useState } from 'react';
import { usePrivy, CrossAppAccountWithMetadata } from '@privy-io/react-auth';
import { MONAD_GAMES_ID_CROSS_APP_ID } from '../lib/privy/config';

interface MonadUser {
  address: string;
  username?: string;
  hasUsername: boolean;
}

interface UseMonadAuthReturn {
  isConnected: boolean;
  user: MonadUser | null;
  isLoading: boolean;
  error: string | null;
  login: () => void;
  logout: () => void;
  fetchUsername: () => Promise<void>;
}

export function useMonadAuth(): UseMonadAuthReturn {
  const { authenticated, user, ready, logout: privyLogout, login: privyLogin } = usePrivy();
  const [monadUser, setMonadUser] = useState<MonadUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Отримання адреси гаманця з Monad Games ID
  const getMonadWalletAddress = (): string | null => {
    if (!authenticated || !user?.linkedAccounts?.length) return null;

    const crossAppAccount = user.linkedAccounts.find(
      (account) => 
        account.type === 'cross_app' && 
        (account as CrossAppAccountWithMetadata).providerApp?.id === MONAD_GAMES_ID_CROSS_APP_ID
    ) as CrossAppAccountWithMetadata;

    if (!crossAppAccount?.embeddedWallets?.length) return null;

    return crossAppAccount.embeddedWallets[0].address;
  };

  // Отримання username через API
  const fetchUsername = async (): Promise<void> => {
    const address = getMonadWalletAddress();
    if (!address) return;

    try {
      const response = await fetch(
        `https://monad-games-id-site.vercel.app/api/check-wallet?wallet=${address}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch username');
      }

      const data = await response.json();
      
      setMonadUser({
        address,
        username: data.hasUsername ? data.user.username : undefined,
        hasUsername: data.hasUsername,
      });
      setError(null);
    } catch (err) {
      console.error('Error fetching username:', err);
      setError('Failed to fetch user data');
      // Все одно встановлюємо користувача з адресою
      setMonadUser({
        address,
        hasUsername: false,
      });
    }
  };

  // Ефект для обробки змін авторизації
  useEffect(() => {
    const handleAuthChange = async () => {
      setIsLoading(true);
      setError(null);

      if (!ready) return;

      if (authenticated && user) {
        const address = getMonadWalletAddress();
        
        if (address) {
          await fetchUsername();
        } else if (user.linkedAccounts.length === 0) {
          setError("You need to link your Monad Games ID account to continue.");
          setMonadUser(null);
        } else {
          setError("No Monad Games ID wallet found.");
          setMonadUser(null);
        }
      } else {
        setMonadUser(null);
      }

      setIsLoading(false);
    };

    handleAuthChange();
  }, [authenticated, user, ready]);

  const handleLogin = () => {
    privyLogin();
  };

  const handleLogout = () => {
    setMonadUser(null);
    setError(null);
    privyLogout();
  };

  return {
    isConnected: !!monadUser,
    user: monadUser,
    isLoading,
    error,
    login: handleLogin,
    logout: handleLogout,
    fetchUsername,
  };
}