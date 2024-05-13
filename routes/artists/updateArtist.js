const express = require("express");
const router = express.Router();
const pool = require("../../db.js");

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { name, bio, profileImage } = req.body;

  if (!id) {
    return res.status(400).json({ error: "Artist ID is required" });
  }

  const query =
    "UPDATE artists SET name = ?, bio = ?, profile_image = ? WHERE id = ?";
  pool.query(query, [name, bio, profileImage, id], (error, results) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Artist not found" });
    }
    res.status(200).json({ message: "Artist updated successfully" });
  });
});

module.exports = router;
