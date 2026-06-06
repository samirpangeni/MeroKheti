import connectDB from "../../../../lib/mongoose.js";
import User from "../../../../models/User";
import { NextResponse } from "next/server";
import Activity from "../../../../models/Activity.js";
import Product from "../../../../models/Product.js";
import Report from "../../../../models/Report.js";
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
    const user = await User.find(filter).select("-password");
    const report = await Report.find()
      .populate("userId", "firstName lastName")
      .populate({
        path: "productId",
        select: "name userId",
        populate: {
          path: "userId",
          select: "firstName lastName",
        },
      });
    return NextResponse.json({
      message: "all user",
      user,
      report,
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

export async function PUT(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { status, id } = body;
    const updateProduct = await Product.findByIdAndUpdate(
      id,
      { status },
      { new: true },
    );
    if (!id || !status) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }
    await Activity.create({
      message: `Admin ${status} ${updateProduct.name}`,
      type: "approved",
    });
    return NextResponse.json({
      message: "updated successfully",
      updateProduct,
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "error" }, { status: 500 });
  }
}
