import React from 'react'
import {
    FiDollarSign,
} from "react-icons/fi";

const PriceInput = ({ price, setPrice, quantity, setQuantity, unit, setUnit }) => {
    const formattedPrice = price ? new Intl.NumberFormat().format(price) : "";
    return (
        <div>
            <h2 className="text-lg font-semibold text-white border-b border-white/10 pb-2 flex items-center gap-2">
                <FiDollarSign className="w-4 h-4" />
                Pricing & Stock
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Price */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                        Price <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            NPR
                        </span>
                        <input
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="w-full p-3 pl-12 rounded-xl bg-white/10 border border-white/20 outline-none focus:border-green-500 transition-all text-white"
                            placeholder="0.00"
                            step="0.01"
                        />
                    </div>
                    {formattedPrice && (
                        <p className="text-xs text-green-400 mt-1">
                            Formatted: NPR {formattedPrice}
                        </p>
                    )}
                </div>

                {/* Quantity & Unit */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                        Quantity & Unit <span className="text-red-400">*</span>
                    </label>
                    <div className="flex gap-2">
                        <input
                            type="number"
                            min="0"
                            step="0.1"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            className="w-1/2 p-3 rounded-xl bg-white/10 border border-white/20 outline-none focus:border-green-500 transition-all text-white"
                            placeholder="Quantity"
                        />
                        <select
                            className="w-1/2 outline-none border border-white/20 p-3 rounded-xl bg-white/10 text-gray-300 focus:border-green-500 transition-all"
                            value={unit}
                            onChange={(e) => setUnit(e.target.value)}
                        >
                            <option value="" className="text-black">
                                Select Unit
                            </option>
                            {[
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
                            ].map((option) => (
                                <option
                                    key={option}
                                    value={option}
                                    className="text-black"
                                >
                                    {option}
                                </option>
                            ))}
                        </select>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                        Example: 5 kg, 2 dozen, 10 pieces
                    </p>
                </div>
            </div>
        </div>
    )
}

export default PriceInput
