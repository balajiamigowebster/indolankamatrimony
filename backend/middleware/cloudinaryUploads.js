const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const path = require("path");
const fs = require("fs");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadsDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// ✅ Disk Storage for safe local capture before optional Cloudinary upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || ".jpg";
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "image-" + uniqueSuffix + ext);
  },
});

// ✅ File filter (Images only)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp|avif/;
  const ext = path.extname(file.originalname).toLowerCase();
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype || allowedTypes.test(ext)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only JPEG, JPG, PNG, GIF, WEBP OR AVIF image files are allowed! ❌"
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
