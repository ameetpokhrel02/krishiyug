import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/roleAuth.middleware.js";
import {
  createPolicy,
  getAllPolicies,
  getRecommendedPolicies,
  buyPolicy,
  togglePolicyStatus,
  updatePolicy,
} from "../controllers/policy.controller.js";
import { uploadApplicationMedia } from "../config/multer.js";

const router = express.Router();

// Admin routes
router.post("/", verifyJWT, authorizeRoles("admin"), createPolicy);
router.get("/all", verifyJWT, authorizeRoles("admin"), getAllPolicies);
router.patch("/:policyId/toggle", verifyJWT, authorizeRoles("admin"), togglePolicyStatus);
router.put("/:policyId", verifyJWT, authorizeRoles("admin"), updatePolicy);

// Farmer routes
router.get("/recommended", verifyJWT, authorizeRoles("farmer"), getRecommendedPolicies);
router.post("/buy", verifyJWT, authorizeRoles("farmer"), uploadApplicationMedia, buyPolicy);

export default router;
