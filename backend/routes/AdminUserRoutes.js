const express = require("express");
const {
  register,
  login,
  logout,
  getMe,
  updateName,
  updateEmail,
  updatePassword,
  deleteAdmin,
  getAllAdmins,
  updateOtherAdminName,
} = require("../controllers/AdminUserController");
const { protectAdminRoute } = require("../middleware/authMiddleware");
const { superAdmin } = require("../middleware/SuperAdmin");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

// ------------------------------------------------------------------
// 👤 PROTECTED GET ROUTE (பாதுகாக்கப்பட்ட விவரங்கள்)
// ------------------------------------------------------------------
router.get("/getMe", protectAdminRoute, getMe);

// அனைத்து Admins-ஐப் பார்க்க, ஒருவேளை இதற்கு Admin-ஆக இருக்கும் பயனரால் மட்டுமே பார்க்க முடியும் என்ற பாதுகாப்பு தேவைப்படலாம்.
router.get("/all", protectAdminRoute, superAdmin, getAllAdmins);

// 3. அனைத்து Admins-ஐயும் பார்க்க (Super Admin மட்டும்):
router.put(
  "/update/:id/name",
  protectAdminRoute,
  superAdmin,
  updateOtherAdminName
);

// ------------------------------------------------------------------
// 🛠️ PROTECTED UPDATE/DELETE ROUTES (பாதுகாக்கப்பட்ட நிர்வாக செயல்பாடுகள்)
// ------------------------------------------------------------------

// Admin Name-ஐ அப்டேட் செய்ய (PUT Request)
router.put("/update-name", protectAdminRoute, updateName);

// Admin Email-ஐ அப்டேட் செய்ய (PUT Request)
router.put("/update-email", protectAdminRoute, updateEmail);

// Admin Password-ஐ அப்டேட் செய்ய (PUT Request)
router.put("/update-password", protectAdminRoute, updatePassword);

// Admin Account-ஐ நீக்க (DELETE Request)
router.delete("/delete-admin", protectAdminRoute, deleteAdmin);

module.exports = router;
