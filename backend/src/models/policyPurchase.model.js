import mongoose from "mongoose";

const policyPurchaseSchema = new mongoose.Schema(
  {
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    policyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Policy",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "admin_verified", "approved", "rejected"],
      default: "pending",
    },
    applicationDetails: {
      farmSize: { type: Number, required: true },
      cropTypes: { type: [String] },
      livestockCount: { type: Number },
      citizenshipNumber: { type: String, required: true },
      wardNumber: { type: String, required: true },
      landOwnershipNo: { type: String, required: true },
      municipalityName: { type: String, required: true },
      bankName: { type: String, required: true },
      bankAccountNo: { type: String, required: true },
      nomineeName: { type: String, required: true },
      nomineePhone: { type: String },
      nomineeEmail: { type: String },
      lalpurjaImageUrl: { type: String },
      citizenshipImageUrl: { type: String },
    },
    adminVerification: {
      verifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      verifiedAt: { type: Date },
      remarks: { type: String },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
policyPurchaseSchema.index({ farmerId: 1 });
policyPurchaseSchema.index({ policyId: 1 });
policyPurchaseSchema.index({ status: 1 });

const PolicyPurchase = mongoose.model("PolicyPurchase", policyPurchaseSchema);

export default PolicyPurchase;
