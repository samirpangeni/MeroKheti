import mongoose from "mongoose";
const activitySChema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);
export default mongoose.models.Activity ||
  mongoose.model("Activity", activitySChema);
