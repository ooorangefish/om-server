const express = require("express");
const router = express.Router();
const pool = require("../db.js");
const toCamelCase = require("../utils/toCamelCase");

router.get("/", (req, res) => {
  const { name } = req.query;

  if (!name) {
    return res.status(400).json({ error: "Name is required for search" });
  }

  const searchQuery = `
    SELECT 
      'album' AS type, albums.id, albums.title, NULL AS bio, albums.release_date AS releaseDate, albums.cover_image AS coverImage, albums.genre,
      artists.id AS artistId, artists.name AS artistName, artists.profile_image AS artistProfileImage,
      NULL AS albumId, NULL AS albumTitle, NULL AS albumReleaseDate, NULL AS albumCoverImage, NULL AS albumGenre, NULL AS filePath
    FROM albums
    JOIN artists ON albums.artist_id = artists.id
    WHERE albums.title LIKE ?

    UNION ALL

    SELECT 
      'artist' AS type, artists.id, artists.name, artists.bio, NULL AS releaseDate, NULL AS coverImage, NULL AS genre,
      NULL AS artistId, NULL AS artistName, artists.profile_image AS profileImage,
      NULL AS albumId, NULL AS albumTitle, NULL AS albumReleaseDate, NULL AS albumCoverImage, NULL AS albumGenre, NULL AS filePath
    FROM artists
    WHERE artists.name LIKE ?

    UNION ALL

    SELECT 
      'song' AS type, songs.id, songs.title, NULL AS bio, NULL AS releaseDate, NULL AS coverImage, NULL AS genre,
      artists.id AS artistId, artists.name AS artistName, artists.profile_image AS artistProfileImage,
      albums.id AS albumId, albums.title AS albumTitle, albums.release_date AS albumReleaseDate, albums.cover_image AS albumCoverImage, albums.genre AS albumGenre, songs.file_path AS filePath
    FROM songs
    JOIN artists ON songs.artist_id = artists.id
    JOIN albums ON songs.album_id = albums.id
    WHERE songs.title LIKE ?
  `;

  // Add wildcard characters (%) to the search term for partial matching
  const searchTerm = `%${name}%`;

  pool.query(
    searchQuery,
    [searchTerm, searchTerm, searchTerm],
    (error, results) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }

      const formattedResults = results.map((result) => {
        const formattedResult = toCamelCase(result);

        if (
          formattedResult.type === "album" || formattedResult.type === "song"
        ) {
          formattedResult.artist = {
            id: formattedResult.artistId,
            name: formattedResult.artistName,
            profileImage: formattedResult.artistProfileImage,
          };
          delete formattedResult.artistId;
          delete formattedResult.artistName;
          delete formattedResult.artistProfileImage;
          delete formattedResult.bio;

          if (formattedResult.type === "song") {
            formattedResult.album = {
              id: formattedResult.albumId,
              title: formattedResult.albumTitle,
              releaseDate: formattedResult.albumReleaseDate,
              coverImage: formattedResult.albumCoverImage,
              genre: formattedResult.albumGenre,
            };

            delete formattedResult.albumId;
            delete formattedResult.albumTitle;
            delete formattedResult.albumReleaseDate;
            delete formattedResult.albumCoverImage;
            delete formattedResult.albumGenre;
            delete formattedResult.coverImage;
            delete formattedResult.releaseDate;
          }
        } else if (formattedResult.type === "artist") {
          // For artist results, use the id, name, and profileImage directly
          formattedResult.name = formattedResult.title;
          formattedResult.profileImage = formattedResult.artistProfileImage;

          delete formattedResult.coverImage;
          delete formattedResult.artistName;
          delete formattedResult.artistId;
          delete formattedResult.title;
          delete formattedResult.artistProfileImage;
        }

        return formattedResult;
      });

      res.status(200).json(formattedResults);
    },
  );
});

module.exports = router;
