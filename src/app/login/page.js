"use client";

import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("/api/login", { email, password });
      alert("Login successful");
      router.push("/");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-950 via-black to-gray-900 text-white flex items-center justify-center px-6 relative overflow-hidden">

      {/* BACKGROUND BLURS */}
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-green-500/20 blur-3xl rounded-full"></div>
      <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-emerald-500/20 blur-3xl rounded-full"></div>

      {/* LOGIN CARD */}
      <div className="w-full max-w-md bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-8 shadow-xl">

        {/* BRANDING */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold tracking-wide">
            <span className="text-green-400">Mero</span>Kheti
          </h1>

          <p className="text-gray-400 text-sm mt-2">
            Fresh farm products marketplace 🌿
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* EMAIL */}
          <div>
            <label className="text-xs text-gray-400">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full mt-1 p-3 rounded-xl bg-black/30 border border-white/10 focus:outline-none focus:border-green-500/50"
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="text-xs text-gray-400">Password</label>

            <div className="relative mt-1">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-3 rounded-xl bg-black/30 border border-white/10 pr-10 focus:outline-none focus:border-green-500/50"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* BUTTON */}
          <button className="w-full py-3 rounded-xl bg-green-500 text-black font-semibold hover:bg-green-400 transition">
            Login
          </button>

          {/* DIVIDER */}
          <div className="flex items-center gap-3 my-5 text-xs text-gray-500">
            <hr className="flex-1 border-white/10" />
            OR
            <hr className="flex-1 border-white/10" />
          </div>

          {/* SOCIAL */}
          <div className="grid grid-cols-2 gap-3">
            <button className="p-3 rounded-xl border border-white/10 hover:bg-white/5">
              Google
            </button>
            <button className="p-3 rounded-xl border border-white/10 hover:bg-white/5">
              Facebook
            </button>
          </div>

          {/* SIGNUP */}
          <p className="text-center text-sm text-gray-400 mt-4">
            Don’t have an account?{" "}
            <Link href="/signup" className="text-green-400 hover:underline">
              Sign up
            </Link>
          </p>

        </form>
      </div>
    </div>
  );
}