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
    const carts = await Cart.find({ userId: userId }).populate("productId", "price name location image quantity");
    return NextResponse.json({ carts, success: true });
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
      userId: userId,
      productId: productId,
    });
    if (existingCart) {
      return NextResponse.json(
        {
          success: false,
          message: "This product is already in your cart.",
        },
        { status: 409 }
      );
    }
    await Cart.create({
      userId: userId,
      productId: productId,
      quantity: 1,
    });

    return NextResponse.json({ message: "added to cart", success: true, existingCart });
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
   const deleteCard = await Cart.findOneAndDelete({
      _id: cartId,
      userId: userId,
    });
    console.log(deleteCard)
    return NextResponse.json({ message: "successfully Removed", success:true});
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "error" }, { status: 500 });
  }
}
