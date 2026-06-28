"use client";

import axios from "axios";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Nav1 from "./Nav1";
import Nav2 from "./Nav2";
import { FiMenu, FiX } from "react-icons/fi";

const Navbar = () => {
  const router = useRouter();

  async function handleLogout(e) {
    e.preventDefault();

    try {
      await axios.post(
        "/api/logout",
        {},
        { withCredentials: true }
      );

      window.location.href = "/login"
    } catch (err) {
      console.log(err.response?.data?.message);
    }
  }


  return (
    <div>
      <div
        className={`fixed bottom-0 left-0 w-full overflow-hidden z-99 transition-all duration-300 `}
      >
        <div className="pb-20 rounded-2xl block md:hidden w-full">
          <Nav2
            handleLogout={handleLogout}
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