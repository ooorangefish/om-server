const express = require("express");
const router = express.Router();
const pool = require("../../db.js");
const toCamelCase = require("../../utils/toCamelCase");

router.get("/", (req, res) => {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: "Artist ID is required" });
  }

  const artistQuery = `
    SELECT 
      artists.id, artists.name, artists.location, artists.type, artists.bio, artists.profile_image AS profileImage
    FROM artists
    WHERE artists.id = ?
  `;

  pool.query(artistQuery, [id], (error, artistRows) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }

    const artist = artistRows[0];

    if (!artist) {
      return res.status(404).json({ error: "Artist not found" });
    }

    // Convert artist object to camel case
    const formattedArtist = toCamelCase(artist);

    res.status(200).json(formattedArtist);
  });
});

module.exports = router;
