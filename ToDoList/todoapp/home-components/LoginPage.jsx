import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import api from "../api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Login() {
  //store email + password
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  //navigate to different pages
  const navigate = useNavigate();

  //login mutation - if successful, navigates to home, otherwise presents error
  const loginMutation = useMutation({
    mutationFn: async (credentials) => {
      return await api.post("/api/auth/login", credentials);
    },
    onSuccess: (res) => {
      toast.success("Login success:", res.data);
      navigate("/");
    },
    onError: (err) => {
      toast.error("Login failed:", err.response?.data || err.message);
    },
  });

  //function to call mutation (for login button)
  const handleLogin = () => {
    loginMutation.mutate({ email, password });
  };

  return (
    <div className="flex flex-col h-screen justify-center items-center gap-5">
      <div className="text-[25px] font-thin">Welcome!</div>
      <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
        <label className="label">Email</label>
        <input
          type="email"
          className="input"
          placeholder="user@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label className="label">Password</label>
        <input
          type="password"
          className="input"
          placeholder="••••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="btn btn-neutral mt-4"
          onClick={handleLogin}
          //if mutation in progress, do not allow another click
          disabled={loginMutation.isPending}
        >
          {/* if mutation pending, change test */}
          {loginMutation.isPending ? "Logging in..." : "Login"}
        </button>
      </fieldset>
      <div className="text-[15px]">
        Don't have an account? {/* link to register page */}
        <Link to="/register" className="text-blue-900 underline">
          Register here.
        </Link>{" "}
      </div>
    </div>
  );
}
