import React from 'react'
import {
    FiCalendar,
    FiTruck,
} from "react-icons/fi";
const Date = ({ expiryDate, setExpiryDate, harvestDate, setHarvestDate }) => {
    return (
        <div>
            <h2 className="text-lg font-semibold text-white border-b border-white/10 pb-2 flex items-center gap-2">
                <FiCalendar className="w-4 h-4" />
                Important Dates{" "}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Harvest Date */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                        <FiTruck className="w-4 h-4" />
                        Harvest Date
                    </label>
                    <input
                        type="date"
                        className="w-full p-3 rounded-xl bg-white/10 border border-white/20 outline-none focus:border-green-500 transition-all text-white"
                        value={harvestDate}
                        onChange={(e) => setHarvestDate(e.target.value)}
                    />
                    <p className="text-xs text-gray-400 mt-1">When was this product harvested?</p>
                </div>

                {/* Expiry Date */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                        <FiCalendar className="w-4 h-4" />
                        Expiry Date
                    </label>
                    <input
                        type="date"
                        className="w-full p-3 rounded-xl bg-white/10 border border-white/20 outline-none focus:border-green-500 transition-all text-white"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                    />
                    <p className="text-xs text-gray-400 mt-1">Best before or expiry date (if applicable)</p>
                </div>
            </div>
        </div>
    )
}

export default Date
