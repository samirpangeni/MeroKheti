import jwt from "jsonwebtoken";
import connectDB from "../../../../lib/mongoose";
import Review from "../../../../models/Review";
import User from "../../../../models/User";
import { NextResponse } from "next/server";
import Activity from "../../../../models/Activity";
import Product from "../../../../models/Product"

export async function GET(req) {
  try {
    await connectDB()
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");
    const token = req.cookies.get("token")?.value
    if (!token) {
      return NextResponse.json({ message: "unathorized" }, { status: 401 })
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const userId = decoded._id
    const review = await Review.find({ productId }).populate("userId", "firstName lastName")
    return NextResponse.json({ success: true, review })
  }
  catch (err) {
    console.log(err)
    return NextResponse.json({ message: "server error" }, { status: 500 })
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
    const product = await Product.findById(productId).populate("userId", "firstName lastName")
    await Activity.create({
      userId,
      productId,
      message: `Review to farmer ${product.userId.firstName} ${product.userId.lastName}`,
      type: "Review"
    })
    return NextResponse.json(newReview);
  } catch (err) {
    console.log(err);

    return NextResponse.json({ message: "you have an error" }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")
    if (!id) {
      return NextResponse.json(
        { message: "Review ID is required" },
        { status: 400 }
      );
    }
    await Review.findByIdAndDelete(id)
    return NextResponse.json({ message: "review delete successfully" });

  } catch (err) {
    console.log(err)
    return NextResponse.json({ message: "server error" }, { status: 500 })
  }
}