"use client";
import React, { useEffect } from 'react'
import { FiSearch } from "react-icons/fi";
import axios from 'axios';

const Search = ({ search, setSearch, setProducts }) => {
    const handelSubmit = async (e) => {
        e.preventDefault();
        try {
            const query = search.trim();
            if (!query) {
                url = "/api/product";
            } else {
                url = `/api/product?search=${search}`;
            }
            const response = await axios.get(url);
            setProducts(response.data.product)

        } catch (err) {
            console.log("error:", err)
        }
    }

    return (
        <div>
            <form onSubmit={handelSubmit}>
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search tomatoes, rice, fruits..."
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-green-500 outline-none text-white"
                />
                <button type="submit"
                     className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 onFocus:bg-red-400">
                    <FiSearch />
                </button>
            </form>

        </div>
    )
}

export default Search
