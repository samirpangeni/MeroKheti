import connectDB from "../../../../lib/mongoose";
import Product from "../../../../models/Product";
import Review from "../../../../models/Review";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "../../../../models/User";
import Order from "../../../../models/Order";

export async function GET(req) {
  try {
    await connectDB();
    // 1. Get token
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    // 2. Decode user
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const farmer = await User.findById(decoded.userId);
    if (!farmer || farmer.role !== "farmer") {
      return NextResponse.json({ message: "Not a farmer" }, { status: 403 });
    }
    // 3. Get products
    const products = await Product.find({ userId: farmer._id });
    const totalProducts = products.length;
    const approvedProducts = products.filter(
      (p) => p.status === "approved",
    ).length;

    const pendingProducts = products.filter(
      (p) => p.status === "pending",
    ).length;

    const rejectedProducts = products.filter(
      (p) => p.status === "rejected",
    ).length;

    // 4. Reviews + rating
    const productIds = products.map((p) => p._id);

    const reviews = await Review.find({
      productId: { $in: productIds },
    });

    const totalRating = reviews.reduce(
      (sum, r) => sum + Number(r.rating || 0),
      0,
    );

    const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;

    const order = await Order.find()
      .populate("userId", "firstName lastName email")
      .populate("product.productId", "name image price")
      .sort({ createAt: -1 });

    // 5. Response
    return NextResponse.json({
      success: true,
      dashboard: {
        totalProducts,
        approvedProducts,
        pendingProducts,
        rejectedProducts,
        totalReviews: reviews.length,
        averageRating: Number(averageRating.toFixed(1)),
      },
      order,
    });
  } catch (err) {
    console.log(err);

    return NextResponse.json({ message: "server error" }, { status: 500 });
  }
}
