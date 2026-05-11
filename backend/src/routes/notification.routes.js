import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import Notification from "../models/notification.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();

// Get user's notifications
router.get(
  "/",
  verifyJWT,
  asyncHandler(async (req, res) => {
    const { read } = req.query;

    const filter = { userId: req.user._id };
    if (read !== undefined) {
      filter.read = read === "true";
    }

    const notifications = await Notification.find(filter)
      .populate("claimId", "status")
      .sort("-createdAt")
      .limit(50);

    res.status(200).json(
      new ApiResponse(200, notifications, "Notifications retrieved successfully")
    );
  })
);

// Mark notification as read
router.patch(
  "/:notificationId/read",
  verifyJWT,
  asyncHandler(async (req, res) => {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.notificationId, userId: req.user._id },
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }

    res.status(200).json(
      new ApiResponse(200, notification, "Notification marked as read")
    );
  })
);

// Mark all notifications as read
router.patch(
  "/mark-all-read",
  verifyJWT,
  asyncHandler(async (req, res) => {
    await Notification.updateMany(
      { userId: req.user._id, read: false },
      { read: true }
    );

    res.status(200).json(
      new ApiResponse(200, null, "All notifications marked as read")
    );
  })
);

export default router;
