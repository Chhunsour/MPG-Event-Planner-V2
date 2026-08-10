import { GoogleAuth } from 'google-auth-library';

const project = process.env.GOOGLE_CLOUD_PROJECT_ID;
const credentials = process.env.GOOGLE_CLOUD_CREDENTIALS_JSON;

export async function translateWithGoogle(text: string, target: 'km' | 'zh', format: 'text' | 'html') {
  if (!project || !credentials) throw new Error('Google Cloud Translation is not configured.');
  const auth = new GoogleAuth({ credentials: JSON.parse(credentials), scopes: ['https://www.googleapis.com/auth/cloud-translation'] });
  const token = await auth.getAccessToken();
  if (!token) throw new Error('Could not authenticate with Google Cloud Translation.');
  const protectedTerm = 'MPG Event Planner';
  const placeholder = 'MPG_EVENT_PLANNER_PROTECTED_TERM';
  const source = text.split(protectedTerm).join(placeholder);
  const response = await fetch('https://translation.googleapis.com/v3/projects/' + project + '/locations/global:translateText', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
    body: JSON.stringify({ sourceLanguageCode: 'en', targetLanguageCode: target === 'km' ? 'km' : 'zh-CN', mimeType: format === 'html' ? 'text/html' : 'text/plain', contents: [source] }),
  });
  if (!response.ok) throw new Error('Google Cloud Translation failed.');
  const data = await response.json() as { translations?: Array<{ translatedText?: string }> };
  return (data.translations?.[0]?.translatedText ?? '').split(placeholder).join(protectedTerm);
}
