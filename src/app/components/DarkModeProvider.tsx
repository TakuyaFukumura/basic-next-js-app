'use client';

import {createContext, useContext, useEffect, useState, ReactNode} from 'react';

type Theme = 'light' | 'dark' | 'system';

interface DarkModeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    isDark: boolean;
}

const DarkModeContext = createContext<DarkModeContextType | undefined>(undefined);

export function DarkModeProvider({children}: { children: ReactNode }) {
    const [theme, setThemeState] = useState<Theme>('system');
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        // ローカルストレージからテーマを読み込み
        const savedTheme = localStorage.getItem('theme') as Theme;
        if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
            setThemeState(savedTheme);
        }
    }, []);

    useEffect(() => {
        const updateTheme = () => {
            let isDarkMode = false;

            if (theme === 'dark') {
                isDarkMode = true;
            } else if (theme === 'light') {
                isDarkMode = false;
            } else {
                // system
                isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
            }

            setIsDark(isDarkMode);

            // HTMLタグにdarkクラスを追加/削除
            if (isDarkMode) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        };

        updateTheme();

        // システムテーマの変更を監視
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        if (theme === 'system') {
            mediaQuery.addEventListener('change', updateTheme);
        }

        return () => {
            mediaQuery.removeEventListener('change', updateTheme);
        };
    }, [theme]);

    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme);
        localStorage.setItem('theme', newTheme);
    };

    return (
        <DarkModeContext.Provider value={{theme, setTheme, isDark}}>
            {children}
        </DarkModeContext.Provider>
    );
}

export function useDarkMode() {
    const context = useContext(DarkModeContext);
    if (context === undefined) {
        throw new Error('useDarkMode must be used within a DarkModeProvider');
    }
    return context;
}
