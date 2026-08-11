import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('🔍 Running Production SEO, GEO & AEO Health Audit...\n');

let errors = 0;
let warnings = 0;
let checksPassed = 0;

function pass(msg) {
  checksPassed++;
  console.log(`  ✓ PASS: ${msg}`);
}

function fail(msg) {
  errors++;
  console.log(`  ❌ FAIL: ${msg}`);
}

function warn(msg) {
  warnings++;
  console.log(`  ⚠️ WARN: ${msg}`);
}

// 1. Verify lib/seo.ts exist
const seoLibPath = path.join(rootDir, 'lib', 'seo.ts');
if (fs.existsSync(seoLibPath)) {
  pass('Centralized SEO & Metadata helper (lib/seo.ts) exists');
} else {
  fail('Missing lib/seo.ts');
}

// 2. Verify robots.ts & sitemap.ts
const robotsPath = path.join(rootDir, 'app', 'robots.ts');
const sitemapPath = path.join(rootDir, 'app', 'sitemap.ts');

if (fs.existsSync(robotsPath)) {
  const content = fs.readFileSync(robotsPath, 'utf8');
  if (content.includes("disallow: ['/admin/'") || content.includes("disallow: '/admin/'")) {
    pass('robots.ts disallows /admin/ correctly');
  } else {
    fail('robots.ts does not disallow /admin/');
  }
} else {
  fail('Missing app/robots.ts');
}

if (fs.existsSync(sitemapPath)) {
  const content = fs.readFileSync(sitemapPath, 'utf8');
  if (content.includes('getPublicContent') && content.includes('sitemap')) {
    pass('sitemap.ts dynamically includes published Supabase content');
  } else {
    fail('sitemap.ts missing dynamic Supabase fetch');
  }
} else {
  fail('Missing app/sitemap.ts');
}

// 3. Verify Admin Noindex Layout
const adminLayoutPath = path.join(rootDir, 'app', 'admin', 'layout.tsx');
if (fs.existsSync(adminLayoutPath)) {
  const content = fs.readFileSync(adminLayoutPath, 'utf8');
  if (content.includes('index: false') && content.includes('follow: false')) {
    pass('app/admin/layout.tsx explicitly sets noindex, nofollow for all admin routes');
  } else {
    fail('app/admin/layout.tsx missing noindex, nofollow metadata');
  }
} else {
  fail('Missing app/admin/layout.tsx');
}

// 4. Verify JSON-LD Schema Components
const jsonLdPath = path.join(rootDir, 'components', 'seo', 'json-ld.tsx');
if (fs.existsSync(jsonLdPath)) {
  const content = fs.readFileSync(jsonLdPath, 'utf8');
  const schemas = ['OrganizationJsonLd', 'WebSiteJsonLd', 'BreadcrumbsJsonLd', 'ServiceJsonLd', 'ProjectJsonLd', 'ArticleJsonLd', 'FaqJsonLd'];
  const missing = schemas.filter((s) => !content.includes(s));
  if (missing.length === 0) {
    pass('All 7 JSON-LD structured data components implemented');
  } else {
    fail(`Missing JSON-LD schema components: ${missing.join(', ')}`);
  }
} else {
  fail('Missing components/seo/json-ld.tsx');
}

// 5. Verify Public Page generateMetadata implementation
const publicPagePaths = [
  'app/[locale]/page.tsx',
  'app/[locale]/about/page.tsx',
  'app/[locale]/services/page.tsx',
  'app/[locale]/services/[slug]/page.tsx',
  'app/[locale]/projects/page.tsx',
  'app/[locale]/projects/[slug]/page.tsx',
  'app/[locale]/blog/page.tsx',
  'app/[locale]/blog/[slug]/page.tsx',
  'app/[locale]/contact/page.tsx',
  'app/[locale]/privacy/page.tsx',
];

publicPagePaths.forEach((relPath) => {
  const fullPath = path.join(rootDir, relPath);
  if (fs.existsSync(fullPath)) {
    const content = fs.readFileSync(fullPath, 'utf8');
    if (content.includes('generateMetadata')) {
      pass(`Metadata configured on ${relPath}`);
    } else {
      fail(`Missing generateMetadata on ${relPath}`);
    }
  } else {
    fail(`Missing public page file ${relPath}`);
  }
});

// Summary
console.log('\n--------------------------------------------------');
console.log(`📊 Audit Results: ${checksPassed} Checks Passed | ${errors} Errors | ${warnings} Warnings`);
console.log('--------------------------------------------------\n');

if (errors > 0) {
  process.exit(1);
} else {
  console.log('✨ All SEO, GEO & AEO Health Checks Passed Successfully!\n');
}
