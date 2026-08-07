const { Op } = require("sequelize");
const Profile = require("../models/profile");
const cloudinary = require("cloudinary").v2; // Image delete panna Cloudinary venum

// =========================================================
// API 1: getAllProfiles - Ellā profiles-um fetch panna
// =========================================================

//Old GetAllProfiles
// exports.getAllProfiles = async (req, res) => {
//   try {
//     const { search } = req.query;

//     let whereCondition = {};

//     // Search logic (pname, id, phonenumber, email - STARTING WITH)
//     if (search && search.trim()) {
//       const trimmedSearch = search.trim();

//       whereCondition = {
//         [Op.or]: [
//           // 1. Search by Name (pname) - Starts with
//           {
//             pname: {
//               [Op.like]: `${trimmedSearch}%`, // Starts with logic
//             },
//           }, // 2. Search by Email - Starts with
//           {
//             email: {
//               [Op.like]: `${trimmedSearch}%`, // Starts with logic
//             },
//           }, // 3. Search by Phone Number - Starts with
//           {
//             phonenumber: {
//               [Op.like]: `${trimmedSearch}%`, // Starts with logic
//             },
//           }, // 4. Search by ID - Starts with (ID is converted to String for LIKE operator)
//           {
//             [Op.and]: [
//               // Sequelize-ல் ID-ஐ String-ஆக மாற்றி search செய்ய
//               Profile.sequelize.where(
//                 Profile.sequelize.cast(Profile.sequelize.col("id"), "CHAR"),
//                 {
//                   [Op.like]: `${trimmedSearch}%`,
//                 }
//               ),
//             ],
//           },
//         ],
//       };
//     }

//     const profiles = await Profile.findAll({
//       where: whereCondition,
//       order: [["id", "DESC"]], // New profiles first
//     });

//     if (profiles.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: search
//           ? `No profiles found starting with "${search}" ❌`
//           : "No profiles found ❌",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Profiles fetched successfully for Admin Panel ✅",
//       count: profiles.length,
//       data: profiles,
//     });
//   } catch (error) {
//     console.error("❌ Admin GetAllProfiles Error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch profiles ❌",
//       error: error.message,
//     });
//   }
// };

// exports.getAllProfiles = async (req, res) => {
//   try {
//     const { search, gender, maritalStatus } = req.query;

//     let whereCondition = [];

//     // 1. GENDER Filter Logic
//     if (gender && gender !== "All" && gender.trim()) {
//       whereCondition.push({
//         gender: gender, // Exact match
//       });
//     }

//     // 2. MARITAL STATUS Filter Logic
//     if (maritalStatus && maritalStatus !== "All" && maritalStatus.trim()) {
//       whereCondition.push({
//         maritalstatus: maritalStatus, // Exact match (DB column name 'maritalstatus' nu assume panrom)
//       });
//     }

//     // Search logic (pname, id, phonenumber, email - STARTING WITH)
//     if (search && search.trim()) {
//       const trimmedSearch = search.trim();

//       whereCondition = {
//         [Op.or]: [
//           // 1. Search by Name (pname) - Starts with
//           {
//             pname: {
//               [Op.like]: `${trimmedSearch}%`, // Starts with logic
//             },
//           }, // 2. Search by Email - Starts with
//           {
//             email: {
//               [Op.like]: `${trimmedSearch}%`, // Starts with logic
//             },
//           }, // 3. Search by Phone Number - Starts with
//           {
//             phonenumber: {
//               [Op.like]: `${trimmedSearch}%`, // Starts with logic
//             },
//           }, // 4. Search by ID - Starts with (ID is converted to String for LIKE operator)
//           {
//             [Op.and]: [
//               // Sequelize-ல் ID-ஐ String-ஆக மாற்றி search செய்ய
//               Profile.sequelize.where(
//                 Profile.sequelize.cast(Profile.sequelize.col("id"), "CHAR"),
//                 {
//                   [Op.like]: `${trimmedSearch}%`,
//                 }
//               ),
//             ],
//           },
//         ],
//       };
//     }

//     // Final Where Clause: Ellā conditions-um Op.and-la combine pannuvom

//     let finalWhere =
//       whereCondition.length > 0 ? { [Op.and]: whereCondition } : {};

