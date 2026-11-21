const express = require("express");
const {
  getProfileById,
  updateProfile,
  deleteProfile,
  getAllAdminProfiles,
} = require("../controllers/AdminController");
const cloudinaryUpload = require("../middleware/cloudinaryUploads");

const router = express.Router();

const handleImageUpload = (req, res, next) => {
  cloudinaryUpload.fields([
    { name: "image", maxCount: 1 },
    { name: "gallery", maxCount: 10 },
  ])(req, res, (err) => {
    if (err) {
      console.error("❌ Profile image upload error:", err);
      return res.status(400).json({
        success: false,
        message:
          err.http_code === 401 ||
          err.message?.includes("Signature") ||
          err.message?.includes("secret")
            ? "Image upload failed: Cloudinary API secret is invalid or mismatched. Please check CLOUDINARY_API_SECRET."
            : `Image upload failed: ${err.message || "Failed to process image"}`,
      });
    }
    if (req.files && req.files.image && req.files.image.length > 0) {
      req.file = req.files.image[0];
    }
    next();
  });
};

router.get("/profiles", getAllAdminProfiles);
router.get("/profiles/:id", getProfileById);
router.put("/profiles/:id", handleImageUpload, updateProfile); // PUT /api/admin/profiles/123
router.delete("/profiles/:id", deleteProfile); // DELETE /api/admin/profiles/123

module.exports = router;
