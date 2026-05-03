import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ProductDto } from '../../../mtse-shared/src/types';

interface CartItem {
  product: ProductDto;
  quantity: number;
}

interface UIStore {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  cart: CartItem[];
  addToCart: (product: ProductDto) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  showHistory: boolean;
  setShowHistory: (show: boolean) => void;
}

export const useStore = create<UIStore>()(
  persist(
    (set) => ({
      searchTerm: '',
      setSearchTerm: (term) => set({ searchTerm: term }),
      selectedCategory: null,
      setSelectedCategory: (category) => set({ selectedCategory: category }),
      cart: [],
      addToCart: (product) => set((state) => {
        const existing = state.cart.find(item => item.product.id === product.id);
        if (existing) {
          return {
            cart: state.cart.map(item =>
              item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
            )
          };
        }
        return { cart: [...state.cart, { product, quantity: 1 }] };
      }),
      removeFromCart: (productId) => set((state) => ({
        cart: state.cart.filter(item => item.product.id !== productId)
      })),
      clearCart: () => set({ cart: [] }),
      isCartOpen: false,
      setIsCartOpen: (open) => set({ isCartOpen: open }),
      showHistory: false,
      setShowHistory: (show) => set({ showHistory: show }),
    }),
    {
      name: 'mtse-store-storage',
      partialize: (state) => ({ cart: state.cart }),
    }
  )
);
