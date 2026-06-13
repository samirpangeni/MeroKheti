import React from "react";
import { FiPackage, FiTag } from "react-icons/fi";

const BasicInfo = ({ name, setName, category, setCategory }) => {
  const categories = [
    "Vegetables",
    "Fruits",
    "Grains & Cereals",
    "Pulses & Legumes",
    "Seeds & Nuts",
    "Dairy & Eggs",
    "Meat & Poultry",
    "Herbs & Spices",
    "Organic Products",
    "Other",
  ];

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-3 border-b border-green-900/40 pb-4">
        <div className="w-10 h-10 rounded-xl bg-green-900/30 border border-green-700/30 flex items-center justify-center">
          <FiTag className="text-green-400 text-lg" />
        </div>

        <div>
          <h2 className="text-xl font-bold text-white">
            Basic Information
          </h2>
          <p className="text-sm text-gray-400">
            Enter the essential details of your product
          </p>
        </div>
      </div>

      {/* Product Name */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
          <FiPackage className="text-green-400" />
          Product Name
          <span className="text-red-400">*</span>
        </label>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Organic Tomatoes, Fresh Apples, Basmati Rice..."
          className=" w-full px-4 py-3 rounded-2xl bg-black/40 border border-green-900/40 text-white placeholder:text-gray-500 outline-none transition-all duration-300 focus:border-green-500 focus:ring-4 focus:ring-green-500/10 hover:border-green-700/50"/>

        <p className="text-xs text-gray-500">
          Be specific so customers can easily find your product.
        </p>
      </div>

      {/* Category */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
          <FiTag className="text-green-400" />
          Category
          <span className="text-red-400">*</span>
        </label>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className=" w-full px-4 py-3 rounded-2xl bg-black/40 border border-green-900/40 text-white outline-none transition-all duration-300 focus:border-green-500 focus:ring-4 focus:ring-green-500/10 hover:border-green-700/50 cursor-pointer">
          <option value="" className="bg-[#111] text-gray-400">
            Select a category
          </option>

          {categories.sort().map((item) => (
            <option
              key={item}
              value={item.toLowerCase()}
              className="bg-[#111] text-white"
            >
              {item}
            </option>
          ))}
        </select>

        <p className="text-xs text-gray-500">
          Select the category that best matches your product.
        </p>
      </div>
    </div>
  );
};

export default BasicInfo;