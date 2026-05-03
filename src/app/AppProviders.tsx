import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { CustomerAuthProvider } from '../context/CustomerAuthContext';
import { ConfigProvider } from '../context/ConfigContext';
import { SnackbarProvider } from '../components/common/Snackbar';

interface AppProvidersProps {
  readonly children: React.ReactNode;
}
/**
 * AppProviders Component
 * @param param0 children
 * @returns React.JSX.Element
 */
export function AppProviders({ children }: AppProvidersProps): React.JSX.Element {
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
