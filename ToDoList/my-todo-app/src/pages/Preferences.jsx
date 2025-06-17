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
    <div className="home-card bg-accent  flex flex-col gap-8 w-[97%] h-full">
      <div className="font-bold text-[22px]">Preferences</div>

      {/* DARK MODE BUTTON */}
      <button className="btn flex btn-soft w-full" onClick={() => setDarkMode(!darkMode)}>
        {/* swithes to ON or OFF based on true/flase */}
        Dark mode: {darkMode ? "ON" : "OFF"}
      </button>

      {/* DEADLINES BUTTON */}
      <button className="btn flex btn-soft w-full" onClick={() => setDeadlines(!deadlines)}>
        {/* swithes to ON or OFF based on true/flase */}
        Enable deadlines: {deadlines ? "ON" : "OFF"}
      </button>

      {/* AUTO-COMPLETE BUTTON */}
      <button className="btn flex btn-outline" onClick={() => setAutoComplete(!autoComplete)}>
        {/* swithes to ON or OFF based on true/flase */}
        Auto-complete tasks: {autoComplete ? "ON" : "OFF"}
      </button>

      {/* RESET */}
      <button className="btn flex btn-soft w-full" onClick={resetPreferences}>
        Reset Preferences
      </button>
    </div>
  );
}

export default Preferences;
