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
          className={`px-3 py-2 rounded-lg cursor-pointer transition ${isActive ? "bg-green-500/20 text-green-400" : "hover:bg-green-500/10 hover:text-green-400"}`}
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
        className="md:hidden fixed top-4 left-10 z-50 bg-green-600 text-white p-2 rounded-lg "
      >
        ☰
      </button>
      <div className={`w-full flex flex-col fixed top-0 bottom-0 items-center  bg-green-900 border-r border-green-500/20 h-screen  p-5  justify-between text-white shadow-2xl mb:z-99  mb-10 ${ open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>
        <div className="mb-10 ">
          <h1 className="text-3xl font-bold">
            <span className="text-green-400">Mero</span>kheti
          </h1>
          <p className="text-gray-400 text-sm mt-1 text-center">
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
            className="p-2 bg-red-500/20 border-red-500/30 text-red-400  w-full transition rounded-lg"
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
