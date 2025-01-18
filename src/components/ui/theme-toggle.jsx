// components/ui/theme-toggle.jsx
import React from 'react';
import { Moon, Sun } from 'lucide-react';

const ThemeToggle = () => {
  const [theme, setTheme] = React.useState('light');

  React.useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    localStorage.setItem('theme', newTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-4 right-4 p-2 rounded-full bg-neutral-200 dark:bg-neutral-800 
                hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <Moon className="w-5 h-5 text-neutral-800 dark:text-neutral-200" />
      ) : (
        <Sun className="w-5 h-5 text-neutral-800 dark:text-neutral-200" />
      )}
    </button>
  );
};

export default ThemeToggle;