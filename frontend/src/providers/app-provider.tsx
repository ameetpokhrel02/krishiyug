import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { ConfirmationProvider } from './confirmation-provider';
import { Toaster } from 'sonner';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

import { ThemeProvider } from './theme-provider';

export const AppProvider = ({ children }: { children: ReactNode }) => {
  return (
    <ThemeProvider defaultTheme="light" storageKey="krishiyug-theme">
      <QueryClientProvider client={queryClient}>
        <ConfirmationProvider>
          {children}
          <Toaster position="top-right" richColors />
        </ConfirmationProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};
