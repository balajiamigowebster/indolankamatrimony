const express = require("express");
const {
  getProfileById,
  updateProfile,
  deleteProfile,
  getAllAdminProfiles,
} = require("../controllers/AdminController");
const cloudinaryUpload = require("../middleware/cloudinaryUploads");

const router = express.Router();

router.get("/profiles", getAllAdminProfiles);
router.get("/profiles/:id", getProfileById);
router.put("/profiles/:id", cloudinaryUpload.single("image"), updateProfile); // PUT /api/admin/profiles/123
router.delete("/profiles/:id", deleteProfile); // DELETE /api/admin/profiles/123

module.exports = router;
