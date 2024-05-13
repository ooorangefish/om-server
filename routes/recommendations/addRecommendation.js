const express = require("express");
const router = express.Router();
const pool = require("../../db.js");

router.post("/", (req, res) => {
  const { albumId } = req.body;

  pool.query(
    "INSERT INTO recommendations (album_id) VALUES (?)",
    [albumId],
    (error) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      res.status(201).json({
        message: "Album added to recommendations successfully",
      });
    },
  );
});

module.exports = router;
