import { useState, useEffect } from 'react';

export function useTheme() {
  const [theme, setTheme] = useState(() => localStorage.getItem('app-theme') || 'dark');
  const [palette, setPalette] = useState(() => localStorage.getItem('app-palette') || 'indigo');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    window.localStorage.setItem('app-theme', theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute('data-palette', palette);
    window.localStorage.setItem('app-palette', palette);
  }, [palette]);

  return { theme, setTheme, palette, setPalette };
}
