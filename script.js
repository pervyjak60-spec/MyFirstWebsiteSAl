'use strict';

/* =====================================================================
   НАСТРОЙКИ
   ===================================================================== */
// Курс доллара к сому — меняйте здесь, цены везде пересчитаются.
const USD_TO_KGS = 87.5;

const STORAGE_KEY = 'automarket_kg_user_cars_v1';
const CURRENCY_KEY = 'automarket_kg_currency';
const MAX_PHOTOS = 5;

/* =====================================================================
   ДАННЫЕ: 10 автомобилей (демо-объявления)
   Фото кладите в папку img/ с именами  <id>-1.jpg … <id>-5.jpg
   Например: img/camry-1.jpg, img/camry-2.jpg … img/camry-5.jpg
   Если файла нет, показывается заглушка.
   ===================================================================== */
const photosOf = (id) => [1, 2, 3, 4, 5].map((i) => `img/${id}-${i}.jpg`);

const baseCars = [
  {
    id: 'camry', brand: 'Toyota', model: 'Camry XV70', year: 2019, price: 24500, mileage: 78000,
    engine: '2.5 л, 181 л.с.', fuel: 'Бензин', trans: 'Автомат', drive: 'Передний', body: 'Седан',
    color: 'Белый', city: 'Бишкек', seller: 'Азамат', phone: '+996 555 100 201',
    description: 'Один хозяин, обслуживание строго по регламенту. Комплектация Prestige: кожаный салон, камера заднего вида, адаптивный круиз-контроль, подогрев всех сидений. Кузов без вмешательств, толщиномер по запросу.',
    pros: ['Надёжный мотор и коробка', 'Богатая комплектация', 'Высокая ликвидность на рынке'],
    cons: ['Жёсткая подвеска на 18" дисках', 'Дорогое обслуживание у дилера', 'Слабая шумоизоляция арок']
  },
  {
    id: 'fit', brand: 'Honda', model: 'Fit GK', year: 2015, price: 8900, mileage: 98000,
    engine: '1.3 л, 100 л.с.', fuel: 'Бензин', trans: 'Вариатор', drive: 'Передний', body: 'Хэтчбек',
    color: 'Серебристый', city: 'Бишкек', seller: 'Нурлан', phone: '+996 700 220 330',
    description: 'Экономичный городской хэтчбек из Японии. Просторный салон с трансформируемыми сиденьями, низкий расход. Масло в вариаторе менялось недавно, второй комплект резины в подарок.',
    pros: ['Расход около 6 л на 100 км', 'Очень вместительный салон', 'Простое и недорогое обслуживание'],
    cons: ['Шумный мотор при разгоне', 'Вариатор требует замены масла по графику', 'Небольшой клиренс']
  },
  {
    id: 'e350', brand: 'Mercedes-Benz', model: 'E 350 (W212)', year: 2013, price: 17800, mileage: 128000,
    engine: '3.5 л V6, 306 л.с.', fuel: 'Бензин', trans: 'Автомат', drive: 'Задний', body: 'Седан',
    color: 'Чёрный', city: 'Ош', seller: 'Эрмек', phone: '+996 770 440 550',
    description: 'Мощный бизнес-седан в хорошем состоянии. Полный пакет опций: люк, навигация, память сидений, Harman/Kardon. Сервисная история, свежая замена масла и фильтров.',
    pros: ['Динамика и комфорт на трассе', 'Богатое оснащение', 'Статусный внешний вид'],
    cons: ['Расход 11–13 л в городе', 'Дорогие запчасти и сервис', 'Мотор требует внимательного обслуживания цепей']
  },
  {
    id: 'rx350', brand: 'Lexus', model: 'RX 350 (AL10)', year: 2012, price: 19500, mileage: 145000,
    engine: '3.5 л V6, 277 л.с.', fuel: 'Бензин', trans: 'Автомат', drive: 'Полный', body: 'Кроссовер',
    color: 'Жемчужно-белый', city: 'Бишкек', seller: 'Руслан', phone: '+996 555 660 770',
    description: 'Комфортный премиальный кроссовер с отличной шумоизоляцией. Кожа в хорошем состоянии, пневмо не стоит — классическая подвеска. Куплен у первого владельца, не такси.',
    pros: ['Тихий и плавный ход', 'Надёжный V6', 'Хорошая ликвидность'],
    cons: ['Расход 12–14 л в городе', 'Мягкая подвеска не для любителей спорта', 'Салон начинает «потеть» пластиком на жаре']
  },
  {
    id: 'prado', brand: 'Toyota', model: 'Land Cruiser Prado 150', year: 2016, price: 38000, mileage: 112000,
    engine: '2.7 л, 163 л.с.', fuel: 'Бензин', trans: 'Автомат', drive: 'Полный', body: 'Внедорожник',
    color: 'Серый металлик', city: 'Чолпон-Ата', seller: 'Бакыт', phone: '+996 709 880 990',
    description: 'Рамный внедорожник для города и гор. Постоянный полный привод, блокировка, 7 мест. Состояние отличное, без аварий, отполирован. Идеален для семьи и поездок на Иссык-Куль.',
    pros: ['Отличная проходимость', '7 мест и большой багажник', 'Почти не теряет в цене'],
    cons: ['Высокая цена', 'Габариты затрудняют парковку', 'Расход около 13 л в городе']
  },
  {
    id: 'sonata', brand: 'Hyundai', model: 'Sonata LF', year: 2016, price: 12400, mileage: 120000,
    engine: '2.0 л LPi, 151 л.с.', fuel: 'Газ/бензин', trans: 'Автомат', drive: 'Передний', body: 'Седан',
    color: 'Белый', city: 'Бишкек', seller: 'Айбек', phone: '+996 551 121 232',
    description: 'Корейская Sonata на заводском газе: экономия на каждом километре. Салон просторный, мультимедиа, камера, электро-привод сидений. Содержалась в гараже, пробег родной.',
    pros: ['Дешёвое топливо — газ', 'Просторный салон для своего класса', 'Хорошая оснащённость'],
    cons: ['Подвеска сзади жёстковата', 'Газовое оборудование требует регулярного ТО', 'Шум на скорости выше 110 км/ч']
  },
  {
    id: 'forester', brand: 'Subaru', model: 'Forester SJ', year: 2014, price: 11900, mileage: 135000,
    engine: '2.0 л, 150 л.с.', fuel: 'Бензин', trans: 'Вариатор', drive: 'Полный', body: 'Кроссовер',
    color: 'Тёмно-зелёный', city: 'Бишкек', seller: 'Тимур', phone: '+996 700 343 454',
    description: 'Симметричный полный привод и высокий клиренс 220 мм — отлично для зимы и дач. Оригинальный пробег, тормоза и ремни заменены. Есть фаркоп и зимняя резина.',
    pros: ['Клиренс 220 мм', 'Надёжный полный привод', 'Хорошая управляемость'],
    cons: ['Возможен расход масла двигателем', 'Вариатор не любит жёсткую езду', 'Шумноватый салон']
  },
  {
    id: 'f10', brand: 'BMW', model: '528i (F10)', year: 2013, price: 15600, mileage: 142000,
    engine: '2.0 л turbo, 245 л.с.', fuel: 'Бензин', trans: 'Автомат', drive: 'Задний', body: 'Седан',
    color: 'Синий', city: 'Бишкек', seller: 'Данияр', phone: '+996 555 565 676',
    description: 'Драйверский седан с отличной управляемостью. M-пакет, проекция на лобовое, электропривод сидений. Цепь ГРМ заменена, вся документация по обслуживанию есть.',
    pros: ['Лучшая управляемость в классе', 'Яркий дизайн и оснащение', 'Приличная динамика'],
    cons: ['Цепь ГРМ требует внимания', 'Возможны течи масла', 'Дорогие запчасти и обслуживание']
  },
  {
    id: 'prius', brand: 'Toyota', model: 'Prius 30', year: 2012, price: 9700, mileage: 160000,
    engine: '1.8 л гибрид, 136 л.с.', fuel: 'Гибрид', trans: 'Вариатор', drive: 'Передний', body: 'Хэтчбек',
    color: 'Серебристый', city: 'Ош', seller: 'Мирлан', phone: '+996 770 787 898',
    description: 'Самый экономичный вариант в каталоге: расход около 4–5 л. Гибридная батарея проверена диагностикой, состояние хорошее. Подходит для работы в такси и ежедневных поездок.',
    pros: ['Расход 4–5 л на 100 км', 'Надёжная гибридная схема', 'Дешёвые расходники'],
    cons: ['Ресурс гибридной батареи ограничен', 'Жёсткая подвеска', 'Небольшой клиренс']
  },
  {
    id: 'crv', brand: 'Honda', model: 'CR-V', year: 2016, price: 18700, mileage: 98000,
    engine: '2.4 л, 186 л.с.', fuel: 'Бензин', trans: 'Автомат', drive: 'Полный', body: 'Кроссовер',
    color: 'Красный', city: 'Бишкек', seller: 'Эльдар', phone: '+996 700 909 010',
    description: 'Семейный кроссовер с просторным салоном и большим багажником. Полный привод, камера, круиз-контроль, мультимедиа. Один владелец, сервис по книжке, без окрасов.',
    pros: ['Большой багажник и салон', 'Надёжный атмосферный мотор', 'Умеренный расход для кроссовера'],
    cons: ['Заметный шум на неровностях', 'Расход 10–11 л в городе', 'Базовая шумоизоляция']
  }
];

