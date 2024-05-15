const express = require("express");
const router = express.Router();
const pool = require("../../db.js");
const toCamelCase = require("../../utils/toCamelCase");

router.get("/", (req, res) => {
  const query = `
    SELECT
      songs.id, songs.title, songs.duration, songs.file_path,
      albums.id AS albumId, albums.title AS albumTitle, albums.release_date AS albumReleaseDate, albums.cover_image AS albumCoverImage, albums.genre AS albumGenre,
      artists.id AS artistId, artists.name AS artistName, artists.profile_image AS artistProfileImage
    FROM songs
    JOIN albums ON songs.album_id = albums.id
    JOIN artists ON songs.artist_id = artists.id
  `;

  pool.query(query, (error, results) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }

    console.log("results", results);

    const formattedResults = results.map((result) => {
      const song = toCamelCase(result);
      song.album = {
        id: song.albumId,
        title: song.albumTitle,
        releaseDate: song.albumReleaseDate,
        coverImage: song.albumCoverImage,
        genre: song.albumGenre,
      };
      delete song.albumId;
      delete song.albumTitle;
      delete song.albumReleaseDate;
      delete song.albumCoverImage;
      delete song.albumGenre;

      song.artist = {
        id: song.artistId,
        name: song.artistName,
        profileImage: song.artistProfileImage,
      };
      delete song.artistId;
      delete song.artistName;
      delete song.artistProfileImage;

      return song;
    });

    res.status(200).json(formattedResults);
  });
});

module.exports = router;
