import connectDB from "../../../../../lib/mongoose";
import Product from "../../../../../models/Product";
import Order from "../../../../../models/Order";
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
            process.env.JWT_SECRET);
        const userId = decoded.userId

        const { searchParams } = new URL(req.url);
        const category = searchParams.get("category");
        const search = searchParams.get("search");
        let filter = {
            userId,
            status: "approved"
        };

        if (
            category &&
            category !== "All categories"
        ) {
            filter.category = {
                $regex: category,
                $options: "i",
            };
        }
        if (search) {
            filter.name = {
                $regex: search,
                $options: "i",
            };
        }
        const order = await Order.find({ userId }).sort({ createdAt: -1 }).lean();
        const products = await Product.find(filter).sort({ createdAt: -1 }).lean();
        return NextResponse.json(
            { products, order },
            { status: 200 }
        );
    } catch (err) {
        console.log(err)
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}