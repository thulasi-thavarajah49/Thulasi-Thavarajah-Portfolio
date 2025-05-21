import { useState, useEffect } from "react";

//function that gets a daily quote
function DailyQuote() {

  //start off with the loading screen for the quote
  const [quote, setQuote] = useState("Loading...");
  const [author, setAuthor] = useState("Loading...");

  //run this once when the quote component loads 
    useEffect(() => {

    //fetch response from api
    fetch("https://quotes-api-self.vercel.app/quote")
    //convert response to JSON format
      .then(response => response.json())
      //change variable states of quote and author
      .then(quoteData => {
        setQuote(quoteData.quote);
        setAuthor(quoteData.author);
      })
      //if there is an error, display the following
      .catch(error => {
        setQuote("Could not load quote.");
        setAuthor("Could not load author.");
      });
  }, []);

  //show the quote and author on the screen
  return (
    <div className="daily-quote-card  w-full h-full">
      <div className="flex card-body text-black">
        <h2 className="card-title">Daily Quote</h2>
        <div className=""><p className="text-[22px]  italic font-thin break-words">"{quote}"</p></div>
        <p className="text-[15px] text-right mt-2">— {author}</p>
      </div>
    </div>
  );
}

export default DailyQuote;