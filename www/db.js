'use strict';

const db = firebase.firestore();

// ── Сохранить результат сессии ──
async function saveSession({ topicId, topicName, subject, gradeGroup, score, total, pct }) {
  const user = auth.currentUser;
  if (!user) return;

  const userRef    = db.collection('users').doc(user.uid);
  const sessionRef = userRef.collection('sessions').doc();

  try {
    const batch = db.batch();

    batch.set(sessionRef, {
      topicId, topicName, subject, gradeGroup,
      score, total, pct,
      completedAt: firebase.firestore.FieldValue.serverTimestamp(),
    });

    batch.set(userRef, {
      totalScore:    firebase.firestore.FieldValue.increment(score),
      sessionsCount: firebase.firestore.FieldValue.increment(1),
      displayName:   user.displayName || '',
      email:         user.email,
    }, { merge: true });

    await batch.commit();
    await loadUserStats();
  } catch (e) {
    console.error('saveSession error:', e);
  }
}

// ── Загрузить статистику пользователя ──
async function loadUserStats() {
  const user = auth.currentUser;
  if (!user) return;

  try {
    const doc = await db.collection('users').doc(user.uid).get();
    const data = doc.exists ? doc.data() : { totalScore: 0, sessionsCount: 0 };
    document.getElementById('statTotalScore').textContent = data.totalScore    ?? 0;
    document.getElementById('statSessions').textContent   = data.sessionsCount ?? 0;
  } catch (e) {
    console.error('loadUserStats error:', e);
  }
}

window.saveSession  = saveSession;
window.loadUserStats = loadUserStats;
