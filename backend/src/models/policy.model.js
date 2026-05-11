import mongoose from "mongoose";

const policySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Policy name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Policy description is required"],
    },
    coverageAmount: {
      type: Number,
      required: [true, "Coverage amount is required"],
      min: [0, "Coverage amount must be positive"],
    },
    premium: {
      type: Number,
      required: [true, "Premium is required"],
      min: [0, "Premium must be positive"],
    },
    policyType: {
      type: String,
      enum: {
        values: ["livestock", "crop", "weather"],
        message: "Policy type must be livestock, crop, or weather",
      },
      required: [true, "Policy type is required"],
    },
    applicableRegions: {
      type: [String],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    insuranceCompanyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Insurance company is required"],
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
policySchema.index({ policyType: 1, isActive: 1 });
policySchema.index({ applicableRegions: 1 });

const Policy = mongoose.model("Policy", policySchema);

export default Policy;
