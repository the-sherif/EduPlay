'use strict';

// ══ Темы ══
function getTheme(ageRange, gender) {
  if (ageRange === 'adult')  return 'neutral';
  if (ageRange === 'child')  return 'kids';
  return gender === 'girl' ? 'girl' : 'boy';
}

function applyTheme(theme) {
  document.body.classList.remove('theme-kids', 'theme-girl', 'theme-boy', 'theme-neutral');
  if (theme) document.body.classList.add('theme-' + theme);
}

function loadTheme() {
  const theme = localStorage.getItem('eduTheme');
  if (theme) applyTheme(theme);
}

loadTheme();

// ── Firebase конфиг (заменить на свой после создания проекта) ──
const firebaseConfig = {
  apiKey:            "AIzaSyAtW1nL93lV_JjANK9KpIWfUYeKDoroarw",
  authDomain:        "eduplay-e2a49.firebaseapp.com",
  projectId:         "eduplay-e2a49",
  storageBucket:     "eduplay-e2a49.firebasestorage.app",
  messagingSenderId: "906506053717",
  appId:             "1:906506053717:web:b56b136ce349d9efb88cdc",
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
auth.languageCode = 'ru';

// ── Навигация ──
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  requestAnimationFrame(() => requestAnimationFrame(() => {
    document.getElementById(id)?.classList.add('active');
  }));
}

function setError(id, msg) { document.getElementById(id).textContent = msg; }
function clearMsg(...ids) { ids.forEach(id => document.getElementById(id).textContent = ''); }
function setLoading(btn, loading) {
  btn.disabled = loading;
  btn.textContent = loading ? 'Загрузка...' : btn.dataset.label;
}

document.querySelectorAll('.btn-primary').forEach(btn => btn.dataset.label = btn.textContent);

// ── Обновление UI пользователя ──
function updateUserUI(user, overrideName) {
  const name = overrideName || user.displayName || user.email.split('@')[0];
  document.getElementById('userName').textContent = name;
  document.getElementById('userEmailLabel').textContent = user.email;
}

// ── Слежка за состоянием авторизации ──
auth.onAuthStateChanged(user => {
  if (user) {
    updateUserUI(user);
    showScreen('screenHome');
  } else {
    showScreen('screenLogin');
  }
});

// ── Логин ──
document.getElementById('btnLogin').addEventListener('click', async () => {
  const email = document.getElementById('loginEmail').value.trim();
  const pass  = document.getElementById('loginPassword').value;
  clearMsg('loginError');

  if (!email || !pass) { setError('loginError', 'Заполни все поля'); return; }

  const btn = document.getElementById('btnLogin');
  setLoading(btn, true);
  try {
    await auth.signInWithEmailAndPassword(email, pass);
  } catch (e) {
    setError('loginError', friendlyError(e.code));
    setLoading(btn, false);
  }
});

// ── Регистрация: выбор возраста и пола ──
let selectedAge    = null;
let selectedGender = null;

