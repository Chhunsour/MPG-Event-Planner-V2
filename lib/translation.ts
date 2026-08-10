import { GoogleAuth } from 'google-auth-library';

const project = process.env.GOOGLE_CLOUD_PROJECT_ID;
const credentials = process.env.GOOGLE_CLOUD_CREDENTIALS_JSON;

async function translateFallback(text: string, target: 'km' | 'zh'): Promise<string> {
  const targetLang = target === 'km' ? 'km' : 'zh-CN';
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Translation service unavailable.');
  const data = (await res.json()) as [Array<[string, string]>] | undefined;
  if (!data || !Array.isArray(data[0])) throw new Error('Invalid translation response.');
  return data[0].map((item) => item[0]).join('');
}

export async function translateWithGoogle(text: string, target: 'km' | 'zh', format: 'text' | 'html') {
  if (!text.trim()) return '';
  const protectedTerm = 'MPG Event Planner';
  const placeholder = 'MPG_EVENT_PLANNER_PROTECTED_TERM';
  const source = text.split(protectedTerm).join(placeholder);

  let translated = '';

  if (project && credentials) {
    try {
      const auth = new GoogleAuth({
        credentials: JSON.parse(credentials),
        scopes: ['https://www.googleapis.com/auth/cloud-translation'],
      });
      const token = await auth.getAccessToken();
      if (token) {
        const response = await fetch(`https://translation.googleapis.com/v3/projects/${project}/locations/global:translateText`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sourceLanguageCode: 'en',
            targetLanguageCode: target === 'km' ? 'km' : 'zh-CN',
            mimeType: format === 'html' ? 'text/html' : 'text/plain',
            contents: [source],
          }),
        });
        if (response.ok) {
          const data = (await response.json()) as { translations?: Array<{ translatedText?: string }> };
          translated = data.translations?.[0]?.translatedText ?? '';
        }
      }
    } catch (err) {
      console.warn('GCP Translation failed, using fallback:', err);
    }
  }

  if (!translated) {
    translated = await translateFallback(source, target);
  }

  return translated.split(placeholder).join(protectedTerm);
}

