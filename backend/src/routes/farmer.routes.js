import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/roleAuth.middleware.js";
import ApiResponse from "../utils/ApiResponse.js";

const router = express.Router();

// Apply authentication and authorization middleware to all routes
router.use(verifyJWT);
router.use(authorizeRoles("farmer"));

// GET /api/farmer/dashboard - Farmer dashboard
router.get("/dashboard", (req, res) => {
  res.status(200).json(
    new ApiResponse(
      200,
      {
        user: req.user,
        farmerDetails: req.user.farmerDetails,
      },
      "Farmer dashboard accessed successfully"
    )
  );
});

// GET /api/farmer/profile - Get farmer profile
router.get("/profile", (req, res) => {
  res.status(200).json(
    new ApiResponse(
      200,
      {
        name: req.user.name,
        phoneNumber: req.user.phoneNumber,
        farmerDetails: req.user.farmerDetails,
      },
      "Farmer profile retrieved successfully"
    )
  );
});

// GET /api/farmer/crops - Get farmer's crops
router.get("/crops", (req, res) => {
  res.status(200).json(
    new ApiResponse(
      200,
      {
        cropTypes: req.user.farmerDetails?.cropTypes || [],
        farmSize: req.user.farmerDetails?.farmSize,
        location: req.user.farmerDetails?.location,
      },
      "Crop information retrieved successfully"
    )
  );
});

export default router;
