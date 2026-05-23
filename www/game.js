'use strict';

const QUESTIONS_PER_SESSION = 10;

// ══ Группы классов ══
// Темы с полем ввода вместо вариантов
const INPUT_TOPICS = new Set([
  'add10','add100','sub100','add1000','sub1000',
  'multiply2_5','multiply6_9','divide_easy','divide_hard',
  'ordinal','round','perimeter','area','fraction_half','money',
  'word_add','word_mul',
  'big_numbers','equation_simple','speed',
  'fractions','decimals','percent','ratio','negative','linear_eq','powers',
  'quadratic','sqrt','systems_eq','functions','pythagorean','progression','probability',
]);

const gradeGroups = [
  { id: 'g1', label: '1–4 класс',   icon: '🌱', desc: 'Основы счёта' },
  { id: 'g2', label: '5–7 класс',   icon: '📐', desc: 'Дроби и уравнения' },
  { id: 'g3', label: '8–9 класс',   icon: '📊', desc: 'Алгебра и геометрия' },
  { id: 'g4', label: '10–11 класс', icon: '🎓', desc: 'Высшая математика' },
];

const ACTIVE_GRADE_GROUPS = new Set(['g1']);

// ══ Темы по математике ══
const mathTopics = {
  g1: [
    // ── 1 класс ──
    { id: 'count_basics',  name: 'Начало счёта',           icon: '🌟', info: '1 класс' },
    { id: 'add10',         name: 'Сложение до 10',         icon: '➕', info: '1 класс' },
    { id: 'compare',       name: 'Сравнение чисел',        icon: '⚖️', info: '1 класс' },
    { id: 'ordinal',       name: 'Порядок чисел',          icon: '📏', info: '1 класс' },
    // ── 1–2 класс ──
    { id: 'add100',        name: 'Сложение до 100',        icon: '➕', info: '1–2 класс' },
    { id: 'sub100',        name: 'Вычитание до 100',       icon: '➖', info: '1–2 класс' },
    { id: 'word_add',      name: 'Задачи на сложение',     icon: '📝', info: '1–2 класс' },
    // ── 2 класс ──
    { id: 'multiply2_5',   name: 'Таблица × 2, 3, 4, 5',  icon: '✖️', info: '2 класс' },
    { id: 'divide_easy',   name: 'Деление (на 2–5)',       icon: '➗', info: '2 класс' },
    { id: 'even_odd',      name: 'Чётные и нечётные',      icon: '🔁', info: '2 класс' },
    { id: 'money',         name: 'Деньги и цены',          icon: '💰', info: '2 класс' },
    // ── 2–3 класс ──
    { id: 'multiply6_9',   name: 'Таблица × 6, 7, 8, 9',  icon: '✖️', info: '2–3 класс' },
    { id: 'time',          name: 'Время (часы и минуты)',  icon: '🕐', info: '2–3 класс' },
    { id: 'perimeter',     name: 'Периметр',               icon: '📐', info: '2–3 класс' },
    { id: 'word_mul',      name: 'Задачи на умножение',    icon: '📝', info: '2–3 класс' },
    // ── 3 класс ──
    { id: 'add1000',       name: 'Сложение до 1000',       icon: '➕', info: '3 класс' },
    { id: 'sub1000',       name: 'Вычитание до 1000',      icon: '➖', info: '3 класс' },
    { id: 'divide_hard',   name: 'Деление (на 6–9)',       icon: '➗', info: '3 класс' },
    { id: 'round',         name: 'Округление',             icon: '⭕', info: '3 класс' },
    { id: 'area',          name: 'Площадь',                icon: '▭',  info: '3 класс' },
    { id: 'fraction_half', name: 'Доли (½, ¼, ⅓)',        icon: '½',  info: '3 класс' },
    // ── 4 класс ──
    { id: 'big_numbers',    name: 'Большие числа',         icon: '🔭', info: '4 класс' },
    { id: 'div_remainder',  name: 'Деление с остатком',   icon: '➗', info: '4 класс' },
    { id: 'order_ops',      name: 'Порядок действий',      icon: '🔢', info: '4 класс' },
    { id: 'equation_simple',name: 'Уравнения',             icon: '🔣', info: '4 класс' },
    { id: 'speed',          name: 'Скорость и время',      icon: '🚀', info: '4 класс' },
  ],
  g2: [
    { id: 'fractions',  name: 'Обыкновенные дроби',   icon: '½',   info: '5 класс' },
    { id: 'decimals',   name: 'Десятичные дроби',     icon: '0,5', info: '5 класс' },
    { id: 'percent',    name: 'Проценты',              icon: '%',   info: '5–6 класс' },
    { id: 'ratio',      name: 'Пропорции',             icon: '∷',   info: '6 класс' },
    { id: 'negative',   name: 'Отрицательные числа',  icon: '−',   info: '6 класс' },
    { id: 'linear_eq',  name: 'Линейные уравнения',   icon: '=',   info: '6–7 класс' },
    { id: 'powers',     name: 'Степени',               icon: 'xⁿ',  info: '7 класс' },
  ],
  g3: [
    { id: 'quadratic',   name: 'Квадратные уравнения', icon: 'x²',  info: '8 класс' },
    { id: 'sqrt',        name: 'Квадратные корни',     icon: '√',   info: '8 класс' },
    { id: 'systems_eq',  name: 'Системы уравнений',    icon: '{}',  info: '9 класс' },
    { id: 'functions',   name: 'Функции',               icon: 'f(x)', info: '8–9 класс' },
    { id: 'pythagorean', name: 'Теорема Пифагора',     icon: '△',   info: '8 класс' },
    { id: 'progression', name: 'Прогрессии',            icon: '…',   info: '9 класс' },
    { id: 'probability', name: 'Вероятность',           icon: 'P',   info: '9 класс' },
  ],
  g4: [
    { id: 'trig',          name: 'Тригонометрия',  icon: 'sin',    info: '10 класс' },
    { id: 'logarithm',     name: 'Логарифмы',      icon: 'log',    info: '11 класс' },
    { id: 'derivative',    name: 'Производная',    icon: "f'",     info: '11 класс' },
    { id: 'integral',      name: 'Интеграл',       icon: '∫',      info: '11 класс' },
    { id: 'combinatorics', name: 'Комбинаторика',  icon: 'C(n,k)', info: '11 класс' },
  ],
};

