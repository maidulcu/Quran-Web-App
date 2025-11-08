# Font Subsetting Guide for Quran Web App

## Overview
Font subsetting reduces font file sizes by including only the characters you actually use in your application. For the Quran Web App, this can reduce font sizes by 60-80%.

## Why Font Subsetting?

**Current Situation:**
- Font files can be 156 KB or larger
- Many characters in the font are never used
- This increases initial page load time

**After Subsetting:**
- Font files reduced to 30-60 KB
- Only Arabic characters and numbers are included
- Faster page loads and better performance

## How to Subset Fonts

### Method 1: Using Google Fonts (Recommended)

If you're using Google Fonts, Next.js can automatically optimize them:

```javascript
// app/layout.js
import { Scheherazade_New } from 'next/font/google'

const scheherazade = Scheherazade_New({
  weight: ['400', '700'],
  subsets: ['arabic'], // Only include Arabic subset
  display: 'swap',
})

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={scheherazade.className}>
      {/* ... */}
    </html>
  )
}
```

### Method 2: Using Local Fonts with next/font

```javascript
// app/layout.js
import localFont from 'next/font/local'

const quranFont = localFont({
  src: '../public/fonts/quran-font.woff2',
  display: 'swap',
})
```

### Method 3: Manual Subsetting with pyftsubset

Install fonttools:
```bash
pip install fonttools brotli
```

Create a subset:
```bash
pyftsubset original-font.ttf \
  --unicodes="U+0600-06FF,U+0750-077F,U+FB50-FDFF,U+FE70-FEFF" \
  --output-file="quran-font-subset.woff2" \
  --flavor=woff2
```

Unicode ranges for Arabic:
- `U+0600-06FF` - Arabic
- `U+0750-077F` - Arabic Supplement
- `U+FB50-FDFF` - Arabic Presentation Forms-A
- `U+FE70-FEFF` - Arabic Presentation Forms-B

### Method 4: Using glyphhanger

Install glyphhanger:
```bash
npm install -g glyphhanger
```

Generate subset based on actual usage:
```bash
glyphhanger --subset=original-font.ttf --formats=woff2 --css
```

## Implementation Steps

1. **Identify your font files:**
   ```bash
   ls -lh public/fonts/
   ```

2. **Choose subsetting method** based on your font source

3. **Update your CSS/Tailwind config** to use the new font:
   ```javascript
   // tailwind.config.js
   module.exports = {
     theme: {
       extend: {
         fontFamily: {
           quran: ['Quran Font', 'serif'],
         },
       },
     },
   }
   ```

4. **Test the font rendering** to ensure all characters display correctly

5. **Measure the improvement:**
   ```bash
   # Before
   ls -lh public/fonts/original-font.woff2

   # After
   ls -lh public/fonts/quran-font-subset.woff2
   ```

## Expected Results

- **Size Reduction:** 60-80% smaller font files
- **Load Time:** 100-300ms faster initial load
- **LCP Improvement:** 200-500ms improvement in Largest Contentful Paint

## Next.js Font Optimization

Next.js automatically optimizes fonts when you use `next/font`:

✅ Automatic subsetting
✅ Font display swap
✅ Preloading
✅ Self-hosting (no external requests)

## Resources

- [Next.js Font Optimization](https://nextjs.org/docs/basic-features/font-optimization)
- [Google Fonts with Next.js](https://nextjs.org/docs/pages/building-your-application/optimizing/fonts)
- [glyphhanger Documentation](https://github.com/zachleat/glyphhanger)
- [fonttools pyftsubset](https://fonttools.readthedocs.io/en/latest/subset/)

## Notes

- Always keep a backup of original font files
- Test thoroughly after subsetting to ensure no missing characters
- Use `font-display: swap` to prevent invisible text during loading
- Consider using system fonts as fallbacks
