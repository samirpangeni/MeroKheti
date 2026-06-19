// import cron from "node-cron"
// import connectDB from "./mongoose"
// import Order from "../models/Order"

// cron.schedule("*/5 * * * *", async () => {
//     try {
//         console.log("checking pending order .....")
//         await connectDB();
//         const tenMinuteAgo = new Date(Date.now() - 10 * 60 * 1000);
//         await Order.updateMany({
//             paymentStatus: "pending",
//             createdAt: { $lte: tenMinuteAgo }
//         },
//             {
//                 paymentStatus: "failed",
//                 orderStatus: "cancelled"
//             })
//         console.log("old pending orders updated");
//     } catch (err) {
//         console.log(err)
//     }
// })