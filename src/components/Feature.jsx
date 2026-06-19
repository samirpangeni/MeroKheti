import React from 'react'

const Feature = () => {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 ml-5 ">

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                <p className="text-sm font-medium">🌿 Fresh & Organic</p>
                <p className="text-xs text-gray-400 mt-1">
                    Direct from local farms, no chemicals.
                </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                <p className="text-sm font-medium">🚚 Fast Delivery</p>
                <p className="text-xs text-gray-400 mt-1">
                    Quick delivery from nearby sellers.
                </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                <p className="text-sm font-medium">💰 Fair Pricing</p>
                <p className="text-xs text-gray-400 mt-1">
                    No middlemen, better prices for everyone.
                </p>
            </div>
        </div>
    )
}

export default Feature
