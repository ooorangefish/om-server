const express = require("express");
const router = express.Router();
const pool = require("../../db.js");

router.post("/", (req, res) => {
  const { title, duration, albumId, filePath } = req.body;

  console.log("filePath", filePath);

  // First, fetch the artist_id from the albums table
  pool.query(
    "SELECT artist_id FROM albums WHERE id = ?",
    [albumId],
    (error, results) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: "Album not found" });
      }

      const artistId = results[0].artist_id;

      // Then, insert the new song into the songs table with the fetched artist_id
      pool.query(
        "INSERT INTO songs (title, duration, album_id, artist_id, file_path) VALUES (?, ?, ?, ?, ?)",
        [title, duration, albumId, artistId, filePath],
        (insertError) => {
          if (insertError) {
            return res.status(500).json({ error: insertError.message });
          }
          res.status(201).json({ message: "Song added successfully" });
        },
      );
    },
  );
});

module.exports = router;
