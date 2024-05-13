const express = require("express");
const router = express.Router();
const pool = require("../../db.js");
const toCamelCase = require("../../utils/toCamelCase");

router.get("/", (req, res) => {
  const { artistId } = req.query;

  if (!artistId) {
    return res.status(400).json({ error: "Artist ID is required" });
  }

  const query = `
    SELECT 
      albums.id, albums.title, albums.release_date AS releaseDate, albums.cover_image AS coverImage, albums.genre,
      artists.id AS artistId, artists.name AS artistName, artists.profile_image AS artistProfileImage
    FROM albums
    JOIN artists ON albums.artist_id = artists.id
    WHERE albums.artist_id = ?
  `;

  pool.query(query, [artistId], (error, albums) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }

    const formattedAlbums = albums.map((album) => {
      const formattedAlbum = toCamelCase(album);
      formattedAlbum.artist = {
        id: formattedAlbum.artistId,
        name: formattedAlbum.artistName,
        profileImage: formattedAlbum.artistProfileImage,
      };
      delete formattedAlbum.artistId;
      delete formattedAlbum.artistName;
      delete formattedAlbum.artistProfileImage;
      return formattedAlbum;
    });

    res.status(200).json(formattedAlbums);
  });
});

module.exports = router;
