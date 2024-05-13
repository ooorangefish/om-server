const express = require("express");
const router = express.Router();
const pool = require("../../db.js");

router.delete("/:id", (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "Artist ID is required" });
  }

  const query = "DELETE FROM artists WHERE id = ?";
  pool.query(query, [id], (error, results) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Artist not found" });
    }
    res.status(200).json({ message: "Artist deleted successfully" });
  });
});

module.exports = router;
