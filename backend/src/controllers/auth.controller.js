import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import User from "../models/user.model.js";
import { registerSchema, loginSchema } from "../utils/validation.schemas.js";

// Register a new user
export const register = asyncHandler(async (req, res) => {
  // Validate request body
  const validationResult = registerSchema.safeParse(req.body);

  if (!validationResult.success) {
    const errors = validationResult.error.errors.map((err) => ({
      field: err.path.join("."),
      message: err.message,
    }));
    throw new ApiError(400, "Validation failed", errors);
  }

  const { phoneNumber, password, name, role, wardNumber, insuranceCompanyId, farmerDetails, companyName } = validationResult.data;

  // Check if user already exists
  const existingUser = await User.findOne({ phoneNumber });
  if (existingUser) {
    throw new ApiError(409, "Phone number already registered");
  }

  // Create user object based on role
  const userData = {
    phoneNumber,
    password,
    name,
    role,
  };

  if (role === "ward_official") {
    userData.wardNumber = wardNumber;
  } else if (role === "insurance_agent") {
    userData.insuranceCompanyId = insuranceCompanyId;
  } else if (role === "insurance_company") {
    userData.companyName = companyName;
  } else if (role === "farmer") {
    userData.farmerDetails = farmerDetails;
  }

  // Create user
  const user = await User.create(userData);

  // Generate token
  const token = user.generateAuthToken();

  // Remove password from response
  const userResponse = user.toJSON();

  // Determine redirect path based on role
  const redirectPaths = {
    farmer: "/farmer",
    admin: "/admin",
    insurance_company: "/insurance",
    insurance_agent: "/insurance",
    insurance_officer: "/insurance",
    INSURANCE_OFFICER: "/insurance",
    ward_official: "/ward",
  };

  const redirectTo = redirectPaths[user.role] || "/";

  res.status(201).json(
    new ApiResponse(
      201,
      {
        user: userResponse,
        token,
        redirectTo,
      },
      "User registered successfully"
    )
  );
});

// Login user
export const login = asyncHandler(async (req, res) => {
  // Validate request body
  const validationResult = loginSchema.safeParse(req.body);

  if (!validationResult.success) {
    const errors = validationResult.error.errors.map((err) => ({
      field: err.path.join("."),
      message: err.message,
    }));
    throw new ApiError(400, "Validation failed", errors);
  }

  const { phoneNumber, email, password } = validationResult.data;

  // Build query to search by either phoneNumber or email
  // Use $or to search flexibly
  const query = {
    $or: []
  };
  
  if (phoneNumber) {
    query.$or.push({ phoneNumber });
  }
  if (email) {
    query.$or.push({ email: email?.toLowerCase() });
  }

  console.log("[LOGIN DEBUG] Query:", JSON.stringify(query));
  console.log("[LOGIN DEBUG] Looking for user with phoneNumber:", phoneNumber, "or email:", email);

  // Find user and explicitly select password field
  const user = await User.findOne(query).select("+password");

  console.log("[LOGIN DEBUG] User found:", user ? `${user.name} (${user.role})` : "NOT FOUND");

  if (!user) {
    throw new ApiError(401, "Invalid credentials - user not found");
  }

  // Compare password
  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials - password incorrect");
  }

  // Generate token
  const token = user.generateAuthToken();

  // Remove password from response
  const userResponse = user.toJSON();

  // Determine redirect path based on role
  const redirectPaths = {
    farmer: "/farmer",
    admin: "/admin",
    insurance_company: "/insurance",
    insurance_agent: "/insurance",
    insurance_officer: "/insurance",
    INSURANCE_OFFICER: "/insurance",
    ward_official: "/ward",
  };

  const redirectTo = redirectPaths[user.role] || "/";

  res.status(200).json(
    new ApiResponse(
      200,
      {
        user: userResponse,
        token,
        redirectTo,
      },
      "Login successful"
    )
  );
});

// Logout user
export const logout = asyncHandler(async (req, res) => {
  res.status(200).json(
    new ApiResponse(
      200,
      null,
      "Logout successful"
    )
  );
});
