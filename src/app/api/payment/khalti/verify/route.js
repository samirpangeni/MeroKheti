import connectDB from "../../../../../../lib/mongoose";
import Order from "../../../../../../models/Order";
import { NextResponse } from "next/server";
export async function POST(req) {
  try {
    await connectDB();
    const { pidx } = await re.json();
    const response = await fetch(
      "https://dev.khalti.com/api/v2/epayment/lookup/",
      {
        method: "POST",
        headers: {
          Authorization: `key ${process.env.KHALTI_SECRET_KEY}`,
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          pidx,
        }),
      },
    );
    const data = await response.json();
    if (data.status === "Completed") {
      await Order.findOneAndUpdate(data.purchase_order_id, {
        paymentStatus: "paid",
        orderStatus: "processing",
        transactionId: pidx,
      });
    }
    return NextResponse.json(data);
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "server error" }, { status: 500 });
  }
}
