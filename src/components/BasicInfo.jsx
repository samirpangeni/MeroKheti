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
      <div className="flex items-center gap-3 border-b border-border pb-4">
        <div className="w-10 h-10 rounded-xl bg-green-900/30 border border-border flex items-center justify-center">
          <FiTag className="text-primary text-lg" />
        </div>

        <div>
          <h2 className="text-xl font-bold text-card-foreground">
            Basic Information
          </h2>
          <p className="text-sm text-muted">
            Enter the essential details of your product
          </p>
        </div>
      </div>

      {/* Product Name */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-muted">
          <FiPackage className="text-primary" />
          Product Name
          <span className="text-red-400">*</span>
        </label>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Organic Tomatoes, Fresh Apples, Basmati Rice..."
          className=" w-full px-4 py-3 rounded-2xl bg-background border border-input-border text-foreground placeholder:text-muted outline-none transition-all duration-300 focus:border-pirmary focus:ring-4 focus:ring-border hover:border-primary-hover"/>

        <p className="text-xs text-muted">
          Be specific so customers can easily find your product.
        </p>
      </div>

      {/* Category */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-muted">
          <FiTag className="text-primary" />
          Category
          <span className="text-red-400">*</span>
        </label>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className=" w-full px-4 py-3 rounded-2xl bg-background border border-input-border text-foreground outline-none transition-all duration-300  focus:ring-2 focus:ring-primary-hover hover:border-primary-hover cursor-pointer">
          <option value="" className="bg-background text-muted">
            Select a category
          </option>

          {categories.sort().map((item) => (
            <option
              key={item}
              value={item.toLowerCase()}
              className="bg-background text-foreground"
            >
              {item}
            </option>
          ))}
        </select>

        <p className="text-xs text-muted">
          Select the category that best matches your product.
        </p>
      </div>
    </div>
  );
};

export default BasicInfo;