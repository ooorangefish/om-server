const express = require("express");
const router = express.Router();
const pool = require("../../db.js");
const toCamelCase = require("../../utils/toCamelCase");

router.get("/", (req, res) => {
  const query = "SELECT * FROM artists";

  pool.query(query, (error, results) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    // Convert each result object to camel case
    const camelCaseResults = results.map(toCamelCase);
    res.status(200).json(camelCaseResults);
  });
});

module.exports = router;
