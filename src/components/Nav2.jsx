import React, { useEffect, useState, } from "react";
import{usePathname} from 'next/navigation'
import Link from "next/link";
import axios from "axios";

const Nav2 = ({ handleLogout, setOpen }) => {
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  useEffect(() => {
    const data = async () => {
      const response = await axios.get("/api/user")
      setUser(response.data.user)
    }
    data();
  }, [])

  const menuItem = (href, label)=>{
    const isActive = pathname == href;
    return(
    <Link href={href} className="w-40 flex items-center gap-4 px-4 py-3 rounded-2xl hover:bg-white/10 transition-all duration-300 group"> {label}</Link>
    )
  }
  return (
    <div className="fixed top-0 left-0 h-screen w-50 bg-transparent backdrop-blur-4xl border-r border-white/10 shadow-2xl text-white p-6 flex flex-col justify-between">

      {/* TOP */}
      <div>

        {/* LOGO */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold bg-linear-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
            <span className="text-green-400">Mero</span>Kheti
          </h1>

          <p className="text-sm text-gray-400 mt-1">
            Fresh from farm to home
          </p>
        </div>

        {/* NAVIGATION */}
        <ul className="flex flex-col gap-3">
          {menuItem("/", "Home")}
          {menuItem("/product", "Product")}
          {user?.role == "customer" && menuItem("/customer", "Dashnoard")}
          {user?.role == "farmer" && menuItem("/farmer", "Dashnoard")}
        </ul>
      </div>

      {/* BOTTOM */}
      <div className="border-t border-white/10 pt-5">
        <button
          onClick={handleLogout}
          className="w-40 flex items-center justify-center gap-3 bg-red-500  hover:bg-red-600 transition-all duration-300 px-4 py-3 rounded-2xl font-medium shadow-lg"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Nav2;