import { useContext } from "react";
import { PreferencesContext } from "../context/PreferencesContext";
import "../index.css";


function Preferences() {

  //get values from preferences context
  const {
    darkMode,
    setDarkMode,
    deadlines,
    setDeadlines,
    autoComplete,
    setAutoComplete,
    resetPreferences,
  } = useContext(PreferencesContext);

  //display toggled preferences to the user
  return (
    <div className="preferences-card h-full w-full p-4 flex flex-col gap-4">
      <h2 className="card-title">Preferences</h2>

      {/* DARK MODE BUTTON */}
      <button className="btn btn-primary" onClick={() => setDarkMode(!darkMode)}>
        {/* swithes to ON or OFF based on true/flase */}
        Dark mode: {darkMode ? "ON" : "OFF"}
      </button>

      {/* DEADLINES BUTTON */}
      <button className="pref-button" onClick={() => setDeadlines(!deadlines)}>
        {/* swithes to ON or OFF based on true/flase */}
        Enable deadlines: {deadlines ? "ON" : "OFF"}
      </button>

      {/* AUTO-COMPLETE BUTTON */}
      <button className="pref-button" onClick={() => setAutoComplete(!autoComplete)}>
        {/* swithes to ON or OFF based on true/flase */}
        Auto-complete tasks: {autoComplete ? "ON" : "OFF"}
      </button>

      {/* RESET */}
      <button className="reset-button" onClick={resetPreferences}>
        Reset Preferences
      </button>
      <button className="btn btn-primary">
        hello
      </button>
    </div>
  );
}

export default Preferences;
