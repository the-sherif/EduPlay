'use strict';

const LANG_KEY  = 'eduLang';
const CACHE_KEY = 'eduI18nCache';

let currentLang = localStorage.getItem(LANG_KEY) || 'ru';
let apiCache    = {};
try { apiCache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}'); } catch {}

// ── Быстрый словарь (без API) ──
const QUICK = {
  // Loader
  'Загружаем...': 'Loading...',
  // Login
  'Учёба в формате игры': 'Learning through play',
  'Пароль': 'Password',
  'Войти': 'Sign In',
  'Забыл пароль': 'Forgot password',
  'Регистрация': 'Register',
  // Register
  'Создать аккаунт': 'Create Account',
  'Создай аккаунт': 'Create your account',
  'Имя': 'Name',
  'Повтори пароль': 'Confirm password',
  'Возраст': 'Age',
  '7–10 лет 🎒': '7–10 yrs 🎒',
  '11–14 лет 📚': '11–14 yrs 📚',
  '15–17 лет 🎮': '15–17 yrs 🎮',
  'Я много пожил и всё забыл 😂': 'I\'m old and forgot everything 😂',
  'Пол': 'Gender',
  '👦 Мальчик': '👦 Boy',
  '👧 Девочка': '👧 Girl',
  // Forgot
  'Восстановление': 'Password Reset',
  'Введи email — пришлём ссылку для сброса пароля': 'Enter your email — we\'ll send a reset link',
  'Отправить ссылку': 'Send Link',
  'Готово!': 'Done!',
  'Письмо отправлено на указанный email. Проверь почту (и папку «Спам»).': 'Email sent. Check your inbox (and spam folder).',
  'Вернуться': 'Go Back',
  // Home
  'Что учим сегодня?': 'What are we studying today?',
  'Математика': 'Math',
  'Физика': 'Physics',
  'Химия': 'Chemistry',
  'История': 'History',
  'Скоро': 'Soon',
  // Grades
  'Выбери класс': 'Choose grade',
  '1–4 класс': 'Grade 1–4',
  '5–7 класс': 'Grade 5–7',
  '8–9 класс': 'Grade 8–9',
  '10–11 класс': 'Grade 10–11',
  'Основы счёта': 'Basic counting',
  'Дроби и уравнения': 'Fractions & equations',
  'Алгебра и геометрия': 'Algebra & geometry',
  'Высшая математика': 'Advanced math',
  // Topic info labels
  '1 класс': 'Grade 1',
  '1–2 класс': 'Grade 1–2',
  '2 класс': 'Grade 2',
  '2–3 класс': 'Grade 2–3',
  '3 класс': 'Grade 3',
  '5 класс': 'Grade 5',
  '5–6 класс': 'Grade 5–6',
  '6 класс': 'Grade 6',
  '6–7 класс': 'Grade 6–7',
  '7 класс': 'Grade 7',
  '8 класс': 'Grade 8',
  '9 класс': 'Grade 9',
  '10 класс': 'Grade 10',
  '11 класс': 'Grade 11',
  // Topics g1
  'Счёт до 10': 'Count to 10',
  'Сложение до 100': 'Addition to 100',
  'Вычитание до 100': 'Subtraction to 100',
  'Сложение до 1000': 'Addition to 1000',
  'Вычитание до 1000': 'Subtraction to 1000',
  'Таблица × 2, 3, 4, 5': 'Times table × 2, 3, 4, 5',
  'Таблица × 6, 7, 8, 9': 'Times table × 6, 7, 8, 9',
  'Деление (на 2–5)': 'Division (by 2–5)',
  'Деление (на 6–9)': 'Division (by 6–9)',
  'Сравнение чисел': 'Comparing numbers',
  'Порядок чисел': 'Number order',
  'Чётные и нечётные': 'Even and odd',
  'Округление': 'Rounding',
  'Периметр': 'Perimeter',
  'Площадь': 'Area',
  'Доли (½, ¼, ⅓)': 'Fractions (½, ¼, ⅓)',
  'Время (часы и минуты)': 'Time (hours & minutes)',
  'Деньги и цены': 'Money & prices',
  'Задачи на сложение': 'Addition word problems',
  'Задачи на умножение': 'Multiplication word problems',
  // Topics g2
  'Обыкновенные дроби': 'Common fractions',
  'Десятичные дроби': 'Decimal fractions',
  'Проценты': 'Percentages',
  'Пропорции': 'Proportions',
  'Отрицательные числа': 'Negative numbers',
  'Линейные уравнения': 'Linear equations',
  'Степени': 'Powers',
  // Topics g3
  'Квадратные уравнения': 'Quadratic equations',
  'Квадратные корни': 'Square roots',
  'Системы уравнений': 'Systems of equations',
  'Функции': 'Functions',
  'Теорема Пифагора': 'Pythagorean theorem',
  'Прогрессии': 'Progressions',
  'Вероятность': 'Probability',
  // Topics g4
  'Тригонометрия': 'Trigonometry',
  'Логарифмы': 'Logarithms',
  'Производная': 'Derivative',
  'Интеграл': 'Integral',
  'Комбинаторика': 'Combinatorics',
  // Exercise
  'Далее →': 'Next →',
  'Ещё раз': 'Try again',
  'Другая тема': 'Other topic',
  // Results
  'Отличный результат!': 'Excellent result!',
  'Хорошая работа!': 'Good job!',
  'Нужно потренироваться': 'Need more practice',
  'Не сдавайся!': 'Don\'t give up!',
  '✓ Правильно!': '✓ Correct!',
  'Правильный ответ:': 'Correct answer:',
  // Profile / delete
  'Выйти из аккаунта': 'Sign Out',
  'Удалить аккаунт': 'Delete Account',
  'Удалить аккаунт?': 'Delete Account?',
  'Все данные будут удалены безвозвратно.': 'All data will be permanently deleted.',
  'Введи пароль для подтверждения': 'Enter your password to confirm',
  'Да, удалить': 'Yes, delete',
  'Отмена': 'Cancel',
  'Удаляем...': 'Deleting...',
  'Введи пароль': 'Enter password',
  // Settings
  'Настройки': 'Settings',
  'Уведомления': 'Notifications',
  'Выбор темы': 'Choose Theme',
  'Язык': 'Language',
  'EduPlay v0.1': 'EduPlay v0.1',
  // Theme picker
  'Стандартные': 'Standard',
  'Животные': 'Animals',
  'Мультяшные': 'Cartoons',
  '🚀 Мультяшные темы — скоро!': '🚀 Cartoon themes — coming soon!',
  // Lang picker
  'Язык / Language': 'Language',
  // Validation
  'Заполни все поля': 'Fill in all fields',
  'Пароли не совпадают': 'Passwords do not match',
  'Пароль минимум 6 символов': 'Password must be at least 6 characters',
  'Укажи свой возраст': 'Select your age',
  'Укажи пол': 'Select your gender',
  'Введи email': 'Enter your email',
  // Firebase errors
  'Пользователь не найден': 'User not found',
  'Неверный пароль': 'Incorrect password',
  'Этот email уже используется': 'This email is already in use',
  'Неверный формат email': 'Invalid email format',
  'Пароль слишком простой': 'Password is too weak',
  'Слишком много попыток. Попробуй позже': 'Too many attempts. Try again later',
  'Нет соединения': 'No connection',
  'Неверный email или пароль': 'Incorrect email or password',
  'Что-то пошло не так': 'Something went wrong',
  'Нужно подтвердить личность': 'Identity verification required',
};

