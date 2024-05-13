const express = require("express");
const router = express.Router();
const pool = require("../../db.js");
const toCamelCase = require("../../utils/toCamelCase");

router.get("/", (req, res) => {
  const { albumId, userId } = req.query; // Include userId in the query parameters

  if (!albumId) {
    return res.status(400).json({ error: "Album ID is required" });
  }

  // First, fetch the album information
  const albumQuery = `
    SELECT 
      albums.id, albums.title, albums.release_date, albums.cover_image, albums.genre,
      artists.id as artist_id, artists.name as artist_name, artists.profile_image as artist_profile_image
    FROM albums
    JOIN artists ON albums.artist_id = artists.id
    WHERE albums.id = ?
  `;

  pool.query(albumQuery, [albumId], (error, albumRows) => {
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

    const songsQuery = `
	  SELECT 
	    songs.id, songs.title, songs.duration, songs.file_path,
	    artists.id as artist_id, artists.name as artist_name, artists.profile_image as artist_profile_image,
	    (user_liked_songs.song_id IS NOT NULL) AS isLiked
	  FROM songs
	  LEFT JOIN user_liked_songs ON songs.id = user_liked_songs.song_id AND user_liked_songs.user_id = ?
	  JOIN artists ON songs.artist_id = artists.id
	  WHERE songs.album_id = ?
   `;

    pool.query(songsQuery, [userId, albumId], (error, songs) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }

      const formattedSongs = songs.map((song) => {
        const formattedSong = toCamelCase(song);
        formattedSong.artist = {
          id: formattedSong.artistId,
          name: formattedSong.artistName,
          profileImage: formattedSong.artistProfileImage,
        };
        delete formattedSong.artistId;
        delete formattedSong.artistName;
        delete formattedSong.artistProfileImage;

        // Convert isLiked to a boolean
        formattedSong.isLiked = !!formattedSong.isLiked;

        // Add the album information to each song
        formattedSong.album = formattedAlbum;

        return formattedSong;
      });

      res.status(200).json(formattedSongs);
    });
  });
});

module.exports = router;
