import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/roleAuth.middleware.js";
import ApiResponse from "../utils/ApiResponse.js";

const router = express.Router();

// Apply authentication and authorization middleware to all routes
router.use(verifyJWT);
router.use(authorizeRoles("ward_official"));

// GET /api/ward/dashboard - Ward official dashboard
router.get("/dashboard", (req, res) => {
  res.status(200).json(
    new ApiResponse(
      200,
      {
        user: req.user,
        wardNumber: req.user.wardNumber,
      },
      "Ward official dashboard accessed successfully"
    )
  );
});

// GET /api/ward/profile - Get ward official profile
router.get("/profile", (req, res) => {
  res.status(200).json(
    new ApiResponse(
      200,
      {
        name: req.user.name,
        phoneNumber: req.user.phoneNumber,
        wardNumber: req.user.wardNumber,
        role: req.user.role,
      },
      "Ward official profile retrieved successfully"
    )
  );
});

// GET /api/ward/claims/pending - Get pending claims for verification
router.get("/claims/pending", (req, res) => {
  // TODO: Implement logic to fetch claims for this ward
  res.status(200).json(
    new ApiResponse(
      200,
      {
        wardNumber: req.user.wardNumber,
        pendingClaims: [],
        message: "This endpoint will fetch claims pending verification in your ward",
      },
      "Pending claims retrieved successfully"
    )
  );
});

export default router;
