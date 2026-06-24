import connectDB from "../../../../../lib/mongoose";
import Product from "../../../../../models/Product";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Success from "@/components/Success";

export async function GET(req, { params }) {
  try {
    await connectDB();

    const { id } = await params;

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

export async function PUT(req, {params}) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await req.json()
    const UpdataProduct = await Product.findByIdAndUpdate(id,
      body,
      { new: true }
    )
    if (!UpdataProduct) {
      return NextResponse.json({ message: "product not found" }, { status: 404 })
    }
    await UpdataProduct.save();
    return NextResponse.json({ Success: true, product: UpdataProduct })
  } catch (err) {
    console.log(err)
    return NextResponse.json({ message: "server error" }, { status: 500 })
  }
}