import cloudinary from "../config/cloudinary.js";
import User from "../models/user.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import { isCloudinaryConfigured, getCloudinarySetupMessage } from "../utils/cloudinaryStatus.js";

const buildProfileResponse = (user) => ({
  _id: user._id,
  name: user.name,
  phoneNumber: user.phoneNumber,
  email: user.email,
  role: user.role,
  photo: user.photo || "",
  companyName: user.companyName || "",
  farmerDetails: user.farmerDetails || {},
});

const getUpdatableFields = (role) => {
  const commonFields = ["name", "phoneNumber"];

  if (role === "admin") {
    return ["name", "email"];
  }

  if (role === "insurance_company") {
    return [...commonFields, "email", "companyName"];
  }

  return [...commonFields, "companyName", "farmerDetails"];
};

export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json(new ApiResponse(404, null, "Profile not found"));
    }

    return res.status(200).json(
      new ApiResponse(200, buildProfileResponse(user), "Profile retrieved successfully")
    );
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const updateData = {};
    const allowedFields = getUpdatableFields(req.user.role);
    let warning = "";

    for (const field of allowedFields) {
      if (req.body[field] !== undefined && field !== "farmerDetails") {
        updateData[field] = req.body[field];
      }
    }

    // Ignore any photo value coming from the body; only accept uploaded file URLs.
    if (req.body.photo !== undefined) {
      delete req.body.photo;
    }

    if (req.body.farmerDetails) {
      try {
        const parsedFarmerDetails =
          typeof req.body.farmerDetails === "string"
            ? JSON.parse(req.body.farmerDetails)
            : req.body.farmerDetails;

        updateData.farmerDetails = parsedFarmerDetails;
      } catch (error) {
        return res.status(400).json(new ApiResponse(400, null, "Invalid farmer details payload"));
      }
    }

    // Handle photo upload if present
    if (req.file) {
      if (!isCloudinaryConfigured()) {
        warning = getCloudinarySetupMessage();
      } else {
        try {
          const result = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
              {
                folder: "profile_photos",
                resource_type: "image",
                public_id: `user_${userId}`,
                overwrite: true,
              },
              (error, result) => {
                if (error) return reject(error);
                resolve(result);
              }
            ).end(req.file.buffer);
          });
          updateData.photo = result.secure_url;
        } catch (uploadError) {
          const uploadMessage = uploadError?.message || "Unknown Cloudinary error";

          warning =
            uploadMessage.includes("cloud_name is disabled") ||
            uploadMessage.includes("403") ||
            uploadMessage.includes("Unauthorized")
              ? `${getCloudinarySetupMessage()} Current Cloudinary request was rejected with: ${uploadMessage}`
              : `Photo upload failed: ${uploadMessage}`;
        }
      }
    }

    if (updateData.email) {
      updateData.email = updateData.email.toLowerCase();
    }

    // Update user profile
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          ...buildProfileResponse(updatedUser),
          warning: warning || undefined,
        },
        warning ? "Profile updated with photo upload warning" : "Profile updated successfully"
      )
    );
  } catch (error) {
    next(error);
  }
};
