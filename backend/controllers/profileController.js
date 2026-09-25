const Profile = require("../models/profile");
const { Op, Sequelize } = require("sequelize");
const nodemailer = require("nodemailer");
const OtpTemp = require("../models/otptemp");

// exports.getAllProfiles = async (req, res) => {
//   try {
//     const profiles = await Profile.findAll({
//       order: [["id", "DESC"]],
//     });

//     // no data check
//     if (profiles.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: "No profiles found ❌",
//       });
//     }

//     console.log(profiles);

//     res.status(200).json({
//       success: true,
//       message: "All profiles fetched successfully ✅",
//       count: profiles.length,
//       data: profiles,
//     });
//   } catch (error) {
//     console.error("❌ Error fetching profiles:", error);
//     res.status(500).json({
//       success: false,
//       message: "Something went wrong while fetching profiles ❌",
//       error: error.message,
//     });
//   }
// };

// ✅ Get Single Profile by ID

// { 'user@example.com': { otp: '123456', profileData: { ... }, timestamp: 1678886400000 } }

exports.registerProfile = async (req, res) => {
  //console.log(req.file);
  console.log(req.body);
  try {
    // multer upload file path
    // const imagePath = req.file ? req.file.path : null;

    // ✅ Cloudinary-la ulla image data extract pannanum
    const imagePath = req.file ? req.file.path : null; // Full Cloudinary URL
    const publicId = req.file ? req.file.filename : null; // Unique ID for management

    //console.log(publicId);

    console.log(imagePath);
    console.log(req.body);

    let {
      mprofile,
      pname,
      dob,
      age,
      pbrith,
      tbrith,
      rasi,
      nakshatram,
      laknam,
      height,
      weight,
      color,
      maritalstatus,
      gender,
      education,
      occupation,
      annualincome,
      mothertongue,
      religion,
      caste,
      subcaste,
      fname,
      foccupation,
      mname,
      moccupation,
      sister,
      brother,
      children,
      rplace,
      whatsappno,
      email,
      addressdetails,
      phonenumber,
    } = req.body;

    if (Array.isArray(education)) {
      education = education.join(", ");
    }

    const now = new Date();
    const created_day = now.getDate().toString().padStart(2, "0");
    const created_month = (now.getMonth() + 1).toString().padStart(2, "0");
    const created_year = now.getFullYear().toString();

    // ✅ Check if email or phone number already exists

    // const existingProfile = await Profile.findOne({
    //   where: {
    //     // Sequelize OR condition
    //     [Op.or]: [{ email }, { phonenumber }],
    //   },
    // });

    // if (existingProfile) {
    //   // Decide which field is duplicated
    //   let message = "";
    //   if (
    //     existingProfile.email === email &&
    //     existingProfile.phonenumber === phonenumber &&
    //     existingProfile.whatsappno === whatsappno
    //   ) {
    //     message = "Email and phone number already exist";
    //   } else if (existingProfile.email === email) {
    //     message = "Email already exists";
    //   } else {
    //     message = "Phone number already exists";
    //   }

    //   // 🛑 Error: Profile already exists. Response sent here.
    //   return res.status(400).json({
    //     success: false,
    //     message,
    //   });
    // }

    // ✅ Create new profile (Step 1: Database Write)

    const newProfile = await Profile.create({
      mprofile,
      pname,
      dob,
      age,
      pbrith,
      tbrith,
      rasi,
      nakshatram,
      laknam,
      height,
      weight,
      color,
      maritalstatus,
      gender,
      education,
      occupation,
      annualincome,
      mothertongue,
      religion,
      caste,
      subcaste,
      fname,
      foccupation,
      mname,
      moccupation,
      sister,
      brother,
      children,
      rplace,
      whatsappno,
      email,
      addressdetails,
      phonenumber,
      // Cloudinary URL Image
      image: imagePath,
      // Cloudinary Public_id
      imagePublicId: publicId,
      created_day,
      created_month,
      created_year,
    });

    // ----------------------------------------------------------------------------------
    // ✅ NEW ORDER: Step 2: Send Email (MUST BE AHEAD OF final response)
    // ----------------------------------------------------------------------------------

    let emailMessage = "Profile registered successfully and confirmation email sent! ✅";

    try {
      await sendRegistrationEmails({
        newProfile,
        email: newProfile.email || email,
        pname: newProfile.pname || pname,
        mprofile: newProfile.mprofile || mprofile,
        phonenumber: newProfile.phonenumber || phonenumber,
      });
    } catch (emailError) {
      console.error(
        "WARNING: Email sending encountered an error:",
        emailError.message,
      );
      emailMessage =
        "Profile registered successfully! (Confirmation email may take a moment to deliver) ✅";
    }

    // ----------------------------------------------------------------------------------
    // ✅ FINAL STEP: Send success response to the client
    // ----------------------------------------------------------------------------------
    res.status(201).json({
      success: true,
      message: emailMessage, // Updated message based on email status
      imageUrl: imagePath,
      data: newProfile,
    });
  } catch (error) {
    console.error("Registration Error:", error.message);

    // // 🔥 Multer/Size/File Type error handling
    if (error instanceof multer.MulterError) {
      let message = "Image upload failed.";
      if (error.code === "LIMIT_FILE_SIZE") {
        message = "Image size exceeds the 500 KB limit! 😞";
      }
      return res.status(400).json({ success: false, message });
    }
    // File Filter error handling
    if (error.message.includes("Only image files are allowed")) {
      return res.status(400).json({ success: false, message: error.message });
    }

    // Handle Sequelize unique constraint error just in case
    if (error.name === "SequelizeUniqueConstraintError") {
      const field = error.errors[0].path; // email or phonenumber
      return res.status(400).json({
        success: false,
        message: `${field} already exists ❌`,
      });
    }

    res.status(500).json({
      success: false,
      message: "Profile registration failed ❌",
      error: error.message,
    });
  }
};