/* =====================================================================
   УТИЛИТЫ
   ===================================================================== */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => (
  { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
));

const nf = new Intl.NumberFormat('ru-RU');
const fmtNum = (n) => nf.format(Math.round(n));
const toKgs = (usd) => Math.round((usd * USD_TO_KGS) / 100) * 100;
const fmtUSD = (usd) => '$' + fmtNum(usd);
const fmtKGS = (usd) => fmtNum(toKgs(usd)) + ' сом';

const lsGet = (key, fallback) => {
  try {
    const v = localStorage.getItem(key);
    return v === null ? fallback : v;
  } catch (e) { return fallback; }
};
const lsSet = (key, value) => {
  try { localStorage.setItem(key, value); return true; } catch (e) { return false; }
};

function placeholder(text) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="600" viewBox="0 0 900 600">
    <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0b6b47"/><stop offset="1" stop-color="#108a5b"/></linearGradient></defs>
    <rect width="900" height="600" fill="url(#g)"/>
    <g fill="none" stroke="#ffc933" stroke-width="10" stroke-linecap="round" stroke-linejoin="round">
      <path d="M250 360h400l-40-90c-8-18-24-28-44-28H334c-20 0-36 10-44 28z"/>
      <path d="M220 360h460v50H220z"/>
    </g>
    <circle cx="310" cy="420" r="34" fill="#ff3d6e"/><circle cx="590" cy="420" r="34" fill="#ff3d6e"/>
    <text x="450" y="500" text-anchor="middle" font-family="Arial, sans-serif" font-size="32" font-weight="700" fill="#ffffff">${esc(text)}</text>
  </svg>`;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

// Если фото не загрузилось — подставляем заглушку.
function attachFallback(img, label) {
  img.addEventListener('error', function handler() {
    img.removeEventListener('error', handler);
    img.src = placeholder(label);
  });
}

const carName = (c) => `${c.brand} ${c.model}`;
const photoList = (c) => (c.photos && c.photos.length ? c.photos : [placeholder(carName(c))]);

let toastTimer;
function toast(msg) {
  const el = $('#toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 3200);
}

/* =====================================================================
   СОСТОЯНИЕ
   ===================================================================== */
let userCars = [];
try {
  const raw = lsGet(STORAGE_KEY, '[]');
  const parsed = JSON.parse(raw);
  if (Array.isArray(parsed)) userCars = parsed;
} catch (e) { userCars = []; }

const allCars = () => [...userCars, ...baseCars.map((c) => ({ ...c, photos: photosOf(c.id) }))];

let currency = lsGet(CURRENCY_KEY, 'USD') === 'KGS' ? 'KGS' : 'USD';
let currentList = [];

function saveUserCars() {
  const ok = lsSet(STORAGE_KEY, JSON.stringify(userCars));
  if (!ok) toast('Не удалось сохранить в браузере (мало места). Объявление видно до перезагрузки.');
}

/* =====================================================================
   ЦЕНА
   ===================================================================== */
function priceHTML(c) {
  const usd = fmtUSD(c.price);
  const kgs = fmtKGS(c.price);
  return currency === 'USD'
    ? `<div class="price"><strong>${usd}</strong><span>${kgs}</span></div>`
    : `<div class="price"><strong>${kgs}</strong><span>${usd}</span></div>`;
}

/* =====================================================================
   ФИЛЬТРЫ И РЕНДЕР КАТАЛОГА
   ===================================================================== */
const els = {
  q: $('#fQ'), brand: $('#fBrand'), body: $('#fBody'), fuel: $('#fFuel'), trans: $('#fTrans'),
  pMin: $('#fPMin'), pMax: $('#fPMax'), yMin: $('#fYMin'), yMax: $('#fYMax'), km: $('#fKm'), sort: $('#fSort'),
  grid: $('#carGrid'), empty: $('#emptyState'), count: $('#resultCount')
};

function fillBrands() {
  const current = els.brand.value;
  const brands = [...new Set(allCars().map((c) => c.brand))].sort((a, b) => a.localeCompare(b));
  els.brand.innerHTML = '<option value="">Все марки</option>' +
    brands.map((b) => `<option>${esc(b)}</option>`).join('');
  if (brands.includes(current)) els.brand.value = current;
}

const num = (el) => (el.value === '' ? null : Number(el.value));

function applyFilters() {
  const q = els.q.value.trim().toLowerCase();
  const pMin = num(els.pMin), pMax = num(els.pMax);
  const yMin = num(els.yMin), yMax = num(els.yMax), km = num(els.km);

  let list = allCars().filter((c) => {
    if (q) {
      const hay = `${c.brand} ${c.model} ${c.city} ${c.body} ${c.fuel} ${c.year}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    if (els.brand.value && c.brand !== els.brand.value) return false;
    if (els.body.value && c.body !== els.body.value) return false;
    if (els.fuel.value && c.fuel !== els.fuel.value) return false;
    if (els.trans.value && c.trans !== els.trans.value) return false;
    if (pMin !== null && c.price < pMin) return false;
    if (pMax !== null && c.price > pMax) return false;
    if (yMin !== null && c.year < yMin) return false;
    if (yMax !== null && c.year > yMax) return false;
    if (km !== null && c.mileage > km) return false;
    return true;
  });

  const sorters = {
    priceAsc: (a, b) => a.price - b.price,
    priceDesc: (a, b) => b.price - a.price,
    yearDesc: (a, b) => b.year - a.year,
    kmAsc: (a, b) => a.mileage - b.mileage,
    new: () => 0 // исходный порядок: свои объявления сверху
  };
  list.sort(sorters[els.sort.value] || sorters.new);

  currentList = list;
  renderCards(list);
}

