import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    khalti_pidx: {
      type: String,
    },
    transaction_uuid: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        price: Number,
        quantity: Number,
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    message: {
      type: String,
    },
    locaiton:{
      lat: Number,
      lng: Number,
    },
    paymentMethod: {
      type: String,
      enum: ["khalti", "esewa", "Cash"],
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },

    orderStatus: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.Order || mongoose.model("Order", orderSchema);
