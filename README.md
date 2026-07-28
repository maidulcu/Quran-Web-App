# Quran Web App

**Live:** [quran.learntrueislam.com](https://quran.learntrueislam.com)

A feature-rich, production-quality Quran web application built with **Next.js 14**, **React**, and **Tailwind CSS**. Read, listen, and reflect on the Holy Quran with Arabic text, translations, tafsir, tajweed, and audio recitations.

## Features

### Reading
- Browse all 114 Surahs with Arabic text and English translation
- Mushaf page view — page-by-page reading like a physical Quran (604 pages)
- Juz navigation — 30 juz index with verse references
- Multiple translations side-by-side (Sahih Intl., Yusuf Ali, Asad, Pickthall, Hilali)
- Word-by-word translation — tap words to see individual meanings
- Font switching — Uthmanic and Indo-Pak scripts
- Font size adjustment

### Audio
- High-quality audio recitation (Mishary Rashid Alafasy)
- Auto-advance through ayahs with queue
- Audio queue UI — see and manage upcoming ayahs
- Repeat mode — repeat ayah 1×, 3×, 5×, or infinite
- Adjustable playback speed (0.5× to 2×)
- Audio highlight — current ayah highlighted during playback

### Tafsir & Tajweed
- 5 tafsir editions: Jalalayn, Muyassar, Qurtubi, Ibn Kathir, Maarif al-Qur'an
- Tajweed coloring — color-coded rules (Ham Wasl, Lam, Ghunnah, Madd, Pause)
- Expandable tafsir sections per ayah

### Personalization
- Bookmarks — save and revisit favorite verses
- Note-taking — write personal notes on any ayah, view all at /notes
- Reading progress — tracks which ayahs you've read per surah
- Reading progress dashboard — overall stats, per-surah bars, sort/filter
- Last read — resume where you left off
- Verse of the Day — daily ayah on the homepage

### Design & UX
- Dark mode with anti-FOUC flash prevention
- Responsive design — mobile, tablet, desktop
- Custom scrollbar styling
- Fade-in animations on card entrance
- Sticky header with active nav highlighting
- Scroll-aware shadow on header
- Backdrop blur frosted glass effect
- Audio player bar — fixed bottom bar with progress, speed, queue, repeat

### SEO
- Dynamic metadata per surah page
- Open Graph and Twitter card tags
- Canonical URLs
- JSON-LD structured data
- XML sitemap (surahs + mushaf pages)
- robots.txt with sitemap reference
- Surah intros with summaries, themes, and virtues
- Internal linking to [learntrueislam.com](https://learntrueislam.com)

## Tech Stack

| Technology | Purpose |
|-----------|---------|
| [Next.js 14](https://nextjs.org/) | React framework with SSR/SSG |
| [React 18](https://reactjs.org/) | UI library |
| [Tailwind CSS](https://tailwindcss.com/) | Utility-first CSS |
| [AlQuran Cloud API](https://alquran.cloud/api) | Arabic text, audio, translations |
| [Quran.com API](https://quran.com) | Tafsir, word-by-word, additional translations |

## Project Structure

```
app/
├── components/        # Reusable UI components
│   ├── AudioPlayerBar.js      # Fixed bottom audio player
│   ├── Header.js              # Sticky nav with active highlighting
│   ├── Footer.js              # 3-column footer with links
│   ├── VerseOfDay.js          # Daily ayah display
│   ├── TranslationSelector.js # Multi-translation dropdown
│   ├── TafsirSelector.js      # Tafsir edition picker
│   ├── TajweedToggle.js       # Tajweed coloring toggle
│   ├── ProgressBar.js         # Reusable progress bar
│   └── MainWrapper.js         # Audio-aware layout wrapper
├── context/
│   └── AudioPlayerContext.js  # Audio state, queue, repeat, playback
├── hooks/
│   ├── useBookmarks.js        # Bookmark management
│   ├── useFont.js             # Font switching (Uthmanic/Indo-Pak)
│   ├── useLastRead.js         # Resume reading position
│   ├── useReadingProgress.js  # Per-surah progress tracking
│   ├── useTafsir.js           # Tafsir toggle + edition
│   ├── useTajweed.js          # Tajweed toggle
│   ├── useTranslations.js     # Multi-translation selection
│   └── useWordByWord.js       # Word-by-word toggle + data
├── lib/
│   ├── api.js                 # API service (AlQuran Cloud + Quran.com)
│   ├── surahInfo.js           # Surah summaries, themes, virtues
│   ├── verseOfDay.js          # Deterministic daily verse selector
│   └── tajweed.js             # Tajweed markup parser
├── surah/
│   └── [id]/
│       ├── page.js            # Server component with metadata
│       └── SurahDetail.js     # Main surah reading view
├── mushaf/[number]/           # Page-by-page mushaf reader
├── progress/                  # Reading progress dashboard
├── search/                    # Advanced search
├── bookmarks/                 # Saved verses
├── juzs/                      # 30 Juz index
├── surahs/                    # 114 Surahs grid
├── sitemap.js                 # Dynamic XML sitemap
├── robots.txt                 # Crawler directives
├── globals.css                # Fonts, scrollbar, animations, tajweed colors
└── layout.js                  # Root layout with providers
```

## Setup

```bash
# Clone the repository
git clone https://github.com/maidulcu/Quran-Web-App.git
cd Quran-Web-App

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Docker Deployment

```bash
# Build image
docker build -t quran-app .

# Run container
docker run -d -p 3000:3000 --name quran-app quran-app
```

## Environment

The app requires no environment variables. All configuration is in:
- `next.config.js` — API rewrites, image domains
- `app/layout.js` — site metadata, canonical URL
- `app/sitemap.js` — sitemap generation

## License

MIT
