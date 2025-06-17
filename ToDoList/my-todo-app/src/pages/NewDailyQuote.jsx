import { useQuery } from "@tanstack/react-query";

function DailyQuote() {
  const {data, isLoading, error} =useQuery({
    queryKey: ["dailyQuote"],
    queryFn: async () => {
      const res = await fetch("https://quotes-api-self.vercel.app/quote");
      if(!res.ok) throw new Error("Failed yo fetch quote");
      return res.json();
    },
    cacheTime: 0, // do not cach in memory
    staleTime: 0, //data always stale, and refetch is triggered
    refetchOnMount: true, //refetch when the component mounts again
  });

  if (isLoading) {
    return (<div className="home-card bg-secondary text-neutral-content w-[97%]">
      <div className="flex flex-col p-7">
        <p className="font-bold text-[22px]">Daily Quote</p>
        <div className=""><p className="text-[25px]  italic font-thin break-words">Your Daily Quote is Loading . . . </p></div>
        <p className="text-[15px] text-right ">— Author loading . . .</p>
      </div>
    </div>)
  }

  if(error) {
    return(
      <div className="home-card bg-secondary text-neutral-content w-[97%]">
      <div className="flex flex-col p-7">
        <p className="font-bold text-[22px]">Daily Quote</p>
        <div className=""><p className="text-[25px]  italic font-thin break-words">Could not load quote</p></div>
        <p className="text-[15px] text-right ">- Unknown</p>
      </div>
    </div>
    )
  }

  return(
    <div className="home-card bg-secondary text-neutral-content w-[97%]">
      <div className="flex flex-col p-7">
        <p className="font-bold text-[22px]">Daily Quote</p>
        <div className=""><p className="text-[25px]  italic font-thin break-words">"{data?.quote || "Quote unavailable"}"</p></div>
        <p className="text-[15px] text-right ">— {data?.author || "Unknown"}</p>
      </div>
    </div>
  );
}

export default DailyQuote;