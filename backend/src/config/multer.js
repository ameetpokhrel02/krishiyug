import multer from "multer";

// Memory storage for Cloudinary upload
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // Images: jpeg, png
  if (file.fieldname === "images" || file.fieldname === "documentImage" || file.fieldname === "lalpurjaImage" || file.fieldname === "citizenshipImage") {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png" || file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only JPEG/PNG images or PDF allowed"), false);
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

<<<<<<< HEAD
// For policy application submission
export const uploadApplicationMedia = upload.fields([
  { name: "documentImage", maxCount: 1 },
  { name: "lalpurjaImage", maxCount: 1 },
  { name: "citizenshipImage", maxCount: 1 }
]);
=======
// For profile photo upload: only image, max 2MB
export const uploadProfilePhoto = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed!"), false);
    }
    cb(null, true);
  },
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
}).single("photo");
>>>>>>> fb67f51732b8590139f5668c3672eeb9407504f4
