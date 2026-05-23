'use strict';
const router   = require('express').Router();
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const crypto   = require('crypto');
const nodemailer = require('nodemailer');
const pool     = require('../db');
const requireAuth = require('../middleware/auth');

const sign = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

// ── Rate limiting (in-memory, 10 попыток / 15 минут на IP) ──
const loginAttempts = new Map();
const RATE_WINDOW   = 15 * 60 * 1000;
const RATE_MAX      = 10;

setInterval(() => {
  const now = Date.now();
  for (const [ip, times] of loginAttempts) {
    const fresh = times.filter(t => now - t < RATE_WINDOW);
    if (fresh.length === 0) loginAttempts.delete(ip);
    else loginAttempts.set(ip, fresh);
  }
}, RATE_WINDOW);

function rateLimit(req, res, next) {
  const ip  = req.ip || req.socket.remoteAddress;
  const now = Date.now();
  const times = (loginAttempts.get(ip) || []).filter(t => now - t < RATE_WINDOW);
  if (times.length >= RATE_MAX) {
    return res.status(429).json({ error: 'Слишком много попыток. Попробуй через 15 минут.' });
  }
  times.push(now);
  loginAttempts.set(ip, times);
  next();
}

// ── Регистрация ──────────────────────────────────────────────
router.post('/register', async (req, res) => {
  const { name, email, password, ageGroup, gender } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'Заполни все поля' });
  if (password.length < 6) return res.status(400).json({ error: 'Пароль минимум 6 символов' });

  try {
    const hash = await bcrypt.hash(password, 10);
    const { rows } = await pool.query(
      'INSERT INTO users (name, email, password, age_group, gender) VALUES ($1,$2,$3,$4,$5) RETURNING id, name, email, total_score, sessions_count',
      [name, email, hash, ageGroup || null, gender || null]
    );
    res.json({ token: sign(rows[0].id), user: rows[0] });
  } catch (e) {
    if (e.code === '23505') return res.status(409).json({ error: 'Email уже зарегистрирован' });
    console.error(e);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// ── Вход ─────────────────────────────────────────────────────
router.post('/login', rateLimit, async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Заполни все поля' });

  try {
    const { rows } = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
    const user = rows[0];
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Неверный email или пароль' });
    }
    const { password: _, ...safe } = user;
    res.json({ token: sign(user.id), user: safe });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// ── Текущий пользователь ─────────────────────────────────────
router.get('/me', requireAuth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, name, email, age_group, gender, total_score, sessions_count FROM users WHERE id=$1',
      [req.user.id]
    );
    if (!rows[0]) return res.status(404).json({ error: 'Пользователь не найден' });
    res.json({ user: rows[0] });
  } catch (e) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// ── Восстановление пароля ─────────────────────────────────────
router.post('/forgot-password', rateLimit, async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Введи email' });

  try {
    const { rows } = await pool.query('SELECT id FROM users WHERE email=$1', [email]);
    // Не раскрываем, существует ли email
    if (!rows[0]) return res.json({ ok: true });

    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 час
    await pool.query(
      'INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES ($1,$2,$3)',
      [rows[0].id, token, expires]
    );

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
    const link = `${process.env.APP_URL}/reset-password?token=${token}`;
    await transporter.sendMail({
      from: `"EduPlay" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Восстановление пароля EduPlay',
      html: `<p>Привет! Для сброса пароля перейди по ссылке:</p><p><a href="${link}">${link}</a></p><p>Ссылка действительна 1 час.</p>`,
    });

    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// ── Сброс пароля по токену ────────────────────────────────────
router.post('/reset-password', async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password) return res.status(400).json({ error: 'Неверный запрос' });

  try {
    const { rows } = await pool.query(
      'SELECT * FROM password_reset_tokens WHERE token=$1 AND used=FALSE AND expires_at > NOW()',
      [token]
    );
    if (!rows[0]) return res.status(400).json({ error: 'Ссылка недействительна или устарела' });

    const hash = await bcrypt.hash(password, 10);
    await pool.query('UPDATE users SET password=$1 WHERE id=$2', [hash, rows[0].user_id]);
    await pool.query('UPDATE password_reset_tokens SET used=TRUE WHERE id=$1', [rows[0].id]);

    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// ── Удаление аккаунта ─────────────────────────────────────────
router.delete('/account', requireAuth, async (req, res) => {
  const { password } = req.body;
  try {
    const { rows } = await pool.query('SELECT * FROM users WHERE id=$1', [req.user.id]);
    if (!rows[0] || !(await bcrypt.compare(password, rows[0].password))) {
      return res.status(401).json({ error: 'Неверный пароль' });
    }
    await pool.query('DELETE FROM users WHERE id=$1', [req.user.id]);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

module.exports = router;
