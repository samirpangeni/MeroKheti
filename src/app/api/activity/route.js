import connectDB from "../../../../lib/mongoose";
import { NextResponse } from "next/server";
import Activity from "../../../../models/Activity";

export async function GET(req) {
  try {
    await connectDB();
    const activity = await Activity.find().sort({ createdAt: -1 }).limit(10);
    return NextResponse.json({ activity });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { message, type } = body;
    const newActivity = await Activity.create({
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
