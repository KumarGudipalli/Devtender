const express = require("express");
const authMiddleWare = require("../middleware/auth");
const {
  createRequest,
  reveiwRequest,
  getAllPendingRequests,
  getAllConnections,
} = require("../controllers/request.controller");

const router = express.Router();

router.post("/send/:status/:reciverId", authMiddleWare, createRequest);
router.post("/review/:status/:requestedId", authMiddleWare, reveiwRequest);
router.get("/pending", authMiddleWare, getAllPendingRequests);
router.get("/allConnections", authMiddleWare, getAllConnections);
module.exports = router;
