import connectDB from "../../../../lib/mongoose";
import Order from "../../../../models/Order";
import Product from "../../../../models/Product";
import Activity from "../../../../models/Activity";
import User from "../../../../models/User";
import { NextResponse } from "next/server";
import { v4 as uuid } from "uuid";
import jwt from "jsonwebtoken";

export async function GET(req) {
  try {
    await connectDB();
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "authorized" }, { status: 401 })
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET)
    const userId = decode.id || decode._id || decode.userId;
    const order = await Order.find({ userId }).populate("product.productId", "name image price location category description quantity").populate("userId", "firstName lastName mobile email").sort({ createdAt: -1 });
    return NextResponse.json({ success: true, order })
  } catch (err) {
    console.log(err)
    return NextResponse.json({ message: "server error" }, { status: 500 })
  }
}
export async function POST(req) {
  try {
    await connectDB();

    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Not logged in",
        },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const userId = decoded.userId || decoded.id;

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid token",
        },
        { status: 401 }
      );
    }

    const body = await req.json();

    const {
      productId,
      quantity,
      payMethod,
      message,
      khalti_pidx,
      latitude,
      longitude,
      address,
    } = body;

    // Required fields
    if (!productId || !quantity || !payMethod) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required fields",
        },
        { status: 400 }
      );
    }

    // Quantity validation
    const qty = Number(quantity);

    if (!Number.isFinite(qty) || qty <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid quantity",
        },
        { status: 400 }
      );
    }

    // Location validation
    const lat = Number(latitude);
    const lng = Number(longitude);

    if (
      !Number.isFinite(lat) ||
      !Number.isFinite(lng)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Valid delivery location is required",
        },
        { status: 400 }
      );
    }

    const product = await Product.findById(productId);

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          message: "Product not found",
        },
        { status: 404 }
      );
    }


    if (product.quantity < qty) {
      return NextResponse.json(
        {
          success: false,
          message: "Not enough stock",
        },
        { status: 400 }
      );
    }


    const totalAmount = product.price * qty;


    const order = await Order.create({
      userId,
      product: [
        {
          productId: product._id,
          quantity: qty,
          price: product.price,
        },
      ],
      paymentMethod: payMethod,
      totalAmount,
      paymentStatus: "pending",
      orderStatus: "pending",
      transaction_uuid: uuid(),
      message,
      khalti_pidx,
      location: {
        lat,
        lng,
        address,
      },
    });

    // Activity
    await Activity.create({
      userId,
      productId: product._id,
      message: `Purchase ${product.name}`,
      type: "purchase",
    });

    return NextResponse.json({
      success: true,
      orderId: order._id,
      transaction_uuid: order.transaction_uuid,
      totalAmount,
      khalti_pidx,
    });
  } catch (err) {
    console.error("ORDER API ERROR:", err);

    return NextResponse.json(
      {
        success: false,
        message: err.message || "Server error",
      },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    await connectDB();

    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Not logged in",
        },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const userId = decoded.userId || decoded.id;

    const { orderId, action } = await req.json();

    if (!orderId || !action) {
      return NextResponse.json(
        {
          success: false,
          message: "Order ID and action are required",
        },
        { status: 400 }
      );
    }

    const order = await Order.findOne({
      _id: orderId,
      userId,
    });

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          message: "Order not found",
        },
        { status: 404 }
      );
    }

    // CUSTOMER CONFIRMS PRODUCT RECEIVED
    if (action === "customer_received") {
      order.customerReceived = true;
      order.orderStatus = "delivered";

      // Non-cash payment
      if (order.paymentMethod !== "Cash") {
        await order.deleteOne();

        return NextResponse.json({
          success: true,
          deleted: true,
          message: "Order completed and removed",
        });
      }

      // Cash order
      // Don't delete yet because farmer still needs to confirm cash
      if (order.cashReceived) {
        await order.deleteOne();

        return NextResponse.json({
          success: true,
          deleted: true,
          message: "Order completed and removed",
        });
      }

      await order.save();

      return NextResponse.json({
        success: true,
        deleted: false,
        message: "Product received. Waiting for cash confirmation.",
      });
    }

    return NextResponse.json(
      {
        success: false,
        message: "Invalid action",
      },
      { status: 400 }
    );

  } catch (err) {
    console.error("ORDER UPDATE ERROR:", err);

    return NextResponse.json(
      {
        success: false,
        message: err.message || "Server error",
      },
      { status: 500 }
    );
  }
}