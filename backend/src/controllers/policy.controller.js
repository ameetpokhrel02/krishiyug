import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import Policy from "../models/policy.model.js";
import User from "../models/user.model.js";
import PolicyPurchase from "../models/policyPurchase.model.js";
import cloudinary from "../config/cloudinary.js";
import { policyCreationSchema } from "../utils/validation.schemas.js";

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

const normalizeRegions = (regions) => {
  if (!regions) return [];

  if (Array.isArray(regions)) {
    return regions.map((region) => String(region).trim()).filter(Boolean);
  }

  if (typeof regions === "string") {
    return regions
      .split(",")
      .map((region) => region.trim())
      .filter(Boolean);
  }

  return [];
};

const parsePolicyPayload = (body) => {
  const payload = {
    name: body.name,
    description: body.description,
    coverageAmount: Number(body.coverageAmount),
    premium: Number(body.premium),
    policyType: body.policyType,
    applicableRegions: normalizeRegions(body.applicableRegions),
    insuranceCompanyId: body.insuranceCompanyId,
    isActive: typeof body.isActive === "boolean" ? body.isActive : undefined,
  };

  const result = policyCreationSchema.safeParse(payload);

  if (!result.success) {
    const errors = result.error.errors.map((err) => ({
      field: err.path.join("."),
      message: err.message,
    }));
    throw new ApiError(400, "Validation failed", errors);
  }

  return result.data;
};

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
    isActive,
  } = parsePolicyPayload(req.body);

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
    isActive: typeof isActive === "boolean" ? isActive : true,
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

// Farmer applies for a policy
export const buyPolicy = asyncHandler(async (req, res) => {
  const { policyId, applicationDetails } = req.body;
  const farmerId = req.user._id;

  const policy = await Policy.findById(policyId);
  if (!policy || !policy.isActive) {
    throw new ApiError(404, "Policy not available");
  }

  // Check if farmer already has a pending or active application for this policy
  const existingApplication = await PolicyPurchase.findOne({
    farmerId,
    policyId,
    status: { $in: ["pending", "admin_verified", "approved"] }
  });

  if (existingApplication) {
    throw new ApiError(400, "You already have an active or pending application for this policy");
  }

  // Parse application details (which comes as a string when using FormData)
  let parsedDetails = {};
  if (typeof applicationDetails === "string") {
    try {
      parsedDetails = JSON.parse(applicationDetails);
    } catch (e) {
      throw new ApiError(400, "Invalid application details format");
    }
  } else {
    parsedDetails = applicationDetails;
  }

  // Handle document image uploads
  let lalpurjaImageUrl = null;
  let citizenshipImageUrl = null;
  
  const lalpurjaImage = req.files?.lalpurjaImage ? req.files.lalpurjaImage[0] : null;
  const citizenshipImage = req.files?.citizenshipImage ? req.files.citizenshipImage[0] : null;

  if (lalpurjaImage) {
    try {
      const result = await uploadToCloudinary(
        lalpurjaImage.buffer,
        "krishiyug/policies/documents",
        "auto"
      );
      lalpurjaImageUrl = result.secure_url;
    } catch (error) {
      throw new ApiError(500, `Failed to upload Lalpurja document: ${error.message}`);
    }
  }

  if (citizenshipImage) {
    try {
      const result = await uploadToCloudinary(
        citizenshipImage.buffer,
        "krishiyug/policies/documents",
        "auto"
      );
      citizenshipImageUrl = result.secure_url;
    } catch (error) {
      throw new ApiError(500, `Failed to upload Citizenship document: ${error.message}`);
    }
  }

  parsedDetails.lalpurjaImageUrl = lalpurjaImageUrl;
  parsedDetails.citizenshipImageUrl = citizenshipImageUrl;

  const policyPurchase = await PolicyPurchase.create({
    farmerId,
    policyId,
    status: "pending",
    applicationDetails: parsedDetails
  });

  res.status(201).json(
    new ApiResponse(
      201,
      {
        policyPurchase,
        message: "Policy application submitted successfully. It is now pending admin verification.",
      },
      "Policy application successful"
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
  const policy = await Policy.findById(policyId);

  if (!policy) {
    throw new ApiError(404, "Policy not found");
  }

  const updates = {
    ...parsePolicyPayload({
      ...policy.toObject(),
      insuranceCompanyId: String(policy.insuranceCompanyId),
      ...req.body,
    }),
  };

  if (typeof req.body.isActive === "boolean") {
    updates.isActive = req.body.isActive;
  }

  const insuranceCompany = await User.findById(updates.insuranceCompanyId);
  if (!insuranceCompany || insuranceCompany.role !== "insurance_company") {
    throw new ApiError(400, "Invalid insurance company ID");
  }

  const updatedPolicy = await Policy.findByIdAndUpdate(policyId, updates, {
    new: true,
    runValidators: true,
  }).populate("insuranceCompanyId", "name companyName");

  res.status(200).json(
    new ApiResponse(200, updatedPolicy, "Policy updated successfully")
  );
});

// Delete policy
export const deletePolicy = asyncHandler(async (req, res) => {
  const { policyId } = req.params;

  const policy = await Policy.findByIdAndDelete(policyId);

  if (!policy) {
    throw new ApiError(404, "Policy not found");
  }

  res.status(200).json(
    new ApiResponse(200, null, "Policy deleted successfully")
  );
});
