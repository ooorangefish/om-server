const express = require("express");
const router = express.Router();
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/images/"); // Specify the directory where uploaded images will be stored
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Generate a unique filename
  },
});

const upload = multer({ storage: storage });

router.post("/", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Please provide an image to upload" });
  }
  res.status(201).json({
    message: "Image uploaded successfully",
    filename: req.file.filename,
    path: req.file.path,
  });
});

module.exports = router;
