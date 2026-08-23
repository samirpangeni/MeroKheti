"use client";

import axios from "axios";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
    FiGrid,
    FiPackage,
    FiUsers,
    FiShoppingCart,
    FiAlertCircle,
    FiSettings,
    FiCheckCircle,
    FiMenu,
    FiX,
    FiLogOut,
} from "react-icons/fi";

const SlideBarForAdmin = () => {
    const pathname = usePathname();
    const router = useRouter();
    const [open, setOpen] = useState(false);

    const menuItems = [
        {
            href: "/admin",
            label: "Dashboard",
            icon: FiGrid,
        },
        {
            href: "/admin/product",
            label: "Products",
            icon: FiPackage,
        },
        {
            href: "/admin/approvals",
            label: "Pending Approvals",
            icon: FiCheckCircle,
        },
        {
            href: "/admin/orders",
            label: "Orders",
            icon: FiShoppingCart,
        },
        {
            href: "/admin/users",
            label: "Users",
            icon: FiUsers,
        },
        {
            href: "/admin/report",
            label: "Reports",
            icon: FiAlertCircle,
        },
        {
            href: "/admin/setting",
            label: "Settings",
            icon: FiSettings,
        },
    ];

    const handleLogout = async () => {
        try {
            await axios.post(
                "/api/logout",
                {},
                { withCredentials: true }
            );

            router.push("/login");
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <>
            {/* MOBILE MENU BUTTON */}
            <button
                onClick={() => setOpen(!open)}
                className="fixed top-4 left-4 z-[60] md:hidden p-3 rounded-xl bg-primary text-background shadow-lg transition hover:opacity-90">
                {open ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>

            {/* OVERLAY */}
            {open && (
                <div
                    onClick={() => setOpen(false)}
                    className=" fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden" />
            )}

            {/* SIDEBAR */}
            <aside
                className={`fixed top-0 left-0 z-50 h-screen w-64 bg-linear-to-b from-background via-card to-secondary border-r border-border text-foreground shadow-2xl flex flex-col justify-between transition-transform duration-300
                    ${open
                        ? "translate-x-0"
                        : "-translate-x-full md:translate-x-0"
                    }`}>

                {/* TOP */}
                <div className="p-5">
                    {/* LOGO */}
                    <div className="px-2 pt-3 mb-8">
                        <h1 className="text-3xl font-bold tracking-tight">
                            <span className="text-primary">Mero</span>
                            Kheti
                        </h1>
                        <p className="text-xs text-muted mt-1">
                            Administration Panel
                        </p>
                    </div>


                    <div className="h-px bg-border mb-6" />
                    <nav>
                        <p className="px-3 mb-3 text-[11px] uppercase tracking-widest text-muted">
                            Management
                        </p>
                        <ul className="space-y-1.5">
                            {menuItems.map((item) => {
                                const Icon = item.icon;
                                const isActive =
                                    pathname === item.href ||
                                    (
                                        item.href !== "/admin" &&
                                        pathname.startsWith(item.href)
                                    );

                                return (
                                    <li key={item.href}>
                                        <Link
                                            href={item.href}
                                            onClick={() => setOpen(false)}
                                            className={` group relative flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
                                                ? ` bg-primary/10 text-primary`
                                                : ` text-muted hover:bg-card-foreground hover:text-primary`
                                                }`}>

                                            {/* ACTIVE INDICATOR */}
                                            {isActive && (
                                                <span
                                                    className=" absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-primary" />)}
                                            <Icon
                                                size={19}
                                                className={`transition-colors
                                                    ${isActive
                                                        ? "text-primary"
                                                        : "text-muted group-hover:text-primary"
                                                    }`} />
                                            <span>
                                                {item.label}
                                            </span>
                                        </Link>
                                    </li>
                                );
                            })}

                        </ul>
                    </nav>
                </div>
                {/* BOTTOM */}
                <div className="p-5">
                    <div className="h-px bg-border mb-4" />
                    {/* ADMIN INFO */}
                    <div className="px-3 mb-4">
                        <p className="text-xs text-muted">
                            Logged in as
                        </p>

                        <p className="text-sm font-medium text-foreground mt-1">
                            Administrator
                        </p>
                    </div>

                    {/* LOGOUT */}
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 font-medium text-sm transition-all duration-200 hover:bg-red-500/15 hover:border-red-500/30">
                        <FiLogOut size={18} />
                        Logout
                    </button>

                </div>
            </aside>
        </>
    );
};

export default SlideBarForAdmin;