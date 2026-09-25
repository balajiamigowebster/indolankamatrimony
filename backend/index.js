require("dotenv").config();
const express = require("express");
const cors = require("cors");
const sequelize = require("./config/db");
// const { fileURLToPath } = require("url");
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
    origin: (origin, callback) => {
      const allowedOrigins = [
        "http://localhost:3000",
        "http://localhost:7000",
        "https://indolankamatrimony.vercel.app",
        "https://indolankamatrimony-admin.vercel.app",
      ];
      // Allow requests with no origin (like mobile apps or curl) or allowed origins or any vercel.app subdomain
      if (!origin || allowedOrigins.includes(origin) || origin.endsWith(".vercel.app")) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
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

const mountRoutes = (prefix = "") => {
  app.use(`${prefix}/api/profile`, profileRoutes);
  app.use(`${prefix}/api/contact`, contactRoutes);
  app.use(`${prefix}/api/admin`, adminRoutes);
  app.use(`${prefix}/api/adminAuth`, adminAuthRoutes);
};

// Mount on all cPanel subpaths & direct root
mountRoutes("");
mountRoutes("/indolankamatrimony_working");
mountRoutes("/indolankamatrimony.com_v2");
mountRoutes("/indolanka_v2");

// only Cpanel hosting purpose using steps

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server Connected ${PORT}`);
});
