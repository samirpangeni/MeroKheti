"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import PayWithEsewa from "@/components/PayWithEsewa";
import PayWithKhalti from "@/components/PayWithKhalti"
import Cash from "@/components/Cash"
import { toast } from "react-toastify";
const Checkout = ({ productId, onClose }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [payMethod, setPayMethod] = useState("Cash");
  const [ordering, setOrdering] = useState(false);
  const [message, setMessage] = useState("");
  const [location, setLocation] = useState({
    lat: null,
    lng: null,
  });

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
  console.log(location)
  console.log("hello", location.lng)
  console.log("hello1", location.lat)
  const handleOrder = async (e) => {
    e.preventDefault();

    if (!location.lat || !location.lng) {
      toast.error("Location not available");
      return;
    }
    console.log("hello", location.lng)
    console.log("hello1", location.lat)

    try {
      setOrdering(true);

      const res = await axios.post("/api/order", {
        productId,
        quantity,
        payMethod,
        latitude: location.lat,
        longitude: location.lng,
      });
      console.log("hello", res)
      toast.success("Order placed successfully!");
      onClose?.();
    } catch (err) {
      console.log(err);
      toast.error("Order failed, try again");
    } finally {
      setOrdering(false);
    }
  };
  useEffect(() => {
    const getLocation = () => {
      if (!navigator.geolocation) {
        alert("Geolocation is not supported");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.log(error);
        }
      );
    };
    getLocation();
  }, []);
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black w-full">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-green-400">Loading Product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center text-white p-10">
        Product not found
      </div>
    );
  }

  const total = product.price * quantity;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 z-50">
      <div
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto scrollbar-hide rounded-3xl bg-zinc-900 border border-zinc-800 shadow-2xl text-zinc-200">
        {/* Header */}
        <div className="sticky top-0 bg-zinc-900/95 backdrop-blur p-5 border-b border-zinc-800 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold">
              Checkout
            </h2>
            <p className="text-sm text-zinc-400">
              Complete your order
            </p>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-zinc-800 hover:bg-zinc-700 transition"
            >
              ✕
            </button>
          )}
        </div>

        {/* Image */}
        <img
          src={product.image?.[0]?.url}
          alt={product.name}
          className="w-full h-64 object-cover"
        />

        <div className="p-5">

          {/* Product Info */}
          <div>
            <h3 className="text-2xl font-semibold">
              {product.name}
            </h3>

            <p className="text-zinc-400 mt-2 text-sm leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Price Card */}
          <div className="mt-5 bg-zinc-800 rounded-2xl p-4 flex justify-between items-center">
            <div>
              <p className="text-zinc-400 text-sm">
                Price
              </p>

              <h3 className="text-2xl text-green-500 font-semibold">
                NPR {product.price}
              </h3>
            </div>

            <div className="text-right">
              <p className="text-zinc-400 text-sm">
                Stock
              </p>

              <p>
                {product.quantity}
              </p>
            </div>
          </div>

          {/* Quantity */}
          <div className="mt-6">
            <p className="text-zinc-400 text-sm mb-3">
              Quantity
            </p>

            <div className="flex items-center gap-4">
              <button
                onClick={() =>
                  quantity > 1 &&
                  setQuantity(quantity - 1)
                }
                className="w-11 h-11 rounded-full bg-zinc-800 hover:bg-zinc-700 transition"
              >
                -
              </button>

              <span className="text-xl font-medium">
                {quantity}
              </span>

              <button
                onClick={() =>
                  quantity < product.quantity &&
                  setQuantity(quantity + 1)
                }
                className="w-11 h-11 rounded-full bg-green-600 hover:bg-green-500 transition"
              >
                +
              </button>
            </div>
          </div>

          {/* Total */}
          <div className="mt-6 bg-zinc-800 rounded-2xl p-4">
            <p className="text-zinc-400 text-sm">
              Total Amount
            </p>

            <h2 className="text-3xl text-green-500 font-semibold mt-1">
              NPR {product.price * quantity}
            </h2>
          </div>
          <div className="flex flex-col gap-2 bg-zinc-950 border  mt-5 border-green-900/30 rounded-2xl">
            <label className="text-sm font-medium text-zinc-400">
              Specific Message
            </label>

            <textarea
              placeholder="Enter your specific message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              className="w-full rounded-xl bg-black/60 border border-green-700/40 px-4 py-3 text-white placeholder:text-zinc-500 outline-none resize-none transition-all duration-300 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 hover:border-green-600/60 hover:bg-black/80 shadow-lg shadow-green-950/20" />
          </div>

          {/* Payment Methods */}
          <div className="mt-6 space-y-3">

            <PayWithKhalti
              payMethod={payMethod}
              quantity={quantity}
              price={product.price * quantity}
              productId={productId}
              message={message}
              location={location}

            />

            <PayWithEsewa
              payMethod={payMethod}
              price={product.price * quantity}
              productId={productId}
              message={message}
              location={location}
            />

            <Cash
              payMethod={payMethod}
              price={product.price * quantity}
              productId={productId}
              message={message} />
          </div>

          {/* Selected Method */}
          <p className="text-center text-sm text-zinc-400 mt-4">
            Selected:{" "}
            <span className="text-green-500">
              {payMethod}
            </span>
          </p>

          {/* Place Order */}
          <button
            onClick={handleOrder}
            disabled={ordering}
            className="mt-6 w-full bg-green-500 hover:bg-green-400 text-black font-medium py-4 rounded-2xl transition disabled:opacity-50">
            {ordering ? "Processing..." : "Place Order"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;