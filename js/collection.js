/* ============================================================
   LUXORA MOTORS - Collection page logic
   Cards, search, 5 filters, sorting, results counter, details modal
   ============================================================ */

const formatPrice = (value) => '$' + value.toLocaleString('en-US');
const $id = (id) => document.getElementById(id);

/* ---------- Car card ---------- */
function carCardHTML(car) {
  return `
    <article class="car-card reveal">
      <div class="car-card__media" data-label="${car.model}">
        <img src="${ROOT}${car.image}" alt="${car.brand} ${car.model}" loading="lazy" />
      </div>
      <div class="car-card__body">
        <span class="car-card__brand">${car.brand} &middot; ${car.category}</span>
        <div class="car-card__title-row">
          <h3>${car.model}</h3>
          <span class="car-card__year">${car.year}</span>
        </div>
        <div class="car-card__specs">
          <span class="spec-chip"><strong>${car.horsepower} HP</strong></span>
          <span class="spec-chip">${car.engine}</span>
          <span class="spec-chip">${car.transmission}</span>
          <span class="spec-chip">${car.fuel}</span>
        </div>
        <div class="car-card__footer">
          <div class="car-card__price">${formatPrice(car.price)}<small>Illustrative price</small></div>
          <button type="button" class="btn btn--primary btn--small" data-car="${car.id}">View Details</button>
        </div>
      </div>
    </article>`;
}

/* ---------- Filtering + sorting ---------- */
const PRICE_RANGES = {
  under100: [0, 100000],
  p100to200: [100000, 200000],
  p200to300: [200000, 300000],
  over300: [300000, Infinity],
};
const isDualClutch = (car) => /DCT|PDK|S tronic|SSG|LDF|Dual-Clutch/i.test(car.transmission);
const transmissionOf = (car) => (isDualClutch(car) ? 'Dual-clutch' : 'Automatic');

const SORTERS = {
  featured: () => 0,
  'price-asc': (a, b) => a.price - b.price,
  'price-desc': (a, b) => b.price - a.price,
  newest: (a, b) => b.year - a.year || b.price - a.price,
  brand: (a, b) => a.brand.localeCompare(b.brand) || a.model.localeCompare(b.model),
};

function applyFilters() {
  const grid = $id('collection-grid');
  if (!grid) return;
  const term = $id('search-input').value.trim().toLowerCase();
  const brand = $id('brand-filter').value;
  const range = PRICE_RANGES[$id('price-filter').value];
  const category = $id('category-filter').value;
  const fuel = $id('fuel-filter').value;
  const trans = $id('transmission-filter').value;
  const sort = $id('sort-select').value;

  const list = CARS.filter((car) =>
    (term === '' || `${car.brand} ${car.model} ${car.category} ${car.engine}`.toLowerCase().includes(term)) &&
    (brand === 'all' || car.brand === brand) &&
    (!range || (car.price >= range[0] && car.price < range[1])) &&
    (category === 'all' || car.category === category) &&
    (fuel === 'all' || car.fuel === fuel) &&
    (trans === 'all' || transmissionOf(car) === trans)
  ).sort(SORTERS[sort]);

  grid.innerHTML = list.map(carCardHTML).join('');
  $id('no-results').style.display = list.length ? 'none' : 'block';
  $id('results-count').textContent = `Showing ${list.length} of ${CARS.length} vehicles`;
  grid.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'));
}

function fillSelect(id, values) {
  const select = $id(id);
  [...new Set(values)].sort().forEach((v) => {
    const o = document.createElement('option');
    o.value = o.textContent = v;
    select.appendChild(o);
  });
}

function clearFilters() {
  ['brand-filter', 'price-filter', 'category-filter', 'fuel-filter', 'transmission-filter'].forEach((id) => { $id(id).value = 'all'; });
  $id('search-input').value = '';
  $id('sort-select').value = 'featured';
  applyFilters();
}

function initCollectionFilters() {
  if (!$id('collection-grid') || !$id('sort-select')) return;
  fillSelect('brand-filter', CARS.map((c) => c.brand));
  fillSelect('category-filter', CARS.map((c) => c.category));
  fillSelect('fuel-filter', CARS.map((c) => c.fuel));
  fillSelect('transmission-filter', CARS.map(transmissionOf));
  $id('search-input').addEventListener('input', applyFilters);
  document.querySelectorAll('.filters select').forEach((s) => s.addEventListener('change', applyFilters));
  document.querySelectorAll('#clear-filters, #reset-filters').forEach((b) => b.addEventListener('click', clearFilters));
}

function renderCollection() {
  if ($id('collection-grid') && $id('sort-select')) applyFilters();
}

/* ---------- Vehicle details modal ---------- */
const rows = (pairs) => pairs.map(([k, v]) => `<tr><th>${k}</th><td>${v}</td></tr>`).join('');
const list = (items) => `<ul class="detail-list">${items.map((i) => `<li>${i}</li>`).join('')}</ul>`;
const est = (car, f) => (car.estimatedFields.includes(f) ? ' <em class="est">(estimate)</em>' : '');

