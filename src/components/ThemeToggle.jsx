"use client"
import React, { useState, useEffect } from "react"
import { Sun, Moon } from 'lucide-react';
import { usePathname } from "next/navigation";


const ThemeToggle = () => {
    const [dark, setDark] = useState(false)
    const pathname = usePathname();

    // Pages where theme toggle should NOT appear
    const hiddenPages = [
        "/login",
        "/signup",
        "/register",
        "/404",
    ];

    const shouldHide = hiddenPages.includes(pathname);

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");

        if (savedTheme === "dark") {
            document.documentElement.classList.add("dark");
            setDark(true);
        } else {
            document.documentElement.classList.remove("dark");
            setDark(false);
        }
    }, []);
    const toggleTheme = () => {
        const html = document.documentElement;
        if (html.classList.contains("dark")) {
            html.classList.remove("dark");
            localStorage.setItem("theme", "light");
            setDark(false);
        } else {
            html.classList.add("dark");
            localStorage.setItem("theme", "dark");
            setDark(true);
        }
    };
    if (shouldHide) {
        return null;
    }
    return (
        <div className="fixed top-5 right-6 z-50">
            <button
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className=" relative w-16 h-9 rounded-full border border-border bg-card shadow-lg transition-all duration-300 hover:shadow-primary/20">

                <span
                    className={`absolute top-1 w-7 h-7 rounded-full flex items-center justify-center bg-primary text-primary-foreground shadow-md transition-all duration-300
                        ${dark ? "translate-x-7" : "translate-x-1"}`}>
                    {dark ? (
                        <Moon size={15} />
                    ) : (
                        <Sun size={15} />
                    )}
                </span>
                <Sun
                    size={14}
                    className="absolute left-2.5 top-2.5 text-yellow-500/50"
                />
                <Moon
                    size={14}
                    className="absolute right-2.5 top-2.5 text-blue-400/50"
                />
            </button>
        </div>
    )
}
export default ThemeToggle