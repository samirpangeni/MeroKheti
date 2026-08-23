"use client";
import axios from "axios";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";
import Navbar from '@/components/Navbar'

const SlideBarForFarmer = () => {
  const pathname = usePathname();
  const [user, setUser] = useState([]);
  const [open, setOpen] = useState(false);
  const handleLogout = async () => {
    try {
      await axios.post("/api/logout", {}, { withCredentials: true });
      window.location.href = "/login";
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    setOpen(false)
    const getData = async () => {
      try {
        const req = await axios.get("/api/user");
        setUser(req.data.user);
      } catch (err) {
        console.log(err);
      }
    };
    getData();
  }, [pathname]);
  const menuItem = (href, label) => {
    const isActive = pathname === href;
    return (
      <Link href={href}>
        <li
          className={`px-3 py-2 rounded-lg cursor-pointer transition ${isActive ? "bg-secondary text-primary" : "text-muted hover:bg-muted-background hover:text-primary"}`}
        >
          {label}
        </li>
      </Link>
    );
  };
  return (
    <div className="fixed top-0 left-0 z-9999">
      <Navbar />
      <button
        onClick={() => setOpen(!open)}
        className="md:hidden fixed top-4 left-10 z-50 bg-button text-button-foreground p-2 rounded-lg transition"
      >
        ☰
      </button>
      <div
        className={`fixed bottom-0 top-0 flex h-screen w-full flex-col items-center justify-between border-r border-border bg-card p-5 text-card-foreground shadow-xl transition-transform duration-300 md:w-60 md:translate-x-0
        ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="mb-10">
          <h1 className="text-3xl font-bold">
            <span className="text-primary">Mero</span>kheti
          </h1>
          <p className="text-muted text-sm mt-1 text-center">
            {user?.firstName} {user?.lastName}
          </p>
        </div>
        <div className="flex flex-col gap-2 w-full h-screen px-2">
          <ul className="flex flex-col gap-2 font-medium">
            {menuItem("/farmer", "Dashboard")}
            {menuItem("/farmer/product", "Product")}
            {menuItem("/farmer/manage", "Manage")}
            {menuItem("/farmer/order", "Order")}
            {menuItem("/farmer/list", "Rank")}
            {menuItem("/farmer/setting", "Setting")}
          </ul>
        </div>
        <div className="w-full text-center h-screen justify-end flex flex-col pb-10">
          <button
            className="w-full rounded-lg border border-red-200 bg-red-50 p-2 text-red-600 transition hover:bg-red-100 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-950/50"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};
export default SlideBarForFarmer;
