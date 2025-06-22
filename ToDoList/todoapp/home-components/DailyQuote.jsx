import { useQuery } from "@tanstack/react-query";

function DailyQuote() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["daily-quote"],
    queryFn: async () => {
      const res = await fetch("https://quotes-api-self.vercel.app/quote");
      return res.json();
    },
    cacheTime: 0, // do not cach in memory
    staleTime: 0, //data always stale, and refetch is triggered
    refetchOnMount: true, //refetch when the component mounts again
  });

  if (isLoading) {
    return (
      <div className="card card-xl bg-accent text-primary-content shadow-sm h-full p-2">
        <div className="card-body justify-between">
          <div>
            <h2 className="card-title">Daily Quote</h2>
          </div>
          <div>
            <div className="text-center italic font-thin text-[22px] p-6 ">
              Loading quote . . .
            </div>
          </div>
          <div className="text-right">- Unknown</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card bg-accent text-primary-content shadow-sm p-2">
        <div className="card-body">
          <h2 className="card-title">Daily Quote</h2>
          <div className="text-center italic font-thin text-[18px]">
            Failed to load quote.
          </div>
          <div className="text-left">- Unknown</div>
          <div className="card-actions justify-end">
            <button className="btn" disabled>
              New Quote
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card card-xl bg-accent text-primary-content shadow-sm h-full p-2">
      <div className="card-body justify-between">
        <div>
          <h2 className="card-title">Daily Quote</h2>
        </div>
        <div>
          <div className="text-center italic font-thin text-[22px] p-1 ">
            "{data.quote}"
          </div>
        </div>
        <div className="text-right">- {data.author}</div>
      </div>
    </div>
  );
}

export default DailyQuote;
