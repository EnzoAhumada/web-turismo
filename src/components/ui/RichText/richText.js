const ALLOWED = new Set(['p', 'strong', 'em', 'u', 'ul', 'ol', 'li', 'br', 'h3']);
const ALIASES = { b: 'strong', i: 'em', div: 'p' };

function normalizeTag(name) {
  const tag = String(name || '').toLowerCase();
  return ALIASES[tag] || tag;
}

function decodeText(value) {
  return String(value)
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
}

function encodeText(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function parseRichHtml(html) {
  const source = String(html || '').trim();
  if (!source) return [];
  if (!/<[a-z]/i.test(source)) {
    return [{ tag: 'p', children: [{ text: source }] }];
  }

  const root = { tag: 'root', children: [] };
  const stack = [root];
  const tokens = source.split(/(<[^>]+>)/g).filter(Boolean);

  tokens.forEach((token) => {
    if (!token.startsWith('<')) {
      const text = decodeText(token);
      if (text) stack[stack.length - 1].children.push({ text });
      return;
    }

    const closing = token.match(/^<\/([a-z0-9]+)/i);
    if (closing) {
      const tag = normalizeTag(closing[1]);
      const index = stack.findLastIndex((node) => node.tag === tag);
      if (index > 0) stack.splice(index);
      return;
    }

    const opening = token.match(/^<([a-z0-9]+)/i);
    if (!opening) return;
    const tag = normalizeTag(opening[1]);
    if (!ALLOWED.has(tag)) return;

    const node = { tag, children: [] };
    stack[stack.length - 1].children.push(node);
    if (tag !== 'br' && !/\/\s*>$/.test(token)) stack.push(node);
  });

  return root.children;
}

export function appendRichNodes(parent, nodes) {
  nodes.forEach((node) => {
    if (node.text != null) {
      parent.appendChild(document.createTextNode(node.text));
      return;
    }
    const element = document.createElement(node.tag);
    if (node.tag !== 'br') appendRichNodes(element, node.children || []);
    parent.appendChild(element);
  });
}

function serializeNode(node) {
  if (node.nodeType === Node.TEXT_NODE) return encodeText(node.textContent || '');
  if (node.nodeType !== Node.ELEMENT_NODE) return '';

  const tag = normalizeTag(node.tagName);
  if (tag === 'br') return '<br>';

  const inner = Array.from(node.childNodes).map(serializeNode).join('');
  if (!ALLOWED.has(tag)) return inner;
  if (!inner.trim() && tag !== 'br') return '';
  return `<${tag}>${inner}</${tag}>`;
}

export function domToHtml(root) {
  if (!root) return '';
  const html = Array.from(root.childNodes).map(serializeNode).join('').trim();
  return plainTextFromRich(html) ? html : '';
}

export function plainTextFromRich(value) {
  return String(value || '')
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<\/(p|div|li|h3|ul|ol)>/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}
