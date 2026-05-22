'use strict';

// ── Сохранить результат сессии ──
async function saveSession({ topicId, topicName, subject, gradeGroup, score, total, pct }) {
  try {
    const { stats } = await window.api('/api/sessions', {
      method: 'POST',
      body: { topicId, topicName, subject, gradeGroup, score, total, pct },
    });
    document.getElementById('statTotalScore').textContent = stats.total_score   ?? 0;
    document.getElementById('statSessions').textContent   = stats.sessions_count ?? 0;
  } catch (e) {
    console.error('saveSession error:', e);
  }
}

// ── Загрузить статистику пользователя ──
async function loadUserStats() {
  try {
    const { user } = await window.api('/api/auth/me');
    document.getElementById('statTotalScore').textContent = user.total_score    ?? 0;
    document.getElementById('statSessions').textContent   = user.sessions_count ?? 0;
  } catch (e) {
    console.error('loadUserStats error:', e);
  }
}

window.saveSession   = saveSession;
window.loadUserStats = loadUserStats;