// ══ Теория для тем 1–4 класса ══
const theoryData = {
  count_basics: {
    explain: 'Всё вокруг можно посчитать! Яблоки, пальчики, машины... Люди придумали цифры и числа, чтобы записывать, сколько чего есть.\n\nЦИФРА — это знак: 0, 1, 2, 3, 4, 5, 6, 7, 8, 9. Всего 10 цифр — как пальцев на руках!\n\nЧИСЛО — это сколько всего. Число может состоять из нескольких цифр.\n\nНапример: 12 — это ЧИСЛО. В нём две цифры: 1 и 2.',
    rule:    'Цифра — это знак (0–9)\nЧисло — это количество\n5 — и цифра, и число\n12 — число из двух цифр: 1 и 2',
    example: 'Посчитай пальцы на одной руке.\nИх 5. Запиши: 5\nПосчитай на двух руках.\nИх 10. Запиши: 10 (цифры 1 и 0)',
  },
  add10: {
    explain: 'Сложение — это когда берёшь одно количество и добавляешь к нему ещё. Стало больше!\n\nНапример: у тебя 3 конфеты, и тебе дали ещё 4. Считаем вместе: 3... 4, 5, 6, 7. Стало 7!\n\nЗнак сложения — это +\nРезультат сложения называется СУММА.',
    rule:    'Число + Число = Сумма\n3 + 4 = 7\n(было 3, добавили 4, стало 7)',
    example: '5 + 3 = ?\nСчитаем: 5... 6, 7, 8\nОтвет: 8',
  },
  add100: {
    explain: 'Ты уже знаешь цифры. Теперь узнаем про разряды!\n\nЕДИНИЦЫ — это последняя цифра числа (1, 2, 3... до 9).\nДЕСЯТКИ — это сколько десятков. В числе 47: 4 десятка и 7 единиц.\n\nКогда складываем двузначные числа — сначала считаем единицы, потом десятки. Если единиц получилось 10 или больше — одна лишняя десятка «переходит» к десяткам.',
    rule:    'Сначала единицы, потом десятки\n47 + 25:\nединицы: 7+5=12 → пишем 2, переносим 1\nдесятки: 4+2+1=7\nОтвет: 72',
    example: '36 + 48 = ?\nединицы: 6+8=14 → пишем 4, переносим 1\nдесятки: 3+4+1=8\nОтвет: 84',
  },
  sub100: {
    explain: 'Вычитание — это когда из одной группы забираем часть. Если единиц не хватает — «занимаем» десяток (он становится 10 единиц).',
    rule:    'Целое − Часть = Другая часть\n53 − 27: 3 < 7, занимаем!\n13−7=6, 4−2=2. Ответ: 26',
    example: '71 − 34 = ?\nОтвет: 37',
  },
  add1000: {
    explain: 'Всё то же самое, но теперь есть ещё сотни! Складываем справа налево: единицы, десятки, сотни. Переносим лишнее.',
    rule:    'Единицы → Десятки → Сотни\n347 + 285 = 632',
    example: '463 + 259 = ?\nОтвет: 722',
  },
  sub1000: {
    explain: 'Вычитаем тоже справа налево. Если цифра маленькая — занимаем у соседа слева. Это как разменять монету!',
    rule:    'Занимаем 1 десяток = 10 единиц\n1 сотня = 10 десятков\n700 − 358 = 342',
    example: '845 − 367 = ?\nОтвет: 478',
  },
  multiply2_5: {
    explain: 'Умножение — это быстрое сложение одинаковых чисел. 4 × 3 = это четыре три раза: 3+3+3+3 = 12. Выучи таблицу — и задачи станут лёгкими!',
    rule:    '× 2: число удваивается\n× 5: всегда 0 или 5 на конце\n3 × 4 = 12, 5 × 6 = 30',
    example: '4 × 5 = ?\nОтвет: 20\n(5+5+5+5 = 20)',
  },
  multiply6_9: {
    explain: 'Эти числа чуть сложнее, но есть секрет: умножение можно менять местами! 7 × 8 = 8 × 7. Выбирай тот порядок, который легче.',
    rule:    '6×7=42, 6×8=48, 6×9=54\n7×8=56, 7×9=63\n8×9=72 — запомни их!',
    example: '7 × 8 = ?\nОтвет: 56\n(запомни: 56 = 7 × 8)',
  },
  divide_easy: {
    explain: 'Деление — это когда делим поровну. 12 конфет на 3 ребёнка — каждому по 4. Деление и умножение — друзья! Если знаешь таблицу умножения — деление легко.',
    rule:    'a ÷ b = ? → думай: b × ? = a\n15 ÷ 3 = 5 (потому что 3×5=15)',
    example: '20 ÷ 4 = ?\nОтвет: 5\n(4 × 5 = 20)',
  },
  divide_hard: {
    explain: 'Используй таблицу умножения как подсказку. 56 ÷ 7 = ? — вспоминаем: 7 × 8 = 56. Значит ответ 8!',
    rule:    'a ÷ b = ? → вспомни таблицу умножения\n63 ÷ 9 = 7 (потому что 9×7=63)',
    example: '48 ÷ 6 = ?\nОтвет: 8\n(6 × 8 = 48)',
  },
  compare: {
    explain: 'Сравниваем числа слева направо по разрядам. Сначала смотрим на сотни, потом на десятки, потом на единицы. Больше цифр — больше число!',
    rule:    '> больше   < меньше   = равно\n375 > 357 (десятки: 7 > 5)\n100 < 200',
    example: '482 ___ 428 = ?\nОтвет: > (больше)\n(десятки: 8 > 2)',
  },
  ordinal: {
    explain: 'Числа идут по порядку — каждое следующее на 1 больше. Если в ряду есть пропуск — найди соседей и прибавь 1 к предыдущему.',
    rule:    'Каждое число = предыдущее + 1\n10, 11, ?, 13 → пропущено 12',
    example: '23, 24, ?, 26 = ?\nОтвет: 25',
  },
  even_odd: {
    explain: 'ЧЁТНЫЕ числа — те, что можно разделить на 2 поровну, без остатка. Например, 8 конфет: по 4 каждому — честно!\n\nНЕЧЁТНЫЕ числа — когда делишь на 2, всегда остаётся 1 лишняя. Например, 7 конфет: по 3 каждому, и 1 лишняя.\n\nЛёгкий способ узнать: смотри на последнюю цифру!\n0, 2, 4, 6, 8 → чётное\n1, 3, 5, 7, 9 → нечётное',
    rule:    'Чётные делятся на 2 без остатка:\n2, 4, 6, 8, 10, 12...\nНечётные делятся на 2 с остатком 1:\n1, 3, 5, 7, 9, 11...',
    example: '38 — чётное или нет?\nПоследняя цифра — 8 → чётное!\nПроверка: 38 ÷ 2 = 19 (ровно, без остатка)',
  },
  round: {
    explain: 'Округляем до десятков — смотрим на цифру единиц. Если 1,2,3,4 — убираем и пишем 0. Если 5,6,7,8,9 — прибавляем 10 и пишем 0.',
    rule:    '0–4 → вниз (единицы = 0)\n5–9 → вверх (+10, единицы = 0)\n43 → 40,  47 → 50',
    example: '64 ≈ ?\nОтвет: 60 (4 < 5 → вниз)',
  },
  perimeter: {
    explain: 'Периметр — это длина забора вокруг огорода. Обходишь фигуру по краям и складываешь все стороны. У прямоугольника две длины и две ширины.',
    rule:    'P = длина + ширина + длина + ширина\nP = 2 × (длина + ширина)',
    example: 'Прямоугольник 5 × 3 см\nP = 2 × (5+3) = 2 × 8 = 16 см',
  },
  area: {
    explain: 'Площадь — сколько квадратиков 1×1 помещается внутри. Представь клеточки в тетради! Длина × ширина = количество клеток.',
    rule:    'S = длина × ширина\nИзмеряется в см², м²',
    example: 'Прямоугольник 4 × 6 см\nS = 4 × 6 = 24 см²',
  },
  fraction_half: {
    explain: 'Доля — это часть целого.\n\nПредставь пиццу. Если разрезать её на 2 РАВНЫЕ части — каждая часть называется ПОЛОВИНА, или 1/2.\n\nКак читать дробь 1/2:\nНИЖНЕЕ число (знаменатель) — на сколько частей поделили всё\nВЕРХНЕЕ число (числитель) — сколько таких частей берём\n\n1/2 = поделили на 2, берём 1 часть\n1/4 = поделили на 4, берём 1 часть\n1/3 = поделили на 3, берём 1 часть',
    rule:    '1/2 от числа = число ÷ 2\n1/4 от числа = число ÷ 4\n1/3 от числа = число ÷ 3',
    example: '1/4 от 20 = ?\nДелим 20 на 4: 20 ÷ 4 = 5\nОтвет: 5\n(пиццу на 4 части → каждая часть = 5 кусочков)',
  },
  time: {
    explain: 'Большая стрелка — минуты, маленькая — часы. В одном часе 60 минут. Чтобы прибавить время — складываем минуты, и если больше 60 — переходим к следующему часу.',
    rule:    '1 час = 60 минут\n1 минута = 60 секунд\n3:45 + 20 мин = 4:05',
    example: 'Сейчас 2:40. Через 30 минут?\nОтвет: 3:10\n(40 + 30 = 70 мин = 1 ч 10 мин)',
  },
  money: {
    explain: 'Цена × количество = итого. Это умножение в жизни! Если хватает денег — из суммы вычитаем стоимость покупки, остаток — сдача.',
    rule:    'Итого = цена × количество\nСдача = было − потратил',
    example: 'Карандаш 15 руб., купили 4 шт.\n15 × 4 = 60 руб.',
  },
  word_add: {
    explain: 'В задаче ищи слова-подсказки: «стало», «всего», «вместе», «положили ещё» — это сложение! Читай внимательно, рисуй схему если сложно.',
    rule:    'Часть + Часть = Целое\n«Всего», «стало», «вместе» → +',
    example: 'В вазе 7 роз и 5 тюльпанов.\nСколько цветов всего?\n7 + 5 = 12 цветков',
  },
  word_mul: {
    explain: 'Слова «по», «каждый», «в каждом», «одинаковое количество» — знак умножения! Нарисуй группы и посчитай.',
    rule:    'Групп × размер группы = всего\n«По столько-то» → ×',
    example: '4 коробки, в каждой 6 мячей.\nСколько мячей всего?\n4 × 6 = 24 мяча',
  },

  // ── 4 класс ──
  big_numbers: {
    explain: 'Ты уже знаешь числа до тысячи. Теперь идём дальше!\n\n1 000 — тысяча\n10 000 — десять тысяч\n100 000 — сто тысяч\n1 000 000 — миллион!\n\nЧтобы читать большие числа — разбивай их на группы по 3 цифры справа налево:\n345 678 → «триста сорок пять тысяч шестьсот семьдесят восемь»',
    rule:    'Классы чисел (справа налево):\nЕдиницы (1, 10, 100)\nТысячи (1 000, 10 000, 100 000)\nМиллионы (1 000 000...)',
    example: 'Запиши число: двести три тысячи пятьдесят\nОтвет: 203 050',
  },
  div_remainder: {
    explain: 'Иногда при делении не получается поровну — остаётся кусочек. Это и есть остаток!\n\nНапример: 17 конфет на 5 детей.\n5 × 3 = 15 → каждому по 3, осталось 17 − 15 = 2 конфеты.\n\nЗапись: 17 ÷ 5 = 3 (ост. 2)\nОстаток всегда МЕНЬШЕ делителя!',
    rule:    'Делимое ÷ Делитель = Частное (ост. Остаток)\nПроверка: Частное × Делитель + Остаток = Делимое',
    example: '23 ÷ 4 = ?\n4 × 5 = 20, осталось 23 − 20 = 3\nОтвет: 5 (ост. 3)',
  },
  order_ops: {
    explain: 'Когда в примере несколько действий — важно делать их в правильном порядке!\n\n1. Сначала — что в СКОБКАХ\n2. Потом — умножение и деление (слева направо)\n3. Потом — сложение и вычитание (слева направо)\n\nБез скобок умножение «сильнее» сложения!',
    rule:    '( ) → × и ÷ → + и −\n2 + 3 × 4 = 2 + 12 = 14\n(2 + 3) × 4 = 5 × 4 = 20',
    example: '10 − 2 × 3 = ?\nСначала: 2 × 3 = 6\nПотом: 10 − 6 = 4\nОтвет: 4',
  },
  equation_simple: {
    explain: 'Уравнение — это пример с неизвестным числом. Неизвестное обозначают буквой X (или другой буквой).\n\nЧтобы найти X — сделай обратное действие:\n• Если X + 5 = 12 → X = 12 − 5 = 7\n• Если X − 3 = 8 → X = 8 + 3 = 11\n• Если X × 4 = 20 → X = 20 ÷ 4 = 5\n• Если X ÷ 3 = 6 → X = 6 × 3 = 18',
    rule:    'X + a = b → X = b − a\nX − a = b → X = b + a\nX × a = b → X = b ÷ a\nX ÷ a = b → X = b × a',
    example: 'X + 8 = 15\nX = 15 − 8\nОтвет: X = 7',
  },
  speed: {
    explain: 'Скорость — это как быстро ты движешься. Если едешь со скоростью 60 км/ч — за 1 час проедешь 60 км.\n\nТри друга: скорость (V), время (t) и расстояние (S). Они всегда связаны!\n\nЗнаешь двух — найдёшь третьего.',
    rule:    'S = V × t (расстояние = скорость × время)\nV = S ÷ t (скорость = расстояние ÷ время)\nt = S ÷ V (время = расстояние ÷ скорость)',
    example: 'Велосипедист едет 15 км/ч.\nЗа 3 часа проедет:\nS = 15 × 3 = 45 км',
  },
};

