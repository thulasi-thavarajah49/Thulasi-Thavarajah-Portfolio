import UserProfile from "../home-components/UserProfileCard";
import { PreferencesProvider } from "../context/PreferencesContext";
import Preferences from "../home-components/PreferenceCard";
import DailyQuote from "../home-components/DailyQuote";
import TaskList from "../home-components/TaskList";

export default function HomePage() {
  return (
    <>
      <PreferencesProvider>
        <div className="flex flex-col md:flex-row p-4 gap-4">
          <div className="md:w-[65%]">
            <div className="w-full flex flex-col gap-4">
              <div className="">
                <UserProfile />
              </div>
              <div className="">
                <TaskList />
              </div>
            </div>
          </div>
          <div className="md:w-[35%]">
            <div className="w-full h-screen flex flex-col gap-4">
              <div className="h-[45%]">
                <DailyQuote />
              </div>
              <div className="h-[50%]">
                <Preferences />
              </div>
            </div>
          </div>
        </div>
      </PreferencesProvider>
    </>
  );
}
