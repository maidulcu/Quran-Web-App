const SURAH_INFO = {
  1: {
    summary: 'Surah Al-Fatihah is the opening chapter of the Quran, consisting of 7 verses. It is recited in every unit of the daily prayers and is considered the essence of the Quran. Known as Umm al-Quran (Mother of the Quran), it contains a comprehensive supplication for guidance, the straight path, and mercy.',
    themes: ['Prayer and supplication', 'Divine mercy and compassion', 'The straight path (Sirat al-Mustaqim)', 'Worship and servitude to Allah'],
    virtues: 'The Prophet Muhammad (peace be upon him) said: "There is no Quran except Al-Fatihah" (Sahih Bukhari). It is the most recited chapter in Islamic prayers.',
    famousVerses: [
      { ayah: 6, name: 'Sirat al-Mustaqim', description: 'The path of those upon whom You have bestowed favor' },
    ],
    relatedTopics: ['prayer-in-islam', 'guidance-in-quran'],
  },
  2: {
    summary: 'Surah Al-Baqarah (The Cow) is the longest chapter of the Quran with 286 verses. Revealed in Medina, it covers fundamental Islamic beliefs, laws, and historical narratives. It includes Ayat al-Kursi (Verse 255), one of the most well-known verses in the Quran, and concludes with a profound covenant between Allah and the believers.',
    themes: ['Faith and disbelief', 'Islamic jurisprudence (Fiqh)', 'Stories of previous prophets', 'The cow of Moses', 'Ayat al-Kursi', 'Covenant and accountability'],
    virtues: 'The Prophet (peace be upon him) said: "Recite Surah Al-Baqarah, for taking it is a blessing and leaving it is a cause of grief" (Muslim). Reciting it protects against Shaytan and brings barakah (blessing) in the home.',
    famousVerses: [
      { ayah: 255, name: 'Ayat al-Kursi', description: 'The Throne Verse - one of the most recited verses in the Quran, affirming Allah\'s absolute sovereignty and knowledge.' },
      { ayah: 282, name: 'Verse of Debt', description: 'The longest verse in the Quran, establishing rules for financial transactions and debt documentation.' },
      { ayah: 286, name: 'Final Verse', description: 'Allah does not burden a soul beyond that it can bear.' },
    ],
    relatedTopics: ['ayat-al-kursi', 'stories-of-prophets', 'islamic-law'],
  },
  3: {
    summary: 'Surah Ali Imran (The Family of Imran) contains 200 verses and takes its name from the family of Imran, the father of Maryam (Mary). Revealed in Medina, it discusses the stories of Maryam, Prophet Isa (Jesus), and previous prophets, while also addressing matters of faith, unity, and the Battle of Uhud.',
    themes: ['Stories of Maryam and Isa', 'The Council of the People of the Book', 'Unity and brotherhood', 'Lessons from the Battle of Uhud', 'The nature of revelation'],
    virtues: 'This surah is a comprehensive guide to understanding the commonalities between Islam, Christianity, and Judaism, while affirming the final prophethood of Muhammad (peace be upon him).',
    famousVerses: [
      { ayah: 52, name: 'Testimony of the Disciples', description: 'The disciples of Isa testified to their faith in Allah.' },
      { ayah: 185, name: 'Death and Accountability', description: 'Every soul shall taste death. You will be paid your wages in full on the Day of Resurrection.' },
    ],
    relatedTopics: ['isa-in-quran', 'maryam-in-quran', 'monotheism'],
  },
  4: {
    summary: 'Surah An-Nisa (The Women) contains 176 verses and addresses issues related to women\'s rights, inheritance, marriage, and social justice. It covers the creation of humanity from a single soul, the rights of orphans, and the importance of justice in all dealings.',
    themes: ['Women\'s rights in Islam', 'Inheritance laws', 'Marriage and divorce', 'Orphans\' rights', 'Justice and equality', 'The Hypocrites'],
    virtues: 'This surah establishes a framework for gender justice that was revolutionary for its time, giving women inheritance rights, property rights, and dignity.',
    famousVerses: [
      { ayah: 34, name: 'Men\'s Responsibility', description: 'Men are the protectors and maintainers of women.' },
    ],
    relatedTopics: ['womens-rights-islam', 'islamic-law', 'marriage-in-islam'],
  },
  5: {
    summary: 'Surah Al-Maidah (The Table Spread) contains 112 verses and deals with dietary laws, contracts, and the completion of Islam as a religion. It references the table spread sent down to Prophet Isa and discusses the covenant of prophethood.',
    themes: ['Dietary laws', 'Fulfilling contracts', 'The table spread of Isa', 'Completion of religion', 'Washing before prayer'],
    virtues: 'This surah was revealed during the later Medinan period and contains some of the final rulings of Islamic law.',
    famousVerses: [
      { ayah: 67, name: 'Message of Islam', description: 'O Messenger, convey what has been revealed to you from your Lord.' },
    ],
    relatedTopics: ['halal-haram', 'islamic-law', 'jesus-in-islam'],
  },
  6: {
    summary: 'Surah Al-Anam (The Cattle) contains 165 verses and primarily addresses the mushrikeen (polytheists) of Makkah, refuting their false beliefs about idols, intercession, and the nature of divine provision. It was revealed in Makkah.',
    themes: ['Monotheism (Tawhid)', 'Refutation of polytheism', 'Divine provision and sustenance', 'Accountability on Judgment Day'],
    virtues: 'This surah provides comprehensive arguments against idol worship and establishes the foundation of Islamic monotheism.',
    famousVerses: [
      { ayah: 102, name: 'Allah is the Creator', description: 'To Allah alone belongs the creation and the command.' },
    ],
    relatedTopics: ['monotheism', 'polytheism-refuted', 'allahs-names'],
  },
  7: {
    summary: 'Surah Al-Araf (The Heights) contains 206 verses and is named after the barrier (Al-Araf) between Paradise and Hell. It recounts stories of Adam, Iblis (Satan), Nuh (Noah), Hud, Salih, Lut, Shu\'ayb, and Musa (Moses).',
    themes: ['The story of Adam and Iblis', 'Stories of previous prophets', 'The barrier between Paradise and Hell', 'The Day of Judgment'],
    virtues: 'This surah contains detailed narratives of prophets that serve as warnings and lessons for all of humanity.',
    famousVerses: [
      { ayah: 180, name: 'Names of Allah', description: 'The most beautiful names belong to Allah, so call Him by them.' },
    ],
    relatedTopics: ['adam-and-eve', 'satan-in-islam', 'stories-of-prophets'],
  },
  8: {
    summary: 'Surah Al-Anfal (The Spoils of War) contains 75 verses and was revealed after the Battle of Badr. It discusses the rules of warfare, the distribution of spoils, and the importance of obedience to Allah and His Messenger.',
    themes: ['Rules of warfare', 'Distribution of spoils', 'The Battle of Badr', 'Obedience to leadership', 'Trust in Allah'],
    virtues: 'This surah establishes ethical guidelines for warfare in Islam, emphasizing restraint, mercy, and adherence to divine commandments.',
    famousVerses: [
      { ayah: 30, name: 'Allah\'s Help at Badr', description: 'Remember when you were few and oppressed in the land, fearing that people might kidnap you.' },
    ],
    relatedTopics: ['battle-of-badr', 'islamic-law', 'jihad-in-islam'],
  },
  9: {
    summary: 'Surah At-Tawbah (The Repentance) contains 129 verses and is the only chapter that does not begin with Bismillah. It deals with the breaking of treaties by the polytheists, the hypocrites in Medina, and the expedition to Tabuk.',
    themes: ['Repentance and forgiveness', 'Breaking of treaties', 'The hypocrites', 'Expedition to Tabuk', 'Zakat and charity'],
    virtues: 'This surah emphasizes that true repentance requires both sincerity and action, and warns against hypocrisy.',
    famousVerses: [
      { ayah: 111, name: 'Allah\'s Bargain', description: 'Indeed, Allah has purchased from the believers their lives and their properties in exchange for Paradise.' },
    ],
    relatedTopics: ['repentance-in-islam', 'hypocrisy-in-islam', 'charity-in-islam'],
  },
  10: {
    summary: 'Surah Yunus (Jonah) contains 109 verses and is named after Prophet Yunus (Jonah), who was swallowed by a whale. It was revealed in Makkah and addresses the mushrikeen, affirming the truth of the Quran and the prophethood of Muhammad.',
    themes: ['Prophethood of Muhammad', 'Stories of previous prophets', 'The story of Yunus', 'Signs of Allah in creation'],
    virtues: 'This surah contains one of the most profound discussions about the nature of divine mercy and the consequences of rejecting the truth.',
    famousVerses: [
      { ayah: 57, name: 'Guidance and Healing', description: 'O mankind, there has to come to you instruction from your Lord and healing for what is in the breasts.' },
    ],
    relatedTopics: ['jonah-in-quran', 'guidance-in-quran', 'signs-of-allah'],
  },
  11: {
    summary: 'Surah Hud contains 123 verses and is named after Prophet Hud, who was sent to the people of Ad. It recounts the stories of multiple prophets, including Nuh, Hud, Salih, Ibrahim, Lut, and Shu\'ayb.',
    themes: ['Stories of prophets', 'The people of Ad', 'Divine punishment for disbelievers', 'Patience and perseverance'],
    virtues: 'The Prophet (peace be upon him) said: "I have been given something better than that" when asked about Surah Hud.',
    famousVerses: [],
    relatedTopics: ['stories-of-prophets', 'divine-punishment', 'patience-in-islam'],
  },
  12: {
    summary: 'Surah Yusuf (Joseph) contains 111 verses and tells the complete story of Prophet Yusuf (Joseph) from beginning to end. It is considered one of the most beautiful narratives in the Quran.',
    themes: ['The story of Yusuf', 'Dreams and their interpretation', 'Patience and trust in Allah', 'Family dynamics', 'Forgiveness and reconciliation'],
    virtues: 'This surah is the most detailed narrative of any prophet in the Quran and provides lessons in patience, trust, and forgiveness.',
    famousVerses: [
      { ayah: 101, name: ' Yusuf\'s Trust', description: 'My Lord, You have given me authority and taught me the interpretation of dreams.' },
    ],
    relatedTopics: ['joseph-in-quran', 'patience-in-islam', 'dreams-in-islam'],
  },
  13: {
    summary: 'Surah Ar-Rad (The Thunder) contains 43 verses and discusses the power of Allah in nature, the Quran as a revelation, and the fate of those who reject the truth.',
    themes: ['Allah\'s power in creation', 'The Quran as a revelation', 'Resurrection and accountability', 'The thunder as a sign of Allah'],
    virtues: 'This surah provides a beautiful reflection on natural phenomena as signs of divine power.',
    famousVerses: [
      { ayah: 28, name: 'Heart\'s Tranquility', description: 'Verily, in the remembrance of Allah do hearts find tranquility.' },
    ],
    relatedTopics: ['allahs-names', 'signs-of-allah', 'quran-as-revelation'],
  },
  14: {
    summary: 'Surah Ibrahim contains 52 verses and is named after Prophet Ibrahim (Abraham). It discusses the prayer of Ibrahim, the consequences of disbelief, and the mercy of Allah.',
    themes: ['Ibrahim\'s prayer for his son', 'The consequences of disbelief', 'Allah\'s mercy and provision', 'The Day of Judgment'],
    virtues: 'This surah highlights the importance of sincere supplication and trust in Allah\'s plan.',
    famousVerses: [],
    relatedTopics: ['abraham-in-quran', 'supplication-in-islam'],
  },
  15: {
    summary: 'Surah Al-Hijr contains 99 verses and takes its name from the rocky tract where the people of Lut were destroyed. It discusses the creation of Adam, the fate of disbelieving nations, and the protection of the Quran.',
    themes: ['Creation of Adam', 'The people of Lut', 'Protection of the Quran', 'The people of Hijr (Thamud)'],
    virtues: 'This surah emphasizes Allah\'s protective power over His revelation.',
    famousVerses: [
      { ayah: 9, name: 'Protection of the Quran', description: 'Indeed, it is We who sent down the Quran and indeed, We will be its guardian.' },
    ],
    relatedTopics: ['adam-in-quran', 'lot-in-quran', 'preservation-of-quran'],
  },
  16: {
    summary: 'Surah An-Nahl (The Bee) contains 128 verses and takes its name from the bee, which is presented as a sign of Allah\'s creative power. It discusses divine blessings, the nature of revelation, and the consequences of ingratitude.',
    themes: ['Divine blessings', 'The bee as a sign', 'Revelation and prophecy', 'Ingratitude vs. gratitude', 'Honey as medicine'],
    virtues: 'This surah contains 104 commands and prohibitions, making it one of the most legally significant chapters.',
    famousVerses: [
      { ayah: 90, name: 'Justice and Goodness', description: 'Indeed, Allah commands justice, good conduct, and giving to relatives.' },
    ],
    relatedTopics: ['signs-of-allah', 'islamic-law', 'gratitude-in-islam'],
  },
  17: {
    summary: 'Surah Al-Isra (The Night Journey) contains 111 verses and describes the miraculous night journey of Prophet Muhammad from Makkah to Jerusalem and his ascension to the heavens. It also discusses moral guidance and the story of Adam and Iblis.',
    themes: ['The Night Journey (Isra and Mi\'raj)', 'Children\'s rights', 'Moral guidance', 'The creation of the heavens and earth', 'The story of Adam and Iblis'],
    virtues: 'This surah contains the command for the five daily prayers, established during the Mi\'raj.',
    famousVerses: [
      { ayah: 23, name: 'Rights of Parents', description: 'Your Lord has decreed that you worship none but Him, and that you be kind to parents.' },
    ],
    relatedTopics: ['night-journey', 'mi-raj', 'parents-rights-islam'],
  },
  18: {
    summary: 'Surah Al-Kahf (The Cave) contains 110 verses and contains four major stories: the People of the Cave, the owner of two gardens, Musa and Al-Khidr, and Dhul-Qarnayn. It is recommended to recite it every Friday.',
    themes: ['The People of the Cave (Sleepers)', 'The owner of two gardens', 'Musa and Al-Khidr', 'Dhul-Qarnayn and the barrier of Gog and Magog', 'Trials of faith'],
    virtues: 'The Prophet (peace be upon him) said: "Whoever recites Surah Al-Kahf on Friday, a light will shine for him from one Friday to the next" (Sahih Muslim). It also protects against the Dajjal (Antichrist).',
    famousVerses: [
      { ayah: 82, name: 'Dhul-Qarnayn\'s Wall', description: 'He found it set upon a people and he found a sun setting in a spring of black mud.' },
    ],
    relatedTopics: ['people-of-the-cave', 'dhul-qarnayn', 'friday-recitation', 'dajjal'],
  },
  19: {
    summary: 'Surah Maryam contains 98 verses and is named after Maryam (Mary), the mother of Prophet Isa (Jesus). It provides a detailed account of her miraculous conception, the birth of Isa, and the prayers of Zakariya and Ibrahim.',
    themes: ['The story of Maryam', 'The birth of Isa', 'Zakariya\'s prayer for a child', 'Ibrahim and his father', 'The Day of Judgment'],
    virtues: 'This surah contains some of the most beautiful narratives about faith and divine intervention.',
    famousVerses: [
      { ayah: 16, name: 'Maryam\'s Seclusion', description: 'She secluded herself in a chamber from her family.' },
    ],
    relatedTopics: ['mary-in-quran', 'jesus-in-islam', 'zakariya-in-quran'],
  },
  20: {
    summary: 'Surah Taha contains 135 verses and takes its name from the mysterious letters at its beginning. It recounts the story of Musa (Moses) at the burning bush, his confrontation with Pharaoh, and the creation of Adam.',
    themes: ['The story of Musa', 'Pharaoh\'s tyranny', 'The creation of Adam', 'The purpose of the Quran', 'The Day of Judgment'],
    virtues: 'This surah is particularly powerful in addressing those who are new to the Quran, as it provides guidance and comfort.',
    famousVerses: [
      { ayah: 25-28, name: 'Musa\'s Prayer', description: 'My Lord, expand for me my breast and ease for me my task.' },
    ],
    relatedTopics: ['moses-in-quran', 'pharaoh-in-quran', 'adam-in-quran'],
  },
};

const DEFAULT_INFO = {
  summary: '',
  themes: [],
  virtues: '',
  famousVerses: [],
  relatedTopics: [],
};

export function getSurahInfo(surahId) {
  return SURAH_INFO[surahId] || DEFAULT_INFO;
}

export default SURAH_INFO;
