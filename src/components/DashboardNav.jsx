"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Loading from "./Loading";

const DashboardNav = () => {
  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(true);

  const menuItems = [
    { href: "/customer", label: "Dashboard" },
    { href: "/customer/cart", label: "Cart" },
    { href: "/customer/order", label: "Orders" },
    { href: "/customer/history", label: "History" },
    { href: "/customer/myReview", label: "Reviews" },
    { href: "/customer/setting", label: "Settings" },
  ];

  useEffect(() => {
      const fetchUser = async () => {
      try {
        setLoading(true)
        const res = await axios.get("/api/user", {
          withCredentials: true,
        });
        setUser(res.data.user);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);
  if(loading){
    return <Loading/>
  }

  const handleLogout = async () => {
    try {
      await axios.post("/api/logout", {}, { withCredentials: true });
      router.push("/login");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex fixed top-0 w-70 z-99">
      <Navbar />

      {/* Toggle Button */}
      <button
        onClick={() => setShow(!show)}
        className="fixed top-4 left-4 z-50 md:hidden
        bg-linear-to-r from-green-500 to-emerald-700
        text-white p-3 rounded-xl shadow-lg hover:scale-105 transition"
      >
        ☰
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed md:static top-0 left-0 h-screen w-64 z-40
        bg-linear-to-b from-black via-green-950/40 to-black
        border-r border-green-500/20
        text-white flex flex-col justify-between
        backdrop-blur-xl 
        shadow-[0_0_40px_rgba(0,255,100,0.08)]
        transition-transform duration-300
        ${show ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        {/* Top Section */}
        <div className="p-6">
          {/* Profile Card */}
          <div className="mb-8 p-4 rounded-2xl bg-green-500/10 border border-green-500/20 backdrop-blur-md shadow-inner mt-12">
            <>
              <h1 className="text-lg font-semibold text-green-300">
                {user?.firstName} {user?.lastName}
              </h1>
              <p className="text-xs text-gray-400 mt-1">
                {user?.role} Dashboard
              </p>
            </>
          </div>

          {/* Menu */}
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300
                      ${isActive
                        ? "bg-green-500/20 text-green-300 shadow-[0_0_20px_rgba(34,197,94,0.2)]"
                        : "text-gray-300 hover:bg-green-500/10 hover:text-green-300"
                      }`}
                  >
                    <span
                      className={`h-2 w-2 rounded-full transition-all
                      ${isActive
                          ? "bg-green-400 shadow-[0_0_10px_rgba(34,197,94,0.8)]"
                          : "bg-gray-600 group-hover:bg-green-400"
                        }`}
                    />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Logout */}
        <div className="p-6">
          <button
            onClick={handleLogout}
            className="w-full py-3 rounded-xl
            bg-linear-to-r from-red-600 to-red-800
            hover:from-red-500 hover:to-red-700
            shadow-lg hover:shadow-red-500/20
            transition-all duration-300 mb-10
            font-medium"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {show && (
        <div
          onClick={() => setShow(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm md:hidden"
        />
      )}
    </div>
  );
};

export default DashboardNav;