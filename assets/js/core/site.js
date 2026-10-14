/*
 * Shared helpers for every page: links between the pages of this site, HTML escaping,
 * and the reduced-motion preference.
 *
 * Pages are plain files, so links are relative to the site folder. Each page's <body> says
 * where that folder is (data-site-root="../" for the files in pages/).
 */
window.FEED = window.FEED || {};

(function (FEED) {
  'use strict';

  var root = document.body.getAttribute('data-site-root') || './';

  // React route names (as the navbar and pages use them) -> page files in this site.
  // Other routes of the full FEED app (login, FPO, Exports...) are not part of this site.
  var PAGES = {
    home: 'index.html',
    TradeFairs: 'pages/trade-fairs.html',
    'loans-finance': 'pages/loans-finance.html',
    schemes: 'pages/know-your-schemes.html'
  };

  /** A path inside the site folder, relative to the current page. */
  FEED.url = function (path) {
    return root + path;
  };

  /** Opens the page for a route; routes outside this site do nothing. */
  FEED.navigate = function (route) {
    if (Object.prototype.hasOwnProperty.call(PAGES, route)) {
      window.location.href = FEED.url(PAGES[route]);
    }
  };

  var ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;' };

  /** Text made safe to put inside HTML markup or a quoted attribute. */
  FEED.escape = function (value) {
    return String(value).replace(/[&<>"']/g, function (ch) { return ESCAPES[ch]; });
  };

  FEED.prefersReducedMotion = function () {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  };

  /**
   * localStorage, or a stand-in that remembers nothing when the browser blocks it
   * (private windows, blocked site data).
   */
  FEED.storage = {
    get: function (key) {
      try { return window.localStorage.getItem(key); } catch (e) { return null; }
    },
    set: function (key, value) {
      try { window.localStorage.setItem(key, value); return true; } catch (e) { return false; }
    }
  };
})(window.FEED);
