"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { usePathname } from "next/navigation";

const DashboardNav = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  const handleUser = async () => {
    try {
      const response = await axios.get("/api/user", {
        withCredentials: true,
      });
      setUser(response.data.user);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleUser();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post("/api/logout", {}, { withCredentials: true });
      window.location.href = "/login";
    } catch (err) {
      console.log(err);
    }
  };

  const menuItem = (href, label) => {
    const isActive = pathname === href;

    return (
      <Link href={href}>
        <li
          className={`px-3 py-2 rounded-lg cursor-pointer transition ${isActive
              ? "bg-green-500/20 text-green-400"
              : "hover:bg-green-500/10 hover:text-green-400"
            }`}
        >
          {label}
        </li>
      </Link>
    );
  };

  return (
    <div className="flex">
      <Navbar />

      {/* SIDEBAR */}
      <div
        className="flex flex-col items-center 
        bg-linear-to-b from-green-900/60 to-black 
        border-r border-green-500/20
        h-screen w-64 p-5 justify-between 
        text-white shadow-2xl"
      >
        {/* USER */}
        <div className="mt-2 text-center w-full">
          <div className="bg-white/5 border border-green-500/20 p-3 rounded-xl">
            <p className="text-green-400 text-sm">Logged in as</p>

            <p className="font-semibold text-lg">
              {loading
                ? "Loading..."
                : user
                  ? `${user.firstName} ${user.lastName}`
                  : "No User"}
            </p>
          </div>
        </div>

        {/* MENU */}
        <div className="flex flex-col gap-2 w-full px-2">
          <ul className="flex flex-col gap-2 font-medium">
            {menuItem("/customer", "Home")}
            {menuItem("/customer/cart", "Cart")}

            <li className="px-3 py-2 rounded-lg hover:bg-green-500/10 hover:text-green-400 transition">
              Orders
            </li>

            {menuItem("/customer/myReview", "My Reviews")}

            <li className="px-3 py-2 rounded-lg hover:bg-green-500/10 hover:text-green-400 transition">
              History
            </li>
            {menuItem("/customer/setting", "Setting")}
          </ul>
        </div>

        {/* LOGOUT */}
        <div className="w-full text-center">
          <hr className="my-3 border-green-500/20" />

          <button
            onClick={handleLogout}
            className="bg-red-500/20 border border-red-500/30 
            text-red-400 px-4 py-2 rounded-xl 
            hover:bg-red-500/30 transition w-full"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardNav;