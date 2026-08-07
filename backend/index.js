const express = require("express");
const cors = require("cors");
const sequelize = require("./config/db");
// const { fileURLToPath } = require("url");
require("dotenv").config();
const profileRoutes = require("./routes/profileRoutes");
const contactRoutes = require("./routes/contactRoutes");
const adminRoutes = require("./routes/adminRoutes");
const adminAuthRoutes = require("./routes/AdminUserRoutes");
const cookieParser = require("cookie-parser");
const path = require("path");

const app = express();
// __dirname fix
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://indolankamatrimony.vercel.app",
      "http://localhost:7000",
      "https://indolankamatrimony-admin.vercel.app",
    ],
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// static folder -> frontend access for uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ MySQL connected successfully!");
    await sequelize.sync({ alter: true });
    console.log("✅ Tables synced successfully!");
  } catch (error) {
    console.error("❌ DB Errors:", error);
  }
})();

app.use("/api/profile", profileRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/admin", adminRoutes); // Base path /api/admin
app.use("/api/adminAuth", adminAuthRoutes);

// only Cpanel hosting purpose using steps

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server Connected ${PORT}`);
});
