# Deploying BloomX

Target topology:

| Piece    | Host   | Directory | Public address                     |
| -------- | ------ | --------- | ---------------------------------- |
| Frontend | Vercel | `client`  | `bloomxtechnologies.com`           |
| Backend  | Render | `server`  | `api.bloomxtechnologies.com`       |
| Database | MongoDB Atlas | —  | (private, via connection string)   |

The front end and API are on **different origins**, so CORS on the API and
`connect-src` in the front-end CSP both have to name the other side. Get
those two wrong and the forms fail silently in the browser while the API
looks perfectly healthy in isolation.

---

## 1. Backend on Render (do this first)

The front end needs the API's address at **build** time, so deploy the API
before the site.

### Create the service

Either import `render.yaml` (Dashboard → New → Blueprint), or create a Web
Service by hand with:

| Setting           | Value                |
| ----------------- | -------------------- |
| Root directory    | `server`             |
| Runtime           | Node                 |
| Build command     | `npm ci --omit=dev`  |
| Start command     | `npm start`          |
| Health check path | `/api/health`        |

`--omit=dev` matters: `nodemon` is a dev dependency and carries advisories
that have no business in production.

### Environment variables

| Key                    | Value                                                                             |
| ---------------------- | --------------------------------------------------------------------------------- |
| `NODE_ENV`             | `production`                                                                      |
| `TRUST_PROXY`          | `1`                                                                               |
| `CORS_ALLOWED_ORIGINS` | `https://bloomxtechnologies.com,https://www.bloomxtechnologies.com`               |
| `MONGO_URI`            | your Atlas connection string                                                      |
| `ADMIN_API_KEY`        | a long random secret — `openssl rand -base64 32`                                  |

Do **not** set `PORT`; Render injects it and the server reads it.

**`TRUST_PROXY=1` is not optional.** Render terminates TLS at its edge, so
without it every request looks like it came from the proxy and all visitors
share a single rate-limit bucket — eight form submissions globally per
fifteen minutes. Measured difference: with it, two clients sit at 26 and 28
remaining; without it, 26 then 25 from one shared pool.

**`ADMIN_API_KEY` is not optional either.** It signs the expiring resume
download tokens as well as authenticating admin requests. With it unset the
admin endpoints return 503 by design.

### MongoDB Atlas

Atlas → Network Access must allow Render's egress. Render's free and
starter plans have **no static outbound IPs**, so in practice this means
allowing `0.0.0.0/0`. That makes the database password the only thing
standing between the internet and your data:

- use a long, unique password on a dedicated application user
- give that user access to the `bloomx` database only, not cluster-wide
- rotate it if it has ever been pasted anywhere shared

### Custom domain for the API

Add `api.bloomxtechnologies.com` under the service's Settings → Custom
Domains, then add the CNAME Render shows you at GoDaddy (see §3).

Using your own subdomain rather than `*.onrender.com` means moving hosts
later is a DNS change, not a rebuild of the front end — the API origin is
compiled into the bundle and into the CSP.

---

## 2. Frontend on Vercel

### Project settings

| Setting          | Value           |
| ---------------- | --------------- |
| Root directory   | `client`        |
| Framework preset | Vite            |
| Build command    | `npm run build` |
| Output directory | `dist`          |

`npm run build` runs `prebuild` first, which generates `robots.txt`,
`sitemap.xml` and the security headers in `vercel.json`.

### Environment variables

| Key                  | Value                                   |
| -------------------- | --------------------------------------- |
| `VITE_SITE_URL`      | `https://bloomxtechnologies.com`        |
| `VITE_API_BASE_URL`  | `https://api.bloomxtechnologies.com`    |

> **These are build-time, not runtime.** Vite inlines `VITE_*` values into
> the bundle during the build, and `prebuild` reads them to write the
> sitemap and the CSP `connect-src`. Adding or changing one has no effect
> until you **redeploy**. This is the single most common reason a deploy
> "looks fine" but the contact form is blocked by CSP.

