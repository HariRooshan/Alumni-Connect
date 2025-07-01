const express = require("express");
const { sendEmail,responseEmail } = require("../controllers/mailController");  // ✅ Ensure function exists
const router = express.Router();

router.post("/sendEmail", sendEmail);  // ✅ sendEmail should now be defined
router.post("/responseEmail",responseEmail);

module.exports = router;