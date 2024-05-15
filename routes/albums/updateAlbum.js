const express = require("express");
const router = express.Router();
const pool = require("../../db.js");

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { title, artistId, releaseDate, coverImage, genre } = req.body;

  if (!title || !artistId || !releaseDate) {
    return res.status(400).json({ error: "标题、艺术家ID和发行日期为必填项" });
  }

  const query = `
    UPDATE albums
    SET title = ?, artist_id = ?, release_date = ?, cover_image = ?, genre = ?
    WHERE id = ?
  `;

  pool.query(
    query,
    [title, artistId, releaseDate, coverImage, genre, id],
    (error, results) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ error: "专辑未找到" });
      }
      res.status(200).json({ message: "专辑更新成功" });
    },
  );
});

module.exports = router;