//     const profiles = await Profile.findAll({
//       where: finalWhere,
//       order: [["id", "DESC"]], // New profiles first
//     });

//     if (profiles.length === 0) {
//       let message = "No profiles found ❌";
//       if (search || gender || maritalStatus) {
//         // Custom message for filtered searches
//         const filterList = [
//           search && `Search: "${search}"`,
//           gender && `Gender: ${gender}`,
//           maritalStatus && `Status: ${maritalStatus}`,
//         ]
//           .filter(Boolean)
//           .join(" | ");
//         message = `No profiles found matching criteria: ${filterList} 🔎`;
//       }
//       return res.status(404).json({
//         success: false,
//         message: message,
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Profiles fetched successfully for Admin Panel ✅",
//       count: profiles.length,
//       data: profiles,
//     });
//   } catch (error) {
//     console.error("❌ Admin GetAllProfiles Error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch profiles ❌",
//       error: error.message,
//     });
//   }
// };

exports.getAllAdminProfiles = async (req, res) => {
  //console.log(req.query);
  //console.log("Get all profile run");
  try {
    const { search, gender, maritalStatus } = req.query;
    let whereCondition = [];

    // 1️⃣ Gender Filter
    if (gender && gender !== "All" && gender.trim()) {
      whereCondition.push({ gender: gender });
    }

    // 2️⃣ Marital Status Filter
    if (maritalStatus && maritalStatus !== "All" && maritalStatus.trim()) {
      whereCondition.push({ maritalstatus: maritalStatus });
    }

    // 3️⃣ Search Filter (pname, id, phonenumber, email)
    if (search && search.trim()) {
      const trimmedSearch = search.trim();
      whereCondition.push({
        [Op.or]: [
          // Name
          { pname: { [Op.like]: `${trimmedSearch}%` } },
          // Email
          { email: { [Op.like]: `${trimmedSearch}%` } },
          // Phone number
          { phonenumber: { [Op.like]: `${trimmedSearch}%` } },
          // ID (Convert to string)
          {
            [Op.and]: [
              Profile.sequelize.where(
                Profile.sequelize.cast(Profile.sequelize.col("id"), "CHAR"),
                { [Op.like]: `${trimmedSearch}%` }
              ),
            ],
          },
        ],
      });
    }

    // 4️⃣ Final where condition
    const finalWhere =
      whereCondition.length > 0 ? { [Op.and]: whereCondition } : {};

    // 5️⃣ Fetch profiles
    const profiles = await Profile.findAll({
      where: finalWhere,
      order: [["id", "DESC"]], // latest first
    });

    // 6️⃣ If no profiles found
    if (profiles.length === 0) {
      let message = "No profiles found ❌";
      if (search || gender || maritalStatus) {
        const filterList = [
          search && `Search: "${search}"`,
          gender && `Gender: ${gender}`,
          maritalStatus && `Status: ${maritalStatus}`,
        ]
          .filter(Boolean)
          .join(" | ");
        message = `No profiles found matching criteria: ${filterList} 🔎`;
      }
      return res.status(404).json({
        success: false,
        message,
      });
    }

    // 7️⃣ Success response
    res.status(200).json({
      success: true,
      message: "Profiles fetched successfully for Admin Panel ✅",
      count: profiles.length,
      data: profiles,
    });
  } catch (error) {
    console.error("❌ Admin GetAllProfiles Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch profiles ❌",
      error: error.message,
    });
  }
};

// ---------------------------------------------------------
// =========================================================
// API 2: getProfileById - (GET /api/admin/profiles/:id)
// =========================================================

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
      message: `Profile ID ${id} fetched successfully ✅`,
      data: profile,
    });
  } catch (error) {
    console.error("❌ Admin GetProfileById Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch profile details ❌",
      error: error.message,
    });
  }
};

// ---------------------------------------------------------
// =========================================================
// API 3: updateProfile - (PUT /api/admin/profiles/:id)
// =========================================================

// exports.updateProfile = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const updateData = req.body;

//     const profile = await Profile.findByPk(id);

//     if (!profile) {
//       return res.status(404).json({
//         success: false,
//         message: `Profile with ID ${id} not found for update ❌`,
//       });
//     }

//     console.log(typeof updateData.education);
//     console.log(updateData.education);

