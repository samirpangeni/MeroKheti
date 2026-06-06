import mongoose from "mongoose";
const activitySchema = new mongoose.Schema(
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
activitySchema.index(
  { createdAt: 1 },
  {
    expireAfterSeconds: 60 * 60 * 24,
  },
);
export default mongoose.models.Activity ||
  mongoose.model("Activity", activitySchema);
