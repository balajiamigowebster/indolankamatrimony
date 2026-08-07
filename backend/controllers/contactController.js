const {
  transporter,
  adminMailOptions,
  userMailOptions,
} = require("../config/emailConfig");

exports.submitContactForm = async (req, res) => {
  const { name, email, phone, message } = req.body;

  // console.log(req.body);

  // 1. Basic Validation (All fields required)
  if (!name || !email || !phone || !message) {
    return res.status(400).json({
      success: false,
      message: "All fields (Name, Email, Phone, Message) are required.",
    });
  }

  // 2. Phone Number Validation (Only 10-digit numbers allowed)
  const phoneRegex = /^\d{10}$/;
  if (!phoneRegex.test(phone)) {
    return res.status(400).json({
      success: false,
      message: "Phone number must be exactly 10 digits.",
    });
  }

  // 3. Email Sending Logic
  try {
    const mailData = { name, email, phone, message };

    // A. Send email to Admin
    await transporter.sendMail(adminMailOptions(mailData));

    // B. Send acknowledgement email to User
    await transporter.sendMail(userMailOptions(mailData));

    // Success response
    res.status(200).json({
      success: true,
      message: "Enquiry submitted successfully! Admin and User emails sent.",
    });
  } catch (error) {
    console.error("Error sending email:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to submit enquiry due to a server error.",
      error: error.message,
    });
  }
};
