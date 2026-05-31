import connectDB from "../../../../lib/mongoose";
import Product from "../../../../models/Product";
import Review from "../../../../models/Review";
import User from "../../../../models/User";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();

    const farmers = await User.find({ role: "farmer" });

    const ranking = await Promise.all(
      farmers.map(async (farmer) => {
        const products = await Product.find({ userId: farmer._id });

        const productIds = products.map((p) => p._id);

        const reviews = await Review.find({
          productId: { $in: productIds },
        });

        const totalRating = reviews.reduce(
          (sum, r) => sum + Number(r.rating || 0),
          0
        );

        const averageRating =
          reviews.length > 0 ? totalRating / reviews.length : 0;

        return {
          farmerId: farmer._id,
          name: `${farmer.firstName} ${farmer.lastName}`,
          averageRating: Number(averageRating.toFixed(1)),
          totalProducts: products.length,
          totalReviews: reviews.length,
        };
      })
    );

    ranking.sort(
      (a, b) =>
        b.averageRating - a.averageRating ||
        b.totalProducts - a.totalProducts
    );

    return NextResponse.json({
      success: true,
      ranking,
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { message: "server error" },
      { status: 500 }
    );
  }
}