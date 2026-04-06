const STORAGE_KEY = 'c10-parts-tracker-data-v1';
const starterData = window.appData;
const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
let data = loadData();

function loadData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return structuredClone(starterData);
    const parsed = JSON.parse(saved);
    if (!parsed || !Array.isArray(parsed.parts)) return structuredClone(starterData);
    return parsed;
  } catch (error) {
    return structuredClone(starterData);
  }
}

function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function getTotalSpent() {
  return data.parts.reduce((sum, part) => sum + Number(part.price || 0), 0);
}

function getCategoryTotal(categoryName) {
  return data.parts
    .filter(part => part.category === categoryName)
    .reduce((sum, part) => sum + Number(part.price || 0), 0);
}

function getPartsOnlyTotal() {
  return data.parts
    .filter(part => part.category !== 'Shipping' && part.category !== 'Tax')
    .reduce((sum, part) => sum + Number(part.price || 0), 0);
}

function getGroupedTotals() {
  return data.parts.reduce((acc, part) => {
    acc[part.category] = (acc[part.category] || 0) + Number(part.price || 0);
    return acc;
  }, {});
}

function renderStats() {
  document.getElementById('parts-only-total').textContent = currency.format(getPartsOnlyTotal());
  document.getElementById('shipping-total').textContent = currency.format(getCategoryTotal('Shipping'));
  document.getElementById('tax-total').textContent = currency.format(getCategoryTotal('Tax'));
  document.getElementById('grand-total').textContent = currency.format(getTotalSpent());
}

function renderParts() {
  document.getElementById('parts-table').innerHTML = data.parts.map(part => `
    <tr>
      <td>${part.name}</td>
      <td>${part.category}</td>
      <td><span class="status-chip">${part.status}</span></td>
      <td>${part.vendor}</td>
      <td>${currency.format(part.price)}</td>
    </tr>
  `).join('');
}

function renderCategoryTotals() {
  const totals = getGroupedTotals();
  const items = Object.entries(totals)
    .sort((a, b) => b[1] - a[1])
    .map(([category, total]) => `<strong>${category}</strong><div class="meta">${currency.format(total)}</div>`);

  document.getElementById('category-totals').innerHTML = items.map(item => `<li>${item}</li>`).join('') || '<li><span class="meta">No parts yet.</span></li>';
}

function rerenderAll() {
  renderStats();
  renderParts();
  renderCategoryTotals();
}

function setupTheme() {
  const toggle = document.querySelector('[data-theme-toggle]');
  let theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', theme);
  toggle.addEventListener('click', () => {
    theme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', theme);
  });
}

function setupForm() {
  document.getElementById('part-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    data.parts.unshift({
      name: form.get('name'),
      category: form.get('category'),
      status: form.get('status'),
      vendor: form.get('vendor'),
      price: Number(form.get('price'))
    });
    saveData();
    rerenderAll();
    e.target.reset();
  });
}

function setupReset() {
  document.getElementById('reset-data').addEventListener('click', () => {
    const confirmed = window.confirm('Reset the tracker back to the starter parts list?');
    if (!confirmed) return;
    data = structuredClone(starterData);
    saveData();
    rerenderAll();
  });
}

rerenderAll();
setupTheme();
setupForm();
setupReset();
