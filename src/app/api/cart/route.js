import connectDB from "../../../../lib/mongoose.js";

import Cart from "../../../../models/Cart.js";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
export async function GET(req) {
  try {
    await connectDB();
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decode.userId || decode.id || decode._id;

    const carts = await Cart.find({ user: userId }).populate("product");
    return NextResponse.json({ carts });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "error" }, { status: 500 });
  }
}
export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { productId } = body;
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decode.userId || decode.id || decode._id;
    const existingCart = await Cart.findOne({
      user: userId,
      product: productId,
    });
    if (existingCart) {
      existingCart.quantity += 1;
      await existingCart.save();
      return NextResponse.json({
        message: "Quantity updated",
        success: true
      });
    }
    await Cart.create({
      user: userId,
      product: productId,
      quantity: 1,
    });

    return NextResponse.json({ message: "added to cart", success:true, existingCart });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "error" }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    connectDB();
    const { searchParams } = new URL(req.url);
    const cartId = searchParams.get("id");
    
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decode.userId || decode.id || decode._id;
    await Cart.findOneAndDelete({
      _id: cartId,
      user: userId,
    });
    return NextResponse.json({ message: "successfully Removed" });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "error" }, { status: 500 });
  }
}
