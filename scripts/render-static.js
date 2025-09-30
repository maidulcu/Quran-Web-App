import fs from 'fs';
import path from 'path';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { fileURLToPath } from 'url';

import SurahDetail from '../src/pages/SurahDetail.jsx';
import surahList from '../src/data/surahList.json';

// Support __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// HTML wrapper
const htmlTemplate = (content) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Quran Surah</title>
</head>
<body>
  <div id="root">${content}</div>
</body>
</html>
`;

const outputDir = path.resolve(__dirname, '../dist/surah');

async function renderSurahs() {
  for (const surah of surahList) {
    const html = ReactDOMServer.renderToStaticMarkup(
      React.createElement(SurahDetail, { id: surah.id.toString() })
    );

    const fullHtml = htmlTemplate(html);
    const surahPath = path.join(outputDir, `${surah.id}`);
    const filePath = path.join(surahPath, 'index.html');

    fs.mkdirSync(surahPath, { recursive: true });
    fs.writeFileSync(filePath, fullHtml);

    console.log(`✅ Saved: /surah/${surah.id}/index.html`);
  }
}

renderSurahs().catch(console.error);