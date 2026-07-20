import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export type ThemeName = 'light' | 'dark' | 'corporate';

interface ThemeCtx {
  theme: ThemeName;
  setTheme: (t: ThemeName) => void;
  toggle: () => void;
  cycle: () => void;
}

const Ctx = createContext<ThemeCtx>({ theme: 'light', setTheme: () => {}, toggle: () => {}, cycle: () => {} });

const applyTheme = (theme: ThemeName) => {
  const root = document.documentElement;
  root.classList.remove('dark', 'theme-corporate');
  if (theme === 'dark') root.classList.add('dark');
  if (theme === 'corporate') root.classList.add('dark', 'theme-corporate');
  localStorage.setItem('theme', theme);
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<ThemeName>(() => {
    if (typeof window === 'undefined') return 'light';
    return (localStorage.getItem('theme') as ThemeName) || 'light';
  });

  useEffect(() => { applyTheme(theme); }, [theme]);

  const setTheme = (t: ThemeName) => setThemeState(t);
  const toggle = () => setThemeState(t => (t === 'light' ? 'dark' : 'light'));
  const cycle = () => setThemeState(t => (t === 'light' ? 'dark' : t === 'dark' ? 'corporate' : 'light'));

  return (
    <Ctx.Provider value={{ theme, setTheme, toggle, cycle }}>
      {children}
    </Ctx.Provider>
  );
};

export const useTheme = () => useContext(Ctx);