function renderCards(list) {
  els.grid.innerHTML = '';
  els.empty.hidden = list.length > 0;
  els.count.textContent = `Найдено: ${list.length}`;

  const frag = document.createDocumentFragment();
  list.forEach((c) => {
    const photos = photoList(c);
    const card = document.createElement('article');
    card.className = 'card';
    card.tabIndex = 0;
    card.dataset.id = c.id;
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `${carName(c)}, ${c.year}, открыть подробности`);

    card.innerHTML = `
      <div class="card__img">
        <img alt="${esc(carName(c))}" loading="lazy" width="900" height="600">
        <span class="badge">${esc(c.year)}</span>
        ${c.user ? '<span class="badge badge--user">Ваше</span>' : ''}
        <span class="photos-count">📷 ${photos.length}</span>
      </div>
      <div class="card__body">
        <h3 class="card__title">${esc(carName(c))}</h3>
        <p class="card__meta">${esc(c.city)} · ${fmtNum(c.mileage)} км · ${esc(c.engine || '')}</p>
        ${priceHTML(c)}
        <ul class="chips">
          <li>${esc(c.fuel)}</li><li>${esc(c.trans)}</li><li>${esc(c.body)}</li>
        </ul>
        <button type="button" class="btn btn--green">Подробнее</button>
      </div>`;

    const img = $('img', card);
    attachFallback(img, carName(c));
    img.src = photos[0];

    const open = () => openCar(c.id);
    card.addEventListener('click', open);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
    });
    frag.appendChild(card);
  });
  els.grid.appendChild(frag);
}

