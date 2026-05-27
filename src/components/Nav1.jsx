import React, { useEffect, useState } from 'react'
import Link from 'next/link';
import axios from 'axios';
const Nav1 = ({ handleLogout }) => {
    const [user, setUser] = useState(null)
    useEffect(() => {
        const getData = async () => {
            const response = await axios.get('/api/user')
            setUser(response.data.user)
        
        }
        getData();
    }, [])


    return (
        <div className="flex items-center justify-between bg-black/40 backdrop-blur-xl border border-white/10 rounded-full px-6 py-3 text-white">

            {/* LOGO */}
            <h1 className="text-xl font-bold tracking-wide">
                <span className="text-green-400">Mero</span>Kheti
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
                    {user?.role == "customer" && (<Link href="/customer" className="hover:text-blue-400 transition">
                        Dashboard
                    </Link>)}

                </li>

                <li>
                    {user?.role == "farmer" && (<Link href="/farmer" className="hover:text-blue-400 transition">Dashboard</Link>)}
                </li>
                    {/* <li>
                        <Link href="/customer" className="hover:text-blue-400 transition">
                            Dashboard
                        </Link>
                    </li> */}
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
