<p align="center">
  <img src="icon_256.png" width="128" height="128" alt="GeoFS Smart HUD icon">
</p>

<h1 align="center">GeoFS Smart HUD</h1>

<p align="center">A clean, glass-cockpit style heads-up display for <a href="https://www.geo-fs.com/">GeoFS</a>, delivered as a Tampermonkey userscript.</p>

<p align="center">
  <img alt="version" src="https://img.shields.io/badge/version-2.2.0-7fffd4">
  <img alt="type" src="https://img.shields.io/badge/type-Tampermonkey%20userscript-blue">
  <img alt="compatible" src="https://img.shields.io/badge/GeoFS-v3.9%20%7C%20v4.0-orange">
  <img alt="license" src="https://img.shields.io/badge/license-Free%20Use%2C%20Non--Commercial-lightgrey">
</p>

Compatible with GeoFS **v3.9** and **v4.0**.

## Features

- **Ground Speed** — read directly from GeoFS's own `groundSpeedKnt` value
- **Indicated Airspeed (IAS)** and **True Airspeed (TAS)** — knots
- **Altitude** — feet (MSL)
- **Vertical Speed** — feet per minute
- **Heading** — degrees
- **Live flight-plan tracking** — reads your route straight out of GeoFS's own NAV panel, no manual entry:
  - Auto-advancing **next waypoint** with distance + ETA (correctly leapfrogs forward even if you spawn or teleport past several waypoints at once)
  - **Destination** ETA (name + remaining route distance)
  - **Top of Descent** — reads GeoFS's own computed `T_O_D` point directly when the route has one; falls back to a distance-based 3nm-per-1000ft estimate otherwise
- Draggable, position persists between sessions, and is clamped to the visible screen so it can't be dragged off-screen and lost
- Toggle visibility anytime with **Shift + X**
- Dark glass panel styling with cyan/amber PFD-style readouts

## Installation

1. Install the [Tampermonkey](https://www.tampermonkey.net/) browser extension if you don't already have it.
2. Open the [raw script file](https://raw.githubusercontent.com/machpoint82/Geofs-Smart-HUD/main/geofs-smart-hud.user.js) — Tampermonkey should prompt you to install it directly.
3. Confirm the install, then head to [geo-fs.com](https://www.geo-fs.com/) and load into a flight.
4. The HUD appears top-right once the aircraft finishes loading.

Because this script includes `@updateURL`/`@downloadURL` pointing at this repo, Tampermonkey will check for and offer newer versions automatically.

### Enabling automatic updates in Tampermonkey

Tampermonkey checks scripts with an `@updateURL` on its own schedule (roughly every 6+ hours), but this has to be turned on:

1. Open the Tampermonkey Dashboard.
2. Go to **Settings** (top tab).
3. Under **General → Update**, set **Check for userscript updates** to **Automatically** (or the shortest interval offered).
4. Also make sure **"Ignore installed scripts' own update policy"** is left unchecked, so this script's `@updateURL` is respected.

With this on, the HUD updates itself in the background. To force an immediate check instead of waiting, open the Tampermonkey Dashboard and click the update icon next to the script, or use **Utilities → Check for userscript updates**.

## Usage

| Action | How |
|---|---|
| Show/hide HUD | `Shift + X` |
| Move HUD | Drag the header bar |
| Close HUD | Click the ✕ in the header |
| Load a flight plan | Build a route in GeoFS's own NAV panel as usual — the HUD picks it up live |

## How it reads the game

GeoFS doesn't publish official documentation for most of its internals, so every field this script reads was recovered and confirmed by hand — either from GeoFS's public TypeScript typings (`@geps/geofs-types`), from community userscripts, or by directly inspecting live objects in the browser console:

| Readout | Source |
|---|---|
| IAS | `geofs.animation.values.kias` |
| TAS | `geofs.animation.values.ktas` (falls back to `.tas`) |
| Ground Speed | `geofs.animation.values.groundSpeedKnt` |
| Altitude | `geofs.animation.values.altitude` |
| Vertical Speed | `geofs.animation.values.verticalSpeed` (falls back to `.climbrate`) |
| Heading | `geofs.animation.values.heading` (falls back to `.heading360`) |
| Flight Plan | `geofs.flightPlan.waypointArray` — live array of waypoint objects (`ident`, `type`, `lat`, `lon`, `alt`, `spd`, `track`, `distanceNM`, `distanceThusfar`) backing GeoFS's own NAV panel |

If GeoFS changes these internal property names in a future update, the affected readout will show `--`. Check the browser console for `[Smart HUD]` log lines — the script logs its startup state to make debugging that easy.

## Known limitations

- **Top of Descent**, when GeoFS hasn't computed its own `T_O_D` point yet (e.g. no cruise altitude set on the route), falls back to an estimate that assumes the destination sits near sea level — GeoFS's flight-plan spec requires destination waypoints to carry `alt: 0`, so real field elevation isn't available to read. This fallback estimate is labeled `(est.)` in the HUD so it's clear when it isn't GeoFS's own number.
- **Top of Climb was deliberately left out.** With step climbs, "cruise altitude" isn't a single well-defined number, so any TOC estimate would be misleading more often than it'd be useful — better to not show a number than show a wrong one.

## Roadmap / ideas

- [ ] Wind-corrected GS/TAS delta readout
- [ ] OAT / autopilot altitude & heading bug display
- [ ] Smarter descent-point estimate using per-waypoint altitude constraints instead of a flat 3:1 rule, for the fallback case

## Contributing

This is a personal project — issues and suggestions welcome via GitHub Issues on this repo.

## Credits

- **[machpoint82](https://github.com/machpoint82)** — creator and maintainer
- Built with the help of **Claude** (Anthropic)
- Field/property references pulled from GeoFS's public [`@geps/geofs-types`](https://gpsystem.github.io/geofs-types/) typings, [official technical documentation](https://www.geo-fs.com/pages/documentation.php), and cross-checked against community userscripts including [GeoFS GPWS Alerts](https://greasyfork.org/en/scripts/523621-geofs-gpws-alerts) by Avramovic and the GeoFS MCDU script by zm
- Thanks to the wider GeoFS modding community for documenting the sim's internals despite it having no official public API

## License

Free to use, modify, and share — **not** for sale or commercial resale. See [`LICENSE`](LICENSE) for the full terms.
