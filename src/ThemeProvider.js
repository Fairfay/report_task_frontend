import React, { createContext, useContext, useState, useEffect } from 'react';
// Контекст темы: предоставляет текущую тему и функцию переключения
const ThemeContext = createContext();
// Поставщик темы: оборачивает всё приложение
export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState('system');
    const [resolvedTheme, setResolvedTheme] = useState('light');
    // Определяет системную тему пользователя
    const getSystemTheme = () =>
        window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        // Отслеживаем изменения системной темы
        useEffect(() => {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            
            const handleChange = () => {
                setResolvedTheme(theme === 'system' ? getSystemTheme() : theme);
            };

            mediaQuery.addEventListener('change', handleChange);
            return () => mediaQuery.removeEventListener('change', handleChange);
        }, [theme]);
        // Загружаем сохраненную тему из localStorage при старте
        useEffect(() => {
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme) {
                setTheme(savedTheme);
                setResolvedTheme(savedTheme === 'system' ? getSystemTheme() : savedTheme);
            } else {
                setResolvedTheme(getSystemTheme());
            }
        }, []);
        // Переключает тему и сохраняет выбор в localStorage
        const toggleTheme = (newTheme) => {
            const finalTheme = newTheme || (resolvedTheme === 'dark' ? 'light' : 'dark');
            setTheme(finalTheme);
            localStorage.setItem('theme', finalTheme);
            setResolvedTheme(finalTheme === 'system' ? getSystemTheme() : finalTheme);
        };
        // Обновляем класс на <html> для применения CSS-темы
        useEffect(() => {
            document.documentElement.className = `theme-${resolvedTheme}`;
        }, [resolvedTheme]);

        return (
            <ThemeContext.Provider value={{ theme, resolvedTheme, toggleTheme }}>
                {children}
            </ThemeContext.Provider>
        );
};
// Хук для использования темы в любом компоненте
export const useTheme = () => useContext(ThemeContext);