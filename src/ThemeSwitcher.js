import React from "react";
import { useTheme } from "./ThemeProvider";
// Доступные темы
const themes = [
  { id: "light", icon: "☀️", label: "Светлая" },
  { id: "system", icon: "⚙️", label: "Системная" },
  { id: "dark", icon: "🌙", label: "Тёмная" },
];

const ThemeSwitcher = () => {
  const { theme, toggleTheme } = useTheme();
  const activeIndex = themes.findIndex((t) => t.id === theme);

  return (
    <div className="theme-switcher">
        <div className="switch-container">
          {/* Слайдер, показывающий активную тему */}
            <div className="switch-slider" style={{left: activeIndex === 0 ? "5px" : activeIndex === 1 ? "40px": "75px"}} />
            {themes.map(({ id, icon, label }) => (
                <button
                    key={id}
                    onClick={() => toggleTheme(id)}
                    className={`switch-btn ${theme === id ? "active" : ""}`}
                    aria-label={label}
                >
                    {icon}
                </button>
            ))}
        </div>
    </div>
  );
};

export default ThemeSwitcher;