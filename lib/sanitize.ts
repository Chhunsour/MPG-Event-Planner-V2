import sanitizeHtml from 'sanitize-html';

export function cleanHtml(value: string) {
  return sanitizeHtml(value, {
    allowedTags: ['p', 'br', 'strong', 'b', 'em', 'i', 'u', 's', 'strike', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'blockquote', 'a', 'img', 'figure', 'figcaption', 'span', 'div'],
    allowedAttributes: {
      a: ['href', 'target', 'rel', 'title'],
      img: ['src', 'alt', 'title', 'width', 'height', 'style', 'class'],
      '*': ['style', 'class'],
    },
    allowedStyles: {
      '*': {
        'width': [/^.*$/],
        'max-width': [/^.*$/],
        'height': [/^.*$/],
        'float': [/^.*$/],
        'margin': [/^.*$/],
        'margin-left': [/^.*$/],
        'margin-right': [/^.*$/],
        'margin-top': [/^.*$/],
        'margin-bottom': [/^.*$/],
        'display': [/^.*$/],
        'text-align': [/^.*$/],
      },
    },
    allowedSchemes: ['http', 'https', 'mailto', 'tel', 'data'],
    transformTags: {
      a: (_tagName, attribs) => ({
        tagName: 'a',
        attribs: { ...attribs, rel: attribs.target === '_blank' ? 'noopener noreferrer' : attribs.rel },
      }),
    },
  });
}

