const express = require("express");
const { registerAlumni,getAlumniProfile,updateAlumniProfile,searchAlumni} = require("../controllers/alumniController");

const router = express.Router();

router.post("/register-alumni", registerAlumni);
router.get("/profile", getAlumniProfile);
router.put("/update-profile", updateAlumniProfile);
router.get("/search", searchAlumni);


module.exports = router;
