import connectDB from "../../../../../../lib/mongoose";
import Product from "../../../../../../models/Product";
import Order from "../../../../../../models/Order";
import { NextResponse } from "next/server";
export async function POST(req) {
  try {
    await connectDB();
    const { orderId, productId, quantity } = await req.json();
    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json(
        { message: "product not found" },
        { status: 404 },
      );
    }
    const product = await Product.findById(productId);

    const totalAmount = product.price * quantity;

    const payload = {
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
      website_url: process.env.NEXT_PUBLIC_BASE_URL,
      amount: totalAmount * 100,
      purchase_order_id: order._id.toString(),
      purchase_order_name: "Farm Products",
    };
    const response = await fetch(
      "https://a.khalti.com/api/v2/epayment/initiate/",
      {
        method: "POST",
        headers: {
          Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
          "Content-type": "application/json",
        },
        body: JSON.stringify(payload),
      },
    );
    const data = await response.json();
    if (!response.ok) {
      console.log("Khalti error:", data);
      return NextResponse.json(
        { message: "Khalti initiation failed" },
        { status: 500 },
      );
    }
    await Order.findByIdAndUpdate(orderId, {
      khalti_pidx: data.pidx,
    });
    return NextResponse.json({ payment_url: data.payment_url });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "server error" }, { status: 500 });
  }
}
