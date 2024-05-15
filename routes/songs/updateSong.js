const express = require("express");
const router = express.Router();
const pool = require("../../db.js");

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { title, duration, albumId, filePath } = req.body;

  if (!id) {
    return res.status(400).json({ error: "Song ID is required" });
  }

  const query =
    "UPDATE songs SET title = ?, duration = ?, album_id = ?, file_path = ? WHERE id = ?";
  pool.query(
    query,
    [title, duration, albumId, filePath, id],
    (error, results) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ error: "Song not found" });
      }
      res.status(200).json({ message: "Song updated successfully" });
    },
  );
});

module.exports = router;
