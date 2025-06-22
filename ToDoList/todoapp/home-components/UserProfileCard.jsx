import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function UserProfile() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const logoutMutation = useMutation({
    mutationFn: async () => {
      return await api.post("/api/auth/logout");
    },
    onSuccess: (res) => {
      toast.success("Logout success:" || res.data?.message);
      queryClient.setQueryData(["user-profile"], null);
      navigate("/login");
    },
    onError: (err) => {
      toast.error("Logout failed:" || err.response?.data || err.message);
    },
  });

  const handleLogout = async () => {
    try {
      const res = await api.get("/api/auth/check");
      if (res.data?.authenticated) {
        logoutMutation.mutate();
      } else {
        toast.error("Already logged out.");
        navigate("/login");
      }
    } catch (err) {
      toast.error("Session check failed.");
      navigate("/login");
    }
  };

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
            <button className="btn btn-xl mt-2 mr-2" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
