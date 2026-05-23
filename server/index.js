'use strict';
require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const path    = require('path');
const pool    = require('./db');

const app = express();

app.use(cors({ origin: process.env.APP_URL || '*' }));
app.use(express.json());

// ── API маршруты ──────────────────────────────────────────────
app.use('/api/auth',     require('./routes/auth'));
app.use('/api/sessions', require('./routes/sessions'));

// ── Раздача фронтенда ─────────────────────────────────────────
const www = path.join(__dirname, '../www');
app.use(express.static(www));
app.get('/{*splat}', (_, res) => res.sendFile(path.join(www, 'index.html')));

// ── Очистка устаревших токенов сброса пароля (раз в час) ──────
setInterval(async () => {
  try {
    await pool.query('DELETE FROM password_reset_tokens WHERE expires_at < NOW() OR used = TRUE');
  } catch (e) {
    console.error('Token cleanup error:', e);
  }
}, 60 * 60 * 1000);

// ── Запуск ─────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`EduPlay server running on port ${PORT}`));
