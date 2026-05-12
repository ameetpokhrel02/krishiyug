import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import Claim from "../models/claim.model.js";
import Policy from "../models/policy.model.js";
import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";
import { adminLoginSchema } from "../utils/validation.schemas.js";

// Admin login using email and password
export const adminLogin = asyncHandler(async (req, res) => {
  const validationResult = adminLoginSchema.safeParse(req.body);

  if (!validationResult.success) {
    const errors = validationResult.error.errors.map((err) => ({
      field: err.path.join("."),
      message: err.message,
    }));
    throw new ApiError(400, "Validation failed", errors);
  }

  const { identifier, password } = validationResult.data;
  const normalizedIdentifier = String(identifier).trim().toLowerCase();

  const admin = await User.findOne({
    role: "admin",
    $or: [
      { email: normalizedIdentifier },
      { phoneNumber: normalizedIdentifier },
    ],
  }).select("+password");

  if (!admin) {
    throw new ApiError(401, "Invalid credentials");
  }

  const isPasswordValid = await admin.comparePassword(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  const token = admin.generateAuthToken();
  const adminResponse = admin.toJSON();

  res.status(200).json(
    new ApiResponse(200, { user: adminResponse, token }, "Admin login successful")
  );
});

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

// Admin lists all insurance companies
export const getInsuranceCompanies = asyncHandler(async (req, res) => {
  const companies = await User.find({ role: "insurance_company" })
    .select("name companyName phoneNumber status createdAt")
    .sort("-createdAt");

  res.status(200).json(
    new ApiResponse(200, companies, "Insurance companies retrieved successfully")
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

// Admin lists all users with optional role filter
export const getUsers = asyncHandler(async (req, res) => {
  const { role } = req.query;
  const filter = role ? { role } : {};

  const users = await User.find(filter)
    .select("-password")
    .sort("-createdAt");

  res.status(200).json(
    new ApiResponse(200, users, "Users retrieved successfully")
  );
});

// Admin provisions a new internal user
export const provisionUser = asyncHandler(async (req, res) => {
  const { name, phoneNumber, email, password, role, companyName } = req.body;

  // Validate role
  const allowedRoles = ["admin", "ward_official", "insurance_company", "insurance_agent"];
  if (!allowedRoles.includes(role)) {
    throw new ApiError(400, "Invalid role for internal provisioning");
  }

  // Check if phone already exists
  const existingPhone = await User.findOne({ phoneNumber });
  if (existingPhone) {
    throw new ApiError(409, "Phone number already registered");
  }

  // Check if email already exists
  if (email) {
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      throw new ApiError(409, "Email already registered");
    }
  }

  const user = await User.create({
    name,
    phoneNumber,
    email,
    password: password || "Krishiyug@123", // Default password if not provided
    role,
    companyName,
  });

  const response = user.toJSON();

  res.status(201).json(
    new ApiResponse(201, response, `User with role ${role} provisioned successfully`)
  );
});

// Admin gets a specific user by ID
export const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id).select("-password");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  res.status(200).json(
    new ApiResponse(200, user, "User retrieved successfully")
  );
});

// Admin updates a user
export const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, phoneNumber, email, companyName, wardNumber } = req.body;

  const user = await User.findById(id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Check if phone number is being changed and if it's already taken
  if (phoneNumber && phoneNumber !== user.phoneNumber) {
    const existingPhone = await User.findOne({ phoneNumber });
    if (existingPhone) {
      throw new ApiError(409, "Phone number already in use");
    }
    user.phoneNumber = phoneNumber;
  }

  // Check if email is being changed and if it's already taken
  if (email && email !== user.email) {
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      throw new ApiError(409, "Email already in use");
    }
    user.email = email;
  }

  if (name) user.name = name;
  if (companyName) user.companyName = companyName;
  if (wardNumber) user.wardNumber = wardNumber;

  await user.save({ validateModifiedOnly: true });

  const response = user.toJSON();

  res.status(200).json(
    new ApiResponse(200, response, "User updated successfully")
  );
});

// Admin toggles user active status
export const toggleUserStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Toggle between active and inactive
  const newStatus = user.status === "active" ? "inactive" : "active";
  const updatedUser = await User.findByIdAndUpdate(
    id,
    { status: newStatus },
    { new: true }
  );

  const response = updatedUser.toJSON();

  res.status(200).json(
    new ApiResponse(
      200,
      response,
      `User ${newStatus === "active" ? "activated" : "deactivated"} successfully`
    )
  );
});

// Admin deletes a user
export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Prevent deleting admin users
  if (user.role === "admin") {
    throw new ApiError(403, "Cannot delete admin users");
  }

  await User.findByIdAndDelete(id);

  res.status(200).json(
    new ApiResponse(200, null, "User deleted successfully")
  );
});
