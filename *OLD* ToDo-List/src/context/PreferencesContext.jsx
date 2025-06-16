import { createContext, useEffect, useState } from "react";
//context = global SHARED state

//create the context
const PreferencesContext = createContext();

//function that stores user preferences and provides preferences to other components 
function PreferencesProvider({ children }) {
  //children = components inside provider wrapper (in app.jsx)

  //state dark mode and corresponding changing function
  const [darkMode, setDarkMode] = useState(() => {

    //method checking local storage to see if a preference was saved previously
    return localStorage.getItem("pref_darkMode") === "true";
  });

  //whether or not the user wants to set deadlines
  const [deadlines, setDeadlines] = useState(() => {
    return localStorage.getItem("pref_deadlines") === "true";
  });

  //whether or not the user wants to auto-complete tasks 
  const [autoComplete, setAutoComplete] = useState(() => {
    return localStorage.getItem("pref_completeTasks") === "true";
  });

  //any time darkMode, deadlines or autoComplete changes state, the preference is saved in local storage
  useEffect(() => {
    localStorage.setItem("pref_darkMode", darkMode);
    localStorage.setItem("pref_deadlines", deadlines);
    localStorage.setItem("pref_autoComplete", autoComplete);
  }, [darkMode, deadlines, autoComplete]);

  //if darkMode is true, set the HTML of the document to dark - in app.css, I have classes for each card in light and dark HTML
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  //function that resets all the preferences 
  const resetPreferences = () => {
    setDarkMode(false);
    setDeadlines(false);
    setAutoComplete(false);
  };

  //provide values to the components (context is now global for all the children)
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

//exporting the context and wrapper to use in other files
export {PreferencesContext,PreferencesProvider};
