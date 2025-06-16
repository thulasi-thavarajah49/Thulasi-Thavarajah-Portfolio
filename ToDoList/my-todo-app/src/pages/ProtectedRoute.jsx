// src/components/ProtectedRoute.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import toast from "react-hot-toast";
import "../index.css";


export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyUser = async () => {
      try {
        await api.get("/api/auth/check");
        setLoading(false); // Auth successful
      } catch (err) {
        toast.error("You must be logged in");
        localStorage.removeItem("user");
        navigate("/login");
      }
    };

    verifyUser();
  }, []);

  if (loading) return <p className="text-center">Checking login...</p>;

  return children;
}