function openCarDetails(id) {
  const car = CARS.find((c) => c.id === id);
  const dialog = $id('car-dialog');
  if (!car || !dialog) return;
  $id('car-dialog-body').innerHTML = `
    <div class="detail__media" data-label="${car.model}">
      <img src="${ROOT}${car.image}" alt="${car.brand} ${car.model}" />
    </div>
    <div class="detail__head">
      <span class="car-card__brand">${car.brand} &middot; ${car.category} &middot; ${car.year}</span>
      <h2 id="car-dialog-title">${car.model}</h2>
      <p class="detail__price">${formatPrice(car.price)} <small>${car.currency} &mdash; illustrative showroom price</small></p>
      <p>${car.description}</p>
    </div>
    <div class="detail__grid">
      <div><h3>Engine &amp; Performance</h3><table class="spec-table"><tbody>${rows([
        ['Engine', car.engineType], ['Displacement', car.displacement], ['Cylinders', car.cylinders],
        ['Horsepower', car.horsepower + ' HP'], ['Torque', car.torque + est(car, 'torque')],
        ['Maximum speed', car.topSpeed + est(car, 'maxSpeed')], ['0–100 km/h', car.acceleration.replace(' 0–100', ' s') + est(car, 'acceleration')],
      ])}</tbody></table></div>
      <div><h3>Drivetrain &amp; Body</h3><table class="spec-table"><tbody>${rows([
        ['Transmission', car.transmission], ['Drivetrain', car.drivetrain], ['Fuel type', car.fuel],
        ['Seats', car.seats], ['Doors', car.doors], ['Body style', car.bodyStyle], ['Exterior colour', car.exteriorColor],
      ])}</tbody></table></div>
      <div><h3>Interior</h3><p>${car.interior}</p><h3>Main Features</h3>${list(car.features)}</div>
      <div><h3>Luxury Features</h3>${list(car.luxuryFeatures)}<h3>Safety Features</h3>${list(car.safetyFeatures)}</div>
    </div>
    <p class="detail__note">Illustrative data for a university project. Specifications are not verified against manufacturer documents; items marked (estimate) are approximate. No additional photographs have been added for this vehicle yet.</p>
    <a class="btn btn--ghost btn--small" href="${ROOT}pages/contact.html">Enquire About This Car</a>`;
  dialog.showModal();
}

function initDetailsModal() {
  const dialog = $id('car-dialog');
  if (!dialog) return;
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-car]');
    if (btn) openCarDetails(btn.dataset.car);
    if (e.target === dialog || e.target.closest('.dialog__close')) dialog.close();
  });
}

/* ---------- Featured section ---------- */
function featuredHTML(car, promo) {
  return `
    <article class="featured__item reveal" id="spec-${car.id}">
      <div class="featured__media">
        <img src="${ROOT}${car.image}" alt="${car.brand} ${car.model}" loading="lazy" />
      </div>
      <div class="featured__body">
        <span class="car-card__brand">${car.brand}</span>
        <h3>${car.model} <span style="color: var(--color-gray-dark); font-size: 1rem;">${car.year}</span></h3>
        <p class="featured__price">${formatPrice(car.price)} <small style="color: var(--color-gray-dark); font-size: 0.7rem; font-weight: 300;">— illustrative price</small></p>
        <p class="featured__desc">${promo}</p>
        <table class="spec-table">
          <tbody>
            <tr><th>Engine Capacity</th><td>${car.engine}</td></tr>
            <tr><th>Horsepower</th><td>${car.horsepower} HP</td></tr>
            <tr><th>Torque</th><td>${car.torque}</td></tr>
            <tr><th>Maximum Speed</th><td>${car.topSpeed}</td></tr>
            <tr><th>Acceleration</th><td>${car.acceleration}</td></tr>
            <tr><th>Transmission</th><td>${car.transmission}</td></tr>
            <tr><th>Fuel Type</th><td>${car.fuel}</td></tr>
          </tbody>
        </table>
        <a class="btn btn--ghost" href="${ROOT}pages/contact.html">Enquire Now</a>
      </div>
    </article>`;
}

function renderFeatured() {
  const wrap = document.getElementById('featured-list');
  if (!wrap) return;
  wrap.innerHTML = FEATURED.map((f) => {
    const car = CARS.find((c) => c.id === f.id);
    return car ? featuredHTML(car, f.promo) : '';
  }).join('');
}

/* ---------- Specification panels (all cars) ---------- */
function renderSpecPanels() {
  const grid = document.getElementById('spec-grid');
  if (!grid) return;
  const onHome = !!document.getElementById('featured-list');
  const shown = onHome ? CARS.filter((car) => FEATURED.some((f) => f.id === car.id)) : CARS;
  grid.innerHTML = shown.map(
    (car) => `
      <div class="spec-panel reveal" id="specs-${car.id}">
        <div class="spec-panel__head">
          <span class="car-card__brand">${car.brand}</span>
          <h3>${car.model} — ${car.year}</h3>
        </div>
        <table class="spec-table">
          <tbody>
            <tr><th>Engine Capacity</th><td>${car.engine}</td></tr>
            <tr><th>Horsepower</th><td>${car.horsepower} HP</td></tr>
            <tr><th>Torque</th><td>${car.torque}</td></tr>
            <tr><th>Maximum Speed</th><td>${car.topSpeed}</td></tr>
            <tr><th>Acceleration</th><td>${car.acceleration}</td></tr>
            <tr><th>Transmission</th><td>${car.transmission}</td></tr>
            <tr><th>Fuel Type</th><td>${car.fuel}</td></tr>
          </tbody>
        </table>
      </div>`
  ).join('');
}

/* ---------- Gallery ---------- */
function renderGallery() {
  const grid = document.getElementById('gallery-grid');
  if (!grid) return;
  grid.innerHTML = GALLERY.map(
    (g, i) => `
      <figure class="gallery-item ${g.cls}">
        <img src="${g.src}" data-fallback="images/gallery/g${i + 1}.jpg" alt="${g.alt}" loading="lazy" />
        <figcaption>${g.caption}</figcaption>
      </figure>`
  ).join('');
}

/* ---------- Init ---------- */
document.addEventListener('DOMContentLoaded', () => {
  initCollectionFilters();
  renderCollection();
  initDetailsModal();
  renderFeatured();
  renderSpecPanels();
  renderGallery();
});
