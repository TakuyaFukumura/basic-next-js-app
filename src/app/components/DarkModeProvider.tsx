'use client';

import {createContext, ReactNode, useContext, useEffect, useMemo, useState} from 'react';

type Theme = 'light' | 'dark';

interface DarkModeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    isDark: boolean;
}

const DarkModeContext = createContext<DarkModeContextType | undefined>(undefined);
const isTheme = (value: string | null): value is Theme => value === 'light' || value === 'dark';

export function DarkModeProvider({children}: { readonly children: ReactNode }) {
    const [theme, setTheme] = useState<Theme>('light');
    const isDark = theme === 'dark';

    useEffect(() => {
        try {
            const savedTheme = localStorage.getItem('theme');

            if (isTheme(savedTheme)) {
                setTheme(savedTheme);
            }
        } catch {
            // localStorage が利用できない環境ではデフォルトテーマを維持する
        }
    }, []);

    useEffect(() => {
        // HTMLタグにdarkクラスを追加/削除
        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDark]);

    const handleSetTheme = (newTheme: Theme) => {
        setTheme(newTheme);

        try {
            localStorage.setItem('theme', newTheme);
        } catch {
            // localStorage が利用できない環境では状態更新のみ行う
        }
    };

    const value = useMemo(() => ({theme, setTheme: handleSetTheme, isDark}), [theme, isDark]);

    return (
        <DarkModeContext.Provider value={value}>
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
