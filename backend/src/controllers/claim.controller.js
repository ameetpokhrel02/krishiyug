import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import Claim from "../models/claim.model.js";
import Policy from "../models/policy.model.js";
import Notification from "../models/notification.model.js";
import cloudinary from "../config/cloudinary.js";

// Helper function to upload buffer to Cloudinary
const uploadToCloudinary = (buffer, folder, resourceType = "image") => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    uploadStream.end(buffer);
  });
};

// Farmer submits a claim with multimedia evidence
export const submitClaim = asyncHandler(async (req, res) => {
  const { policyId, tagNumber, description } = req.body;
  const farmerId = req.user._id;

  // Validate policy exists
  const policy = await Policy.findById(policyId);
  if (!policy || !policy.isActive) {
    throw new ApiError(404, "Policy not found or inactive");
  }

  // Validate tag number for livestock policies
  if (policy.policyType === "livestock" && !tagNumber) {
    throw new ApiError(400, "Tag number is mandatory for livestock claims");
  }

  // Process uploaded files
  const images = req.files?.images || [];
  const video = req.files?.video ? req.files.video[0] : null;

  if (images.length === 0 && !video) {
    throw new ApiError(400, "At least one image or video is required as evidence");
  }

  // Upload images to Cloudinary
  const imageUrls = [];
  for (const img of images) {
    try {
      const result = await uploadToCloudinary(
        img.buffer,
        "krishiyug/claims/images",
        "image"
      );
      imageUrls.push(result.secure_url);
    } catch (error) {
      throw new ApiError(500, `Failed to upload image: ${error.message}`);
    }
  }

  // Upload video to Cloudinary if present
  let videoUrl = null;
  if (video) {
    try {
      const result = await uploadToCloudinary(
        video.buffer,
        "krishiyug/claims/videos",
        "video"
      );
      videoUrl = result.secure_url;
    } catch (error) {
      throw new ApiError(500, `Failed to upload video: ${error.message}`);
    }
  }

  // Create claim
  const claim = await Claim.create({
    farmerId,
    policyId,
    tagNumber: policy.policyType === "livestock" ? tagNumber : undefined,
    description,
    media: {
      images: imageUrls,
      video: videoUrl,
    },
    status: "pending",
    policyType: policy.policyType,
  });

  // Create notification for admin (find admin users)
  const adminUsers = await User.findOne({ role: "admin" });
  if (adminUsers) {
    await Notification.create({
      userId: adminUsers._id,
      claimId: claim._id,
      message: `New ${policy.policyType} claim submitted by ${req.user.name}`,
      status: "pending",
    });
  }

  // Populate claim details
  const populatedClaim = await Claim.findById(claim._id)
    .populate("farmerId", "name phoneNumber")
    .populate("policyId", "name policyType coverageAmount");

  res.status(201).json(
    new ApiResponse(201, populatedClaim, "Claim submitted successfully")
  );
});

// Farmer views their claims
export const getMyClaims = asyncHandler(async (req, res) => {
  const claims = await Claim.find({ farmerId: req.user._id })
    .populate("policyId", "name policyType coverageAmount")
    .sort("-createdAt");

  res.status(200).json(
    new ApiResponse(200, claims, "Claims retrieved successfully")
  );
});

// Farmer gets detailed claim status with timeline
export const getClaimStatus = asyncHandler(async (req, res) => {
  const { claimId } = req.params;

  const claim = await Claim.findOne({
    _id: claimId,
    farmerId: req.user._id,
  })
    .populate("policyId", "name policyType coverageAmount")
    .populate("farmerId", "name phoneNumber");

  if (!claim) {
    throw new ApiError(404, "Claim not found");
  }

  // Get timeline (notifications for this claim)
  const timeline = await Notification.find({ claimId: claim._id }).sort(
    "createdAt"
  );

  res.status(200).json(
    new ApiResponse(
      200,
      {
        claim,
        timeline,
      },
      "Claim status retrieved successfully"
    )
  );
});

// Get claim by ID (for admin/insurance)
export const getClaimById = asyncHandler(async (req, res) => {
  const { claimId } = req.params;

  const claim = await Claim.findById(claimId)
    .populate("farmerId", "name phoneNumber farmerDetails")
    .populate("policyId", "name policyType coverageAmount insuranceCompanyId");

  if (!claim) {
    throw new ApiError(404, "Claim not found");
  }

  res.status(200).json(
    new ApiResponse(200, claim, "Claim retrieved successfully")
  );
});
