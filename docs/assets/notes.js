(function () {
  'use strict';

  var cfg = window.NOTES || {};
  var units = cfg.units || [];
  var toc = document.getElementById('toc');

  var navbar = document.querySelector('.navbar');
  var brand = document.querySelector('.navbar .brand');
  if (brand && cfg.brand) brand.innerHTML = cfg.brand;
  if (brand) brand.innerHTML = '<a href="../index.html">' + brand.innerHTML + '</a>';

  if (toc && navbar) navbar.parentNode.insertBefore(toc, navbar.nextSibling);

  function syncNavbar() {
    var el = document.querySelector('.navbar');
    if (el) document.documentElement.style.setProperty('--navbar-h', el.offsetHeight + 'px');
  }
  syncNavbar();
  window.addEventListener('resize', syncNavbar);

  var nav = document.getElementById('navLinks');
  if (nav) {
    units.forEach(function (u) {
      var li = document.createElement('li');
      var a = document.createElement('a');
      a.href = '#';
      a.dataset.unit = u.key;
      a.textContent = '/' + u.key;
      li.appendChild(a);
      nav.appendChild(li);
    });
  }

  var welcomeTitle = document.getElementById('welcomeTitle');
  if (welcomeTitle && cfg.title) welcomeTitle.textContent = cfg.title;

  var welcomeSubtitle = document.getElementById('welcomeSubtitle');
  if (welcomeSubtitle && cfg.subtitle) welcomeSubtitle.innerHTML = cfg.subtitle;

  var grid = document.getElementById('unitsGrid');
  if (grid) {
    units.forEach(function (u) {
      var card = document.createElement('div');
      card.className = 'unit-card';
      card.tabIndex = 0;
      card.setAttribute('role', 'button');
      card.setAttribute('aria-label', 'Open ' + u.title);

      var num = document.createElement('div');
      num.className = 'num';
      num.textContent = u.num || u.key.replace(/^unit/, '0');
      card.appendChild(num);

      var title = document.createElement('div');
      title.className = 'title';
      title.textContent = u.title || u.key;
      card.appendChild(title);

      card.addEventListener('click', function () { loadUnit(u.key); });
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); loadUnit(u.key); }
      });
      grid.appendChild(card);
    });
  }

  function loadUnit(unit) {
    if (!cfg.files || !cfg.files[unit]) return;

    document.querySelectorAll('.nav-links a').forEach(function (a) {
      a.classList.remove('active');
    });
    var active = document.querySelector('.nav-links a[data-unit="' + unit + '"]');
    if (active) active.classList.add('active');

    var el = document.getElementById('content');
    el.innerHTML = '<div class="loading">Loading...</div>';
    if (toc) toc.classList.remove('visible');

    fetch(cfg.files[unit])
      .then(function (r) {
        if (!r.ok) throw new Error('Failed to load');
        return r.text();
      })
      .then(function (md) {
        el.innerHTML = marked.parse(md);
        makeTablesCollapsible();
        buildTOC();
      })
      .catch(function () {
        el.innerHTML = '<div class="welcome"><h1>Error loading unit</h1><p>Could not load the markdown file. Make sure you are opening this page from the correct subject directory.</p></div>';
      });
  }

  function makeTablesCollapsible() {
    document.querySelectorAll('#content table').forEach(function (table) {
      if (table.dataset.collapsible) return;
      table.dataset.collapsible = 'true';

      var wrap = document.createElement('div');
      wrap.className = 'table-wrap';

      var toggle = document.createElement('div');
      toggle.className = 'table-toggle';
      toggle.innerHTML = '<span class="icon">&#9660;</span> <span class="label">Table</span>';

      table.parentNode.insertBefore(wrap, table);
      wrap.appendChild(toggle);
      wrap.appendChild(table);

      toggle.addEventListener('click', function () {
        table.classList.toggle('collapsed');
        toggle.querySelector('.icon').classList.toggle('collapsed');
      });
    });
  }

  function buildTOC() {
    var content = document.getElementById('content');
    var headings = content.querySelectorAll('h1, h2, h3');
    if (headings.length === 0 || !toc) return;

    headings.forEach(function (h, i) {
      if (!h.id) h.id = 'section-' + i;
    });

    var saved = null;
    try { saved = localStorage.getItem('tocCollapsed-' + location.pathname); } catch (e) {}
    var collapsed = saved === null ? window.innerWidth < 768 : saved === '1';

    var html = '<div class="toc-header">' +
      '<span class="toc-title">Contents</span>' +
      '<button class="toc-toggle" type="button" aria-label="Toggle contents"><span class="icon">&#9660;</span></button>' +
      '</div><div class="toc-links">';
    headings.forEach(function (h) {
      var level = h.tagName.toLowerCase();
      var num = level.slice(1);
      html += '<a href="#' + h.id + '" class="toc-h' + num + '">' + h.textContent + '</a>';
    });
    html += '</div>';

    toc.innerHTML = html;
    toc.classList.add('visible');
    if (collapsed) toc.classList.add('collapsed');

    var btn = toc.querySelector('.toc-toggle');
    btn.addEventListener('click', function () {
      toc.classList.toggle('collapsed');
      try {
        localStorage.setItem('tocCollapsed-' + location.pathname, toc.classList.contains('collapsed') ? '1' : '0');
      } catch (e) {}
    });
  }

  if (nav) {
    nav.addEventListener('click', function (e) {
      var a = e.target.closest ? e.target.closest('a[data-unit]') : null;
      if (a) {
        e.preventDefault();
        loadUnit(a.dataset.unit);
      }
    });
  }

  var scrollBtn = document.getElementById('scrollTop');
  if (scrollBtn) {
    var progressRing = scrollBtn.querySelector('.progress');
    var circumference = 100;
    window.addEventListener('scroll', function () {
      var st = window.scrollY;
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      var progress = docHeight > 0 ? (st / docHeight) * circumference : 0;
      if (progressRing) progressRing.style.strokeDashoffset = circumference - progress;
      scrollBtn.classList.toggle('visible', st > 200);
    });
    scrollBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  window.loadUnit = loadUnit;
})();
