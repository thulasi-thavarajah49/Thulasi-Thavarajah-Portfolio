import { useContext } from "react";
import { PreferencesContext } from "../context/PreferencesContext";

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
    <div class="card card-xl bg-secondary text-secondary-content h-full">
      <div class="card-body justify-between">
        <h2 class="card-title p-2">User Preferences</h2>
        <div class="card-actions justify-between items-center p-2">
          <p>Dark Mode</p>
          <button class="btn w-20" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? "ON" : "OFF"}
          </button>
        </div>
        <div class="card-actions justify-between items-center p-2">
          <p>Deadlines</p>
          <button class="btn w-20" onClick={() => setDeadlines(!deadlines)}>
            {deadlines ? "ON" : "OFF"}
          </button>
        </div>
        <div class="card-actions justify-between items-center p-2">
          <p>Auto-Complete</p>
          <button
            class="btn w-20"
            onClick={() => setAutoComplete(!autoComplete)}
          >
            {autoComplete ? "ON" : "OFF"}
          </button>
        </div>
        <div class="card-actions justify-between items-center p-2">
          <button class="btn btn-lg w-full" onClick={() => resetPreferences()}>
            Reset All Preferences
          </button>
        </div>
      </div>
    </div>
  );
}

export default Preferences;
