const express = require("express");
const router = express.Router();
const pool = require("../../db.js");
const toCamelCase = require("../../utils/toCamelCase");

router.get("/", (req, res) => {
  pool.query(
    `SELECT 
            albums.id, albums.title, albums.release_date AS releaseDate, albums.cover_image AS coverImage, albums.genre,
            artists.id AS artistId, artists.name AS artistName, artists.profile_image AS artistProfileImage
         FROM albums
         JOIN recommendations ON albums.id = recommendations.album_id
         JOIN artists ON albums.artist_id = artists.id`,
    (error, results) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      const formattedResults = results.map((result) => ({
        ...toCamelCase(result),
        artist: {
          id: result.artistId,
          name: result.artistName,
          profileImage: result.artistProfileImage,
        },
      })).map((result) => {
        delete result.artistId;
        delete result.artistName;
        delete result.artistProfileImage;
        return result;
      });

      res.status(200).json(formattedResults);
    },
  );
});

module.exports = router;