//     // 'education' array-a string-a convert panna (if needed)
//     if (Array.isArray(updateData.education)) {
//       console.log("Education is Array True");
//       updateData.education = updateData.education.join(", ");
//     }

//     //console.log(updateData.education);

//     if (req.file) {
//       // 1. Old Image Deletion
//       const oldPublicId = profile.imagePublicId;
//       if (imagePublicId) {
//         await cloudinary.uploader.destroy(oldPublicId).catch((err) => {
//           console.error(
//             "Old Cloudinary image deletion failed during update:",
//             err
//           );
//         });
//       }

//       // 2. New image details from Multer/Cloudinary middleware
//       updateData.image = req.file.path; // Cloudinary URL (path is where Multer stores the URL)
//       updateData.imagePublicId = req.file.filename; // Cloudinary Public ID (filename is where Multer stores the Public ID)
//     } else if (updateData.image === "N/A") {
//       // Front-end-ல image-ஐ நீக்கியிருந்தால் ('N/A' என body-ல் அனுப்பினால்)
//       const oldPublicId = profile.imagePublicId;
//       if (oldPublicId) {
//         await cloudinary.uploader.destroy(oldPublicId).catch((err) => {
//           console.error("Old Cloudinary image deletion failed:", err);
//         });
//       }

//       updateData.image = "N/A";
//       updateData.imagePublicId = null;
//     }

//     // Update the profile in the database
//     const [updatedRowsCount] = await Profile.update(updateData, {
//       where: {
//         id,
//       },
//     });

//     if (updatedRowsCount === 0) {
//       return res.status(400).json({
//         success: false,
//         message: "Update failed or no changes were made.",
//       });
//     }

//     // Updated profile-a eduthu anuppunga

//     const updatedProfile = await Profile.findByPk(id);

//     res.status(200).json({
//       success: true,
//       message: `Profile ID ${id} updated successfully by Admin ✅`,
//       data: updatedProfile,
//     });
//   } catch (error) {
//     console.error("❌ Admin UpdateProfile Error:", error);
//     // Sequelize unique constraint error handling (e.g., duplicate email/phone)
//     if (error.name === "SequelizeUniqueConstraintError") {
//       const field = error.errors[0].path;
//       return res.status(400).json({
//         success: false,
//         message: `Update failed: ${field} already exists ❌`,
//       });
//     }
//     res.status(500).json({
//       success: false,
//       message: "Failed to update profile ❌",
//       error: error.message,
//     });
//   }
// };

