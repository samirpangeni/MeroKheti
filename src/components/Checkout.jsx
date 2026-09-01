"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import PayWithEsewa from "@/components/PayWithEsewa";
import Loading from "@/components/Loading"
import PayWithKhalti from "@/components/PayWithKhalti";
import Cash from "@/components/Cash";
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
    address: "",
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

  const handleOrder = async (e) => {
    e.preventDefault();
    if (payMethod !== "Cash") {
      return;
    }
    if (
      !location.address?.trim() &&
      (!location.lat || !location.lng)
    ) {
      toast.error("Please provide your delivery location.");
      return;
    }
    try {
      setOrdering(true);
      const res = await axios.post("/api/order", {
        productId,
        quantity: Number(quantity),
        payMethod: "Cash",
        message,
        latitude: location.lat,
        longitude: location.lng,
        address: location.address?.trim() || "",
      });
      if (!res.data.success) {
        throw new Error(
          res.data.message || "Order failed"
        );
      }
      toast.success("Order placed successfully!");
      onClose?.();
    } catch (err) {
      console.error("ORDER ERROR:", err);
      console.error(
        "SERVER RESPONSE:",
        err.response?.data
      );
      toast.error(
        err.response?.data?.message ||
        "Order failed, try again"
      );
    } finally {
      setOrdering(false);
    }
  };
  useEffect(() => {
    const getLocation = () => {
      if (!navigator.geolocation) {
        toast.error("GPS is not supported on this device.");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation((prev) => ({
            ...prev,
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }));
        },
        (error) => {
          console.log("GPS ERROR:", error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    };

    getLocation();
  }, []);
  if (loading) {
    return (
      <Loading />
    );
  }

  if (!product) {
    return <div className="text-center text-foreground p-10">Product not found</div>;
  }

  const total = product.price * quantity;

  return (
    <div className="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-7xl bg-card rounded-3xl border border-border shadow-2xl overflow-hidden max-h-[95vh] overflow-y-auto scrollbar-hide">
        {/* Header */}
        <div className="sticky top-0  bg-card border-b border-border px-6 py-5 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Checkout</h2>

            <p className="text-muted text-sm mt-1">
              Review your order before payment
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-card hover:bg-red-400 hover:dark:bg-red-600 transition text-foreground"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
          <div className="space-y-6">
            <div className="overflow-hidden rounded-3xl border border-border">
              <img
                src={product.image?.[0]?.url}
                alt={product.name}
                className="w-full h-[350px] lg:h-[450px] object-cover hover:scale-105 duration-500"
              />
            </div>

            <div>
              <h1 className="text-3xl font-bold text-foreground">{product.name}</h1>

              <p className="mt-4 text-muted leading-7">
                {product.description}
              </p>
            </div>

            <div className="bg-card rounded-3xl p-6 space-y-5">
              <div className="flex justify-between">
                <span className="text-muted">Price</span>

                <span className="text-primary font-bold text-2xl">
                  NPR {product.price}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted">Stock</span>

                <span className="text-foreground font-semibold">
                  {product.quantity}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted">Category</span>

                <span className="text-foreground">{product.category}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted">Organic</span>

                <span className="text-primary">
                  {product.organic ? "Yes 🌱" : "No"}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted">Harvest Date</span>

                <span className="text-foreground">
                  {product.harvestDate
                    ? new Date(product.harvestDate).toLocaleDateString()
                    : "-"}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Quantity */}

            <div className="bg-card rounded-3xl p-6">
              <h3 className="text-xl font-semibold text-foreground mb-5">
                Order Summary
              </h3>

              <div className="flex justify-between items-center">
                <span className="text-muted">Quantity</span>

                <div className="flex items-center rounded-xl overflow-hidden border border-card">
                  <button
                    onClick={() => {
                      if (quantity > 1) {
                        setQuantity((prev) => prev - 1);
                      }
                    }}
                    className="w-12 h-12 bg-card hover:bg-secondary-foreground active:scale-95 transition text-xl"
                  >
                    −
                  </button>

                  <div className="w-16 text-center text-lg font-bold">
                    {quantity}
                  </div>

                  <button
                    onClick={() => {
                      if (quantity < Number(product.quantity)) {
                        setQuantity((prev) => prev + 1);
                      }
                    }}
                    className="w-12 h-12 bg-primary hover:bg-primary-hover active:scale-95 transition text-xl"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-linear-to-r from-primary to-primary-hover p-6 text-foregroud">
              <p className="font-medium">Total Amount</p>

              <h2 className="text-4xl font-bold mt-2">NPR {total}</h2>

              <p className="mt-2 text-sm opacity-80">
                {quantity} × NPR {product.price}
              </p>
            </div>

            {/* Delivery Location */}

            <div className="bg-card rounded-3xl p-6 border border-border">
              <div className="mb-5">
                <h3 className="text-lg font-semibold text-foreground">
                  Delivery Location
                </h3>

                <p className="text-sm text-muted mt-1">
                  Use your current location or enter your delivery
                  address manually.
                </p>
              </div>

              {/* GPS Button */}
              <button
                type="button"
                onClick={() => {
                  if (!navigator.geolocation) {
                    toast.error("GPS is not supported on this device.");
                    return;
                  }

                  navigator.geolocation.getCurrentPosition(
                    (position) => {
                      setLocation((prev) => ({
                        ...prev,
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                      }));

                      toast.success("Current location detected!");
                    },
                    (error) => {
                      console.error("GPS ERROR:", error);

                      toast.error(
                        "Unable to get GPS location. You can enter your address manually."
                      );
                    },
                    {
                      enableHighAccuracy: true,
                      timeout: 10000,
                      maximumAge: 0,
                    }
                  );
                }}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl border border-primary/30 bg-primary/10 text-primary font-medium hover:bg-primary/20 active:scale-[0.98] transition"
              >
                📍 Use My Current Location
              </button>

              {/* OR */}
              <div className="flex items-center gap-3 my-5">
                <div className="h-px flex-1 bg-border" />

                <span className="text-xs text-muted font-medium">
                  OR
                </span>

                <div className="h-px flex-1 bg-border" />
              </div>

              {/* Manual Address */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Delivery Address
                </label>

                <textarea
                  value={location.address}
                  onChange={(e) =>
                    setLocation((prev) => ({
                      ...prev,
                      address: e.target.value,
                    }))
                  }
                  rows={4}
                  placeholder="Example: Kathmandu, Baneshwor, near Civil Hospital"
                  className="w-full rounded-2xl bg-background border border-border p-4 text-sm text-foreground placeholder:text-muted outline-none resize-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
                />

                <p className="text-xs text-muted mt-2">
                  Please provide a clear address so the farmer can
                  find your delivery location.
                </p>
              </div>

              {/* Selected Location */}
              {(location.lat || location.lng || location.address) && (
                <div className="mt-5 rounded-2xl border border-primary/20 bg-primary/5 p-4">
                  <div className="flex items-center gap-2">
                    <span className="text-primary">✓</span>

                    <p className="text-sm font-medium text-primary">
                      Delivery location selected
                    </p>
                  </div>

                  {location.address && (
                    <div className="mt-3">
                      <p className="text-xs text-muted">
                        Address
                      </p>

                      <p className="text-sm text-foreground mt-1">
                        {location.address}
                      </p>
                    </div>
                  )}

                  {location.lat && location.lng && (
                    <div className="mt-3">
                      <p className="text-xs text-muted">
                        GPS Coordinates
                      </p>

                      <p className="text-xs text-muted mt-1 break-all">
                        {location.lat.toFixed(6)},{" "}
                        {location.lng.toFixed(6)}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Message */}

            <div className="bg-card rounded-3xl p-6">
              <label className="block text-foreground font-semibold mb-4">
                Special Instructions
              </label>

              <textarea
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write delivery instructions..."
                className="w-full rounded-2xl bg-card border border-border p-4 outline-none resize-none focus:border-primary-hover text-foreground"
              />
            </div>

            {/* Payment */}

            <div className="bg-card rounded-3xl p-6">
              <h3 className="text-lg font-semibold text-foreground mb-5">
                Payment Method
              </h3>

              <div className="space-y-3">
                <PayWithKhalti
                  payMethod={payMethod}
                  quantity={quantity}
                  productId={productId}
                  price={total}
                  message={message}
                  location={location}
                />

                <PayWithEsewa
                  payMethod={payMethod}
                  productId={productId}
                  price={total}
                  message={message}
                  location={location}

                />

                <Cash
                  payMethod={payMethod}
                  productId={productId}
                  price={total}
                  message={message}
                />
              </div>
            </div>

            {/* Place Order */}

            <button
              onClick={handleOrder}
              disabled={ordering}
              className="w-full py-5 rounded-3xl bg-linear-to-r from-primary to-primary-hover text-foreground text-lg font-bold hover:scale-[1.02] active:scale-95 transition-all duration-300 disabled:opacity-50"
            >
              {ordering ? "Processing..." : "Place Order"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
