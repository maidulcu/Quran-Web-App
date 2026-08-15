/**
 * Bakes the core Quran dataset into public/data so the APK works offline
 * from the very first launch.
 *
 * Run with:  npm run build:offline-data
 * Resume:    npm run build:offline-data -- --resume
 */

import { mkdir, writeFile, readFile, access } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DATA_DIR = join(ROOT, 'public', 'data');

const API = 'https://api.alquran.cloud/v1';
const TEXT_EDITIONS = ['ar.alafasy', 'en.sahih'];
const TAFSIR_ID = 'ar.jalalayn';

const CONCURRENCY = 2; // Lower to avoid rate limits
const RETRIES = 5;
const BASE_DELAY = 1000;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const isResume = process.argv.includes('--resume');

async function getJSON(url) {
  let lastErr;
  for (let attempt = 1; attempt <= RETRIES; attempt++) {
    try {
      const res = await fetch(url);
      if (res.status === 429) {
        const delay = BASE_DELAY * Math.pow(2, attempt);
        console.log(`\n  Rate limited, waiting ${delay}ms...`);
        await sleep(delay);
        continue;
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      lastErr = err;
      const delay = BASE_DELAY * attempt;
      if (attempt < RETRIES) {
        await sleep(delay);
      }
    }
  }
  throw lastErr;
}

async function writeJSON(relPath, data) {
  const full = join(DATA_DIR, relPath);
  await mkdir(dirname(full), { recursive: true });
  await writeFile(full, JSON.stringify(data), 'utf8');
}

async function fileExists(relPath) {
  try {
    await access(join(DATA_DIR, relPath));
    return true;
  } catch {
    return false;
  }
}

async function pool(items, worker) {
  let i = 0;
  const errors = [];
  const runners = Array.from({ length: CONCURRENCY }, async () => {
    while (i < items.length) {
      const item = items[i++];
      try {
        await worker(item);
      } catch (err) {
        errors.push({ item, error: err });
      }
    }
  });
  await Promise.all(runners);
  return errors;
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

  const surahErrors = await pool(surahNumbers, async (id) => {
    const combinedPath = `surah/${id}/${TEXT_EDITIONS[0]}.json`;
    if (isResume && await fileExists(combinedPath)) {
      done++;
      log();
      return;
    }

    const combined = await getJSON(`${API}/surah/${id}/editions/${TEXT_EDITIONS.join(',')}`);
    for (const ed of TEXT_EDITIONS) {
      const surahObj = combined.data.find((d) => d.edition?.identifier === ed);
      if (surahObj) {
        await writeJSON(`surah/${id}/${ed}.json`, { code: combined.code, status: combined.status, data: surahObj });
      }
    }

    const tajweed = await getJSON(`${API}/surah/${id}/quran-tajweed`);
    await writeJSON(`surah/${id}/quran-tajweed.json`, tajweed);

    const tafsir = await getJSON(`${API}/surah/${id}/${TAFSIR_ID}`);
    await writeJSON(`tafsir/${id}/${TAFSIR_ID}.json`, tafsir);

    done++;
    log();
  });

  if (surahErrors.length > 0) {
    console.log(`\n  ⚠ ${surahErrors.length} surahs failed:`);
    surahErrors.forEach(e => console.log(`    - Surah ${e.item}: ${e.error.message}`));
  }

  console.log('\n✓ Surahs/tafsir/tajweed baked.');

  // ── Mushaf pages (1..604) ────────────────────────────────────────────
  console.log('→ Baking 604 Mushaf pages…');
  const TOTAL_PAGES = 604;
  let paged = 0;
  let skipped = 0;

  const pageErrors = await pool(
    Array.from({ length: TOTAL_PAGES }, (_, i) => i + 1),
    async (n) => {
      const pagePath = `page/${n}.json`;
      if (isResume && await fileExists(pagePath)) {
        paged++;
        skipped++;
        process.stdout.write(`\r  baked ${paged}/${TOTAL_PAGES} pages (skipped ${skipped} cached)`);
        return;
      }

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
      await writeJSON(pagePath, {
        data: { ...ar.data, ayahs: mergedAyahs, surahs: ar.data.surahs },
      });
      paged++;
      process.stdout.write(`\r  baked ${paged}/${TOTAL_PAGES} pages${skipped > 0 ? ` (skipped ${skipped} cached)` : ''}`);
    }
  );

  if (pageErrors.length > 0) {
    console.log(`\n\n  ⚠ ${pageErrors.length} pages failed:`);
    pageErrors.slice(0, 10).forEach(e => console.log(`    - Page ${e.item}: ${e.error.message}`));
    if (pageErrors.length > 10) console.log(`    ... and ${pageErrors.length - 10} more`);
    console.log(`\n  Run with --resume to retry failed pages.`);
  }

  console.log('\n✓ Offline data baked into public/data');
}

main().catch((err) => {
  console.error('\n✗ Failed to build offline data:', err.message || err);
  console.error('  Run with --resume to retry from where it left off.');
  process.exit(1);
});
