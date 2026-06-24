'use strict';

// ══ Темы ══
const allThemes = [
  // Стандартные
  { id: 'dark',      name: 'Тёмная ночь',    emoji: '🌙', bg: '#060918', c1: '#6366f1', c2: '#8b5cf6', cat: 'standard' },
  { id: 'girl',      name: 'Розовый сад',    emoji: '🌸', bg: '#fdf2fb', c1: '#c026d3', c2: '#7c3aed', cat: 'standard' },
  { id: 'boy',       name: 'Океан',          emoji: '🌊', bg: '#eef6ff', c1: '#2563eb', c2: '#0891b2', cat: 'standard' },
  { id: 'kids',      name: 'Яркие краски',   emoji: '🎨', bg: '#fffbf0', c1: '#f97316', c2: '#7c3aed', cat: 'standard' },
  { id: 'neutral',   name: 'Молочный туман', emoji: '☁️', bg: '#f5f4f0', c1: '#5c6bc0', c2: '#7986cb', cat: 'standard' },
  { id: 'forest',    name: 'Зелёный лес',    emoji: '🌿', bg: '#f0fdf4', c1: '#16a34a', c2: '#0d9488', cat: 'standard' },
  { id: 'sunset',    name: 'Закат',          emoji: '🌅', bg: '#fff7ed', c1: '#ea580c', c2: '#db2777', cat: 'standard' },
  { id: 'galaxy',    name: 'Галактика',      emoji: '🌌', bg: '#0f0728', c1: '#a855f7', c2: '#ec4899', cat: 'standard' },
  { id: 'mint',      name: 'Мята',           emoji: '🍃', bg: '#f0fdfa', c1: '#0d9488', c2: '#0891b2', cat: 'standard' },
  { id: 'cherry',    name: 'Вишня',          emoji: '🍒', bg: '#fff1f2', c1: '#e11d48', c2: '#f43f5e', cat: 'standard' },
  // Животные
  { id: 'tiger',     name: 'Тигр',           emoji: '🐯', bg: '#1c0a00', c1: '#f97316', c2: '#dc2626', cat: 'animal' },
  { id: 'lion',      name: 'Лев',            emoji: '🦁', bg: '#fdf8e7', c1: '#d97706', c2: '#92400e', cat: 'animal' },
  { id: 'wolf',      name: 'Волк',           emoji: '🐺', bg: '#0d1117', c1: '#94a3b8', c2: '#3b82f6', cat: 'animal' },
  { id: 'fox',       name: 'Лиса',           emoji: '🦊', bg: '#fff8f0', c1: '#ea580c', c2: '#854d0e', cat: 'animal' },
  { id: 'panda',     name: 'Панда',          emoji: '🐼', bg: '#111827', c1: '#f1f5f9', c2: '#ec4899', cat: 'animal' },
  { id: 'pig',       name: 'Свинка',         emoji: '🐷', bg: '#fce7f3', c1: '#db2777', c2: '#9d174d', cat: 'animal' },
  { id: 'butterfly', name: 'Бабочка',        emoji: '🦋', bg: '#1a0533', c1: '#a855f7', c2: '#06b6d4', cat: 'animal' },
  { id: 'koala',     name: 'Коала',          emoji: '🐨', bg: '#f0f7ff', c1: '#4b7cb8', c2: '#64a88a', cat: 'animal' },
];

function getTheme(ageRange, gender) {
  if (ageRange === 'child') return 'kids';
  return gender === 'girl' ? 'girl' : 'boy';
}

