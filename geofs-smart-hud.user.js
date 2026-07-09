// ==UserScript==
// @name         GeoFS Smart HUD
// @namespace    https://github.com/eudes0144-commits
// @version      1.0.0
// @description  Professional glass-cockpit style HUD for GeoFS — ground speed, IAS, TAS, altitude, vertical speed. Toggle with Shift+X.
// @author       machpoint82
// @match        https://www.geo-fs.com/*
// @match        https://*.geo-fs.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-idle
// @updateURL    https://raw.githubusercontent.com/eudes0144-commits/Geofs-Smart-HUD/main/geofs-smart-hud.user.js
// @downloadURL  https://raw.githubusercontent.com/eudes0144-commits/Geofs-Smart-HUD/main/geofs-smart-hud.user.js
// ==/UserScript==

(function () {
  'use strict';

  // Using @grant (GM_setValue/GM_getValue) puts this script in a sandboxed execution
  // context where `window` is NOT the page's real window — so `window.geofs` would be
  // undefined forever even though the page has a real `geofs` global. `unsafeWindow`
  // is Tampermonkey's escape hatch to reach the actual page context.
  const G = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;

  // ===========================================================================================
  // NOTES ON GAME DATA SOURCES (read this if something ever shows "--")
  // ===========================================================================================
  //   geofs.animation.values.kias        -> indicated airspeed, knots
  //   geofs.animation.values.ktas        -> true airspeed, knots        (fallback: .tas)
  //   geofs.animation.values.altitude    -> altitude, feet (MSL)
  //   geofs.animation.values.climbrate   -> vertical speed, ft/min      (fallback: .verticalSpeed)
  //   geofs.aircraft.instance.llaLocation -> [lat_deg, lon_deg, alt]
  //
  // GROUND SPEED: GeoFS does not expose a raw ground-speed value anywhere. This script
  // computes it itself from llaLocation samples using the haversine formula, averaged over
  // a rolling ~2 second window (not frame-to-frame) so small position/physics noise doesn't
  // get amplified into a jittery readout.
  // ===========================================================================================

  const CONFIG = {
    toggleKey: 'x',          // Shift + this key toggles the HUD
    updateHz: 5,             // HUD refresh rate
    gsWindowMs: 2000,        // rolling window used to average ground speed
    gsSmoothing: 0.25,       // extra smoothing applied on top of the windowed average
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
  // Styles
  // ---------------------------------------------------------------------------------------
  const STYLE = `
  #smarthud-root {
    position: fixed;
    top: 16px;
    right: 16px;
    z-index: 999999;
    width: 230px;
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
  // Ground speed estimation — rolling ~2s window average, not frame-to-frame, so small
  // position/physics noise doesn't get amplified into a jittery readout.
  // ---------------------------------------------------------------------------------------
  let gsSamples = [];       // { t, lat, lon }
  let gsSmoothed = 0;
  function updateGroundSpeed() {
    const lla = G.geofs.aircraft.instance.llaLocation;
    if (!lla) return gsSmoothed;
    const now = performance.now();

    gsSamples.push({ t: now, lat: lla[0], lon: lla[1] });
    while (gsSamples.length && now - gsSamples[0].t > CONFIG.gsWindowMs) {
      gsSamples.shift();
    }

    if (gsSamples.length >= 2) {
      const oldest = gsSamples[0];
      const dtHours = (now - oldest.t) / 3600000;
      if (dtHours > 0.00005) { // avoid divide-by-near-zero on the very first samples
        const distNm = greatCircleDistanceNm(oldest.lat, oldest.lon, lla[0], lla[1]);
        const windowedKt = distNm / dtHours;
        if (windowedKt < 4000) { // reject teleport/reset spikes
          gsSmoothed = gsSmoothed + CONFIG.gsSmoothing * (windowedKt - gsSmoothed);
        }
      }
    }
    return gsSmoothed;
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
    const vs = readNum(av.climbrate, av.verticalSpeed);
    const gsKt = updateGroundSpeed();

    els.gs.innerHTML = (gsKt ? gsKt.toFixed(0) : '--') + ' <span class="unit">KT</span>';
    els.ias.innerHTML = (ias !== null ? ias.toFixed(0) : '--') + ' <span class="unit">KT</span>';
    els.tas.innerHTML = (tas !== null ? tas.toFixed(0) : '--') + ' <span class="unit">KT</span>';
    els.alt.innerHTML = (alt !== null ? Math.round(alt).toLocaleString() : '--') + ' <span class="unit">FT</span>';
    els.vs.innerHTML = (vs !== null ? (vs > 0 ? '+' : '') + Math.round(vs).toLocaleString() : '--') +
      ' <span class="unit">FPM</span>';
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
