import { useEffect, useState } from 'react'
import './App.css'
import DailyQuote from "./components/DailyQuote";
import Preferences from './components/Preferences';
import "./index.css";

function App() {
  return (
    <main className=' ml-0 mr-6 flex flex-col justify-evenly h-[92vh] p-4 min-w-[90vw'>
      <div className='flex flex-col md:flex-row gap-4 flex-1/3'>
        <div className='md:w-2/3'><DailyQuote/></div>
        <div className='md:w-1/3 flex flex-col gap-4'>
        <div className='md:h-2/5'><DailyQuote/></div>
        <div className='md:h-3/5'><Preferences/></div>
        </div>
      </div>
    </main>

      
  );
}

export default App;