function applyTheme(theme) {
  document.body.classList.remove(
    'theme-kids','theme-girl','theme-boy','theme-neutral','theme-forest',
    'theme-sunset','theme-galaxy','theme-mint','theme-cherry',
    'theme-tiger','theme-lion','theme-wolf','theme-fox',
    'theme-panda','theme-pig','theme-butterfly','theme-koala'
  );
  if (theme && theme !== 'dark') document.body.classList.add('theme-' + theme);
  if (document.getElementById('screenHome')?.classList.contains('active')) {
    window.setThemeBg?.(theme || 'dark');
  }
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

// ══ API ══
async function api(path, opts = {}) {
  const token = localStorage.getItem('eduToken');
  const res = await fetch(path, {
    ...opts,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...opts.headers,
    },
    body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw Object.assign(new Error(data.error || 'Ошибка сервера'), { status: res.status });
  return data;
}
window.api = api;

// ══ Текущий пользователь ══
let currentUser = null;

function setCurrentUser(user) {
  currentUser = user;
  if (user) updateUserUI(user);
}

// ══ Навигация ══
const GAME_SCREENS = ['screenGradeGroup', 'screenTopics', 'screenTheory', 'screenExercise'];

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  requestAnimationFrame(() => requestAnimationFrame(() => {
    document.getElementById(id)?.classList.add('active');
  }));
  if (id === 'screenHome') {
    window.setThemeBg?.(localStorage.getItem('eduTheme') || 'dark');
  } else if (GAME_SCREENS.includes(id)) {
    window.clearThemeBg?.();
  }
}

// ══ Хелперы UI ══
const tx = text => window.i18n?.tSync(text) ?? text;

function setError(id, msg) { document.getElementById(id).textContent = msg; }
function clearMsg(...ids) { ids.forEach(id => document.getElementById(id).textContent = ''); }
function setLoading(btn, loading) {
  btn.disabled = loading;
  btn.textContent = loading ? tx('Загрузка...') : btn.dataset.label;
}

['btnLogin', 'btnRegister'].forEach(id => {
  const btn = document.getElementById(id);
  btn.dataset.label = btn.textContent;
});

function updateUserUI(user) {
  const name = user.name || user.email.split('@')[0];
  document.getElementById('userName').textContent = name;
  document.getElementById('userEmailLabel').textContent = user.email;
}

// ══ Инициализация авторизации ══
async function initAuth() {
  // DEV bypass: ?dev=home
  if (new URLSearchParams(location.search).get('dev') === 'home') {
    setCurrentUser({ name: 'Dev User', email: 'dev@eduplay.local', total_score: 420, sessions_count: 7 });
    hideLoader();
    showScreen('screenHome');
    return;
  }
  const token = localStorage.getItem('eduToken');
  if (!token) {
    hideLoader();
    showScreen('screenLogin');
    return;
  }
  try {
    const { user } = await api('/api/auth/me');
    setCurrentUser(user);
    showScreen('screenHome');
    window.loadUserStats?.();
    window.loadSessionHistory?.();
  } catch {
    localStorage.removeItem('eduToken');
    showScreen('screenLogin');
  } finally {
    hideLoader();
  }
}
initAuth();

// ══ Логин ══
document.getElementById('btnLogin').addEventListener('click', async () => {
  const email = document.getElementById('loginEmail').value.trim();
  const pass  = document.getElementById('loginPassword').value;
  clearMsg('loginError');

  if (!email || !pass) { setError('loginError', 'Заполни все поля'); return; }

  const btn = document.getElementById('btnLogin');
  setLoading(btn, true);
  try {
    const { token, user } = await api('/api/auth/login', { method: 'POST', body: { email, password: pass } });
    localStorage.setItem('eduToken', token);
    setCurrentUser(user);
    if (!localStorage.getItem('eduOnboarded')) {
      buildCarousel();
      showScreen('screenOnboarding');
    } else {
      showScreen('screenHome');
      window.loadUserStats?.();
      window.loadSessionHistory?.();
    }
  } catch (e) {
    setError('loginError', e.message);
    setLoading(btn, false);
  }
});

// ══ Регистрация ══
let pendingEmail = null;

document.getElementById('btnRegister').addEventListener('click', async () => {
  const name    = document.getElementById('regName').value.trim();
  const email   = document.getElementById('regEmail').value.trim();
  const pass    = document.getElementById('regPassword').value;
  const confirm = document.getElementById('regConfirm').value;
  clearMsg('registerError');

  if (!name || !email || !pass || !confirm) { setError('registerError', 'Заполни все поля'); return; }
  if (pass !== confirm)  { setError('registerError', 'Пароли не совпадают'); return; }
  if (pass.length < 6)   { setError('registerError', 'Пароль минимум 6 символов'); return; }

  const btn = document.getElementById('btnRegister');
  setLoading(btn, true);
  try {
    await api('/api/auth/register', { method: 'POST', body: { name, email, password: pass } });
    pendingEmail = email;
    document.getElementById('verifyEmailHint').textContent = `Мы отправили код на ${email}`;
    document.getElementById('verifyCode').value = '';
    clearMsg('verifyError');
    showScreen('screenVerify');
  } catch (e) {
    setError('registerError', e.message);
    setLoading(btn, false);
  }
});

// ══ Верификация email ══
document.getElementById('btnVerify').addEventListener('click', async () => {
  const code = document.getElementById('verifyCode').value.trim();
  clearMsg('verifyError');
  if (!code || code.length < 4) { setError('verifyError', 'Введи код из письма'); return; }
  if (!pendingEmail) { setError('verifyError', 'Сессия истекла, зарегистрируйся снова'); return; }

  const btn = document.getElementById('btnVerify');
  setLoading(btn, true);
  try {
    const { token, user } = await api('/api/auth/verify-email', {
      method: 'POST', body: { email: pendingEmail, code },
    });
    localStorage.setItem('eduToken', token);
    setCurrentUser(user);
    pendingEmail = null;
    if (!localStorage.getItem('eduOnboarded')) {
      buildCarousel();
      showScreen('screenOnboarding');
    } else {
      showScreen('screenHome');
      window.loadUserStats?.();
      window.loadSessionHistory?.();
    }
  } catch (e) {
    setError('verifyError', e.message);
    setLoading(btn, false);
  }
});

document.getElementById('backFromVerify').addEventListener('click', () => showScreen('screenRegister'));

document.getElementById('btnResendCode').addEventListener('click', async () => {
  if (!pendingEmail) return;
  const nameVal  = document.getElementById('regName').value.trim();
  const passVal  = document.getElementById('regPassword').value;
  try {
    await api('/api/auth/register', { method: 'POST', body: { name: nameVal, email: pendingEmail, password: passVal } });
    setError('verifyError', 'Новый код отправлен');
  } catch (e) {
    setError('verifyError', e.message);
  }
});

// ══ Онбординг: карусель стилей ══
const STYLE_DEFS = [
  { id:'game',      name:'Game',      desc:'Тёмный и неоновый',     bg:'#0c0c10', accent:'#39ff8a', accent2:'#00d4ff', cardBg:'rgba(57,255,138,0.08)', text:'#fff' },
  { id:'editorial', name:'Editorial', desc:'Чистый и смелый',       bg:'#f7f5f0', accent:'#1a1a2e', accent2:'#4f46e5', cardBg:'rgba(255,255,255,0.9)', text:'#1a1a2e' },
  { id:'soft',      name:'Soft',      desc:'Тёплый и мягкий',       bg:'#fff8f0', accent:'#ff6b6b', accent2:'#d946ef', cardBg:'rgba(255,255,255,0.85)', text:'#1a0a00' },
  { id:'y2k',       name:'Y2K',       desc:'Голографический',       bg:'#08000f', accent:'#ff9de2', accent2:'#9de2ff', cardBg:'rgba(255,157,226,0.08)', text:'#f0e8ff' },
  { id:'brutal',    name:'Brutal',    desc:'Контрастный и резкий',  bg:'#f2f0e8', accent:'#e63946', accent2:'#1a1a1a', cardBg:'#fff', text:'#1a1a1a' },
  { id:'aurora',    name:'Aurora',    desc:'Тёмный люкс',           bg:'#010208', accent:'#00e5a0', accent2:'#a855f7', cardBg:'rgba(0,229,160,0.06)', text:'rgba(255,255,255,0.9)' },
];

let carouselIndex = 0;

function buildCarousel() {
  const track  = document.getElementById('carouselTrack');
  const dotsEl = document.getElementById('carouselDots');
  track.innerHTML  = '';
  dotsEl.innerHTML = '';
  carouselIndex    = 0;

  STYLE_DEFS.forEach((s, i) => {
    const card = document.createElement('div');
    card.className = 'style-card' + (i === 0 ? ' active' : '');
    card.style.cssText = `background:${s.bg};color:${s.text}`;
    card.innerHTML = `
      <div class="style-card-inner">
        <div class="style-card-preview">
          <div class="sc-header">
            <div class="sc-avatar" style="background:linear-gradient(135deg,${s.accent},${s.accent2})"></div>
            <div class="sc-lines">
              <div class="sc-line long"  style="background:${s.text}"></div>
              <div class="sc-line short" style="background:${s.text}"></div>
            </div>
          </div>
          <div class="sc-cards">
            <div class="sc-card" style="background:${s.cardBg};border:1.5px solid ${s.accent}30"></div>
            <div class="sc-card" style="background:${s.cardBg};border:1.5px solid ${s.accent}30"></div>
            <div class="sc-card" style="background:${s.cardBg};border:1.5px solid ${s.accent}30"></div>
            <div class="sc-card" style="background:${s.cardBg};border:1.5px solid ${s.accent}30"></div>
          </div>
          <div class="sc-bar" style="background:linear-gradient(90deg,${s.accent},${s.accent2});box-shadow:0 0 10px ${s.accent}55"></div>
        </div>
        <div class="style-card-info" style="color:${s.text}">
          <div class="style-card-name">${s.name}</div>
          <div class="style-card-desc">${s.desc}</div>
        </div>
      </div>`;
    card.addEventListener('click', () => goToSlide(i));
    track.appendChild(card);

    const dot = document.createElement('button');
    dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => goToSlide(i));
    dotsEl.appendChild(dot);
  });

  updateCarousel();
  initCarouselSwipe();
}

