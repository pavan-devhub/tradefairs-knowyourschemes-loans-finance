/*
 * Trade Fairs page (converted from src/pages/trade-fairs/*): National / International switch,
 * "Find a fair" filters, the fairs table with paging, and the official sources.
 * The page's first render is in trade-fairs.html; this script keeps it up to date.
 */
(function (FEED) {
  'use strict';

  var page = document.querySelector('.tf-page');
  if (!page) return;

  var icon = FEED.icon;
  var escape = FEED.escape;
  var DATA = FEED.data.tradeFairs;
  var SOURCES = DATA.SOURCES;
  var FAIRS = DATA.FAIRS;

  /* ------------------------------------------------------------ data */

  var uniqueSorted = function (list) {
    return list.filter(function (item, i) { return list.indexOf(item) === i; }).sort();
  };
  var fairsIn = function (scope) { return FAIRS.filter(function (fair) { return fair.scope === scope; }); };

  // International lists the countries that have fairs; national lists every state and UT
  var PLACES = {
    international: uniqueSorted(fairsIn('international').map(function (fair) { return fair.place; })),
    national: DATA.STATES
  };

  // Every year from 2026 up to five years past the current year (or the latest fair, if later)
  var FIRST_YEAR = 2026;
  var YEARS_AHEAD = 5;
  var lastYear = Math.max.apply(null, [new Date().getFullYear() + YEARS_AHEAD].concat(
    FAIRS.map(function (fair) { return Number(fair.start.slice(0, 4)); })
  ));
  var YEARS = [];
  for (var y = FIRST_YEAR; y <= lastYear; y += 1) YEARS.push(String(y));

  var FAIR_NAMES = {
    international: uniqueSorted(fairsIn('international').map(function (fair) { return fair.name; })),
    national: uniqueSorted(fairsIn('national').map(function (fair) { return fair.name; }))
  };

  // Dropdown shows "Agriculture Sector" but filters on the full ministry name the fairs carry
  var SECTOR_OPTIONS = DATA.SECTORS.map(function (sector) {
    return { value: sector, label: sector.replace(/^Ministry of /, '') + ' Sector' };
  });

  var emptyFilters = function () { return { sector: '', place: '', year: '', month: '', name: '' }; };

  // Exact sector and place, year and month of the start date, name or city search; by start date
  function filterFairs(scope, f) {
    var query = f.name.trim().toLowerCase();
    return FAIRS.filter(function (fair) {
      return fair.scope === scope &&
        (!f.sector || fair.sector === f.sector) &&
        (!f.place || fair.place === f.place) &&
        (!f.year || fair.start.slice(0, 4) === f.year) &&
        (!f.month || Number(fair.start.slice(5, 7)) === Number(f.month)) &&
        (!query || (fair.name + ' ' + fair.city).toLowerCase().indexOf(query) !== -1);
    }).sort(function (a, b) { return a.start < b.start ? -1 : 1; });
  }

  /* ---------------------------------------------------- visited links */

  // Links this person has opened, remembered in this browser so they stay marked on later visits
  function VisitedLinks(storageKey, onChange) {
    var read = function () {
      try {
        var stored = JSON.parse(FEED.storage.get(storageKey));
        return Array.isArray(stored) ? stored : [];
      } catch (e) {
        return [];
      }
    };
    var visited = read();

    // Pick up links opened from another tab
    window.addEventListener('storage', function (event) {
      if (event.key !== storageKey) return;
      read().forEach(function (id) { if (visited.indexOf(id) === -1) visited.push(id); });
      onChange();
    });

    this.has = function (id) { return visited.indexOf(id) !== -1; };
    this.mark = function (id) {
      if (visited.indexOf(id) !== -1) return;
      read().forEach(function (stored) { if (visited.indexOf(stored) === -1) visited.push(stored); });
      visited.push(id);
      FEED.storage.set(storageKey, JSON.stringify(visited));
      onChange();
    };
  }

  /* ------------------------------------------------- filter dropdowns */

  var toOption = function (option) {
    return typeof option === 'string' ? { value: option, label: option } : option;
  };

  // Filter dropdown whose list always opens below the box (a native <select> flips its list
  // upward when the page runs out of room). The list goes into <body> so the card's
  // overflow: hidden doesn't clip it.
  function FilterDropdown(id, onChange) {
    var self = this;
    var button = document.getElementById(id);
    var valueEl = button.querySelector('.tf-dropdown__value');
    var items = [{ value: '', label: 'All' }];
    var value = '';
    var open = false;
    var active = 0;
    var list = null;

    var selectedIndex = function () {
      for (var i = 0; i < items.length; i += 1) if (items[i].value === value) return i;
      return 0;
    };

    function updateButton() {
      valueEl.textContent = items[selectedIndex()].label;
      button.setAttribute('aria-expanded', String(open));
      if (open) button.setAttribute('aria-activedescendant', id + '-option-' + active);
      else button.removeAttribute('aria-activedescendant');
    }

    // Keep the highlighted option visible inside the list
    function showActive() {
      var option = list && list.children[active];
      if (!option) return;
      if (option.offsetTop < list.scrollTop) list.scrollTop = option.offsetTop;
      else if (option.offsetTop + option.offsetHeight > list.scrollTop + list.clientHeight) {
        list.scrollTop = option.offsetTop + option.offsetHeight - list.clientHeight;
      }
    }

    function setActive(index) {
      active = index;
      if (list) {
        Array.prototype.forEach.call(list.children, function (li, i) {
          li.className = 'tf-dropdown-list__option' + (i === active ? ' is-active' : '') + (i === selectedIndex() ? ' is-selected' : '');
        });
        showActive();
      }
      updateButton();
    }

    function onOutside(event) {
      if (!button.contains(event.target) && !(list && list.contains(event.target))) close();
    }

    function openList() {
      var rect = button.getBoundingClientRect();
      var top = rect.bottom + window.scrollY + 4;
      var left = rect.left + window.scrollX;
      active = selectedIndex();
      open = true;

      list = document.createElement('ul');
      list.id = id + '-listbox';
      list.setAttribute('role', 'listbox');
      list.setAttribute('aria-labelledby', id);
      list.className = 'tf-dropdown-list';
      list.style.top = top + 'px';
      list.style.left = left + 'px';
      list.style.minWidth = rect.width + 'px';
      list.style.maxWidth = (window.innerWidth - left - 16) + 'px';
      list.innerHTML = items.map(function (item, i) {
        return '<li id="' + id + '-option-' + i + '" role="option" aria-selected="' + (i === selectedIndex()) + '" class="tf-dropdown-list__option' +
          (i === active ? ' is-active' : '') + (i === selectedIndex() ? ' is-selected' : '') + '">' + escape(item.label) + '</li>';
      }).join('');
      Array.prototype.forEach.call(list.children, function (li, i) {
        li.addEventListener('mouseenter', function () { setActive(i); });
        li.addEventListener('mousedown', function (event) { event.preventDefault(); });
        li.addEventListener('click', function () { choose(i); });
      });
      document.body.appendChild(list);

      document.addEventListener('mousedown', onOutside);
      window.addEventListener('resize', close);
      updateButton();
      // Scroll the page just enough to show the list rather than flipping it upward
      list.scrollIntoView({ block: 'nearest' });
      showActive();
    }

    function close() {
      if (!open) return;
      open = false;
      if (list) list.remove();
      list = null;
      document.removeEventListener('mousedown', onOutside);
      window.removeEventListener('resize', close);
      updateButton();
    }

    function choose(index) {
      onChange(items[index].value);
      close();
    }

    button.addEventListener('click', function () {
      if (open) close();
      else openList();
    });

    button.addEventListener('keydown', function (event) {
      var key = event.key;
      if (!open) {
        if (['ArrowDown', 'ArrowUp', 'Enter', ' '].indexOf(key) !== -1) {
          event.preventDefault();
          openList();
        }
      } else if (key === 'ArrowDown' || key === 'ArrowUp') {
        event.preventDefault();
        setActive(Math.min(items.length - 1, Math.max(0, active + (key === 'ArrowDown' ? 1 : -1))));
      } else if (key === 'Home' || key === 'End') {
        event.preventDefault();
        setActive(key === 'Home' ? 0 : items.length - 1);
      } else if (key === 'Enter' || key === ' ') {
        event.preventDefault();
        choose(active);
      } else if (key === 'Escape' || key === 'Tab') {
        if (key === 'Escape') event.preventDefault();
        close();
      }

      // Typing a letter jumps to the next option starting with it, as a native select does
      if (key.length === 1 && key !== ' ' && !event.ctrlKey && !event.metaKey && !event.altKey) {
        var from = open ? active : selectedIndex();
        var letter = key.toLowerCase();
        for (var step = 1; step <= items.length; step += 1) {
          var index = (from + step) % items.length;
          if (items[index].label.toLowerCase().indexOf(letter) === 0) {
            if (open) setActive(index);
            else onChange(items[index].value);
            break;
          }
        }
      }
    });

    // Space activates a button on keyup; it is already handled on keydown
    button.addEventListener('keyup', function (event) {
      if (event.key === ' ') event.preventDefault();
    });

    self.set = function (nextValue, options) {
      items = [{ value: '', label: 'All' }].concat(options.map(toOption));
      value = nextValue;
      updateButton();
    };
  }

  /* -------------------------------------------------------- the table */

  var PAGE_SIZE = 8;

  // Sl. No. is the navy number strip; the rest follow the mockup's column widths and text insets
  var COLUMNS = [
    { width: '53px' },
    { width: '22%', pad: 16 },
    { width: '21.1%', pad: 20 },
    { width: '14.6%', pad: 17 },
    { width: '21.2%', pad: 23 },
    { width: '17.3%', pad: 15 }
  ];

  // Pastel chip per ministry; ministries not listed use the Commerce blue
  var CHIP_COLORS = {
    'Ministry of Commerce': 'background:#dbe7fd;color:#1f47bf',
    'Ministry of Animal Husbandry': 'background:#cbfbe4;color:#145c3c',
    'Ministry of MSME': 'background:#ecddfd;color:#5b2bc4',
    'Ministry of Agriculture': 'background:#fde3bc;color:#c47417',
    'Ministry of Food Processing': 'background:#fce0ec;color:#b3245f',
    'Ministry of Textiles': 'background:#d2f1f5;color:#127580',
    'Ministry of Health & Family Welfare': 'background:#fde0dc;color:#c2352b',
    'Ministry of Chemicals & Fertilizers': 'background:#fbf1c4;color:#8a6a00'
  };

  // Entrance: once the table is in view, its text rains in from the right edge, row by row
  // from the top, each row's cells a beat apart from left to right. Only the text moves.
  // Plays once per visit, so later page or filter changes show their rows in place.
  var RAIN_START_PX = 200; // banner, gold rule and header row
  var RAIN_DELAY_MS = 150;
  var RAIN_ROW_STEP_MS = 110;
  var RAIN_COL_STEP_MS = 35;
  var RAIN_DURATION_MS = 900;
  var RAIN_EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

  // e.g. "14 Oct 2026"
  var formatDate = function (iso) {
    return new Date(iso + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  // idle: plain layout; waiting: text held off to the right; raining: animating
  var rain = FEED.prefersReducedMotion() || typeof IntersectionObserver === 'undefined' ? 'idle' : 'waiting';
  var rainTimer = 0;

  function rainStyle(row, col) {
    if (rain === 'idle') return '';
    if (rain === 'waiting') return 'transform:translateX(100vw);opacity:0';
    var delay = RAIN_DELAY_MS + row * RAIN_ROW_STEP_MS + col * RAIN_COL_STEP_MS;
    return 'transform:none;opacity:1;transition:transform ' + RAIN_DURATION_MS + 'ms ' + RAIN_EASE + ' ' + delay +
      'ms, opacity ' + RAIN_DURATION_MS + 'ms ease-out ' + delay + 'ms';
  }

  // An element whose style is its base style plus the rain styles for its cell
  function rainAttrs(row, col, base) {
    var style = [base, rainStyle(row, col)].filter(Boolean).join(';');
    return ' data-rain="' + row + ',' + col + '"' + (base ? ' data-base-style="' + base + '"' : '') + (style ? ' style="' + style + '"' : '');
  }

  var card = page.querySelector('.tf-fairs');
  var body = card.querySelector('.tf-fairs__body');

  var padStyle = function (col) { return COLUMNS[col].pad ? ' style="padding-left:' + COLUMNS[col].pad + 'px"' : ''; };

  function emptyHtml(scope) {
    var placeLabel = scope === 'international' ? 'Country' : 'State';
    return '<div class="tf-fairs__empty"><h3>No fairs match these filters</h3>' +
      '<p>Choose &quot;All&quot; for sector, ' + placeLabel.toLowerCase() + ' or month, or clear the filters.</p>' +
      '<button type="button" class="tf-page-btn is-current" data-action="clear-filters">Clear filters</button></div>';
  }

  function headHtml(scope) {
    var placeLabel = scope === 'international' ? 'Country' : 'State';
    return ['Sl. No.', 'Fair', 'Sector', placeLabel, 'Dates', 'Details'].map(function (label, col) {
      return '<th scope="col"' + (COLUMNS[col].pad ? '' : ' class="is-centered"') + padStyle(col) + '><div' + rainAttrs(0, col) + '>' + label + '</div></th>';
    }).join('');
  }

  function rowsHtml(rows, first) {
    return rows.map(function (fair, i) {
      var source = SOURCES[fair.source];
      var id = fair.name + '-' + fair.start;
      var seen = visitedFairs.has(id);
      var row = i + 1;
      var cell = function (col, extra) {
        return '<td class="tf-table__cell' + (extra ? ' ' + extra : '') + '"' + padStyle(col) + '>';
      };
      return '<tr' + (i % 2 ? ' class="is-odd"' : '') + '>' +
        // One continuous navy strip, rounded at its first and last row
        '<td class="tf-table__num' + (i === 0 ? ' is-first' : '') + (i === rows.length - 1 ? ' is-last' : '') + '">' +
          '<div' + rainAttrs(row, 0) + '>' + (first + i + 1) + '</div></td>' +
        cell(1) + '<div' + rainAttrs(row, 1) + '><span class="tf-table__fair-name">' + escape(fair.name) + '</span>' +
          '<span class="tf-table__fair-city">' + escape(fair.city) + '</span></div></td>' +
        cell(2) + '<span class="tf-chip"' + rainAttrs(row, 2, CHIP_COLORS[fair.sector] || CHIP_COLORS['Ministry of Commerce']) + '>' +
          escape(fair.sector) + '</span></td>' +
        cell(3, 'tf-table__text') + '<div' + rainAttrs(row, 3) + '>' + escape(fair.place) + '</div></td>' +
        cell(4, 'tf-table__text tf-table__dates') + '<div' + rainAttrs(row, 4) + '>' + formatDate(fair.start) + ' to ' + formatDate(fair.end) + '</div></td>' +
        cell(5) + '<div' + rainAttrs(row, 5) + '>' +
          '<a href="' + escape(source.url) + '" target="_blank" rel="noopener noreferrer" data-fair="' + escape(id) + '"' +
            ' data-label="' + escape('View details of ' + fair.name + ' on ' + source.name) + '"' +
            ' aria-label="' + escape('View details of ' + fair.name + ' on ' + source.name + ' (opens in a new tab' + (seen ? ', visited' : '') + ')') + '"' +
            ' class="tf-details-link' + (seen ? ' is-visited' : '') + '">View details' +
            icon('ExternalLink', { size: 14, strokeWidth: 2 }) + '</a>' +
          '<span class="tf-table__source">' + escape(source.name) + '</span></div></td>' +
      '</tr>';
    }).join('');
  }

  function pagerHtml(pages) {
    var numbers = '';
    for (var n = 1; n <= pages; n += 1) {
      numbers += '<button type="button" aria-label="Page ' + n + '" class="tf-page-btn" data-page="' + n + '">' + n + '</button>';
    }
    return '<nav aria-label="Pagination" class="tf-pager">' +
      '<button type="button" class="tf-page-btn" data-page="prev">Previous</button>' +
      '<div class="tf-pager__pages">' + numbers + '</div>' +
      '<button type="button" class="tf-page-btn" data-page="next">Next</button>' +
    '</nav>';
  }

  // The page buttons are kept and restyled, as React does, so their colour change still fades
  function updatePager(pager, current, pages) {
    pager.firstChild.disabled = current === 1;
    pager.lastChild.disabled = current === pages;
    Array.prototype.forEach.call(pager.querySelectorAll('.tf-pager__pages .tf-page-btn'), function (button, i) {
      var isCurrent = i + 1 === current;
      button.classList.toggle('is-current', isCurrent);
      if (isCurrent) button.setAttribute('aria-current', 'page');
      else button.removeAttribute('aria-current');
    });
  }

  // Renders the listing into the card body, keeping the table and pager elements when they stay
  function renderTable(scope, fairs, current) {
    if (fairs.length === 0) {
      body.innerHTML = emptyHtml(scope);
      return;
    }

    var pages = Math.max(1, Math.ceil(fairs.length / PAGE_SIZE));
    var first = (current - 1) * PAGE_SIZE;
    var rows = fairs.slice(first, first + PAGE_SIZE);
    var table = body.querySelector('.tf-table');

    if (!table) {
      // Clip the incoming text instead of showing a scrollbar for it while it rains in
      body.innerHTML = '<div class="tf-fairs__scroller' + (rain === 'idle' ? '' : ' is-raining') + '">' +
        '<table aria-labelledby="fairs-title" class="tf-table"><colgroup>' +
          COLUMNS.map(function (c) { return '<col style="width:' + c.width + '">'; }).join('') +
        '</colgroup><thead><tr>' + headHtml(scope) + '</tr></thead><tbody></tbody></table></div>';
      table = body.querySelector('.tf-table');
    } else {
      table.tHead.rows[0].cells[3].firstChild.textContent = scope === 'international' ? 'Country' : 'State';
    }
    table.tBodies[0].innerHTML = rowsHtml(rows, first);

    var pager = body.querySelector('.tf-pager');
    if (pages > 1 && (!pager || pager.querySelectorAll('.tf-pager__pages .tf-page-btn').length !== pages)) {
      if (pager) pager.remove();
      body.insertAdjacentHTML('beforeend', pagerHtml(pages));
      pager = body.querySelector('.tf-pager');
    } else if (pages <= 1 && pager) {
      pager.remove();
      pager = null;
    }
    if (pager) updatePager(pager, current, pages);
  }

  // Restyles the rendered rows for the current rain phase, in place, so the text animates
  function applyRain() {
    Array.prototype.forEach.call(body.querySelectorAll('[data-rain]'), function (el) {
      var cell = el.getAttribute('data-rain').split(',');
      var style = [el.getAttribute('data-base-style'), rainStyle(Number(cell[0]), Number(cell[1]))].filter(Boolean).join(';');
      if (style) el.setAttribute('style', style);
      else el.removeAttribute('style');
    });
    var scroller = body.querySelector('.tf-fairs__scroller');
    if (scroller) scroller.classList.toggle('is-raining', rain !== 'idle');
  }

  // Back to the plain layout once the last row has landed
  function scheduleRainEnd() {
    clearTimeout(rainTimer);
    if (rain !== 'raining') return;
    var rows = body.querySelectorAll('tbody tr').length;
    var lastStart = RAIN_DELAY_MS + rows * RAIN_ROW_STEP_MS + (COLUMNS.length - 1) * RAIN_COL_STEP_MS;
    rainTimer = setTimeout(function () {
      rain = 'idle';
      applyRain();
    }, lastStart + RAIN_DURATION_MS);
  }

  // Rain as soon as the banner and the header row are on screen
  if (rain === 'waiting') {
    var rainObserver = new IntersectionObserver(function (entries) {
      var entry = entries[0];
      var needed = Math.min(entry.boundingClientRect.height, RAIN_START_PX);
      if (!entry.isIntersecting || entry.intersectionRect.height < needed) return;
      rainObserver.disconnect();
      rain = 'raining';
      applyRain();
      scheduleRainEnd();
    }, { threshold: Array.from({ length: 41 }, function (_, i) { return i / 40; }) });
    rainObserver.observe(card);
  }

  /* ------------------------------------------------------- page state */

  var state = { scope: 'international', filters: emptyFilters(), page: 1 };

  var scopeButtons = page.querySelectorAll('.tf-scope__option');
  var placeLabel = page.querySelector('label[for="filter-place"]');
  var nameInput = document.getElementById('filter-name');
  var datalist = document.getElementById('fair-names');
  var scopeTitle = card.querySelector('.tf-fairs__scope');
  var scopeTab = card.querySelector('.tf-fairs__tab');

  var setFilter = function (key) {
    return function (value) {
      state.filters[key] = value;
      state.page = 1;
      render();
    };
  };

  var dropdowns = {
    sector: new FilterDropdown('filter-sector', setFilter('sector')),
    place: new FilterDropdown('filter-place', setFilter('place')),
    year: new FilterDropdown('filter-year', setFilter('year')),
    month: new FilterDropdown('filter-month', setFilter('month'))
  };

  function clearFilters() {
    state.filters = emptyFilters();
    state.page = 1;
    render();
  }

  // Country/State options depend on the scope, so switching starts from a clean filter set
  function changeScope(next) {
    if (next === state.scope) return;
    state.scope = next;
    state.filters = emptyFilters();
    state.page = 1;
    render();
    datalist.innerHTML = FAIR_NAMES[next].map(function (name) { return '<option value="' + escape(name) + '"></option>'; }).join('');
  }

  function render() {
    var scope = state.scope;
    var f = state.filters;
    var scopeLabel = scope === 'international' ? 'International' : 'National';

    Array.prototype.forEach.call(scopeButtons, function (button) {
      var active = button.classList.contains('tf-scope__option--' + scope);
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });

    placeLabel.textContent = scope === 'international' ? 'Country' : 'State';
    dropdowns.sector.set(f.sector, SECTOR_OPTIONS);
    dropdowns.place.set(f.place, PLACES[scope]);
    dropdowns.year.set(f.year, YEARS);
    dropdowns.month.set(f.month, DATA.MONTHS);
    if (nameInput.value !== f.name) nameInput.value = f.name;

    var fairs = filterFairs(scope, f);
    var pages = Math.max(1, Math.ceil(fairs.length / PAGE_SIZE));
    scopeTitle.textContent = scopeLabel;
    scopeTab.textContent = scopeLabel + ' Trade Fairs';
    state.page = Math.min(state.page, pages);
    renderTable(scope, fairs, state.page);
    if (rain === 'raining') scheduleRainEnd();
  }

  Array.prototype.forEach.call(scopeButtons, function (button) {
    button.addEventListener('click', function () {
      changeScope(button.classList.contains('tf-scope__option--national') ? 'national' : 'international');
    });
  });

  nameInput.addEventListener('input', function () { setFilter('name')(nameInput.value); });
  page.querySelector('.tf-clear').addEventListener('click', clearFilters);

  body.addEventListener('click', function (event) {
    if (event.target.closest('[data-action="clear-filters"]')) {
      clearFilters();
      return;
    }
    var pageButton = event.target.closest('[data-page]');
    if (pageButton && !pageButton.disabled) {
      var target = pageButton.getAttribute('data-page');
      state.page = target === 'prev' ? state.page - 1 : target === 'next' ? state.page + 1 : Number(target);
      render();
      card.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    var link = event.target.closest('.tf-details-link');
    if (link) visitedFairs.mark(link.getAttribute('data-fair'));
  });

  // Middle click opens the link in a new tab too
  body.addEventListener('auxclick', function (event) {
    var link = event.target.closest('.tf-details-link');
    if (link && event.button === 1) visitedFairs.mark(link.getAttribute('data-fair'));
  });

  // "View details" turns purple once this person has opened that fair's link
  var visitedFairs = new VisitedLinks('visited-fairs', function () {
    Array.prototype.forEach.call(body.querySelectorAll('.tf-details-link'), function (link) {
      var seen = visitedFairs.has(link.getAttribute('data-fair'));
      link.classList.toggle('is-visited', seen);
      link.setAttribute('aria-label', link.getAttribute('data-label') + ' (opens in a new tab' + (seen ? ', visited' : '') + ')');
    });
  });

  // Build the listing afresh (rather than reuse the first render in the HTML) so every cell,
  // the header row included, takes part in the entrance
  body.innerHTML = '';
  render();
  applyRain();

  /* -------------------------------------------------- official sources */

  var BADGE_COUNT = Object.keys(SOURCES).length;
  var STACK_TILT = [-2, 3, -4, 2, -3, 4, -1];
  var DEAL_DELAY_MS = 250;
  var DEAL_STEP_MS = 170;
  var DEAL_DURATION_MS = 750;

  var sourcesList = page.querySelector('.tf-sources__list');
  var sourceItems = Array.prototype.slice.call(sourcesList.querySelectorAll('.tf-sources__item'));
  var sourceUrls = Object.keys(SOURCES).map(function (key) { return SOURCES[key].url; });

  var visitedSources = new VisitedLinks('visited-sources', updateSourceLinks);

  function updateSourceLinks() {
    sourceItems.forEach(function (item, i) {
      var link = item.querySelector('.tf-source-card__link');
      var name = item.querySelector('.tf-source-card__name').textContent;
      var seen = visitedSources.has(sourceUrls[i]);
      link.classList.toggle('is-visited', seen);
      link.setAttribute('aria-label', 'View details on ' + name + ' (opens in a new tab' + (seen ? ', visited' : '') + ')');
    });
  }

  sourceItems.forEach(function (item, i) {
    var link = item.querySelector('.tf-source-card__link');
    link.addEventListener('click', function () { visitedSources.mark(sourceUrls[i]); });
    link.addEventListener('auxclick', function (event) { if (event.button === 1) visitedSources.mark(sourceUrls[i]); });
  });
  updateSourceLinks();

  // Entrance: the cards wait in a loose stack, then deal out one by one (in listing order)
  // to their places once the list is in view.
  // idle: plain layout; stacked: waiting; dealing: animating
  var phase = FEED.prefersReducedMotion() || typeof IntersectionObserver === 'undefined' ? 'idle' : 'stacked';
  var stack = [];
  var landed = 0;

  // Offset from each card's own place to the stack point. offsetLeft/Top ignore transforms,
  // so this can re-run while the cards are stacked
  function measure() {
    var wide = window.matchMedia('(min-width: 1024px)').matches;
    var x = sourcesList.clientWidth / 2;
    var first = sourceItems[0];
    var y = wide ? sourcesList.clientHeight / 2 : first.offsetTop + first.offsetHeight / 2;
    stack = sourceItems.map(function (el, i) {
      return {
        x: x - (el.offsetLeft + el.offsetWidth / 2),
        y: y - (el.offsetTop + el.offsetHeight / 2) + i * 4,
        tilt: STACK_TILT[i % STACK_TILT.length]
      };
    });
    applyDeal();
  }

  function applyDeal() {
    sourceItems.forEach(function (el, i) {
      var offset = stack[i];
      if (phase === 'idle' || !offset || i < landed) {
        el.removeAttribute('style');
        return;
      }
      // Cards still in the stack, or in flight, ride above the ones already placed; the top card goes first
      var zIndex = 10 + BADGE_COUNT - i;
      if (phase === 'stacked') {
        el.setAttribute('style', 'transform:translate(' + offset.x + 'px, ' + offset.y + 'px) rotate(' + offset.tilt + 'deg);z-index:' + zIndex);
      } else {
        el.setAttribute('style', 'transform:none;transition:transform ' + DEAL_DURATION_MS + 'ms cubic-bezier(0.22, 1, 0.36, 1) ' +
          (DEAL_DELAY_MS + i * DEAL_STEP_MS) + 'ms;z-index:' + zIndex);
      }
    });
  }

  sourceItems.forEach(function (el, i) {
    el.addEventListener('transitionend', function (event) {
      if (event.target === el && event.propertyName === 'transform') {
        landed = Math.max(landed, i + 1);
        applyDeal();
      }
    });
  });

  if (phase === 'stacked') {
    // Stack before the first paint so the cards never flash in their final places
    measure();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { if (phase === 'stacked') measure(); });
    var onResize = function () { measure(); };
    window.addEventListener('resize', onResize);

    // Deal once most of the list (or most of the screen, for the tall single column) is in view
    var dealObserver = new IntersectionObserver(function (entries) {
      var entry = entries[0];
      var needed = Math.min(entry.boundingClientRect.height, window.innerHeight) * 0.6;
      if (!entry.isIntersecting || entry.intersectionRect.height < needed) return;
      dealObserver.disconnect();
      window.removeEventListener('resize', onResize);
      phase = 'dealing';
      applyDeal();
    }, { threshold: Array.from({ length: 21 }, function (_, i) { return i / 20; }) });
    dealObserver.observe(sourcesList);
  }
})(window.FEED);