// ══ Статические вопросы (для сложных тем) ══
const staticQ = {
  trig: [
    { text: 'sin(0°) = ?',       answers: ['0', '1', '−1', '½'],    correct: '0' },
    { text: 'cos(0°) = ?',       answers: ['0', '1', '−1', '½'],    correct: '1' },
    { text: 'sin(90°) = ?',      answers: ['0', '½', '−1', '1'],    correct: '1' },
    { text: 'cos(180°) = ?',     answers: ['0', '1', '−1', '½'],    correct: '−1' },
    { text: 'sin(30°) = ?',      answers: ['½', '√3/2', '1', '0'],  correct: '½' },
    { text: 'cos(60°) = ?',      answers: ['½', '√3/2', '1', '0'],  correct: '½' },
    { text: 'tg(45°) = ?',       answers: ['0', '½', '1', '√3'],    correct: '1' },
    { text: 'sin²x + cos²x = ?', answers: ['0', '1', '2', 'sin2x'], correct: '1' },
    { text: 'cos(90°) = ?',      answers: ['0', '1', '−1', '½'],    correct: '0' },
    { text: 'sin(60°) = ?',      answers: ['½', '√3/2', '1', '0'],  correct: '√3/2' },
  ],
  logarithm: [
    { text: 'log₂(8) = ?',     answers: ['2', '3', '4', '8'],    correct: '3' },
    { text: 'log₁₀(100) = ?',  answers: ['1', '2', '10', '20'],  correct: '2' },
    { text: 'log₂(1) = ?',     answers: ['0', '1', '2', '−1'],   correct: '0' },
    { text: 'ln(e) = ?',       answers: ['0', '1', 'e', '2'],    correct: '1' },
    { text: 'log₃(9) = ?',     answers: ['1', '2', '3', '9'],    correct: '2' },
    { text: 'log₂(32) = ?',    answers: ['4', '5', '6', '16'],   correct: '5' },
    { text: 'log₁₀(1000) = ?', answers: ['2', '3', '4', '100'],  correct: '3' },
    { text: 'log_a(a) = ?',    answers: ['0', '1', 'a', '2'],    correct: '1' },
    { text: 'log_a(1) = ?',    answers: ['0', '1', 'a', '−1'],   correct: '0' },
    { text: 'log₄(64) = ?',    answers: ['2', '3', '4', '16'],   correct: '3' },
  ],
  derivative: [
    { text: "(x²)' = ?",          answers: ['x', '2x', '2', 'x²'],               correct: '2x' },
    { text: "(x³)' = ?",          answers: ['3x', '3x²', 'x²', '2x²'],           correct: '3x²' },
    { text: "(sin x)' = ?",       answers: ['cos x', '−cos x', '−sin x', 'tg x'], correct: 'cos x' },
    { text: "(cos x)' = ?",       answers: ['sin x', '−sin x', '−cos x', 'tg x'], correct: '−sin x' },
    { text: "(eˣ)' = ?",          answers: ['eˣ', 'xeˣ', 'e^(x−1)', '1/eˣ'],    correct: 'eˣ' },
    { text: "(ln x)' = ?",        answers: ['ln x', '1/x', 'x', 'eˣ'],           correct: '1/x' },
    { text: "(C)' = ? (C=const)", answers: ['C', '1', '0', 'C²'],                correct: '0' },
    { text: "(x)' = ?",           answers: ['x', '1', '0', '2x'],                correct: '1' },
    { text: "(x⁴)' = ?",         answers: ['4x', '4x³', 'x³', '3x⁴'],          correct: '4x³' },
    { text: "(tg x)' = ?",        answers: ['1/cos x', '1/cos²x', 'cos²x', '−1/sin²x'], correct: '1/cos²x' },
  ],
  integral: [
    { text: '∫x dx = ?',     answers: ['x²', 'x²/2 + C', '2x + C', 'x + C'],           correct: 'x²/2 + C' },
    { text: '∫1 dx = ?',     answers: ['0', 'x + C', '1/x + C', 'x² + C'],              correct: 'x + C' },
    { text: '∫x² dx = ?',    answers: ['2x + C', 'x³ + C', 'x³/3 + C', 'x²/2 + C'],    correct: 'x³/3 + C' },
    { text: '∫cos x dx = ?', answers: ['sin x + C', '−sin x + C', 'cos x + C', 'tg x + C'], correct: 'sin x + C' },
    { text: '∫sin x dx = ?', answers: ['cos x + C', '−cos x + C', 'sin x + C', '−sin x + C'], correct: '−cos x + C' },
    { text: '∫eˣ dx = ?',    answers: ['eˣ + C', 'xeˣ + C', 'e^(x+1) + C', '1/eˣ + C'], correct: 'eˣ + C' },
    { text: '∫(1/x) dx = ?', answers: ['−1/x² + C', 'x² + C', 'ln|x| + C', '1/x² + C'], correct: 'ln|x| + C' },
    { text: '∫2x dx = ?',    answers: ['x + C', 'x² + C', '2x² + C', 'x²/2 + C'],       correct: 'x² + C' },
    { text: '∫0 dx = ?',     answers: ['0', '1 + C', 'C', 'x + C'],                      correct: 'C' },
    { text: '∫x³ dx = ?',    answers: ['3x² + C', 'x⁴/4 + C', 'x⁴ + C', '4x³ + C'],    correct: 'x⁴/4 + C' },
  ],
  combinatorics: [
    { text: 'C(4,2) = ?',  answers: ['4', '6', '8', '12'],  correct: '6' },
    { text: 'A(4,2) = ?',  answers: ['6', '8', '12', '4'],  correct: '12' },
    { text: 'C(5,1) = ?',  answers: ['1', '5', '10', '25'], correct: '5' },
    { text: 'C(5,5) = ?',  answers: ['0', '1', '5', '25'],  correct: '1' },
    { text: 'C(6,2) = ?',  answers: ['12', '15', '18', '30'], correct: '15' },
    { text: 'A(5,2) = ?',  answers: ['10', '20', '25', '5'], correct: '20' },
    { text: '3! = ?',      answers: ['3', '5', '6', '9'],   correct: '6' },
    { text: '4! = ?',      answers: ['8', '12', '24', '16'], correct: '24' },
    { text: 'C(n,0) = ?',  answers: ['0', '1', 'n', 'n!'],  correct: '1' },
    { text: 'C(n,1) = ?',  answers: ['0', '1', 'n', 'n!'],  correct: 'n' },
  ],
};