function goToSlide(i) {
  carouselIndex = Math.max(0, Math.min(i, STYLE_DEFS.length - 1));
  updateCarousel();
}

function updateCarousel() {
  const cards = document.querySelectorAll('.style-card');
  const dots  = document.querySelectorAll('.carousel-dot');
  cards.forEach((c, i) => c.classList.toggle('active', i === carouselIndex));
  dots.forEach((d, i)  => d.classList.toggle('active', i === carouselIndex));

  const track     = document.getElementById('carouselTrack');
  const vp        = document.querySelector('.carousel-viewport');
  if (!track || !vp) return;
  const cardW     = 210 + 14;
  const vpCenter  = vp.offsetWidth / 2;
  const offset    = vpCenter - 80 - carouselIndex * cardW - 105;
  track.style.transform = `translateX(${offset}px)`;
}

function initCarouselSwipe() {
  const vp = document.querySelector('.carousel-viewport');
  if (!vp) return;
  let startX = 0;
  vp.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  vp.addEventListener('touchend',   e => {
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) goToSlide(carouselIndex + (dx < 0 ? 1 : -1));
  }, { passive: true });
}

document.getElementById('btnSelectStyle').addEventListener('click', () => {
  const style = STYLE_DEFS[carouselIndex];
  localStorage.setItem('eduStyle',    style.id);
  localStorage.setItem('eduOnboarded','1');
  localStorage.setItem('eduTheme',    style.id);
  applyTheme(style.id);
  showScreen('screenHome');
  window.loadUserStats?.();
  window.loadSessionHistory?.();
});

