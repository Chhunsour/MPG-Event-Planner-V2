import sanitizeHtml from 'sanitize-html';

export function cleanHtml(value: string) {
  return sanitizeHtml(value, {
    allowedTags: ['p', 'br', 'strong', 'em', 'ul', 'ol', 'li', 'h2', 'h3', 'h4', 'blockquote', 'a', 'img'],
    allowedAttributes: {
      a: ['href', 'target', 'rel'],
      img: ['src', 'alt', 'width', 'height'],
    },
    allowedSchemes: ['http', 'https', 'mailto', 'tel'],
    transformTags: {
      a: (_tagName, attribs) => ({
        tagName: 'a',
        attribs: { ...attribs, rel: attribs.target === '_blank' ? 'noopener noreferrer' : attribs.rel },
      }),
    },
  });
}

