export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/bookmarks'],
      },
    ],
    sitemap: 'https://quran-web-app.vercel.app/sitemap.xml',
  };
}
