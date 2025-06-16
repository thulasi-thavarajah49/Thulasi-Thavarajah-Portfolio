// src/pages/Logout.jsx
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import axios from "axios"; // or use your configured api instance if baseURL is correct
import api from "../api";
import "../index.css";


function Logout() {
  const navigate = useNavigate();
  const hasMutated = useRef(false)

  useEffect(() => {
    localStorage.removeItem("user");  // Clear logged-in user data
    navigate("/login");                // Redirect to login page
  }, []);


  const logoutMutation = useMutation({
    mutationFn: async () => {
      console.log("Sending logout request")
      const res = await api.post("/api/auth/logout");
      console.log("Logout response:", res.data);
      return res.data;
    },
    onSuccess: (data) => {
      console.log("Logout succeeded:", data)
      localStorage.removeItem("user");
      toast.success(data.message || "Logged out successfully");
      navigate("/login");
    },
    onError: (error) => {console.error("Logout error:", error);
    toast.error(
      "Logout failed: " + (error.response?.data?.message || error.message)
    );
    navigate("/login");
  },
  });

  useEffect(() => {
    if(!hasMutated.current){
      logoutMutation.mutate();
      hasMutated.current = true;
    }
  }, []);

  return <p className="text-center">Logging you out...</p>;
}

export default Logout;
