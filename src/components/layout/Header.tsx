import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useConfig } from '../../context/ConfigContext';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import { useStore } from '../../stores/useStore';

export function Header() {
  const { platformConfig, categories } = useConfig();
  const { customerEmail, isAuthenticated, logout } = useCustomerAuth();
  const { searchTerm, setSearchTerm, cart, setIsCartOpen, selectedCategory, setSelectedCategory, showHistory, setShowHistory } = useStore();
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="fixed top-0 left-0 right-0 z-[9999] bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-900 transition-all duration-500">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8">
        {/* Top Row: Logo, Search, Actions */}
        <div className="flex justify-between h-16 md:h-20 items-center gap-4">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link 
              to="/" 
              onClick={() => { setSelectedCategory(null); setShowHistory(false); }}
              className="font-serif text-2xl md:text-3xl font-bold tracking-tight text-black dark:text-white hover:opacity-70 transition-opacity"
            >
              {platformConfig.platformName === 'MTSE Marketplace' ? 'MTSE' : platformConfig.platformName}
            </Link>
          </div>

          {/* Search Bar - Expandable */}
          <div className={`flex-1 transition-all duration-300 flex justify-end ${isSearchOpen ? 'opacity-100 max-w-2xl' : 'opacity-0 max-w-0 overflow-hidden'}`}>
            <div className="relative w-full group">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                search
              </span>
              <input
                type="text"
                autoFocus={isSearchOpen}
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onBlur={() => !searchTerm && setIsSearchOpen(false)}
                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 md:gap-3">
            <div className="flex items-center bg-gray-50/50 dark:bg-gray-900/50 border border-gray-100/50 dark:border-gray-800/50 rounded-full p-1 md:p-1.5 backdrop-blur-sm transition-all duration-500">
              {!isSearchOpen && (
                <button 
                  onClick={() => setIsSearchOpen(true)}
                  className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-full text-black dark:text-white hover:bg-white dark:hover:bg-black hover:shadow-sm transition-all duration-300"
                >
                  <span className="material-symbols-outlined text-xl font-light">search</span>
                </button>
              )}

              <div className="flex items-center">
                {isAuthenticated ? (
                  <div className="flex items-center">
                    <button 
                      onClick={() => navigate('/profile')}
                      className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-full text-black dark:text-white hover:bg-white dark:hover:bg-black hover:shadow-sm transition-all duration-300"
                      title={customerEmail || 'Profile'}
                    >
                      <span className="material-symbols-outlined text-xl font-light">person</span>
                    </button>
                    <button 
                      onClick={logout}
                      className="hidden lg:block text-[10px] uppercase tracking-[0.2em] ml-2 mr-1 font-medium hover:text-red-500 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => navigate('/login')}
                    className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-full text-black dark:text-white hover:bg-white dark:hover:bg-black hover:shadow-sm transition-all duration-300"
                  >
                    <span className="material-symbols-outlined text-xl font-light">person</span>
                  </button>
                )}

                <button 
                  onClick={() => setIsCartOpen(true)}
                  className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-full text-black dark:text-white hover:bg-white dark:hover:bg-black hover:shadow-sm transition-all duration-300 relative"
                >
                  <span className="material-symbols-outlined text-xl font-light">shopping_bag</span>
                  {cartCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-black text-[9px] text-white font-bold dark:bg-white dark:text-black shadow-sm">
                      {cartCount}
                    </span>
                  )}
                </button>
              </div>
            </div>
            
            <button className="md:hidden w-10 h-10 flex items-center justify-center rounded-full bg-gray-50/50 dark:bg-gray-900/50 text-black dark:text-white">
              <span className="material-symbols-outlined text-xl">menu</span>
            </button>
          </div>
        </div>

        {/* Bottom Row: Categories */}
        <nav className="h-10 border-t border-gray-50 dark:border-gray-900 overflow-x-auto no-scrollbar flex items-center gap-8">
          <button
            onClick={() => { setSelectedCategory(null); setShowHistory(false); }}
            className={`text-[10px] uppercase tracking-[0.2em] whitespace-nowrap transition-colors duration-300 ${
              !selectedCategory && !showHistory ? 'text-black dark:text-white font-bold' : 'text-gray-400 hover:text-black dark:hover:text-white'
            }`}
          >
            All Products
          </button>
          
          {/* Static Tabs */}
          <button className="text-[10px] uppercase tracking-[0.2em] whitespace-nowrap text-gray-400 hover:text-black dark:hover:text-white transition-colors duration-300">
            New Arrivals
          </button>
          <button className="text-[10px] uppercase tracking-[0.2em] whitespace-nowrap text-gray-400 hover:text-black dark:hover:text-white transition-colors duration-300">
            Best Sellers
          </button>
          <button className="text-[10px] uppercase tracking-[0.2em] whitespace-nowrap text-gray-400 hover:text-black dark:hover:text-white transition-colors duration-300">
            Collections
          </button>

          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => { setSelectedCategory(cat); setShowHistory(false); }}
              className={`text-[10px] uppercase tracking-[0.2em] whitespace-nowrap transition-colors duration-300 ${
                selectedCategory === cat ? 'text-black dark:text-white font-bold' : 'text-gray-400 hover:text-black dark:hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
          {isAuthenticated && (
            <button
              onClick={() => setShowHistory(true)}
              className={`ml-auto text-[10px] uppercase tracking-[0.2em] transition-colors duration-300 flex items-center gap-2 ${
                showHistory ? 'text-black dark:text-white font-bold' : 'text-gray-400 hover:text-black dark:hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-sm">history</span>
              My Orders
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
