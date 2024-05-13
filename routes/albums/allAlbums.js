const express = require("express");
const router = express.Router();
const pool = require("../../db.js");
const toCamelCase = require("../../utils/toCamelCase");

router.get("/", (req, res) => {
  const query = `
    SELECT 
      albums.id, 
      albums.title, 
      albums.release_date, 
      albums.cover_image, 
      albums.genre,
      artists.id AS artistId, 
      artists.name AS artistName
    FROM albums
    JOIN artists ON albums.artist_id = artists.id
  `;

  pool.query(query, (error, results) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    // Convert each result object to camel case and nest artist information
    const formattedResults = results.map((result) => ({
      ...toCamelCase(result),
      artist: {
        id: result.artistId,
        name: result.artistName,
      },
    })).map((result) => {
      delete result.artistId;
      delete result.artistName;
      return result;
    });

    res.status(200).json(formattedResults);
  });
});

module.exports = router;
