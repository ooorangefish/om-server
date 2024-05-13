const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();
const pool = require("../../db.js");
const toCamelCase = require("../../utils/toCamelCase");

router.get("/", (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  const query = `
        SELECT 
            songs.id, songs.title, songs.duration, songs.file_path,
            artists.id as artist_id, artists.name as artist_name, artists.profile_image as artist_profile_image,
            albums.id as album_id, albums.title as album_title, albums.release_date as album_release_date, albums.cover_image as album_cover_image, albums.genre as album_genre
        FROM songs
        JOIN artists ON songs.artist_id = artists.id
        JOIN albums ON songs.album_id = albums.id
        JOIN user_liked_songs ON songs.id = user_liked_songs.song_id
        WHERE user_liked_songs.user_id = ?
    `;

  pool.query(query, [userId], (error, results) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }

    const formattedSongs = results.map((song) => {
      const formattedSong = toCamelCase(song);
      formattedSong.artist = {
        id: formattedSong.artistId,
        name: formattedSong.artistName,
        profileImage: formattedSong.artistProfileImage,
      };
      formattedSong.album = {
        id: formattedSong.albumId,
        title: formattedSong.albumTitle,
        releaseDate: formattedSong.albumReleaseDate,
        coverImage: formattedSong.albumCoverImage,
        genre: formattedSong.albumGenre,
      };
      formattedSong.isLiked = true;
      delete formattedSong.artistId;
      delete formattedSong.artistName;
      delete formattedSong.artistProfileImage;
      delete formattedSong.albumId;
      delete formattedSong.albumTitle;
      delete formattedSong.albumReleaseDate;
      delete formattedSong.albumCoverImage;
      delete formattedSong.albumGenre;
      return formattedSong;
    });

    res.status(200).json(formattedSongs);
  });
});

module.exports = router;
