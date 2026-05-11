import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/roleAuth.middleware.js";
import ApiResponse from "../utils/ApiResponse.js";

const router = express.Router();

// Apply authentication and authorization middleware to all routes
router.use(verifyJWT);
router.use(authorizeRoles("insurance_agent"));

// GET /api/insurance/dashboard - Insurance agent dashboard
router.get("/dashboard", (req, res) => {
  res.status(200).json(
    new ApiResponse(
      200,
      {
        user: req.user,
        insuranceCompanyId: req.user.insuranceCompanyId,
      },
      "Insurance agent dashboard accessed successfully"
    )
  );
});

// GET /api/insurance/profile - Get insurance agent profile
router.get("/profile", (req, res) => {
  res.status(200).json(
    new ApiResponse(
      200,
      {
        name: req.user.name,
        phoneNumber: req.user.phoneNumber,
        insuranceCompanyId: req.user.insuranceCompanyId,
        role: req.user.role,
      },
      "Insurance agent profile retrieved successfully"
    )
  );
});

// GET /api/insurance/claims - Get claims for processing
router.get("/claims", (req, res) => {
  // TODO: Implement logic to fetch verified claims with trust scores
  res.status(200).json(
    new ApiResponse(
      200,
      {
        insuranceCompanyId: req.user.insuranceCompanyId,
        claims: [],
        message: "This endpoint will fetch verified claims with trust scores for processing",
      },
      "Claims retrieved successfully"
    )
  );
});

// GET /api/insurance/policies - Get insurance policies
router.get("/policies", (req, res) => {
  // TODO: Implement policy fetching logic
  res.status(200).json(
    new ApiResponse(
      200,
      {
        policies: [],
        message: "This endpoint will fetch insurance policies managed by your company",
      },
      "Policies retrieved successfully"
    )
  );
});

export default router;
