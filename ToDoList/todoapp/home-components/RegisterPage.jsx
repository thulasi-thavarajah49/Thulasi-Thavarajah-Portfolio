import { useQuery, useMutation } from "@tanstack/react-query";
import api from "../api";

export default function Register() {
  return (
    <div className="flex flex-col h-screen justify-center items-center gap-5">
      <div className="text-[25px] font-thin">Welcome!</div>
      <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
        <label className="label">Email</label>
        <input type="email" className="input" placeholder="user@example.com" />

        <label className="label">Password</label>
        <input type="password" className="input" placeholder="••••••••••" />

        <button className="btn btn-neutral mt-4">Register</button>
      </fieldset>
      <div className="text-[15px]">Already have an account? Login here. </div>
    </div>
  );
}
