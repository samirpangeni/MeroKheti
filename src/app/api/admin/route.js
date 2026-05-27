import connectDB from "../../../../lib/mongoose.js";
import User from "../../../../models/User";
import { NextResponse } from "next/server";
import Activity from "../../../../models/Activity.js"
export async function GET(req) {
  try {
    await connectDB();
    const user = await User.find().select("-password");
    return NextResponse.json({
      message: "all user",
      user,
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "error" }, { status: 500 });
  }
}
export async function DELETE(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        {
          message: "User ID required",
        },
        { status: 400 },
      );
    }
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return NextResponse.json(
        {
          message: "User Not found",
        },
        { status: 404 },
      );
    }
    await Activity.create({
      message: `User ${user.email} was delete`,
      type: "delete",
    });
    return NextResponse.json({ message: "user deleted successfully" });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "error" }, { status: 500 });
  }
}
