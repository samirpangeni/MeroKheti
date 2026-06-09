"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import SlideBarForFarmer from "@/components/SlideBarForFarmer";

const Page = () => {
  const [farmers, setFarmers] = useState([]);

  useEffect(() => {
    fetchRanking();
  }, []);

  const fetchRanking = async () => {
    try {
      const res = await axios.get("/api/ranking");
      setFarmers(res.data.ranking || []);
    } catch (err) {
      console.log(err);
      setFarmers([]);
    }
  };

  return (
    <div className="flex min-h-screen bg-black text-white">
      <SlideBarForFarmer />

      <div className="flex-1 p-8 p-2 md:pl-70">
        <h1 className="text-4xl font-bold text-green-500 mb-2">
          Farmer Leaderboard
        </h1>

        <p className="text-gray-400 mb-8">Top performing farmers</p>

        <div className="bg-zinc-900 rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-zinc-800">
              <tr>
                <th className="p-4 text-left">Rank</th>
                <th className="p-4 text-left">Farmer</th>
                <th className="p-4 text-left">Rating</th>
                <th className="p-4 text-left">Products</th>
                <th className="p-4 text-left">Sold</th>
              </tr>
            </thead>

            <tbody>
              {Array.isArray(farmers) &&
                farmers.map((farmer, index) => (
                  <tr
                    key={farmer.farmerId || index}
                    className="border-t border-zinc-800"
                  >
                    <td className="p-4">#{index + 1}</td>
                    <td className="p-4 font-semibold">{farmer.name}</td>
                    <td className="p-4 text-yellow-400">
                      ⭐ {farmer.averageRating}
                    </td>
                    <td className="p-4">{farmer.totalProducts}</td>
                    <td className="p-4 text-green-400">{farmer.totalSold}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default Page;