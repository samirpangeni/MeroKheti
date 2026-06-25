"use client"
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
const PayWithKhalti = ({ payMethod, price, productId, quantity, message, location }) => {
    const [product, setProduct] = useState([])
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await axios.get(`/api/product/${productId}`);
                setProduct(res.data.product);
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        };

        if (productId)
            fetchProduct();
    }, [productId]);
    console.log(location)
    const handleKhaltiPayment = async () => {
        try {
            const orderRes = await axios.post("/api/order", {
                productId,
                quantity,
                payMethod: "khalti",
                message,
                longitude: location.lat,
                latitude: location.lng,
            })
            const orderId = orderRes.data.orderId;
            const res = await axios.post("/api/payment/khalti/initiate", {
                orderId,
                productId,
                quantity,
                amount: product.price * quantity,
            });
            window.location.href = res.data.payment_url;
        } catch (err) {
            console.log(err);
            toast.success("failed to khalti")
        }
    };
    return (
        <div>
            <button
                onClick={handleKhaltiPayment}
                className="w-full p-4 rounded-2xl bg-purple-700 hover:bg-purple-600 transition"
            >
                Pay with Khalti
            </button>
        </div>
    )
}
export default PayWithKhalti