// ══ Восстановление пароля ══
let forgotLastSent = 0;
const FORGOT_COOLDOWN = 60_000;

document.getElementById('btnForgot').addEventListener('click', async () => {
  const email = document.getElementById('forgotEmail').value.trim();
  clearMsg('forgotError');

  if (!email) { setError('forgotError', 'Введи email'); return; }

  const now = Date.now();
  const elapsed = now - forgotLastSent;
  if (elapsed < FORGOT_COOLDOWN) {
    const sec = Math.ceil((FORGOT_COOLDOWN - elapsed) / 1000);
    const msg = window.i18n?.lang === 'en'
      ? `Wait ${sec} sec. before sending again`
      : `Подожди ${sec} сек. перед повторной отправкой`;
    setError('forgotError', msg);
    return;
  }

  forgotLastSent = now;
  try {
    await api('/api/auth/forgot-password', { method: 'POST', body: { email } });
    document.getElementById('forgotForm').style.display = 'none';
    document.getElementById('forgotDone').style.display = '';
  } catch (e) {
    forgotLastSent = 0;
    setError('forgotError', e.message);
  }
});

document.getElementById('backFromForgotDone').addEventListener('click', () => {
  document.getElementById('forgotDone').style.display = 'none';
  document.getElementById('forgotForm').style.display = '';
  document.getElementById('forgotEmail').value = '';
  clearMsg('forgotError');
  showScreen('screenLogin');
});

// ══ Профиль ══
const profileModal  = document.getElementById('profileModal');
const settingsModal = document.getElementById('settingsModal');

document.getElementById('btnProfile').addEventListener('click', () => {
  if (!currentUser) return;
  const name = currentUser.name || currentUser.email.split('@')[0];
  document.getElementById('profileAvatarBig').textContent = name.charAt(0).toUpperCase();
  document.getElementById('profileName').textContent  = name;
  document.getElementById('profileEmail').textContent = currentUser.email;
  profileModal.classList.add('active');
});
profileModal.addEventListener('click', e => {
  if (e.target === profileModal) profileModal.classList.remove('active');
});

// ══ Настройки ══
document.getElementById('btnSettings').addEventListener('click', () => settingsModal.classList.add('active'));
settingsModal.addEventListener('click', e => {
  if (e.target === settingsModal) settingsModal.classList.remove('active');
});

// ══ Выбор темы ══
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

let activeThemeCat = 'standard';

document.getElementById('themeTabs').addEventListener('click', e => {
  const tab = e.target.closest('.theme-tab');
  if (!tab) return;
  activeThemeCat = tab.dataset.cat;
  document.querySelectorAll('#themeTabs .theme-tab').forEach(t => t.classList.toggle('active', t === tab));
  renderThemeGrid();
});