With both set, a production build produces:

```
connect-src 'self' https://api.bloomxtechnologies.com
Sitemap: https://bloomxtechnologies.com/sitemap.xml
```

Verify exactly that after the first deploy.

---

## 3. DNS at GoDaddy

GoDaddy → My Products → the domain → DNS → Manage Zones.

First **delete** what GoDaddy adds by default, or it will fight you:

- the parked `A` record on `@` pointing at GoDaddy's holding page
- the default `CNAME www` → `@`
- any Domain Forwarding set up under the domain settings

Then add, using **the exact values each dashboard shows you** — Vercel has
changed its apex IP before, so do not copy one out of a blog post:

| Type  | Name  | Value                              | Source                     |
| ----- | ----- | ---------------------------------- | -------------------------- |
| A     | `@`   | the IP in Vercel → Domains         | Vercel                     |
| CNAME | `www` | `cname.vercel-dns.com`             | Vercel                     |
| CNAME | `api` | the `*.onrender.com` host Render shows | Render                 |

The apex has to be an `A` record: GoDaddy does not flatten `CNAME` at the
zone root.

In Vercel, add both `bloomxtechnologies.com` and
`www.bloomxtechnologies.com`, then set one as primary and let Vercel
redirect the other. Pick the apex to match `VITE_SITE_URL` and the canonical
tags the site already emits.

Propagation is usually minutes, occasionally hours. Certificates are issued
automatically by both hosts once DNS resolves.

---

## 4. Verify after deploying

```bash
# API reachable and healthy
curl -s https://api.bloomxtechnologies.com/api/health

# Security headers present, framework hidden
curl -sI https://api.bloomxtechnologies.com/api/health | grep -iE 'x-content-type|x-frame|referrer|powered'

# CORS accepts the site and refuses anything else
curl -si -X OPTIONS https://api.bloomxtechnologies.com/api/enquiry \
  -H 'Origin: https://bloomxtechnologies.com' \
  -H 'Access-Control-Request-Method: POST' | grep -i access-control-allow-origin

curl -si -X OPTIONS https://api.bloomxtechnologies.com/api/enquiry \
  -H 'Origin: https://evil.example' \
  -H 'Access-Control-Request-Method: POST' | grep -i access-control-allow-origin   # expect nothing

# Front-end CSP names the API
curl -sI https://bloomxtechnologies.com | grep -i content-security-policy

# SEO files resolve
curl -s https://bloomxtechnologies.com/robots.txt
curl -s https://bloomxtechnologies.com/sitemap.xml | head -5
```

Then, in a browser, submit the contact form once and confirm it appears:

```bash
curl -s -H "x-admin-key: $ADMIN_API_KEY" \
  'https://api.bloomxtechnologies.com/api/admin/submissions?type=enquiry&limit=5'
```

Keep the devtools console open while submitting — a CSP or CORS failure
shows up there and nowhere else.

---

## 5. Things to know before you rely on this

**Render's free plan sleeps.** After ~15 minutes idle the service stops, and
the next request pays a cold start of roughly 50 seconds. The contact and
careers pages now ping `/api/health` on mount, so the service wakes while
the visitor is filling the form in and the submit usually lands warm. That
narrows the window but does not close it: a visitor who opens the contact
page and submits within a few seconds, on a cold service, still waits. If
enquiries matter commercially, the paid instance type removes this entirely
and is the single highest-value upgrade here.

**Nothing emails you when an enquiry arrives.** Submissions are written to
MongoDB and that is all. Until a notification is wired up, enquiries are
only visible by querying `/api/admin/submissions`. This is the most likely
way to lose real business — worth addressing early.

**Rotate `ADMIN_API_KEY` if it has ever been shared.** It is both the admin
credential and the signing key for resume download links.

**`client/.env` and `server/.env` are gitignored** and deliberately not
deployed. Everything the hosts need is in their dashboards.
