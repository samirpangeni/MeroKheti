import React from "react";
import { FiMapPin } from "react-icons/fi";

const Location = ({ location, setLocation }) => {
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-green-900/40 pb-4">
        <div className="w-10 h-10 rounded-xl bg-green-900/30 border border-green-700/30 flex items-center justify-center">
          <FiMapPin className="text-green-400 text-lg" />
        </div>

        <div>
          <h2 className="text-xl font-bold text-white">
            Origin & Location
          </h2>
          <p className="text-sm text-gray-400">
            Specify where your product comes from
          </p>
        </div>
      </div>

      {/* Input */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
          <FiMapPin className="text-green-400" />
          Product Origin / Location
          <span className="text-red-400">*</span>
        </label>

        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Pokhara, Chitwan, Kathmandu Valley..."
          className="w-full px-4 py-3 rounded-2xl bg-black/40 border border-green-900/40 text-white placeholder:text-gray-500 outline-none transition-all duration-300 focus:border-green-500 focus:ring-4 focus:ring-green-500/10 hover:border-green-700/50"/>

        <p className="text-xs text-gray-500">
          Mention the exact place where the product was grown or produced.
        </p>
      </div>

      {/* Quick Suggestions */}
      <div className="flex flex-wrap gap-2">
        {["Kathmandu", "Pokhara", "Chitwan", "Biratnagar", "Lalitpur"].map(
          (place) => (
            <button
              key={place}
              type="button"
              onClick={() => setLocation(place)}
              className="px-3 py-1.5 text-xs rounded-full bg-green-950/40 border border-green-800/30 text-green-300 hover:bg-green-900/40 hover:border-green-500/40 transition">
              {place}
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default Location;