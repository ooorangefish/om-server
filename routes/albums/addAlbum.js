const express = require("express");
const router = express.Router();
const pool = require("../../db.js");

router.post("/", async (req, res) => {
  const { title, artistId, releaseDate, coverImage, genre } = req.body;

  if (!title || !artistId || !releaseDate) {
    return res.status(400).json({ error: "标题、艺术家ID和发行日期为必填项" });
  }

  const query = `
    INSERT INTO albums (title, artist_id, release_date, cover_image, genre)
    VALUES (?, ?, ?, ?, ?)
  `;

  pool.query(
    query,
    [title, artistId, releaseDate, coverImage, genre],
    (error, results) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      res.status(201).json({
        message: "专辑添加成功",
        albumId: results.insertId,
      });
    },
  );
});

module.exports = router;
