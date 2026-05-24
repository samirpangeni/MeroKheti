import connectDB from "../../../../lib/mongoose";
import cloudinary from "../../../../lib/cloudinary";
import Product from "../../../../models/Product";
import User from "../../../../models/User";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");

    let filter = {
      status: "approved"
    };

    if (search) {
      filter = {
        
        $or: [
          { name: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
          { category: { $regex: search, $options: "i" } },
          { location: { $regex: search, $options: "i" } },
        ],
        
      };
    }

    const product = await Product.find(filter).populate(
      "userId",
      "firstName lastName",
    );

    return NextResponse.json({
      message: "success",
      product,
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { message: "sorry bro your code have error" },
      { status: 500 },
    );
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

    const formData = await req.formData();

    const name = formData.get("name");
    const price = formData.get("price");
    const description = formData.get("description");
    const expiryDate = formData.get("expiryDate");
    const unit = formData.get("unit");
    const quantity = formData.get("quantity");
    const location = formData.get("location");
    const category = formData.get("category");
    const harvestDate = formData.get("harvestDate");
    const organic = formData.get("organic") === "true"; // Convert to boolean

    const files = formData.getAll("files"); // multiple images

    if (!files || files.length === 0) {
      return NextResponse.json(
        { message: "No files uploaded" },
        { status: 400 },
      );
    }

    const uploadedImages = [];

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadRes = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "products" }, (err, result) => {
            if (err) reject(err);
            else resolve(result);
          })
          .end(buffer);
      });

      uploadedImages.push({
        url: uploadRes.secure_url,
        public_id: uploadRes.public_id,
      });
    }

    const product = await Product.create({
      userId,
      name,
      price,
      description,
      expiryDate,
      unit,
      quantity,
      location,
      category,
      harvestDate,
      organic,
      image: uploadedImages,
    });

    return NextResponse.json({
      message: "Product added",
      product,
    });
  } catch (err) {
    console.log("ERROR:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
