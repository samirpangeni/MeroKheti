import React from 'react'
import {
  FiAlignLeft,
  FiFeather,
} from "react-icons/fi";

const Description = ({ description, setDescription, organic, setOrganic }) => {
    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Description - takes 2/3 of space */}
                <div className="md:col-span-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                        <FiAlignLeft className="w-4 h-4" />
                        Product Description <span className="text-red-400">*</span>
                    </label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full p-3 rounded-xl bg-white/10 border border-white/20 outline-none focus:border-green-500 transition-all text-white placeholder-gray-400 h-28 resize-none"
                        placeholder="Describe your product... Quality, taste, size, color, benefits, how to use, storage instructions, etc."
                    />
                    <p className="text-xs text-gray-400 mt-1">
                        {description.length}/500 characters • Help customers
                        understand what they're buying
                    </p>
                </div>

                {/* Organic Checkbox */}
                <div className="flex items-start">
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10 w-full">
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={organic}
                                onChange={(e) => setOrganic(e.target.checked)}
                                className="w-5 h-5 rounded border-white/20 bg-white/10 text-green-600 focus:ring-green-500 focus:ring-offset-0"
                            />
                            <div className="flex items-center gap-2">
                                <FiFeather className="w-5 h-5 text-green-400" />
                                <span className="text-gray-300 font-medium">Organic</span>
                            </div>
                        </label>
                        <p className="text-xs text-gray-400 mt-2">
                            Check if this product is certified organic or grown without
                            chemicals
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Description
