const express = require("express");
const router = express.Router();
const pool = require("../../db.js");

router.delete("/", (req, res) => {
  const { albumId } = req.body;

  console.log("delete", albumId);

  pool.query(
    "DELETE FROM recommendations WHERE album_id = ?",
    [albumId],
    (error, results) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ message: "Recommendation not found" });
      }
      res.status(200).json({ message: "Recommendation deleted successfully" });
    },
  );
});

module.exports = router;
