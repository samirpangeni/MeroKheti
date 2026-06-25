import connectDB from "../../../../lib/mongoose";
import Order from "../../../../models/Order";
import Product from "../../../../models/Product";
import Activity from "../../../../models/Activity";
import User from "../../../../models/User";
import { NextResponse } from "next/server";
import { v4 as uuid } from "uuid";
import jwt from "jsonwebtoken";

export async function GET(req) {
  try {
    await connectDB();
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "authorized" }, { status: 401 })
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET)
    const userId = decode.id || decode._id || decode.userId;
    const order = await Order.find({ userId }).populate("product.productId", "name image price location category description quantity").populate("userId", "firstName lastName mobile email").sort({ createdAt: -1 });
    return NextResponse.json({ success: true, order })
  } catch (err) {
    console.log(err)
    return NextResponse.json({ message: "server error" }, { status: 500 })
  }
}
export async function POST(req) {
  try {
    await connectDB();
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Not logged in" }, { status: 401 });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId || decoded.id;
    if (!userId) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }
    const body = await req.json();

    const { productId, quantity, payMethod, message, khalti_pidx, latitude, longitude } = body;
    if (!productId || !quantity || !payMethod) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 },
      );
    }
    const qty = Number(quantity);

    const product = await Product.findById(productId)
    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 },
      );
    }
    if (product.quantity < qty) {
      return NextResponse.json(
        { success: false, message: "Not enough stock" },
        { status: 400 },
      );
    }

    const totalAmount = product.price * qty;

    const order = await Order.create({
      userId,
      product: [
        {
          productId,
          quantity: qty,
          price: product.price,
        },
      ],
      paymentMethod: payMethod,
      totalAmount,
      paymentStatus: "pending",
      orderStatus: "pending",
      transaction_uuid: uuid(),
      message,
      khalti_pidx,
      location: {
        lat: Number(latitude),
        lng: Number(longitude),
      },
    });
    await Activity.create({
      userId,
      productId: product._id,
      message: `Purchase ${product.name} `,
      type: "purchase"
    })
    return NextResponse.json({
      success: true,
      orderId: order._id,
      transaction_uuid: order.transaction_uuid,
      totalAmount,
      khalti_pidx
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { success: false, message: "server error" },
      { status: 500 },
    );
  }
}

export async function PUT(req) {
  try {
    await connectDB();
    const { id } = await req.json();
    const order = await Order.findById(id);

    if (!order) {
      return NextResponse.json(
        { message: "Order not found" },
        { status: 404 }
      );
    }
    if (order.paymentMethod !== "Cash") {
      return NextResponse.json(
        { message: "Only cash orders can be confirmed manually" },
        { status: 400 }
      );
    }
    order.paymentStatus = "paid";
    order.orderStatus = "confirmed";
    await order.save();
    return NextResponse.json({
      message: "Payment confirmed successfully",
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}