import { useState, useEffect } from "react";
import {
  useMutation
} from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "../index.css";


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      navigate("/home")
    }
  }, []);

  // React Query mutation for login
  const loginMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post("/api/auth/login", { email, password });

      return res.data;
    },
    onSuccess: async (data) => {
      localStorage.setItem("user", JSON.stringify(data.user));
      toast.success("Logged in successfully!");
      // Optionally store user info or token here, e.g. localStorage.setItem(...)
      // Then redirect to home
      await new Promise((resolve) => setTimeout(resolve, 100));
      navigate("/home");
    },
    onError: (error) => {
      toast.error('Login failed: ' + (error.response?.data?.message || error.message));
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation.mutate();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[100vh] bg-base-200 px-4 gap-7">
      <div className="text-[20px] w-[50vw]center">Welcome!</div>
      <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-[50vw] border p-4">
        <div className="text-[25px] text-center font-bold">Login</div>
        <div><form onSubmit={handleSubmit} className="form-control gap-6">
            <div className="">
              <div><label className="label">
                <span className="label-text text-[20px]">Email</span>
              </label></div>
              <input
                type="email"
                placeholder="user@example.com"
                className="input"
                style={{ fontSize: '20px' }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loginMutation.isLoading}
              />
            </div>

            <div className="form-control">
              <div><label className="label">
                <span className="label-text text-[20px] ">Password</span>
              </label></div>
              
              <input
                type="password"
                placeholder="••••••••"
                className="input rounded-box"
                  style={{ fontSize: '20px' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loginMutation.isLoading}
              />
            </div>

            <div className="form-control mt-6 text-[20px] p-5">
              <button
                type="submit"
                className="glass btn btn-primary w-full "
                disabled={loginMutation.isLoading}
              >
                {loginMutation.isLoading ? "Logging in..." : "Login"}
              </button>
            </div>
          </form></div>
      </fieldset>


      <div className="text-center mt-4 text-[20px]">
        <p>
          Don't have an account?{" "}
          <a href="/register" className="text-primary hover:underline">
            Register here
          </a>
        </p>
      </div>


    </div>
  );
}
