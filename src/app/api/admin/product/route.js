import connectDB from "../../../../../lib/mongoose";
import Product from "../../../../../models/Product";
import Review from "../../../../../models/Review";
import Report from "../../../../../models/Report";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await connectDB();

        // 1. Get products
        const products = await Product.find()
            .populate("userId", "firstName lastName")
            .sort({ createdAt: -1 });

        // 2. Get all reviews + reports
        const reviews = await Review.find();
        const reports = await Report.find();

        // 3. Create maps
        const reviewMap = {};
        const reportMap = {};

        // 4. Process reviews
        reviews.forEach((r) => {
            const id = r.productId.toString();

            if (!reviewMap[id]) {
                reviewMap[id] = { total: 0, count: 0 };
            }

            reviewMap[id].total += r.rating || 0;
            reviewMap[id].count += 1;
        });

        // 5. Process reports
        reports.forEach((r) => {
            const id = r.productId.toString();

            reportMap[id] = (reportMap[id] || 0) + 1;
        });

        // 6. Merge everything into products
        const finalProducts = products.map((p) => {
            const id = p._id.toString();

            const reviewData = reviewMap[id];

            const totalReview = reviewData?.count || 0;

            const averageRating =
                totalReview > 0
                    ? Number((reviewData.total / totalReview).toFixed(1))
                    : 0;

            return {
                ...p.toObject(),
                totalReview,
                averageRating,
                totalReport: reportMap[id] || 0,
            };
        });
        
        return NextResponse.json({
            success: true,
            products: finalProducts,
        });
    } catch (err) {
        console.log(err);
        return NextResponse.json(
            { success: false, message: "Server error" },
            { status: 500 },
        );
    }
}