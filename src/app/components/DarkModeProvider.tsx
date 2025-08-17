'use client';

import {createContext, useContext, useEffect, useState, ReactNode} from 'react';

type Theme = 'light' | 'dark';

interface DarkModeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    isDark: boolean;
}

const DarkModeContext = createContext<DarkModeContextType | undefined>(undefined);

export function DarkModeProvider({children}: { readonly children: ReactNode }) {
    const [theme, setThemeState] = useState<Theme>('light');
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        // ローカルストレージからテーマを読み込み
        const savedTheme = localStorage.getItem('theme') as Theme;
        if (savedTheme && ['light', 'dark'].includes(savedTheme)) {
            setThemeState(savedTheme);
        }
    }, []);

    useEffect(() => {
        const updateTheme = () => {
            const isDarkMode = theme === 'dark';
            setIsDark(isDarkMode);

            // HTMLタグにdarkクラスを追加/削除
            if (isDarkMode) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        };

        updateTheme();
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
