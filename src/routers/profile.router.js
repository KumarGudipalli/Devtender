const express = require("express");
const { getProfile, udpateProfile } = require("../controllers/profile.controller");
const authMiddleWare = require("../middleware/auth");
const router = express.Router();

router.get("/view", authMiddleWare, getProfile);
router.patch("/edit",authMiddleWare , udpateProfile)
module.exports = router;
