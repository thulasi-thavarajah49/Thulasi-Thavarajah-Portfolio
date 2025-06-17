import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import api from "../api";
import "../index.css";


export default function Logout() {
  const navigate = useNavigate();

  //if logout mutation already run, dont run again
  const hasMutated = useRef(false)

  //clear stored data and redirect to home page
  useEffect(() => {
    localStorage.removeItem("user"); 
    navigate("/");                
  }, []);

  const logoutMutation = useMutation({


    mutationFn: async () => {
      //debug
      console.log("Sending logout request")
      const res = await api.post("/api/auth/logout");

      //debug
      console.log("Logout response:", res.data);
      return res.data;
    },


    onSuccess: (data) => {
      console.log("Logout succeeded:", data)

      //remove local storage item 
      localStorage.removeItem("user");
      toast.success(data.message || "Logged out successfully");

      //navigate to login 
      navigate("/");
    },


    onError: (error) => {console.error("Logout error:", error);
    toast.error(
      "Logout failed: " + (error.response?.data?.message || error.message)
    );

    //navigate to home 
    navigate("/home");
  },
  });

  //check if mutation is run in case of reload
  useEffect(() => {
    if(!hasMutated.current){
      logoutMutation.mutate();
      hasMutated.current = true;
    }
  }, []);

  return <p className="text-center">Logging you out...</p>;
}