const express = require('express');
const db = require('../db');
const router = express.Router();

router.get('/', (req, res) => {
  const searchQuery = req.query.search || '';
  const currentPage = parseInt(req.query.page) || 1;
  const itemsPerPage = 6;
  const offset = (currentPage - 1) * itemsPerPage;

  // Query to count total events
  db.query(`SELECT COUNT(*) AS total FROM events WHERE title LIKE ?`, [`%${searchQuery}%`], (err, countResults) => {
    if (err) throw err;

    const totalItems = countResults[0].total;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Query to get events with search and pagination
    db.query(
      `SELECT * FROM events WHERE title LIKE ? LIMIT ? OFFSET ?`,
      [`%${searchQuery}%`, itemsPerPage, offset],
      (err, results) => {
        if (err) throw err;
        res.render('index', {
          events: results,
          searchQuery: searchQuery,
          currentPage: currentPage,
          totalPages: totalPages
        });
      }
    );
  });
});

module.exports = router;
