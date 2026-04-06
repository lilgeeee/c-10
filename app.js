const data = window.appData;
const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

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
  const shippingTotal = getCategoryTotal('Shipping');
  const taxTotal = getCategoryTotal('Tax');
  const grandTotal = getTotalSpent();
  const partsOnlyTotal = getPartsOnlyTotal();
  const grouped = getGroupedTotals();

  const topCategory = Object.entries(grouped)
    .filter(([category]) => category !== 'Shipping' && category !== 'Tax')
    .sort((a, b) => b[1] - a[1])[0];

  document.getElementById('parts-only-total').textContent = currency.format(partsOnlyTotal);
  document.getElementById('shipping-total').textContent = currency.format(shippingTotal);
  document.getElementById('tax-total').textContent = currency.format(taxTotal);
  document.getElementById('grand-total').textContent = currency.format(grandTotal);

  document.getElementById('parts-count').textContent = data.parts.length;
  document.getElementById('installed-count').textContent = data.parts.filter(part => part.status === 'Installed').length;
  document.getElementById('planned-count').textContent = data.parts.filter(part => part.status !== 'Installed').length;
  document.getElementById('top-category').textContent = topCategory ? topCategory[0] : '—';
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
    rerenderAll();
    e.target.reset();
  });
}

rerenderAll();
setupTheme();
setupForm();
