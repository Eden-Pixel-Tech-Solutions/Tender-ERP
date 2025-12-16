const db = require('../config/db');

/**
 * GET /api/tenders
 * Query Params:
 * page, limit, search, department, state, sort
 */
const getTenders = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      department = '',
      sort = 'desc',
      archived = 'false'
    } = req.query;

    const offset = (page - 1) * limit;

    let where = `WHERE 1=1`;
    const params = [];

    if (search) {
      where += ` AND (items LIKE ? OR bid_number LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`);
    }

    if (department) {
      where += ` AND department LIKE ?`;
      params.push(`%${department}%`);
    }

    if (archived === 'true') {
      where += ` AND end_date < CURDATE()`;
    } else {
      where += ` AND end_date >= CURDATE()`;
    }

    const order = sort === 'asc' ? 'ASC' : 'DESC';

    const dataQuery = `
      SELECT
        bid_number AS T_ID,
        items AS title,
        department,
        start_date,
        end_date,
        quantity AS qty,
        is_interested AS interested,
        match_relevency AS value
      FROM gem_tenders
      ${where}
      ORDER BY match_relevency ${order}
      LIMIT ? OFFSET ?
    `;

    const countQuery = `
      SELECT COUNT(*) as total
      FROM gem_tenders
      ${where}
    `;

    const [rows] = await db.query(dataQuery, [...params, +limit, +offset]);
    const [[count]] = await db.query(countQuery, params);

    res.json({
      page: +page,
      limit: +limit,
      total: count.total,
      data: rows.map(r => ({
        ...r,
        interested: !!r.interested
      }))
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch tenders' });
  }
};

/**
 * PATCH /api/tenders/:bidNumber/interest
 */
const toggleInterested = async (req, res) => {
  const { bidNumber } = req.params;

  try {
    await db.query(
      `UPDATE gem_tenders
       SET is_interested = IF(is_interested = 1, 0, 1)
       WHERE bid_number = ?`,
      [bidNumber]
    );

    res.json({ message: 'Interest updated' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update interest' });
  }
};

module.exports = {
  getTenders,
  toggleInterested
};
