# Bethany Beauty

One-page site for a boutique nail studio that works **strictly with Bio Sculpture**.
Plain HTML, compiled Tailwind CSS and one small vanilla-JS file — no framework, no build
step needed to *serve* the site (the compiled CSS is committed).

## Run it locally

```bash
python3 -m http.server 8137 --bind 127.0.0.1
# open http://localhost:8137
```

Or with npm: `npm run serve`.

## Files

| Path | Purpose |
| --- | --- |
| `index.html` | The whole page. |
| `assets/tailwind.css` | Compiled Tailwind output — **generated**, do not edit by hand. |
| `assets/tailwind.src.css` | Tailwind entry point (`@tailwind` directives). |
| `assets/styles.css` | Hand-written CSS: fonts setup, hero image, gold rules, reveal animation. |
| `assets/app.js` | Mobile menu, header state, lightbox (+ focus trap), booking hand-off. |
| `tailwind.config.js` | Brand colours, fonts, shadow and content paths. |
| `images/`, `resources/images/` | Images actually used by the page. |
| `_unused-assets/` | Archived originals (JPEG masters, old badges, loose Instagram exports). Not linked from the page; excluded from git. |

## Rebuilding the CSS

Tailwind is compiled with the CLI, so new utility classes only appear after a rebuild:

```bash
npm install          # once
npm run build:css    # writes assets/tailwind.css (minified)
npm run watch:css    # or rebuild on save while editing
```

`tailwind.config.js` scans `index.html` and `assets/app.js`; if you add a class from JS,
make sure it appears as a complete string there.

## Editing notes

- **Contact details** live in two places: the static `tel:` / `mailto:` / `wa.me` links in
  `index.html` (kept static so no-JS visitors still get them) and the `STUDIO` constant at
  the top of the booking block in `assets/app.js`. Change both together.
- Images are served as WebP (`hero.webp`, etc.). The JPEG masters are in `_unused-assets/`;
  `resources/images/hero.jpg` is kept because it is the CSS fallback and the `og:image`.
- **Logo.** `images/logo.png` (black script) and `images/logo-white.png` (white script) are the
  same brand lockup keyed onto transparency — the header uses the black one, the dark footer the
  white one. Both are ~1.42:1 and trimmed to the ink, so `w-auto` heights drive the size.
  `_unused-assets/` holds the untouched exports from the brand sheet (black, white and gold
  variants) if you ever need to re-key one. The gold keyed version that shipped earlier is
  `_unused-assets/logo-gold-keyed.png`.
- `og:image`, `canonical`, `sitemap.xml` and `robots.txt` assume
  `https://www.bethanybeauty.co.za/`.

## Before publishing

See **`LAUNCH-CHECKLIST.md`** — it lists the content that is still placeholder
(testimonials, Instagram profile, booking backend) and how to finish each item.
