import React, { useEffect, useState } from 'react'
import Link from 'next/link';
import axios from 'axios';
import { usePathname } from 'next/navigation';
const Nav1 = ({ handleLogout }) => {
    const pathname = usePathname();
    const [user, setUser] = useState(null)
    useEffect(() => {
        const getData = async () => {
            const response = await axios.get('/api/user')
            setUser(response.data.user)

        }
        getData();
    }, [])
    const menuItem = (href, label) => {
        const isActive = pathname === href
        return (
            <Link href={href} className={`hover:text-blue-400 transition`}>{label}</Link>
        )
    }

    return (
        <div className="flex items-center justify-between bg-black/40 backdrop-blur-xl border border-white/10 rounded-full px-6 py-3 text-white">
            {/* LOGO */}
            <h1 className="text-xl font-bold tracking-wide">
                <span className="text-green-400">Mero</span>Kheti
            </h1>

            {/* NAV LINKS */}
            <ul className="flex gap-6 text-sm md:text-base">
                {menuItem("/", "Home")}
                {menuItem("/product", "Products")}
                {user?.role == "customer" && menuItem("/customer", "Dashboard")}
                {user?.role == "farmer" && menuItem("/farmer", "Dashboard")}
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
