(function () {
  'use strict';

  /* ── Dark Mode ── */
  function initTheme() {
    const saved = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', saved);
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  }

  /* ── Search ── */
  const searchIndex = [
    { title: 'Home', url: '/', desc: 'Piscine preparation overview' },
    { title: 'Shell 00', url: '/shell/shell00.html', desc: 'Basic shell commands, navigation, file manipulation' },
    { title: 'Shell 01', url: '/shell/shell01.html', desc: 'Shell scripting, advanced commands, environment' },
    { title: 'C 00', url: '/c-days/c00.html', desc: 'Introduction to C — ft_putchar, loops, basic functions' },
    { title: 'C 01', url: '/c-days/c01.html', desc: 'Pointers and basic memory manipulation' },
    { title: 'C 02', url: '/c-days/c02.html', desc: 'String manipulation functions' },
    { title: 'C 03', url: '/c-days/c03.html', desc: 'String comparison and memory functions' },
    { title: 'C 04', url: '/c-days/c04.html', desc: 'More string functions, ft_atoi' },
    { title: 'C 05', url: '/c-days/c05.html', desc: 'Math, recursion, factorial, fibonacci' },
    { title: 'C 06', url: '/c-days/c06.html', desc: 'Program arguments (argc, argv)' },
    { title: 'C 07', url: '/c-days/c07.html', desc: 'Memory allocation, malloc, string duplication' },
    { title: 'C 08', url: '/c-days/c08.html', desc: 'Header files, macros, structures' },
    { title: 'C 09', url: '/c-days/c09.html', desc: 'Makefiles, library creation' },
    { title: 'C 10', url: '/c-days/c10.html', desc: 'File descriptors, read/write, basic I/O' },
    { title: 'C 11', url: '/c-days/c11.html', desc: 'Function pointers, foreach, map, sort' },
    { title: 'C 12', url: '/c-days/c12.html', desc: 'Singly linked lists' },
    { title: 'C 13', url: '/c-days/c13.html', desc: 'Doubly linked lists, advanced structures' },
    { title: 'Exam 00', url: '/exams/exam00.html', desc: 'First machine exam practice' },
    { title: 'Exam 01', url: '/exams/exam01.html', desc: 'Second machine exam practice' },
    { title: 'Exam 02', url: '/exams/exam02.html', desc: 'Third machine exam practice' },
    { title: 'Final Exam', url: '/exams/final.html', desc: 'End-of-Piscine final exam practice' },
    { title: 'Rush 00', url: '/rushes/rush00.html', desc: 'Weekend group project — basic algorithms' },
    { title: 'Rush 01', url: '/rushes/rush01.html', desc: 'Weekend group project — intermediate' },
    { title: 'Rush 02', url: '/rushes/rush02.html', desc: 'Weekend group project — advanced' },
    { title: 'Resources', url: '/resources/index.html', desc: 'Norm, Git, GCC, debugging, peer evaluation' },
    { title: 'Norminette', url: '/resources/norm.html', desc: '42 Norm rules and checklist' },
    { title: 'Git Guide', url: '/resources/git.html', desc: 'Git workflow for Piscine' },
    { title: 'GCC Guide', url: '/resources/gcc.html', desc: 'Compilation flags and debugging' },
    { title: 'Debugging', url: '/resources/debugging.html', desc: 'GDB, Valgrind, common debugging techniques' },
    { title: 'Peer Evaluation', url: '/resources/peer-eval.html', desc: 'How to evaluate and get evaluated' },
    { title: 'Subjects', url: '/subjects/index.html', desc: 'Uploaded subject PDFs and prompts' },
  ];

  let searchOpen = false;

  function openSearch() {
    searchOpen = true;
    document.getElementById('searchOverlay').classList.add('active');
    document.getElementById('searchModal').classList.add('active');
    document.getElementById('searchInput').value = '';
    document.getElementById('searchResults').innerHTML = '';
    setTimeout(function () { document.getElementById('searchInput').focus(); }, 100);
    document.body.style.overflow = 'hidden';
  }

  function closeSearch() {
    searchOpen = false;
    document.getElementById('searchOverlay').classList.remove('active');
    document.getElementById('searchModal').classList.remove('active');
    document.body.style.overflow = '';
  }

  function performSearch(query) {
    var q = query.toLowerCase().trim();
    var results = document.getElementById('searchResults');
    if (!q) { results.innerHTML = ''; return; }
    var matches = searchIndex.filter(function (item) {
      return item.title.toLowerCase().includes(q) || item.desc.toLowerCase().includes(q);
    });
    if (matches.length === 0) {
      results.innerHTML = '<div style="padding:.75rem;font-size:.875rem;color:var(--text-muted);text-align:center;">No results found</div>';
      return;
    }
    results.innerHTML = matches.map(function (item) {
      return '<a href="' + item.url + '" class="search-result-item" onclick="closeSearch()">' +
        '<div class="title">' + item.title + '</div>' +
        '<div class="desc">' + item.desc + '</div></a>';
    }).join('');
  }

  /* ── Progress Tracking ── */
  function initProgress(moduleKey, total) {
    var key = 'piscine-progress-' + moduleKey;
    var saved;
    try { saved = JSON.parse(localStorage.getItem(key)) || []; } catch (e) { saved = []; }
    var checks = document.querySelectorAll('.ex-check');
    checks.forEach(function (el, i) {
      if (saved.indexOf(i) !== -1) {
        el.classList.add('done');
        el.textContent = '✓';
      }
      el.addEventListener('click', function () {
        this.classList.toggle('done');
        if (this.classList.contains('done')) {
          this.textContent = '✓';
          saved.push(i);
        } else {
          this.textContent = '';
          saved = saved.filter(function (v) { return v !== i; });
        }
        try { localStorage.setItem(key, JSON.stringify(saved)); } catch (e) {}
        updateProgressBar(moduleKey, total);
      });
    });
    updateProgressBar(moduleKey, total);
  }

  function updateProgressBar(moduleKey, total) {
    var key = 'piscine-progress-' + moduleKey;
    var saved;
    try { saved = JSON.parse(localStorage.getItem(key)) || []; } catch (e) { saved = []; }
    var done = saved.filter(function (v) { return v < total; }).length;
    var pct = total > 0 ? Math.round((done / total) * 100) : 0;
    var fill = document.querySelector('.progress-fill');
    var text = document.querySelector('.progress-text');
    if (fill) fill.style.width = pct + '%';
    if (text) text.textContent = done + '/' + total + ' (' + pct + '%)';
  }

  function resetProgress(moduleKey) {
    try { localStorage.removeItem('piscine-progress-' + moduleKey); } catch (e) {}
    var checks = document.querySelectorAll('.ex-check');
    checks.forEach(function (el) {
      el.classList.remove('done');
      el.textContent = '';
    });
    var fill = document.querySelector('.progress-fill');
    var text = document.querySelector('.progress-text');
    if (fill) fill.style.width = '0%';
    if (text) text.textContent = '0/0 (0%)';
  }

  /* ── Mobile Nav ── */
  function toggleMobileNav() {
    document.querySelector('.nav-links').classList.toggle('open');
  }

  /* ── Filters ── */
  function initFilters() {
    var btns = document.querySelectorAll('.filter-btn');
    var items = document.querySelectorAll('[data-week]');
    if (!btns.length || !items.length) return;
    btns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        btns.forEach(function (b) { b.classList.remove('active'); });
        this.classList.add('active');
        var filter = this.getAttribute('data-filter');
        items.forEach(function (item) {
          if (filter === 'all' || item.getAttribute('data-week') === filter) {
            item.style.display = '';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }

  /* ── Init ── */
  function init() {
    initTheme();

    document.querySelectorAll('.theme-toggle').forEach(function (el) {
      el.addEventListener('click', toggleTheme);
    });

    document.querySelectorAll('.search-toggle').forEach(function (el) {
      el.addEventListener('click', openSearch);
    });

    var overlay = document.getElementById('searchOverlay');
    if (overlay) overlay.addEventListener('click', closeSearch);

    var searchInput = document.getElementById('searchInput');
    if (searchInput) {
      searchInput.addEventListener('input', function () { performSearch(this.value); });
      searchInput.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeSearch();
        if (e.key === 'Enter') {
          var first = document.querySelector('.search-result-item');
          if (first) { closeSearch(); window.location.href = first.getAttribute('href'); }
        }
      });
    }

    document.querySelectorAll('.mobile-nav-toggle').forEach(function (el) {
      el.addEventListener('click', toggleMobileNav);
    });

    document.addEventListener('keydown', function (e) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); openSearch(); }
      if (e.key === 'Escape' && searchOpen) closeSearch();
    });

    initFilters();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.initProgress = initProgress;
  window.resetProgress = resetProgress;
  window.closeSearch = closeSearch;
})();
