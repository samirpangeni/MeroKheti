import { NextResponse } from "next/server";
import connectDB from "../../../../../lib/mongoose";
import jwt from "jsonwebtoken";
import Review from "../../../../../models/Review";
import Product from "../../../../../models/Product";


export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 400 });
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decode.userId || decode.id || decode._id;
    
    let review;
    if (productId) {
      review = await Review.findOne({ userId, productId }).populate(
        "productId",
        "name title price",
      );
    } else {
      review = await Review.find({ userId }).populate(
        "productId",
        "name title price",
      );
    }
    return NextResponse.json({ review });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "error" }, { status: 500 });
  }
}
