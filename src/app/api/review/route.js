import jwt from "jsonwebtoken";
import connectDB from "../../../../lib/mongoose";
import Review from "../../../../models/Review";
import User from "../../../../models/User";
import "../../../../models/User";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json(
        { message: "product id required" },
        { status: 400 },
      );
    }
    const review = await Review.find({ productId}).populate(
      "userId",
      "firstName lastName",
    );
   
    return NextResponse.json({ review });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();

    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET);

    const userId = decode.userId || decode.id || decode._id;

    const body = await req.json();
    const { productId, rating, review } = body;

    const newReview = await Review.create({
      userId,
      productId,
      rating,
      review,
    });

    return NextResponse.json(newReview);
  } catch (err) {
    console.log(err);

    return NextResponse.json({ message: "you have an error" }, { status: 500 });
  }
}
