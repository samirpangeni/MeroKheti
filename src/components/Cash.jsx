import React, { useState, useEffect } from 'react'

const Cash = ({ payMethod, price, productId }) => {
    return (
        <div>
            <button type='button' className={`w-full p-4 rounded-2xl transition ${payMethod === "Cash"
                ? "bg-primary text-foreground"
                : "bg-card hover:bg-card-foreground"
                }`}>
                Cash on Delivery
            </button>
        </div>
    )
}
export default Cash