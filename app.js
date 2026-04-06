const data = window.appData;
const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

function getTotalSpent() {
  return data.parts.reduce((sum, part) => sum + Number(part.price || 0), 0);
}

function renderStats() {
  document.getElementById('total-spent').textContent = currency.format(getTotalSpent());
  document.getElementById('parts-count').textContent = data.parts.length;
  document.getElementById('installed-count').textContent = data.parts.filter(part => part.status === 'Installed').length;
  document.getElementById('planned-count').textContent = data.parts.filter(part => part.status !== 'Installed').length;
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
  const totals = data.parts.reduce((acc, part) => {
    acc[part.category] = (acc[part.category] || 0) + Number(part.price || 0);
    return acc;
  }, {});

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
    rerenderAll();
    e.target.reset();
  });
}

rerenderAll();
setupTheme();
setupForm();
