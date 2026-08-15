# Quran Web App — Project Overview

A cross-platform Quran reader (web + Android APK) with **offline-first** reading,
recitation, tafsir, and translation. Built as a Next.js static export wrapped in
Capacitor, so the same codebase ships to the web and as a native Android app.

---

## 1. Purpose

Read and listen to the Holy Quran with:
- Arabic text (Uthmanic / Indo-Pak fonts), tajweed coloring
- Multiple English translations + word-by-word
- Tafsir (Jalalayn, Ibn Kathir, etc.)
- Audio recitation (streaming + offline download)
- Page-by-page **Mushaf** view
- Bookmarks, notes, reading progress, last-read tracking
- Verse-of-the-day, search, juz navigation

**Core differentiator:** works **fully offline from first launch** for the core
reading experience, and progressively caches everything else.

---

## 2. Tech Stack

| Layer        | Choice                                   |
|--------------|------------------------------------------|
| Framework    | Next.js 14 (App Router), React 18        |
| Language     | JavaScript (no TypeScript)               |
| Styling      | Tailwind CSS 3                           |
| Build output | `next export` (static) for mobile; `standalone` for web |
| Mobile shell | Capacitor 8 (Android)                    |
| Data source  | alquran.cloud v1 + quran.com api/v4      |
| Offline DB   | IndexedDB (via `lib/offlineStore.js`)    |
| Native APIs  | Capacitor core (plugins to be added)     |

> `package.json` exposes two build targets:
> - `npm run build` — web (`output: 'standalone'`, API rewrites proxy to Quran APIs)
> - `npm run build:mobile` — `NEXT_PUBLIC_BUILD_TARGET=mobile next build` → `output: 'export'` → static `out/`, then `npx cap sync android` bundles it into the APK.

---

