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
    loadSessionHistory();
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

// ── История сессий на главной ──
async function loadSessionHistory() {
  try {
    const { sessions } = await window.api('/api/sessions');
    const section = document.getElementById('sessionsSection');
    const list    = document.getElementById('sessionsList');
    if (!sessions.length) { section.style.display = 'none'; return; }

    list.innerHTML = '';
    sessions.slice(0, 5).forEach(s => {
      const date = new Date(s.completed_at).toLocaleDateString('ru', { day: 'numeric', month: 'short' });
      const item = document.createElement('div');
      item.className = 'session-item';
      item.innerHTML = `
        <span class="session-topic">${s.topic_name}</span>
        <span class="session-score">${s.score}/${s.total}</span>
        <span class="session-date">${date}</span>
      `;
      list.appendChild(item);
    });
    section.style.display = '';
  } catch (e) {
    console.error('loadSessionHistory error:', e);
  }
}

window.saveSession          = saveSession;
window.loadUserStats        = loadUserStats;
window.loadSessionHistory   = loadSessionHistory;
