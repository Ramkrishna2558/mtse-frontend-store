import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import type { StoreConfigDto, ProductDto } from '../../../mtse-shared/src/types';

// The marketplace config — this is the PLATFORM config, not a single tenant
interface MarketplaceConfig {
  platformName: string;
  tagline: string;
  theme: StoreConfigDto['theme'];
}

interface ConfigContextType {
  platformConfig: MarketplaceConfig;
  allProducts: ProductDto[];
  getStoreInfo: (tenantId: string) => { name: string; color: string } | null;
  categories: string[];
  isLoading: boolean;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

const PLATFORM_CONFIG: MarketplaceConfig = {
  platformName: 'MTSE Marketplace',
  tagline: 'Shop from India\'s best independent sellers',
  theme: {
    primaryColor: '#ff6b35',
    secondaryColor: '#004e89',
    backgroundColor: '#f5f5f7',
    surfaceColor: '#ffffff',
    textColor: '#1a1a2e',
    accentColor: '#ff6b35',
    borderRadius: '12px',
    fontFamily: "'Inter', sans-serif"
  }
};

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [allProducts, setAllProducts] = useState<ProductDto[]>([]);
  const [storesData, setStoresData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set platform theme variables
    const root = document.documentElement;
    const t = PLATFORM_CONFIG.theme;
    root.style.setProperty('--primary-color', t.primaryColor);
    root.style.setProperty('--secondary-color', t.secondaryColor);
    root.style.setProperty('--background-color', t.backgroundColor);
    root.style.setProperty('--surface-color', t.surfaceColor);
    root.style.setProperty('--text-color', t.textColor);
    root.style.setProperty('--accent-color', t.accentColor);
    root.style.setProperty('--border-radius', t.borderRadius);
    root.style.setProperty('font-family', t.fontFamily);

    // Fetch data from json-server mock database
    Promise.all([
      axios.get('http://localhost:3000/products'),
      axios.get('http://localhost:3000/stores')
    ]).then(([productsRes, storesRes]) => {
      setAllProducts((Array.isArray(productsRes.data) ? productsRes.data : productsRes.data.items || []).map(p => {
        const firstVariantPrice = p.variants?.[0]?.price;
        const price = p.price !== undefined ? p.price : (firstVariantPrice !== undefined ? Number(firstVariantPrice) : 0);
        return {
          ...p,
          price: Number(price),
          category: typeof p.category === 'object' && p.category !== null ? p.category.name : p.category
        };
      }));
      setStoresData(Array.isArray(storesRes.data) ? storesRes.data : storesRes.data.items || storesRes.data);
    }).catch(error => {
      console.error('Failed to fetch marketplace data:', error);
    }).finally(() => {
      setIsLoading(false);
    });

  }, []);

  const getStoreInfo = (tenantId: string) => {
    const store = storesData.find(s => s.id === tenantId || s.tenantId === tenantId);
    if (!store) return null;
    return {
      name: store.name || store.brandName,
      color: store.color || store.primaryColor || '#ccc'
    };
  };

  const categories = [...new Set(allProducts.map(p => p.category).filter(Boolean))] as string[];

  return (
    <ConfigContext.Provider value={{
      platformConfig: PLATFORM_CONFIG,
      allProducts,
      getStoreInfo,
      categories,
      isLoading
    }}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (!context) throw new Error('useConfig must be used within a ConfigProvider');
  return context;
};
