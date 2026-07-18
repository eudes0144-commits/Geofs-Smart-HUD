// ==UserScript==
// @name         GeoFS Smart HUD
// @namespace    https://github.com/machpoint82
// @version      2.1.0
// @description  Professional glass-cockpit style HUD for GeoFS — ground speed, IAS, TAS, altitude, vertical speed, heading, and live flight-plan ETA/TOC/TOD tracking. Toggle with Shift+X.
// @author       you
// @match        https://www.geo-fs.com/*
// @match        https://*.geo-fs.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-idle
// @updateURL    https://raw.githubusercontent.com/machpoint82/Geofs-Smart-HUD/main/geofs-smart-hud.user.js
// @downloadURL  https://raw.githubusercontent.com/machpoint82/Geofs-Smart-HUD/main/geofs-smart-hud.user.js
// @icon         data:image/png;base64,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
// ==/UserScript==

(function () {
  'use strict';

  // Using @grant (GM_setValue/GM_getValue) puts this script in a sandboxed execution
  // context where `window` is NOT the page's real window — so `window.geofs` would be
  // undefined forever even though the page has a real `geofs` global. `unsafeWindow`
  // is Tampermonkey's escape hatch to reach the actual page context.
  const G = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;

  // ===========================================================================================
  // NOTES ON GAME DATA SOURCES
  // ===========================================================================================
  //   geofs.animation.values.kias          -> indicated airspeed, knots
  //   geofs.animation.values.ktas          -> true airspeed, knots        (fallback: .tas)
  //   geofs.animation.values.groundSpeedKnt-> ground speed, knots (CONFIRMED real field,
  //                                           used by other community scripts for V1 callouts)
  //   geofs.animation.values.altitude      -> altitude, feet (MSL)
  //   geofs.animation.values.verticalSpeed -> vertical speed, ft/min      (fallback: .climbrate)
  //   geofs.animation.values.heading       -> heading, degrees            (fallback: .heading360)
  //   geofs.aircraft.instance.llaLocation  -> [lat_deg, lon_deg, alt]
  //   geofs.flightPlan.waypointArray        -> CONFIRMED live array of waypoint objects
  //                                           backing the game's own NAV panel flight plan.
  //                                           Each entry has {ident, type, lat, lon, alt,
  //                                           spd, track, distanceNM, distanceThusfar,
  //                                           selected, valid}. GeoFS itself inserts real
  //                                           "T_O_C"/"T_O_D" pseudo-waypoints into this
  //                                           array (with its own computed position) once
  //                                           a cruise altitude is set on the route — this
  //                                           script reads those directly when present.
  //                                           (Note: geofs.nav has no such property; an
  //                                           earlier version of this script guessed wrong.)
  // ===========================================================================================

  const CONFIG = {
    toggleKey: 'x',              // Shift + this key toggles the HUD
    updateHz: 5,                 // HUD refresh rate
    gsWindowMs: 2000,            // rolling window for the fallback ground-speed estimator
    gsSmoothing: 0.25,
    wpAdvanceRadiusNm: 2,        // switch to next waypoint once within this distance
    todDescentGradientNmPerKft: 3, // classic "3nm per 1000ft" descent rule
    tocMinClimbFpm: 100,         // minimum climb rate before we consider TOC "in progress"
    storageKeyPos: 'geofs_smarthud_pos_v2',
  };

  // ---------------------------------------------------------------------------------------
  // Small storage helpers (GM_* if available, else localStorage fallback) — used only to
  // remember where you dragged the HUD to.
  // ---------------------------------------------------------------------------------------
  const hasGM = typeof GM_getValue === 'function' && typeof GM_setValue === 'function';
  function storeGet(key, fallback) {
    try {
      if (hasGM) {
        const v = GM_getValue(key, null);
        return v === null ? fallback : JSON.parse(v);
      }
      const v = localStorage.getItem(key);
      return v === null ? fallback : JSON.parse(v);
    } catch (e) { return fallback; }
  }
  function storeSet(key, value) {
    try {
      const s = JSON.stringify(value);
      if (hasGM) GM_setValue(key, s);
      else localStorage.setItem(key, s);
    } catch (e) { /* ignore */ }
  }

  // ---------------------------------------------------------------------------------------
  // Wait for GeoFS to actually be up before touching anything
  // ---------------------------------------------------------------------------------------
  function waitForGeoFS(cb) {
    const itv = setInterval(function () {
      if (G.geofs && G.geofs.aircraft && G.geofs.aircraft.instance &&
          G.geofs.animation && G.geofs.animation.values) {
        clearInterval(itv);
        cb();
      }
    }, 500);
  }

  // ---------------------------------------------------------------------------------------
  // Geo math
  // ---------------------------------------------------------------------------------------
  const R_NM = 3440.065; // earth radius in nautical miles
  function toRad(d) { return d * Math.PI / 180; }

  function greatCircleDistanceNm(lat1, lon1, lat2, lon2) {
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R_NM * c;
  }

  // ---------------------------------------------------------------------------------------
  // Parse a flight-plan "alt" field. GeoFS accepts either a plain number (feet) or a string
  // like "FL350" (flight level, i.e. hundreds of feet). Returns null if not parseable/blank.
  // ---------------------------------------------------------------------------------------
  function parseAltField(alt) {
    if (alt === null || alt === undefined || alt === '') return null;
    if (typeof alt === 'number') return alt;
    const s = String(alt).trim().toUpperCase();
    if (s === '') return null;
    if (s.startsWith('FL')) {
      const n = parseInt(s.slice(2), 10);
      return isNaN(n) ? null : n * 100;
    }
    const n = parseInt(s, 10);
    return isNaN(n) ? null : n;
  }

  // ---------------------------------------------------------------------------------------
  // Styles
  // ---------------------------------------------------------------------------------------
  const STYLE = `
  #smarthud-root {
    position: fixed;
    top: 16px;
    right: 16px;
    z-index: 999999;
    width: 270px;
    font-family: 'Consolas', 'Menlo', 'Courier New', monospace;
    color: #b6ffe8;
    user-select: none;
    pointer-events: auto;
  }
  #smarthud-panel {
    background: linear-gradient(180deg, rgba(6,14,16,0.92) 0%, rgba(4,10,12,0.94) 100%);
    border: 1px solid rgba(90,255,220,0.35);
    border-radius: 10px;
    box-shadow: 0 0 18px rgba(0,255,200,0.12), inset 0 0 30px rgba(0,255,200,0.03);
    backdrop-filter: blur(4px);
    overflow: hidden;
  }
  #smarthud-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 6px 10px;
    background: rgba(0,255,200,0.08);
    border-bottom: 1px solid rgba(90,255,220,0.25);
    cursor: move;
  }
  #smarthud-header .title {
    font-size: 11px;
    letter-spacing: 2px;
    color: #7fffd4;
    font-weight: bold;
  }
  #smarthud-header button {
    background: none;
    border: 1px solid rgba(127,255,212,0.4);
    color: #7fffd4;
    font-size: 10px;
    border-radius: 4px;
    padding: 1px 6px;
    cursor: pointer;
  }
  #smarthud-header button:hover {
    background: rgba(127,255,212,0.15);
  }
  #smarthud-body { padding: 10px 12px; }
  .smarthud-row {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    padding: 3px 0;
    border-bottom: 1px dashed rgba(127,255,212,0.12);
  }
  .smarthud-row:last-child { border-bottom: none; }
  .smarthud-label {
    font-size: 10px;
    letter-spacing: 1px;
    color: #6fae9f;
    text-transform: uppercase;
  }
  .smarthud-value {
    font-size: 17px;
    font-weight: bold;
    color: #eaffed;
    text-shadow: 0 0 6px rgba(0,255,180,0.45);
  }
  .smarthud-value .unit {
    font-size: 10px;
    color: #7fffd4;
    margin-left: 4px;
    text-shadow: none;
  }
  .smarthud-section-title {
    margin-top: 8px;
    margin-bottom: 2px;
    font-size: 10px;
    letter-spacing: 2px;
    color: #ffcf7f;
    border-top: 1px solid rgba(255,200,120,0.2);
    padding-top: 6px;
  }
  .smarthud-value.amber { color: #ffe3a8; text-shadow: 0 0 6px rgba(255,190,80,0.5); }
  .smarthud-value.dim { color: #6fae9f; text-shadow: none; font-size: 12px; }
  #smarthud-hint {
    font-size: 9px;
    color: #4d7d70;
    text-align: center;
    padding: 6px 0 0 0;
  }
  `;

  function injectStyle() {
    const s = document.createElement('style');
    s.textContent = STYLE;
    document.head.appendChild(s);
  }

  // ---------------------------------------------------------------------------------------
  // DOM build
  // ---------------------------------------------------------------------------------------
  let els = {};
  function buildHud() {
    const root = document.createElement('div');
    root.id = 'smarthud-root';
    root.innerHTML = `
      <div id="smarthud-panel">
        <div id="smarthud-header">
          <span class="title">◈ SMART HUD</span>
          <button id="smarthud-close" title="Hide (Shift+X)">✕</button>
        </div>
        <div id="smarthud-body">
          <div class="smarthud-row"><span class="smarthud-label">Ground Speed</span>
            <span class="smarthud-value" id="v-gs">-- <span class="unit">KT</span></span></div>
          <div class="smarthud-row"><span class="smarthud-label">Indicated Airspeed</span>
            <span class="smarthud-value" id="v-ias">-- <span class="unit">KT</span></span></div>
          <div class="smarthud-row"><span class="smarthud-label">True Airspeed</span>
            <span class="smarthud-value" id="v-tas">-- <span class="unit">KT</span></span></div>
          <div class="smarthud-row"><span class="smarthud-label">Altitude</span>
            <span class="smarthud-value" id="v-alt">-- <span class="unit">FT</span></span></div>
          <div class="smarthud-row"><span class="smarthud-label">Vertical Speed</span>
            <span class="smarthud-value" id="v-vs">-- <span class="unit">FPM</span></span></div>
          <div class="smarthud-row"><span class="smarthud-label">Heading</span>
            <span class="smarthud-value" id="v-hdg">-- <span class="unit">°</span></span></div>

          <div class="smarthud-section-title">FLIGHT PLAN (live from GeoFS NAV)</div>
          <div class="smarthud-row"><span class="smarthud-label">Next WP</span>
            <span class="smarthud-value amber" id="v-wpname">--</span></div>
          <div class="smarthud-row"><span class="smarthud-label">Dist / ETA</span>
            <span class="smarthud-value dim" id="v-wpeta">--</span></div>
          <div class="smarthud-row"><span class="smarthud-label">Top of Climb</span>
            <span class="smarthud-value dim" id="v-toc">--</span></div>
          <div class="smarthud-row"><span class="smarthud-label">Top of Descent</span>
            <span class="smarthud-value dim" id="v-tod">--</span></div>
          <div class="smarthud-row"><span class="smarthud-label">Destination ETA</span>
            <span class="smarthud-value dim" id="v-dest">--</span></div>
          <div id="smarthud-hint">Shift+X toggles HUD · drag header to move</div>
        </div>
      </div>
    `;
    document.body.appendChild(root);
    els.root = root;
    els.gs = root.querySelector('#v-gs');
    els.ias = root.querySelector('#v-ias');
    els.tas = root.querySelector('#v-tas');
    els.alt = root.querySelector('#v-alt');
    els.vs = root.querySelector('#v-vs');
    els.hdg = root.querySelector('#v-hdg');
    els.wpname = root.querySelector('#v-wpname');
    els.wpeta = root.querySelector('#v-wpeta');
    els.toc = root.querySelector('#v-toc');
    els.tod = root.querySelector('#v-tod');
    els.dest = root.querySelector('#v-dest');

    root.querySelector('#smarthud-close').addEventListener('click', () => setVisible(false));
    makeDraggable(root, root.querySelector('#smarthud-header'));
    restorePosition(root);
  }

  function makeDraggable(root, handle) {
    let dragging = false, offX = 0, offY = 0;
    handle.addEventListener('mousedown', (e) => {
      dragging = true;
      offX = e.clientX - root.getBoundingClientRect().left;
      offY = e.clientY - root.getBoundingClientRect().top;
      e.preventDefault();
    });
    window.addEventListener('mousemove', (e) => {
      if (!dragging) return;
      root.style.left = (e.clientX - offX) + 'px';
      root.style.top = (e.clientY - offY) + 'px';
      root.style.right = 'auto';
    });
    window.addEventListener('mouseup', () => {
      if (dragging) {
        dragging = false;
        storeSet(CONFIG.storageKeyPos, { left: root.style.left, top: root.style.top });
      }
    });
  }
  function restorePosition(root) {
    const pos = storeGet(CONFIG.storageKeyPos, null);
    if (pos && pos.left && pos.top) {
      root.style.left = pos.left;
      root.style.top = pos.top;
      root.style.right = 'auto';
    }
  }

  function setVisible(v) {
    els.root.style.display = v ? 'block' : 'none';
  }
  function toggleVisible() {
    setVisible(els.root.style.display === 'none');
  }

  // ---------------------------------------------------------------------------------------
  // Ground speed fallback estimator — only used if geofs.animation.values.groundSpeedKnt
  // is ever missing. Rolling ~2s window average (not frame-to-frame) so noise doesn't
  // get amplified into a jittery readout.
  // ---------------------------------------------------------------------------------------
  let gsSamples = [];
  let gsSmoothed = 0;
  function estimateGroundSpeedFallback() {
    const lla = G.geofs.aircraft.instance.llaLocation;
    if (!lla) return gsSmoothed;
    const now = performance.now();
    gsSamples.push({ t: now, lat: lla[0], lon: lla[1] });
    while (gsSamples.length && now - gsSamples[0].t > CONFIG.gsWindowMs) gsSamples.shift();
    if (gsSamples.length >= 2) {
      const oldest = gsSamples[0];
      const dtHours = (now - oldest.t) / 3600000;
      if (dtHours > 0.00005) {
        const distNm = greatCircleDistanceNm(oldest.lat, oldest.lon, lla[0], lla[1]);
        const windowedKt = distNm / dtHours;
        if (windowedKt < 4000) {
          gsSmoothed = gsSmoothed + CONFIG.gsSmoothing * (windowedKt - gsSmoothed);
        }
      }
    }
    return gsSmoothed;
  }

  // ---------------------------------------------------------------------------------------
  // Flight plan tracking — reads geofs.flightPlan.waypointArray live, tracks which leg
  // we're on ourselves (GeoFS's own `selected`/`trackedWaypoint` just reflects whichever
  // row was last clicked in the NAV panel UI, not necessarily what's ahead in the route,
  // so we don't rely on it for sequencing).
  // ---------------------------------------------------------------------------------------
  let activeIndex = 0;
  let lastFpSignature = null;

  function getFlightPlan() {
    const fp = G.geofs && G.geofs.flightPlan && G.geofs.flightPlan.waypointArray;
    return Array.isArray(fp) ? fp : null;
  }

  function fmtEta(hours) {
    if (!isFinite(hours) || hours <= 0) return '--';
    const totalMin = Math.round(hours * 60);
    const h = Math.floor(totalMin / 60);
    const m = totalMin % 60;
    return (h > 0 ? h + 'h ' : '') + m + 'm';
  }

  // Distance/ETA to a specific named waypoint (used for both regular next-WP display and
  // for looking up GeoFS's own computed T_O_C / T_O_D entries directly, when present)
  function distEtaTo(lat, lon, wp, gsKt) {
    if (!wp || typeof wp.lat !== 'number' || typeof wp.lon !== 'number') return null;
    const dist = greatCircleDistanceNm(lat, lon, wp.lat, wp.lon);
    const etaHours = gsKt > 5 ? dist / gsKt : NaN;
    return dist.toFixed(1) + ' nm · ETA ' + fmtEta(etaHours);
  }

  function updateFlightPlan(lat, lon, altFt, vsFpm, gsKt) {
    const fp = getFlightPlan();
    if (!fp || fp.length === 0) {
      els.wpname.textContent = '--';
      els.wpeta.textContent = 'no flight plan loaded';
      els.toc.textContent = '--';
      els.tod.textContent = '--';
      els.dest.textContent = '--';
      return;
    }

    // Reset sequencing if a new/different plan was loaded
    const sig = fp.length + '|' + (fp[0] && fp[0].ident) + '|' + (fp[fp.length - 1] && fp[fp.length - 1].ident);
    if (sig !== lastFpSignature) {
      activeIndex = 0;
      lastFpSignature = sig;
    }
    if (activeIndex >= fp.length) activeIndex = fp.length - 1;

    // Auto-advance once close to the active waypoint
    const active = fp[activeIndex];
    if (typeof active.lat === 'number' && typeof active.lon === 'number') {
      const distToActive = greatCircleDistanceNm(lat, lon, active.lat, active.lon);
      if (distToActive < CONFIG.wpAdvanceRadiusNm && activeIndex < fp.length - 1) {
        activeIndex++;
      }
    }

    const wp = fp[activeIndex];
    els.wpname.textContent = wp.ident || ('WP' + (activeIndex + 1));
    els.wpeta.textContent = distEtaTo(lat, lon, wp, gsKt) || 'no coordinates on this waypoint';

    // Destination = last entry in the route
    const dest = fp[fp.length - 1];
    let distToDestAlongRoute = 0;
    let ok = true;
    for (let i = activeIndex; i < fp.length; i++) {
      const from = i === activeIndex ? { lat, lon } : fp[i - 1];
      const to = fp[i];
      if (typeof to.lat !== 'number' || typeof to.lon !== 'number' ||
          typeof from.lat !== 'number' || typeof from.lon !== 'number') { ok = false; break; }
      distToDestAlongRoute += greatCircleDistanceNm(from.lat, from.lon, to.lat, to.lon);
    }
    if (ok) {
      const destEtaHours = gsKt > 5 ? distToDestAlongRoute / gsKt : NaN;
      els.dest.textContent = (dest.ident || 'DEST') + ' · ' + distToDestAlongRoute.toFixed(1) +
        ' nm · ETA ' + fmtEta(destEtaHours);
    } else {
      els.dest.textContent = '--';
    }

    // ---- TOP OF CLIMB ----
    // Preferred: GeoFS itself inserts a real "T_O_C" waypoint into the route with its own
    // computed position once a cruise altitude is set — just read that directly.
    const tocWp = fp.find((w) => w.ident === 'T_O_C');
    if (tocWp) {
      const line = distEtaTo(lat, lon, tocWp, gsKt);
      els.toc.textContent = line ? line + ' (GeoFS FPL)' : '--';
    } else {
      // Fallback: estimate from current climb rate toward the highest planned altitude
      // in the route, only used if GeoFS hasn't inserted its own T_O_C (e.g. no cruise
      // altitude set on the route yet).
      let cruiseAlt = null;
      for (const w of fp) {
        const a = parseAltField(w.alt);
        if (a !== null && (cruiseAlt === null || a > cruiseAlt)) cruiseAlt = a;
      }
      if (cruiseAlt !== null && vsFpm !== null && vsFpm > CONFIG.tocMinClimbFpm && altFt < cruiseAlt - 50) {
        const minutesToToc = (cruiseAlt - altFt) / vsFpm;
        els.toc.textContent = 'in ' + fmtEta(minutesToToc / 60) + ' (est., to ' + Math.round(cruiseAlt).toLocaleString() + ' ft)';
      } else if (cruiseAlt !== null && altFt >= cruiseAlt - 50) {
        els.toc.textContent = 'at cruise';
      } else {
        els.toc.textContent = '--';
      }
    }

    // ---- TOP OF DESCENT ----
    // Preferred: GeoFS's own computed "T_O_D" waypoint, same idea as T_O_C above.
    const todWp = fp.find((w) => w.ident === 'T_O_D');
    if (todWp) {
      const line = distEtaTo(lat, lon, todWp, gsKt);
      els.tod.textContent = line ? line + ' (GeoFS FPL)' : '--';
    } else if (ok) {
      // Fallback: classic 3nm-per-1000ft rule, assuming ~sea level at the destination
      // (GeoFS's DPT/DST waypoints carry alt=0 by spec, so real field elevation isn't
      // available to read — this is an approximation only used when GeoFS hasn't
      // computed its own T_O_D, e.g. no cruise altitude set).
      const heightToLoseKft = Math.max(0, altFt) / 1000;
      const descentDistNm = heightToLoseKft * CONFIG.todDescentGradientNmPerKft;
      const distanceToTodNm = distToDestAlongRoute - descentDistNm;
      if (heightToLoseKft <= 0.05) {
        els.tod.textContent = 'at/below profile';
      } else if (distanceToTodNm <= 0) {
        els.tod.textContent = 'now — begin descent (est.)';
      } else {
        const todEtaHours = gsKt > 5 ? distanceToTodNm / gsKt : NaN;
        els.tod.textContent = distanceToTodNm.toFixed(1) + ' nm · ETA ' + fmtEta(todEtaHours) + ' (est.)';
      }
    } else {
      els.tod.textContent = '--';
    }
  }

  // ---------------------------------------------------------------------------------------
  // Main update loop
  // ---------------------------------------------------------------------------------------
  function readNum(...candidates) {
    for (const v of candidates) {
      if (typeof v === 'number' && !isNaN(v)) return v;
    }
    return null;
  }

  function tick() {
    const av = G.geofs.animation.values;
    const ac = G.geofs.aircraft.instance;
    const lla = ac.llaLocation;
    if (!lla) return;

    const ias = readNum(av.kias);
    const tas = readNum(av.ktas, av.tas);
    const alt = readNum(av.altitude);
    const vs = readNum(av.verticalSpeed, av.climbrate);
    const hdg = readNum(av.heading, av.heading360);
    const gsDirect = readNum(av.groundSpeedKnt);
    const gsKt = gsDirect !== null ? gsDirect : estimateGroundSpeedFallback();

    els.gs.innerHTML = (gsKt ? gsKt.toFixed(0) : '--') + ' <span class="unit">KT</span>';
    els.ias.innerHTML = (ias !== null ? ias.toFixed(0) : '--') + ' <span class="unit">KT</span>';
    els.tas.innerHTML = (tas !== null ? tas.toFixed(0) : '--') + ' <span class="unit">KT</span>';
    els.alt.innerHTML = (alt !== null ? Math.round(alt).toLocaleString() : '--') + ' <span class="unit">FT</span>';
    els.vs.innerHTML = (vs !== null ? (vs > 0 ? '+' : '') + Math.round(vs).toLocaleString() : '--') +
      ' <span class="unit">FPM</span>';
    els.hdg.innerHTML = (hdg !== null ? Math.round(hdg).toString().padStart(3, '0') : '--') + ' <span class="unit">°</span>';

    updateFlightPlan(lla[0], lla[1], alt ?? 0, vs, gsKt);
  }

  // ---------------------------------------------------------------------------------------
  // Boot
  // ---------------------------------------------------------------------------------------
  console.log('[Smart HUD] Script injected, waiting for geofs to be ready...');
  waitForGeoFS(function () {
    injectStyle();
    buildHud();
    setInterval(tick, 1000 / CONFIG.updateHz);

    window.addEventListener('keydown', function (e) {
      const tag = (e.target && e.target.tagName || '').toLowerCase();
      if (tag === 'input' || tag === 'textarea') return;
      if (e.shiftKey && e.key.toLowerCase() === CONFIG.toggleKey) {
        toggleVisible();
      }
    });

    console.log('[Smart HUD] Loaded. Press Shift+' + CONFIG.toggleKey.toUpperCase() + ' to toggle.');
  });
})();
