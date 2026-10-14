/*
 * Know Your Schemes page (converted from src/pages/know-your-schemes/*): choose Central or a
 * State, then a ministry / department, and browse its schemes; each card opens a details dialog.
 * The page's first render is in know-your-schemes.html; this script keeps it up to date.
 */
(function (FEED) {
  'use strict';

  var pageEl = document.querySelector('.kys-page');
  if (!pageEl) return;

  var icon = FEED.icon;
  var escape = FEED.escape;
  var schemeIcons = FEED.schemeIcons;
  var DATA = FEED.data.schemes;

  /* ------------------------------------------------------------ data */

  var countSchemes = function (groups) {
    return groups.reduce(function (n, g) { return n + g.schemes.length; }, 0);
  };
  var schemesLabel = function (n) { return n + ' ' + (n === 1 ? 'scheme' : 'schemes'); };
  var withPlace = function (group, place) {
    var copy = {};
    Object.keys(group).forEach(function (key) { copy[key] = group[key]; });
    copy.place = place;
    return copy;
  };

  // What step 2 offers: the central ministries, or the departments of the chosen state (most
  // states have none listed yet). `place` heads the results ("Schemes for <place> -> <name>").
  var CENTRAL_GROUPS = DATA.CENTRAL_MINISTRIES.map(function (m) { return withPlace(m, 'Central Government'); });
  var STATE_GROUPS = {};
  DATA.INDIAN_STATES.forEach(function (s) {
    var listed = DATA.STATES.filter(function (st) { return st.id === s.id; })[0];
    STATE_GROUPS[s.id] = ((listed && listed.depts) || []).map(function (d) { return withPlace(d, s.name + ' Government'); });
  });
  var groupsFor = function (level, stateId) { return level === 'central' ? CENTRAL_GROUPS : STATE_GROUPS[stateId]; };
  var stateName = function (stateId) {
    return DATA.INDIAN_STATES.filter(function (s) { return s.id === stateId; })[0].name;
  };

  var DEFAULT_STATE = 'AP';
  var MYSCHEME_SEARCH = 'https://www.myscheme.gov.in/search';

  var allStateGroups = [];
  Object.keys(STATE_GROUPS).forEach(function (id) { allStateGroups = allStateGroups.concat(STATE_GROUPS[id]); });

  // Options of the step dropdowns, each a title over a hint (the dropdown lists them A-Z)
  var LEVEL_OPTIONS = [
    {
      value: 'central',
      label: 'Central Government',
      hint: DATA.CENTRAL_MINISTRIES.length + ' ministries & bodies · ' + schemesLabel(countSchemes(DATA.CENTRAL_MINISTRIES))
    },
    {
      value: 'state',
      label: 'State Government',
      hint: DATA.INDIAN_STATES.length + ' states · ' + schemesLabel(countSchemes(allStateGroups))
    }
  ];

  var STATE_OPTIONS = DATA.INDIAN_STATES.map(function (s) {
    var depts = STATE_GROUPS[s.id];
    return {
      value: s.id,
      label: s.name,
      hint: depts.length ? depts.length + ' departments · ' + schemesLabel(countSchemes(depts)) : 'No schemes listed yet'
    };
  });

  var groupOption = function (g) {
    return { value: g.id, label: g.name, hint: [g.abbr, schemesLabel(g.schemes.length)].filter(Boolean).join(' · ') };
  };

  // Detail rows of the "View Details" dialog, shown when the scheme has the field
  var SCHEME_FACTS = [
    ['benefit', 'Benefits'],
    ['who', 'Who can apply'],
    ['nodal', 'Nodal agency'],
    ['stacks', 'Combines with']
  ];

  var hostOf = function (url) {
    try {
      return new URL(url).hostname.replace(/^www\./, '');
    } catch (e) {
      return url;
    }
  };

  // A scheme names its card icon (`icon`). One without gets the icon of the first rule its name
  // matches, then its type, so the more specific rules come first.
  var FALLBACK = [
    [/insurance|bima|aarogyasri|pmjay/i, 'cropInsurance'],
    [/guarantee/i, 'creditShield'],
    [/fisher|matsya/i, 'fish'],
    [/dairy|milk/i, 'milkCan'],
    [/livestock|animal|gokul|veterinar/i, 'livestock'],
    [/irrigat|per drop|water|borewell|farm pond/i, 'dripIrrigation'],
    [/solar|kusum|surya/i, 'solarPump'],
    [/biogas|\bcbg\b|satat/i, 'biogas'],
    [/mechani|tractor/i, 'tractor'],
    [/drone/i, 'drone'],
    [/organic|natural farming/i, 'organic'],
    [/horticult|fruit/i, 'horticulture'],
    [/cold chain|cold storage/i, 'coldChain'],
    [/export|apeda|exim/i, 'globeExport'],
    [/digital|broadband|computeris|online/i, 'digitalFarm'],
    [/certif|licen[cs]e|quality|standard/i, 'qualityBadge'],
    [/\bfpo\b|farmer producer/i, 'farmerGroup'],
    [/startup|start-up|innovation/i, 'startupRocket'],
    [/train|skill|kaushal|apprentice|education/i, 'skillTraining'],
    [/women|mahila|didi|\bshg\b/i, 'womenSHG'],
    [/loan|credit|\bkcc\b|mudra|bank|financ/i, 'moneyBag'],
    [/food|process|agro/i, 'agroFactory'],
    [/market|trade|\bgem\b|\bondc\b/i, 'govMarketplace'],
    [/awaas|housing|\bpmay\b/i, 'ruralHouse'],
    [/property|svamitva|land/i, 'propertyCard'],
    [/\bdbt\b|kisan|income|bharosa/i, 'dbtTransfer']
  ];

  /** The card artwork for a scheme: { icon, tone }, tone being the card colour that suits the icon. */
  function schemeTheme(scheme) {
    var name = scheme.icon;
    if (!schemeIcons.has(name)) {
      var match = function (field) {
        return FALLBACK.filter(function (rule) { return rule[0].test(field); })[0];
      };
      var rule = match(scheme.name) || match(scheme.type);
      name = rule ? rule[1] : schemeIcons.DEFAULT_ICON;
    }
    return { icon: name, tone: schemeIcons.tone(name) };
  }

  /* ------------------------------------------------------ step dropdown */

  var MENU_MAX_HEIGHT = 380;
  var MENU_MIN_HEIGHT = 150;
  var VIEWPORT_GAP = 12;
  var NAVBAR_CLEARANCE = 92; // the fixed navbar covers the top of the viewport
  var PAGE_STEP = 8;
  var TYPEAHEAD_RESET_MS = 600;

  var isPrintableKey = function (e) { return e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey; };
  var byLabel = function (a, b) { return a.label.localeCompare(b.label, 'en', { sensitivity: 'base', numeric: true }); };

  // Nearly every ministry starts with "Ministry of", so typing also matches the name after it
  var typeaheadKeys = function (label) {
    var name = label.toLowerCase();
    return [name, name.replace(/^ministry of (the )?/, '')];
  };

  /*
   * Select-only combobox (WAI-ARIA APG pattern) drawn like the step cards: each option is a bold
   * title over a muted hint. Focus stays on the trigger; the highlighted option is announced
   * through aria-activedescendant. Options are always listed A-Z.
   * config: id, labelledBy or label, placeholder, className, onChange
   */
  function StepDropdown(config) {
    var id = config.id;
    var listId = id + '-list';
    var optionId = function (i) { return id + '-opt-' + i; };
    var nameAttrs = config.labelledBy
      ? ' aria-labelledby="' + config.labelledBy + '"'
      : ' aria-label="' + escape(config.label) + '"';

    var options = [];
    var value = null;
    var open = false;
    var active = 0;
    var typeahead = { text: '', timer: 0 };

    var root = document.createElement('div');
    root.innerHTML =
      '<div id="' + id + '" class="kys-dd-trigger" role="combobox" tabindex="0"' + nameAttrs +
        ' aria-haspopup="listbox" aria-expanded="false" aria-controls="' + listId + '">' +
        '<span class="kys-dd-value"></span>' +
        '<span class="kys-dd-chevron" aria-hidden="true">' + icon('ChevronDown', { strokeWidth: 2.6 }) + '</span>' +
      '</div>' +
      '<div class="kys-dd-menu" hidden>' +
        '<div id="' + listId + '" class="kys-dd-list" role="listbox"' + nameAttrs + '></div>' +
      '</div>';
    var trigger = root.firstChild;
    var valueEl = trigger.firstChild;
    var menu = root.lastChild;
    var list = menu.firstChild;

    var disabled = function () { return options.length === 0; };
    var selectedIndex = function () {
      for (var i = 0; i < options.length; i += 1) if (options[i].value === value) return i;
      return 0;
    };
    var last = function () { return options.length - 1; };

    function renderTrigger() {
      root.className = ('kys-dd' + (open ? ' is-open' : '') + (disabled() ? ' is-disabled' : '') + ' ' + (config.className || '')).trim();
      valueEl.textContent = disabled() ? config.placeholder : options[selectedIndex()].label;
      trigger.setAttribute('aria-expanded', String(open));
      if (open) trigger.setAttribute('aria-activedescendant', optionId(active));
      else trigger.removeAttribute('aria-activedescendant');
      if (disabled()) trigger.setAttribute('aria-disabled', 'true');
      else trigger.removeAttribute('aria-disabled');
      menu.hidden = !open;
    }

    function renderOptions() {
      var selected = selectedIndex();
      list.innerHTML = options.map(function (option, i) {
        var isSelected = i === selected;
        return '<div id="' + optionId(i) + '" role="option" aria-selected="' + isSelected + '" class="kys-dd-option' + (i === active ? ' is-active' : '') + '">' +
          '<span class="kys-dd-text"><span class="kys-dd-label">' + escape(option.label) + '</span>' +
            (option.hint ? '<span class="kys-dd-hint">' + escape(option.hint) + '</span>' : '') + '</span>' +
          (isSelected ? '<span class="kys-dd-check" aria-hidden="true">' + icon('Check', { strokeWidth: 3.2 }) + '</span>' : '') +
        '</div>';
      }).join('');
    }

    // Keep the highlighted option in view while moving through the list
    function setActive(index) {
      active = index;
      Array.prototype.forEach.call(list.children, function (el, i) { el.classList.toggle('is-active', i === active); });
      renderTrigger();
      if (!open) return;
      var el = document.getElementById(optionId(active));
      if (!el) return;
      if (el.offsetTop < list.scrollTop) {
        list.scrollTop = el.offsetTop - VIEWPORT_GAP;
      } else if (el.offsetTop + el.offsetHeight > list.scrollTop + list.clientHeight) {
        list.scrollTop = el.offsetTop + el.offsetHeight - list.clientHeight + VIEWPORT_GAP;
      }
    }

    function onOutside(e) {
      if (!root.contains(e.target)) setOpen(false);
    }

    function setOpen(next) {
      if (next === open) return;
      open = next;
      if (open) document.addEventListener('pointerdown', onOutside);
      else document.removeEventListener('pointerdown', onOutside);
      renderTrigger();
      if (!open) return;

      // Drop down, or up when the list does not fit below and there is more room above,
      // capped to that room; then centre the selected option in the list
      var rect = trigger.getBoundingClientRect();
      var below = window.innerHeight - rect.bottom - VIEWPORT_GAP;
      var above = rect.top - NAVBAR_CLEARANCE - VIEWPORT_GAP;
      var up = Math.min(list.scrollHeight, MENU_MAX_HEIGHT) > below && above > below;
      menu.setAttribute('data-placement', up ? 'up' : 'down');
      list.style.maxHeight = Math.max(MENU_MIN_HEIGHT, Math.min(MENU_MAX_HEIGHT, up ? above : below)) + 'px';
      var current = list.querySelector('[aria-selected="true"]');
      if (current) list.scrollTop = current.offsetTop - (list.clientHeight - current.offsetHeight) / 2;
      setActive(active);
    }

    function openMenu(index) {
      active = index === undefined ? selectedIndex() : index;
      renderOptions();
      setOpen(true);
    }

    function commit(index) {
      setOpen(false);
      if (options[index].value !== value) config.onChange(options[index].value);
    }

    // Typed letters jump to the next option starting with them; repeating one letter cycles through the matches
    function findByTypeahead(ch, from) {
      clearTimeout(typeahead.timer);
      typeahead.text += ch.toLowerCase();
      typeahead.timer = setTimeout(function () { typeahead.text = ''; }, TYPEAHEAD_RESET_MS);
      var text = typeahead.text;
      var cycling = text.split('').every(function (c) { return c === text[0]; });
      var query = cycling ? text[0] : text;
      var start = cycling ? from + 1 : from;
      for (var k = 0; k < options.length; k += 1) {
        var i = (start + k) % options.length;
        if (typeaheadKeys(options[i].label).some(function (key) { return key.indexOf(query) === 0; })) return i;
      }
      return -1;
    }

    trigger.addEventListener('click', function () {
      if (disabled()) return;
      if (open) setOpen(false);
      else openMenu();
    });

    trigger.addEventListener('keydown', function (e) {
      if (disabled()) return;
      var typing = typeahead.text !== '';
      var i;
      if (!open) {
        if (['ArrowDown', 'ArrowUp', 'Enter', ' '].indexOf(e.key) !== -1) openMenu();
        else if (e.key === 'Home') openMenu(0);
        else if (e.key === 'End') openMenu(last());
        else if (isPrintableKey(e)) {
          i = findByTypeahead(e.key, selectedIndex());
          if (i >= 0) openMenu(i);
        } else return;
        e.preventDefault();
        return;
      }
      switch (e.key) {
        case 'ArrowDown':
          if (e.altKey) commit(active);
          else setActive(Math.min(last(), active + 1));
          break;
        case 'ArrowUp':
          if (e.altKey) commit(active);
          else setActive(Math.max(0, active - 1));
          break;
        case 'Home': setActive(0); break;
        case 'End': setActive(last()); break;
        case 'PageDown': setActive(Math.min(last(), active + PAGE_STEP)); break;
        case 'PageUp': setActive(Math.max(0, active - PAGE_STEP)); break;
        case 'Escape': setOpen(false); break;
        case 'Tab': commit(active); return; // let focus move on
        case 'Enter': commit(active); break;
        case ' ':
          if (!typing) {
            commit(active);
            break;
          }
        // falls through: a space inside a typed search is part of it
        default:
          if (!isPrintableKey(e)) return;
          i = findByTypeahead(e.key, active);
          if (i >= 0) setActive(i);
      }
      e.preventDefault();
    });

    trigger.addEventListener('blur', function (e) {
      if (!root.contains(e.relatedTarget)) setOpen(false);
    });

    // mousedown would move focus off the trigger; keep it there so the keys keep working
    menu.addEventListener('mousedown', function (e) { e.preventDefault(); });
    list.addEventListener('click', function (e) {
      var option = e.target.closest('[role="option"]');
      if (option) commit(Array.prototype.indexOf.call(list.children, option));
    });
    list.addEventListener('mousemove', function (e) {
      var option = e.target.closest('[role="option"]');
      var i = option ? Array.prototype.indexOf.call(list.children, option) : -1;
      if (i >= 0 && i !== active) setActive(i);
    });

    // The highlighted option starts on the selected one, then stays where it was last moved to
    // (opening the menu moves it back to the selected option)
    var initialised = false;
    this.el = root;
    this.reset = function () { initialised = false; };
    this.set = function (nextValue, nextOptions) {
      value = nextValue;
      options = nextOptions.slice().sort(byLabel);
      if (!initialised) {
        active = selectedIndex();
        initialised = true;
      }
      renderOptions();
      renderTrigger();
    };
  }

  /* --------------------------------------------------------- page state */

  var state = {
    level: 'central',
    stateId: DEFAULT_STATE,
    groupId: CENTRAL_GROUPS[0].id,
    openScheme: null
  };

  // A new level or state starts on its first ministry / department, when it has any
  var firstGroupOf = function (level, stateId) {
    var groups = groupsFor(level, stateId);
    return groups.length ? groups[0].id : null;
  };

  var levelDropdown = new StepDropdown({
    id: 'kys-level',
    labelledBy: 'kys-level-label',
    onChange: function (level) {
      state.level = level;
      state.groupId = firstGroupOf(level, state.stateId);
      render();
    }
  });
  var stateDropdown = new StepDropdown({
    id: 'kys-state',
    label: 'State',
    className: 'kys-dd--sub',
    onChange: function (stateId) {
      state.stateId = stateId;
      state.groupId = firstGroupOf('state', stateId);
      render();
    }
  });
  var groupDropdown = new StepDropdown({
    id: 'kys-group',
    labelledBy: 'kys-group-label',
    placeholder: 'No departments listed yet',
    onChange: function (groupId) {
      state.groupId = groupId;
      render();
    }
  });

  // Swap the first render's dropdowns for the working ones
  var levelCard = pageEl.querySelector('.kys-step--green .kys-step-card');
  var groupCard = pageEl.querySelector('.kys-step--blue .kys-step-card');
  levelCard.querySelector('.kys-dd').replaceWith(levelDropdown.el);
  groupCard.querySelector('.kys-dd').replaceWith(groupDropdown.el);

  var countNum = pageEl.querySelector('.kys-step-count-num');
  var schemesSection = pageEl.querySelector('.kys-schemes');
  var schemesTitle = schemesSection.querySelector('.kys-schemes-title');
  var dialog = pageEl.querySelector('.kys-dialog');

  function currentGroup() {
    var groups = groupsFor(state.level, state.stateId);
    return groups.filter(function (g) { return g.id === state.groupId; })[0]; // none for a state with no departments yet
  }

  // Laid out like the Loans & Finance "Explore your finance needs" cards; the whole card opens the details dialog
  function schemeCardHtml(scheme, index) {
    var theme = schemeTheme(scheme);
    return '<li class="kys-scheme kys-tone--' + theme.tone + '">' +
      '<div class="kys-scheme-media">' + schemeIcons.svg(theme.icon, 'kys-scheme-art') + '</div>' +
      '<div class="kys-scheme-body">' +
        '<h3 class="kys-scheme-title">' + escape(scheme.name) + '</h3>' +
        '<p class="kys-scheme-desc">' + escape(scheme.benefit) + '</p>' +
        (scheme.type ? '<span class="kys-scheme-tag"><span class="kys-scheme-tag-text">' + escape(scheme.type) + '</span></span>' : '') +
      '</div>' +
      '<button type="button" class="kys-scheme-open" aria-haspopup="dialog" aria-label="' + escape('View details: ' + scheme.name) + '" data-scheme="' + index + '"></button>' +
    '</li>';
  }

  function render() {
    var group = currentGroup();
    var groups = groupsFor(state.level, state.stateId);
    var place = state.level === 'central' ? 'Central Government' : stateName(state.stateId) + ' Government';
    var schemeCount = group ? group.schemes.length : 0;

    // Step 1: level, and the state when it is the state level
    levelDropdown.set(state.level, LEVEL_OPTIONS);
    if (state.level === 'state') {
      if (!stateDropdown.el.parentNode) stateDropdown.reset(); // shown afresh, as React mounts it anew
      stateDropdown.set(state.stateId, STATE_OPTIONS);
      if (!stateDropdown.el.parentNode) levelDropdown.el.after(stateDropdown.el);
    } else if (stateDropdown.el.parentNode) {
      stateDropdown.el.remove();
    }

    // Step 2 and the count in step 3
    groupDropdown.set(state.groupId, groups.map(groupOption));
    countNum.textContent = schemeCount;
    countNum.nextSibling.textContent = schemeCount === 1 ? 'Scheme found' : 'Schemes found';

    // The schemes of the selected ministry / department
    schemesTitle.innerHTML = '<span>Schemes for</span> <span class="kys-schemes-place">' + escape(place) + '</span>' +
      (group ? ' ' + icon('ArrowRight', { strokeWidth: 2.4, className: 'kys-schemes-sep' }) + ' <span class="kys-schemes-place">' + escape(group.name) + '</span>' : '');

    var listing = schemesSection.querySelector('.kys-scheme-grid, .kys-schemes-empty');
    var html;
    if (group) {
      html = '<ul class="kys-scheme-grid">' + group.schemes.map(schemeCardHtml).join('') + '</ul>';
    } else {
      var name = escape(stateName(state.stateId));
      html = '<div class="kys-schemes-empty">' +
        '<h3 class="kys-schemes-empty-title">' + name + ' schemes are coming soon</h3>' +
        '<p class="kys-schemes-empty-text">We haven’t listed ' + name + ' Government departments and schemes yet. Meanwhile, ' +
          'you can find them on myScheme, the Government of India’s scheme finder.</p>' +
        '<a class="kys-dialog-apply" href="' + MYSCHEME_SEARCH + '" target="_blank" rel="noopener noreferrer">Search on myScheme ' +
          icon('ExternalLink', { strokeWidth: 2.4 }) + '</a>' +
      '</div>';
    }
    var next = document.createElement('div');
    next.innerHTML = html;
    listing.replaceWith(next.firstChild);
  }

  /* ------------------------------------------------------ details dialog */

  // Native modal <dialog>: it traps focus, closes on Esc and hands focus back by itself.
  // A click on the backdrop lands on the <dialog> element itself, so that closes it too.
  function openDetails(scheme, group) {
    var theme = schemeTheme(scheme);
    // Only the guidelines landing page (the scheme's, else its ministry's); blank rows get no link
    var website = scheme.landing || group.landing;
    var facts = SCHEME_FACTS.filter(function (fact) { return scheme[fact[0]]; }).map(function (fact) {
      return '<div><dt>' + fact[1] + '</dt><dd>' + escape(scheme[fact[0]]) + '</dd></div>';
    }).join('');

    dialog.innerHTML =
      '<div class="kys-dialog-inner kys-tone--' + theme.tone + '">' +
        '<div class="kys-scheme-media kys-dialog-media">' + schemeIcons.svg(theme.icon, 'kys-scheme-art') + '</div>' +
        '<button type="button" class="kys-dialog-close" aria-label="Close">' + icon('X', { strokeWidth: 2.4 }) + '</button>' +
        '<div class="kys-dialog-body">' +
          '<p class="kys-dialog-place">' + escape(group.place) + ' · ' + escape(group.name) + '</p>' +
          '<h2 id="kys-dialog-title" class="kys-dialog-title">' + escape(scheme.name) + '</h2>' +
          (scheme.type && scheme.type !== 'State scheme' ? '<span class="kys-dialog-type">' + escape(scheme.type) + '</span>' : '') +
          '<dl class="kys-dialog-facts">' + facts + '</dl>' +
          (website
            ? '<div class="kys-dialog-foot"><a class="kys-dialog-apply" href="' + escape(website) + '" target="_blank" rel="noopener noreferrer">' +
                'Visit official website ' + icon('ExternalLink', { strokeWidth: 2.4 }) + '</a>' +
                '<span class="kys-dialog-host">' + escape(hostOf(website)) + '</span></div>'
            : '<p class="kys-dialog-foot kys-dialog-nolink">Official website link not available yet.</p>') +
          '<p class="kys-dialog-note">Rates, limits and deadlines change, so confirm ' +
            (website ? 'on the official website' : 'with the nodal agency') + ' before applying.</p>' +
        '</div>' +
      '</div>';
    state.openScheme = scheme;
    dialog.showModal();
  }

  schemesSection.addEventListener('click', function (event) {
    var button = event.target.closest('.kys-scheme-open');
    if (!button) return;
    var group = currentGroup();
    openDetails(group.schemes[Number(button.getAttribute('data-scheme'))], group);
  });

  dialog.addEventListener('click', function (event) {
    if (event.target === dialog || event.target.closest('.kys-dialog-close')) dialog.close();
  });

  dialog.addEventListener('close', function () {
    state.openScheme = null;
    dialog.innerHTML = '';
  });

  /* ------------------------------------------------------- other buttons */

  pageEl.querySelector('.kys-back-btn').addEventListener('click', function () { FEED.navigate('home'); });

  pageEl.querySelector('.kys-eligibility-btn').addEventListener('click', function () {
    window.open('https://www.myscheme.gov.in/', '_blank', 'noopener,noreferrer');
  });

  render();
})(window.FEED);
