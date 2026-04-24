const { Router } = require('express');
const pool = require('../db');

const router = Router();

function toEvent(row) {
  return {
    id:   Number(row.id),
    type: row.type,
    text: row.text,
    month: row.month,
    pos:  parseFloat(row.pos),
    ...(row.dur != null ? { dur: parseFloat(row.dur) } : {}),
  };
}

// GET /api/plannings/:planningId/events
router.get('/:planningId/events', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM events WHERE planning_id=$1 ORDER BY id ASC',
      [req.params.planningId]
    );
    res.json(rows.map(toEvent));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST /api/plannings/:planningId/events
router.post('/:planningId/events', async (req, res) => {
  const { id, type, text, month, pos, dur } = req.body;
  try {
    const { rows } = await pool.query(
      `INSERT INTO events (id, planning_id, type, text, month, pos, dur)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [id, req.params.planningId, type, text, month, pos, dur ?? null]
    );
    res.status(201).json(toEvent(rows[0]));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// PUT /api/events/:id
router.put('/:id', async (req, res) => {
  const { type, text, month, pos, dur } = req.body;
  try {
    const { rows } = await pool.query(
      `UPDATE events
       SET type=$2, text=$3, month=$4, pos=$5, dur=$6
       WHERE id=$1
       RETURNING *`,
      [req.params.id, type, text, month, pos, dur ?? null]
    );
    if (!rows.length) return res.status(404).json({ error: 'Événement introuvable' });
    res.json(toEvent(rows[0]));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// DELETE /api/events/:id
router.delete('/:id', async (req, res) => {
  try {
    const { rowCount } = await pool.query(
      'DELETE FROM events WHERE id=$1', [req.params.id]
    );
    if (!rowCount) return res.status(404).json({ error: 'Événement introuvable' });
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
