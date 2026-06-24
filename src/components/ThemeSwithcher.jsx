import React from "react";
import { useTheme, themes } from "../context/ThemeContext";

const ThemeSwitcher = () => {
  const { currentTheme, setCurrentTheme } = useTheme();

  return (
    <div className="flex items-center gap-2">
      {Object.entries(themes).map(([key, t]) => (
        <button
          key={key}
          onClick={() => setCurrentTheme(key)}
          title={t.name}
          style={{ backgroundColor: t.primary }}
          className={`w-5 h-5 rounded-full transition-all duration-300 ${
            currentTheme === key
              ? "scale-125 ring-2 ring-offset-1 ring-white"
              : "opacity-60 hover:opacity-100 hover:scale-110"
          }`}
        />
      ))}
    </div>
  );
};

export default ThemeSwitcher;
