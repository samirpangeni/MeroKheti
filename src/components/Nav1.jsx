import React from 'react'
import Link from 'next/link';
const Nav1 = ({handleLogout}) => {
    return (
        <div className="flex items-center justify-between bg-black/40 backdrop-blur-xl border border-white/10 rounded-full px-6 py-3 text-white">

            {/* LOGO */}
            <h1 className="text-xl font-bold tracking-wide">
                Merokheti 🌱
            </h1>

            {/* NAV LINKS */}
            <ul className="flex gap-6 text-sm md:text-base">
                <li>
                    <Link href="/" className="hover:text-blue-400 transition">
                        Home
                    </Link>
                </li>

                <li>
                    <Link href="/product" className="hover:text-blue-400 transition">
                        Products
                    </Link>
                </li>
                <li>
                    <Link href="/dashboard" className="hover:text-blue-400 transition">
                        Dashboard
                    </Link>
                </li>

                <li>
                    <button
                        onClick={handleLogout}
                        className="hover:text-red-400 transition"
                    >
                        Logout
                    </button>
                </li>
            </ul>
        </div>
    )
}

export default Nav1
