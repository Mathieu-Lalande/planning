const { Router } = require('express');
const pool = require('../db');

const router = Router();

// DB row (snake_case) → frontend shape (camelCase)
function toPlanning(row) {
  return {
    id:         row.id,
    name:       row.name,
    startYear:  row.start_year,
    startMonth: row.start_month,
    monthCount: row.month_count,
  };
}

// GET /api/plannings
router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM plannings ORDER BY created_at ASC'
    );
    res.json(rows.map(toPlanning));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST /api/plannings
router.post('/', async (req, res) => {
  const { id, name, startYear, startMonth, monthCount } = req.body;
  try {
    const { rows } = await pool.query(
      `INSERT INTO plannings (id, name, start_year, start_month, month_count)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [id ?? null, name, startYear, startMonth, monthCount]
    );
    res.status(201).json(toPlanning(rows[0]));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// PUT /api/plannings/:id
router.put('/:id', async (req, res) => {
  const { name, startYear, startMonth, monthCount } = req.body;
  try {
    const { rows } = await pool.query(
      `UPDATE plannings
       SET name=$2, start_year=$3, start_month=$4, month_count=$5
       WHERE id=$1
       RETURNING *`,
      [req.params.id, name, startYear, startMonth, monthCount]
    );
    if (!rows.length) return res.status(404).json({ error: 'Planning introuvable' });
    res.json(toPlanning(rows[0]));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// DELETE /api/plannings/:id
router.delete('/:id', async (req, res) => {
  try {
    const { rowCount } = await pool.query(
      'DELETE FROM plannings WHERE id=$1', [req.params.id]
    );
    if (!rowCount) return res.status(404).json({ error: 'Planning introuvable' });
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
