import { createContext, useContext, useState } from "react";

export const themes = {
  sakura: {
    name: "🌸 Sakura",
    bg: { page: "#FFF5F8", card: "#FFE5F4", banner: "#FFB3C9" },
    primary: "#FFB3C9",
    primaryHover: "#f094ae",
    secondary: "#FFE5F4",
    accent: "#F0BDC6",
    text: "#5A3A4A",
    textSub: "#5A3A4A99",
    border: "#FFB3C9",
  },
  matcha: {
    name: "🌿 Matcha",
    bg: { page: "#F6F8F2", card: "#EEF3E8", banner: "#D4E1CC" },
    primary: "#B9C97B",
    primaryHover: "#9aaa5e",
    secondary: "#E7E4AF",
    accent: "#D4E1CC",
    text: "#3A4A2A",
    textSub: "#3A4A2A99",
    border: "#B9C97B",
  },
  lavender: {
    name: "💜 Lavender",
    bg: { page: "#F8F7FF", card: "#F9E2EB", banner: "#C9C9EA" },
    primary: "#8B98E3",
    primaryHover: "#6e7dd4",
    secondary: "#C9C9EA",
    accent: "#F5C8E7",
    text: "#3A3A6A",
    textSub: "#3A3A6A99",
    border: "#8B98E3",
  },
  aqua: {
    name: "🩵 Aqua Dream",
    bg: { page: "#F4F8FA", card: "#DED9E2", banner: "#C0B9DD" },
    primary: "#80A1D4",
    primaryHover: "#5f84c0",
    secondary: "#C0B9DD",
    accent: "#75C9C8",
    text: "#2A3A5A",
    textSub: "#2A3A5A99",
    border: "#80A1D4",
  },
};

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState("sakura");
  const theme = themes[currentTheme];

  return (
    <ThemeContext.Provider
      value={{ theme, currentTheme, setCurrentTheme, themes }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
