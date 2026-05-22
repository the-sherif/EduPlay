'use strict';

// ══ Темы ══
const allThemes = [
  { id: 'dark',    name: 'Тёмная ночь',    emoji: '🌙', bg: '#060918', c1: '#6366f1', c2: '#8b5cf6' },
  { id: 'girl',    name: 'Розовый сад',    emoji: '🌸', bg: '#fdf2fb', c1: '#c026d3', c2: '#7c3aed' },
  { id: 'boy',     name: 'Океан',          emoji: '🌊', bg: '#eef6ff', c1: '#2563eb', c2: '#0891b2' },
  { id: 'kids',    name: 'Яркие краски',   emoji: '🎨', bg: '#fffbf0', c1: '#f97316', c2: '#7c3aed' },
  { id: 'neutral', name: 'Молочный туман', emoji: '☁️', bg: '#f5f4f0', c1: '#5c6bc0', c2: '#7986cb' },
  { id: 'forest',  name: 'Зелёный лес',   emoji: '🌿', bg: '#f0fdf4', c1: '#16a34a', c2: '#0d9488' },
  { id: 'sunset',  name: 'Закат',          emoji: '🌅', bg: '#fff7ed', c1: '#ea580c', c2: '#db2777' },
  { id: 'galaxy',  name: 'Галактика',      emoji: '🌌', bg: '#0f0728', c1: '#a855f7', c2: '#ec4899' },
  { id: 'mint',    name: 'Мята',           emoji: '🍃', bg: '#f0fdfa', c1: '#0d9488', c2: '#0891b2' },
  { id: 'cherry',  name: 'Вишня',          emoji: '🍒', bg: '#fff1f2', c1: '#e11d48', c2: '#f43f5e' },
];

function getTheme(ageRange, gender) {
  if (ageRange === 'child') return 'kids';
  return gender === 'girl' ? 'girl' : 'boy';
}

function applyTheme(theme) {
  document.body.classList.remove('theme-kids', 'theme-girl', 'theme-boy', 'theme-neutral', 'theme-forest', 'theme-sunset', 'theme-galaxy', 'theme-mint', 'theme-cherry');
  if (theme && theme !== 'dark') document.body.classList.add('theme-' + theme);
}

function hideLoader() {
  const loader = document.getElementById('screenLoader');
  if (!loader) return;
  loader.classList.add('hiding');
  setTimeout(() => { loader.style.display = 'none'; }, 400);
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
  hideLoader();
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

// ── Выбор темы ──
const themePickerModal = document.getElementById('themePickerModal');
const themeGrid        = document.getElementById('themeGrid');

document.getElementById('btnOpenThemePicker').addEventListener('click', () => {
  settingsModal.classList.remove('active');
  buildThemePicker();
  themePickerModal.classList.add('active');
});
themePickerModal.addEventListener('click', e => {
  if (e.target === themePickerModal) themePickerModal.classList.remove('active');
});

function buildThemePicker() {
  const current = localStorage.getItem('eduTheme') || 'dark';
  themeGrid.innerHTML = '';
  allThemes.forEach(t => {
    const card = document.createElement('div');
    card.className = 'theme-card' + (t.id === current ? ' active-theme' : '');
    card.innerHTML = `
      <div class="theme-preview" style="background:${t.bg}">
        <div class="theme-dot" style="background:${t.c1}"></div>
        <div class="theme-dot" style="background:${t.c2}"></div>
        <span style="font-size:1.4rem">${t.emoji}</span>
      </div>
      <div class="theme-label">${t.name}</div>
    `;
    card.addEventListener('click', () => {
      localStorage.setItem('eduTheme', t.id);
      applyTheme(t.id);
      themePickerModal.classList.remove('active');
    });
    themeGrid.appendChild(card);
  });
}

// ── Выход ──
document.getElementById('btnLogout').addEventListener('click', () => {
  profileModal.classList.remove('active');
  auth.signOut();
});

// ── Удаление аккаунта ──
const deleteModal   = document.getElementById('deleteModal');
let needsReAuth     = false;

document.getElementById('btnDeleteAccount').addEventListener('click', () => {
  profileModal.classList.remove('active');
  needsReAuth = false;
  document.getElementById('reAuthSection').style.display = 'none';
  document.getElementById('deletePassword').value = '';
  document.getElementById('deleteError').textContent = '';
  const btn = document.getElementById('btnConfirmDelete');
  btn.textContent = 'Да, удалить'; btn.disabled = false;
  deleteModal.classList.add('active');
});

document.getElementById('btnCancelDelete').addEventListener('click', () => deleteModal.classList.remove('active'));
deleteModal.addEventListener('click', e => { if (e.target === deleteModal) deleteModal.classList.remove('active'); });

document.getElementById('btnConfirmDelete').addEventListener('click', async () => {
  const btn = document.getElementById('btnConfirmDelete');
  const errEl = document.getElementById('deleteError');
  errEl.textContent = '';
  btn.disabled = true; btn.textContent = 'Удаляем...';

  try {
    if (needsReAuth) {
      const pass = document.getElementById('deletePassword').value;
      if (!pass) { errEl.textContent = 'Введи пароль'; btn.disabled = false; btn.textContent = 'Да, удалить'; return; }
      const credential = firebase.auth.EmailAuthProvider.credential(auth.currentUser.email, pass);
      await auth.currentUser.reauthenticateWithCredential(credential);
    }
    await auth.currentUser.delete();
    localStorage.removeItem('eduTheme');
    deleteModal.classList.remove('active');
  } catch (e) {
    if (e.code === 'auth/requires-recent-login') {
      needsReAuth = true;
      document.getElementById('reAuthSection').style.display = 'block';
      errEl.textContent = 'Нужно подтвердить личность';
    } else {
      errEl.textContent = friendlyError(e.code);
    }
    btn.disabled = false; btn.textContent = 'Да, удалить';
  }
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
