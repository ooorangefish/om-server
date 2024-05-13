const express = require("express");
const pool = require("../../db"); // Adjust the path according to your project structure
const router = express.Router();

router.post("/", (req, res) => {
  const { userId, songId } = req.body;

  // Check if the user has already liked the song
  pool.query(
    "SELECT * FROM user_liked_songs WHERE user_id = ? AND song_id = ?",
    [userId, songId],
    (error, results) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      if (results.length === 0) {
        return res.status(400).json({
          message: "You have not liked this song",
        });
      }

      // If the user has liked the song, delete the record
      pool.query(
        "DELETE FROM user_liked_songs WHERE user_id = ? AND song_id = ?",
        [userId, songId],
        (deleteError) => {
          if (deleteError) {
            return res.status(500).json({ error: deleteError.message });
          }
          res.status(200).json({ message: "Song unliked successfully" });
        },
      );
    },
  );
});

module.exports = router;
