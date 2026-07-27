export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/bookmarks'],
      },
    ],
    sitemap: 'https://quran.learntrueislam.com/sitemap.xml',
  };
}
