// src/pages/Register.jsx
import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "../index.css";


export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) navigate("/home");
  }, []);

  const registerMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post("/api/auth/register", {
        email,
        password,
      });
      return res.data;
    },
    onSuccess: (data) => {
      localStorage.setItem("user", JSON.stringify(data.user));
      toast.success("Account created! 🎉");
      navigate("/home");
    },
    onError: (error) => {
      toast.error("Registration failed: " + (error.response?.data?.message || error.message));
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    registerMutation.mutate();
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] bg-base-200 px-4">
      <div className="card w-full max-w-md shadow-lg bg-base-100">
        <div className="card-body">
          <h2 className="card-title justify-center">Register</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="user@example.com"
                className="input input-bordered"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={registerMutation.isLoading}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="input input-bordered"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={registerMutation.isLoading}
              />
            </div>

            <div className="form-control mt-6">
              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={registerMutation.isLoading}
              >
                {registerMutation.isLoading ? "Registering..." : "Register"}
              </button>
            </div>
          </form>

          <div className="text-center mt-4">
            <p>
              Already have an account?{" "}
              <a href="/login" className="text-primary hover:underline">
                Login here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
