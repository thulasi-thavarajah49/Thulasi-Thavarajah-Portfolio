import { useQuery } from "@tanstack/react-query";
import api from "../api";

export default function UserProfile() {
  const { isLoading, error, data } = useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const res = await api.get("/api/auth/profile");
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="card card-xl bg-primary text-primary-content shadow-sm">
        <div className="card-body">
          <h2 className="card-title">User Profile</h2>
          <div className="text-center">Loading . . .</div>
        </div>
      </div>
    );
  }

  if (error) {
    const apiMessage =
      error.response?.data?.message || "An unexpected error occurred.";
    return (
      <div className="card card-xl bg-primary text-primary-content shadow-sm">
        <div className="card-body">
          <h2 className="card-title">User Profile</h2>
          <div className="text-left">{apiMessage}</div>
          <div className="card-actions justify-end">
            <button className="btn mt-3 mr-2">Logout</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="card card-xl bg-primary text-primary-content shadow-sm">
        <div className="card-body">
          <div className="card-actions justify-between">
            <div>
              <h2 className="card-title mb-2">User Profile</h2>
              <div className="text-left">Welcome, {data.user.email}!</div>
            </div>
            <button className="btn btn-xl mt-2 mr-2">Logout</button>
          </div>
        </div>
      </div>
    </>
  );
}
