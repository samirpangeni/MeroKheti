import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      require: true,
    },
    report: {
      type: String,
      require: true,
    },
    reportType:{
      type: String,
      required: true
    }
  },
  { timestamps: true },
);
export default mongoose.models.Report || mongoose.model("Report", reportSchema);
