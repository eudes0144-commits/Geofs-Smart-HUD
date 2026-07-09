# GeoFS Smart HUD

A clean, glass-cockpit style heads-up display for [GeoFS](https://www.geo-fs.com/), delivered as a Tampermonkey userscript.

![status](https://img.shields.io/badge/version-1.0.0-7fffd4) ![type](https://img.shields.io/badge/type-Tampermonkey%20userscript-blue) ![compatible](https://img.shields.io/badge/GeoFS-v3.9%20%7C%20v4.0-orange)

Compatible with GeoFS **v3.9** and **v4.0**.

## Features

- **Ground Speed** — computed live from the aircraft's position over a rolling ~2 second window (GeoFS doesn't expose a raw ground speed value, so this is calculated using great-circle distance / time, smoothed to avoid jitter)
- **Indicated Airspeed (IAS)** — knots
- **True Airspeed (TAS)** — knots
- **Altitude** — feet (MSL)
- **Vertical Speed** — feet per minute
- Draggable, position persists between sessions
- Toggle visibility anytime with **Shift + X**
- Dark glass panel styling with cyan/amber PFD-style readouts — built to look like it belongs in the cockpit, not bolted onto the browser

## Installation

1. Install the [Tampermonkey](https://www.tampermonkey.net/) browser extension if you don't already have it.
2. Open the [raw script file](https://raw.githubusercontent.com/eudes0144-commits/Geofs-Smart-HUD/main/geofs-smart-hud.user.js) — Tampermonkey should prompt you to install it directly.
3. Confirm the install, then head to [geo-fs.com](https://www.geo-fs.com/) and load into a flight.
4. The HUD appears top-right once the aircraft finishes loading.

Because this script includes `@updateURL`/`@downloadURL` pointing at this repo, Tampermonkey will automatically check for and offer newer versions — no manual reinstall needed for future updates.

## Usage

| Action | How |
|---|---|
| Show/hide HUD | `Shift + X` |
| Move HUD | Drag the header bar |
| Close HUD | Click the ✕ in the header |

## How it reads the game

GeoFS doesn't publish official documentation for its internals, so this script pulls values from properties recovered through GeoFS's public TypeScript typings (`@geps/geofs-types`) and cross-referenced against community userscripts:

| Readout | Source |
|---|---|
| IAS | `geofs.animation.values.kias` |
| TAS | `geofs.animation.values.ktas` (falls back to `.tas`) |
| Altitude | `geofs.animation.values.altitude` |
| Vertical Speed | `geofs.animation.values.climbrate` (falls back to `.verticalSpeed`) |
| Ground Speed | Not exposed by GeoFS — calculated in-script from `geofs.aircraft.instance.llaLocation` position deltas |

If GeoFS changes these internal property names in a future update, the affected readout will show `--`. Check the browser console for `[Smart HUD]` log lines — the script logs its startup state to make debugging that easy.

## Known limitations

- No flight-plan / ETA tracking. This was attempted in an earlier version but GeoFS's native flight-plan feature isn't exposed as a stable, scriptable object, and manual waypoint entry (typing lat/long for every point) wasn't worth the friction. May revisit if a reliable read path is found.
- Ground speed is a live estimate, not a raw sim value — expect a brief settling period right after a sudden speed change.

## Roadmap / ideas

- [ ] Flight-plan read + ETA/TOD tracking, if a stable data source is found
- [ ] Wind-corrected GS/TAS delta readout
- [ ] OAT / autopilot altitude & heading bug display

## Contributing

This is a personal project — issues and suggestions welcome via GitHub Issues on this repo.

## Credits

- **[eudes0144-commits](https://github.com/eudes0144-commits)** — creator and maintainer
- Built with the help of **Claude** (Anthropic)
- Field/property references pulled from GeoFS's public [`@geps/geofs-types`](https://gpsystem.github.io/geofs-types/) typings, and cross-checked against community userscripts including the [GeoFS GPWS Alerts](https://greasyfork.org/en/scripts/523621-geofs-gpws-alerts) script by Avramator
- Thanks to the wider GeoFS modding community for documenting the sim's internals despite it having no official public API

## License

MIT — do whatever you want with it.
