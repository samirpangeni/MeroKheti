import connectDB from "../../../../lib/mongoose.js";
import User from "../../../../models/User";
import { NextResponse } from "next/server";
import Activity from "../../../../models/Activity.js";
import Product from "../../../../models/Product.js";
import Report from "../../../../models/Report.js";
import Review from "../../../../models/Review.js";
import Order from "../../../../models/Order.js";
import Cart from "../../../../models/Cart.js"
export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    const filter = {};

    if (status && status !== "All") {
      filter.status = status;
    }

    const product = await Product.find(filter)
      .populate("userId")
      .sort({ createdAt: -1 });

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

    const order = await Order.find()
      .populate("userId", "firstName lastName mobile email")
      .populate({
        path: "product.productId",
        populate: {
          path: "userId",
        },
      });
    return NextResponse.json({
      message: "all user",
      report,
      order,
      product,
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
    const productId = searchParams.get("id");
    console.log(productId);
    if (!productId) {
      return NextResponse.json(
        {
          success: false,
          message: "Product ID is required",
        },
        {
          status: 400,
        },
      );
    }

    const product = await Product.findById(productId);

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          message: "Product not found",
        },
        {
          status: 404,
        },
      );
    }

    // Delete Product
    await Product.findByIdAndDelete(productId);

    // Delete everything related to this product
    await Promise.all([
      // Orders
      Order.deleteMany({
        "product.productId": productId,
      }),

      // Reviews
      Review.deleteMany({
        productId,
      }),

      // Reports
      Report.deleteMany({
        productId,
      }),

      // Activities
      Activity.deleteMany({
        productId,
      }),

      // Remove product from every cart
      Cart.updateMany(
        {},
        {
          $pull: {
            products: {
              productId,
            },
          },
        },
      ),
    ]);

    // Optional: create admin activity log
    await Activity.create({
      type: "delete",
      productId,
      message: `Product "${product.name}" was deleted by admin.`,
    });

    return NextResponse.json({
      success: true,
      message: "Product and all related data deleted successfully.",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      {
        status: 500,
      },
    );
  }
}

export async function PUT(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { status, selectionId } = body;
    const updateProduct = await Product.findByIdAndUpdate(
      selectionId,
      { status },
      { new: true },
    );
    if (!selectionId || !status) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }
    await Activity.create({
      message: `Admin ${status} ${updateProduct.name}`,
      productId: updateProduct,
      type: "approved",
    });
    const searchParams = new URL(req.url);
    const id = searchParams.get("id");
    const user = await User.findByIdAndUpdate(
      id,
      {
        suspended: false,
        suspendedReason: "",
        suspendedUntil: null,
      },
      { new: true },
    );
    return NextResponse.json({
      message: "updated successfully",
      updateProduct,
      user,
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
        { status: 400 },
      );
    }
    const user = await User.findByIdAndUpdate(
      id,
      {
        suspended: true,
        suspendedReason: reason,
        suspendedUntil,
      },
      { new: true },
    );
    return NextResponse.json(user);
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "error" }, { status: 500 });
  }
}
