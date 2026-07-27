import { NextResponse } from "next/server";
import connectDB from "../../../../lib/mongoose";
import OrderReport from "../../../../models/OrderReport";
import Activity from "../../../../models/Activity";
import jwt from "jsonwebtoken";
import User from "../../../../models/User";
import Product from "../../../../models/Product";
import Order from "../../../../models/Order";

export async function GET(req) {
  try {
    await connectDB();
  } catch (err) {
    console.log(err);
    return NextResponce.json({ message: "server error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unathorized" }, { status: 401 });
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    const userid = decode.id || decode.userId || decode._id;
    const body = await req.json();
    const { userId, reason, productId, orderId } = body;
    const orderReport = await OrderReport.create({
      userId,
      orderId,
      productId,
      reason,
    });
    const product = await Product.findById(productId).populate(
      "userId",
      "firstName lastName",
    );

    await Activity.create({
      userId,
      productId: product._id,
      message: `You reported an order for ${product.name} sold by ${userId.firstName} ${userId.lastName}.`,
      type: "report",
    });
    return NextResponse.json({ message: "report successfully", orderReport });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "server error" }, { satus: 500 });
  }
}

export async function PUT(req) {
  try {
    await connectDB();
    const { selectionId } = await req.json();
    const order = await Order.findById(selectionId)
      .populate("userId", "firstName lastName")
      .populate("product.productId", "name");

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    if (order.orderStatus === "delivered") {
      return NextResponse.json(
        { message: "Order is already delivered" },
        { status: 400 },
      );
    }
    order.orderStatus = "delivered";
    await order.save();

    await Activity.create({
      userId: order.userId._id,
      productId: order.product[0].productId._id,
      message: `The order for "${order.product[0].productId.name}" has been marked as delivered by the customer.`,
      type: "delivery",
    });
    return NextResponse.json({
      success: true,
      message: "Product received successfully.",
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 },
    );
  }
}
