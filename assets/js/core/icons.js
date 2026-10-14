/* Line icons used by the page scripts, with the same markup lucide-react renders
   (lucide icon set, ISC licence - https://lucide.dev). */
window.FEED = window.FEED || {};
(function (FEED) {
  var ICONS = {
    Home: { cls: "lucide lucide-house", body: "<path d=\"M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8\"></path><path d=\"M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z\"></path>" },
    Settings: { cls: "lucide lucide-settings", body: "<path d=\"M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915\"></path><circle cx=\"12\" cy=\"12\" r=\"3\"></circle>" },
    Calendar: { cls: "lucide lucide-calendar", body: "<path d=\"M8 2v4\"></path><path d=\"M16 2v4\"></path><rect width=\"18\" height=\"18\" x=\"3\" y=\"4\" rx=\"2\"></rect><path d=\"M3 10h18\"></path>" },
    Map: { cls: "lucide lucide-map", body: "<path d=\"M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z\"></path><path d=\"M15 5.764v15\"></path><path d=\"M9 3.236v15\"></path>" },
    Activity: { cls: "lucide lucide-activity", body: "<path d=\"M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2\"></path>" },
    Package: { cls: "lucide lucide-package", body: "<path d=\"M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z\"></path><path d=\"M12 22V12\"></path><polyline points=\"3.29 7 12 12 20.71 7\"></polyline><path d=\"m7.5 4.27 9 5.15\"></path>" },
    PhoneCall: { cls: "lucide lucide-phone-call", body: "<path d=\"M13 2a9 9 0 0 1 9 9\"></path><path d=\"M13 6a5 5 0 0 1 5 5\"></path><path d=\"M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384\"></path>" },
    ChevronDown: { cls: "lucide lucide-chevron-down", body: "<path d=\"m6 9 6 6 6-6\"></path>" },
    Search: { cls: "lucide lucide-search", body: "<path d=\"m21 21-4.34-4.34\"></path><circle cx=\"11\" cy=\"11\" r=\"8\"></circle>" },
    User: { cls: "lucide lucide-user", body: "<path d=\"M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2\"></path><circle cx=\"12\" cy=\"7\" r=\"4\"></circle>" },
    Building2: { cls: "lucide lucide-building2 lucide-building-2", body: "<path d=\"M10 12h4\"></path><path d=\"M10 8h4\"></path><path d=\"M14 21v-3a2 2 0 0 0-4 0v3\"></path><path d=\"M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2\"></path><path d=\"M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16\"></path>" },
    Users: { cls: "lucide lucide-users", body: "<path d=\"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2\"></path><path d=\"M16 3.128a4 4 0 0 1 0 7.744\"></path><path d=\"M22 21v-2a4 4 0 0 0-3-3.87\"></path><circle cx=\"9\" cy=\"7\" r=\"4\"></circle>" },
    Menu: { cls: "lucide lucide-menu", body: "<path d=\"M4 5h16\"></path><path d=\"M4 12h16\"></path><path d=\"M4 19h16\"></path>" },
    X: { cls: "lucide lucide-x", body: "<path d=\"M18 6 6 18\"></path><path d=\"m6 6 12 12\"></path>" },
    Bell: { cls: "lucide lucide-bell", body: "<path d=\"M10.268 21a2 2 0 0 0 3.464 0\"></path><path d=\"M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326\"></path>" },
    ChevronRight: { cls: "lucide lucide-chevron-right", body: "<path d=\"m9 18 6-6-6-6\"></path>" },
    ArrowRight: { cls: "lucide lucide-arrow-right", body: "<path d=\"M5 12h14\"></path><path d=\"m12 5 7 7-7 7\"></path>" },
    ArrowLeft: { cls: "lucide lucide-arrow-left", body: "<path d=\"m12 19-7-7 7-7\"></path><path d=\"M19 12H5\"></path>" },
    ExternalLink: { cls: "lucide lucide-external-link", body: "<path d=\"M15 3h6v6\"></path><path d=\"M10 14 21 3\"></path><path d=\"M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6\"></path>" },
    Check: { cls: "lucide lucide-check", body: "<path d=\"M20 6 9 17l-5-5\"></path>" },
    Globe: { cls: "lucide lucide-globe", body: "<circle cx=\"12\" cy=\"12\" r=\"10\"></circle><path d=\"M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20\"></path><path d=\"M2 12h20\"></path>" },
    RotateCw: { cls: "lucide lucide-rotate-cw", body: "<path d=\"M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8\"></path><path d=\"M21 3v5h-5\"></path>" },
    FileText: { cls: "lucide lucide-file-text", body: "<path d=\"M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z\"></path><path d=\"M14 2v5a1 1 0 0 0 1 1h5\"></path><path d=\"M10 9H8\"></path><path d=\"M16 13H8\"></path><path d=\"M16 17H8\"></path>" },
    Sprout: { cls: "lucide lucide-sprout", body: "<path d=\"M14 9.536V7a4 4 0 0 1 4-4h1.5a.5.5 0 0 1 .5.5V5a4 4 0 0 1-4 4 4 4 0 0 0-4 4c0 2 1 3 1 5a5 5 0 0 1-1 3\"></path><path d=\"M4 9a5 5 0 0 1 8 4 5 5 0 0 1-8-4\"></path><path d=\"M5 21h14\"></path>" },
    Wheat: { cls: "lucide lucide-wheat", body: "<path d=\"M2 22 16 8\"></path><path d=\"M3.47 12.53 5 11l1.53 1.53a3.5 3.5 0 0 1 0 4.94L5 19l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z\"></path><path d=\"M7.47 8.53 9 7l1.53 1.53a3.5 3.5 0 0 1 0 4.94L9 15l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z\"></path><path d=\"M11.47 4.53 13 3l1.53 1.53a3.5 3.5 0 0 1 0 4.94L13 11l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z\"></path><path d=\"M20 2h2v2a4 4 0 0 1-4 4h-2V6a4 4 0 0 1 4-4Z\"></path><path d=\"M11.47 17.47 13 19l-1.53 1.53a3.5 3.5 0 0 1-4.94 0L5 19l1.53-1.53a3.5 3.5 0 0 1 4.94 0Z\"></path><path d=\"M15.47 13.47 17 15l-1.53 1.53a3.5 3.5 0 0 1-4.94 0L9 15l1.53-1.53a3.5 3.5 0 0 1 4.94 0Z\"></path><path d=\"M19.47 9.47 21 11l-1.53 1.53a3.5 3.5 0 0 1-4.94 0L13 11l1.53-1.53a3.5 3.5 0 0 1 4.94 0Z\"></path>" },
    Leaf: { cls: "lucide lucide-leaf", body: "<path d=\"M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z\"></path><path d=\"M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12\"></path>" },
    MapPin: { cls: "lucide lucide-map-pin", body: "<path d=\"M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0\"></path><circle cx=\"12\" cy=\"10\" r=\"3\"></circle>" },
    Info: { cls: "lucide lucide-info", body: "<circle cx=\"12\" cy=\"12\" r=\"10\"></circle><path d=\"M12 16v-4\"></path><path d=\"M12 8h.01\"></path>" },
    Factory: { cls: "lucide lucide-factory", body: "<path d=\"M12 16h.01\"></path><path d=\"M16 16h.01\"></path><path d=\"M3 19a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.5a.5.5 0 0 0-.769-.422l-4.462 2.844A.5.5 0 0 1 15 10.5v-2a.5.5 0 0 0-.769-.422L9.77 10.922A.5.5 0 0 1 9 10.5V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2z\"></path><path d=\"M8 16h.01\"></path>" },
    Snowflake: { cls: "lucide lucide-snowflake", body: "<path d=\"m10 20-1.25-2.5L6 18\"></path><path d=\"M10 4 8.75 6.5 6 6\"></path><path d=\"m14 20 1.25-2.5L18 18\"></path><path d=\"m14 4 1.25 2.5L18 6\"></path><path d=\"m17 21-3-6h-4\"></path><path d=\"m17 3-3 6 1.5 3\"></path><path d=\"M2 12h6.5L10 9\"></path><path d=\"m20 10-1.5 2 1.5 2\"></path><path d=\"M22 12h-6.5L14 15\"></path><path d=\"m4 10 1.5 2L4 14\"></path><path d=\"m7 21 3-6-1.5-3\"></path><path d=\"m7 3 3 6h4\"></path>" },
    Droplets: { cls: "lucide lucide-droplets", body: "<path d=\"M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z\"></path><path d=\"M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97\"></path>" },
    Warehouse: { cls: "lucide lucide-warehouse", body: "<path d=\"M18 21V10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1v11\"></path><path d=\"M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 1.132-1.803l7.95-3.974a2 2 0 0 1 1.837 0l7.948 3.974A2 2 0 0 1 22 8z\"></path><path d=\"M6 13h12\"></path><path d=\"M6 17h12\"></path>" },
    HandCoins: { cls: "lucide lucide-hand-coins", body: "<path d=\"M11 15h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 17\"></path><path d=\"m7 21 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.75-2.91l-4.2 3.9\"></path><path d=\"m2 16 6 6\"></path><circle cx=\"16\" cy=\"9\" r=\"2.9\"></circle><circle cx=\"6\" cy=\"5\" r=\"3\"></circle>" },
    CloudRain: { cls: "lucide lucide-cloud-rain", body: "<path d=\"M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242\"></path><path d=\"M16 14v6\"></path><path d=\"M8 14v6\"></path><path d=\"M12 16v6\"></path>" },
    Tractor: { cls: "lucide lucide-tractor", body: "<path d=\"m10 11 11 .9a1 1 0 0 1 .8 1.1l-.665 4.158a1 1 0 0 1-.988.842H20\"></path><path d=\"M16 18h-5\"></path><path d=\"M18 5a1 1 0 0 0-1 1v5.573\"></path><path d=\"M3 4h8.129a1 1 0 0 1 .99.863L13 11.246\"></path><path d=\"M4 11V4\"></path><path d=\"M7 15h.01\"></path><path d=\"M8 10.1V4\"></path><circle cx=\"18\" cy=\"18\" r=\"2\"></circle><circle cx=\"7\" cy=\"15\" r=\"5\"></circle>" }
  };

  /**
   * An icon's <svg> markup. opts: size (24), strokeWidth (2), className, attrs (extra attributes, already escaped).
   */
  FEED.icon = function (name, opts) {
    var icon = ICONS[name];
    if (!icon) throw new Error('Unknown icon: ' + name);
    opts = opts || {};
    var size = opts.size || 24;
    var cls = icon.cls + (opts.className ? ' ' + opts.className : '');
    return '<svg xmlns="http://www.w3.org/2000/svg" width="' + size + '" height="' + size +
      '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="' + (opts.strokeWidth || 2) +
      '" stroke-linecap="round" stroke-linejoin="round" class="' + cls + '" aria-hidden="true"' +
      (opts.attrs ? ' ' + opts.attrs : '') + '>' + icon.body + '</svg>';
  };
})(window.FEED);