// ══ Утилиты генератора ══
function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

function makeQ(text, correct) {
  const c = Math.round(correct * 100) / 100;
  const wrongs = new Set();
  let tries = 0;
  while (wrongs.size < 3 && tries++ < 150) {
    const scale = Math.max(2, Math.abs(c) * 0.5 + 3);
    const delta = rand(1, Math.ceil(scale)) * (Math.random() > 0.5 ? 1 : -1);
    const w = Math.round((c + delta) * 100) / 100;
    if (String(w) !== String(c)) wrongs.add(w);
  }
  const all = [c, ...[...wrongs].slice(0, 3)].sort(() => Math.random() - 0.5);
  return { text, answers: all.map(String), correct: String(c) };
}

// ══ Генераторы по темам ══
const generators = {
  // 1–4 класс
  count_basics() {
    const type = rand(0, 2);
    if (type === 0) {
      const n = rand(1, 9);
      return { text: `Сколько цифр в числе ${n}?`, answers: ['1','2','3','4'].sort(()=>Math.random()-.5), correct: '1' };
    }
    if (type === 1) {
      const n = rand(10, 99);
      return { text: `Сколько цифр в числе ${n}?`, answers: ['1','2','3','4'].sort(()=>Math.random()-.5), correct: '2' };
    }
    const q = [
      { text: '«5» — это цифра или число?',  answers: ['Цифра','Число','И цифра, и число','Ни то, ни другое'], correct: 'И цифра, и число' },
      { text: '«17» — это цифра или число?', answers: ['Цифра','Число','И цифра, и число','Ни то, ни другое'], correct: 'Число' },
      { text: 'Сколько всего цифр (0–9)?',   answers: ['8','9','10','11'], correct: '10' },
      { text: 'Из каких цифр состоит число 32?', answers: ['3 и 2','2 и 3','1 и 2','3 и 0'], correct: '3 и 2' },
    ];
    return q[rand(0, q.length-1)];
  },
  add10()       { const a=rand(1,9),b=rand(1,10-a); return makeQ(`${a} + ${b} = ?`, a+b); },
  add100()      { const a=rand(1,99),b=rand(1,99); return makeQ(`${a} + ${b} = ?`, a+b); },
  sub100()      { const b=rand(1,98),a=rand(b+1,99); return makeQ(`${a} − ${b} = ?`, a-b); },
  add1000()     { const a=rand(100,899),b=rand(1,999-a); return makeQ(`${a} + ${b} = ?`, a+b); },
  sub1000()     { const b=rand(1,898),a=rand(b+1,999); return makeQ(`${a} − ${b} = ?`, a-b); },
  multiply2_5() { const t=[2,3,4,5],a=t[rand(0,3)],b=rand(1,10); return makeQ(`${a} × ${b} = ?`, a*b); },
  multiply6_9() { const t=[6,7,8,9],a=t[rand(0,3)],b=rand(1,10); return makeQ(`${a} × ${b} = ?`, a*b); },
  divide_easy() { const d=[2,3,4,5],b=d[rand(0,3)],ans=rand(1,10); return makeQ(`${b*ans} ÷ ${b} = ?`, ans); },
  divide_hard() { const d=[6,7,8,9],b=d[rand(0,3)],ans=rand(1,10); return makeQ(`${b*ans} ÷ ${b} = ?`, ans); },
  compare() {
    const a=rand(1,1000),b=rand(1,1000),c=a>b?'>':a<b?'<':'=';
    return { text:`${a}  ___  ${b}`, answers:['>', '<', '=', '≠'].sort(()=>Math.random()-.5), correct:c };
  },
  ordinal() {
    const start=rand(1,50),n=rand(3,6);
    const seq=Array.from({length:n},(_,i)=>start+i);
    const missing=rand(0,n-1);
    const display=seq.map((v,i)=>i===missing?'?':v).join(', ');
    return makeQ(`Какое число пропущено?\n${display}`, seq[missing]);
  },
  even_odd() {
    const n=rand(1,100);
    const correct=n%2===0?'Чётное':'Нечётное';
    return { text:`${n} — это...`, answers:['Чётное','Нечётное','Простое','Составное'].sort(()=>Math.random()-.5), correct };
  },
  round() {
    const n=rand(11,99);
    const correct=Math.round(n/10)*10;
    return makeQ(`Округли ${n} до десятков`, correct);
  },
  perimeter() {
    const w=rand(2,20),h=rand(2,20);
    return makeQ(`Прямоугольник ${w}×${h} см\nПериметр = ?`, 2*(w+h));
  },
  area() {
    const w=rand(2,15),h=rand(2,15);
    return makeQ(`Прямоугольник ${w}×${h} см\nПлощадь = ?`, w*h);
  },
  fraction_half() {
    const parts=[2,3,4];
    const p=parts[rand(0,2)];
    const whole=rand(2,12)*p;
    const ans=whole/p;
    const label=p===2?'½':p===3?'⅓':'¼';
    return makeQ(`${label} от ${whole} = ?`, ans);
  },
  time() {
    const h=rand(1,12),m=[0,5,10,15,20,30,45][rand(0,6)];
    const total=h*60+m;
    const add=[5,10,15,20,30][rand(0,4)];
    const res=((total+add)%(12*60));
    const rh=Math.floor(res/60)||12,rm=res%60;
    return { text:`Сейчас ${h}:${String(m).padStart(2,'0')}\nЧерез ${add} минут будет:`, answers:[`${rh}:${String(rm).padStart(2,'0')}`, `${rh}:${String((rm+10)%60).padStart(2,'0')}`, `${(rh%12)+1}:${String(rm).padStart(2,'0')}`, `${h}:${String((m+add+5)%60).padStart(2,'0')}`].sort(()=>Math.random()-.5), correct:`${rh}:${String(rm).padStart(2,'0')}` };
  },
  money() {
    const price=rand(5,50)*10,qty=rand(2,5),total=price*qty;
    return makeQ(`Цена товара — ${price} руб.\nКупили ${qty} штуки.\nИтого: ?`, total);
  },
  word_add() {
    const a=rand(5,50),b=rand(5,50);
    const stories=[
      `В корзине ${a} яблок.\nПоложили ещё ${b}.\nСколько стало?`,
      `Саша прочитал ${a} страниц,\nМаша — ${b} страниц.\nВсего страниц:`,
      `В классе ${a} мальчиков\nи ${b} девочек.\nВсего учеников:`,
    ];
    return makeQ(stories[rand(0,2)], a+b);
  },
  word_mul() {
    const a=rand(2,9),b=rand(2,9);
    const stories=[
      `В коробке ${a} рядов,\nв каждом по ${b} конфет.\nВсего конфет:`,
      `${a} команды, в каждой ${b} игроков.\nВсего игроков:`,
      `Книга стоит ${a*10} руб.\nКупили ${b} книг.\nИтого:`,
    ];
    const idx=rand(0,stories.length-1);
    const answer=idx===2?a*10*b:a*b;
    return makeQ(stories[idx], answer);
  },

  // ── 4 класс ──
  big_numbers() {
    const type = rand(0, 2);
    if (type === 0) {
      const a = rand(1000, 999999), b = rand(1000, 999999);
      const c = a > b ? '>' : a < b ? '<' : '=';
      return { text: `${a.toLocaleString('ru')}  ___  ${b.toLocaleString('ru')}`, answers: ['>', '<', '=', '≠'].sort(() => Math.random() - .5), correct: c };
    }
    if (type === 1) {
      const v = rand(10, 999) * 1000 + rand(0, 999);
      return makeQ(`Запиши число: ${v.toLocaleString('ru')}\nСколько тысяч?`, Math.floor(v / 1000));
    }
    const n = rand(100000, 999999);
    return makeQ(`Округли ${n.toLocaleString('ru')} до тысяч`, Math.round(n / 1000) * 1000);
  },
  div_remainder() {
    const b = rand(2, 9), q = rand(1, 10), r = rand(1, b - 1);
    const a = b * q + r;
    return makeQ(`${a} ÷ ${b} = ?\n(введи остаток)`, r);
  },
  order_ops() {
    const type = rand(0, 2);
    if (type === 0) {
      const a=rand(2,9),b=rand(2,9),c=rand(2,9);
      return makeQ(`${a} + ${b} × ${c} = ?`, a + b * c);
    }
    if (type === 1) {
      const a=rand(2,9),b=rand(2,9),c=rand(2,9);
      return makeQ(`(${a} + ${b}) × ${c} = ?`, (a + b) * c);
    }
    const a=rand(10,30),b=rand(2,5),c=rand(1,5);
    return makeQ(`${a} − ${b} × ${c} = ?`, a - b * c);
  },
  equation_simple() {
    const x = rand(1, 20);
    const type = rand(0, 3);
    if (type === 0) { const a = rand(1, 30); return makeQ(`x + ${a} = ${x + a}\nНайди x`, x); }
    if (type === 1) { const a = rand(1, 30); return makeQ(`x − ${a} = ${x}\nНайди x`, x + a); }
    if (type === 2) { const a = rand(2, 10); return makeQ(`x × ${a} = ${x * a}\nНайди x`, x); }
    const a = rand(2, 10); return makeQ(`x ÷ ${a} = ${x}\nНайди x`, x * a);
  },
  speed() {
    const type = rand(0, 2);
    if (type === 0) {
      const v = rand(2, 15) * 5, t = rand(2, 6);
      return makeQ(`Скорость ${v} км/ч, время ${t} ч.\nРасстояние = ?`, v * t);
    }
    if (type === 1) {
      const s = rand(2, 10) * 30, t = rand(2, 5);
      return makeQ(`Расстояние ${s} км, время ${t} ч.\nСкорость = ?`, s / t);
    }
    const v = rand(2, 15) * 10, s = rand(2, 8) * v;
    return makeQ(`Скорость ${v} км/ч, расстояние ${s} км.\nВремя = ?`, s / v);
  },

  // 5–7 класс
  fractions()  { const d=rand(2,9),a=rand(1,d-1),b=rand(1,d-1),op=Math.random()>.5; if(!op&&a<=b)return generators.fractions(); const n=op?a+b:a-b; return makeQ(`${a}/${d} ${op?'+':'−'} ${b}/${d} = ?`, Math.round(n/d*100)/100); },
  decimals()   { const a=rand(1,99)/10,b=rand(1,99)/10,op=Math.random()>.5; if(!op&&a<b)return generators.decimals(); return makeQ(`${a} ${op?'+':'−'} ${b} = ?`, Math.round((op?a+b:a-b)*100)/100); },
  percent()    { const w=rand(1,20)*10,p=[10,20,25,50,75][rand(0,4)]; return makeQ(`${p}% от ${w} = ?`, w*p/100); },
  ratio()      { const a=rand(2,10),b=rand(2,10),c=rand(1,5),ans=b*c/a; if(!Number.isInteger(ans))return generators.ratio(); return makeQ(`${a} / ${b} = ${c} / ?\nНайди ?`, ans); },
  negative()   { const a=rand(-20,20),b=rand(-20,20),op=Math.random()>.5; return makeQ(`(${a}) ${op?'+':'−'} (${b}) = ?`, op?a+b:a-b); },
  linear_eq()  { const x=rand(1,20),a=rand(2,10),b=rand(1,30); return makeQ(`${a}x + ${b} = ${a*x+b}\nНайди x`, x); },
  powers()     { const base=rand(2,9),exp=rand(2,4); return makeQ(`${base}^${exp} = ?`, Math.pow(base,exp)); },

  // 8–9 класс
  quadratic()  { const r1=rand(-7,7),r2=rand(-7,7),b=-(r1+r2),c=r1*r2; const bs=b>=0?`+${b}`:`${b}`,cs=c>=0?`+${c}`:`${c}`; return makeQ(`x² ${bs}x ${cs} = 0\nОдин из корней:`, Math.random()>.5?r1:r2); },
  sqrt()       { const n=rand(2,15); return makeQ(`√${n*n} = ?`, n); },
  systems_eq() { const x=rand(1,10),y=rand(1,10); return makeQ(`x + y = ${x+y}\nx − y = ${x-y}\nНайди x`, x); },
  functions()  { const a=rand(1,10),b=rand(-10,10),x=rand(1,10); return makeQ(`f(x) = ${a}x ${b>=0?'+ '+b:'− '+Math.abs(b)}\nf(${x}) = ?`, a*x+b); },
  pythagorean(){ const triples=[[3,4,5],[5,12,13],[6,8,10],[8,15,17],[9,12,15]],[a,b,c]=triples[rand(0,4)]; return makeQ(`Катеты: ${a} и ${b}\nГипотенуза = ?`, c); },
  progression(){ const a1=rand(1,20),d=rand(1,10),n=rand(5,10); return makeQ(`a₁=${a1}, d=${d}\nНайди a${n}`, a1+(n-1)*d); },
  probability(){ const pairs=[[1,2],[1,3],[2,3],[1,4],[3,4],[1,5],[2,5]],[f,t]=pairs[rand(0,pairs.length-1)],k=rand(2,4); return makeQ(`В пакете ${t*k} шаров,\n${f*k} красных.\nP = ?`, Math.round(f/t*100)/100); },
};

