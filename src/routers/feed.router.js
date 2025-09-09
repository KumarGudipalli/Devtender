const express = require("express");

const authMiddleWare = require("../middleware/auth");
const showUsersinFeed = require("../controllers/feed.controller");
const router = express.Router();

router.get("/feed", authMiddleWare, showUsersinFeed);

module.exports = router;
