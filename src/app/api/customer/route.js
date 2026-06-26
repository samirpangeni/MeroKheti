import ConnectDB from '../../../../lib/mongoose'
import { NextResponse } from 'next/server'
import User from "../../../../models/User"
import Activity from "../../../../models/Activity"
import Product from "../../../../models/Product"
import Review from "../../../../models/Review"
import Cart from "../../../../models/Cart"
import Order from "../../../../models/Order"
import jwt from 'jsonwebtoken'

export async function GET(req) {
    try {
        await ConnectDB();
        const token = req.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch {
            return NextResponse.json(
                { message: "Invalid or expired token" },
                { status: 401 }
            );
        }
        const userId = decoded.id || decoded._id || decoded.userId;
        const [cart, order, review, activity] = await Promise.all([
            Cart.find({ userId }).lean(),
            Order.find({ userId }).lean(),
            Review.find({ userId }).lean(),
            Activity.find({ userId })
                .populate({
                    path: "productId",
                    select: "name userId quantity price",
                    populate: {
                        path: "userId",
                        select: "firstName lastName",
                    },
                })
                .lean(),
        ]);
        return NextResponse.json({
            success: true,
            activity,
            cart,
            order,
            review,
        });
    } catch (err) {
        console.error(err);

        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}