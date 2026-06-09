"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

const PayWithEsewa = ({ payMethod, price, productId }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
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

  const handelEsewa = async () => {
    try {
      setLoading(true);
      const orderRes = await axios.post("/api/order", {
        productId,
        quantity,
        payMethod: "esewa",
      });
      const orderId = orderRes.data.orderId;

      const signatureRes = await axios.post("/api/payment/esewa/initiate", {
        orderId,
      });
      const signature = signatureRes.data.signature;
      const order = orderRes.data;
      const formData = {
        amount: order.totalAmount,
        failure_url: `${process.env.NEXT_PUBLIC_BASE_URL}/failed`,
        product_delivery_charge: "0",
        product_service_charge: "0",
        product_code: "EPAYTEST",
        signature: signature,
        signed_field_names: "total_amount,transaction_uuid,product_code",
        success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
        tax_amount: "0",
        total_amount: order.totalAmount,
        transaction_uuid: order.transaction_uuid,
      };

      const form = document.createElement("form");
      form.method = "POST";
      form.action = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";

      Object.entries(formData).forEach(([key, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = value;
        form.appendChild(input);
      });
      document.body.appendChild(form);
      form.submit();
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <button
        type="button"
        onClick={handelEsewa}
        className={`w-full p-4 rounded-2xl transition ${
          payMethod === "eSewa" ? "bg-green-700" : "bg-green-500"
        }`}
      >
        Pay with eSewa
      </button>
    </div>
  );
};

export default PayWithEsewa;
