const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();
const pool = require("../../db.js");

router.post("/", (req, res) => {
  const { username, password } = req.body;
  pool.query(
    "SELECT * FROM users WHERE username = ?",
    [username],
    (error, results) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      if (results.length === 0) {
        return res.status(400).json({
          success: false,
          message: "用户名或密码错误",
        });
      }
      const user = results[0];
      bcrypt.compare(password, user.password, (err, isValidPassword) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        if (!isValidPassword) {
          return res.status(400).json({
            success: false,
            message: "用户名或密码错误",
          });
        }
        // Login successful, return user information (excluding the password)
        const { password, ...userData } = user;
        res.json({ message: "登录成功！", user: userData, success: true });
      });
    },
  );
});

module.exports = router;
