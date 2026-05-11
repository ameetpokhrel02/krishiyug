import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import User from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  // Extract token from Authorization header
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new ApiError(401, "No token provided. Please authenticate.");
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    throw new ApiError(401, "No token provided. Please authenticate.");
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user from database
    const user = await User.findById(decoded._id).select("-password");

    if (!user) {
      throw new ApiError(401, "User not found. Token is invalid.");
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      throw new ApiError(401, "Invalid token. Please authenticate again.");
    }
    if (error.name === "TokenExpiredError") {
      throw new ApiError(401, "Token expired. Please login again.");
    }
    throw error;
  }
});
