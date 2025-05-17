import React, { createContext, useContext, useState, useEffect } from "react";
import { saveToStorage, loadFromStorage } from "../utils/localStorage";

const defaultPreferences = {
  theme: "light",
  autoComplete: false,
  enableDeadlines: true,
  quoteRefreshRate: 15,
};

const PreferencesContext = createContext();

export const PreferencesProvider = ({ children }) => {
  const [preferences, setPreferences] = useState(() =>
    loadFromStorage("preferences", defaultPreferences)
  )

  useEffect(() => {
    saveToStorage("preferences", preferences);
    document.documentElement.setAttribute("data-theme", preferences.theme)
  },
    [preferences]
  )
};

const updatePreferences =(key,value) => {
  setPreferences(prev => ({...prev,[key]:value}));
};

const resetPreferences = () => {
  setPreferences(defaultPreferences);
  localStorage.clear();
};

return (
  <PreferencesContext.Provider value ={{preferences,updatePreferences,resetPreferences}}>{children}</PreferencesContext.Provider>
)

export const usePreferences = () => useContext(PreferencesContext);