exports.updateProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const updateData = req.body;

    //console.log(updateData);

    const profile = await Profile.findByPk(id);

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: `Profile with ID ${id} not found for update ❌`,
      });
    }

    // console.log(typeof updateData.education); // Debug purposes
    // console.log(updateData.education);        // Debug purposes

    // 🚨 FIX: Stringified Array-a Actual Array-a Maathurathu (Form-data issue)
    if (typeof updateData.education === "string") {
      try {
        // 1. JSON.parse panni Array-a maatha try pannalam (e.g., '["B.Sc","M.Sc"]')
        const parsedEducation = JSON.parse(updateData.education);

        if (Array.isArray(parsedEducation)) {
          updateData.education = parsedEducation; // ✅ Success! Ippo updateData.education oru Array
        }
      } catch (e) {
        // 2. JSON format thappa irundha (e.g., 'B.Sc, M.Sc' nu irundha) - Comma-split pannalaam
        // Array illaama, comma-separated string-a mattum anuppinaalum, idhu handle pannum.
        if (updateData.education.includes(",")) {
          updateData.education = updateData.education
            .split(",")
            .map((item) => item.trim().replace(/['"]/g, "")); // Quotes/spaces-a remove panrathu safe
        }
      }
    }

    // 'education' array-a database-ku string-a convert panna (Model type STRING)
    if (Array.isArray(updateData.education)) {
      console.log("Education is Array True and is being converted to String");
      updateData.education = updateData.education.join(", "); // ➡️ Ippo 'B.Sc, LT, M.Sc' string-a database-ku poidum
    }

    // console.log(updateData.education); // Final string value

    if (req.file) {
      // 1. Old Image Deletion
      const oldPublicId = profile.imagePublicId;
      // The variable name in your original code was incorrect: `if (imagePublicId)` should be `if (oldPublicId)`
      if (oldPublicId) {
        await cloudinary.uploader.destroy(oldPublicId).catch((err) => {
          console.error(
            "Old Cloudinary image deletion failed during update:",
            err
          );
        });
      }

      // 2. New image details from Multer/Cloudinary middleware
      updateData.image = req.file.path;
      updateData.imagePublicId = req.file.filename;
    } else if (updateData.image === "N/A") {
      // Front-end-ல image-ஐ நீக்கியிருந்தால் ('N/A' என body-ல் அனுப்பினால்)
      const oldPublicId = profile.imagePublicId;
      if (oldPublicId) {
        await cloudinary.uploader.destroy(oldPublicId).catch((err) => {
          console.error("Old Cloudinary image deletion failed:", err);
        });
      }

      updateData.image = "N/A";
      updateData.imagePublicId = null;
    }

    // Update the profile in the database
    const [updatedRowsCount] = await Profile.update(updateData, {
      where: {
        id,
      },
    });

    if (updatedRowsCount === 0) {
      return res.status(400).json({
        success: false,
        message: "Update failed or no changes were made.",
      });
    }

    // Updated profile-a eduthu anuppunga

    const updatedProfile = await Profile.findByPk(id);

    // ⚠️ Response-la array-va varuratha thadukka (if needed - Option 2 from last response)
    // Database-la save aana string-a thaan findByPk vaangum. Aana, oru vela sequelize type casting-la
    // thiruppi array-va vandhaa, adha String-a maathunga.
    if (Array.isArray(updatedProfile.education)) {
      updatedProfile.education = updatedProfile.education.join(", ");
    }

    console.log(updatedProfile);

    res.status(200).json({
      success: true,
      message: `Profile ID ${id} updated successfully by Admin ✅`,
      data: updatedProfile,
    });
  } catch (error) {
    console.error("❌ Admin UpdateProfile Error:", error);
    // Sequelize unique constraint error handling (e.g., duplicate email/phone)
    if (error.name === "SequelizeUniqueConstraintError") {
      const field = error.errors[0].path;
      return res.status(400).json({
        success: false,
        message: `Update failed: ${field} already exists ❌`,
      });
    }
    res.status(500).json({
      success: false,
      message: "Failed to update profile ❌",
      error: error.message,
    });
  }
};

// ---------------------------------------------------------
// =========================================================
// API 4: deleteProfile - (DELETE /api/admin/profiles/:id)
// =========================================================

exports.deleteProfile = async (req, res) => {
  const { id } = req.params;

  try {
    const profile = await Profile.findByPk(id);

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: `Profile with ID ${id} not found for deletion ❌`,
      });
    }

    // 🔥 Cloudinary-la irukkura image-a delete panna
    const imagePublicId = profile.imagePublicId;

    // if (imagePublicId) {
    //    const result = cloudinary.uploader
    //     .destroy(imagePublicId)
    //     .then((result) => {
    //       console.log(
    //         `Cloudinary image ${imagePublicId} deleted successfully.`,
    //         result
    //       );
    //     })
    //     .catch((error) => {
    //       console.error(
    //         `Cloudinary deletion failed for ${imagePublicId}:`,
    //         error
    //       );
    //       // Still proceed with DB deletion
    //     });
    // }

    if (imagePublicId) {
      try {
        // Await use panni, destroy mudiyum varaikkum wait pannuvom.
        const result = await cloudinary.uploader.destroy(imagePublicId);
        console.log(
          `SUCCESS: Cloudinary image ${imagePublicId} deleted successfully.`,
          result
        );
      } catch (error) {
        // Request Timeout (499) error vandhaalum, inga handle pannittu,
        // main delete process-ku poiduvom.
        console.error(
          `Cloudinary deletion FAILED for ${imagePublicId}:`,
          error
        );
        // ➡️ Important: Catch-kulla irukkarathala, code automatically next step-ku (DB delete-ku) poidum.
      }
    }

    // DB-la profile-a delete panna
    await Profile.destroy({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: `Profile ID ${id} and associated image deleted successfully by Admin ✅`,
    });
  } catch (error) {
    console.error("❌ Admin DeleteProfile Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete profile ❌",
      error: error.message,
    });
  }
};
