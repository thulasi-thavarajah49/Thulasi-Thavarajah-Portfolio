import { useState, useEffect } from "react";
import {
  useMutation
} from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "../index.css";


export default function Login() {

  //using state to store values and corresponding update function
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  //
  const navigate = useNavigate();

  //on reloads, check local storage for a user login
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      //if there is a user, navigate to the home page 
      navigate("/home")
    }
  }, []);

  //login requests using useMutation
  const loginMutation = useMutation({

    //mutation function to send post request with email and password, and store response
    mutationFn: async () => {
      const res = await api.post("/api/auth/login", { email, password });

      return res.data;
    },

    //if successful, set user in the local storage, and put toast notification
    onSuccess: async (data) => {
      localStorage.setItem("user", JSON.stringify(data.user));
      toast.success("Logged in successfully!");

      //add a delay before redirecting to home to allow toast notification to appear
      
      navigate("/home");
    },

    //if there is an error, display the error message from the api OR the error message for JS
    onError: (error) => {
      toast.error('Login failed: ' + (error.response?.data?.message || error.message));
    },
  });

  //don't let browser reload, and trigger mutation function
  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation.mutate();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[100vh] bg-base-200 px-4 gap-7">
      <div className="text-[20px] w-[50vw]center">Welcome!</div>

      {/* field set class from daisy ui*/}
      <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-[50vw] border p-4">
        <div className="text-[25px] text-center font-bold">Login</div>
        <div>
          {/* use hande submit function to submit form */}
          <form onSubmit={handleSubmit} className="form-control gap-6">
            <div className="">
              <div><label className="label">
                <span className="label-text text-[20px]">Email</span>
              </label></div>
              {/* input field */}
              <input
                type="email"
                placeholder="user@example.com"
                className="input"
                style={{ fontSize: '20px' }}
                value={email}

                //when form changes (user is typing), update email
                onChange={(e) => setEmail(e.target.value)}

                //response from user required
                required

                //while the mutation function is running, input is not allowed 
                disabled={loginMutation.isLoading}
              />
            </div>

            <div className="form-control">
              <div><label className="label">
                <span className="label-text text-[20px] ">Password</span>
              </label></div>
              
              {/* input field */}
              <input
                type="password"
                placeholder="••••••••"
                className="input rounded-box"
                  style={{ fontSize: '20px' }}
                value={password}

                //when form changes (user is typing), update password
                onChange={(e) => setPassword(e.target.value)}

                //response from user required
                required

                //while the mutation function is running, input is not allowed 
                disabled={loginMutation.isLoading}
              />
            </div>

            <div className="form-control mt-6 text-[20px] p-5">
              <button
                //connects to onSubmit handler
                type="submit"
                className="glass btn btn-primary w-full "

                //prevents another submission
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
          <button
          className="text-primary underline cursor-pointer"
          onClick={() => navigate("/register")}
          >
          Register here
          </button>
        </p>
      </div>


    </div>
  );
}
