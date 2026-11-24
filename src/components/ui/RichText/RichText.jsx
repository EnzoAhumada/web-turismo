import { parseRichHtml } from './richText';

function renderNodes(nodes, keyPrefix) {
  return nodes.map((node, index) => {
    const key = `${keyPrefix}-${index}`;
    if (node.text != null) return node.text;
    if (node.tag === 'br') return <br key={key} />;
    const children = renderNodes(node.children || [], key);
    if (node.tag === 'p') return <p key={key}>{children}</p>;
    if (node.tag === 'strong') return <strong key={key}>{children}</strong>;
    if (node.tag === 'em') return <em key={key}>{children}</em>;
    if (node.tag === 'u') return <u key={key}>{children}</u>;
    if (node.tag === 'ul') return <ul key={key}>{children}</ul>;
    if (node.tag === 'ol') return <ol key={key}>{children}</ol>;
    if (node.tag === 'li') return <li key={key}>{children}</li>;
    if (node.tag === 'h3') return <h3 key={key}>{children}</h3>;
    return <span key={key}>{children}</span>;
  });
}

export default function RichText({ value, className = '' }) {
  const nodes = parseRichHtml(value);
  if (!nodes.length) return null;
  return <div className={`rich-text ${className}`.trim()}>{renderNodes(nodes, 'rt')}</div>;
}