document.getElementById('ageSelector').addEventListener('click', e => {
  const btn = e.target.closest('.sel-btn');
  if (!btn) return;
  document.querySelectorAll('#ageSelector .sel-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  selectedAge = btn.dataset.age;
  const genderSection = document.getElementById('genderSelector');
  const genderLabel   = document.getElementById('genderLabel');
  const hide = selectedAge === 'adult';
  genderSection.style.display = hide ? 'none' : 'flex';
  genderLabel.style.display   = hide ? 'none' : 'block';
  if (hide) selectedGender = null;
});

document.getElementById('genderSelector').addEventListener('click', e => {
  const btn = e.target.closest('.sel-btn');
  if (!btn) return;
  document.querySelectorAll('#genderSelector .sel-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  selectedGender = btn.dataset.gender;
});

// ── Регистрация ──
document.getElementById('btnRegister').addEventListener('click', async () => {
  const name    = document.getElementById('regName').value.trim();
  const email   = document.getElementById('regEmail').value.trim();
  const pass    = document.getElementById('regPassword').value;
  const confirm = document.getElementById('regConfirm').value;
  clearMsg('registerError');

  if (!name || !email || !pass || !confirm) { setError('registerError', 'Заполни все поля'); return; }
  if (pass !== confirm) { setError('registerError', 'Пароли не совпадают'); return; }
  if (pass.length < 6)  { setError('registerError', 'Пароль минимум 6 символов'); return; }
  if (!selectedAge)     { setError('registerError', 'Укажи свой возраст'); return; }
  if (selectedAge !== 'adult' && !selectedGender) { setError('registerError', 'Укажи пол'); return; }

  const btn = document.getElementById('btnRegister');
  setLoading(btn, true);
  try {
    const cred = await auth.createUserWithEmailAndPassword(email, pass);
    await cred.user.updateProfile({ displayName: name });
    const theme = getTheme(selectedAge, selectedGender);
    localStorage.setItem('eduTheme', theme);
    applyTheme(theme);
    updateUserUI(cred.user, name);
  } catch (e) {
    setError('registerError', friendlyError(e.code));
    setLoading(btn, false);
  }
});

// ── Восстановление пароля ──
document.getElementById('btnForgot').addEventListener('click', async () => {
  const email = document.getElementById('forgotEmail').value.trim();
  clearMsg('forgotError', 'forgotSuccess');

  if (!email) { setError('forgotError', 'Введи email'); return; }

  const btn = document.getElementById('btnForgot');
  setLoading(btn, true);
  try {
    await auth.sendPasswordResetEmail(email);
    document.getElementById('forgotSuccess').textContent = 'Ссылка отправлена! Проверь почту.';
  } catch (e) {
    setError('forgotError', friendlyError(e.code));
  }
  setLoading(btn, false);
});

// ── Профиль ──
const profileModal   = document.getElementById('profileModal');
const settingsModal  = document.getElementById('settingsModal');

document.getElementById('btnProfile').addEventListener('click', () => {
  const user = auth.currentUser;
  if (!user) return;
  const name = user.displayName || user.email.split('@')[0];
  document.getElementById('profileAvatarBig').textContent = name.charAt(0).toUpperCase(); // большой аватар в модалке оставляем
  document.getElementById('profileName').textContent = name;
  document.getElementById('profileEmail').textContent = user.email;
  profileModal.classList.add('active');
});
profileModal.addEventListener('click', e => {
  if (e.target === profileModal) profileModal.classList.remove('active');
});

// ── Настройки ──
document.getElementById('btnSettings').addEventListener('click', () => {
  settingsModal.classList.add('active');
});
settingsModal.addEventListener('click', e => {
  if (e.target === settingsModal) settingsModal.classList.remove('active');
});

// ── Выход ──
document.getElementById('btnLogout').addEventListener('click', () => {
  profileModal.classList.remove('active');
  auth.signOut();
});

// ── Навигация между экранами авторизации ──
document.getElementById('toRegister').addEventListener('click', () => { clearMsg('loginError'); showScreen('screenRegister'); });
document.getElementById('toForgot').addEventListener('click',   () => { clearMsg('loginError'); showScreen('screenForgot'); });
document.getElementById('backFromRegister').addEventListener('click', () => showScreen('screenLogin'));
document.getElementById('backFromForgot').addEventListener('click',   () => showScreen('screenLogin'));

// ── Перевод ошибок Firebase ──
function friendlyError(code) {
  const map = {
    'auth/user-not-found':      'Пользователь не найден',
    'auth/wrong-password':      'Неверный пароль',
    'auth/email-already-in-use':'Этот email уже используется',
    'auth/invalid-email':       'Неверный формат email',
    'auth/weak-password':       'Пароль слишком простой',
    'auth/too-many-requests':   'Слишком много попыток. Попробуй позже',
    'auth/network-request-failed': 'Нет соединения',
    'auth/invalid-credential':  'Неверный email или пароль',
  };
  return map[code] || 'Что-то пошло не так';
}
