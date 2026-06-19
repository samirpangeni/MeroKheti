"use client";

import React, { useEffect, useState } from "react";
import { User, Mail, Lock } from "lucide-react";
import DashboardNav from "@/components/DashboardNav";
import axios from "axios";
import PasswordUI from "@/components/PasswordUI";
import { toast } from "react-toastify";
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
        const res = await axios.get("/api/user", {
          withCredentials: true,
        });
        setData(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (data?.email) setEmail(data.email);
  }, [data]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      await axios.put(
        "/api/user",
        {
          currentPassword,
          password,
          email,
        },
        { withCredentials: true }
      );

      toast.success("Updated successfully");

      setPassword("");
      setConfirmPassword("");
      setCurrentPassword("");
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-black text-white">

      <DashboardNav />

      {/* MAIN */}
      <div className="flex-1 md:ml-72 p-6 md:p-10 pt-20 bg-linear-to-b from-black via-green-950/10 to-black md:mt-20">

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-green-400">
            Account Settings
          </h1>
          <p className="text-gray-400 mt-1">
            Manage your profile and security preferences
          </p>
        </div>

        {/* TOP SECTION */}
        <div className="grid lg:grid-cols-3 gap-6">

          {/* PROFILE CARD */}
          <div className="relative overflow-hidden bg-linear-to-br from-green-950/40 via-black to-green-950/20 border border-green-500/20 rounded-3xl p-6 shadow-lg">

            <div className="absolute inset-0 bg-green-500/5 blur-3xl opacity-60"></div>

            <div className="relative z-10 flex flex-col items-center text-center">

              <img
                src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                className="w-28 h-28 rounded-full border-4 border-green-400 object-cover"
              />

              <h2 className="mt-4 text-xl font-semibold text-green-300">
                {data?.firstName} {data?.lastName}
              </h2>

              <p className="text-gray-400 text-sm mt-1">
                {data?.email}
              </p>

              <div className="mt-5 w-full space-y-3">

                <div className="bg-black/40 border border-green-500/10 rounded-xl p-3 flex items-center gap-3">
                  <User size={18} className="text-green-400" />
                  <span className="text-sm text-gray-300">
                    {data?.role || "User"} Account
                  </span>
                </div>

              </div>

            </div>
          </div>

          {/* FORM */}
          <div className="lg:col-span-2 bg-linear-to-br from-green-950/40 via-black to-green-950/10 border border-green-500/20 rounded-3xl p-6">

            <form onSubmit={handleSubmit} className="space-y-6">

              {/* EMAIL */}
              <div>
                <label className="text-green-300 text-sm">Email</label>

                <div className="flex items-center mt-2 bg-black/40 border border-green-500/20 rounded-xl overflow-hidden">
                  <Mail className="ml-3 text-green-400" size={18} />
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent p-3 outline-none text-white"
                    placeholder="Email"
                  />
                </div>
              </div>

              {/* CURRENT PASSWORD */}
              <div>
                <label className="text-green-300 text-sm">
                  Current Password
                </label>

                <div className="flex items-center mt-2 bg-black/40 border border-green-500/20 rounded-xl overflow-hidden">
                  <Lock className="ml-3 text-green-400" size={18} />
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full bg-transparent p-3 outline-none"
                    placeholder="Current password"
                  />
                </div>
              </div>

              {/* PASSWORD COMPONENTS */}
              <PasswordUI
                strength={strength}
                password={password}
                setPassword={setPassword}
                setStrength={setStrength}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
              />

              <ConfirmPassword
                confirmPassword={confirmPassword}
                setConfirmPassword={setConfirmPassword}
                showConfirm={showConfirm}
                setShowConfirm={setShowConfirm}
                password={password}
              />

              {/* BUTTONS */}
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 rounded-xl bg-green-500 text-black font-semibold hover:bg-green-400 transition"
                >
                  {loading ? "Updating..." : "Save Changes"}
                </button>

                <button
                  type="button"
                  className="px-6 py-3 rounded-xl border border-green-500/30 text-green-300 hover:bg-green-500/10 transition"
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