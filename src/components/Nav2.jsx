import React, { useEffect, useState, } from "react";
import { usePathname } from 'next/navigation'
import Link from "next/link";
import axios from "axios";
import { House, ToolCase, LogOut, LayoutDashboard } from 'lucide-react';
const Nav2 = ({ handleLogout }) => {
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  useEffect(() => {
    const data = async () => {
      const response = await axios.get("/api/user")
      setUser(response.data.user)
    }
    data();
  }, [])
  const menuItem = (href, label) => {
    const isActive = pathname === href;

    return (
      <Link
        href={href}
        className={`p-3 rounded-xl transition-all duration-300 ${isActive
          ? "bg-green-600 text-white"
          : "text-gray-400 hover:text-white"
          }`}
      >
        {label}
      </Link>
    );
  };
  return (
    <div className="fixed bottom-0 left-0 w-full bg-black shadow-lg z-50 rounded-2xl border-t-2 border-white p-2 h-20">
      <ul className="flex justify-around items-center h-16 p-2 mt-5 border-t-2 border-white">
        {menuItem("/", <House size={24} />)}
        {menuItem("/product", <ToolCase size={24} />)}
        {user?.role === "customer" && menuItem("/customer", <LayoutDashboard size={24} />)}
        {user?.role === "farmer" && menuItem("/farmer", <LayoutDashboard size={24} />)}

        <li>
          <button onClick={handleLogout}>
            <LogOut size={24} />
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Nav2;