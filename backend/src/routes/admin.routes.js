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
  getUserById,
  updateUser,
  toggleUserStatus,
  deleteUser,
  getPolicyApplications,
  verifyPolicyApplication,
  rejectPolicyApplication,
} from "../controllers/admin.controller.js";

console.log("[DEBUG] Loading Admin Routes...");

const router = express.Router();

// Public admin login
router.post("/login", adminLogin);

// Dashboard
router.get("/dashboard/stats", verifyJWT, authorizeRoles("admin"), getDashboardStats);

// User management
router.get("/users", verifyJWT, authorizeRoles("admin"), getUsers);
router.post("/provision-user", verifyJWT, authorizeRoles("admin"), provisionUser);
router.get("/users/:id", verifyJWT, authorizeRoles("admin"), getUserById);
router.put("/users/:id", verifyJWT, authorizeRoles("admin"), updateUser);
router.patch("/users/:id/toggle-status", verifyJWT, authorizeRoles("admin"), toggleUserStatus);
router.delete("/users/:id", verifyJWT, authorizeRoles("admin"), deleteUser);

// Claim management
router.get("/claims/pending", verifyJWT, authorizeRoles("admin"), getPendingClaims);
router.get("/claims/all", verifyJWT, authorizeRoles("admin"), getAllClaims);
router.post("/claims/verify", verifyJWT, authorizeRoles("admin"), verifyClaim);
router.post("/claims/reject", verifyJWT, authorizeRoles("admin"), rejectClaim);

// Insurance company management
router.post("/insurance-company", verifyJWT, authorizeRoles("admin"), createInsuranceCompany);
router.get("/insurance-companies", verifyJWT, authorizeRoles("admin"), getInsuranceCompanies);

// Policy Applications management
router.get("/policy-applications", verifyJWT, authorizeRoles("admin"), getPolicyApplications);
router.post("/policy-applications/:id/verify", verifyJWT, authorizeRoles("admin"), verifyPolicyApplication);
router.post("/policy-applications/:id/reject", verifyJWT, authorizeRoles("admin"), rejectPolicyApplication);

export default router;
