import { useEffect, useState } from 'react'
import './App.css'
import DailyQuote from "./components/DailyQuote";
import "./index.css";
import Preferences from './components/Preferences';

function App() {
  return (
    <div>
      <DailyQuote/>
      <Preferences/>
    </div>
  );
}

export default App;