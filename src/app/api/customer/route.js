import ConnectDb from '../../../../lib/mongoose'
import { NextResponse } from 'next/server'
import User from "../../../../models/User"
import Activity from "../../../../models/Activity"
import jwt from 'jsonwebtoken'

export async function GET(req) {
    try {
        const token = req.cookies.get("token")?.value
        if (!token) {
            return NextResponse.json({ messaege: "unathorized" }, { status: 401 })
        }
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );
        const userId = decoded.id || decoded._id || decoded.userId
        const activity = await Activity.find({ userId }).populate({
            path: "productId",
            select: "name userId",
            populate: {
                path: "userId",
                select: "firstName, lastName"
            }
        })
        console.log(activity)
        return NextResponse.json({ success: true, activity })
    } catch (err) {
        console.log(err)
        NextResponse.json({ message: "error" }, { status: 500 })
    }
}