import React from 'react'
import Search from './Search';
const Hero = ({ search, setSearch, products, setProducts }) => {
    return (
        <div className="relative flex flex-col items-center justify-center text-center px-6 pt-20 pb-16 overflow-hidden">
            <div className="absolute w-96 h-96 bg-green-500/20 blur-[140px] rounded-full -top-40 -left-40" />
            <div className="absolute w-80 h-80 bg-blue-500/20 blur-[140px] rounded-full -bottom-40 -right-40" />
            <h1 className="text-4xl md:text-5xl font-semibold leading-tight">
                Fresh food, directly from
                <span className="text-green-400">farmers</span>
            </h1>

            <p className="mt-3 text-gray-400 max-w-xl">
                Discover organic, fresh, and local products without middlemen.
            </p>


            <div className="mt-8 w-full max-w-xl relative">


                <Search search={search} setSearch={setSearch} products={products} setProducts={setProducts} />
            </div>


            <div className="mt-6 flex gap-3">
                <button className="bg-green-600 hover:bg-green-700 px-5 py-2.5 rounded-xl transition">
                    Explore
                </button>
                <button className="border border-white/10 hover:bg-white/10 px-5 py-2.5 rounded-xl transition">
                    Sell Product
                </button>
            </div>

        </div>
    )
}

export default Hero
