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

  const { phoneNumber, password, name, role, wardNumber, insuranceCompanyId, farmerDetails } = validationResult.data;

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
  } else if (role === "farmer") {
    userData.farmerDetails = farmerDetails;
  }

  // Create user
  const user = await User.create(userData);

  // Generate token
  const token = user.generateAuthToken();

  // Remove password from response
  const userResponse = user.toJSON();

  res.status(201).json(
    new ApiResponse(
      201,
      {
        user: userResponse,
        token,
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

  const { phoneNumber, password } = validationResult.data;

  // Find user and explicitly select password field
  const user = await User.findOne({ phoneNumber }).select("+password");

  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }

  // Compare password
  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  // Generate token
  const token = user.generateAuthToken();

  // Remove password from response
  const userResponse = user.toJSON();

  res.status(200).json(
    new ApiResponse(
      200,
      {
        user: userResponse,
        token,
      },
      "Login successful"
    )
  );
});
