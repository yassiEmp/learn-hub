import React from 'react';

/**
 * Minimal, safe Markdown renderer for AI-generated lesson text: headings,
 * bullet / numbered lists, block quotes, fenced code, paragraphs and inline
 * **bold**, *italic* and `code`. Never injects HTML.
 */

function renderInline(text: string, keyPrefix: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  const re = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*\s][^*]*\*|_[^_\s][^_]*_)/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let i = 0;
  while ((match = re.exec(text))) {
    if (match.index > last) nodes.push(text.slice(last, match.index));
    const token = match[0];
    const key = `${keyPrefix}-${i++}`;
    if (token.startsWith('**')) nodes.push(<strong key={key} className="text-white font-semibold">{token.slice(2, -2)}</strong>);
    else if (token.startsWith('`'))
      nodes.push(
        <code key={key} className="text-cyan-300 bg-white/10 px-1.5 py-0.5 rounded border border-white/10 text-[0.9em]">
          {token.slice(1, -1)}
        </code>
      );
    else nodes.push(<em key={key}>{token.slice(1, -1)}</em>);
    last = match.index + token.length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

type Block =
  | { kind: 'h'; level: number; text: string }
  | { kind: 'ul' | 'ol'; items: string[] }
  | { kind: 'quote'; text: string }
  | { kind: 'code'; text: string }
  | { kind: 'p'; text: string };

function parse(markdown: string): Block[] {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const blocks: Block[] = [];
  let para: string[] = [];
  const flush = () => {
    if (para.length) blocks.push({ kind: 'p', text: para.join(' ') });
    para = [];
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed.startsWith('```')) {
      flush();
      const code: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) code.push(lines[i++]);
      blocks.push({ kind: 'code', text: code.join('\n') });
      continue;
    }
    if (!trimmed) {
      flush();
      continue;
    }
    const heading = /^(#{1,6})\s+(.*)$/.exec(trimmed);
    if (heading) {
      flush();
      blocks.push({ kind: 'h', level: heading[1].length, text: heading[2] });
      continue;
    }
    const bullet = /^[-*•]\s+(.*)$/.exec(trimmed);
    const numbered = /^\d+[.)]\s+(.*)$/.exec(trimmed);
    if (bullet || numbered) {
      flush();
      const kind = bullet ? 'ul' : 'ol';
      const prev = blocks[blocks.length - 1];
      const item = (bullet ?? numbered)![1];
      if (prev && prev.kind === kind) prev.items.push(item);
      else blocks.push({ kind, items: [item] });
      continue;
    }
    if (trimmed.startsWith('>')) {
      flush();
      blocks.push({ kind: 'quote', text: trimmed.replace(/^>\s?/, '') });
      continue;
    }
    para.push(trimmed);
  }
  flush();
  return blocks;
}

export const LessonContent: React.FC<{ markdown: string }> = ({ markdown }) => {
  const blocks = parse(markdown);
  return (
    <div className="space-y-4 font-geist-mono text-white/85 leading-relaxed text-[15px] sm:text-base">
      {blocks.map((b, i) => {
        const key = `b${i}`;
        switch (b.kind) {
          case 'h': {
            const cls =
              b.level <= 2
                ? 'text-xl sm:text-2xl font-syne font-medium text-white pt-4'
                : 'text-lg font-syne font-medium text-white pt-2';
            return b.level <= 2 ? (
              <h2 key={key} className={cls}>{renderInline(b.text, key)}</h2>
            ) : (
              <h3 key={key} className={cls}>{renderInline(b.text, key)}</h3>
            );
          }
          case 'ul':
            return (
              <ul key={key} className="list-disc pl-6 space-y-1.5 marker:text-white/40">
                {b.items.map((item, j) => <li key={j}>{renderInline(item, `${key}-${j}`)}</li>)}
              </ul>
            );
          case 'ol':
            return (
              <ol key={key} className="list-decimal pl-6 space-y-1.5 marker:text-white/40">
                {b.items.map((item, j) => <li key={j}>{renderInline(item, `${key}-${j}`)}</li>)}
              </ol>
            );
          case 'quote':
            return (
              <blockquote key={key} className="border-l-4 border-blue-400 bg-blue-400/5 pl-4 py-2 rounded-r-lg">
                {renderInline(b.text, key)}
              </blockquote>
            );
          case 'code':
            return (
              <pre key={key} className="bg-black/40 border border-white/10 rounded-xl p-4 overflow-x-auto text-sm text-cyan-200">
                <code>{b.text}</code>
              </pre>
            );
          default:
            return <p key={key}>{renderInline(b.text, key)}</p>;
        }
      })}
    </div>
  );
};
