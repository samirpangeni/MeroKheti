import mongoose from "mongoose"

const orderReportSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true,
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        require: true,
    },
    orderId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        require: true,
    },
    reason:{
        type: String,
        require: true,
    },
},
{timestamps: true},)
export default mongoose.models.OrderReport || mongoose.model("OrderReport", orderReportSchema)