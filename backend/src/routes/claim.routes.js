import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/roleAuth.middleware.js";
import { uploadClaimMedia } from "../config/multer.js";
import {
  submitClaim,
  getMyClaims,
  getClaimStatus,
  getClaimById,
} from "../controllers/claim.controller.js";

const router = express.Router();

// Farmer routes
router.post(
  "/submit",
  verifyJWT,
  authorizeRoles("farmer"),
  uploadClaimMedia,
  submitClaim
);
router.get("/my-claims", verifyJWT, authorizeRoles("farmer"), getMyClaims);
router.get("/:claimId/status", verifyJWT, authorizeRoles("farmer"), getClaimStatus);

// Admin and Insurance routes
router.get(
  "/:claimId",
  verifyJWT,
  authorizeRoles("admin", "insurance_company"),
  getClaimById
);

export default router;
