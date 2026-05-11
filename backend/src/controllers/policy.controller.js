import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import Policy from "../models/policy.model.js";
import User from "../models/user.model.js";

// Admin creates a new policy
export const createPolicy = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    coverageAmount,
    premium,
    policyType,
    applicableRegions,
    insuranceCompanyId,
  } = req.body;

  // Validate insurance company exists and has correct role
  const insuranceCompany = await User.findById(insuranceCompanyId);
  if (!insuranceCompany || insuranceCompany.role !== "insurance_company") {
    throw new ApiError(400, "Invalid insurance company ID");
  }

  const policy = await Policy.create({
    name,
    description,
    coverageAmount,
    premium,
    policyType,
    applicableRegions: applicableRegions || [],
    insuranceCompanyId,
    isActive: true,
  });

  const populatedPolicy = await Policy.findById(policy._id).populate(
    "insuranceCompanyId",
    "name companyName"
  );

  res.status(201).json(
    new ApiResponse(201, populatedPolicy, "Policy created successfully")
  );
});

// Get all policies (admin view)
export const getAllPolicies = asyncHandler(async (req, res) => {
  const policies = await Policy.find()
    .populate("insuranceCompanyId", "name companyName")
    .sort("-createdAt");

  res.status(200).json(
    new ApiResponse(200, policies, "Policies retrieved successfully")
  );
});

// Get recommended policies for farmer based on profile
export const getRecommendedPolicies = asyncHandler(async (req, res) => {
  const farmer = req.user;

  if (!farmer.farmerDetails) {
    throw new ApiError(400, "Farmer profile incomplete. Please update your details.");
  }

  let filter = { isActive: true };

  // Match farm type
  if (farmer.farmerDetails.farmType === "livestock") {
    filter.policyType = "livestock";
  } else if (farmer.farmerDetails.farmType === "crop") {
    filter.policyType = { $in: ["crop", "weather"] };
  }

  // Match region if available
  if (farmer.farmerDetails.location?.region) {
    filter.$or = [
      { applicableRegions: { $in: [farmer.farmerDetails.location.region] } },
      { applicableRegions: { $size: 0 } }, // Policies with no region restrictions
    ];
  }

  const policies = await Policy.find(filter).populate(
    "insuranceCompanyId",
    "name companyName"
  );

  res.status(200).json(
    new ApiResponse(
      200,
      {
        policies,
        farmerProfile: {
          farmType: farmer.farmerDetails.farmType,
          region: farmer.farmerDetails.location?.region,
        },
      },
      "Recommended policies retrieved successfully"
    )
  );
});

// Farmer buys a policy (simplified - no payment integration)
export const buyPolicy = asyncHandler(async (req, res) => {
  const { policyId } = req.body;
  const farmerId = req.user._id;

  const policy = await Policy.findById(policyId);
  if (!policy || !policy.isActive) {
    throw new ApiError(404, "Policy not available");
  }

  // In production, create a PolicyPurchase model to track purchases
  // For now, just return success
  res.status(200).json(
    new ApiResponse(
      200,
      {
        policy,
        message: "Policy purchased successfully. You can now file claims under this policy.",
      },
      "Policy purchase successful"
    )
  );
});

// Toggle policy active status
export const togglePolicyStatus = asyncHandler(async (req, res) => {
  const { policyId } = req.params;

  const policy = await Policy.findById(policyId);
  if (!policy) {
    throw new ApiError(404, "Policy not found");
  }

  policy.isActive = !policy.isActive;
  await policy.save();

  res.status(200).json(
    new ApiResponse(
      200,
      policy,
      `Policy ${policy.isActive ? "activated" : "deactivated"} successfully`
    )
  );
});

// Update policy
export const updatePolicy = asyncHandler(async (req, res) => {
  const { policyId } = req.params;
  const updates = req.body;

  const policy = await Policy.findByIdAndUpdate(policyId, updates, {
    new: true,
    runValidators: true,
  }).populate("insuranceCompanyId", "name companyName");

  if (!policy) {
    throw new ApiError(404, "Policy not found");
  }

  res.status(200).json(
    new ApiResponse(200, policy, "Policy updated successfully")
  );
});
