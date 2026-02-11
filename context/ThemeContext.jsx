"use client";

import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState('dark');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // Only run after mounting to avoid hydration mismatch
        setMounted(true);
        const savedTheme = localStorage.getItem('stylevault_theme');
        if (savedTheme) {
            setTheme(savedTheme);
            document.documentElement.setAttribute('data-theme', savedTheme);
        } else {
            // Default to dark
            document.documentElement.setAttribute('data-theme', 'dark');
        }
    }, []);

    const toggleTheme = () => {
        const themes = ['dark', 'light', 'midnight'];
        const currentIndex = themes.indexOf(theme);
        const nextIndex = (currentIndex + 1) % themes.length;
        const nextTheme = themes[nextIndex];

        setTheme(nextTheme);
        localStorage.setItem('stylevault_theme', nextTheme);
        document.documentElement.setAttribute('data-theme', nextTheme);
        document.body.setAttribute('data-theme', nextTheme);
    };

    const setThemeExplicit = (newTheme) => {
        if (['dark', 'light', 'midnight'].includes(newTheme)) {
            setTheme(newTheme);
            localStorage.setItem('stylevault_theme', newTheme);
            document.documentElement.setAttribute('data-theme', newTheme);
        }
    };

    // Prevent flash of unstyled content or hydration mismatch
    // by only rendering children after mounted or providing a safe default
    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, setThemeExplicit }}>
            <div className={mounted ? '' : 'opacity-0 transition-opacity duration-300'}>
                {children}
            </div>
        </ThemeContext.Provider>
    );
}

export const useTheme = () => useContext(ThemeContext);
