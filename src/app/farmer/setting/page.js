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
    <div className="flex min-h-screen bg-black text-white">
      <Toaster position="top-right" />

      <SlideBarForFarmer />

      <div className="flex-1 p-8 md:pl-70 p-2">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-green-500">Farmer Settings</h1>

          <p className="text-gray-400 mt-2">
            Manage your account settings and security
          </p>
        </div>

        <div className="space-y-8">
          {/* Profile Card */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-2xl font-semibold text-green-500 mb-6">
              Profile Information
            </h2>

            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block mb-2 text-gray-300">First Name</label>

                <input
                  type="text"
                  name="firstName"
                  value={user.firstName}
                  onChange={handleProfileChange}
                  className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-3"
                />
              </div>

              <div>
                <label className="block mb-2 text-gray-300">Last Name</label>

                <input
                  type="text"
                  name="lastName"
                  value={user.lastName}
                  onChange={handleProfileChange}
                  className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-3"
                />
              </div>

              <div>
                <label className="block mb-2 text-gray-300">Email</label>

                <input
                  type="email"
                  name="email"
                  value={user.email}
                  onChange={handleProfileChange}
                  className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-3"
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
                  className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-3"
                />
              </div>
            </div>

            <button
              onClick={updateProfile}
              className="mt-6 bg-green-600 hover:bg-green-700 px-6 py-3 rounded-xl font-semibold transition"
            >
              Save Changes
            </button>
          </div>

          {/* Password Card */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-2xl font-semibold text-green-500 mb-6">
              Change Password
            </h2>

            <div className="grid gap-5">
              <div>
                <label className="block mb-2 text-gray-300">
                  Current Password
                </label>

                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-3"
                />
              </div>

              <div>
                <label className="block mb-2 text-gray-300">New Password</label>

                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-3"
                />
              </div>

              <div>
                <label className="block mb-2 text-gray-300">
                  Confirm New Password
                </label>

                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-3"
                />
              </div>
            </div>

            <button
              onClick={changePassword}
              className="mt-6 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl font-semibold transition"
            >
              Update Password
            </button>
          </div>

          {/* Account Info Card */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-2xl font-semibold text-green-500 mb-6">
              Account Information
            </h2>

            <div className="space-y-3 text-gray-300">
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
          <div className="bg-red-950 border border-red-800 rounded-2xl p-6">
            <h2 className="text-2xl font-semibold text-red-500 mb-4">
              Danger Zone
            </h2>

            <p className="text-gray-300 mb-4">
              Deleting your account is permanent and cannot be undone.
            </p>

            <button className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-xl font-semibold">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;