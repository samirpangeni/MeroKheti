import React from "react";
import { FiDollarSign } from "react-icons/fi";

const PriceInput = ({
  price,
  setPrice,
  quantity,
  setQuantity,
  unit,
  setUnit,
}) => {
  const formattedPrice = price
    ? new Intl.NumberFormat("en-NP").format(price)
    : "";

  const units = [
    "kg",
    "gram",
    "lb",
    "dozen",
    "piece",
    "liter",
    "ml",
    "bunch",
    "box",
    "bag",
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-green-900/40 pb-4">
        <div className="w-10 h-10 rounded-xl bg-green-900/30 border border-green-700/30 flex items-center justify-center">
          <FiDollarSign className="text-green-400 text-lg" />
        </div>

        <div>
          <h2 className="text-xl font-bold text-white">
            Pricing & Stock
          </h2>
          <p className="text-sm text-gray-400">
            Set a fair price and available quantity
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* PRICE */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">
            Price <span className="text-red-400">*</span>
          </label>

          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-green-400 text-sm font-medium">
              NPR
            </span>

            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.00"
              step="0.01"
              className="
                w-full
                pl-14
                pr-4
                py-3
                rounded-2xl
                bg-black/40
                border
                border-green-900/40
                text-white
                placeholder:text-gray-500
                outline-none
                transition-all
                duration-300
                focus:border-green-500
                focus:ring-4
                focus:ring-green-500/10
                hover:border-green-700/50
              "
            />
          </div>

          {formattedPrice && (
            <p className="text-xs text-green-400">
              ✓ Formatted: NPR {formattedPrice}
            </p>
          )}
        </div>

        {/* QUANTITY + UNIT */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">
            Quantity & Unit <span className="text-red-400">*</span>
          </label>

          <div className="flex gap-3">
            {/* Quantity */}
            <input
              type="number"
              min="0"
              step="0.1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Qty"
              className="w-1/2 px-4 py-3 rounded-2xl bg-black/40 border border-green-900/40 text-white placeholder:text-gray-500 outline-none transition-all duration-300 focus:border-green-500 focus:ring-4 focus:ring-green-500/10 hover:border-green-700/50"/>

            {/* UNIT */}
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className=" w-1/2 px-4 py-3 rounded-2xl bg-black/40 border border-green-900/40 text-white outline-none transition-all duration-300 focus:border-green-500 focus:ring-4 focus:ring-green-500/10 hover:border-green-700/50 cursor-pointer
              "
            >
              <option value="" className="bg-[#111] text-gray-400">
                Select Unit
              </option>

              {units.map((u) => (
                <option
                  key={u}
                  value={u}
                  className="bg-[#111] text-white"
                >
                  {u}
                </option>
              ))}
            </select>
          </div>

          <p className="text-xs text-gray-500">
            Example: 5 kg, 2 dozen, 10 pieces
          </p>
        </div>
      </div>
    </div>
  );
};

export default PriceInput;