// ── API перевода (MyMemory, кеш в localStorage) ──
async function apiTranslate(text) {
  if (!text || text.length < 2) return text;
  const key = `en:${text}`;
  if (apiCache[key]) return apiCache[key];
  try {
    const res = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=ru|en`,
      { signal: AbortSignal.timeout(5000) }
    );
    const data = await res.json();
    if (data.responseStatus === 200) {
      const tr = data.responseData.translatedText;
      apiCache[key] = tr;
      try { localStorage.setItem(CACHE_KEY, JSON.stringify(apiCache)); } catch {}
      return tr;
    }
  } catch {}
  return text;
}

function shouldSkip(text) {
  if (!text || text.trim().length < 2) return true;
  // Чисто цифры, символы математики, эмодзи — не переводим
  if (/^[\d\s\/\-\+\*\=\.\,:;!?★•→←×÷°%≠≤≥⭐]+$/.test(text.trim())) return true;
  return false;
}

// ── Синхронный перевод (словарь + кеш) ──
function tSync(text) {
  if (currentLang === 'ru') return text;
  return QUICK[text] ?? apiCache[`en:${text}`] ?? text;
}

// ── Перевод с переменными: tSyncVar('Подожди {sec} сек.', {sec: 5}) ──
function tSyncVar(text, vars = {}) {
  let str = tSync(text);
  for (const [k, v] of Object.entries(vars)) str = str.replace(`{${k}}`, v);
  return str;
}

// ── Перевод одного текстового узла ──
function translateNode(node) {
  const text = node.textContent;
  const trimmed = text.trim();
  if (shouldSkip(trimmed)) return;

  if (currentLang === 'ru') {
    if (node._orig != null) node.textContent = node._orig;
    return;
  }

  if (node._orig == null) node._orig = text;
  const orig = node._orig.trim();

  const fast = QUICK[orig] ?? apiCache[`en:${orig}`];
  if (fast) { node.textContent = node._orig.replace(orig, fast); return; }

  apiTranslate(orig).then(tr => {
    if (tr !== orig) node.textContent = (node._orig ?? text).replace(orig, tr);
  });
}

function getTextNodes(root) {
  const nodes = [];
  const walk = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(n) {
      const p = n.parentElement;
      if (!p) return NodeFilter.FILTER_REJECT;
      if (p.tagName === 'SCRIPT' || p.tagName === 'STYLE') return NodeFilter.FILTER_REJECT;
      if (p.closest('#screenLoader')) return NodeFilter.FILTER_REJECT;
      if (p.closest('[data-no-translate]')) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    }
  });
  while (walk.nextNode()) nodes.push(walk.currentNode);
  return nodes;
}

// ── Перевод элемента и всего его содержимого ──
function translateEl(root) {
  if (!root) return;
  getTextNodes(root).forEach(translateNode);
  (root.querySelectorAll ? root.querySelectorAll('input[placeholder]') : []).forEach(input => {
    if (currentLang === 'ru') { if (input._origPh != null) input.placeholder = input._origPh; return; }
    if (input._origPh == null) input._origPh = input.placeholder;
    const fast = QUICK[input._origPh] ?? apiCache[`en:${input._origPh}`];
    if (fast) { input.placeholder = fast; return; }
    apiTranslate(input._origPh).then(tr => { input.placeholder = tr; });
  });
}

// ── Применить язык ко всей странице ──
function applyLang(lang) {
  currentLang = lang;
  localStorage.setItem(LANG_KEY, lang);
  document.documentElement.lang = lang;
  translateEl(document.body);
}

window.i18n = {
  get lang()   { return currentLang; },
  tSync,
  tSyncVar,
  el: translateEl,
  apply: applyLang,
};

// Применить при загрузке если выбран EN
if (currentLang !== 'ru') applyLang(currentLang);
