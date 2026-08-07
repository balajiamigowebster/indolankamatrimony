const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
const path = require("path");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Cloudinary Storage Setup
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "IndolankaMatrimonyProfiles", // Cloudinary folder name
    // Dynamic Public ID: (Folder Name + file.fieldname + Date)
    public_id: (req, file) => file.fieldname + "-" + Date.now(),
    // Keep original format or convert to optimize storage
    format: async (req, file) =>
      path.extname(file.originalname).substring(1) || "jpg",
  },
});

// ✅ File filter (Images only)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp|avif/;
  const ext = path.extname(file.originalname).toLowerCase();
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && allowedTypes.test(ext)) {
    cb(null, true);
  } else {
    // Note: Multer will catch this error message
    cb(
      new Error(
        "Only JPEG, JPG, PNG, GIF, WEBP OR AVIF  image files are allowed! ❌"
      )
    );
  }
};

// ✅ Multer Configuration with 500 KB Limit
const cloudinaryUpload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 500 * 1024,
  },
});

module.exports = cloudinaryUpload;