function updateStats() {
  const cars = allCars();
  $('#statCount').textContent = cars.length;
  $('#statBrands').textContent = new Set(cars.map((c) => c.brand)).size;
  $('#statFrom').textContent = fmtUSD(Math.min(...cars.map((c) => c.price)));
}

/* =====================================================================
   МОДАЛЬНОЕ ОКНО С ГАЛЕРЕЕЙ
   ===================================================================== */
const modal = $('#carModal');
const modalInner = $('#modalInner');
let gallery = { photos: [], index: 0, label: '' };

function openCar(id) {
  const c = allCars().find((x) => x.id === id);
  if (!c) return;

  gallery = { photos: photoList(c), index: 0, label: carName(c) };
  const phone = String(c.phone || '');
  const digits = phone.replace(/\D/g, '');

  const specs = [
    ['Год', c.year], ['Пробег', fmtNum(c.mileage) + ' км'],
    ['Двигатель', c.engine || '—'], ['Топливо', c.fuel],
    ['Коробка', c.trans], ['Привод', c.drive || '—'],
    ['Кузов', c.body], ['Цвет', c.color || '—'],
    ['Город', c.city]
  ].map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('');

  const list = (arr) => (arr && arr.length)
    ? `<ul>${arr.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>` : '';

  modalInner.innerHTML = `
    <button class="modal__close" type="button" aria-label="Закрыть" data-close>×</button>
    <div class="modal__layout">
      <div class="gallery">
        <div class="gallery__main" id="galMain">
          <img id="galImg" alt="${esc(carName(c))}">
          <button class="gallery__nav gallery__nav--prev" type="button" aria-label="Предыдущее фото" data-nav="-1">‹</button>
          <button class="gallery__nav gallery__nav--next" type="button" aria-label="Следующее фото" data-nav="1">›</button>
          <span class="gallery__counter" id="galCounter"></span>
        </div>
        <div class="gallery__thumbs" id="galThumbs"></div>
      </div>

      <div class="info">
        <h2>${esc(carName(c))}</h2>
        <p class="info__sub">${esc(c.year)} · ${esc(c.city)}</p>
        ${priceHTML(c)}
        <dl class="specs">${specs}</dl>

        ${c.description ? `<div><h4>Описание</h4><p>${esc(c.description)}</p></div>` : ''}

        <div class="pc">
          ${c.pros && c.pros.length ? `<div class="pros"><h4>Плюсы</h4>${list(c.pros)}</div>` : ''}
          ${c.cons && c.cons.length ? `<div class="cons"><h4>Минусы</h4>${list(c.cons)}</div>` : ''}
        </div>

        <div class="seller">
          <div><strong>${esc(c.seller || 'Продавец')}</strong><small>${esc(phone)}</small></div>
        </div>
        <div class="actions">
          <a class="btn btn--primary" href="tel:${esc(phone.replace(/[^\d+]/g, ''))}">📞 Позвонить</a>
          <a class="btn btn--wa" href="https://wa.me/${esc(digits)}" target="_blank" rel="noopener">WhatsApp</a>
          ${c.user ? '<button class="btn btn--danger" type="button" data-delete>Удалить объявление</button>' : ''}
        </div>
      </div>
    </div>`;

  // Миниатюры
  const thumbs = $('#galThumbs');
  gallery.photos.forEach((src, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'gallery__thumb';
    b.setAttribute('aria-label', `Фото ${i + 1}`);
    const im = document.createElement('img');
    im.alt = '';
    attachFallback(im, `Фото ${i + 1}`);
    im.src = src;
    b.appendChild(im);
    b.addEventListener('click', () => showPhoto(i));
    thumbs.appendChild(b);
  });
  const mainImg = $('#galImg');
  mainImg.addEventListener('error', () => {
    if (!mainImg.dataset.fb) {
      mainImg.dataset.fb = '1';
      mainImg.src = placeholder(`${gallery.label} · фото ${gallery.index + 1}`);
    }
  });

  if (gallery.photos.length < 2) {
    $$('.gallery__nav', modalInner).forEach((b) => (b.hidden = true));
  }

  // Удаление своего объявления
  const del = $('[data-delete]', modalInner);
  if (del) {
    del.addEventListener('click', () => {
      if (!confirm('Удалить это объявление?')) return;
      userCars = userCars.filter((x) => x.id !== c.id);
      saveUserCars();
      modal.close();
      fillBrands();
      updateStats();
      applyFilters();
      toast('Объявление удалено');
    });
  }

  // Свайп по главному фото
  const main = $('#galMain');
  let startX = null;
  main.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
  main.addEventListener('touchend', (e) => {
    if (startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) step(dx < 0 ? 1 : -1);
    startX = null;
  });

  showPhoto(0);
  if (!modal.open) modal.showModal();
  modalInner.scrollTop = 0;
}

