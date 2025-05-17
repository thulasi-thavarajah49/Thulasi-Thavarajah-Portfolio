import { useState, useEffect } from "react";

//function that gets a daily quote
function DailyQuote() {
  //start off with the loading screen for the quote
  const [quote, setQuote] = useState("Loading...");
  const [author, setAuthor] = useState("Loading...");

  //run this once when the quote component loads 
    useEffect(() => {
    //fetch response 
    fetch("https://quotes-api-self.vercel.app/quote")
      .then(response => response.json())
      //initialize data
      .then(data => {
        setQuote(data.quote);
        setAuthor(data.author);
      })
      //if there is an error, display the following
      .catch(error => {
        setQuote("Could not load quote.");
        setAuthor("Unknown");
      });
  }, []);

  //show the quote and author on the screen
  return (
    <div className="card bg-primary text-primary-content w-96 fixed top-5 right-5 shadow-lg">
      <div className="card-body">
        <h2 className="card-title">Daily Quote</h2>
        <p className="italic">"{quote}"</p>
        <p className="text-right mt-2">— {author}</p>
      </div>
    </div>
  );
}

export default DailyQuote;
