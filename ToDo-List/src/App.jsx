import { useEffect, useState } from 'react'
import './App.css'
import DailyQuote from "./components/DailyQuote";
import "./index.css";

function App() {
  return (
    <div className="min-h-screen bg-base-200 p-6">
      <h1 className="text-3xl font-bold mb-8">My Task Manager</h1>

      {/* Show the daily quote in the top right corner */}
      <DailyQuote />

      {/* Other components can go here, like task list */}
    </div>
  );
}

export default App
