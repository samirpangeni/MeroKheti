import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  FiHome,
  FiShoppingBag,
  FiGrid,
  FiLogOut,
} from "react-icons/fi";
import axios from "axios";

const Nav2 = ({ handleLogout, setOpen }) => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const data = async () => {
      const response = await axios.get("/api/user")
      setUser(response.data)

    }
    data();
  },[])
  return (
    <div className="fixed top-0 left-0 h-screen w-50 bg-transparent backdrop-blur-4xl border-r border-white/10 shadow-2xl text-white p-6 flex flex-col justify-between">

      {/* TOP */}
      <div>

        {/* LOGO */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold bg-linear-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
            MeroKheti
          </h1>

          <p className="text-sm text-gray-400 mt-1">
            Fresh from farm to home
          </p>
        </div>

        {/* NAVIGATION */}
        <ul className="flex flex-col gap-3">

          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="w-40 flex items-center gap-4 px-4 py-3 rounded-2xl hover:bg-white/10 transition-all duration-300 group"
          >
            <FiHome className="text-xl text-green-400 group-hover:scale-110 transition" />

            <span className="font-medium">
              Home
            </span>
          </Link>

          <Link
            href="/product"
            onClick={() => setOpen(false)}
            className=" w-40 flex items-center gap-4 px-4 py-3 rounded-2xl hover:bg-white/10 transition-all duration-300 group"
          >
            <FiShoppingBag className="text-xl text-green-400 group-hover:scale-110 transition" />

            <span className="font-medium">
              Products
            </span>
          </Link>
          {user?.role == "customer" && (
            <Link
              href="/customer"
              onClick={() => setOpen(false)}
              className="w-40 flex items-center gap-4 px-4 py-3 rounded-2xl hover:bg-white/10 transition-all duration-300 group"
            >
              <FiGrid className="text-xl text-green-400 group-hover:scale-110 transition" />

              <span className="font-medium">
                Dashboard
              </span>
            </Link>
          )}
          {user?.role == "farmer" && (
            <Link
              href="/farmer"
              onClick={() => setOpen(false)}
              className="w-40 flex items-center gap-4 px-4 py-3 rounded-2xl hover:bg-white/10 transition-all duration-300 group"
            >
              <FiGrid className="text-xl text-green-400 group-hover:scale-110 transition" />

              <span className="font-medium">
                Dashboard
              </span>
            </Link>
          )}
        </ul>
      </div>

      {/* BOTTOM */}
      <div className="border-t border-white/10 pt-5">

        <button
          onClick={handleLogout}
          className="w-40 flex items-center justify-center gap-3 bg-red-500  hover:bg-red-600 transition-all duration-300 px-4 py-3 rounded-2xl font-medium shadow-lg"
        >
          <FiLogOut className="text-lg" />

          Logout
        </button>

      </div>
    </div>
  );
};

export default Nav2;