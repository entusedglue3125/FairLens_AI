import { useMemo } from 'react';

export default function HighlightedText({ text, biasedTerms, enabled }) {
  const highlighted = useMemo(() => {
    if (!enabled || !biasedTerms || biasedTerms.length === 0) {
      return [{ type: 'text', content: text }];
    }

    // Sort terms longest-first to avoid partial matches overriding longer ones
    const sorted = [...biasedTerms].sort((a, b) => b.length - a.length);
    const escaped = sorted.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    const regex = new RegExp(`(${escaped.join('|')})`, 'gi');

    const parts = [];
    let last = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > last) parts.push({ type: 'text', content: text.slice(last, match.index) });
      parts.push({ type: 'highlight', content: match[0] });
      last = match.index + match[0].length;
    }
    if (last < text.length) parts.push({ type: 'text', content: text.slice(last) });

    return parts;
  }, [text, biasedTerms, enabled]);

  return (
    <p className="highlighted-text">
      {highlighted.map((part, i) =>
        part.type === 'highlight' ? (
          <mark key={i} className="highlight-word" title="Potentially biased term">
            {part.content}
          </mark>
        ) : (
          <span key={i}>{part.content}</span>
        )
      )}
    </p>
  );
}
