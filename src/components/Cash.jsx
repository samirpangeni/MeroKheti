import React, { useState, useEffect } from 'react'

const Cash = ({ payMethod, price, productId }) => {
    return (
        <div>
            <button type='button' className={`w-full p-4 rounded-2xl transition ${payMethod === "Cash"
                ? "bg-green-600 text-black"
                : "bg-zinc-800 hover:bg-zinc-700"
                }`}>
                Cash on Delivery
            </button>
        </div>
    )
}
export default Cash