import connectDB from "../../../../lib/mongoose";
import { NextResponse } from "next/server";
import Activity from "../../../../models/Activity";
import User from "../../../../models/User";
import jwt from "jsonwebtoken";
export async function GET(req) {
  try {
    await connectDB();
    const token = req.cookies.get("token")?.value
    if (!token) {
      return NextResponse.json({ message: "unathourized" }, { status: 401 })
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET)
    const userId = decode.id || decode.userId || decode._id
    const activite = await Activity.find({ userId }).populate("userId").sort({ createdAt: -1 })
    const activity = await Activity.find().sort({ createdAt: -1 }).limit(10);
    return NextResponse.json({ activity, activite });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const token = req.cookies.get("token")?.value
    if (!token) {
      return NextResponse.json({ message: "unathorized" }, { status: 401 })
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET)
    const userId = decode.id || decode.userId || decode._id
    const body = await req.json();
    const { message, type } = body;
    const newActivity = await Activity.create({
      userId,
      message,
      type,
    });
    return NextResponse.json({
      message: "Activity created",
      activity: newActivity,
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "error" }, { status: 500 });
  }
}
