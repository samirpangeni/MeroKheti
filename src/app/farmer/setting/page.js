"use client";

import SlideBarForFarmer from "@/components/SlideBarForFarmer";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";

const Page = () => {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await axios.get("/api/user");

        setUser({
          firstName: res.data.user.firstName || "",
          lastName: res.data.user.lastName || "",
          email: res.data.user.email || "",
          mobile: res.data.user.mobile || "",
        });
      } catch (err) {
        console.log(err);
      }
    };

    getData();
  }, []);

  const handleProfileChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const updateProfile = async () => {
    try {
      await axios.put("/api/user", user);

      toast.success("Profile updated successfully");
    } catch (err) {
      console.log(err);
      toast.error("Failed to update profile");
    }
  };

  const changePassword = async () => {
    try {
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        return toast.error("Passwords do not match");
      }

      await axios.put("/api/user/password", passwordData);

      toast.success("Password changed successfully");

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      console.log(err);
      toast.error("Failed to change password");
    }
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Toaster position="top-right" />

      <SlideBarForFarmer />

      <div className="flex-1 p-8 md:pl-70">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary">Farmer Settings</h1>

          <p className="text-muted mt-2">
            Manage your account settings and security
          </p>
        </div>

        <div className="space-y-8">
          {/* Profile Card */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <h2 className="text-2xl font-semibold text-primary mb-6">
              Profile Information
            </h2>

            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block mb-2 text-muted">First Name</label>

                <input
                  type="text"
                  name="firstName"
                  value={user.firstName}
                  onChange={handleProfileChange}
                  className="w-full bg-card border border-border rounded-xl px-4 py-3"
                />
              </div>

              <div>
                <label className="block mb-2 text-muted">Last Name</label>

                <input
                  type="text"
                  name="lastName"
                  value={user.lastName}
                  onChange={handleProfileChange}
                  className="w-full bg-card border border-border rounded-xl px-4 py-3"
                />
              </div>

              <div>
                <label className="block mb-2 text-gray-300">Email</label>

                <input
                  type="email"
                  name="email"
                  value={user.email}
                  onChange={handleProfileChange}
                  className="w-full bg-card border border-border rounded-xl px-4 py-3"
                />
              </div>

              <div>
                <label className="block mb-2 text-gray-300">
                  Mobile Number
                </label>

                <input
                  type="text"
                  name="mobile"
                  value={user.mobile}
                  onChange={handleProfileChange}
                  className="w-full bg-card border border-border rounded-xl px-4 py-3"
                />
              </div>
            </div>

            <button
              onClick={updateProfile}
              className="mt-6 bg-primary hover:bg-primary-hover px-6 py-3 rounded-xl font-semibold transition"
            >
              Save Changes
            </button>
          </div>

          {/* Password Card */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <h2 className="text-2xl font-semibold text-primary mb-6">
              Change Password
            </h2>

            <div className="grid gap-5">
              <div>
                <label className="block mb-2 text-muted">
                  Current Password
                </label>

                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className="w-full bg-card border border-border rounded-xl px-4 py-3"
                />
              </div>

              <div>
                <label className="block mb-2 text-muted">New Password</label>

                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className="w-full bg-card border border-border rounded-xl px-4 py-3"
                />
              </div>

              <div>
                <label className="block mb-2 text-muted">
                  Confirm New Password
                </label>

                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className="w-full bg-card border border-border rounded-xl px-4 py-3"
                />
              </div>
            </div>

            <button
              onClick={changePassword}
              className="mt-6 rounded-xl bg-button px-6 py-3 font-semibold text-button-foreground transition hover:bg-primary-hover">
              Update Password
            </button>

            {/* Account Info Card */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <h2 className="text-2xl font-semibold text-primary mb-6">
                Account Information
              </h2>

              <div className="space-y-3 text-muted">
                <p>
                  <strong>Role:</strong> Farmer
                </p>

                <p>
                  <strong>Status:</strong> Active
                </p>

                <p>
                  <strong>Email:</strong> {user.email}
                </p>
              </div>
            </div>

            {/* Danger Zone */}
            <div
              className="rounded-2xl border border-red-200 bg-red-50 p-6 dark:border-red-900/50 dark:bg-red-950/30">
              <h2 className="mb-4 text-2xl font-semibold text-red-600 dark:text-red-400">
                Danger Zone
              </h2>

              <p className="mb-4 text-muted">
                Deleting your account is permanent and cannot be undone.
              </p>

              <button
                className="rounded-xl bg-red-600 px-6 py-3 font-semibold text-white transition hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;