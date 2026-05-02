import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { CustomerAuthProvider } from '../context/CustomerAuthContext';
import { ConfigProvider } from '../context/ConfigContext';
import { SnackbarProvider } from '../components/common/Snackbar';

interface AppProvidersProps {
  children: React.ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <SnackbarProvider>
      <CustomerAuthProvider>
        <ConfigProvider>
          <BrowserRouter>
            {children}
          </BrowserRouter>
        </ConfigProvider>
      </CustomerAuthProvider>
    </SnackbarProvider>
  );
}
