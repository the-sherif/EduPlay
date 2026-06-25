'use strict';
const router = require('express').Router();
const pool   = require('../db');
const requireAuth = require('../middleware/auth');

// ── Сохранить результат сессии ────────────────────────────────
router.post('/', requireAuth, async (req, res) => {
  const { topicId, topicName, subject, gradeGroup, score, total, pct } = req.body;
  if (!topicId || score == null || total == null) {
    return res.status(400).json({ error: 'Неверные данные' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    await client.query(
      'INSERT INTO sessions (user_id, topic_id, topic_name, subject, grade_group, score, total, pct) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)',
      [req.user.id, topicId, topicName, subject, gradeGroup, score, total, pct]
    );

    const { rows } = await client.query(
      'UPDATE users SET total_score = total_score + $1, sessions_count = sessions_count + 1 WHERE id=$2 RETURNING total_score, sessions_count',
      [score, req.user.id]
    );

    await client.query('COMMIT');
    res.json({ ok: true, stats: rows[0] });
  } catch (e) {
    await client.query('ROLLBACK');
    console.error(e);
    res.status(500).json({ error: 'Ошибка сервера' });
  } finally {
    client.release();
  }
});

// ── Прогресс по темам (лучший результат на тему) ──────────────
router.get('/progress', requireAuth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT topic_id, MAX(score) AS best_score, MAX(pct) AS best_pct, COUNT(*) AS attempts
       FROM sessions WHERE user_id=$1 GROUP BY topic_id`,
      [req.user.id]
    );
    res.json({ progress: rows });
  } catch (e) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// ── История сессий пользователя ───────────────────────────────
router.get('/', requireAuth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM sessions WHERE user_id=$1 ORDER BY completed_at DESC LIMIT 50',
      [req.user.id]
    );
    res.json({ sessions: rows });
  } catch (e) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

module.exports = router;
