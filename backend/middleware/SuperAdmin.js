// Super Admin-க்கான பிரத்யேக Middleware
exports.superAdmin = async (req, res, next) => {
  // Super Admin-ன் Email ID
  const SUPER_ADMIN_EMAIL = "rockraja91338@gmail.com";
  try {
    // req.admin விவரம் protectAdminRoute-ல் இருந்து வருகிறது என வைத்துக் கொள்கிறோம்
    // Super Admin-ஆ இருக்க, முதலில் லாகின் (login) செய்திருக்க வேண்டும்

    if (!req.admin || !req.admin.email) {
      // protectAdminRoute சரியாக இயங்கவில்லை என்றால்
      return res.status(403).json({
        message: "Forbidden: Login required to check Super Admin role.",
      });
    }

    // Super Admin Email-ஐச் சரிபார்க்கிறது
    if (req.admin.email !== SUPER_ADMIN_EMAIL) {
      console.log(
        `Access denied for email: ${req.admin.email}. Not a Super Admin.`
      );
      return res.status(403).json({
        message:
          "Forbidden: You do not have Super Admin privileges to perform this action.",
      });
    }
    // Super Admin-ஆக இருந்தால், அடுத்த function-க்குச் செல்ல அனுமதிக்கவும்
    next();
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      message: "Authentication Error",
      error: error.message,
    });
  }
};
