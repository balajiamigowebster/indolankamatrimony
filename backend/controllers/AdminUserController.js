const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingAdmin = await Admin.findOne({ where: { email } });
    if (existingAdmin) {
      return res
        .status(400)
        .json({ message: "Email address is already registered." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //  பதிவு செய்யப்பட்ட தேதியைத் தனித்தனி Fields-க்கு பிரித்தல்
    const now = new Date();
    const register_date = now.getDate();
    const register_month = now.getMonth();
    const register_year = now.getFullYear();

    const newAdmin = await Admin.create({
      name,
      email,
      password: hashedPassword,
      register_date,
      register_month,
      register_year,
    });

    res.status(201).json({
      message: "Admin registered successfully. Please login.",
      adminId: newAdmin.id,
    });
  } catch (error) {
    console.error("Admin Registration Error:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  //console.log(req.body);
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ where: { email } });
    if (!admin) {
      return res.status(401).json({ message: "Invalid Email or Password" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid Email or Password" });
    }

    const payload = {
      admin: {
        id: admin.id,
        email: admin.email,
      },
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("admin_auth_token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    res.status(200).json({
      message: "Login successful",
      adminId: admin.id,
      // Client-க்கு token-ஐ அனுப்பத் தேவையில்லை, ஏனெனில் அது Cookie-யில் உள்ளது.
    });
  } catch (error) {
    console.error("Admin Login Error:", error.message);
    res.status(500).json({ message: "Server error during login" });
  }
};

exports.getMe = async (req, res) => {
  //console.log("Get Me called");
  try {
    const admin = await Admin.findByPk(req.adminId, {
      attributes: {
        exclude: ["password"],
      },
    });

    if (!admin) {
      // இந்த பிழை பெரும்பாலும் JWT-யில் உள்ள ID தவறாக இருக்கும்போது நிகழும்
      return res.status(404).json({ message: "Admin not found." });
    }

    res.status(200).json({
      status: true,
      admin: admin,
    });
  } catch (error) {
    console.error("Get Me Error:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching admin details." });
  }
};

exports.logout = async (req, res) => {
  res.clearCookie("admin_auth_token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  res.status(200).json({ message: "Logout successful" });
};

exports.updateName = async (req, res) => {
  try {
    const { newName } = req.body;
    const adminId = req.adminId; // Auth Middleware-ல் இருந்து வருகிறது

    if (!newName || newName.trim() === "") {
      return res.status(400).json({ message: "New name cannot be empty." });
    }

    const admin = await Admin.findByPk(adminId);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found." });
    }

    admin.name = newName;
    await admin.save();

    res.status(200).json({
      message: "Admin name updated successfully.",
      name: admin.name,
    });
  } catch (error) {
    console.error("Admin Name Update Error:", error.message);
    res.status(500).json({ message: "Server error during name update." });
  }
};

// 2. Admin Email-ஐ மட்டும் அப்டேட் செய்ய

exports.updateEmail = async (req, res) => {
  try {
    const { newEmail } = req.body;
    const adminId = req.adminId;

    if (!newEmail) {
      return res.status(400).json({ message: "New email cannot be empty." });
    }
    // ✅ 1. புதிய Email ஏற்கெனவே உள்ளதா எனச் சரிபார்க்க

    const existingProfile = await Admin.findOne({
      where: {
        email: newEmail,
        id: {
          [Op.ne]: adminId,
        },
      },
    });

    if (existingProfile) {
      return res
        .status(400)
        .json({ message: "This email is already taken by another admin." });
    }

    const admin = await Admin.findByPk(adminId);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found." });
    }

    admin.email = newEmail;
    await admin.save();

    // 💡 பாதுகாப்பு காரணங்களுக்காக, ஈமெயில் மாற்றப்பட்டால், புதிய டோக்கன் அனுப்ப வேண்டும்
    // பழைய டோக்கனை invalidate செய்ய, log out செய்துவிடலாம்.

    res.clearCookie("admin_auth_token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    res.status(200).json({
      message:
        "Admin email updated successfully. Please log in again with the new email.",
      email: admin.email,
    });
  } catch (error) {
    console.error("Admin Email Update Error:", error.message);
    res.status(500).json({ message: "Server error during email update." });
  }
};

