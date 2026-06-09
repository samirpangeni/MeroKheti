import connectDB from "../../../../../../lib/mongoose";
import { NextResponse } from "next/server";
import Order from "../../../../../../models/Order";
import Product from "../../../../../../models/Product";

export async function POST(req) {
  try {
    await connectDB();

    const {
      total_amount,
      transaction_uuid,
      product_code,
    } = await req.json();

    // 1. VERIFY PAYMENT WITH ESEWA
    const response = await fetch(
      `https://rc.esewa.com.np/api/epay/transaction/status/?product_code=${product_code}&total_amount=${total_amount}&transaction_uuid=${transaction_uuid}`
    );

    const result = await response.json();

    // 2. CHECK PAYMENT STATUS
    if (!["COMPLETE", "SUCCESS"].includes(result.status)) {
      return NextResponse.json({
        success: false,
        message: "Payment not completed",
        result,
      });
    }

    // 3. FIND ORDER
    const order = await Order.findOne({ transaction_uuid });

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    // 4. PREVENT DOUBLE PROCESSING
    if (order.paymentStatus === "paid") {
      return NextResponse.json({
        success: true,
        message: "Already processed",
        order,
      });
    }

    // 5. UPDATE ORDER STATUS
    order.paymentStatus = "paid";
    order.orderStatus = "confirmed";
    await order.save();

    // 6. UPDATE STOCK (FROM ORDER, NOT REQUEST)
    for (const item of order.product) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { quantity: -item.quantity },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Payment verified & order confirmed",
      order,
      result
    });

  } catch (err) {
    console.log("VERIFY ERROR:", err);
    return NextResponse.json(
      { success: false, message: "server error" },
      { status: 500 }
    );
  }
}