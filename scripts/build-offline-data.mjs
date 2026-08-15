/**
 * Bakes the core Quran dataset into public/data so the APK works offline
 * from the very first launch.
 *
 *   - surahs list            -> public/data/surahs.json
 *   - Arabic (ar.alafasy)    -> public/data/surah/{id}/ar.alafasy.json
 *   - Default transl.        -> public/data/surah/{id}/en.sahih.json
 *   - Tajweed markup         -> public/data/surah/{id}/quran-tajweed.json
 *   - Jalalayn tafsir        -> public/data/tafsir/{id}/ar.jalalayn.json
 *
 * Run with:  npm run build:offline-data
 *
 * These files are also copied into the static export (out/data) by
 * `next build` and end up bundled inside the Android APK via Capacitor.
 */

import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DATA_DIR = join(ROOT, 'public', 'data');

const API = 'https://api.alquran.cloud/v1';
const TEXT_EDITIONS = ['ar.alafasy', 'en.sahih'];
const TAFSIR_ID = 'ar.jalalayn';
const OUT_TRANSLATION = 'en.sahih';

const CONCURRENCY = 4;
const RETRIES = 3;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getJSON(url) {
  let lastErr;
  for (let attempt = 1; attempt <= RETRIES; attempt++) {
    try {
      const res = await fetch(url);
      if (res.status === 429) {
        await sleep(1000 * attempt);
        continue;
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      lastErr = err;
      await sleep(500 * attempt);
    }
  }
  throw lastErr;
}

async function writeJSON(relPath, data) {
  const full = join(DATA_DIR, relPath);
  await mkdir(dirname(full), { recursive: true });
  await writeFile(full, JSON.stringify(data), 'utf8');
}

async function pool(items, worker) {
  let i = 0;
  const runners = Array.from({ length: CONCURRENCY }, async () => {
    while (i < items.length) {
      const item = items[i++];
      await worker(item);
    }
  });
  await Promise.all(runners);
}

async function main() {
  console.log('→ Fetching surah list…');
  const surahsRes = await getJSON(`${API}/surah`);
  await writeJSON('surahs.json', surahsRes);
  const surahNumbers = surahsRes.data.map((s) => s.number);
  console.log(`  ${surahNumbers.length} surahs found.`);

  let done = 0;
  const total = surahNumbers.length;
  const log = () => process.stdout.write(`\r  baked ${done}/${total} surahs`);

  await pool(surahNumbers, async (id) => {
    // 1. Arabic + default translation in one combined call.
    const combined = await getJSON(`${API}/surah/${id}/editions/${TEXT_EDITIONS.join(',')}`);
    for (const ed of TEXT_EDITIONS) {
      const surahObj = combined.data.find((d) => d.edition?.identifier === ed);
      if (surahObj) {
        await writeJSON(`surah/${id}/${ed}.json`, { code: combined.code, status: combined.status, data: surahObj });
      }
    }

    // 2. Tajweed-colored Arabic.
    const tajweed = await getJSON(`${API}/surah/${id}/quran-tajweed`);
    await writeJSON(`surah/${id}/quran-tajweed.json`, tajweed);

    // 3. Jalalayn tafsir.
    const tafsir = await getJSON(`${API}/surah/${id}/${TAFSIR_ID}`);
    await writeJSON(`tafsir/${id}/${TAFSIR_ID}.json`, tafsir);

    done++;
    log();
  });
  console.log('\n✓ Surahs/tafsir/tajweed baked.');

  // ── Mushaf pages (1..604) ────────────────────────────────────────────
  console.log('→ Baking 604 Mushaf pages…');
  const TOTAL_PAGES = 604;
  let paged = 0;
  await pool(
    Array.from({ length: TOTAL_PAGES }, (_, i) => i + 1),
    async (n) => {
      const [ar, tr] = await Promise.all([
        getJSON(`${API}/page/${n}/ar.alafasy`),
        getJSON(`${API}/page/${n}/en.sahih`),
      ]);
      const arAyahs = ar.data.ayahs;
      const trAyahs = tr.data.ayahs;
      const mergedAyahs = arAyahs.map((ayah, index) => ({
        ...ayah,
        translationText: trAyahs[index]?.text || '',
      }));
      await writeJSON(`page/${n}.json`, {
        data: { ...ar.data, ayahs: mergedAyahs, surahs: ar.data.surahs },
      });
      paged++;
      process.stdout.write(`\r  baked ${paged}/${TOTAL_PAGES} pages`);
    }
  );
  console.log('\n✓ Offline data baked into public/data');
}

main().catch((err) => {
  console.error('\n✗ Failed to build offline data:', err);
  process.exit(1);
});
