# Jared Alexander Masters — website

A fast, free, self-editable website for Jared (composer / producer / mixer).
Built with [Eleventy](https://www.11ty.dev/), hosted on **GitHub Pages**, edited through
**[Sveltia CMS](https://sveltiacms.app/)** — no Squarespace, no monthly bill.

- **Jared edits content** at `yoursite.com/admin` (friendly forms, no code).
- Every save commits to this repo → GitHub Actions rebuilds → live in ~1 minute.
- Contact form → **Formspree** → Jared's inbox.
- SEO + AI/answer-engine optimization baked in (JSON-LD, Open Graph, sitemap, robots, `llms.txt`).

## How Jared edits the site
1. Go to `https://<your-site>/admin`.
2. Log in with GitHub (one click).
3. Edit **Site settings** (the pitch + links), **Featured work**, **Clients**,
   **Testimonials**, or **Services**. Upload images right in the form.
4. Hit **Publish**. Done — the live site updates itself.

---

## One-time setup (Michael)

### 1. Run it locally
```bash
npm install
npm start          # → http://localhost:8080
```

### 2. Create the GitHub repo + enable Pages
- Push this folder to a new GitHub repo (e.g. `jared-masters-site`).
- Repo **Settings → Pages → Build and deployment → Source: GitHub Actions**.
- The included workflow (`.github/workflows/build.yml`) deploys on every push to `main`.
- The site goes live at `https://<username>.github.io/jared-masters-site/`
  (or `https://<username>.github.io/` if the repo is named `<username>.github.io`).

### 3. Fill in the real values
Search-and-replace `USERNAME` and the placeholder URLs in:
- `src/_data/site.json` → `url`, `formspreeEndpoint`
- `src/static/robots.txt` → sitemap URL
- `admin/config.yml` → `repo` and `base_url`

### 4. Formspree (contact form)
- Create a free form at [formspree.io](https://formspree.io) with Jared's email.
- Paste the form endpoint into `site.json → formspreeEndpoint`.

### 5. CMS login (one-time auth relay)
GitHub Pages has no built-in login, so Sveltia uses a tiny free Cloudflare Worker:
- Deploy **[sveltia-cms-auth](https://github.com/sveltia/sveltia-cms-auth)** (free Cloudflare account).
- Register a **GitHub OAuth app** (callback = your worker URL); put the worker URL in
  `admin/config.yml → base_url`.
- Add Jared as a **collaborator** on the repo so his saves can commit.

### 6. (Later) Custom domain
Point `jaredalexandermasters.com` at GitHub Pages (add a `CNAME` file + DNS records),
then cancel Squarespace.

---

## Hero pitch — pick one (then drop it into `site.json → tagline`)
The old site never said plainly *what Jared does*. Options:

1. **"Original scores and music production for film, brands, and artists."** *(current default)*
2. "Music that makes the picture land. Scores, production, and mixing for film and brands."
3. "From first idea to final mix. Original music for films, commercials, and records."

## Project structure
```
src/
  index.njk            # the page
  _includes/base.njk   # <head>, SEO, JSON-LD
  _data/*.json         # editable content (CMS writes here)
  assets/css/style.css # his fonts + dark cinematic styling
  assets/images/       # logos, photos (old-site assets under from-old-site/)
  static/              # robots.txt, llms.txt → site root
  sitemap.njk          # → /sitemap.xml
admin/                 # Sveltia CMS (the /admin editor)
.github/workflows/     # auto-deploy to GitHub Pages
_scrape-archive/       # everything pulled from the old Squarespace site (reference)
```