// 3. Admin Password-ஐ மட்டும் அப்டேட் செய்ய
exports.updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const adminId = req.adminId;

    if (!oldPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Please provide old and new passwords." });
    }

    const admin = await Admin.findByPk(adminId);

    if (!admin) {
      return res.status(404).json({ message: "Admin not found." });
    }

    // ✅ பழைய கடவுச்சொல்லைச் சரிபார்க்க
    const isMatch = await bcrypt.compare(oldPassword, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect old password." });
    }

    // ✅ புதிய கடவுச்சொல்லை ஹேஷ் (Hash) செய்ய
    const salt = await bcrypt.genSalt(10);
    admin.password = bcrypt.hash(newPassword, salt);

    // 💡 கடவுச்சொல் மாற்றப்பட்டதால், பாதுகாப்புக்காக Logout செய்யப்படுகிறது
    res.clearCookie("admin_auth_token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    res.status(200).json({
      message: "Password updated successfully. Please log in again.",
    });
  } catch (error) {
    console.error("Admin Password Update Error:", error.message);
    res.status(500).json({ message: "Server error during password update." });
  }
};

// 4. Admin Account-ஐ நீக்க (Delete)
exports.deleteAdmin = async (req, res) => {
  try {
    const adminId = req.adminId;
    const admin = await Admin.findByPk(adminId);

    if (!admin) {
      return res.status(404).json({ message: "Admin not found." });
    }

    // ✅ அட்மின் அக்கவுண்ட்டை நீக்க

    await admin.destroy();

    // 💡 அக்கவுண்ட் நீக்கப்பட்டதால், Cookie-ஐ நீக்க
    res.clearCookie("admin_auth_token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    res.status(200).json({
      message: "Admin account deleted successfully.",
    });
  } catch (error) {
    console.error("Admin Delete Error:", error.message);
    res.status(500).json({ message: "Server error during account deletion." });
  }
};

exports.getAllAdmins = async (req, res) => {
  try {
    // 💡 பாதுகாப்பு காரணங்களுக்காக, கடவுச்சொல்லை (password) தவிர்த்துவிட்டு மற்ற விவரங்களை மட்டுமே Fetch செய்கிறோம்.
    const admins = await Admin.findAll({
      attributes: {
        exclude: ["password"], // கடவுச்சொல்லை விலக்குகிறோம்
      },
    });

    if (!admins || admins.length === 0) {
      return res.status(404).json({ message: "No admins found." });
    }

    res.status(200).json({
      status: true,
      count: admins.length,
      admins: admins,
    });
  } catch (error) {
    console.error("Get All Admins Error:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching all admins." });
  }
};

// Super Admin-ஆல் மற்ற Admin-ன் பெயரை மாற்ற
exports.updateOtherAdminName = async (req, res) => {
  try {
    const { newName } = req.body;
    const adminIdToUpdate = req.params.id; // URL Parameter-ல் வரும் Admin ID

    if (!newName || newName.trim() === "") {
      return res.status(400).json({ message: "New name cannot be empty." });
    }

    // நாம் மாற்றப்போகும் Admin-ஐ கண்டுபிடிக்க
    const admin = await Admin.findByPk(adminIdToUpdate);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found." });
    }

    admin.name = newName;
    await admin.save();

    res.status(200).json({
      message: `Admin (ID: ${adminIdToUpdate}) name updated successfully by Super Admin.`,
      name: admin.name,
    });
  } catch (error) {
    console.error("Super Admin Update Other Admin Name Error:", error.message);
    res
      .status(500)
      .json({ message: "Server error during other admin name update." });
  }
};
