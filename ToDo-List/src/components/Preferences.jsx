import { useState, useEffect } from "react";

//function that manages the preferences 
function Preferences() {
  const [darkMode, setDarkMode] = useState(false);
  const [deadlines, setDeadlines] = useState(false);
  const [completeTasks, setCompleteTasks] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  //reset all preferences to default
  const resetPreferences = () => {
    setDarkMode(false);
    setDeadlines(false);
    setCompleteTasks(false);
  };

  //show the preferences card on the screen 
  return (
    <div className="preferences-card">
      <div className="card-body">
        <h2 className="card-title">User Preferences</h2>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="button"
        >
          <p>{darkMode ? "Dark mode: ON" : "Dark mode: OFF"}</p>
        </button>
        <button
          onClick={() => setDeadlines(!deadlines)}
          className="button"
        >
          <p>{deadlines ? "Enable deadlines: ON" : "Enable deadlines: OFF"}</p>
        </button>
        <button
          onClick={() => setCompleteTasks(!completeTasks)}
          className="button">
          {completeTasks ? "Enable deadlines: ON" : "Enable deadlines: OFF"}
        </button>
        <button
          onClick={resetPreferences}
          className="reset-button"
        >
          Reset Preferences
        </button>

      </div>
    </div>
  );
}

export default Preferences;
