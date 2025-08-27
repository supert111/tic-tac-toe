'use client'

import { PrivyProvider } from '@privy-io/react-auth';

export default function PrivyClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PrivyProvider
      appId="cmetuy9xw00wtjv0b2y1vxgzm"
      config={{
        appearance: {
          theme: 'light',
          accentColor: '#676FFF',
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}