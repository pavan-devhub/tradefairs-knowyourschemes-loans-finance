/*
 * Site footer (converted from src/components/Footer.jsx). The footer is in each page's HTML;
 * this adds its behaviour.
 */
(function () {
  'use strict';

  var footer = document.querySelector('.new-footer');
  if (!footer) return;

  // The footer links are placeholders ("#") in the FEED app too: keep them from jumping to the top.
  footer.addEventListener('click', function (event) {
    var link = event.target.closest('a[href="#"]');
    if (link) event.preventDefault();
  });

  var scrollTop = footer.querySelector('.scroll-top-btn');
  if (scrollTop) {
    scrollTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
})();
