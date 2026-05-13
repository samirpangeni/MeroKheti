import React from 'react'
import {
    FiMapPin,
} from "react-icons/fi";

const Location = ({ location, setLocation }) => {
    return (
        <div>
            <h2 className="text-lg font-semibold text-white border-b border-white/10 pb-2 flex items-center gap-2">
                <FiMapPin className="w-4 h-4" />
                Origin & Location
            </h2>

            <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                    <FiMapPin className="w-4 h-4" />
                    Product Origin / Location{" "}
                    <span className="text-red-400">*</span>
                </label>
                <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full p-3 rounded-xl bg-white/10 border border-white/20 outline-none focus:border-green-500 transition-all text-white placeholder-gray-400"
                    placeholder="e.g., Pokhara, Chitwan, Kathmandu Valley..."
                />
                <p className="text-xs text-gray-400 mt-1">
                    Where was this product grown or produced?
                </p>
            </div>
        </div>
    )
}

export default Location
