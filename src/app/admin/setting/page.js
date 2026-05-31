"use client";

import React, { useEffect, useState } from "react";
import SlideBarForAdmin from "@/components/SlideBarForAdmin";
import axios from "axios";

const Page = () => {
  const [user, setUser] = useState({});

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [loading, setLoading] = useState(false);

  // GET ADMIN DATA
  useEffect(() => {
    const getData = async () => {
      try {
        const res = await axios.get("/api/user");

        setUser(res.data.user);
      } catch (err) {
        console.log(err);
      }
    };

    getData();
  }, []);

  // UPDATE SETTINGS
  const handelData = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await axios.put(
        "/api/admin/setting",
        {
          firstName,
          lastName,
          email,
          mobile,
          oldPassword,
          newPassword,
        },
        {
          withCredentials: true,
        },
      );

      alert("Settings Updated Successfully");

      setFirstName("");
      setLastName("");
      setEmail("");
      setMobile("");
      setOldPassword("");
      setNewPassword("");

      setLoading(false);
    } catch (err) {
      console.log(err);

      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* SIDEBAR */}
      <SlideBarForAdmin />

      {/* MAIN */}
      <div className="flex-1 p-8 pl-70 bg-gradient-to-br from-black via-[#07130b] to-[#0d1f14] overflow-y-auto">
        {/* TOP HEADER */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-4xl font-bold text-green-400">
              Admin Settings
            </h1>

            <p className="text-gray-400 mt-2">
              Manage profile, security and marketplace settings
            </p>
          </div>

          {/* PROFILE ICON */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-green-600 flex items-center justify-center text-2xl font-bold shadow-lg">
              {user?.firstName?.charAt(0)}
            </div>

            <div>
              <h1 className="font-bold text-lg">
                {user?.firstName} {user?.lastName}
              </h1>

              <p className="text-gray-400 text-sm">Administrator</p>
            </div>
          </div>
        </div>

        {/* FORM */}
        <form
          onSubmit={handelData}
          className="grid grid-cols-1 xl:grid-cols-3 gap-8"
        >
          {/* LEFT SIDE */}
          <div className="xl:col-span-2 flex flex-col gap-8">
            {/* PROFILE CARD */}
            <div className="bg-[#101010]/80 backdrop-blur-lg border border-green-900 rounded-3xl p-8 shadow-2xl">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-green-500/20 flex items-center justify-center text-green-400 text-2xl">
                  👤
                </div>

                <div>
                  <h1 className="text-2xl font-bold text-green-400">
                    Profile Information
                  </h1>

                  <p className="text-gray-400 text-sm">
                    Update your admin details
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* CURRENT NAME */}
                <div>
                  <label className="text-sm text-gray-400">Current Name</label>

                  <input
                    type="text"
                    value={`${user?.firstName || ""} ${user?.lastName || ""}`}
                    readOnly
                    className="mt-2 w-full bg-black/50 border border-gray-700 rounded-2xl p-4 outline-none"
                  />
                </div>

                {/* CHANGE NAME */}
                <div>
                  <label className="text-sm text-gray-400">Change Name</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Enter new name"
                      className="mt-2 w-1/2 bg-black/50 border border-gray-700 focus:border-green-500 rounded-2xl p-4 outline-none transition"
                    />
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Enter new name"
                      className="mt-2 w-1/2 bg-black/50 border border-gray-700 focus:border-green-500 rounded-2xl p-4 outline-none transition"
                    />
                  </div>
                </div>

                {/* CURRENT EMAIL */}
                <div>
                  <label className="text-sm text-gray-400">Current Email</label>

                  <input
                    type="email"
                    value={user?.email || ""}
                    readOnly
                    className="mt-2 w-full bg-black/50 border border-gray-700 rounded-2xl p-4 outline-none"
                  />
                </div>

                {/* CHANGE EMAIL */}
                <div>
                  <label className="text-sm text-gray-400">Change Email</label>

                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter new email"
                    className="mt-2 w-full bg-black/50 border border-gray-700 focus:border-green-500 rounded-2xl p-4 outline-none transition"
                  />
                </div>

                {/* CURRENT MOBILE */}
                <div>
                  <label className="text-sm text-gray-400">
                    Current Mobile
                  </label>

                  <input
                    type="text"
                    value={user?.mobile || ""}
                    readOnly
                    className="mt-2 w-full bg-black/50 border border-gray-700 rounded-2xl p-4 outline-none"
                  />
                </div>

                {/* CHANGE MOBILE */}
                <div>
                  <label className="text-sm text-gray-400">Change Mobile</label>

                  <input
                    type="text"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="Enter new mobile"
                    className="mt-2 w-full bg-black/50 border border-gray-700 focus:border-green-500 rounded-2xl p-4 outline-none transition"
                  />
                </div>
              </div>
            </div>

            {/* SECURITY CARD */}
            <div className="bg-[#101010]/80 backdrop-blur-lg border border-yellow-900 rounded-3xl p-8 shadow-2xl">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-yellow-500/20 flex items-center justify-center text-yellow-400 text-2xl">
                  🔒
                </div>

                <div>
                  <h1 className="text-2xl font-bold text-yellow-400">
                    Security Settings
                  </h1>

                  <p className="text-gray-400 text-sm">
                    Change your account password
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="text-sm text-gray-400">
                    Current Password
                  </label>

                  <input
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="Enter old password"
                    className="mt-2 w-full bg-black/50 border border-gray-700 focus:border-yellow-500 rounded-2xl p-4 outline-none transition"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-400">New Password</label>

                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="mt-2 w-full bg-black/50 border border-gray-700 focus:border-yellow-500 rounded-2xl p-4 outline-none transition"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex flex-col gap-8">
            {/* QUICK STATS */}
            <div className="bg-[#101010]/80 backdrop-blur-lg border border-green-900 rounded-3xl p-8 shadow-2xl">
              <h1 className="text-2xl font-bold text-green-400 mb-6">
                Account Overview
              </h1>

              <div className="flex flex-col gap-5">
                <div className="bg-black/40 rounded-2xl p-5 border border-gray-800">
                  <p className="text-gray-400 text-sm">Role</p>

                  <h1 className="text-xl font-bold text-green-400 mt-1">
                    {user?.role}
                  </h1>
                </div>

                <div className="bg-black/40 rounded-2xl p-5 border border-gray-800">
                  <p className="text-gray-400 text-sm">Account Status</p>

                  <h1 className="text-xl font-bold text-green-400 mt-1">
                    Active
                  </h1>
                </div>

                <div className="bg-black/40 rounded-2xl p-5 border border-gray-800">
                  <p className="text-gray-400 text-sm">Email Verified</p>

                  <h1 className="text-xl font-bold text-green-400 mt-1">Yes</h1>
                </div>
              </div>
            </div>

            {/* DANGER ZONE */}
            <div className="bg-[#101010]/80 backdrop-blur-lg border border-red-900 rounded-3xl p-8 shadow-2xl">
              <h1 className="text-2xl font-bold text-red-500 mb-6">
                Danger Zone
              </h1>

              <div className="flex flex-col gap-4">
                <button
                  type="button"
                  className="bg-red-600 hover:bg-red-700 transition py-4 rounded-2xl font-bold"
                >
                  Delete All Reports
                </button>

                <button
                  type="button"
                  className="bg-red-900 hover:bg-red-950 transition py-4 rounded-2xl font-bold"
                >
                  Delete Marketplace Data
                </button>
              </div>
            </div>

            {/* SAVE BUTTON */}
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 transition py-4 rounded-2xl text-lg font-bold shadow-xl"
            >
              {loading ? "Saving..." : "Save All Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Page;