const otpStorage = {};
const OTP_EXPIRY_MINUTES = 5;

// 🔥 Utility Functions

const generateOTP = () => {
  // 6-digit OTP
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// local server and render base server base gmail send
// const createMailTransporter = () => {
//   return nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: "rockraja91338@gmail.com",
//       pass: "kgdngrwjibulofxh",
//     },
//   });
// };

// hosting cpanel custom mail send function with resilient fallback
const createMailTransporter = () => {
  const isBrokenUser =
    !process.env.EMAIL_USER ||
    process.env.EMAIL_USER.includes("indolanka_matrimony");
  const isBrokenPass =
    !process.env.EMAIL_PASS ||
    process.env.EMAIL_PASS === "F6rqA-yuWM@+r-GO";

  const host =
    isBrokenUser || isBrokenPass || process.env.EMAIL_HOST === "mail.indolankamatrimony.com"
      ? "mail.bitesngrill.com"
      : process.env.EMAIL_HOST || "mail.bitesngrill.com";

  const user = isBrokenUser
    ? "indolanka@bitesngrill.com"
    : process.env.EMAIL_USER;

  const pass = isBrokenPass
    ? "1{{9BR6{7PO%hrNv"
    : process.env.EMAIL_PASS;

  return nodemailer.createTransport({
    host: host,
    port: parseInt(process.env.EMAIL_PORT) || 465,
    secure: true,
    auth: {
      user: user,
      pass: pass,
    },
  });
};

// Helper to send registration confirmation email with Profile ID to user and admin
const sendRegistrationEmails = async ({ newProfile, email, pname, mprofile, phonenumber }) => {
  const profileId = newProfile.id;
  const isBrokenUser =
    !process.env.EMAIL_USER ||
    process.env.EMAIL_USER.includes("indolanka_matrimony");
  const senderEmail = isBrokenUser
    ? "indolanka@bitesngrill.com"
    : process.env.EMAIL_USER;

  const userMailOptions = {
    from: `Indolankamatrimony Services <${senderEmail}>`,
    to: email,
    subject: `🎉 Registration Successful! Your Profile ID is: ${profileId} - Indolankamatrimony`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden; background-color: #ffffff; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
        
        <div style="background: linear-gradient(135deg, #B02E2E 0%, #801818 100%); color: white; padding: 25px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px; letter-spacing: 1px;">Indolankamatrimony Services</h1>
          <p style="margin: 5px 0 0 0; font-size: 14px; opacity: 0.9;">Connecting Hearts, Building Families</p>
        </div>

        <div style="padding: 30px; color: #333333;">
          <h2 style="color: #B02E2E; margin-top: 0; font-size: 22px;">Hello ${pname}, Congratulations! 🎉</h2>
          
          <p style="font-size: 16px; line-height: 1.6; color: #555555;">
            Your Matrimony profile has been successfully registered with us! Please find your official <strong>Profile ID</strong> and registration details below.
          </p>

          <!-- Highlighted Profile ID Box -->
          <div style="background: #FFF5F5; border: 2px dashed #B02E2E; border-radius: 10px; padding: 20px; text-align: center; margin: 25px 0;">
            <p style="margin: 0 0 5px 0; font-size: 13px; font-weight: bold; color: #888888; text-transform: uppercase; letter-spacing: 1.5px;">Your Registered Profile ID</p>
            <div style="font-size: 38px; font-weight: 800; color: #B02E2E; letter-spacing: 2px; line-height: 1.2;">
              ${profileId}
            </div>
            <p style="margin: 8px 0 0 0; font-size: 13px; color: #666666;">
              Please save this Profile ID for logging in and future communications.
            </p>
          </div>

          <div style="background-color: #f8f9fa; border: 1px solid #e9ecef; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <p style="margin: 0 0 12px 0; font-weight: bold; font-size: 16px; color: #333333; border-bottom: 2px solid #B02E2E; padding-bottom: 6px;">
              Profile Details:
            </p>
            <table style="width: 100%; border-collapse: collapse; font-size: 15px;">
              <tr>
                <td style="padding: 8px 0; color: #666666; width: 40%;"><strong>Profile ID:</strong></td>
                <td style="padding: 8px 0; color: #B02E2E; font-weight: bold; font-size: 16px;">${profileId}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666666;"><strong>Full Name:</strong></td>
                <td style="padding: 8px 0; color: #333333; font-weight: 600;">${pname}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666666;"><strong>Registered Email:</strong></td>
                <td style="padding: 8px 0; color: #333333;">${email}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666666;"><strong>Phone Number:</strong></td>
                <td style="padding: 8px 0; color: #333333;">${phonenumber}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666666;"><strong>Profile For:</strong></td>
                <td style="padding: 8px 0; color: #333333;">${mprofile || "Myself"}</td>
              </tr>
            </table>
          </div>

          <p style="font-size: 15px; line-height: 1.6; color: #555555;">
            Our team will review your profile shortly. We will contact you soon on your registered phone number (<strong>${phonenumber}</strong>) to assist you with finding your perfect match.
          </p>

          <div style="text-align: center; margin: 30px 0 20px 0;">
            <a href="https://www.indolankamatrimony.com/profile/${profileId}" target="_blank" style="display: inline-block; padding: 14px 28px; background-color: #B02E2E; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 15px;">
              View Your Profile Online
            </a>
          </div>

          <p style="margin-top: 35px; font-size: 14px; color: #666666; line-height: 1.6;">
            Thank you for trusting Indolankamatrimony.<br>
            <strong>Warm Regards,</strong><br>
            The Indolankamatrimony Team
          </p>
        </div>

        <div style="background-color: #222222; color: #aaaaaa; padding: 15px; text-align: center; font-size: 12px;">
          <p style="margin: 0;">© ${new Date().getFullYear()} Indolankamatrimony Services. All rights reserved.</p>
        </div>
      </div>
    `,
  };

  const adminMailOptions = {
    from: `Indolankamatrimony Services <${senderEmail}>`,
    to: process.env.ADMIN_EMAIL || "rockerraja906@gmail.com",
    subject: `🔔 New Profile Registered: ${pname} (ID: ${profileId})`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; border: 1px solid #ffcc00; border-radius: 8px; overflow: hidden; background-color: #fffaf0;">
        <div style="background-color: #ffcc00; color: #333333; padding: 15px; text-align: center; border-bottom: 3px solid #ff9900;">
          <h2 style="margin: 0; font-size: 20px;">🚨 New Profile Registration Alert 🚨</h2>
        </div>
        <div style="padding: 20px; color: #333333;">
          <p style="font-size: 16px; font-weight: bold;">A new user has registered a profile. Profile ID: ${profileId}</p>
          <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
            <tr><td style="padding: 8px; border: 1px solid #e0e0e0; font-weight: bold;">Profile ID</td><td style="padding: 8px; border: 1px solid #e0e0e0; color: #B02E2E; font-weight: bold;">${profileId}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #e0e0e0; font-weight: bold;">Name</td><td style="padding: 8px; border: 1px solid #e0e0e0;">${pname}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #e0e0e0; font-weight: bold;">Email</td><td style="padding: 8px; border: 1px solid #e0e0e0;">${email}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #e0e0e0; font-weight: bold;">Phone</td><td style="padding: 8px; border: 1px solid #e0e0e0;">${phonenumber}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #e0e0e0; font-weight: bold;">Profile Type</td><td style="padding: 8px; border: 1px solid #e0e0e0;">${mprofile}</td></tr>
          </table>
          <div style="text-align: center; margin-top: 25px;">
            <a href="https://www.indolankamatrimony.com/profile/${profileId}" target="_blank" style="display: inline-block; padding: 10px 20px; background-color: #B02E2E; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">View Profile Online</a>
          </div>
        </div>
      </div>
    `,
  };

  const transporter = createMailTransporter();

  // Send to user first
  try {
    await transporter.sendMail(userMailOptions);
    console.log(`✅ Registration email with Profile ID ${profileId} sent to user: ${email}`);
  } catch (err) {
    console.error("⚠️ Primary email send failed, trying fallback:", err.message);
    try {
      const fallbackTransporter = nodemailer.createTransport({
        host: "mail.bitesngrill.com",
        port: 465,
        secure: true,
        auth: {
          user: "indolanka@bitesngrill.com",
          pass: "1{{9BR6{7PO%hrNv",
        },
      });
      await fallbackTransporter.sendMail({
        ...userMailOptions,
        from: "Indolankamatrimony Services <indolanka@bitesngrill.com>",
      });
      console.log(`✅ Fallback sent registration email with Profile ID ${profileId} to user: ${email}`);
    } catch (fbErr) {
      console.error("❌ Fallback email failed:", fbErr.message);
    }
  }

  // Send to admin
  try {
    await transporter.sendMail(adminMailOptions);
    console.log(`✅ Admin notification email sent for Profile ID ${profileId}`);
  } catch (adminErr) {
    console.error("⚠️ Admin notification email failed:", adminErr.message);
  }
};

// =========================================================
// API 1: sendOtp - (Form Submit -> OTP Generate & Send)
// =========================================================

exports.sendOtp = async (req, res) => {
  //console.log("SERVER OTP START");
  try {
    // Image and Profile Data extraction
    const imagePath = req.file ? req.file.path : null;
    const publicId = req.file ? req.file.path : null;

    let profileData = req.body;
    //console.log(profileData);

    let { email, phonenumber, pname } = profileData;

    // --- Data Validation and Pre-processing ---
    if (!email || !phonenumber) {
      return res.status(400).json({
        success: false,
        message: "Email and Phone number are required.",
      });
    }

    // Handle array fields like 'education'
    if (Array.isArray(profileData.education)) {
      profileData.education = profileData.education.join(", ");
    }

    // Add calculated fields to the profileData object
    const now = new Date();

    // Time for DB storage
    const time = now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    // Profile data-kku time/date-a add seiyungal (ungal original logic)
    profileData.created_day = now.getDate().toString().padStart(2, "0");
    profileData.created_month = (now.getMonth() + 1)
      .toString()
      .padStart(2, "0");
    profileData.created_year = now.getFullYear().toString();
    profileData.image = imagePath;
    profileData.imagePublicId = publicId;

    // --- Check if email or phone number already exists in DB ---

    // const existingProfile = await Profile.findOne({
    //   where: { [Op.or]: [{ email }, { phonenumber }] },
    // });

    //console.log(profileData);

    // if (existingProfile) {
    //   let message =
    //     existingProfile.email === email
    //       ? "Email already exists ❌"
    //       : "Phone number already exists ❌";
    //   return res.status(400).json({ success: false, message });
    // }

    // --- Generate OTP and Save Data Temporarily ---
    const otp = generateOTP();

    // otpStorage[email] = {
    //   otp: otp,
    //   profileData: profileData,
    //   timestamp: Date.now(),
    // };

    // 🛑 DATABASE FIX: In-memory otpStorage-kku badhilaaga OtpTemp table-la save seiyungal

    await OtpTemp.upsert({
      email: email,
      otp: otp,
      profileData: JSON.stringify(profileData), // JSON object-a string-aah maatri save seiyungal
      timestamp: Date.now(), // Current time in milliseconds for expiry check
      created_time: time,
      created_day: profileData.created_day,
      created_month: profileData.created_month,
      created_year: profileData.created_year,
    });

    // ------5min Otp Expire--------

    // setTimeout(() => {
    //   if (otpStorage[email] && otpStorage[email].otp === otp) {
    //     delete otpStorage[email];
    //     console.log(`INFO: OTP for ${email} expired and cleared.`);
    //   }
    // }, OTP_EXPIRY_MINUTES * 60 * 1000);

    // --- Send OTP Email ---

    const transporter = createMailTransporter();

    const mailOptions = {
      from: `Indolankamatrimony services <${process.env.EMAIL_USER}>`,
      // from: "rockraja91338@gmail.com",
      to: email,
      subject: "🔐 Your Profile Verification OTP - Indolankamatrimony",
      // 🎨 Attractive, Branded HTML UI
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
            
            <div style="background-color: #A91D3C; color: #ffffff; padding: 20px; text-align: center;">
                <h2 style="margin: 0; font-size: 24px;">Indolankamatrimony Services</h2>
            </div>

            <div style="padding: 30px; color: #333333;">
                
                <h3 style="margin-top: 0; font-size: 18px; color: #333333;">Hello ${pname},</h3>
                
                <p style="font-size: 16px; line-height: 1.5;">
                    Your One-Time Password (OTP) for profile confirmation is provided below. 
                    Please enter this code in your application to complete the registration process.
                </p>

                <div style="text-align: center; margin: 30px 0; padding: 15px 20px; border: 1px dashed #A91D3C; background-color: #FFF0F5; border-radius: 6px;">
                    <p style="font-size: 14px; color: #A91D3C; margin: 0 0 10px 0; font-weight: bold;">
                        Verification Code:
                    </p>
                    <h1 style="color: #4CAF50; font-size: 32px; font-weight: bold; letter-spacing: 5px; margin: 0;">
                        ${otp}
                    </h1>
                </div>

                <p style="font-size: 14px; line-height: 1.4; color: #777777; margin-top: 20px;">
                    ⚠️ This code will expire in **${OTP_EXPIRY_MINUTES} minutes**.
                </p>
                <p style="font-size: 14px; line-height: 1.4; color: #777777;">
                    For security reasons, please do not share this OTP with anyone.
                </p>
            </div>

            <div style="background-color: #f8f8f8; padding: 15px 30px; text-align: center; border-top: 1px solid #e0e0e0;">
                <p style="font-size: 12px; color: #999999; margin: 0;">
                    Thank you for choosing Indolankamatrimony services.
                </p>
            </div>
        </div>
    `,
    };
    let emailSent = false;
    try {
      await transporter.sendMail(mailOptions);
      emailSent = true;
    } catch (primaryMailErr) {
      console.error("Primary mail failed, trying fallback:", primaryMailErr.message);
      try {
        const fallbackTransporter = nodemailer.createTransport({
          host: "mail.bitesngrill.com",
          port: 465,
          secure: true,
          auth: {
            user: "indolanka@bitesngrill.com",
            pass: "1{{9BR6{7PO%hrNv",
          },
        });
        await fallbackTransporter.sendMail({
          ...mailOptions,
          from: "Indolankamatrimony services <indolanka@bitesngrill.com>",
        });
        emailSent = true;
      } catch (fallbackMailErr) {
        console.error("Fallback mail also failed:", fallbackMailErr.message);
      }
    }

    res.status(200).json({
      success: true,
      message: "OTP sent to your email successfully. Please check and verify.",
      emailSent: emailSent,
    });
  } catch (error) {
    console.error("Send OTP Error:", error);

    // Multer/File error handling
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "Image size exceeds the 500 KB limit!",
      });
    }
    if (
      error.message &&
      error.message.includes("Only image files are allowed")
    ) {
      return res.status(400).json({ success: false, message: error.message });
    }

    res.status(500).json({
      success: false,
      message: "Failed to send OTP or server error.",
      error: error.message,
    });
  }
};

// =========================================================
// API 2: verifyOtpAndRegister - (OTP Submit -> Verify & Save to DB)
// =========================================================

exports.verifyOtpAndRegister = async (req, res) => {
  const { email, otp } = req.body;

  if (!email && !otp) {
    return res
      .status(400)
      .json({ success: false, message: "Email and OTP are required." });
  }

  // 🛑 DATABASE FIX: Database-la irundhu record-a thedungal

  const storedRecord = await OtpTemp.findOne({
    where: {
      email: email,
    },
  });
  //const storedData = otpStorage[email];

  //console.log(storedData);

  // 1. Storage Data  (Expired or Not Sent)

  // if (!storedData) {
  //   return res.status(400).json({
  //     storedData,
  //     success: false,
  //     message:
  //       "Verification failed. OTP expired or not sent. Please resubmit profile form.",
  //   });
  // }

  // 1. Storage Data (Expired or Not Sent)
  if (!storedRecord) {
    // otpStorage-a thevaiyillai
    return res.status(400).json({
      success: false,
      message:
        "Verification failed. OTP expired or not sent. Please resubmit profile form.",
    });
  }

  // Stored data-vai JSON object-aah maatrungal

  const storedData = {
    otp: storedRecord.otp,
    profileData: JSON.parse(storedRecord.profileData),
    timestamp: storedRecord.timestamp,
  };

  const timeElapsed = Date.now() - storedData.timestamp;

  if (timeElapsed > OTP_EXPIRY_MINUTES * 60 * 1000) {
    // 🛑 Database expiry: Expired aanal, database-la irundhu record-a delete seiyungal
    await OtpTemp.destroy({ where: { email: email } });
    return res.status(400).json({
      success: false,
      message: "OTP has expired. Please resend the profile form.",
    });
  }

  // OTP Verifications Profile

  if (storedData.otp !== otp) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid OTP . Please try again." });
  }

  try {
    const profileData = storedData.profileData;

    const sanitizedData = {
      mprofile: profileData.mprofile || "Myself",
      pname: profileData.pname || "N/A",
      dob: profileData.dob || "N/A",
      age: profileData.age ? String(profileData.age) : "N/A",
      pbrith: profileData.pbrith || "N/A",
      tbrith: profileData.tbrith || "N/A",
      rasi: profileData.rasi || "N/A",
      nakshatram: profileData.nakshatram || "N/A",
      laknam: profileData.laknam || "N/A",
      height: profileData.height || "N/A",
      weight: profileData.weight || "N/A",
      color: profileData.color || "fair",
      maritalstatus: profileData.maritalstatus || "UnMarried",
      gender: profileData.gender || "N/A",
      education: profileData.education || "N/A",
      occupation: profileData.occupation || "N/A",
      annualincome: profileData.annualincome || "N/A",
      mothertongue: profileData.mothertongue || "Tamil",
      religion: profileData.religion || "Hindu",
      caste: profileData.caste || "N/A",
      subcaste: profileData.subcaste || "N/A",
      fname: profileData.fname || "N/A",
      foccupation: profileData.foccupation || "N/A",
      mname: profileData.mname || "N/A",
      moccupation: profileData.moccupation || "N/A",
      sister: profileData.sister !== undefined && profileData.sister !== null && profileData.sister !== "" ? String(profileData.sister) : "0",
      brother: profileData.brother !== undefined && profileData.brother !== null && profileData.brother !== "" ? String(profileData.brother) : "0",
      children: profileData.children || "No",
      rplace: profileData.rplace || "N/A",
      whatsappno: profileData.whatsappno || profileData.phonenumber || "N/A",
      email: profileData.email,
      addressdetails: profileData.addressdetails || "N/A",
      phonenumber: profileData.phonenumber,
      image: profileData.image || null,
      imagePublicId: profileData.imagePublicId || null,
      created_day: profileData.created_day || new Date().getDate().toString().padStart(2, "0"),
      created_month: profileData.created_month || (new Date().getMonth() + 1).toString().padStart(2, "0"),
      created_year: profileData.created_year || new Date().getFullYear().toString(),
    };

    const newProfile = await Profile.create(sanitizedData);

    // --- Final Success Response ---
    // res.status(201).json({
    //   success: true,
    //   message: "Profile verified and registered successfully!",
    //   imageUrl: newProfile.image,
    //   data: newProfile,
    // });

    // 🛑 Success: Database-la irundhu OtpTemp record-a delete seiyungal
    await OtpTemp.destroy({ where: { email: email } });

    // console.log("Successful Registered");
    let emailMessage = "Profile registered successfully and confirmation email sent! ✅";

    try {
      await sendRegistrationEmails({
        newProfile,
        email: newProfile.email || email,
        pname: newProfile.pname,
        mprofile: newProfile.mprofile,
        phonenumber: newProfile.phonenumber,
      });
    } catch (emailError) {
      console.error(
        "WARNING: Email sending encountered an error:",
        emailError.message,
      );
      emailMessage =
        "Profile registered successfully! (Confirmation email may take a moment to deliver) ✅";
    }

    if (typeof otpStorage !== "undefined") {
      delete otpStorage[email];
    }

    // ----------------------------------------------------------------------------------
    // ✅ FINAL STEP: Send success response to the client
    // ----------------------------------------------------------------------------------
    res.status(201).json({
      success: true,
      message: emailMessage, // Updated message based on email status
      imageUrl: newProfile.image,
      data: newProfile,
    });
  } catch (error) {
    console.error("❌ DB Registration Error:", error.message);

    // 🛑 Error aanal, database-la irundhu record-a delete seiyungal
    if (email) {
      await OtpTemp.destroy({ where: { email: email } });
    }

    res.status(500).json({
      success: false,
      message:
        "OTP verified, but profile save failed due to database error ❌. Please contact support.",
      error: error.message,
    });
  }
};

// exports.getAllProfiles = async (req, res) => {
//   //console.log("Api called");
//   try {
//     const { query } = req;
//     const search = query.search ? query.search.trim() : "";

//     let whereCondition = {};

//     // 🔍 If user types something in search bar
//     if (search) {
//       // if number => try to match id also
//       const isNumber = !isNaN(Number(search));

//       if (isNumber) {
//         whereCondition = {
//           [Op.or]: [
//             {
//               id: Number(search),
//             },
//             {
//               pname: {
//                 [Op.like]: `%${search}%`,
//               },
//             },
//           ],
//         };
//       } else {
//         whereCondition = {
//           pname: {
//             [Op.like]: `%${search}%`,
//           },
//         };
//       }
//     }

//     const profiles = await Profile.findAll({
//       where: whereCondition,
//       order: [["id", "DESC"]],
//     });

//     // ❌ No profiles found
//     if (profiles.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: search
//           ? `No profiles found for "${search}" ❌`
//           : "No profiles found ❌",
//       });
//     }

//     // ✅ Response success
//     res.status(200).json({
//       success: true,
//       message: search
//         ? `Profiles matching "${search}" fetched successfully ✅`
//         : "All profiles fetched successfully ✅",
//       count: profiles.length,
//       data: profiles,
//     });
//   } catch (error) {
//     console.error("❌ Error fetching profiles:", error);
//     console.error("❌ Error fetching profiles:", error);
//     res.status(500).json({
//       success: false,
//       message: "Something went wrong while fetching profiles ❌",
//       error: error.message,
//     });
//   }
// };

exports.getAllProfiles = async (req, res) => {
  console.log("GET ALL", req.query);
  try {
    const {
      search,
      gender,
      maritalStatus,
      caste,
      age_from,
      age_to,
      height_from,
      height_to,
      religion,
      mother_tongue,
    } = req.query;

    let whereCondition = {};

    // 🔍 SEARCH (ID + NAME)
    if (search) {
      const isNumber = !isNaN(Number(search));

      whereCondition[Op.or] = [
        {
          pname: {
            [Op.like]: `%${search}%`,
          },
        },
        ...(isNumber ? [{ id: Number(search) }] : []),
      ];
    }

    // 🚻 GENDER (MOST IMPORTANT)
    if (gender) {
      whereCondition.gender = gender;
    }

    // 💍 MARITAL STATUS
    if (maritalStatus) {
      whereCondition.maritalstatus = maritalStatus;
    }

    // ⚜️ CASTE
    if (caste) {
      whereCondition.caste = caste;
    }

    // 🎂 AGE RANGE
    if (age_from && age_to) {
      whereCondition.age = {
        [Op.between]: [Number(age_from), Number(age_to)],
      };
    }

    // 📏 HEIGHT RANGE (convert "5,5\"" → number)
    if (height_from && height_to) {
      whereCondition.height = {
        [Op.and]: [
          {
            [Op.gte]: height_from,
          },
          {
            [Op.lte]: height_to,
          },
        ],
      };
    }

    // 🛕 RELIGION
    if (religion) {
      whereCondition.religion = religion;
    }

    // 🌐 MOTHER TONGUE
    if (mother_tongue) {
      whereCondition.mothertongue = mother_tongue;
    }

    // ✅ FINAL QUERY
    const profiles = await Profile.findAll({
      where: whereCondition,
      order: [["id", "DESC"]],
    });

    // ❌ No data
    if (profiles.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No profiles found ❌",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profiles fetched successfully ✅",
      count: profiles.length,
      data: profiles,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error ❌",
    });
  }
};

// waiting for Filter Apply

// exports.getAllProfiles = async (req, res) => {
//   //console.log("Api called");
//   try {
//     const { query } = req; // Filters from frontend
//     const search = query.search ? query.search.trim() : "";
//     const gender = query.gender ? query.gender.trim() : "";
//     const maritalStatus = query.maritalStatus ? query.maritalStatus.trim() : "";
//     const caste = query.caste ? query.caste.trim() : ""; // ✅ New Caste Filter

//     let whereCondition = {}; // 1. 🔍 Search Filter (pname and id)

//     if (search) {
//       // முழுமையான எண் சரிபார்ப்பு
//       const isNumber = /^\d+$/.test(search);

//       const searchConditions = {
//         [Op.or]: [
//           {
//             // 1. Name Search (Partial match anywhere)
//             pname: {
//               [Op.like]: `%${search}%`,
//             },
//           }, // 💥 ID Search: Exact Match for Speed
//           // (Partial match-க்கு பதில் Exact Number Match பயன்படுத்தப்பட்டுள்ளது)
//           isNumber && {
//             id: Number(search), // 💡 ID-ஐ Number-ஆக மாற்றி Exact match செய்கிறோம்.
//           },
//         ].filter(Boolean), // empty objects-ஐ remove பண்ணுவதற்கு
//       };
//       whereCondition = { ...whereCondition, ...searchConditions };
//     } // 2. 🚻 Gender Filter

//     if (gender) {
//       whereCondition.gender = gender;
//     } // 3. 💍 Marital Status Filter

//     if (maritalStatus) {
//       whereCondition.maritalstatus = maritalStatus; // DB field: maritalstatus
//     } // 4. ⚜️ Caste Filter

//     if (caste) {
//       whereCondition.caste = caste; // DB field: caste
//     } //console.log("Final Sequelize whereCondition:", whereCondition);

//     const profiles = await Profile.findAll({
//       // whereCondition empty-a irundhaa, ellathaiyum edukkum. Illaati filters apply aagum.
//       where: whereCondition,
//       order: [["id", "DESC"]],
//     }); // ❌ No profiles found

//     if (profiles.length === 0) {
//       // User-kku nalla message kaatta, current filters-ஐயும் use panni message create pannalaam.
//       const filterText = [search, gender, maritalStatus, caste].filter(
//         (f) => f
//       );
//       const message =
//         filterText.length > 0
//           ? `No profiles found matching the current filters: ${filterText.join(
//               ", "
//             )} ❌`
//           : "No profiles found ❌";

//       return res.status(404).json({
//         success: false,
//         message: message,
//       });
//     } // ✅ Response success

//     res.status(200).json({
//       success: true,
//       message: "Profiles fetched successfully based on filters ✅",
//       count: profiles.length,
//       data: profiles,
//     });
//   } catch (error) {
//     console.error("❌ Error fetching profiles:", error);
//     res.status(500).json({
//       success: false,
//       message: "Something went wrong while fetching profiles ❌",
//       error: error.message,
//     });
//   }
// };

exports.getProfileById = async (req, res) => {
  try {
    const { id } = req.params;
    const profile = await Profile.findByPk(id);

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: `Profile with ID ${id} not found ❌`,
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile details fetched successfully ✅",
      data: profile,
    });
  } catch (error) {
    console.error("❌ Error fetching profile by ID:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while fetching profile details ❌",
      error: error.message,
    });
  }
};

// exports.searchMatches = async (req, res) => {
//   console.log(req.query);

// Not included ID based search
//   try {
//     const { query } = req;

//     // --- 1. Basic Filters Parsing ---
//     const looking_for = query.looking_for ? query.looking_for.trim() : ""; // Partner Gender
//     const religion = query.religion ? query.religion.trim() : "";
//     const caste = query.caste ? query.caste.trim() : "";
//     const mother_tongue = query.mother_tongue ? query.mother_tongue.trim() : "";
//     // --- 2. Range Filters Parsing (Age) ---
//     const age_from = Number(query.age_from);
//     const age_to = Number(query.age_to);

//     // --- 3. Single Height Filter Parsing ---
//     const selected_height = query.selected_height
//       ? query.selected_height.trim()
//       : "";

//     let whereCondition = {};

//     // ---------------------------------------------
//     // 🔍 FILTER LOGIC
//     // ---------------------------------------------

//     // 1. 🚻 Gender Filter
//     if (looking_for) {
//       if (looking_for.toLowerCase() === "bride") {
//         whereCondition.gender = "Female";
//       } else if (looking_for.toLowerCase() === "groom") {
//         whereCondition.gender = "Male";
//       } else {
//         whereCondition.gender = looking_for;
//       }
//     }

//     // 2. 🎂 Age Range Filter
//     if (
//       !isNaN(age_from) &&
//       !isNaN(age_to) &&
//       age_from > 0 &&
//       age_to >= age_from
//     ) {
//       whereCondition.age = {
//         [Op.between]: [`${age_from}`, `${age_to}`],
//       };
//     }

//     // 3. 📏 Single Height Exact Match Filter 🎯

//     if (selected_height) {
//       whereCondition.height = selected_height;
//     }

//     // 4. ⚜️ Caste and Religion Filters (Direct Match)

//     if (caste) {
//       whereCondition.caste = caste;
//     }
//     if (religion) {
//       whereCondition.religion = religion;
//     }

//     // 5. 🗣️ Mother Tongue Filter (NEW Logic)
//     // Query-la 'mother_tongue' value irundhaa, adha use panni filter pannum.

//     if (mother_tongue) {
//       // Unga DB field name: mothertongue
//       whereCondition.mothertongue = mother_tongue;
//     }

//     // --- 3. Execute Query ---

//     const profiles = await Profile.findAll({
//       where: whereCondition,
//       order: [["id", "DESC"]],
//       // ... pagination settings
//     });

//     // --- 4. Handle Results ---
//     if (profiles.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: "No matches found for your partner preference 💔",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Potential matches fetched successfully! ✨",
//       count: profiles.length,
//       data: profiles,
//     });
//   } catch (error) {
//     console.error("❌ Error fetching matches:", error.message);
//     res.status(500).json({
//       success: false,
//       message: "Something went wrong while searching for matches ❌",
//       error: error.message,
//     });
//   }
// };

exports.searchMatches = async (req, res) => {
  try {
    const { query } = req;

    const looking_for = query.looking_for?.trim();
    const religion = query.religion?.trim();
    const caste = query.caste?.trim();
    const mother_tongue = query.mother_tongue?.trim();
    const profile_id = query.profile_id?.trim();

    const age_from = Number(query.age_from);
    const age_to = Number(query.age_to);

    const height_from = Number(query.height_from);
    const height_to = Number(query.height_to);

    let whereCondition = {};

    // ✅ ID PRIORITY
    if (profile_id) {
      whereCondition.id = profile_id;
    } else {
      // ✅ GENDER
      if (looking_for) {
        whereCondition.gender =
          looking_for.toLowerCase() === "bride" ? "Female" : "Male";
      }

      // ✅ AGE FILTER (ONLY IF NOT DEFAULT)
      if (
        age_from &&
        age_to &&
        !(age_from === 18 && age_to === 50) // 🔥 IMPORTANT
      ) {
        whereCondition.age = {
          [Op.between]: [age_from, age_to],
        };
      }

      // ✅ HEIGHT FILTER (ONLY IF NOT DEFAULT)
      if (
        height_from &&
        height_to &&
        !(height_from === 137 && height_to === 213) // 🔥 IMPORTANT
      ) {
        const heightSql = `CAST(REPLACE(SUBSTRING_INDEX(height, ' - ', -1), 'cm', '') AS UNSIGNED)`;

        whereCondition[Op.and] = [
          ...(whereCondition[Op.and] || []),
          Profile.sequelize.literal(`${heightSql} >= ${height_from}`),
          Profile.sequelize.literal(`${heightSql} <= ${height_to}`),
        ];
      }

      // ✅ OTHER FILTERS
      if (caste) whereCondition.caste = caste;
      if (religion) whereCondition.religion = religion;
      if (mother_tongue) whereCondition.mothertongue = mother_tongue;
    }

    const profiles = await Profile.findAll({
      where: whereCondition,
      order: [["id", "DESC"]],
    });

    if (!profiles.length) {
      return res.status(404).json({
        success: false,
        message: "No matches found ❌",
      });
    }

    res.status(200).json({
      success: true,
      count: profiles.length,
      data: profiles,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error ❌",
    });
  }
};
