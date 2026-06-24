import { NextResponse } from "next/server";
import connectDB from "../../../../lib/mongoose";
import Report from "../../../../models/Report";
import Activity from "../../../../models/Activity"
import jwt from "jsonwebtoken";
import User from "../../../../models/User"
import Product from "../../../../models/Product"
export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");
    // if (!productId) {
    //   return NextResponse.json(
    //     { message: "product id required" },
    //     { status: 400 },
    //   );
    // }
    const token = req.cookies.get("token")?.value
    if (!token) {
      return NextResponse.json({ message: "unathorized" }, { status: 401 })
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET)
    const userId = decode.id || decode.userId || decode._id
    const reports = await Report.find({ userId })
    const report = await Report.find({ productId }).populate(
      "userId",
      "firstName lastName",
    );
    return NextResponse.json({
      // report,
      reports,
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        {
          message: "Unauthorized",
        },
        { status: 401 },
      );
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decode.id || decode.userId || decode._id;
    const body = await req.json();
    const { report, productId, reportType} = body;
    const newReports = await Report.create({
      userId,
      productId,
      report,
      reportType,
    });
    const product = await Product.findById(productId).populate("userId", "firstName lastName")
    const user = await User.findById(userId);

    await Activity.create({
      userId,
      productId: product,
      message: `you report the product ${product?.userId.firstName} ${product?.userId.lastName}`,
      type: "Report"
    })
    return NextResponse.json({ message: "report successfully", newReports });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "error" }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    await connectDB();
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "error" }, { status: 500 });
  }
}
