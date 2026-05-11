import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/roleAuth.middleware.js";
import {
  adminLogin,
  getPendingClaims,
  getAllClaims,
  verifyClaim,
  rejectClaim,
  createInsuranceCompany,
  getDashboardStats,
  getInsuranceCompanies,
  getUsers,
  provisionUser,
} from "../controllers/admin.controller.js";

const router = express.Router();

// Public admin login
router.post("/login", adminLogin);

// All routes require admin role
router.use(verifyJWT);
router.use(authorizeRoles("admin"));

// Dashboard
router.get("/dashboard/stats", getDashboardStats);

// Claim management
router.get("/claims/pending", getPendingClaims);
router.get("/claims/all", getAllClaims);
router.post("/claims/verify", verifyClaim);
router.post("/claims/reject", rejectClaim);

// Insurance company management
router.post("/insurance-company", createInsuranceCompany);
router.get("/insurance-companies", getInsuranceCompanies);

// User management
router.get("/users", getUsers);
router.post("/provision-user", provisionUser);

export default router;
