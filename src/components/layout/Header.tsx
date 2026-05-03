import React from 'react';
import { Link } from 'react-router-dom';

export function Header() {
  return (
    <header className="fixed top-0 z-50 w-full bg-white/90 dark:bg-black/90 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
      <nav className="flex justify-between items-center w-full px-8 md:px-16 py-6 max-w-[1440px] mx-auto">
        <div className="flex items-center gap-12">
          <Link to="/" className="font-serif text-2xl font-light tracking-[0.2em] text-black dark:text-white">LUXE</Link>
          <div className="hidden md:flex gap-8 items-center">
            <Link to="/shop" className="font-serif tracking-widest uppercase text-xs text-gray-500 dark:text-gray-400 pb-1 hover:text-black dark:hover:text-white transition-colors duration-300 underline-offset-4 hover:underline decoration-1">Shop</Link>
            <Link to="/collections" className="font-serif tracking-widest uppercase text-xs text-gray-500 dark:text-gray-400 pb-1 hover:text-black dark:hover:text-white transition-colors duration-300 underline-offset-4 hover:underline decoration-1">Collections</Link>
            <Link to="/about" className="font-serif tracking-widest uppercase text-xs text-gray-500 dark:text-gray-400 pb-1 hover:text-black dark:hover:text-white transition-colors duration-300 underline-offset-4 hover:underline decoration-1">About</Link>
            <Link to="/journal" className="font-serif tracking-widest uppercase text-xs text-gray-500 dark:text-gray-400 pb-1 hover:text-black dark:hover:text-white transition-colors duration-300 underline-offset-4 hover:underline decoration-1">Journal</Link>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <span className="material-symbols-outlined cursor-pointer hover:opacity-60 transition-opacity">shopping_bag</span>
          <span className="material-symbols-outlined cursor-pointer hover:opacity-60 transition-opacity">person</span>
        </div>
      </nav>
    </header>
  );
}
