const TAJWEED_RULES = {
  h: { cls: 'tajweed-ham', label: 'Ham Wasl' },
  l: { cls: 'tajweed-lam', label: 'Lam Shamsiyya' },
  n: { cls: 'tajweed-ghunnah', label: 'Ghunnah' },
  m: { cls: 'tajweed-madd', label: 'Madd' },
  p: { cls: 'tajweed-pause', label: 'Pause / Tafkheem' },
};

const TAG_RE = /\[(\w+(?::\d+)?)\[([^\]]*)\]/g;

export function parseTajweedText(text) {
  return text.replace(TAG_RE, (_, tag, content) => {
    const ruleId = tag.includes(':') ? tag.split(':')[0] : tag;
    const rule = TAJWEED_RULES[ruleId];
    const cls = rule ? rule.cls : 'tajweed-default';
    return `<span class="${cls}">${content}</span>`;
  });
}
