const express = require("express");
const { submitContactForm } = require("../controllers/contactController");

const router = express();

// POST route for handling contact form submission
router.post("/submit", submitContactForm);

module.exports = router;
