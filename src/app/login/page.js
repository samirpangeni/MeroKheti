"use client";

import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const handelSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/login", {
        email,
        password,
      });
      const newData = response.data;
      
      alert("login successful");
      setTimeout(() => {
        router.push("/");
      }, 1000);
    } catch (err) {
      console.log("Failed:", err.response?.data);
      alert(err.response?.data?.message || "login failed");
    }
  };
  return (
    <div
      style={{
        backgroundImage:
          "url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTA5NC9KFShrhiVRIwmN7d-0Nc7kttja27IwA&s')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      className="min-h-screen w-full flex items-center justify-center"
    >
      {/* overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-2xl"></div>

      {/* content */}
      <div className="relative z-10 flex flex-col items-center text-center w-full px-6">
       
        <h1 className="text-5xl font-mono font-bold text-white">Merokheti</h1>
        <p className="mt-4 text-gray-200 text-lg max-w-md">
          Now vegetables and fruits directly from the farm to your table
        </p>

    
        <form
          className="mt-8 p-6 rounded-2xl shadow-lg w-full max-w-sm border bg-white/10 backdrop-blur-2xl text-left"
          onSubmit={handelSubmit}
        >
          <div>
            <h1 className="text-2xl font-bold text-center mb-4 text-black">
              Login
            </h1>

            {/* Email */}
            <div className="flex flex-col mb-3">
              <label htmlFor="email" className="mb-1 text-sm font-medium">
                Email:
              </label>
              <input
                type="text"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                id="email"
                placeholder="Enter your email"
                className="p-2 border-b-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:rounded-lg focus:border-0"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col mb-3">
              <label htmlFor="password" className="mb-1 text-sm font-medium">
                Password:
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full p-2 border-b-2  pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:rounded-lg focus:border-0"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button className="w-full mt-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition focus:bg-blue-300">
              Login
            </button>

            {/* Divider */}
            <div className="flex items-center gap-2 my-4">
              <hr className="flex-1" />
              <span className="text-sm text-gray-400">or</span>
              <hr className="flex-1" />
            </div>

            {/* Social Buttons */}
            <div className="flex gap-2">
              <button className="flex-1 border py-2 rounded-lg hover:bg-gray-100">
                Google
              </button>
              <button className="flex-1 border py-2 rounded-lg hover:bg-gray-100">
                Facebook
              </button>
            </div>

            {/* Signup */}
            <p className="text-center text-sm mt-4">
              Don't have an account?{" "}
              <Link href="/signup">
                <span className="text-blue-600 hover:underline">Sign up</span>
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
