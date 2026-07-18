import cron from "node-cron";
import connectDB from "./mongoose";
import Order from "../models/Order";
import Product from "../models/Product";
import User from "../models/User";

cron.schedule("*/1 * * * *", async () => {
  try {
     await connectDB();
    await User.updateMany(
      {
        suspended: true,
        suspendedUntil: { $lte: new Date() },
      },
      {
        $set: { 
          suspended: false,
          suspendedReason: "",
          suspendedUntil: null,
        },
      }
    );
   

    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

    const expiredOrders = await Order.find({
      paymentStatus: "pending",
      paymentMethod: { $in: ["khalti", "esewa"] },
      createdAt: { $lte: fiveMinutesAgo },
    });

    for (const order of expiredOrders) {
      // restore stock
      for (const item of order.product) {
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { quantity: item.quantity },
        });
      }

      // update order
      order.paymentStatus = "failed";
      order.orderStatus = "cancelled";

      await order.save();
    }
  } catch (err) {
    console.log("Cron error:", err);
  }
});