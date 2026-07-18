import connectDB from "../../../../../lib/mongoose.js";
import User from "../../../../../models/User";
import { NextResponse } from "next/server";
import Activity from "../../../../../models/Activity.js";
import Product from "../../../../../models/Product.js";
import Report from "../../../../../models/Report.js";
import Order from "../../../../../models/Order.js";

export async function GET(req) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const role = searchParams.get("role");

        let filter = {
            role: {
                $ne: "admin",
            },
        };
        if (role && role !== "All") {
            filter.role = role;
        }
        const user = await User.find(filter)
        return NextResponse.json({
            message: "all user",
            user
        });
    } catch (err) {
        console.log(err)
        return NextResponse.json({ message: "error" }, { status: 500 });
    }
}
export async function DELETE(req) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("id");
        if (!userId) {
            return NextResponse.json(
                {
                    message: "User ID required",
                },
                { status: 400 },
            );
        }
        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }
        await Promise.all([
            Product.deleteMany({ userId }),
            Order.deleteMany({ userId }),
            Review.deleteMany({ userId }),
            Report.deleteMany({ userId }),
            Cart.deleteMany({ userId }),
            Activity.deleteMany({ userId }),
        ]);
        await Activity.create({
            message: `User ${user.email} was deleted`,
            type: "delete",
        });

        return NextResponse.json({
            success: true,
            message: "User deleted successfully",
        });
    }
    catch (err) {
        console.log(err);
        return NextResponse.json({ message: "error" }, { status: 500 });
    }
}
export async function PUT(req) {
    try {
        await connectDB();
        const {searchParams} = new URL(req.url);
        const id = searchParams.get("id");
        const user = await User.findByIdAndUpdate(id, {
            suspended: false,
            suspendedReason: "",
            suspendedUntil: null,
        },
            { new: true }
        );
        return NextResponse.json({
            message: "User unsuspended successfully",
            user
        });
    } catch (err) {
        console.log(err);
        return NextResponse.json({ message: "error" }, { status: 500 });
    }
}
export async function PATCH(req) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        const { reason, days = 7 } = await req.json();
        const suspendedUntil = new Date();
        suspendedUntil.setDate(suspendedUntil.getDate() + Number(days));
        if (!reason || !days) {
            return NextResponse.json(
                { message: "No reason and days provided" },
                { status: 400 }
            );
        }
        const user = await User.findByIdAndUpdate(
            id,
            {
                suspended: true,
                suspendedReason: reason,
                suspendedUntil,
            },
            { new: true }
        );
        return NextResponse.json(user);
    } catch (err) {
        console.log(err)
        return NextResponse.json({ message: "error" }, { status: 500 })
    }
}