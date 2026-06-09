import connectDB from "../../../../../../lib/mongoose";
import { NextResponse } from "next/server";
import CryptoJS from "crypto-js";
import Order from "../../../../../../models/Order";

export async function POST(req) {
  try {
    await connectDB();

    const { orderId } = await req.json();
    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json({ message: "order not found" }, { status: 404 });
    }
    const total_amount = order.totalAmount;
    const transaction_uuid = order.transaction_uuid;
    const product_code = "EPAYTEST";
    
    const hashString = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`;
    const sign = CryptoJS.HmacSHA256(hashString, process.env.ESEWA_SECRET);
    const signature = CryptoJS.enc.Base64.stringify(sign);

    return NextResponse.json({ signature });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "server error" }, { status: 500 });
  }
}
