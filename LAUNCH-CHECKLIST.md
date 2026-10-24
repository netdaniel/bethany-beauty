# Launch checklist — Bethany Beauty

Everything below is either a placeholder that must be replaced, or a step that can only be
done with the real business details. Nothing here is a code bug.

## 1. Content that is still sample text

- **Testimonials** (`<section id="reviews">` in `index.html`) — the three quotes and the
  names *Sarah M.*, *Thandi K.* and *Lerato D.* are written examples, not real reviews.
  Replace each quote with a real one (with permission), or delete the cards and remove the
  **Reviews** item from the desktop and mobile navigation.
- **Instagram** — the gallery tile links to the bare `https://www.instagram.com/` and the
  label reads `@bethanybeauty`. Point both at the real profile, then add the same URL to the
  JSON-LD block in `<head>` as `"sameAs": ["https://www.instagram.com/<handle>/"]`.
  If there is no profile, replace the tile with a link to `#book` instead.
- **Time slots** — the booking form offers ranges (Morning / Midday / Afternoon). Swap these
  for the studio's real appointment windows once they are fixed.
- **Prices and durations** — service cards deliberately say pricing is confirmed at
  consultation (only the "art / French / chrome from R80" figure is stated). Add per-card
  prices and durations if they should be public.

## 2. Business details

- **Address / city** — the JSON-LD `PostalAddress` only carries `addressCountry: "ZA"`
  (the page promises the address is shared after confirmation). If the city or suburb may be
  public, add `addressLocality` / `addressRegion`, and create a Google Business Profile so the
  map pack can show the studio.
- **Domain** — `https://www.bethanybeauty.co.za/` is assumed in `canonical`, the `og:` /
  `twitter:` tags, the JSON-LD `url`/`image`/`logo`, `sitemap.xml` and `robots.txt`.
  Search-and-replace the domain if the live one differs.

## 3. Booking backend

The form still posts nowhere (`action="#"`) and is handed to WhatsApp by `assets/app.js`
(`showStatus()` also gives a copy-message and phone/email fallback if the popup is blocked).
To collect requests properly:

1. Create a Formspree (or Netlify Forms) endpoint.
2. Set `action="https://formspree.io/f/xxxx"` and `method="post"` on `#booking-form`.
3. The submit handler detects a non-`#` action and steps aside, so the browser posts normally.
4. Once the backend works without JavaScript, replace the `<noscript>` note in the booking
   panel with a plain confirmation message.

## 4. Deploy

- Do **not** upload `node_modules/` or `_unused-assets/` (both are git-ignored).
- Upload: `index.html`, `assets/`, `images/`, `resources/images/`, `site.webmanifest`,
  `robots.txt`, `sitemap.xml`, `favicon`.
- Run `npm run build:css` one last time before uploading — `assets/tailwind.css` is generated
  and does not update itself.
- Serve over HTTPS so the manifest, clipboard "copy message" button and `wa.me` links all
  behave as expected.

## 5. After publishing

- Submit `sitemap.xml` in Google Search Console; check the JSON-LD in the Rich Results Test.
- Run Lighthouse on mobile: check LCP (hero), CLS (fixed image dimensions) and Best Practices.
- Send one real test booking and confirm the WhatsApp message reads correctly.
