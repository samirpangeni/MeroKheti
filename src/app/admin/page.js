"use client";
import SlideBarForAdmin from "@/components/SlideBarForAdmin";
import axios from "axios";
import React, { useState, useEffect } from "react";
import UserGrowthChart from "@/components/UserGrowthChart";
import Activity from "@/components/Activity";
const Page = () => {
  const [user, setUser] = useState([]);
  const [product, setProduct] = useState([]);
  const [pPending, setPPending] = useState([]);
  const [pApproved, setPApproved] = useState([]);
  const [pReject, setPReject] = useState([]);
  const customerCount = user.filter((u) => u.role === "customer").length;

  const farmerCount = user.filter((u) => u.role === "farmer").length;
  useEffect(() => {
    const getData = async () => {
      const uRes = await axios.get("api/admin");
      const pRes = await axios.get("api/product");
      const pending = await axios.get("api/product?status=pending");
      const approved = await axios.get("api/product?status=approved");
      const reject = await axios.get("api/product?status=reject");
      setPPending(pending.data.product);
      setPReject(reject.data.product);
      setPApproved(approved.data.product);
      setUser(uRes.data.user);
      setProduct(pRes.data.product);
    };
    getData();
  }, []);

  return (
    <div className="flex gap-2">
      <SlideBarForAdmin />
      <div className="px-10 py-10 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-5 w-full">
          {/* TOTAL USERS */}

          <div className="bg-black border border-green-900 rounded-3xl p-5 shadow-2xl hover:scale-105 transition-all duration-300">
            <div className="flex flex-col gap-3">
              <h1 className="text-gray-400 text-sm uppercase tracking-wider">
                Total Users
              </h1>

              <h1 className="text-5xl font-bold text-green-400">
                {user.length}
              </h1>

              <div className="w-full h-1 bg-green-900 rounded-full overflow-hidden">
                <div className="w-[80%] h-full bg-green-500 rounded-full"></div>
              </div>
            </div>
          </div>

          {/* TOTAL PRODUCTS */}

          <div className="bg-black border border-green-900 rounded-3xl p-5 shadow-2xl hover:scale-105 transition-all duration-300">
            <div className="flex flex-col gap-3">
              <h1 className="text-gray-400 text-sm uppercase tracking-wider">
                Total Products
              </h1>

              <h1 className="text-5xl font-bold text-green-400">
                {product.length}
              </h1>

              <div className="w-full h-1 bg-green-900 rounded-full overflow-hidden">
                <div className="w-[70%] h-full bg-green-500 rounded-full"></div>
              </div>
            </div>
          </div>

          {/* PENDING PRODUCTS */}

          <div className="bg-black border border-yellow-900 rounded-3xl p-5 shadow-2xl hover:scale-105 transition-all duration-300">
            <div className="flex flex-col gap-3">
              <h1 className="text-gray-400 text-sm uppercase tracking-wider">
                Pending Products
              </h1>

              <h1 className="text-5xl font-bold text-yellow-400">
                {pPending.length}
              </h1>

              <div className="w-full h-1 bg-yellow-900 rounded-full overflow-hidden">
                <div className="w-[50%] h-full bg-yellow-500 rounded-full"></div>
              </div>
            </div>
          </div>

          {/* APPROVED PRODUCTS */}

          <div className="bg-black border border-green-900 rounded-3xl p-5 shadow-2xl hover:scale-105 transition-all duration-300">
            <div className="flex flex-col gap-3">
              <h1 className="text-gray-400 text-sm uppercase tracking-wider">
                Approved Products
              </h1>

              <h1 className="text-5xl font-bold text-green-400">
                {pApproved.length}
              </h1>

              <div className="w-full h-1 bg-green-900 rounded-full overflow-hidden">
                <div className="w-[90%] h-full bg-green-500 rounded-full"></div>
              </div>
            </div>
          </div>

          {/* REJECTED PRODUCTS */}

          <div className="bg-black border border-red-900 rounded-3xl p-5 shadow-2xl hover:scale-105 transition-all duration-300">
            <div className="flex flex-col gap-3">
              <h1 className="text-gray-400 text-sm uppercase tracking-wider">
                Rejected Products
              </h1>

              <h1 className="text-5xl font-bold text-red-400">
                {pReject.length}
              </h1>

              <div className="w-full h-1 bg-red-900 rounded-full overflow-hidden">
                <div className="w-[30%] h-full bg-red-500 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <UserGrowthChart
            customer={customerCount}
            farmer={farmerCount}
            approved={pApproved.length}
            pending={pPending.length}
            reject={pReject.length}
          />
        </div>
        <div>
          <Activity />
        </div>
      </div>
    </div>
  );
};
export default Page;
