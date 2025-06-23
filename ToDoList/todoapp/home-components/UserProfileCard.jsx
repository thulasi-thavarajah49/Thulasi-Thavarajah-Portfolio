import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function UserProfile() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  //logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      return await api.post("/api/auth/logout");
    },
    onSuccess: (res) => {
      toast.success("Logout success!");
      queryClient.setQueryData(["user-profile"], null);
      navigate("/login");
    },
    onError: (err) => {
      toast.error("Logout failed:", err.response?.data || err.message);
    },
  });

  //if user presses button twice
  const handleLogout = () => {
    logoutMutation.mutate();
  };

  //display user details (just the email)
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

    //if user not found, redirect to login
    if (error.response?.status === 401) {
      navigate("/login");
      return null;
    }

    return (
      <div className="card card-xl bg-primary text-primary-content shadow-sm">
        <div className="card-body">
          <h2 className="card-title">User Profile</h2>
          <div className="text-left">{apiMessage}</div>
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
              <div className="text-left">
                Welcome, {data?.user?.email || "User"}!
              </div>
            </div>
            <button
              className="btn btn-xl mt-2 mr-2"
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