function showPhoto(i) {
  const n = gallery.photos.length;
  gallery.index = (i + n) % n;
  const img = $('#galImg');
  delete img.dataset.fb;
  img.src = gallery.photos[gallery.index];
  $('#galCounter').textContent = `${gallery.index + 1} / ${n}`;
  $$('.gallery__thumb', modalInner).forEach((t, k) => t.classList.toggle('is-active', k === gallery.index));
}
const step = (d) => showPhoto(gallery.index + d);

modal.addEventListener('click', (e) => {
  if (e.target === modal || e.target.closest('[data-close]')) { modal.close(); return; }
  const nav = e.target.closest('[data-nav]');
  if (nav) step(Number(nav.dataset.nav));
});
modal.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') step(1);
  if (e.key === 'ArrowLeft') step(-1);
});

/* =====================================================================
   ФОРМА ОБЪЯВЛЕНИЯ
   ===================================================================== */
const sellForm = $('#sellForm');
const photoInput = $('#photoInput');
const previews = $('#previews');
let pendingPhotos = [];

function fileToDataURL(file) {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onerror = reject;
    fr.onload = () => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const MAX = 1000;
        const k = Math.min(1, MAX / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * k);
        canvas.height = Math.round(img.height * k);
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.75));
      };
      img.src = fr.result;
    };
    fr.readAsDataURL(file);
  });
}

