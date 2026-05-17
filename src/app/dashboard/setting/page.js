"use client";

import React, { useEffect, useState } from "react";
import { User, Mail, Lock, ShieldCheck, Camera, Bell } from "lucide-react";
import DashboardNav from "@/components/DashboardNav";
import axios from "axios";
import PasswordUI from "@/components/PasswordUI";
import ConfirmPassword from "@/components/ConfirmPassword";

const Page = () => {
  const [data, setData] = useState(null);
  const [password, setPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [strength, setStrength] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/api/user");
        setData(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);
  useEffect(() => {
    if (data?.email) {
      setEmail(data?.email);
    }
  }, [data]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      setLoading(true);

      const res = await axios.put("/api/user", {
        currentPassword,
        password,
      });
      console.log(res.data);
      alert("update successfully");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-green-950 via-green-900 to-emerald-950 text-white flex">
      <div className="h-100">
        <DashboardNav />
      </div>
      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8 overflow-y-auto">
        {/* Top Section */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Profile Card */}
          <div className="bg-white/10 border border-green-800 backdrop-blur-2xl rounded-3xl p-6 w-full lg:w-[320px] shadow-2xl">
            <div className="flex flex-col items-center text-center">
              <div className="relative">
                <img
                  src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                  alt="profile"
                  className="w-28 h-28 rounded-full border-4 border-green-400 object-cover"
                />
              </div>

              <h1>
                {data?.firstName} {data?.lastName}
              </h1>

              <div className="mt-6 w-full flex flex-col gap-3">
                <div className="bg-black/20 p-3 rounded-xl flex items-center gap-3">
                  <User className="text-green-400" size={18} />
                  <span className="text-sm">Farmer Dashboard User</span>
                </div>
              </div>
            </div>
          </div>

          {/* Settings Form */}
          <div className="flex-1 bg-white/10 border border-green-800 backdrop-blur-2xl rounded-3xl p-6 shadow-2xl">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-green-300">
                Account Settings
              </h1>
              <p className="text-green-100/70 mt-2">
                Manage your profile information and security settings.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <label className="block mb-2 text-green-200">
                  Email Address
                </label>

                <div className="flex items-center bg-black/20 border border-green-700 rounded-2xl overflow-hidden">
                  <div className="px-4 text-green-400">
                    <Mail size={20} />
                  </div>

                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                    placeholder="Enter your email"
                    className="w-full bg-transparent outline-none p-4"
                  />
                </div>
              </div>

              {/* Current Password */}
              <div>
                <label className="block mb-2 text-green-200">
                  Current Password
                </label>

                <div className="flex items-center bg-black/20 border border-green-700 rounded-2xl overflow-hidden">
                  <div className="px-4 text-green-400">
                    <Lock size={20} />
                  </div>

                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Current password"
                    className="w-full bg-transparent outline-none p-4"
                  />
                </div>
              </div>

              {/* New Password */}
              <div>
                <PasswordUI
                  strength={strength}
                  password={password}
                  setShowPassword={setShowPassword}
                  setPassword={setPassword}
                  setStrength={setStrength}
                  showPassword={showPassword}
                />
              </div>

              {/* Confirm Password */}
              <div>
                <ConfirmPassword
                  confirmPassword={confirmPassword}
                  setShowConfirm={setShowConfirm}
                  setConfirmPassword={setConfirmPassword}
                  showConfirm={showConfirm}
                  password={password}
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-green-400 hover:bg-green-300 text-black font-semibold px-8 py-4 rounded-2xl transition-all duration-300 shadow-lg hover:scale-[1.02]"
                >
                  {loading ? "Updating..." : "Save Changes"}
                </button>

                <button
                  type="button"
                  className="border border-green-600 px-8 py-4 rounded-2xl hover:bg-green-900/40 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
