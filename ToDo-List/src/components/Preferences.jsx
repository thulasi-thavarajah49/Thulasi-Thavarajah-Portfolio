import { useContext } from "react";
import { PreferencesContext } from "../context/PreferencesContext";

function Preferences() {
  const {
    darkMode,
    setDarkMode,
    deadlines,
    setDeadlines,
    autoComplete,
    setAutoComplete,
    resetPreferences,
  } = useContext(PreferencesContext);

  return (
    <div className="preferences-card h-full w-full p-4 flex flex-col gap-4">
      <h2 className="card-title">Preferences</h2>
      <button className="pref-button w-full" onClick={() => setDarkMode(!darkMode)}>
        Dark mode: {darkMode ? "ON" : "OFF"}
      </button>
      <button className="pref-button" onClick={() => setDeadlines(!deadlines)}>
        Enable deadlines: {deadlines ? "ON" : "OFF"}
      </button>
      <button className="pref-button" onClick={() => setAutoComplete(!autoComplete)}>
        Auto-complete tasks: {autoComplete ? "ON" : "OFF"}
      </button>
      <button className="reset-button" onClick={resetPreferences}>
        Reset Preferences
      </button>
    </div>
  );
}

export default Preferences;
