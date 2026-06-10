import connectDB from "../../../../../../lib/mongoose";
import Order from "../../../../../../models/Order";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDB();

    const { pidx } = await req.json();
    const response = await fetch(
      "https://dev.khalti.com/api/v2/epayment/lookup/",
      {
        method: "POST",
        headers: {
          Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pidx }),
      },
    );

    const data = await response.json();

    if (data.status === "Completed") {
      const order = await Order.findOneAndUpdate(
        { khalti_pidx: pidx },
        {
          paymentStatus: "paid",
          orderStatus: "completed",
          transactionId: data.transaction_id,
        },
        {
          returnDocument: "after",
        },
      );
      return NextResponse.json({
        success: true,
        order,
        data
      });
    }

    return NextResponse.json({
      success: false,
      status: data.status,
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "server error" }, { status: 500 });
  }
}
