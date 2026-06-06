import connectDB from "../../../../lib/mongoose";
import Order from "../../../../models/Order";
import Product from "../../../../models/Product";
import User from "../../../../models/User";
import { NextResponse } from "next/server";
import { v4 as uuid } from "uuid";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    await connectDB();

    // 1. GET TOKEN
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Not logged in" },
        { status: 401 }
      );
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const userId = decoded.userId || decoded.id;
    if (!userId) {
      return NextResponse.json(
        { message: "Invalid token" },
        { status: 401 }
      );
    }
    
    const { productId, quantity, payMethod } = await req.json();
    if (!productId || !quantity || !payMethod) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }
    const qty = Number(quantity);
    // 4. GET PRODUCT
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }
    // 5. CHECK STOCK
    if (product.quantity < qty) {
      return NextResponse.json(
        { success: false, message: "Not enough stock" },
        { status: 400 }
      );
    }

    // 6. CREATE ORDER
    const transaction_uuid = uuid();
    const totalAmount = product.price * qty;

    const order = await Order.create({
      transaction_uuid,
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
    });

    return NextResponse.json({
      success: true,
      order,
    });

  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { success: false, message: "server error" },
      { status: 500 }
    );
  }
}