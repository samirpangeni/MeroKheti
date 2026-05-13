import React from 'react'
import {
  FiPackage,
  FiTag,
} from "react-icons/fi";
const BasicInfo = ({ name, setName, category, setCategory }) => {
    return (
        <div>
            <h2 className="text-lg font-semibold text-white border-b border-white/10 pb-2 flex items-center gap-2">
                <FiTag className="w-4 h-4" />
                Basic Information
            </h2>

            {/* Product Name */}
            <div className="group">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                    <FiPackage className="w-4 h-4" />
                    Product Name <span className="text-red-400">*</span>
                </label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-3 rounded-xl bg-white/10 border border-white/20 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all text-white placeholder-gray-400"
                    placeholder="e.g., Organic Tomatoes, Fresh Apples, Basmati Rice..."
                />
                <p className="text-xs text-gray-400 mt-1">
                    What are you selling? Be specific
                </p>
            </div>

            {/* Category */}
            <div className="group">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                    <FiTag className="w-4 h-4" />
                    Category <span className="text-red-400">*</span>
                </label>
                <select
                    className="outline-none border border-white/20 w-full p-3 rounded-xl bg-white/10 text-gray-300 focus:border-green-500 transition-all"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                >
                    <option value="" className="text-black">
                        Select a category
                    </option>
                    {[
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
                    ]
                        .sort()
                        .map((option) => (
                            <option
                                key={option}
                                value={option.toLowerCase()}
                                className="text-black"
                            >
                                {option}
                            </option>
                        ))}
                </select>
                <p className="text-xs text-gray-400 mt-1">
                    Choose the category that best fits your product
                </p>
            </div>
        </div>
    )
}

export default BasicInfo