photoInput.addEventListener('change', async () => {
  const files = [...photoInput.files].slice(0, MAX_PHOTOS);
  if (photoInput.files.length > MAX_PHOTOS) toast(`Можно загрузить не больше ${MAX_PHOTOS} фото`);
  previews.innerHTML = '';
  pendingPhotos = [];
  for (const f of files) {
    if (!f.type.startsWith('image/')) continue;
    try {
      const url = await fileToDataURL(f);
      pendingPhotos.push(url);
      const im = document.createElement('img');
      im.src = url;
      im.alt = 'Превью фото';
      previews.appendChild(im);
    } catch (e) { /* пропускаем битый файл */ }
  }
});

// Подсказка цены в сомах прямо в форме
sellForm.elements.price.addEventListener('input', (e) => {
  const v = Number(e.target.value);
  $('#priceHint').textContent = v > 0 ? `≈ ${fmtKGS(v)}` : '';
});

sellForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const f = sellForm.elements;
  const err = $('#formError');
  const required = ['brand', 'model', 'year', 'price', 'mileage', 'city', 'phone'];
  const missing = required.filter((n) => !String(f[n].value).trim());
  const year = Number(f.year.value);
  const price = Number(f.price.value);
  const mileage = Number(f.mileage.value);

  let message = '';
  if (missing.length) message = 'Заполните все обязательные поля, отмеченные звёздочкой.';
  else if (!(year >= 1970 && year <= 2030)) message = 'Укажите корректный год выпуска.';
  else if (!(price >= 100)) message = 'Укажите цену в долларах (от 100 $).';
  else if (!(mileage >= 0)) message = 'Укажите корректный пробег.';
  else if (String(f.phone.value).replace(/\D/g, '').length < 9) message = 'Введите корректный номер телефона.';

  if (message) {
    err.textContent = message;
    err.hidden = false;
    const bad = required.find((n) => !String(f[n].value).trim());
    if (bad) f[bad].focus();
    return;
  }
  err.hidden = true;

  const lines = (s) => s.split('\n').map((t) => t.trim()).filter(Boolean).slice(0, 8);

  const car = {
    id: 'u' + Date.now(),
    user: true,
    brand: f.brand.value.trim(),
    model: f.model.value.trim(),
    year, price, mileage,
    engine: f.engine.value.trim(),
    fuel: f.fuel.value,
    trans: f.trans.value,
    drive: '',
    body: f.body.value,
    color: '',
    city: f.city.value.trim(),
    seller: f.seller.value.trim(),
    phone: f.phone.value.trim(),
    description: f.description.value.trim(),
    pros: [],
    cons: lines(f.cons.value),
    photos: [...pendingPhotos]
  };

  userCars.unshift(car);
  saveUserCars();

  sellForm.reset();
  pendingPhotos = [];
  previews.innerHTML = '';
  $('#priceHint').textContent = '';

  fillBrands();
  updateStats();
  // Сброс фильтров, чтобы объявление точно было видно
  $('#filterForm').reset();
  els.sort.value = 'new';
  applyFilters();

  toast('Объявление опубликовано!');
  $('#catalog').scrollIntoView({ behavior: 'smooth' });
});

