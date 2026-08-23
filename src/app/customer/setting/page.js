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
    <div className="min-h-screen bg-background text-foreground">
      <DashboardNav />

      {/* MAIN CONTENT */}
      <main className="md:ml-64 px-4 sm:px-6 lg:px-10 pt-24 pb-10">

        {/* HEADER */}
        <div className="max-w-6xl mx-auto mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            Account Settings
          </h1>

          <p className="text-muted mt-2">
            Manage your profile and security preferences.
          </p>
        </div>

        {/* CONTENT */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className=" bg-card border border-border rounded-2xl p-6 shadow-sm">

            {/* PROFILE HEADER */}
            <div className="flex flex-col items-center text-center">
              <div className=" w-24 h-24 rounded-full p-1 bg-secondary border border-border">
                <img
                  src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                  alt="Profile"
                  className=" w-full h-full rounded-full object-cover"
                />
              </div>
              <h2 className="mt-4 text-xl font-semibold text-foreground">
                {data?.firstName} {data?.lastName}
              </h2>
              <p className="text-sm text-muted mt-1 break-all">
                {data?.email}
              </p>
            </div>

            {/* ACCOUNT INFO */}
            <div className="mt-6">
              <p className=" text-xs font-semibold uppercase tracking-wider text-muted mb-3">
                Account
              </p>
              <div className=" flex items-center gap-3 p-3 rounded-xl bg-secondary border border-border">
                <div className=" w-9 h-9 rounded-lg bg-card flex items-center justify-center border border-border">
                  <User
                    size={18}
                    className="text-primary"
                  />
                </div>
                <div>
                  <p className="text-xs text-muted">
                    Account Type
                  </p>
                  <p className="text-sm font-medium text-foreground">
                    {data?.role || "User"} Account
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm">
            <div className="mb-7">
              <h2 className="text-xl font-semibold text-foreground">
                Profile & Security
              </h2>
              <p className="text-sm text-muted mt-1">
                Update your email and password.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              {/* EMAIL */}
              <div>
                <label className=" block text-sm font-medium text-foreground mb-2">
                  Email Address
                </label>

                <div className="flex items-center bg-input border border-input-border rounded-xl focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 transition">
                  <Mail
                    size={18}
                    className="ml-3 text-muted shrink-0"
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent px-3 py-3 outline-none text-foreground placeholder:text-muted"
                    placeholder="Enter your email"
                  />

                </div>
              </div>

              {/* CURRENT PASSWORD */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Current Password
                </label>

                <div className="flex items-center bg-input border border-input-border rounded-xl focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 transition">
                  <Lock
                    size={18}
                    className="ml-3 text-muted shrink-0"
                  />
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) =>
                      setCurrentPassword(e.target.value)
                    }
                    className=" w-full bg-transparent px-3 py-3 outline-none text-foreground placeholder:text-muted"
                    placeholder="Enter current password"
                  />
                </div>
              </div>
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
              {/* DIVIDER */}
              <div className="border-t border-border pt-6">
                <div className="flex flex-col sm:flex-row gap-3">
                  {/* SAVE */}
                  <button
                    type="submit"
                    disabled={loading}
                    className=" px-6 py-3 rounded-xl bg-button text-button-foreground font-semibold transition hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed">
                    {loading
                      ? "Updating..."
                      : "Save Changes"}
                  </button>


                  {/* CANCEL */}
                  <button
                    type="button"
                    className=" px-6 py-3 rounded-xl border border-border bg-card text-muted font-medium transition hover:bg-muted-background hover:text-foreground">
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Page;