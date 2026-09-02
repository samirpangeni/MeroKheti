import { NextResponse } from "next/server";
import connectDB from "../../../../../lib/mongoose";
import Order from "../../../../../models/Order";
import Product from "../../../../../models/Product";
import jwt from "jsonwebtoken";

export async function PUT(req) {
  try {
    await connectDB();

    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Not logged in",
        },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const farmerId = decoded.userId || decoded.id;
    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json(
        {
          success: false,
          message: "Order ID is required",
        },
        { status: 400 }
      );
    }

    const order = await Order.findById(orderId).populate(
      "product.productId"
    );

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          message: "Order not found",
        },
        { status: 404 }
      );
    }

    // Only Cash orders
    if (order.paymentMethod !== "Cash") {
      return NextResponse.json(
        {
          success: false,
          message: "This is not a cash order",
        },
        { status: 400 }
      );
    }

    const product = order.product?.[0]?.productId;

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          message: "Product not found",
        },
        { status: 404 }
      );
    }

    // Check that this farmer owns the product
    if (product.userId.toString() !== farmerId.toString()) {
      return NextResponse.json(
        {
          success: false,
          message: "You are not authorized for this order",
        },
        { status: 403 }
      );
    }

    order.cashReceived = true;
    order.paymentStatus = "paid";
    if (order.customerReceived) {
      await order.deleteOne();

      return NextResponse.json({
        success: true,
        deleted: true,
        message: "Cash and product both confirmed. Order removed.",
      });
    }

    await order.save();

    return NextResponse.json({
      success: true,
      deleted: false,
      message: "Cash received. Waiting for customer confirmation.",
    });

  } catch (err) {
    console.error("CASH CONFIRM ERROR:", err);

    return NextResponse.json(
      {
        success: false,
        message: err.message || "Server error",
      },
      { status: 500 }
    );
  }
}