function generateQuestion(topicId) {
  if (staticQ[topicId]) {
    const qs = staticQ[topicId];
    return { ...qs[rand(0, qs.length - 1)] };
  }
  const gen = generators[topicId] || generators.add100;
  try { return gen(); } catch(e) { return generators.add100(); }
}

function generateSession(topicId) {
  if (staticQ[topicId]) {
    return [...staticQ[topicId]].sort(() => Math.random() - 0.5).slice(0, QUESTIONS_PER_SESSION);
  }
  return Array.from({ length: QUESTIONS_PER_SESSION }, () => generateQuestion(topicId));
}

// ══ Состояние ══
let currentSubject = null;
let currentGroupId = null;
let currentTopic   = null;
let session = { questions: [], index: 0, score: 0, answered: false };

// ══ Навигация ══
document.querySelectorAll('.subject-card:not(.soon)').forEach(card => {
  card.addEventListener('click', () => {
    currentSubject = card.dataset.subject;
    const subjectEl = document.getElementById('gradeScreenSubject');
    subjectEl.textContent = currentSubject === 'math' ? 'Математика' : 'Физика';
    window.i18n?.el(subjectEl);
    buildGradeGroupScreen();
    showScreen('screenGradeGroup');
  });
});

document.getElementById('btnBackGrade').addEventListener('click', () => showScreen('screenHome'));
document.getElementById('btnBackTopics').addEventListener('click', () => showScreen('screenGradeGroup'));
document.getElementById('btnBackExercise').addEventListener('click', () => showScreen('screenTopics'));
document.getElementById('btnNextQuestion').addEventListener('click', nextQuestion);
document.getElementById('btnRetry').addEventListener('click', startSession);
document.getElementById('btnOtherTopic').addEventListener('click', () => showScreen('screenTopics'));

