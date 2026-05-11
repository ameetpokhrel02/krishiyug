import mongoose from "mongoose";

const claimSchema = new mongoose.Schema(
  {
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Farmer ID is required"],
    },
    policyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Policy",
      required: [true, "Policy ID is required"],
    },
    tagNumber: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Claim description is required"],
      minlength: [10, "Description must be at least 10 characters"],
    },
    media: {
      images: {
        type: [String],
        default: [],
      },
      video: {
        type: String,
        default: null,
      },
    },
    status: {
      type: String,
      enum: {
        values: ["pending", "admin_verified", "rejected", "refund_approved"],
        message: "Invalid status",
      },
      default: "pending",
    },
    adminVerificationReport: {
      jsonReport: {
        type: mongoose.Schema.Types.Mixed,
        default: null,
      },
      pdfUrl: {
        type: String,
        default: null,
      },
      verifiedAt: {
        type: Date,
        default: null,
      },
      remarks: {
        type: String,
        default: "",
      },
    },
    insuranceDecision: {
      action: {
        type: String,
        enum: ["approved", "rejected"],
        default: null,
      },
      reason: {
        type: String,
        default: "",
      },
      decidedAt: {
        type: Date,
        default: null,
      },
    },
    policyType: {
      type: String,
      enum: ["livestock", "crop", "weather"],
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to populate policyType from Policy
claimSchema.pre("save", async function (next) {
  if (this.isNew && !this.policyType) {
    const Policy = mongoose.model("Policy");
    const policy = await Policy.findById(this.policyId);
    if (policy) {
      this.policyType = policy.policyType;

      // Validate tag number for livestock
      if (policy.policyType === "livestock" && !this.tagNumber) {
        throw new Error("Tag number is mandatory for livestock claims");
      }
    }
  }
  next();
});

// Indexes for faster queries
claimSchema.index({ farmerId: 1, status: 1 });
claimSchema.index({ status: 1, createdAt: -1 });
claimSchema.index({ policyId: 1 });

const Claim = mongoose.model("Claim", claimSchema);

export default Claim;
