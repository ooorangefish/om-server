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
      songs.id, songs.title, songs.duration, songs.file_path, 
      albums.id AS albumId, albums.title AS albumTitle, albums.release_date AS releaseDate, albums.cover_image AS coverImage, albums.genre,
      artists.id AS artistId, artists.name AS artistName, artists.profile_image AS artistProfileImage
    FROM songs
    JOIN albums ON songs.album_id = albums.id
    JOIN artists ON songs.artist_id = artists.id
    WHERE songs.artist_id = ?
  `;

  pool.query(query, [artistId], (error, songs) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }

    const formattedSongs = songs.map((song) => {
      const formattedSong = toCamelCase(song);
      formattedSong.album = {
        id: formattedSong.albumId,
        title: formattedSong.albumTitle,
        releaseDate: formattedSong.releaseDate,
        coverImage: formattedSong.coverImage,
        genre: formattedSong.genre,
      };
      delete formattedSong.albumId;
      delete formattedSong.albumTitle;
      delete formattedSong.releaseDate;
      delete formattedSong.coverImage;
      delete formattedSong.genre;

      formattedSong.artist = {
        id: formattedSong.artistId,
        name: formattedSong.artistName,
        profileImage: formattedSong.artistProfileImage,
      };
      delete formattedSong.artistId;
      delete formattedSong.artistName;
      delete formattedSong.artistProfileImage;

      return formattedSong;
    });

    res.status(200).json(formattedSongs);
  });
});

module.exports = router;
