const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();
const pool = require("../../db.js");

router.post("/", (req, res) => {
  const { username, password } = req.body;

  // Check for duplicate username
  pool.query(
    "SELECT * FROM users WHERE username = ?",
    [username],
    (error, results) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      if (results.length > 0) {
        return res.status(400).json({ error: "用户名已存在" }); // Username already exists
      }

      // If no duplicate, proceed to hash password and insert new user
      bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        pool.query(
          "INSERT INTO users (username, password) VALUES (?, ?)",
          [username, hashedPassword],
          (insertError, result) => {
            if (insertError) {
              return res.status(500).json({ error: insertError.message });
            }
            // Fetch the newly inserted user
            pool.query("SELECT id, username FROM users WHERE id = ?", [
              result.insertId,
            ], (fetchErr, rows) => {
              if (fetchErr) {
                return res.status(500).json({ error: fetchErr.message });
              }
              const newUser = rows[0];
              res.status(201).json({ message: "注册成功", user: newUser });
            });
          },
        );
      });
    },
  );
});

module.exports = router;
