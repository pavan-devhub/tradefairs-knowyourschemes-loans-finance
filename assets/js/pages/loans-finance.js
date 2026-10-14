/*
 * Loans & Finance page (converted from src/pages/LoansFinance.jsx and src/components/loans/*).
 * The page's first render is in loans-finance.html; this script adds its behaviour.
 */
(function (FEED) {
  'use strict';

  var content = document.querySelector('.lf-content');
  if (!content) return;

  var icon = FEED.icon;
  var escape = FEED.escape;

  /* ------------------------------------------------------ in-page links */

  // Links to a section ("#financial-tools") scroll to it; placeholder links ("#") do nothing.
  content.addEventListener('click', function (event) {
    var link = event.target.closest('a[href^="#"]');
    if (!link) return;
    event.preventDefault();
    var target = document.getElementById(decodeURIComponent(link.getAttribute('href').slice(1)));
    if (!target) return;
    target.scrollIntoView({ behavior: FEED.prefersReducedMotion() ? 'auto' : 'smooth' });
  });

  /* -------------------------------------------- 3. Available Finance Options */

  // Intro for the bank cards: each card flies in from its own side of the blue panel (the corner
  // or edge it sits nearest) and settles into its place in the grid.
  var FLY_DISTANCE = 220;
  var FLY_DURATION = 900;
  var FLY_STAGGER = 90;

  function playFlyInIntro(grid) {
    var cards = Array.prototype.slice.call(grid.querySelectorAll('.finance-card-v2'));
    var gridBox = grid.getBoundingClientRect();
    var centerX = gridBox.left + gridBox.width / 2;
    var centerY = gridBox.top + gridBox.height / 2;
    var lefts = cards.map(function (card) { return card.offsetLeft; });
    var singleColumn = lefts.every(function (left) { return left === lefts[0]; });

    return cards.map(function (card, i) {
      var box = card.getBoundingClientRect();
      var dx = box.left + box.width / 2 - centerX;
      var dy = box.top + box.height / 2 - centerY;
      // In one column every card is centred, so alternate left / right instead
      var sideX = singleColumn ? (i % 2 ? 1 : -1) : Math.abs(dx) < box.width / 4 ? 0 : Math.sign(dx);
      var sideY = singleColumn ? 0 : Math.abs(dy) < box.height / 4 ? 0 : Math.sign(dy);

      return card.animate(
        [
          { transform: 'translate(' + sideX * FLY_DISTANCE + 'px, ' + sideY * FLY_DISTANCE + 'px) scale(0.85)', opacity: 0 },
          { transform: 'translate(0px, 0px) scale(1)', opacity: 1 }
        ],
        { duration: FLY_DURATION, delay: i * FLY_STAGGER, easing: 'cubic-bezier(.22, 1, .36, 1)', fill: 'backwards' }
      );
    });
  }

  // Cards wait hidden, then play the intro once, when enough of the grid is on screen
  var optionsGrid = content.querySelector('.finance-options-v2__grid');
  if (optionsGrid && optionsGrid.animate && !FEED.prefersReducedMotion() && typeof IntersectionObserver !== 'undefined') {
    optionsGrid.classList.add('is-waiting');
    var gridObserver = new IntersectionObserver(function (entries) {
      var entry = entries[0];
      var needed = Math.min(entry.boundingClientRect.height, window.innerHeight) * 0.45;
      if (!entry.isIntersecting || entry.intersectionRect.height < needed) return;
      gridObserver.disconnect();
      playFlyInIntro(optionsGrid);
      optionsGrid.classList.remove('is-waiting');
    }, { threshold: Array.from({ length: 11 }, function (_, i) { return i / 10; }) });
    gridObserver.observe(optionsGrid);
  }

  /* -------------------------------------- 4. Government Schemes & Subsidies */

  var SCHEMES = FEED.data.governmentSchemes;
  var schemesSection = document.getElementById('government-schemes');
  var schemesGrid = schemesSection.querySelector('.finance-schemes__grid');
  var tabs = schemesSection.querySelectorAll('.finance-schemes__tab');

  // Card shows the name, status and headline benefit; the accent colour cycles by grid position in CSS
  function schemeCardHtml(scheme) {
    return '<article class="finance-scheme-card">' +
      '<div class="finance-scheme-card__top">' +
        '<span class="finance-scheme-card__icon">' + icon(scheme.icon, { size: 18 }) + '</span>' +
        (scheme.status ? '<span class="finance-scheme-card__status">' + escape(scheme.status) + '</span>' : '') +
      '</div>' +
      '<h3 class="finance-scheme-card__title">' + escape(scheme.title) + '</h3>' +
      '<p class="finance-scheme-card__benefit">' +
        '<strong class="finance-scheme-card__value">' +
          (scheme.prefix ? '<span class="finance-scheme-card__prefix">' + escape(scheme.prefix) + '</span>' : '') +
          escape(scheme.value) +
        '</strong>' +
        '<span class="finance-scheme-card__label">' + escape(scheme.label) + '</span>' +
      '</p>' +
      (scheme.badge ? '<div class="finance-scheme-card__tags"><span class="finance-scheme-card__badge">' + escape(scheme.badge) + '</span></div>' : '') +
      '<a href="#" class="finance-scheme-card__view">View Details' +
        '<span class="finance-scheme-card__arrow">' + icon('ArrowRight', { size: 16 }) + '</span></a>' +
    '</article>';
  }

  Array.prototype.forEach.call(tabs, function (tab) {
    tab.addEventListener('click', function () {
      Array.prototype.forEach.call(tabs, function (other) {
        var active = other === tab;
        other.classList.toggle('is-active', active);
        other.setAttribute('aria-pressed', String(active));
      });
      schemesGrid.innerHTML = SCHEMES[tab.textContent].map(schemeCardHtml).join('');
    });
  });

  // Any card, and "View All", open the Know Your Schemes page
  schemesSection.addEventListener('click', function (event) {
    if (event.target.closest('.finance-scheme-card') || event.target.closest('.finance-schemes__view-all')) {
      FEED.navigate('schemes');
    }
  });

  /* --------------------------------------------- 2. Your Details form */

  // Each rule: `sanitize` cleans keystrokes/pastes, `validate` returns an error message ('' when fine).
  // `left` is true once the user has moved out of the field, so incomplete values aren't flagged mid-typing.

  // Indian mobile: 10 digits starting with 6-9. Pasted "+91 ..." or "0..." prefixes are dropped.
  var MOBILE_LENGTH = 10;
  var mobileRule = {
    sanitize: function (raw) {
      var digits = raw.replace(/\D/g, '');
      if (digits.length === 12 && digits.indexOf('91') === 0) digits = digits.slice(2);
      if (digits.length === 11 && digits.indexOf('0') === 0) digits = digits.slice(1);
      return digits.slice(0, MOBILE_LENGTH);
    },
    validate: function (value, left) {
      if (value && !/^[6-9]/.test(value)) return 'Mobile number must start with 6, 7, 8 or 9';
      if (value && value.length < MOBILE_LENGTH && left) return 'Enter a valid ' + MOBILE_LENGTH + '-digit mobile number';
      return '';
    }
  };

  // Email: bad characters or a second "@" are flagged while typing; the full name@domain.tld shape once the user leaves
  var EMAIL_ALLOWED_CHARS = /^[A-Za-z0-9._%+@-]*$/;
  var EMAIL_PATTERN = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;
  var isEmailValid = function (value) {
    return EMAIL_PATTERN.test(value) && value.indexOf('..') === -1 && value.charAt(0) !== '.' &&
      value.indexOf('.@') === -1 && value.indexOf('@-') === -1;
  };
  var emailRule = {
    sanitize: function (raw) { return raw.replace(/\s/g, '').slice(0, 254); },
    validate: function (value, left) {
      if (!EMAIL_ALLOWED_CHARS.test(value)) return 'Email can only use letters, numbers and . _ % + - @';
      if ((value.match(/@/g) || []).length > 1) return 'Email can contain only one @';
      if (value && left && !isEmailValid(value)) return 'Enter a valid email, e.g. name@example.com';
      return '';
    }
  };

  // PAN format: 5 letters, 4 digits, 1 letter (e.g. ABCDE1234F)
  var PAN_LENGTH = 10;
  var PAN_EXAMPLE = 'ABCDE1234F';
  var isPanCharValid = function (ch, index) { return (index < 5 || index === 9 ? /[A-Z]/ : /[0-9]/).test(ch); };
  var panRule = {
    sanitize: function (raw) { return raw.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, PAN_LENGTH); },
    validate: function (value, left) {
      if (!value.split('').every(isPanCharValid)) return 'Use format ' + PAN_EXAMPLE + ' (5 letters, 4 digits, 1 letter)';
      if (value && value.length < PAN_LENGTH && left) return 'PAN must be ' + PAN_LENGTH + ' characters, e.g. ' + PAN_EXAMPLE;
      return '';
    }
  };

  // CIBIL: 300-900, checked once all 3 digits are typed or the user leaves the field
  var CIBIL_MIN = 300;
  var CIBIL_MAX = 900;
  var cibilRule = {
    sanitize: function (raw) { return raw.replace(/\D/g, '').slice(0, 3); },
    validate: function (value, left) {
      var score = Number(value);
      var outOfRange = score < CIBIL_MIN || score > CIBIL_MAX;
      return value && (value.length === 3 || left) && outOfRange ? 'Score must be between ' + CIBIL_MIN + ' and ' + CIBIL_MAX : '';
    }
  };

  // Loan amount: Rs 1,00,000 - 10,00,000, shown with Indian digit grouping as the user types.
  // Too large is flagged at once; too small only once the user leaves the field.
  var LOAN_MIN = 100000;
  var LOAN_MAX = 1000000;
  var formatINR = function (amount) { return amount.toLocaleString('en-IN'); };
  var loanRule = {
    sanitize: function (raw) {
      var digits = raw.replace(/\D/g, '').replace(/^0+/, '').slice(0, String(LOAN_MAX).length);
      return digits ? formatINR(Number(digits)) : '';
    },
    validate: function (value, left) {
      var amount = Number(value.replace(/,/g, ''));
      var outOfRange = amount > LOAN_MAX || (left && amount < LOAN_MIN);
      return value && outOfRange ? 'Enter an amount between ₹' + formatINR(LOAN_MIN) + ' and ₹' + formatINR(LOAN_MAX) : '';
    }
  };

  // Wires one input to its rule: cleans what is typed, and shows the error under the field
  function validatedInput(input, rule, errorId) {
    if (!input) return;
    var control = input.closest('.finance-details__control');
    var field = input.closest('.finance-details__field');
    var left = false;

    function update() {
      var error = rule.validate(input.value, left);
      control.classList.toggle('is-invalid', Boolean(error));
      input.setAttribute('aria-invalid', String(Boolean(error)));
      var message = document.getElementById(errorId);
      if (error) {
        input.setAttribute('aria-describedby', errorId);
        if (!message) {
          message = document.createElement('p');
          message.id = errorId;
          message.className = 'finance-details__error';
          message.setAttribute('role', 'alert');
          field.appendChild(message);
        }
        message.textContent = error;
      } else {
        input.removeAttribute('aria-describedby');
        if (message) message.remove();
      }
    }

    input.addEventListener('input', function () {
      var clean = rule.sanitize(input.value);
      if (input.value !== clean) input.value = clean;
      left = false;
      update();
    });
    input.addEventListener('blur', function () {
      left = true;
      update();
    });
  }

  var form = content.querySelector('.finance-details__grid');
  if (form) {
    validatedInput(form.querySelector('input[type="tel"]'), mobileRule, 'mobile-error');
    validatedInput(form.querySelector('input[type="email"]'), emailRule, 'email-error');
    validatedInput(form.querySelector('input[placeholder^="Enter PAN"]'), panRule, 'pan-error');
    validatedInput(form.querySelector('input[placeholder^="Enter score"]'), cibilRule, 'cibil-error');
    validatedInput(form.querySelector('input[placeholder^="Enter amount"]'), loanRule, 'loan-amount-error');

    // A new state lists its own districts, and the previous district no longer applies
    var DISTRICTS = FEED.data.stateDistricts.STATE_DISTRICTS;
    var selects = form.querySelectorAll('select');
    var stateSelect = selects[1];
    var districtSelect = selects[2];
    stateSelect.addEventListener('change', function () {
      districtSelect.innerHTML = '<option value="" disabled>Select District</option>' +
        DISTRICTS[stateSelect.value].map(function (name) { return '<option>' + escape(name) + '</option>'; }).join('');
      districtSelect.value = '';
    });
  }
})(window.FEED);
