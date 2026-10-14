# FEED Services - Trade Fairs, Loans & Finance, Know Your Schemes

Plain HTML, CSS and JavaScript copies of three pages of the FEED React app, with a home page
that links to them. No build step, server, IDE or browser extension is needed.

## Opening it

Double-click `index.html`, or drag it into any modern browser (Chrome, Edge, Firefox, Safari).
Its three cards open the three pages; the pages link to each other and back through the
navbar's **Services** menu, the logo and **Home**.

Everything runs from the files on disk. Two things use the internet when it is available:

- The fonts (Inter and Outfit) come from Google Fonts. Offline, the pages use the system font.
- The external links (bank websites, scheme portals, trade fair organisers) open those sites.

## Folder structure

```
index.html                     Home page with the three service cards
pages/
  trade-fairs.html
  loans-finance.html
  know-your-schemes.html
assets/
  css/
    base.css                   Global reset, theme tokens and page shell
    components/
      navbar.css               Site navbar, Services mega menu, mobile drawer
      notification-bell.css    Navbar notifications panel
      footer.css               Site footer
    pages/
      index.css                Home page
      trade-fairs.css
      loans-finance.css
      know-your-schemes.css
  js/
    core/
      icons.js                 Line icons (lucide) used by the scripts
      site.js                  Links between pages, HTML escaping, storage helpers
    components/
      navbar.js                Mega menu, mobile drawer, notifications, auto-hide on scroll
      footer.js                Back-to-top button, placeholder links
    data/
      trade-fairs-data.js      Fairs listing, filter options, official sources
      government-schemes-data.js  Loans & Finance scheme cards
      state-districts.js       States and districts for the details form
      schemes-data.js          Ministries, states, departments and their schemes
      scheme-icons.js          Scheme card artwork
    pages/
      trade-fairs.js
      loans-finance.js
      know-your-schemes.js
  images/
    brand/  services/  banks/  loans-finance/  know-your-schemes/  trade-fairs/
```

Each page's first render is already in its HTML file. The page script adds the behaviour
(filters, dropdowns, tabs, dialogs, form checks, animations) and redraws the parts that change.
Scripts are ordinary `<script>` files (no modules, no `fetch`), which is what lets the pages work
when opened straight from disk.

The CSS files load in the same order as in the React app, because later files win ties.

## Differences from the React app

- There is no FEED server behind these pages, so the navbar shows a visitor who is not logged
  in, and the notifications bell shows its empty "No new EPMs" message.
- Links to parts of the FEED app that are not in this folder (Login, Register, FPO, Exports,
  Contact Us, and the other Services tiles) do nothing. Home and About Us open `index.html`.

## Updating the content

- Trade fairs: edit `assets/js/data/trade-fairs-data.js` (`FAIRS`, `SOURCES`).
- Schemes: edit `assets/js/data/schemes-data.js`.
- Loans & Finance scheme cards: edit `assets/js/data/government-schemes-data.js`.
