import React from 'react';
import { IconWallet, IconSun, IconMoon } from './ui/Icons';
import { useTheme } from '../context/ThemeContext';

const NavBar: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md border-b border-slate-200 dark:border-zinc-800 transition-colors duration-300 shadow-sm">
       <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center gap-3">
             <div>
                <h1 className="font-bold text-lg tracking-tight leading-none">
                   <span className="text-indigo-600 dark:text-yellow-400">Smart</span>
                   <span className="text-slate-900 dark:text-white">Budget</span>
                </h1>
                <p className="text-[10px] font-medium text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
                   Tracker
                </p>
             </div>
          </div>

          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme}
            className="p-2.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-200 dark:hover:bg-zinc-700 hover:text-indigo-600 dark:hover:text-yellow-400 transition-all active:scale-95"
            aria-label="Toggle Theme"
          >
             {isDark ? (
                <IconSun className="w-5 h-5 transition-transform duration-500 rotate-0" />
             ) : (
                <IconMoon className="w-5 h-5 transition-transform duration-500 rotate-0" />
             )}
          </button>
       </div>
    </header>
  );
};

export default NavBar;