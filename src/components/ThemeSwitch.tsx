import React from 'react';
import { motion } from 'motion/react';
import { useTheme } from '../contexts/ThemeContext';
import { Sun, Moon } from 'lucide-react';

export const ThemeSwitch: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`relative w-16 h-8 rounded-full p-1 transition-colors duration-1000 ease-in-out flex items-center ${
        theme === 'dark' ? 'bg-slate-700' : 'bg-sky-300'
      }`}
      aria-label="Toggle Theme"
    >
      <div className="absolute left-2 flex items-center justify-center w-6 h-6">
        <Moon className={`w-4 h-4 text-white transition-opacity duration-1000 ${theme === 'dark' ? 'opacity-100' : 'opacity-0'}`} />
      </div>
      <div className="absolute right-2 flex items-center justify-center w-6 h-6">
        <Sun className={`w-4 h-4 text-yellow-500 transition-opacity duration-1000 ${theme === 'light' ? 'opacity-100' : 'opacity-0'}`} />
      </div>
      <motion.div
        className="w-6 h-6 bg-white rounded-full shadow-md z-10"
        animate={{
          x: theme === 'dark' ? 0 : 32,
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />
    </button>
  );
};
