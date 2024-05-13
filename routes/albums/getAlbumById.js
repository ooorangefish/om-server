const express = require("express");
const router = express.Router();
const pool = require("../../db.js");
const toCamelCase = require("../../utils/toCamelCase");

router.get("/", (req, res) => {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: "Album ID is required" });
  }

  const albumQuery = `
    SELECT 
      albums.id, albums.title, albums.release_date, albums.cover_image, albums.genre,
      artists.id as artist_id, artists.name as artist_name, artists.profile_image as artist_profile_image
    FROM albums
    JOIN artists ON albums.artist_id = artists.id
    WHERE albums.id = ?
  `;

  pool.query(albumQuery, [id], (error, albumRows) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }

    const album = albumRows[0];

    if (!album) {
      return res.status(404).json({ error: "Album not found" });
    }

    const formattedAlbum = toCamelCase(album);
    formattedAlbum.artist = {
      id: formattedAlbum.artistId,
      name: formattedAlbum.artistName,
      profileImage: formattedAlbum.artistProfileImage,
    };
    delete formattedAlbum.artistId;
    delete formattedAlbum.artistName;
    delete formattedAlbum.artistProfileImage;

    res.status(200).json(formattedAlbum);
  });
});

module.exports = router;
