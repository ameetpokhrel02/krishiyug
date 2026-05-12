import multer from "multer";

// Memory storage for Cloudinary upload
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // Images: jpeg, png
  if (file.fieldname === "images") {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      cb(null, true);
    } else {
      cb(new Error("Only JPEG/PNG images allowed"), false);
    }
  }
  // Video: mp4 only
  else if (file.fieldname === "video") {
    if (file.mimetype === "video/mp4") {
      cb(null, true);
    } else {
      cb(new Error("Only MP4 video allowed"), false);
    }
  } else {
    cb(new Error("Invalid field name"), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB max (for video)
  },
  fileFilter: fileFilter,
});

// For claim submission: fields 'images' (max 5) and 'video' (max 1)
export const uploadClaimMedia = upload.fields([
  { name: "images", maxCount: 5 },
  { name: "video", maxCount: 1 },
]);
