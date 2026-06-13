import React from "react";
import { FiCalendar, FiTruck } from "react-icons/fi";

const DateSection = ({
  expiryDate,
  setExpiryDate,
  harvestDate,
  setHarvestDate,
}) => {
  // Auto format DD/MM/YYYY
  const formatDate = (value) => {
    let v = value.replace(/\D/g, "");
    if (v.length > 2) v = v.slice(0, 2) + "/" + v.slice(2);
    if (v.length > 5) v = v.slice(0, 5) + "/" + v.slice(5, 9);
    return v;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-green-900/40 pb-4">
        <div className="w-10 h-10 rounded-xl bg-green-900/30 border border-green-700/30 flex items-center justify-center">
          <FiCalendar className="text-green-400 text-lg" />
        </div>

        <div>
          <h2 className="text-xl font-bold text-white">
            Important Dates
          </h2>
          <p className="text-sm text-gray-400">
            Harvest and expiry information
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Harvest Date */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
            <FiTruck className="text-green-400" />
            Harvest Date
          </label>

          <input
            type="text"
            placeholder="DD/MM/YYYY"
            value={harvestDate}
            maxLength={10}
            onChange={(e) =>
              setHarvestDate(formatDate(e.target.value))
            }
            className="
              w-full
              px-4
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

          <p className="text-xs text-gray-500">
            When was this product harvested?
          </p>
        </div>

        {/* Expiry Date */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
            <FiCalendar className="text-green-400" />
            Expiry Date
          </label>

          <input
            type="text"
            placeholder="DD/MM/YYYY"
            value={expiryDate}
            maxLength={10}
            onChange={(e) =>
              setExpiryDate(formatDate(e.target.value))
            }
            className="w-full px-4 py-3 rounded-2xl bg-black/40 border border-green-900/40 text-white placeholder:text-gray-500 outline-none             transition-all
              duration-300 focus:border-green-500 focus:ring-4 focus:ring-green-500/10 hover:border-green-700/50"/>
          <p className="text-xs text-gray-500">
            Best before / expiry date (if applicable)
          </p>
        </div>
      </div>
    </div>
  );
};

export default DateSection;