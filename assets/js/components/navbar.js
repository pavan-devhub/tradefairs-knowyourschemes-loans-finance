/*
 * Site navbar (converted from src/components/Navbar.jsx and NotificationBell.jsx).
 * The bar itself is in each page's HTML; this script adds what it opens - the Services mega
 * menu, the mobile drawer and the notifications panel - plus auto-hide on scroll.
 *
 * Shown as a visitor who isn't logged in. Destinations that aren't part of this site
 * (Login, FPO, Exports, other services...) do nothing when clicked.
 */
(function (FEED) {
  'use strict';

  var nav = document.querySelector('.fw-nav-root');
  if (!nav) return;

  var icon = FEED.icon;
  var escape = FEED.escape;

  var SERVICES = [
    { name: 'KRUSHI YEVA JAYATE', num: '01', color: 'green', img: 'icon-krushi-yeva-jayate.png' },
    { name: 'YUVA KRUSHI', num: '02', color: 'green-light', img: 'icon-yuva-krushi.svg' },
    { name: 'MY ORG', num: '03', color: 'blue', img: 'icon-buyers-connection.avif' },
    { name: 'MY EXPORTS', num: '04', color: 'teal', img: 'icon-country-selection.avif' },
    { name: 'LOANS & FINANCE', num: '05', color: 'yellow', img: 'icon-finance.avif' },
    { name: 'PRODUCT 360', num: '06', color: 'orange', img: 'icon-product-selection.avif' },
    { name: 'MY BUSINESS', num: '07', color: 'purple', img: 'icon-process-order.avif' },
    { name: 'MY EDUCATION', num: '08', color: 'pink', img: 'icon-documentation.avif' },
    { name: 'FEED WORLD', num: '09', color: 'blue-light', img: 'icon-why-exports.avif' },
    { name: 'EPM', num: '10', color: 'green-light', img: 'icon-start-exports.avif' },
    { name: 'TRADE FAIRS', num: '11', color: 'orange-light', img: 'icon-trade-updates.avif' },
    { name: 'SAFE MISSION', num: '12', color: 'teal', img: 'icon-policies.avif' },
    { name: 'MY TOOLS', num: '13', color: 'purple-light', img: 'icon-tools-services.avif' },
    { name: 'KNOW YOUR SCHEMES', num: '14', color: 'yellow', img: 'icon-policies.avif' },
    { name: 'MY MARKET', num: '15', color: 'orange', img: 'icon-product-selection.avif' },
    { name: 'FEED CARD', num: '16', color: 'blue', img: 'icon-tariffs.avif' }
  ];

  // Which tile opens which page (as in the React app); tiles with no entry are inert.
  var SERVICE_ROUTES = {
    'PRODUCT 360': 'product360',
    'MY EXPORTS': 'exports',
    'LOANS & FINANCE': 'loans-finance',
    'MY TOOLS': 'tools',
    'MY BUSINESS': 'mybusiness',
    'FEED WORLD': 'feedworld',
    'EPM': 'epm',
    'TRADE FAIRS': 'TradeFairs',
    'SAFE MISSION': 'safe-mission',
    'KNOW YOUR SCHEMES': 'schemes'
  };

  // In the same order as the bar's buttons
  var NAV_ITEMS = [
    { id: 'home', label: 'Home', icon: 'Home', route: 'home', chip: { bg: '#fff7ed', fg: '#ea580c' } },
    { id: 'about', label: 'About Us', icon: 'Building2', hasDropdown: true, chip: { bg: '#fff7ed', fg: '#ea580c' } },
    { id: 'services', label: 'Services', icon: 'Settings', hasDropdown: true, chip: { bg: '#fef9c3', fg: '#ca8a04' } },
    { id: 'events', label: 'Events & Updates', icon: 'Calendar', chip: { bg: '#fef9c3', fg: '#ca8a04' } },
    { id: 'roadmap', label: 'Export Road Map', icon: 'Map', chip: { bg: '#ecfccb', fg: '#65a30d' } },
    { id: 'how', label: 'How Feed Works', icon: 'Activity', route: 'how', chip: { bg: '#f0fdf4', fg: '#16a34a' } },
    { id: 'fpo', label: 'FPO', icon: 'Users', route: 'fpo', chip: { bg: '#f0fdf4', fg: '#16a34a' } },
    { id: 'exports', label: 'Exports', icon: 'Package', route: 'exports', chip: { bg: '#f0fdf4', fg: '#15803d' } },
    { id: 'contact', label: 'Contact Us', icon: 'PhoneCall', route: 'contact', chip: { bg: '#f0fdf4', fg: '#15803d' } }
  ];

  var serviceImage = function (file) { return FEED.url('assets/images/services/' + file); };
  var logoSrc = FEED.url('assets/images/brand/dashboard-logo.avif');

  var state = { servicesOpen: false, mobileOpen: false, mobileServicesOpen: false, bellOpen: false, navHidden: false };
  var lastScrollY = 0;

  var navButtons = nav.querySelectorAll('.fw-navbar-links > .fw-nav-item');
  var servicesItem = navButtons[2];
  var servicesButton = servicesItem.querySelector('.fw-nav-btn');
  var hamburger = nav.querySelector('.fw-hamburger');
  var bellWrap = nav.querySelector('.nb-wrap');
  var bellButton = bellWrap.querySelector('.nb-bell');

  var overlay = null;
  var mobileBackdrop = null;
  var mobilePanel = null;

  function toElement(html) {
    var template = document.createElement('template');
    template.innerHTML = html.trim();
    return template.content.firstElementChild;
  }

  /* ------------------------------------------------------------ navigation */

  // The About Us section only exists on the home page, so from here it opens home.
  function scrollToAboutUs() {
    var el = document.getElementById('about-us');
    if (el) {
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 100, behavior: 'smooth' });
    } else {
      FEED.navigate('home');
    }
  }

  function handleItemClick(item) {
    if (item.id === 'services') {
      setServicesOpen(!state.servicesOpen);
      return;
    }
    if (item.id === 'about') {
      scrollToAboutUs();
      return;
    }
    if (item.route) FEED.navigate(item.route);
  }

  /* -------------------------------------------------- services mega menu */

  function servicesMenuHtml() {
    var animations = ['fwFlyInLeft', 'fwFlyInTop', 'fwFlyInBottom', 'fwFlyInRight'];
    var tiles = SERVICES.map(function (service, i) {
      var clickable = Boolean(SERVICE_ROUTES[service.name]);
      // `backwards` holds the hidden first frame through the stagger delay, then hands the
      // tile back to its own styles once it lands (so the :hover lift still works)
      var style = 'animation:' + animations[i % 4] + ' 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) ' + (i * 0.05) +
        's backwards;cursor:' + (clickable ? 'pointer' : 'default');
      return '<div class="srv-card" style="' + style + '" data-service="' + escape(service.name) + '">' +
        '<div class="srv-card-badge color-' + service.color + '">' + service.num + '</div>' +
        '<div class="srv-card-content">' +
          '<div class="srv-icon-circle color-' + service.color + '">' +
            '<img src="' + serviceImage(service.img) + '" alt="' + escape(service.name) + '" class="srv-card-image">' +
          '</div>' +
          '<div class="srv-card-text-area"><h3>' + escape(service.name) + '</h3></div>' +
        '</div>' +
      '</div>';
    }).join('');
    return '<div class="fw-services-dropdown"><div class="fw-services-dropdown-spacer"></div>' +
      '<div class="srv-cards-grid">' + tiles + '</div></div>';
  }

  function setServicesOpen(open) {
    if (open === state.servicesOpen) return;
    state.servicesOpen = open;
    servicesItem.classList.toggle('open', open);
    servicesButton.setAttribute('aria-expanded', String(open));

    if (open) {
      overlay = toElement('<div class="fw-services-overlay"></div>');
      overlay.addEventListener('click', function () { setServicesOpen(false); });
      nav.parentNode.insertBefore(overlay, nav);

      var menu = toElement(servicesMenuHtml());
      menu.addEventListener('click', function (event) {
        event.stopPropagation();
        var tile = event.target.closest('.srv-card');
        var route = tile && SERVICE_ROUTES[tile.getAttribute('data-service')];
        if (route) {
          setServicesOpen(false);
          FEED.navigate(route);
        }
      });
      servicesItem.appendChild(menu);
    } else {
      if (overlay) overlay.remove();
      var dropdown = servicesItem.querySelector('.fw-services-dropdown');
      if (dropdown) dropdown.remove();
      overlay = null;
    }
    updateScrollLock();
  }

  /* ------------------------------------------------------- mobile drawer */

  function mobilePanelHtml() {
    var items = NAV_ITEMS.map(function (item) {
      var isServices = item.id === 'services';
      var open = isServices && state.mobileServicesOpen;
      var submenu = '';
      if (open) {
        submenu = '<div class="fw-mobile-submenu">' + SERVICES.map(function (service) {
          return '<button type="button" class="fw-mobile-submenu-item"' +
            (SERVICE_ROUTES[service.name] ? '' : ' disabled') + ' data-service="' + escape(service.name) + '">' +
            '<img src="' + serviceImage(service.img) + '" alt="">' + escape(service.name) + '</button>';
        }).join('') + '</div>';
      }
      return '<li class="fw-mobile-nav-item' + (open ? ' open' : '') + '">' +
        '<button type="button" class="fw-mobile-nav-btn" data-item="' + item.id + '"' +
          (isServices ? ' aria-expanded="' + state.mobileServicesOpen + '"' : '') + '>' +
          '<span class="fw-mobile-nav-icon-chip" style="background:' + item.chip.bg + ';color:' + item.chip.fg + '">' +
            icon(item.icon, { size: 16, strokeWidth: 2 }) +
          '</span>' +
          '<span class="fw-mobile-nav-label">' + escape(item.label) + '</span>' +
          (item.hasDropdown ? icon('ChevronDown', { size: 14, strokeWidth: 2.5, className: 'fw-mobile-chevron' }) : '') +
        '</button>' + submenu +
      '</li>';
    }).join('');

    return '<div class="fw-mobile-panel" role="dialog" aria-modal="true" aria-label="Mobile navigation">' +
      '<div class="fw-mobile-header">' +
        '<div class="fw-mobile-header-brand">' +
          '<span class="fw-mobile-logo-badge"><img src="' + logoSrc + '" alt="FEED MSCS LTD"></span>' +
          '<span class="fw-mobile-header-title">FEED MSCS LTD</span>' +
        '</div>' +
        '<button type="button" class="fw-mobile-close" aria-label="Close menu">' + icon('X', { size: 18 }) + '</button>' +
      '</div>' +
      '<ul class="fw-mobile-nav">' + items + '</ul>' +
      '<div class="fw-mobile-footer">' +
        '<button type="button" class="fw-mobile-search" aria-label="Search">' + icon('Search', { size: 15 }) + 'Search</button>' +
        '<button type="button" class="fw-mobile-login" data-route="login">Login</button>' +
        '<button type="button" class="fw-mobile-register" data-route="register">Register</button>' +
      '</div>' +
    '</div>';
  }

  function renderMobilePanel() {
    var next = toElement(mobilePanelHtml());
    if (mobilePanel) mobilePanel.replaceWith(next);
    else mobileBackdrop.after(next);
    mobilePanel = next;
  }

  function setMobileOpen(open) {
    if (open === state.mobileOpen) return;
    state.mobileOpen = open;
    hamburger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    hamburger.setAttribute('aria-expanded', String(open));
    hamburger.innerHTML = icon(open ? 'X' : 'Menu', { size: 20 });

    if (open) {
      mobileBackdrop = toElement('<div class="fw-mobile-backdrop"></div>');
      mobileBackdrop.addEventListener('click', function () { setMobileOpen(false); });
      nav.after(mobileBackdrop);
      renderMobilePanel();
    } else {
      if (mobileBackdrop) mobileBackdrop.remove();
      if (mobilePanel) mobilePanel.remove();
      mobileBackdrop = null;
      mobilePanel = null;
    }
    updateScrollLock();
  }

  document.addEventListener('click', function (event) {
    if (!mobilePanel || !mobilePanel.contains(event.target)) return;
    var target = event.target;
    if (target.closest('.fw-mobile-close')) {
      setMobileOpen(false);
      return;
    }
    var serviceButton = target.closest('.fw-mobile-submenu-item');
    if (serviceButton) {
      var route = SERVICE_ROUTES[serviceButton.getAttribute('data-service')];
      if (route) FEED.navigate(route);
      return;
    }
    var routeButton = target.closest('[data-route]');
    if (routeButton) {
      FEED.navigate(routeButton.getAttribute('data-route'));
      return;
    }
    var itemButton = target.closest('.fw-mobile-nav-btn');
    if (!itemButton) return;
    var item = NAV_ITEMS.filter(function (i) { return i.id === itemButton.getAttribute('data-item'); })[0];
    if (item.id === 'services') {
      state.mobileServicesOpen = !state.mobileServicesOpen;
      renderMobilePanel();
    } else if (item.id === 'about') {
      setMobileOpen(false);
      scrollToAboutUs();
    } else if (item.route) {
      FEED.navigate(item.route);
    }
  });

  // The page behind the mega menu or the drawer stays put while either is open; the reserved
  // scrollbar gutter stops the page (and this fixed bar) jumping sideways.
  function updateScrollLock() {
    var locked = state.mobileOpen || state.servicesOpen;
    document.documentElement.style.scrollbarGutter = locked ? 'stable' : '';
    document.body.style.overflow = locked ? 'hidden' : '';
  }

  /* --------------------------------------------------- notifications bell */

  // There is no FEED server behind these pages, so the bell shows its visitor message.
  function setBellOpen(open) {
    if (open === state.bellOpen) return;
    state.bellOpen = open;
    bellButton.setAttribute('aria-expanded', String(open));
    var panel = bellWrap.querySelector('.nb-panel');
    if (!open) {
      if (panel) panel.remove();
      return;
    }
    bellWrap.appendChild(toElement(
      '<div class="nb-panel" role="dialog" aria-label="Notifications">' +
        '<div class="nb-head"><strong>Notifications</strong></div>' +
        '<p class="nb-empty">No new EPMs right now. Upcoming EPMs are announced here 15 days before they are held.</p>' +
        '<p class="nb-foot"><button type="button">Log in</button> to get reminders and updates about the EPMs you register for.</p>' +
      '</div>'
    ));
    bellWrap.querySelector('.nb-foot button').addEventListener('click', function () {
      setBellOpen(false);
      FEED.navigate('login');
    });
  }

  bellButton.addEventListener('click', function () { setBellOpen(!state.bellOpen); });

  /* ---------------------------------------------------------- the bar */

  nav.querySelector('.fw-navbar-logo').addEventListener('click', function () { FEED.navigate('home'); });

  Array.prototype.forEach.call(navButtons, function (li, i) {
    li.querySelector('.fw-nav-btn').addEventListener('click', function () { handleItemClick(NAV_ITEMS[i]); });
  });

  // Signed-out visitors go to the login page, which isn't part of this site.
  nav.querySelector('.fw-account-btn').addEventListener('click', function () { FEED.navigate('login'); });

  hamburger.addEventListener('click', function () { setMobileOpen(!state.mobileOpen); });

  document.addEventListener('mousedown', function (event) {
    if (state.servicesOpen && !servicesItem.contains(event.target)) setServicesOpen(false);
    if (state.bellOpen && !bellWrap.contains(event.target)) setBellOpen(false);
  });

  document.addEventListener('keydown', function (event) {
    if (event.key !== 'Escape') return;
    setServicesOpen(false);
    setMobileOpen(false);
    setBellOpen(false);
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > 1024) setMobileOpen(false);
  });

  // Hide on scroll down, show on scroll up - but never while the mega menu is open, or it
  // would be carried off-screen with the bar.
  window.addEventListener('scroll', function () {
    var currentY = window.scrollY;
    var delta = currentY - lastScrollY;
    // Only react to meaningful scrolls (>10px) to avoid jitter
    if (delta > 10 && currentY > 80 && !state.servicesOpen) {
      if (!state.navHidden) nav.classList.add('fw-nav-hidden');
      state.navHidden = true;
    } else if (delta < -10) {
      if (state.navHidden) nav.classList.remove('fw-nav-hidden');
      state.navHidden = false;
    }
    lastScrollY = currentY;
  }, { passive: true });
})(window.FEED);