document.getElementById('btnCheckAnswer').addEventListener('click', () => {
  const q = session.questions[session.index];
  handleInputAnswer(q);
});
document.getElementById('exerciseInput').addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    const q = session.questions[session.index];
    handleInputAnswer(q);
  }
});

// ══ Экран выбора класса ══
function buildGradeGroupScreen() {
  const grid = document.getElementById('gradeGroupGrid');
  grid.innerHTML = '';
  gradeGroups.forEach(g => {
    const soon = !ACTIVE_GRADE_GROUPS.has(g.id);
    const card = document.createElement('div');
    card.className = 'grade-card' + (soon ? ' soon' : '');
    card.innerHTML = `
      <span class="grade-icon">${g.icon}</span>
      <span class="grade-label">${g.label}</span>
      <span class="grade-desc">${g.desc}</span>
      ${soon ? '<span class="grade-soon">Скоро</span>' : ''}
    `;
    if (!soon) {
      card.addEventListener('click', () => {
        currentGroupId = g.id;
        buildTopicsScreen();
        showScreen('screenTopics');
      });
    }
    grid.appendChild(card);
  });
  window.i18n?.el(grid);
}

// ══ Экран выбора темы ══
function buildTopicsScreen() {
  const topics = mathTopics[currentGroupId] || [];
  const group  = gradeGroups.find(g => g.id === currentGroupId);
  document.getElementById('topicsTitle').textContent = group?.label || '';

  const list = document.getElementById('topicsList');
  list.innerHTML = '';
  topics.forEach(t => {
    const item = document.createElement('div');
    item.className = 'topic-item';
    item.innerHTML = `
      <div class="topic-icon-wrap">${t.icon}</div>
      <span class="topic-name">${t.name}</span>
      <span class="topic-count">${t.info || ''}</span>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
    `;
    item.addEventListener('click', () => { currentTopic = t; showTheory(t); });
    list.appendChild(item);
  });
  window.i18n?.el(list);
  window.i18n?.el(document.getElementById('topicsTitle'));
}