/* =====================================================================
   ИНТЕРФЕЙС: валюта, меню, фильтры на мобильных
   ===================================================================== */
function setCurrency(cur) {
  currency = cur;
  lsSet(CURRENCY_KEY, cur);
  $$('.currency__btn').forEach((b) => b.classList.toggle('is-active', b.dataset.cur === cur));
  renderCards(currentList);
}
$$('.currency__btn').forEach((b) => b.addEventListener('click', () => setCurrency(b.dataset.cur)));

const burger = $('#burger');
const nav = $('#nav');
burger.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  burger.setAttribute('aria-expanded', String(open));
});
nav.addEventListener('click', (e) => {
  if (e.target.closest('a')) {
    nav.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
  }
});

const filterToggle = $('#filterToggle');
const filtersPanel = $('#filters');
filterToggle.addEventListener('click', () => {
  const open = filtersPanel.classList.toggle('open');
  filterToggle.setAttribute('aria-expanded', String(open));
  filterToggle.textContent = open ? 'Скрыть фильтры' : 'Фильтры';
});

const filterForm = $('#filterForm');
filterForm.addEventListener('input', applyFilters);
filterForm.addEventListener('change', applyFilters);
filterForm.addEventListener('reset', () => setTimeout(applyFilters, 0));
filterForm.addEventListener('submit', (e) => e.preventDefault());

/* =====================================================================
   СТАРТ
   ===================================================================== */
$('#year').textContent = new Date().getFullYear();
$('#rateNote').textContent = `Курс: 1 $ = ${String(USD_TO_KGS).replace('.', ',')} сом (ориентировочно)`;
$$('.currency__btn').forEach((b) => b.classList.toggle('is-active', b.dataset.cur === currency));
fillBrands();
updateStats();
applyFilters();