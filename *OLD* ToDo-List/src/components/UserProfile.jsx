import { useQuery,useMutation } from "@tanstack/react-query";

function UserProfile() {
  
  return (
    <div className="daily-quote-card  w-full h-full">
      <div className="flex card-body text-black">
        <h2 className="card-title">Daily Quote</h2>
        <div className=""><p className="text-[22px]  italic font-thin break-words"></p></div>
        <p className="text-[15px] text-right mt-2"></p>
      </div>
    </div>
  );
}

export default UserProfile;