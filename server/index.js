'use strict';
require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const path    = require('path');

const app = express();

app.use(cors({ origin: process.env.APP_URL || '*' }));
app.use(express.json());

// ── API маршруты ──────────────────────────────────────────────
app.use('/api/auth',     require('./routes/auth'));
app.use('/api/sessions', require('./routes/sessions'));

// ── Раздача фронтенда ─────────────────────────────────────────
const www = path.join(__dirname, '../www');
app.use(express.static(www));
app.get('*', (_, res) => res.sendFile(path.join(www, 'index.html')));

// ── Запуск ─────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`EduPlay server running on port ${PORT}`));
