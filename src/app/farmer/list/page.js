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
    <div className="flex min-h-screen bg-background text-foreground">
      <SlideBarForFarmer />

      <div className="flex-1 p-8 md:pl-70">

        {/* HEADER */}
        <h1 className="mb-2 text-4xl font-bold text-primary">
          Farmer Leaderboard
        </h1>

        <p className="mb-8 text-muted">
          Top performing farmers
        </p>

        {/* TABLE */}
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px]">

              {/* HEADER */}
              <thead className="border-b border-border bg-muted-background">
                <tr>
                  <th className="p-4 text-left text-sm font-semibold text-foreground">
                    Rank
                  </th>

                  <th className="p-4 text-left text-sm font-semibold text-foreground">
                    Farmer
                  </th>

                  <th className="p-4 text-left text-sm font-semibold text-foreground">
                    Rating
                  </th>

                  <th className="p-4 text-left text-sm font-semibold text-foreground">
                    Products
                  </th>

                  <th className="p-4 text-left text-sm font-semibold text-foreground">
                    Sold
                  </th>
                </tr>
              </thead>

              {/* BODY */}
              <tbody>
                {Array.isArray(farmers) &&
                  farmers.map((farmer, index) => (
                    <tr
                      key={farmer.farmerId || index}
                      className="
                    border-b
                    border-border
                    transition
                    hover:bg-muted-background
                  "
                    >

                      {/* RANK */}
                      <td className="p-4 font-semibold text-primary">
                        #{index + 1}
                      </td>

                      {/* FARMER */}
                      <td className="p-4 font-semibold text-card-foreground">
                        {farmer.name}
                      </td>

                      {/* RATING */}
                      <td className="p-4 font-medium text-yellow-500 dark:text-yellow-400">
                        ⭐ {farmer.averageRating}
                      </td>

                      {/* PRODUCTS */}
                      <td className="p-4 text-muted">
                        {farmer.totalProducts}
                      </td>

                      {/* SOLD */}
                      <td className="p-4 font-semibold text-primary">
                        {farmer.totalSold}
                      </td>

                    </tr>
                  ))}
              </tbody>

            </table>
          </div>
        </div>

      </div>
    </div>
  );
};
export default Page;