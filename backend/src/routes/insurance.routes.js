import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/roleAuth.middleware.js";
import {
  getVerifiedClaims,
  getAllMyClaims,
  decideClaim,
  getInsuranceDashboard,
  getMyPolicies,
  getInsuredFarmers,
} from "../controllers/insurance.controller.js";

const router = express.Router();

// All routes require insurance_company role
router.use(verifyJWT);
router.use(authorizeRoles("insurance_company"));

// Dashboard
router.get("/dashboard", getInsuranceDashboard);

// Claim management
router.get("/claims/verified", getVerifiedClaims);
router.get("/claims/all", getAllMyClaims);
router.post("/claims/decide", decideClaim);

// Policy and Farmer data
router.get("/policies", getMyPolicies);
router.get("/farmers", getInsuredFarmers);

export default router;