// ══ Теория ══
function showTheory(topic) {
  const data = theoryData[topic.id];
  document.getElementById('theoryTitle').textContent   = topic.name;
  document.getElementById('theoryIcon').textContent    = topic.icon;

  if (data) {
    document.getElementById('theoryExplain').textContent  = data.explain;
    document.getElementById('theoryRule').textContent     = data.rule;
    document.getElementById('theoryExample').textContent  = data.example;
    document.querySelector('.theory-rule-box').style.display    = '';
    document.querySelector('.theory-example-box').style.display = '';
  } else {
    document.getElementById('theoryExplain').textContent = '';
    document.querySelector('.theory-rule-box').style.display    = 'none';
    document.querySelector('.theory-example-box').style.display = 'none';
  }

  showScreen('screenTheory');
  window.i18n?.el(document.getElementById('screenTheory'));
}

document.getElementById('btnBackTheory').addEventListener('click', () => showScreen('screenTopics'));
document.getElementById('btnStartFromTheory').addEventListener('click', startSession);

// ══ Сессия ══
function startSession() {
  session.questions = generateSession(currentTopic.id);
  session.index     = 0;
  session.score     = 0;
  session.answered  = false;

  const topicLabelEl = document.getElementById('exerciseTopicLabel');
  topicLabelEl.textContent = currentTopic.name;
  window.i18n?.el(topicLabelEl);
  document.getElementById('exerciseQuestionMode').style.display = 'flex';
  document.getElementById('exerciseResultMode').style.display   = 'none';
  showScreen('screenExercise');
  renderQuestion();
}

