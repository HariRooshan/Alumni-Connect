const express = require("express");
const {approveAlumni, getApprovedAlumni, getPendingAlumni,getContactInfo,updateContactInfo } = require("../controllers/admincontroller");

const router = express.Router();

router.put("/approve-alumni/:id", approveAlumni);
router.get("/approved-alumni", getApprovedAlumni);
router.get("/pending-alumni", getPendingAlumni);
router.get("/getcontact", getContactInfo);
router.put("/updatecontact", updateContactInfo);

module.exports = router;
