import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState('system');
    const [resolvedTheme, setResolvedTheme] = useState('light');

    const getSystemTheme = () =>
        window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

        useEffect(() => {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            
            const handleChange = () => {
                setResolvedTheme(theme === 'system' ? getSystemTheme() : theme);
            };

            mediaQuery.addEventListener('change', handleChange);
            return () => mediaQuery.removeEventListener('change', handleChange);
        }, [theme]);

        useEffect(() => {
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme) {
                setTheme(savedTheme);
                setResolvedTheme(savedTheme === 'system' ? getSystemTheme() : savedTheme);
            } else {
                setResolvedTheme(getSystemTheme());
            }
        }, []);

        const toggleTheme = (newTheme) => {
            const finalTheme = newTheme || (resolvedTheme === 'dark' ? 'light' : 'dark');
            setTheme(finalTheme);
            localStorage.setItem('theme', finalTheme);
            setResolvedTheme(finalTheme === 'system' ? getSystemTheme() : finalTheme);
        };

        useEffect(() => {
            document.documentElement.className = `theme-${resolvedTheme}`;
        }, [resolvedTheme]);

        return (
            <ThemeContext.Provider value={{ theme, resolvedTheme, toggleTheme }}>
                {children}
            </ThemeContext.Provider>
        );
};

export const useTheme = () => useContext(ThemeContext);