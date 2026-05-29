"use client";

import axios from "axios";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    FiGrid,
    FiPackage,
    FiUsers,
    FiShoppingCart,
    FiAlertCircle,
    FiSettings,
    FiClock,
} from "react-icons/fi";

const SlideBarForAdmin = () => {
    const pathname = usePathname();
    const handleLogout = async () => {
        try {
            await axios.post("/api/logout", {}, { withCredentials: true });
            window.location.href = "/login"
        } catch (err) {
            console.log(err)
        }
    }
    const menuItem = (href, label) => {
        const isActive = pathname === href;

        return (
            <Link href={href}>
                <li className={`px-3 py-2 rounded-lg cursor-pointer transition ${isActive ? "bg-green-500/20 text-green-400" : "hover:bg-green-500/10 hover:text-green-400"}`}>
                    {label}</li>
            </Link>
        )
    }
    return (
        <div className="flex flex-col items-center bg-linear-to-b from-green-900/60 to-black border-r border-green-500/20 h-screen w-64 p-5 justify-between text-white shadow-2xl">

            {/* Logo */}
            <div className="mb-10">
                <h1 className="text-3xl font-bold ">
                    <span className="text-green-400">Mero</span>Kheti
                </h1>

                <p className="text-gray-400 text-sm mt-1 text-center">
                    Admin Panel
                </p>
            </div>

            {/* Navigation */}
            <div className="flex flex-col gap-2 w-full px-2">
                <ul className="flex flex-col gap-2 font-medium">
                    {menuItem("/admin", "Dashboard")}
                    {menuItem("/admin/product", "product")}
                    {menuItem("/admin/approvals", "Pending Approvals")}
                    {menuItem("/admin/orders", "Orders")}
                    {menuItem("/admin/users", "Users")}
                    {menuItem("/admin/report", "Reports")}
                    {menuItem("/admin/setting", "Setting")}
                </ul>
            </div>
            <div className="w-full text-center">
                <button className="p-2 bg-red-500/20 border-red-500/30 text-red-400 px-4 py-2   w-full transition rounded-lg"
                    onClick={handleLogout}>
                    Logout
                </button>
            </div>
        </div>
    );
};

export default SlideBarForAdmin;