function renderThemeGrid() {
  const current = localStorage.getItem('eduTheme') || 'dark';
  themeGrid.innerHTML = '';
  if (activeThemeCat === 'cartoon') {
    themeGrid.innerHTML = `<div class="theme-soon">${tx('🚀 Мультяшные темы — скоро!')}</div>`;
    return;
  }
  allThemes.filter(t => t.cat === activeThemeCat).forEach(t => {
    const card = document.createElement('div');
    card.className = 'theme-card' + (t.id === current ? ' active-theme' : '');
    card.innerHTML = `
      <div class="theme-preview" style="background:${t.bg}">
        <div class="theme-dot" style="background:${t.c1}"></div>
        <div class="theme-dot" style="background:${t.c2}"></div>
        <span style="font-size:1.4rem">${t.emoji}</span>
      </div>
      <div class="theme-label">${tx(t.name)}</div>
    `;
    card.addEventListener('click', () => {
      localStorage.setItem('eduTheme', t.id);
      applyTheme(t.id);
      themePickerModal.classList.remove('active');
    });
    themeGrid.appendChild(card);
  });
}

function buildThemePicker() { renderThemeGrid(); }

// ══ Выход ══
document.getElementById('btnLogout').addEventListener('click', () => {
  profileModal.classList.remove('active');
  localStorage.removeItem('eduToken');
  currentUser = null;
  showScreen('screenLogin');
});

// ══ Удаление аккаунта ══
const deleteModal = document.getElementById('deleteModal');

document.getElementById('btnDeleteAccount').addEventListener('click', () => {
  profileModal.classList.remove('active');
  document.getElementById('deletePassword').value = '';
  document.getElementById('deleteError').textContent = '';
  document.getElementById('reAuthSection').style.display = 'block';
  const btn = document.getElementById('btnConfirmDelete');
  btn.textContent = tx('Да, удалить'); btn.disabled = false;
  deleteModal.classList.add('active');
});

document.getElementById('btnCancelDelete').addEventListener('click', () => deleteModal.classList.remove('active'));
deleteModal.addEventListener('click', e => { if (e.target === deleteModal) deleteModal.classList.remove('active'); });

document.getElementById('btnConfirmDelete').addEventListener('click', async () => {
  const btn = document.getElementById('btnConfirmDelete');
  const errEl = document.getElementById('deleteError');
  errEl.textContent = '';

  const pass = document.getElementById('deletePassword').value;
  if (!pass) { errEl.textContent = tx('Введи пароль'); return; }

  btn.disabled = true; btn.textContent = tx('Удаляем...');
  try {
    await api('/api/auth/account', { method: 'DELETE', body: { password: pass } });
    localStorage.removeItem('eduToken');
    localStorage.removeItem('eduTheme');
    currentUser = null;
    deleteModal.classList.remove('active');
    showScreen('screenLogin');
  } catch (e) {
    errEl.textContent = e.message;
    btn.disabled = false; btn.textContent = tx('Да, удалить');
  }
});

// ══ Навигация между экранами авторизации ══
document.getElementById('toRegister').addEventListener('click', () => { clearMsg('loginError'); showScreen('screenRegister'); });
document.getElementById('toForgot').addEventListener('click',   () => { clearMsg('loginError'); showScreen('screenForgot'); });
document.getElementById('backFromRegister').addEventListener('click', () => showScreen('screenLogin'));
document.getElementById('backFromForgot').addEventListener('click',   () => showScreen('screenLogin'));

// ══ Выбор языка ══
const langPickerModal = document.getElementById('langPickerModal');

document.getElementById('btnOpenLangPicker').addEventListener('click', () => {
  settingsModal.classList.remove('active');
  document.querySelectorAll('.lang-option').forEach(btn => {
    btn.classList.toggle('active-lang', btn.dataset.lang === window.i18n.lang);
  });
  langPickerModal.classList.add('active');
});
langPickerModal.addEventListener('click', e => {
  if (e.target === langPickerModal) langPickerModal.classList.remove('active');
});
document.querySelectorAll('.lang-option').forEach(btn => {
  btn.addEventListener('click', () => {
    window.i18n.apply(btn.dataset.lang);
    langPickerModal.classList.remove('active');
    ['btnLogin', 'btnRegister'].forEach(id => {
      const b = document.getElementById(id);
      if (!b.disabled) b.dataset.label = b.textContent;
    });
  });
});
