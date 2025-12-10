const express = require("express");
const router = express.Router();
const db = require("../db");
const auth = require("../middleware/authMiddleware");

// GET GEM TENDERS with filters + pagination
router.get("/", auth, (req, res) => {
  let {
    keyword,
    referenceNumber,
    state,
    city,
    department,
    status,
    assignBy,
    assignTo,
    tenderId,
    website,
    closingFrom,
    closingTo,
    ownership,
    prebidFrom,
    prebidTo,
    mailType,
    lastUpdated,
    quantityCompare,
    quantity,
    tenderValueCompare,
    tenderValue,
    tenderValueTo,
    gemStatus,
    msmeExemption,
    startupExemption,
    manualEntry,
    page = 1,
    limit = 10,
  } = req.query;

  page = parseInt(page);
  limit = parseInt(limit);
  let offset = (page - 1) * limit;

  // -------------------------------
  // SQL with DATE FIX (Main Change)
  // -------------------------------
  let sql = `
    SELECT 
      id,
      bid_number,
      items,
      department,

      -- FIX start_date from DD-MM-YYYY to ISO
      CASE
        WHEN start_date REGEXP '^[0-9]{2}-[0-9]{2}-[0-9]{4}' THEN
          DATE_FORMAT(
            STR_TO_DATE(start_date, '%d-%m-%Y %h:%i %p'),
            '%Y-%m-%d %H:%i:%s'
          )
        ELSE NULL
      END AS start_date,

      -- FIX end_date from DD-MM-YYYY to ISO
      CASE
        WHEN end_date REGEXP '^[0-9]{2}-[0-9]{2}-[0-9]{4}' THEN
          DATE_FORMAT(
            STR_TO_DATE(end_date, '%d-%m-%Y %h:%i %p'),
            '%Y-%m-%d %H:%i:%s'
          )
        ELSE NULL
      END AS end_date,

      relevance_score,
      match_relevency,
      matches_status,
      created_at,
      updated_at,
      main_relevency_score,
      detail_url

    FROM gem_tenders
    WHERE 1 = 1
  `;

  let countSql = `
    SELECT COUNT(*) AS total
    FROM gem_tenders
    WHERE 1 = 1
  `;

  let params = [];
  let countParams = [];

  // 🔍 TEXT SEARCH
  if (keyword && keyword.trim() !== "") {
    sql += ` AND (items LIKE ? OR department LIKE ?)`;
    countSql += ` AND (items LIKE ? OR department LIKE ?)`;
    params.push(`%${keyword}%`, `%${keyword}%`);
    countParams.push(`%${keyword}%`, `%${keyword}%`);
  }

  // Reference Number
  if (referenceNumber) {
    sql += ` AND bid_number LIKE ?`;
    countSql += ` AND bid_number LIKE ?`;
    params.push(`%${referenceNumber}%`);
    countParams.push(`%${referenceNumber}%`);
  }

  // State + City filters
  if (state) {
    sql += ` AND items LIKE ?`;
    countSql += ` AND items LIKE ?`;
    params.push(`%${state}%`);
    countParams.push(`%${state}%`);
  }
  if (city) {
    sql += ` AND items LIKE ?`;
    countSql += ` AND items LIKE ?`;
    params.push(`%${city}%`);
    countParams.push(`%${city}%`);
  }

  // Department filter
  if (department) {
    sql += ` AND department LIKE ?`;
    countSql += ` AND department LIKE ?`;
    params.push(`%${department}%`);
    countParams.push(`%${department}%`);
  }

  // Tender ID
  if (tenderId) {
    sql += ` AND id = ?`;
    countSql += ` AND id = ?`;
    params.push(tenderId);
    countParams.push(tenderId);
  }

  // Website
  if (website) {
    sql += ` AND items LIKE ?`;
    countSql += ` AND items LIKE ?`;
    params.push(`%${website}%`);
    countParams.push(`%${website}%`);
  }

  // Status
  if (status) {
    sql += ` AND matches_status = ?`;
    countSql += ` AND matches_status = ?`;
    params.push(status);
    countParams.push(status);
  }

  // Assign By / To
  if (assignBy) {
    sql += ` AND items LIKE ?`;
    countSql += ` AND items LIKE ?`;
    params.push(`%${assignBy}%`);
    countParams.push(`%${assignBy}%`);
  }
  if (assignTo) {
    sql += ` AND items LIKE ?`;
    countSql += ` AND items LIKE ?`;
    params.push(`%${assignTo}%`);
    countParams.push(`%${assignTo}%`);
  }

  // Closing Date Range
  if (closingFrom) {
    sql += ` AND end_date >= STR_TO_DATE(?, '%Y-%m-%d')`;
    countSql += ` AND end_date >= STR_TO_DATE(?, '%Y-%m-%d')`;
    params.push(closingFrom);
    countParams.push(closingFrom);
  }
  if (closingTo) {
    sql += ` AND end_date <= STR_TO_DATE(?, '%Y-%m-%d')`;
    countSql += ` AND end_date <= STR_TO_DATE(?, '%Y-%m-%d')`;
    params.push(closingTo);
    countParams.push(closingTo);
  }

  // Prebid Date Range
  if (prebidFrom) {
    sql += ` AND start_date >= STR_TO_DATE(?, '%Y-%m-%d')`;
    countSql += ` AND start_date >= STR_TO_DATE(?, '%Y-%m-%d')`;
    params.push(prebidFrom);
    countParams.push(prebidFrom);
  }
  if (prebidTo) {
    sql += ` AND start_date <= STR_TO_DATE(?, '%Y-%m-%d')`;
    countSql += ` AND start_date <= STR_TO_DATE(?, '%Y-%m-%d')`;
    params.push(prebidTo);
    countParams.push(prebidTo);
  }

  // Last Updated Filter
  if (lastUpdated) {
    sql += ` AND DATE(updated_at) = ?`;
    countSql += ` AND DATE(updated_at) = ?`;
    params.push(lastUpdated);
    countParams.push(lastUpdated);
  }

  // Quantity Filter
  if (quantity) {
    sql += ` AND quantity ${quantityCompare} ?`;
    countSql += ` AND quantity ${quantityCompare} ?`;
    params.push(quantity);
    countParams.push(quantity);
  }

  // Tender Value Filter
  if (tenderValue && tenderValueTo) {
    sql += ` AND tender_value BETWEEN ? AND ?`;
    countSql += ` AND tender_value BETWEEN ? AND ?`;
    params.push(tenderValue, tenderValueTo);
    countParams.push(tenderValue, tenderValueTo);
  } else if (tenderValue) {
    sql += ` AND tender_value ${tenderValueCompare} ?`;
    countSql += ` AND tender_value ${tenderValueCompare} ?`;
    params.push(tenderValue);
    countParams.push(tenderValue);
  }

  // GeM Filters
  if (gemStatus === "GeM") {
    sql += ` AND dept = 'GeM'`;
    countSql += ` AND dept = 'GeM'`;
  }
  if (gemStatus === "Non-GeM") {
    sql += ` AND dept != 'GeM'`;
    countSql += ` AND dept != 'GeM'`;
  }

  // MSME Exemption
  if (msmeExemption === "Yes") {
    sql += ` AND items LIKE '%MSME%'`;
    countSql += ` AND items LIKE '%MSME%'`;
  }
  if (msmeExemption === "No") {
    sql += ` AND items NOT LIKE '%MSME%'`;
    countSql += ` AND items NOT LIKE '%MSME%'`;
  }

  // Startup Exemption
  if (startupExemption === "Yes") {
    sql += ` AND items LIKE '%Startup%'`;
    countSql += ` AND items LIKE '%Startup%'`;
  }
  if (startupExemption === "No") {
    sql += ` AND items NOT LIKE '%Startup%'`;
    countSql += ` AND items NOT LIKE '%Startup%'`;
  }

  // Manual Entry
  if (manualEntry) {
    sql += ` AND items LIKE ?`;
    countSql += ` AND items LIKE ?`;
    params.push(`%${manualEntry}%`);
    countParams.push(`%${manualEntry}%`);
  }

  // ORDER & PAGINATION
  sql += ` ORDER BY main_relevency_score DESC, end_date ASC LIMIT ? OFFSET ?`;
  params.push(limit, offset);

  // RUN BOTH QUERIES
  db.query(sql, params, (err, rows) => {
    if (err) {
      console.log("SQL ERROR:", err);
      return res.status(500).json({ error: err });
    }

    db.query(countSql, countParams, (err2, result) => {
      if (err2) return res.status(500).json({ error: err2 });

      const total = result[0].total;
      const totalPages = Math.ceil(total / limit);

      res.json({
        data: rows,
        page,
        limit,
        total,
        totalPages,
      });
    });
  });
});

module.exports = router;
