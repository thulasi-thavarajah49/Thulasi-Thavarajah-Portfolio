// src/pages/Home.jsx
import TaskList from "./TaskList";
import ErrorBoundary from "../ErrorBoundary";
import DailyQuote from "./DailyQuote";
import Preferences from "./Preferences";
import { PreferencesProvider } from "../context/PreferencesContext";
import "../index.css";


export default function Home() {
  return <div className="p-4 text-xl"><ErrorBoundary>
    <PreferencesProvider>
<TaskList/>
<DailyQuote/>
<Preferences/>
    </PreferencesProvider>
  </ErrorBoundary>
  </div>;
}
