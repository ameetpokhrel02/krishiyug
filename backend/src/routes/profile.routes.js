import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { uploadProfilePhoto } from "../config/multer.js";
import { getProfile, updateProfile } from "../controllers/profile.controller.js";

const router = express.Router();

// GET /api/profile - Get current user profile (all roles)
router.get("/", verifyJWT, getProfile);

// PATCH /api/profile - Update user profile (all roles)
router.patch("/", verifyJWT, uploadProfilePhoto, updateProfile);

export default router;
