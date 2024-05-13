const express = require("express");
const pool = require("../../db"); // Adjust the path according to your project structure
const router = express.Router();

router.post("/", (req, res) => {
  const { userId, songId } = req.body;
  pool.query(
    "INSERT INTO user_liked_songs (user_id, song_id) VALUES (?, ?)",
    [userId, songId],
    (error) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      res.status(201).json({ message: "Song liked successfully" });
    },
  );
});

module.exports = router;