## 3. Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      UI (React / Next)                    │
│  app/surah, app/mushaf, app/surahs, app/search, …         │
└───────────────┬───────────────────────────┬──────────────┘
                │                            │
        ┌───────▼────────┐          ┌────────▼─────────┐
        │  Context/Hooks │          │  lib/api.js       │
        │ AudioPlayer,   │          │  (local-first)    │
        │ useBookmarks,  │          └────────┬──────────┘
        │ useOfflineAudio│                   │ fetchJson()
        └────────────────┘          ┌────────▼──────────┐
                                    │ lib/offlineStore  │
                                    │  - IndexedDB cache│
                                    │  - audio blob store
                                    │  - bundled JSON   │
                                    └────────┬──────────┘
                       ┌─────────────────────▼─────────────────────┐
                       │  Data sources                              │
                       │  • /data/*.json  (pre-baked, ships in APK) │
                       │  • alquran.cloud / quran.com (network)     │
                       └───────────────────────────────────────────┘
```

### Data flow (local-first)
`fetchJson(url, { bundledPath })` resolves in this order:
1. **Bundled static asset** (`public/data/...json`) — ships inside the APK, works with zero network.
2. **IndexedDB cache** — anything previously viewed/downloaded.
3. **Network** — fetched and persisted for next time.
4. On network failure, **stale cache** is served so the app never hard-fails offline.

---

## 4. Directory Structure

```
app/
  layout.js                 Root layout (theme, providers, AudioPlayerBar)
  page.js                   Home (verse-of-day, surah grid, CTAs)
  surah/[id]/               Surah reader (SurahDetail)
  surahs/                   Surah list / browser
  mushaf/[number]/          Page-by-page Mushaf (MushafView + PageCanvas)
  juzs/                     Juz navigation
  search/                   Quran search
  bookmarks/ notes/ progress/   Personal data views
  components/               UI (Header, Footer, AudioPlayerBar, selectors, …)
  context/                  AudioPlayerContext (HTML5 audio player)
  hooks/                    State + persistence hooks (see §6)
  lib/
    api.js                  Local-first API service (all endpoints)
    offlineStore.js         IndexedDB cache + audio blob store (SSR-safe)
    audioCache.js           Offline recitation download/playback
    surahInfo.js tajweed.js verseOfDay.js
public/
  data/                     BAKED offline dataset (gitignored, regenerated)
    surahs.json
    surah/{id}/{ar.alafasy,en.sahih,quran-tajweed}.json
    tafsir/{id}/ar.jalalayn.json
    page/{1..604}.json
android/                    Capacitor Android project (gitignored)
scripts/
  build-offline-data.mjs    Bakes public/data from Quran APIs
  convert-images-to-webp.js Optimizes static images
```

---

## 5. Offline Support (status)

### ✅ Implemented (Tier 1: bundled core)
- **All 114 surahs** Arabic (`ar.alafasy`) + default translation (`en.sahih`) baked in.
- **Tajweed** markup for every surah baked in.
- **Jalalayn tafsir** for every surah baked in.
- **All 604 Mushaf pages** (Arabic + translation merged) baked in.
- Persistent **IndexedDB** cache for everything else (survives restart, works offline after first view).

### ✅ Implemented (audio offline)
- `lib/audioCache.js` stores recitation **mp3 blobs in IndexedDB**.
- `AudioPlayerContext` plays the **local copy when available**, and **auto-caches on play** (anything listened to works offline).
- `useOfflineAudio` hook + **per-surah download** for deliberate offline use.

### 🔜 Planned
- Native audio storage via `@capacitor/filesystem` (currently WebView IndexedDB — works in APK, but Filesystem is more robust/inspectable).
- Wi-Fi-gated background sync of not-yet-cached content.
- Pre-bake more translations/tafsirs (currently only defaults are bundled; others cache on view).

### Regenerating the baked data
```bash
npm run build:offline-data      # fetches + writes public/data (~22 MB)
```
`public/data/` is gitignored; run this before `npm run build:mobile`.

---

## 6. State & Personal Data

All personal data is persisted client-side (WebView-local):
- `useBookmarks` — bookmarked ayahs
- `useNotes` — per-ayah notes
- `useReadingProgress` — per-surah progress
- `useLastRead` / `useLastReadPage` — resume position
- `useTranslations` / `useTafsir` / `useTajweed` / `useFont` / `useFontSize` / `useWordByWord` — preferences

> **Current storage:** `localStorage`. **Planned:** migrate to `@capacitor/preferences`
> (encrypted, native) in the native-features phase.

---

## 7. Native Features (roadmap)

Capacitor plugins to add (currently only core is installed):
- `@capacitor/preferences` — replace localStorage
- `@capacitor/network` — online/offline detection + banner
- `@capacitor/share` — native share sheet for ayahs
- `@capacitor/haptics` — feedback on bookmark/play actions
- `@capacitor/status-bar` + `@capacitor/app` — theme + back-gesture handling
- `@capacitor/local-notifications` — daily verse reminder
- `@capacitor/filesystem` — robust offline audio storage

**Native UX:** safe-area insets, bottom sheets, pull-to-refresh, predictive back, splash with data-load state.

---

## 8. Build & Release

```bash
# Web
npm run build && npm start

# Mobile APK
npm run build:offline-data
npm run build:mobile          # -> out/ (static)
npx cap sync android          # copy web assets into android/
npx cap build android         # -> quran-app-debug.apk
```

Config: `capacitor.config.ts` (`webDir: 'out'`, `androidScheme: 'https'`),
`next.config.js` (mobile = `export`, `images.unoptimized`, no API rewrites).

---

## 9. Performance Notes

- App **shell is local** (static export bundled in APK) → instant launch.
- Offline dataset removes the biggest runtime cost (network + JSON parse).
- Long surah/ayah lists should be virtualized (see `OPTIMIZATION_*.md`).
- Images pre-baked as WebP (`convert-images-to-webp.js`).

See `OPTIMIZATION_ANALYSIS.md`, `OPTIMIZATION_ACTION_ITEMS.md`, and
`OPTIMIZATION_SUMMARY.md` for the full web-performance audit.

---

## 10. Roadmap (priority order)

1. **Offline core** — ✅ done (surahs, tafsir, tajweed, mushaf, audio cache).
2. **Native plugins** — Preferences, Network, Share, Haptics, StatusBar/App, Notifications, Filesystem.
3. **Native UX polish** — safe areas, bottom sheets, pull-to-refresh, back gesture.
4. **Rich offline** — Wi-Fi background sync, more bundled translations/tafsirs.
5. **Web perf** — virtualization, memoization, service worker for web PWA.
