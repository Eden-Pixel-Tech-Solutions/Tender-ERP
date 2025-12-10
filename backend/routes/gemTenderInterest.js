const express = require("express");
const router = express.Router();
const db = require("../db");
const auth = require("../middleware/authMiddleware");

// TOGGLE INTEREST
router.post("/toggle", auth, (req, res) => {
  const { tenderId } = req.body;

  if (!tenderId) {
    return res.status(400).json({ message: "Tender ID is required" });
  }

  const checkSql = "SELECT is_interested FROM gem_tenders WHERE id = ?";
  db.query(checkSql, [tenderId], (err, rows) => {
    if (err) return res.status(500).json({ message: "DB error", err });

    if (rows.length === 0)
      return res.status(404).json({ message: "Tender not found" });

    const current = rows[0].is_interested === 1 ? 0 : 1;

    const updateSql = "UPDATE gem_tenders SET is_interested = ? WHERE id = ?";
    db.query(updateSql, [current, tenderId], (err2) => {
      if (err2) return res.status(500).json({ message: "Update failed", err2 });

      return res.json({
        message: "Updated",
        is_interested: current,
      });
    });
  });
});

module.exports = router;
