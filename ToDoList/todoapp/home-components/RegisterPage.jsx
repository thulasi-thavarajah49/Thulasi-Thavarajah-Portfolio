import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Register() {
  //store email + password
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  //navigate to different pages
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  //once you register, the api automatically logs you in, so I can't redirect the user to the login page and have them input their details without errors

  //as a result, once you register, to have them sign in again, is to log them out upon registration and lead them to the home page

  //logout mutation for registration - if successful, clear user-profile query data and navigate to login
  const logoutMutation = useMutation({
    mutationFn: async () => {
      return await api.post("/api/auth/logout");
    },
    onSuccess: (res) => {
      queryClient.setQueryData(["user-profile"], null);
      navigate("/login");
    },
    onError: (err) => {
      toast.error("Logout failed:", err.response?.data || err.message);
    },
  });

  //registration mutation - upon success, logs you out and then redirects to login page
  const registerMutation = useMutation({
    mutationFn: async (credentials) => {
      return await api.post("/api/auth/register", credentials);
    },
    onSuccess: async () => {
      toast.success("Account created successfully!");

      await logoutMutation.mutateAsync();

      toast.success("Redirecting to login page . . .");
      navigate("/login");
    },
    onError: (err) => {
      toast.error("Registration failed:", err.response?.data || err.message);
    },
  });

  //function to call registration mutation ( for register button)
  const handleRegister = () => {
    registerMutation.mutate({ email, password });
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
          onClick={handleRegister}
          //when mutation pending, disable another api call
          disabled={registerMutation.isPending}
        >
          {registerMutation.isPending ? "Registering..." : "Register"}
        </button>
      </fieldset>
      <div className="text-[15px]">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-900 underline">
          Login here.
        </Link>
      </div>
    </div>
  );
}
