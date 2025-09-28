const express = require("express");
const multer = require("multer");
const path = require("path");
const crypto = require("crypto");
const fs = require("fs");
const { s3 } = require("../utils/AWS.config");
const { PutObjectCommand } = require("@aws-sdk/client-s3");

const router = express.Router();
const upload = multer({ dest: "uploads/" }); // temp folder

router.post("/upload", upload.single("image"), async (req, res) => {
  try {
    const file = req.file;

    if (!file) return res.status(400).json({ error: "No file uploaded" });

    const fileExt = path.extname(file.originalname);
    const fileName = crypto.randomBytes(16).toString("hex") + fileExt;
    const fileStream = fs.createReadStream(file.path);

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `chat-images/${fileName}`,
      Body: fileStream,
      ContentType: file.mimetype,
    };

    await s3.upload(params).promise(); // Using s3.upload with callback/promise

    // Remove temp file
    fs.unlinkSync(file.path);

    const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/chat-images/${fileName}`;

    res.json({ message: "File uploaded successfully!", fileUrl });
  } catch (err) {
    console.error("Upload error:", err); // log full AWS error
    res.status(500).json({ error: "File upload failed", details: err.message });
  }
});

module.exports = router;
