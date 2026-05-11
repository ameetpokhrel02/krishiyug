import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import Claim from "../models/claim.model.js";
import Policy from "../models/policy.model.js";
import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";

// Admin views all pending claims
export const getPendingClaims = asyncHandler(async (req, res) => {
  const claims = await Claim.find({ status: "pending" })
    .populate("farmerId", "name phoneNumber farmerDetails")
    .populate("policyId", "name policyType coverageAmount")
    .sort("-createdAt");

  res.status(200).json(
    new ApiResponse(200, claims, "Pending claims retrieved successfully")
  );
});

// Admin views all claims (with optional status filter)
export const getAllClaims = asyncHandler(async (req, res) => {
  const { status } = req.query;

  const filter = status ? { status } : {};

  const claims = await Claim.find(filter)
    .populate("farmerId", "name phoneNumber farmerDetails")
    .populate("policyId", "name policyType coverageAmount insuranceCompanyId")
    .sort("-createdAt");

  res.status(200).json(
    new ApiResponse(200, claims, "Claims retrieved successfully")
  );
});

// Admin verifies a claim and generates verification report
export const verifyClaim = asyncHandler(async (req, res) => {
  const { claimId, remarks } = req.body;

  const claim = await Claim.findById(claimId)
    .populate("farmerId", "name phoneNumber farmerDetails")
    .populate("policyId", "name policyType coverageAmount insuranceCompanyId");

  if (!claim) {
    throw new ApiError(404, "Claim not found");
  }

  if (claim.status !== "pending") {
    throw new ApiError(400, "Only pending claims can be verified");
  }

  // Build JSON verification report
  const jsonReport = {
    claimId: claim._id,
    verificationDate: new Date(),
    farmerDetails: {
      name: claim.farmerId.name,
      phoneNumber: claim.farmerId.phoneNumber,
      location: claim.farmerId.farmerDetails?.location,
      farmType: claim.farmerId.farmerDetails?.farmType,
    },
    policyDetails: {
      name: claim.policyId.name,
      type: claim.policyId.policyType,
      coverageAmount: claim.policyId.coverageAmount,
    },
    claimDetails: {
      tagNumber: claim.tagNumber,
      description: claim.description,
      submittedAt: claim.createdAt,
    },
    evidence: {
      images: claim.media.images,
      video: claim.media.video,
      imageCount: claim.media.images.length,
      hasVideo: !!claim.media.video,
    },
    adminVerification: {
      verifiedBy: req.user.name,
      verifiedAt: new Date(),
      remarks: remarks || "Claim verified and approved for insurance review",
      status: "verified",
    },
  };

  // Update claim status
  claim.status = "admin_verified";
  claim.adminVerificationReport = {
    jsonReport,
    pdfUrl: null, // Can be implemented later with pdfkit
    verifiedAt: new Date(),
    remarks: remarks || "",
  };
  await claim.save();

  // Notify insurance company
  const insuranceCompanyId = claim.policyId.insuranceCompanyId;
  await Notification.create({
    userId: insuranceCompanyId,
    claimId: claim._id,
    message: `Claim #${claim._id.toString().slice(-6)} has been verified by admin and is ready for review`,
    status: "admin_verified",
  });

  // Notify farmer
  await Notification.create({
    userId: claim.farmerId._id,
    claimId: claim._id,
    message: `Your claim has been verified by the admin and forwarded to the insurance company`,
    status: "admin_verified",
  });

  res.status(200).json(
    new ApiResponse(
      200,
      {
        claim,
        verificationReport: jsonReport,
      },
      "Claim verified successfully"
    )
  );
});

// Admin rejects a claim
export const rejectClaim = asyncHandler(async (req, res) => {
  const { claimId, reason } = req.body;

  const claim = await Claim.findById(claimId).populate("farmerId", "name phoneNumber");

  if (!claim) {
    throw new ApiError(404, "Claim not found");
  }

  if (claim.status !== "pending") {
    throw new ApiError(400, "Only pending claims can be rejected");
  }

  claim.status = "rejected";
  claim.adminVerificationReport = {
    jsonReport: {
      rejectedBy: req.user.name,
      rejectedAt: new Date(),
      reason: reason || "Insufficient evidence or invalid claim",
    },
    verifiedAt: new Date(),
    remarks: reason || "",
  };
  await claim.save();

  // Notify farmer
  await Notification.create({
    userId: claim.farmerId._id,
    claimId: claim._id,
    message: `Your claim has been rejected. Reason: ${reason || "Insufficient evidence"}`,
    status: "rejected",
  });

  res.status(200).json(
    new ApiResponse(200, claim, "Claim rejected successfully")
  );
});

// Admin creates insurance company account
export const createInsuranceCompany = asyncHandler(async (req, res) => {
  const { name, phoneNumber, password, companyName } = req.body;

  // Check if phone number already exists
  const existing = await User.findOne({ phoneNumber });
  if (existing) {
    throw new ApiError(409, "Phone number already registered");
  }

  const insuranceCompany = await User.create({
    name,
    phoneNumber,
    password,
    role: "insurance_company",
    companyName,
  });

  const response = insuranceCompany.toJSON();

  res.status(201).json(
    new ApiResponse(
      201,
      response,
      "Insurance company account created successfully"
    )
  );
});

// Admin gets dashboard statistics
export const getDashboardStats = asyncHandler(async (req, res) => {
  const totalClaims = await Claim.countDocuments();
  const pendingClaims = await Claim.countDocuments({ status: "pending" });
  const verifiedClaims = await Claim.countDocuments({ status: "admin_verified" });
  const approvedClaims = await Claim.countDocuments({ status: "refund_approved" });
  const rejectedClaims = await Claim.countDocuments({ status: "rejected" });

  const totalFarmers = await User.countDocuments({ role: "farmer" });
  const totalPolicies = await Policy.countDocuments({ isActive: true });

  res.status(200).json(
    new ApiResponse(
      200,
      {
        claims: {
          total: totalClaims,
          pending: pendingClaims,
          verified: verifiedClaims,
          approved: approvedClaims,
          rejected: rejectedClaims,
        },
        farmers: totalFarmers,
        activePolicies: totalPolicies,
      },
      "Dashboard statistics retrieved successfully"
    )
  );
});
