const express = require("express");
const router = express.Router();
const pool = require("../../db.js");

router.post("/", (req, res) => {
  const { name, bio, profileImage, type, location } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Artist name is required" });
  }

  const query =
    "INSERT INTO artists (name, bio,profile_image, type, location) VALUES (?, ?, ?, ?, ?)";
  pool.query(
    query,
    [name, bio, profileImage, type, location],
    (error, results) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      res.status(201).json({
        message: "添加成功！",
        artistId: results.insertId,
      });
    },
  );
});

module.exports = router;
