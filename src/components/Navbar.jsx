"use client";

import axios from "axios";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Nav1 from "./Nav1";
import Nav2 from "./Nav2";
import { FiMenu, FiX } from "react-icons/fi";

const Navbar = () => {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  async function handleLogout(e) {
    e.preventDefault();

    try {
      await axios.post(
        "/api/logout",
        {},
        { withCredentials: true }
      );

      router.push("/login");
      router.refresh();
    } catch (err) {
      console.log(err.response?.data?.message);
    }
  }

  return (
    <div>

      {/* MOBILE MENU BUTTON */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed top-1 left-3 z-100 bg-transparent backdrop-blur-lg p-3   text-white md:hidden"
      >
        {open ? <FiX size={22} /> : <FiMenu size={22} />}
      </button>

      {/* MOBILE NAV */}
      <div
        className={`fixed top-0 left-0 w-50 h-screen bg-transparent backdrop-blur-2xl overflow-hidden z-99 transition-all duration-300 ${open
            ? "opacity-100 visible"
            : "opacity-0 invisible"
          }`}
      >
        <div className="p-6">
          <Nav2
            handleLogout={handleLogout}
            setOpen={setOpen}
          />
        </div>
      </div>

      {/* DESKTOP NAV */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 w-[75%] z-50 hidden md:block">
        <Nav1 handleLogout={handleLogout} />
      </div>

    </div>
  );
};

export default Navbar;