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
   Content-Security-Policy
   -------------------------------------------------------------------------
   index.html carries one inline <script> (the hero image preload). Rather
   than weaken the policy with 'unsafe-inline', its SHA-256 is computed here
   and written into vercel.json, so the policy stays strict and can never
   drift out of sync with the file: this runs on every build.
   ------------------------------------------------------------------------- */

const indexHtml = readFileSync(resolve(here, '..', 'index.html'), 'utf8');
const inlineScripts = [...indexHtml.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)].map(
  (m) => m[1]
);
const scriptHashes = inlineScripts.map(
  (body) => `'sha256-${createHash('sha256').update(body, 'utf8').digest('base64')}'`
);

const csp = [
  "default-src 'self'",
  `script-src 'self' ${scriptHashes.join(' ')}`.trim(),
  // Google Fonts ships its CSS from a stylesheet link, which needs the host
  // allowed; 'unsafe-inline' covers the style attributes Framer Motion sets
  // on elements as it animates them.
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data: https://images.unsplash.com",
  // Where the browser may send form submissions / XHR. Add the API origin
  // here if it is ever hosted somewhere other than this site.
  `connect-src 'self'${process.env.VITE_API_BASE_URL ? ' ' + new URL(process.env.VITE_API_BASE_URL).origin : ''}`,
  "form-action 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "object-src 'none'",
  'upgrade-insecure-requests'
].join('; ');

const SECURITY_HEADERS = [
  { key: 'Content-Security-Policy', value: csp },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Permissions-Policy', value: 'geolocation=(), microphone=(), camera=(), interest-cohort=()' },
  { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' }
];

const vercelPath = resolve(here, '..', 'vercel.json');
const vercelConfig = JSON.parse(readFileSync(vercelPath, 'utf8'));
vercelConfig.headers = [{ source: '/(.*)', headers: SECURITY_HEADERS }];
writeFileSync(vercelPath, `${JSON.stringify(vercelConfig, null, 2)}\n`);

console.log(
  `[seo] wrote security headers to vercel.json (${scriptHashes.length} inline script hash(es) in CSP)`
);
