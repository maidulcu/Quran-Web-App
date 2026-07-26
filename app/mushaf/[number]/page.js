import { getPage } from '../../lib/api';
import MushafView from './MushafView';

const TOTAL_PAGES = 604;

export async function generateMetadata({ params }) {
  const number = Math.max(1, Math.min(TOTAL_PAGES, Number(params.number) || 1));

  try {
    const data = await getPage(number);
    const surahs = Object.values(data.data.surahs);
    const surahNames = surahs.map(s => s.englishName).join(', ');

    return {
      title: `Mushaf Page ${number} - Quran Web App`,
      description: `Read Quran page ${number}${surahNames ? ` (${surahNames})` : ''} in the Mushaf page view.`,
      openGraph: {
        title: `Mushaf Page ${number} - Quran Web App`,
        description: `Read Quran page ${number} in the Mushaf page view.`,
        type: 'article',
      },
    };
  } catch {
    return {
      title: `Mushaf Page ${number} - Quran Web App`,
      description: `Read Quran page ${number} in the Mushaf page view.`,
    };
  }
}

export default async function MushafPage({ params }) {
  const number = Math.max(1, Math.min(TOTAL_PAGES, Number(params.number) || 1));
  let initialData = null;

  try {
    const result = await getPage(number);
    initialData = result.data;
  } catch {
    // Client component will handle the error state
  }

  return <MushafView initialData={initialData} pageNumber={number} />;
}
