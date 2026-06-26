import connectDB from "../../../../lib/mongoose";
import cloudinary from "../../../../lib/cloudinary";
import Product from "../../../../models/Product";
import cron from "node-cron";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Activity from "../../../../models/Activity";
import Review from "../../../../models/Review";
import Report from "../../../../models/Report";
import User from "../../../../models/User";
import Order from "../../../../models/Order";
export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const category = searchParams.get("category");
    const organic = searchParams.get("organic");

    let filter = {};

    if (status) {
      filter.status = status;
    }
    if (category && category !== "All Categories") {
      filter.category = category;
    }
    if (organic === "true") filter.organic = true;
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

    const product = await Product.find(filter)
      .populate("userId", "firstName lastName")
      .sort({ createdAt: -1 });

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
    const user = await User.findById(userId);

    const formData = await req.formData();

    const name = formData.get("name");
    const price = formData.get("price");
    const description = formData.get("description");
    const expiryDate = formData.get("expiryDate");
    const unit = formData.get("unit");
    const quantity = formData.get("quantity");
    const location = formData.get("location");
    const category = formData.get("category");
    const longitude = formData.get("longitude");
    const latitude = formData.get("latitude");
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
      farmerLocation: {
        lat: latitude,
        lng: longitude,
      }
    });
    await Activity.create({
      message: `${userId.firstName} added a new product`,
      productId: product._id,
      type: "product",
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

export async function DELETE(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "Product ID is required" },
        { status: 400 }
      );
    }

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    await Promise.all([
      Review.deleteMany({ productId: id }),
      Report.deleteMany({ productId: id }),
      Order.deleteMany({ productId: id }), // Change this if productId is nested
      Activity.deleteMany({ productId: id }), // Optional
    ]);

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

cron.schedule("0 0 * * *", async () => {
  try {
    await connectDB();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await Product.deleteMany({
      harvestDate: { $lte: today },
    });

    console.log("Expired products deleted");
  } catch (err) {
    console.log(err);
  }
});
