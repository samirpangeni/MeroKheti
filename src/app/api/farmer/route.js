import connectDB from "../../../../lib/mongoose";
import Product from "../../../../models/Product";
import Review from "../../../../models/Review";
import Order from "../../../../models/Order";
import User from "../../../../models/User";
import Activity from "../../../../models/Activity";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req) {
  try {
    await connectDB();
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );
    const farmer = await User.findById(decoded.userId);
    if (!farmer || farmer.role !== "farmer") {
      return NextResponse.json(
        { message: "Not a farmer" },
        { status: 403 }
      );
    }

    // Farmer products
    const products = await Product.find({
      userId: farmer._id,
    });

    const productIds = products.map((p) => p._id);

    // Total products
    const totalProducts = products.length;
    const approvedProducts = products.filter((p) => p.status === "approved").length;
    const pendingProducts = products.filter((p) => p.status === "pending").length;
    const rejectProducts = products.filter((p) => p.status === "rejected").length;
    const productId = { productId: { $in: productIds } }

    // Reviews
    const reviews = await Review.find({
      productId: { $in: productIds },
    });

    const totalReviews = reviews.length;

    const totalRating = reviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );

    const averageRating =
      totalReviews > 0
        ? Number((totalRating / totalReviews).toFixed(1))
        : 0;

    // Orders
    const orders = await Order.find({
      "product.productId": { $in: productIds },
      paymentStatus: "paid",
    });

    let totalSold = 0;

    orders.forEach((order) => {
      order.product.forEach((item) => {
        if (
          productIds.some(
            (id) =>
              id.toString() ===
              item.productId.toString()
          )
        ) {
          totalSold += item.quantity;
        }
      });
    });
    const order = await Order.find().populate("userId", "firstName lastName email").populate("product.productId", "name image price farmerLocation").sort({ createAt: -1 });
    return NextResponse.json({
      success: true,
      dashboard: {
        totalProducts,
        totalReviews,
        approvedProducts,
        rejectProducts,
        pendingProducts,
        averageRating,
        totalSold,
      },
      order,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { message: "Server Error" },
      { status: 500 }
    );
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
      Order.deleteMany({
        "product.productId": id,
      }),

      Review.deleteMany({
        productId: id,
      }),

      Report.deleteMany({
        productId: id,
      }),

      Activity.deleteMany({
        productId: id,
      }),

      Cart.updateMany(
        {},
        {
          $pull: {
            products: { productId: id },
          },
        }
      ),
    ]);

    await Activity.create({
      userId: product.userId,
      message: `Product "${product.name}" was deleted`,
      type: "delete",
    });

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