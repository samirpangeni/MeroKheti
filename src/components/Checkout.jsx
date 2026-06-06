"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import PayWithEsewa from "@/components/PayWithEsewa"

const Checkout = ({ productId, onClose }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [payMethod, setPayMethod] = useState("Cash");
  const [ordering, setOrdering] = useState(false);

  // FETCH PRODUCT
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

    if (productId) fetchProduct();
  }, [productId]);

  // QUANTITY HANDLER (SAFE)
  const handleQuantityChange = (e) => {
    const value = Number(e.target.value);

    if (!product) return;

    if (value > product.quantity) {
      alert(`Only ${product.quantity} items available in stock`);
      return;
    }

    if (value < 1) return;

    setQuantity(value);
  };

  // KHALTI PAYMENT
  const handleKhaltiPayment = async () => {
    setPayMethod("Khalti");

    try {
      const res = await axios.post("/api/payment/khalti/initiate", {
        productId,
        quantity,
        amount: product.price * quantity,
      });

      window.location.href = res.data.payment_url;
    } catch (err) {
      console.log(err);
      alert("Khalti payment failed");
    }
  };

  // MAIN ORDER HANDLER
  const handleOrder = async (e) => {
    e.preventDefault();

    if (payMethod !== "Cash") return;

    try {
      setOrdering(true);

      await axios.post("/api/order", {
        productId,
        quantity,
        payMethod,
      });

      alert("Order placed successfully!");

      onClose?.();
    } catch (err) {
      console.log(err);
      alert("Order failed");
    } finally {
      setOrdering(false);
    }
  };

  // LOADING UI
  if (loading) {
    return (
      <div className="bg-white p-6 rounded-xl w-96 text-center">
        Loading...
      </div>
    );
  }

  // ERROR UI
  if (!product) {
    return (
      <div className="bg-white p-6 rounded-xl w-96 text-center">
        Product not found
      </div>
    );
  }

  return (
    <div className="bg-white text-black p-6 rounded-2xl shadow-2xl w-full max-w-md relative">

      {/* CLOSE BUTTON */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-red-500 text-xl font-bold"
        >
          ✕
        </button>
      )}

      {/* TITLE */}
      <h2 className="text-2xl font-bold mb-4">
        Checkout
      </h2>

      {/* PRODUCT IMAGE */}
      <img
        src={product.image?.[0]?.url}
        alt={product.name}
        className="w-full h-40 object-cover rounded-lg mb-4"
      />

      {/* PRODUCT INFO */}
      <h3 className="text-lg font-semibold">
        {product.name}
      </h3>

      <p className="text-gray-600 text-sm mb-2">
        {product.description}
      </p>

      <p className="text-green-600 font-bold"
      >
        NPR {product.price}
      </p>

      <p className="text-sm text-gray-500">
        Stock: {product.quantity}
      </p>

      {/* QUANTITY */}
      <div className="mt-4">
        <label className="text-sm font-medium">
          Quantity
        </label>

        <input
          type="number"
          value={quantity}
          onChange={handleQuantityChange}
          className="w-full border p-2 rounded mt-1"
        />
      </div>

      {/* TOTAL PRICE */}
      <div className="mt-3 p-2 bg-gray-100 rounded">
        <p className="font-semibold"
        >
          Total: NPR {product.price * quantity}
        </p>
      </div>

      {/* PAYMENT METHODS */}
      <div className="mt-5 space-y-2">

        <button
          type="button"
          onClick={handleKhaltiPayment}
          className="w-full bg-purple-600 text-white p-2 rounded hover:bg-purple-700"
        >
          Pay with Khalti
        </button>

        <PayWithEsewa payMethod={payMethod} price={price} productId={productId}/>

        <button
          type="button"
          onClick={() => setPayMethod("Cash")}
          className={`w-full p-2 rounded text-white ${payMethod === "Cash"
            ? "bg-yellow-700"
            : "bg-yellow-500"
            }`}
        >
          Cash on Delivery
        </button>
      </div>

      {/* SELECTED METHOD */}
      <p className="text-sm mt-3 text-gray-600">
        Selected: <b>{payMethod}</b>
      </p>

      {/* PLACE ORDER */}
      <button
        onClick={handleOrder}
        disabled={ordering}
        className="w-full mt-4 bg-blue-600 text-white p-3 rounded hover:bg-blue-700"
      >
        {ordering ? "Processing..." : "Place Order"}
      </button>
    </div>
  );
};

export default Checkout;