import { useEffect, useState } from 'react'
import './App.css'
import DailyQuote from "./components/DailyQuote";
import UserProfile from './components/UserProfile';
import Preferences from './components/Preferences';
import "./index.css";
import TaskList from './components/TaskList';
import ModalEditTask from './components/ModalEditTask';
import ModalAddTask from './components/ModalAddTask';
import { PreferencesContext, PreferencesProvider } from './context/PreferencesContext';


function App() {
  return (
    <PreferencesProvider>
    <main className='w-full max-w-screen h-[92vh] p-4 flex flex-col min-w-0'>
      <div className='flex flex-col md:flex-row gap-4 flex-1 min-w-0'>
        <div className='md:w-[66.6vw] w-full flex flex-col gap-4 min-w-0'>
        <TaskList/>
        </div>
        <div className='md:w-[33.3vw] w-full flex flex-col gap-4 min-w-0'>
          <div className='md:h-1/4 flex-1 min-w-0 '>
            <DailyQuote />
          </div>
          <div className='md:h-3/4 flex-1 min-w-0'>
            <Preferences />
          </div>
        </div>
      </div>
    </main>
    </PreferencesProvider>
  );
}


export default ToDoPage;