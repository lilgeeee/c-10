const data = window.appData;
const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
const fmtDate = (value) => new Date(value + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

function renderOverview() {
  document.getElementById('current-phase').textContent = data.truck.currentPhase;
  document.getElementById('total-spent').textContent = currency.format(getTotalSpent());
  document.getElementById('fund-left').textContent = currency.format(data.truck.truckFundLeft);
  document.getElementById('open-decisions').textContent = data.decisions.filter(item => item.status === 'open' || item.status === 'waiting').length;
  document.getElementById('latest-update').textContent = data.timeline.length ? fmtDate(data.timeline[0].date) : '—';
  fillList('recent-progress', data.timeline.slice(0, 3).map(item => `<strong>${item.title}</strong><div class="meta">${fmtDate(item.date)} · ${item.type}</div>`));
  fillList('next-jobs', data.progress.filter(item => item.status === 'next').map(item => `<strong>${item.title}</strong><div class="meta">${item.area}</div>`));
  fillList('blocked-items', data.decisions.map(item => `<strong>${item.title}</strong><div class="meta">${item.note}</div>`));
  fillList('build-areas', data.areas.map(item => `<strong>${item.label}</strong><div class="meta">${item.state}</div>`));
}

function renderProgress() {
  fillList('progress-done', data.progress.filter(item => item.status === 'done').map(progressMarkup));
  fillList('progress-inprogress', data.progress.filter(item => item.status === 'in_progress').map(progressMarkup));
  fillList('progress-next', data.progress.filter(item => item.status === 'next').map(progressMarkup));
}
function progressMarkup(item) { return `<strong>${item.title}</strong><div class="meta">${item.area} · Updated ${fmtDate(item.updated)}</div>`; }

function renderParts() {
  document.getElementById('parts-table').innerHTML = data.parts.map(part => `
    <tr><td>${part.name}</td><td>${part.category}</td><td><span class="status-chip">${part.status}</span></td><td>${part.vendor}</td><td>${currency.format(part.price)}</td></tr>
  `).join('');
}

function renderTimeline() {
  fillList('timeline-list', data.timeline.map(item => `<div class="timeline-date">${fmtDate(item.date)} · ${item.type}</div><div class="timeline-title">${item.title}</div><div class="meta">${item.details}</div>`));
}

function renderDecisions() {
  fillList('decisions-open', data.decisions.filter(item => item.status === 'open').map(item => `<strong>${item.title}</strong><div class="meta">${item.note}</div>`));
  fillList('decisions-waiting', data.decisions.filter(item => item.status === 'waiting').map(item => `<strong>${item.title}</strong><div class="meta">${item.note}</div>`));
}

function fillList(id, items) {
  document.getElementById(id).innerHTML = items.map(item => `<li>${item}</li>`).join('') || '<li><span class="meta">Nothing here yet.</span></li>';
}

function getTotalSpent() {
  return data.parts.reduce((sum, part) => sum + Number(part.price || 0), 0);
}

function rerenderAll() {
  data.timeline.sort((a, b) => new Date(b.date) - new Date(a.date));
  renderOverview();
  renderProgress();
  renderParts();
  renderTimeline();
  renderDecisions();
}

function setupTabs() {
  const buttons = document.querySelectorAll('.tab-button');
  const panels = document.querySelectorAll('.tab-panel');
  buttons.forEach(button => {
    button.addEventListener('click', () => {
      buttons.forEach(btn => btn.classList.remove('active'));
      panels.forEach(panel => panel.classList.remove('active'));
      button.classList.add('active');
      document.getElementById(button.dataset.tab).classList.add('active');
    });
  });
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

function setupForms() {
  document.getElementById('progress-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    data.progress.unshift({
      area: form.get('area'),
      title: form.get('title'),
      status: form.get('status'),
      updated: form.get('updated')
    });
    rerenderAll();
    e.target.reset();
  });

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

  document.getElementById('timeline-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    data.timeline.unshift({
      date: form.get('date'),
      type: form.get('type'),
      title: form.get('title'),
      details: form.get('details')
    });
    rerenderAll();
    e.target.reset();
  });

  document.getElementById('decision-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    data.decisions.unshift({
      title: form.get('title'),
      status: form.get('status'),
      note: form.get('note')
    });
    rerenderAll();
    e.target.reset();
  });
}

rerenderAll();
setupTabs();
setupTheme();
setupForms();
