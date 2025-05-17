import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [quote, setQuote] = useState("Your daily quote is loading...");
  const [author, setAuthor] = useState("Author loading...");

  useEffect(() => {
    const url = "https://api.allorigins.win/get?url=" + encodeURIComponent("https://zenquotes.io/api/random");

    fetch(url)
      .then((res) => res.json())
      .then((result) => {
        const data = JSON.parse(result.contents);
        setQuote(data[0].q);
        setAuthor(data[0].a);
      })
  }, []);

  return (
    <>
      <title>To-Do List</title>
      <div>
        {/* This is the landing page with a task list, daily quote, and user preferences */}
        <div className="absolute top-4 left-4 card bg-primary text-primary-content w-96 shadow-md">
              <div className="card-body">
                <h2 className="card-title">Tasks</h2>
                <p className="text-lg">add task</p>
                <p className="text-md"></p>
              </div>
            </div>
        

        <div className="absolute top-4 right-4">
          <div className="flex flex-col space-y-8">
            {/* Daily Quote*/}
            <div className="card bg-primary text-primary-content w-96 shadow-md">
              <div className="card-body">
                <h2 className="card-title">Daily Quote</h2>
                <p className="text-lg">"{quote}"</p>
                <p className="text-md">- {author}</p>
              </div>
            </div>

            {/* User Preferences */}
            <div class="card bg-secondary text-secondary-content w-96 shadow-md">
              <div class="card-body">
                <h2 className="card-title">User Preferences</h2>
                <div class="card bg-base-100 w-75 shadow-sm padding-df">
                  <div class="card-body">
                    <h2 class="card-title text-white">Enable Dark Mode</h2>
                    <div class="card-actions justify-end">
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>



      </div>

    </>
  )
}

export default App
