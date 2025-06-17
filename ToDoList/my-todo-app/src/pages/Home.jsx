import TaskList from "./TaskList";
import { Link } from "react-router-dom";
import Login from "./Login";
import Logout from "./Logout";
import ErrorBoundary from "../ErrorBoundary";
import DailyQuote from "./NewDailyQuote";
import Preferences from "./Preferences";
import { PreferencesProvider } from "../context/PreferencesContext";
import "../index.css";


export default function Home() {
  return <div className="text-xl flex flex-col p-4">
    {/* Navbar */}
    <div className="bg-base-100 w-full flex flex-col justify-center items-center mx-[4px]">
      <div className="flex-none gap-2 items-center">
        <Link className="btn btn-soft btn-outline w-[98vw]" to="/logout">Logout</Link>
      </div>
      <div className="text-[15px] text-transparent">hello</div>
    </div>

    <ErrorBoundary>
      <PreferencesProvider>
        <main className='w-full max-w-screen h-[92vh] gap-4 flex flex-col min-w-0'>
          <div className='flex flex-col md:flex-row flex-1 gap-4 min-w-0'>
            <div className='md:w-[66.6vw] w-full min-w-0'>
              <TaskList />
            </div>
            <div className='md:w-[33.3vw] w-full flex flex-col gap-4 min-w-0'>
  <DailyQuote />
  <Preferences />
</div>

          </div>
        </main>
      </PreferencesProvider>
    </ErrorBoundary>
  </div>;
}
