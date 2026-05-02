import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { tokenStorage } from '../../../mtse-shared/src/auth';

interface CustomerAuthContextType {
  customerEmail: string | null;
  login: (email: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const CustomerAuthContext = createContext<CustomerAuthContextType | undefined>(undefined);

export const CustomerAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [customerEmail, setCustomerEmail] = useState<string | null>(null);

  useEffect(() => {
    const user = tokenStorage.getUser();
    if (user && user.roles.includes('customer')) {
      setCustomerEmail(user.email);
    }
  }, []);

  const login = async (email: string) => {
    try {
      const response = await axios.post('http://localhost:3000/auth/login', {
        email,
        role: 'customer'
      });
      
      const { access_token, user } = response.data;
      tokenStorage.setTokens({ accessToken: access_token });
      tokenStorage.setUser({ ...user, roles: ['customer'], id: `cust_${Date.now()}` });
      setCustomerEmail(email);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    tokenStorage.clearTokens();
    setCustomerEmail(null);
  };

  return (
    <CustomerAuthContext.Provider value={{ customerEmail, login, logout, isAuthenticated: !!customerEmail }}>
      {children}
    </CustomerAuthContext.Provider>
  );
};

export const useCustomerAuth = () => {
  const context = useContext(CustomerAuthContext);
  if (!context) throw new Error('useCustomerAuth must be used within a CustomerAuthProvider');
  return context;
};
