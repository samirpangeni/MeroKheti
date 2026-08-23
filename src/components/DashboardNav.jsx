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
    setShow(false);

    const fetchUser = async () => {
      try {
        setLoading(true);

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
  }, [pathname]);

  if (loading) {
    return <Loading />;
  }

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
      <Navbar />

      {/* MOBILE MENU BUTTON */}
      <button
        onClick={() => setShow(!show)}
        className="fixed top-4 left-4 z-50 md:hidden bg-primary text-primary-foreground p-3 rounded-xl shadow-lg hover:bg-primary-hover transition">
        ☰
      </button>

      {/* SIDEBAR */}
      <aside
        className={`fixed top-0 left-0 h-screen w-64 z-40 bg-background border-r border-border text-foreground flex flex-col justify-between shadow-xl backdrop-blur-xl transition-transform duration-300
          ${show
            ? "translate-x-0"
            : "-translate-x-full md:translate-x-0"
          }
        `}
      >

        {/* TOP SECTION */}
        <div className="p-6">

          {/* PROFILE */}
          <div
            className="mb-8 mt-12 p-4 rounded-2xl bg-card border border-border shadow-sm">
            <h1 className="text-lg font-semibold text-primary">
              {user?.firstName} {user?.lastName}
            </h1>

            <p className="text-xs text-muted mt-1">
              {user?.role} Dashboard
            </p>
          </div>


          {/* MENU */}
          <ul className="space-y-2">

            {menuItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <li key={item.href}>

                  <Link
                    href={item.href}
                    className={`group flex items-center gap-3 px-4 py-3 rounded-xltransition-all duration-300

                      ${isActive
                        ? `
                            bg-secondary
                            text-primary
                            border
                            border-border
                            shadow-sm
                            rounded-2xl
                            hover:rounded-2xl
                          `
                        : `
                            text-muted
                            hover:bg-muted-background
                            hover:text-primary
                            hover:rounded-2xl
                            rounded-2xl
                          `
                      }
                    `}
                  >

                    {/* ACTIVE DOT */}
                    <span
                      className={`h-2 w-2 rounded-full transition-all
                        ${isActive
                          ? "bg-primary"
                          : "bg-secondary group-hover:bg-primary"
                        }
                      `}
                    />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* LOGOUT */}
        <div className="p-6">
          <button
            onClick={handleLogout}
            className="w-full py-3 rounded-xl border-red-200 bg-red-50 p-2 text-red-600  hover:bg-red-100 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-950/50 font-medium transition-all duration-300 shadow-sm">
            Logout
          </button>

        </div>

      </aside>


      {/* MOBILE OVERLAY */}
      {show && (
        <div
          onClick={() => setShow(false)}
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm md:hidden
          "
        />
      )}
    </>
  );
};

export default DashboardNav;