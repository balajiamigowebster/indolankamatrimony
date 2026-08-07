const jwt = require("jsonwebtoken");

exports.protectAdminRoute = async (req, res, next) => {
  try {
    const token = req.cookies.admin_auth_token;
    if (!token) {
      // console.log("Unauthorized: No token provided");
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }

    // decoded payload-லிருந்து admin விவரங்களைப் பெறவும்
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded.admin;
    req.adminId = decoded.admin.id; // adminId-ஐ எளிதாகப் பயன்படுத்த

    next(); // அடுத்த Route function-க்கு செல்லவும்
  } catch (error) {
    // Token செல்லுபடியாகவில்லை (Invalid signature அல்லது Token காலாவதியாகிவிட்டது)

    return res
      .status(403)
      .json({ message: "Forbidden: Invalid or expired token" });
  }
};
