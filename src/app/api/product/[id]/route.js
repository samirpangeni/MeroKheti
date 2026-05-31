import connectDB from "../../../../../lib/mongoose";
import Product from "../../../../../models/Product";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req, { params }) {
  try {
    await connectDB();

    const { id } =await params;

    const product = await Product.findById(id).populate(
      "userId",
      "firstName lastName",
    );

    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ product });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
