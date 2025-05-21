import { createContext, useEffect, useState } from "react";

export const PreferencesContext = createContext();

export function PreferencesProvider({ children }) {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("pref_darkMode") === "true";
  });

  const [deadlines, setDeadlines] = useState(() => {
    return localStorage.getItem("pref_deadlines") === "true";
  });

  const [autoComplete, setAutoComplete] = useState(() => {
    return localStorage.getItem("pref_completeTasks") === "true";
  });

  // Save preferences to localStorage
  useEffect(() => {
    localStorage.setItem("pref_darkMode", darkMode);
    localStorage.setItem("pref_deadlines", deadlines);
    localStorage.setItem("pref_autoComplete", autoComplete);
  }, [darkMode, deadlines, autoComplete]);

  // Apply dark mode to HTML root class
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const resetPreferences = () => {
    setDarkMode(false);
    setDeadlines(false);
    setAutoComplete(false);
  };

  return (
    <PreferencesContext.Provider
      value={{
        darkMode,
        setDarkMode,
        deadlines,
        setDeadlines,
        autoComplete,
        setAutoComplete,
        resetPreferences,
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
}
