// 'use client'

// import { PrivyProvider } from '@privy-io/react-auth';

// export default function PrivyClientProvider({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <PrivyProvider
//       appId="cmetuy9xw00wtjv0b2y1vxgzm"
//       config={{
//         appearance: {
//           theme: 'light',
//           accentColor: '#676FFF',
//         },
//       }}
//     >
//       {children}
//     </PrivyProvider>
//   );
// }




//tic-tac-toe\src\app\components\privy-provider.tsx
'use client'

import { PrivyProvider } from '@privy-io/react-auth';
import { PRIVY_APP_ID, privyConfig } from '@/lib/privy/config';

export default function PrivyClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PrivyProvider
      appId={PRIVY_APP_ID}
      config={privyConfig}
    >
      {children}
    </PrivyProvider>
  );
}