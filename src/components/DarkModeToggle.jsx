import React, { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from './ui/button';

const DarkModeToggle = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme');

    // Check if matchMedia is available (it might not be in some test environments)
    let prefersDark = false;
    try {
      if (window.matchMedia) {
        prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      }
    } catch (e) {
      console.warn('matchMedia not supported', e);
    }
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    
    if (newIsDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleDarkMode}
      className="fixed top-6 right-6 z-50 bg-card/90 backdrop-blur-sm border-border shadow-md hover:shadow-lg transition-all duration-normal"
      aria-label="Toggle dark mode"
    >
      {isDark ? (
        <Sun className="h-4 w-4 text-accent" />
      ) : (
        <Moon className="h-4 w-4 text-primary" />
      )}
      <span className="sr-only">Toggle dark mode</span>
    </Button>
  );
};

export default DarkModeToggle;