function renderQuestion() {
  const q       = session.questions[session.index];
  const useInput = INPUT_TOPICS.has(currentTopic.id);

  document.getElementById('exerciseQuestion').textContent     = q.text;
  document.getElementById('exerciseCount').textContent        = `${session.index + 1} / ${QUESTIONS_PER_SESSION}`;
  document.getElementById('exerciseScore').textContent        = `★ ${session.score}`;
  document.getElementById('exerciseProgressFill').style.width = `${(session.index / QUESTIONS_PER_SESSION) * 100}%`;
  document.getElementById('exerciseHint').innerHTML           = '';
  document.getElementById('btnNextQuestion').style.display    = 'none';
  session.answered = false;

  const opts      = document.getElementById('exerciseOptions');
  const inputWrap = document.getElementById('exerciseInputWrap');
  const input     = document.getElementById('exerciseInput');

  if (useInput) {
    opts.style.display      = 'none';
    inputWrap.style.display = 'flex';
    input.value             = '';
    input.disabled          = false;
    input.className         = 'exercise-input';
    document.getElementById('btnCheckAnswer').disabled = false;
    setTimeout(() => input.focus(), 50);
  } else {
    opts.style.display      = '';
    inputWrap.style.display = 'none';
    opts.innerHTML = '';
    q.answers.forEach(ans => {
      const btn = document.createElement('button');
      btn.className   = 'option-btn';
      btn.textContent = ans;
      btn.addEventListener('click', () => handleAnswer(ans, btn, q));
      opts.appendChild(btn);
    });
  }
  window.i18n?.el(document.getElementById('exerciseQuestionMode'));
}

function handleAnswer(ans, btn, q) {
  if (session.answered) return;
  session.answered = true;
  const correct = String(ans).trim() === String(q.correct).trim();
  const hint    = document.getElementById('exerciseHint');

  if (correct) {
    session.score++;
    if (btn) btn.classList.add('correct');
    hint.innerHTML = '<span style="color:#4ade80">✓ Правильно!</span>';
  } else {
    if (btn) btn.classList.add('wrong');
    hint.innerHTML = `<span style="color:#f87171">✗ Правильный ответ: <b>${q.correct}</b></span>`;
    document.querySelectorAll('.option-btn').forEach(b => {
      if (b.textContent === q.correct) b.classList.add('correct');
    });
  }

  document.getElementById('exerciseScore').textContent     = `★ ${session.score}`;
  document.getElementById('btnNextQuestion').style.display = 'block';
  document.querySelectorAll('.option-btn').forEach(b => b.disabled = true);

  // Блокируем инпут после ответа
  const input = document.getElementById('exerciseInput');
  input.disabled = true;
  input.classList.add(correct ? 'input-correct' : 'input-wrong');
  document.getElementById('btnCheckAnswer').disabled = true;

  window.i18n?.el(hint);
}

function handleInputAnswer(q) {
  const input = document.getElementById('exerciseInput');
  const ans   = input.value.trim();
  if (!ans) return;
  handleAnswer(ans, null, q);
}

function nextQuestion() {
  if (++session.index >= QUESTIONS_PER_SESSION) return showResult();
  renderQuestion();
}

function showResult() {
  document.getElementById('exerciseQuestionMode').style.display = 'none';
  document.getElementById('exerciseProgressFill').style.width   = '100%';
  const pct   = Math.round(session.score / QUESTIONS_PER_SESSION * 100);
  const emoji = pct >= 80 ? '🏆' : pct >= 60 ? '👍' : pct >= 40 ? '📚' : '💪';
  const msg   = pct >= 80 ? 'Отличный результат!' : pct >= 60 ? 'Хорошая работа!' : pct >= 40 ? 'Нужно потренироваться' : 'Не сдавайся!';
  document.getElementById('resultEmoji').textContent    = emoji;
  document.getElementById('resultTitle').textContent    = msg;
  document.getElementById('resultScoreBig').textContent = `${session.score} / ${QUESTIONS_PER_SESSION}`;
  document.getElementById('resultPct').textContent      = `${pct}%`;
  document.getElementById('exerciseResultMode').style.display = 'flex';
  window.i18n?.el(document.getElementById('exerciseResultMode'));

  window.saveSession?.({
    topicId:    currentTopic.id,
    topicName:  currentTopic.name,
    subject:    currentSubject,
    gradeGroup: currentGroupId,
    score:      session.score,
    total:      QUESTIONS_PER_SESSION,
    pct,
  });
}
