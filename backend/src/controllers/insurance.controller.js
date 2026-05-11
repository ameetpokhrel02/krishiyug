import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import Claim from "../models/claim.model.js";
import Policy from "../models/policy.model.js";
import Notification from "../models/notification.model.js";

// Insurance company views admin-verified claims for their policies
export const getVerifiedClaims = asyncHandler(async (req, res) => {
  const insuranceCompanyId = req.user._id;

  // Get all policies belonging to this insurance company
  const policies = await Policy.find({ insuranceCompanyId });
  const policyIds = policies.map((p) => p._id);

  // Find claims for these policies that are admin-verified
  const claims = await Claim.find({
    policyId: { $in: policyIds },
    status: "admin_verified",
  })
    .populate("farmerId", "name phoneNumber farmerDetails")
    .populate("policyId", "name policyType coverageAmount")
    .sort("-createdAt");

  res.status(200).json(
    new ApiResponse(200, claims, "Verified claims retrieved successfully")
  );
});

// Insurance company views all claims for their policies
export const getAllMyClaims = asyncHandler(async (req, res) => {
  const insuranceCompanyId = req.user._id;
  const { status } = req.query;

  // Get all policies belonging to this insurance company
  const policies = await Policy.find({ insuranceCompanyId });
  const policyIds = policies.map((p) => p._id);

  const filter = { policyId: { $in: policyIds } };
  if (status) {
    filter.status = status;
  }

  const claims = await Claim.find(filter)
    .populate("farmerId", "name phoneNumber farmerDetails")
    .populate("policyId", "name policyType coverageAmount")
    .sort("-createdAt");

  res.status(200).json(
    new ApiResponse(200, claims, "Claims retrieved successfully")
  );
});

// Insurance company approves or rejects a claim
export const decideClaim = asyncHandler(async (req, res) => {
  const { claimId, action, reason } = req.body;

  if (!["approved", "rejected"].includes(action)) {
    throw new ApiError(400, "Action must be either 'approved' or 'rejected'");
  }

  const claim = await Claim.findById(claimId)
    .populate("farmerId", "name phoneNumber")
    .populate("policyId", "insuranceCompanyId");

  if (!claim) {
    throw new ApiError(404, "Claim not found");
  }

  // Verify this claim belongs to this insurance company's policy
  if (claim.policyId.insuranceCompanyId.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to decide on this claim");
  }

  if (claim.status !== "admin_verified") {
    throw new ApiError(400, "Only admin-verified claims can be decided upon");
  }

  // Update claim status
  const newStatus = action === "approved" ? "refund_approved" : "rejected";
  claim.status = newStatus;
  claim.insuranceDecision = {
    action,
    reason: reason || "",
    decidedAt: new Date(),
  };
  await claim.save();

  // Notify farmer
  const message =
    action === "approved"
      ? `Great news! Your claim has been approved. Refund will be processed shortly.`
      : `Your claim has been rejected by the insurance company. Reason: ${reason || "Not specified"}`;

  await Notification.create({
    userId: claim.farmerId._id,
    claimId: claim._id,
    message,
    status: newStatus,
  });

  res.status(200).json(
    new ApiResponse(
      200,
      claim,
      `Claim ${action === "approved" ? "approved" : "rejected"} successfully`
    )
  );
});

// Insurance company gets dashboard statistics
export const getInsuranceDashboard = asyncHandler(async (req, res) => {
  const insuranceCompanyId = req.user._id;

  // Get all policies belonging to this insurance company
  const policies = await Policy.find({ insuranceCompanyId });
  const policyIds = policies.map((p) => p._id);

  const totalClaims = await Claim.countDocuments({ policyId: { $in: policyIds } });
  const pendingReview = await Claim.countDocuments({
    policyId: { $in: policyIds },
    status: "admin_verified",
  });
  const approved = await Claim.countDocuments({
    policyId: { $in: policyIds },
    status: "refund_approved",
  });
  const rejected = await Claim.countDocuments({
    policyId: { $in: policyIds },
    status: "rejected",
  });

  const activePolicies = await Policy.countDocuments({
    insuranceCompanyId,
    isActive: true,
  });

  res.status(200).json(
    new ApiResponse(
      200,
      {
        claims: {
          total: totalClaims,
          pendingReview,
          approved,
          rejected,
        },
        activePolicies,
        companyName: req.user.companyName,
      },
      "Dashboard statistics retrieved successfully"
    )
  );
});
