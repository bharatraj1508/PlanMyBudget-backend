const express = require("express");
const { testEmail } = require("../../controllers/auth/authController");

const router = express.Router();

router.post("/send-demo-email", testEmail);

module.exports = router;
