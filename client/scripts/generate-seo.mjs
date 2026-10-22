/**
 * Generates robots.txt and sitemap.xml into public/ before the Vite build.
 *
 * The sitemap protocol requires absolute URLs in <loc>, and robots.txt
 * requires an absolute Sitemap: line — relative paths are rejected by
 * crawlers. That means the canonical origin has to come from configuration;
 * it cannot be inferred at build time.
 *
 * Set VITE_SITE_URL (e.g. https://bloomxtechnologies.com) in the Vercel
 * project settings — or in client/.env for local builds. Without it this
 * writes a permissive robots.txt and skips the sitemap entirely, rather
 * than shipping an invalid one that crawlers will reject.
 */
import { writeFileSync, readFileSync, rmSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const publicDir = resolve(here, '..', 'public');

const ROUTES = [
  { path: '/', priority: '1.0', changefreq: 'monthly' },
  { path: '/services', priority: '0.9', changefreq: 'monthly' },
  { path: '/work', priority: '0.8', changefreq: 'monthly' },
  { path: '/contact', priority: '0.7', changefreq: 'yearly' },
  { path: '/careers', priority: '0.6', changefreq: 'weekly' }
];

const raw = (process.env.VITE_SITE_URL || '').trim().replace(/\/+$/, '');

let origin = '';
if (raw) {
  try {
    const parsed = new URL(raw);
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') throw new Error('bad protocol');
    origin = `${parsed.protocol}//${parsed.host}`;
  } catch {
    console.warn(`[seo] VITE_SITE_URL is not a valid URL: "${raw}" — skipping sitemap.`);
  }
}

const sitemapPath = resolve(publicDir, 'sitemap.xml');

if (origin) {
  const today = new Date().toISOString().slice(0, 10);
  const urls = ROUTES.map(
    (r) =>
      `  <url>\n    <loc>${origin}${r.path}</loc>\n` +
      `    <lastmod>${today}</lastmod>\n` +
      `    <changefreq>${r.changefreq}</changefreq>\n` +
      `    <priority>${r.priority}</priority>\n  </url>`
  ).join('\n');

  writeFileSync(
    sitemapPath,
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
      `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
  );

  writeFileSync(
    resolve(publicDir, 'robots.txt'),
    `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`
  );

  console.log(`[seo] wrote sitemap.xml and robots.txt for ${origin}`);
} else {
  if (existsSync(sitemapPath)) rmSync(sitemapPath);
  writeFileSync(resolve(publicDir, 'robots.txt'), 'User-agent: *\nAllow: /\n');
  console.warn(
    '[seo] VITE_SITE_URL not set — wrote robots.txt without a Sitemap line and skipped sitemap.xml.\n' +
      '      Set VITE_SITE_URL to the canonical origin to publish a sitemap.'
  );
}

/* -------------------------------------------------------------------------
   Content-Security-Policy — VERIFY, never write
   -------------------------------------------------------------------------
   Vercel parses vercel.json from the source tree *before* it runs the
   build, so rewriting the file here does nothing: the headers Vercel
   serves are whatever is committed. The policy therefore lives in
   vercel.json under version control, and this step's only job is to fail
   the build if that committed policy has gone stale — a changed inline
   script, or an API origin that no longer matches VITE_API_BASE_URL.

   Getting this wrong is silent and total: the site loads perfectly and
   every API call is blocked before it leaves the browser, so nothing even
   appears in the network tab.
   ------------------------------------------------------------------------- */

const indexHtml = readFileSync(resolve(here, '..', 'index.html'), 'utf8');
const inlineScripts = [...indexHtml.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)].map(
  (m) => m[1]
);
const expectedHashes = inlineScripts.map(
  (body) => `'sha256-${createHash('sha256').update(body, 'utf8').digest('base64')}'`
);

const vercelPath = resolve(here, '..', 'vercel.json');
const vercelConfig = JSON.parse(readFileSync(vercelPath, 'utf8'));
const cspHeader = vercelConfig.headers?.[0]?.headers?.find(
  (h) => h.key === 'Content-Security-Policy'
)?.value;

const problems = [];

if (!cspHeader) {
  problems.push('vercel.json has no Content-Security-Policy header.');
} else {
  for (const hash of expectedHashes) {
    if (!cspHeader.includes(hash)) {
      problems.push(
        `script-src is missing the hash for an inline script in index.html.\n` +
          `      expected: ${hash}\n` +
          `      Add it to script-src in vercel.json.`
      );
    }
  }

  const apiBase = (process.env.VITE_API_BASE_URL || '').trim().replace(/\/+$/, '');
  if (apiBase) {
    const apiOrigin = new URL(apiBase).origin;
    if (!cspHeader.includes(apiOrigin)) {
      problems.push(
        `connect-src does not allow ${apiOrigin}, so every API call will be\n` +
          `      blocked by the browser. Add it to connect-src in vercel.json.`
      );
    }
  }
}

if (problems.length) {
  console.error('\n[csp] vercel.json is out of date:\n');
  problems.forEach((p) => console.error(`  - ${p}`));
  console.error('');
  process.exit(1);
}

console.log(
  `[csp] vercel.json verified (${expectedHashes.length} inline script hash(es), connect-src checked)`
);
