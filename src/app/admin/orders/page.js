import React from "react";
import SlideBarForAdmin from "@/components/SlideBarForAdmin";

const Page = () => {
  return (
    <div className="flex min-h-screen bg-black text-white">
      <SlideBarForAdmin />

      <div className="flex-1 p-6 md:pl-70">
        {/* HEADER */}
        <h1 className="text-2xl font-bold mb-4">
          Order Management
        </h1>

        {/* STATS */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-900 p-4 rounded">
            Total Orders
          </div>
          <div className="bg-gray-900 p-4 rounded">
            Pending
          </div>
          <div className="bg-gray-900 p-4 rounded">
            Delivered
          </div>
          <div className="bg-gray-900 p-4 rounded">
            Revenue
          </div>
        </div>

        {/* FILTERS */}
        <div className="flex gap-4 mb-4">
          <input
            placeholder="Search order..."
            className="p-2 bg-gray-900 rounded"
          />
          <select className="p-2 bg-gray-900 rounded">
            <option>All</option>
            <option>Pending</option>
            <option>Shipped</option>
            <option>Delivered</option>
          </select>
        </div>

        {/* ORDER LIST */}
        <div className="bg-gray-900 p-4 rounded">
          <p>Order table will go here</p>
        </div>
      </div>
    </div>
  );
};

export default Page;